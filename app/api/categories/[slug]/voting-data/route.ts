import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { Vote } from '@/lib/types/database'


// Optimized endpoint that fetches all voting data in ONE query
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // Get user first
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use optimized PostgreSQL function if available
    const { data, error } = await supabase.rpc('get_optimized_voting_data', {
      user_id_param: user.id,
      current_slug_param: slug
    })

    if (error) {
      console.error('Error fetching optimized voting data:', error)
      
      // Fallback to manual queries if function doesn't exist
      return await fallbackVotingData(supabase, user.id, slug)
    }

    // Parse the JSON result from the PostgreSQL function
    const result = typeof data === 'string' ? JSON.parse(data) : data
    return NextResponse.json(result)

  } catch (error) {
    console.error('Unexpected error in voting data fetch:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Fallback method using optimized manual queries
async function fallbackVotingData(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, currentSlug: string) {
  try {
    // Execute all queries in parallel with minimal data
    const [categoriesResult, userDataResult] = await Promise.all([
      // Get all categories and nominees in one query
      supabase
        .from('categories')
        .select(`
          id,
          slug,
          name,
          description,
          display_order,
          nominees:nominees(
            id,
            name,
            description,
            image_url,
            display_order
          )
        `)
        .eq('is_active', true)
        .order('display_order')
        .order('display_order', { referencedTable: 'nominees' }),

      // Get user votes in one query using joins
      supabase
        .from('votes')
        .select(`
          id,
          category_id,
          nominee_id,
          is_final,
          created_at,
          categories!inner(slug)
        `)
        .eq('user_id', userId)
    ])

    if (categoriesResult.error) {
      throw categoriesResult.error
    }

    // Get ballot separately (small query)
    const { data: ballot } = await supabase
      .from('ballots')
      .select('id, is_final, submitted_at')
      .eq('user_id', userId)
      .maybeSingle()

    const categories = categoriesResult.data || []
    const userVotes = userDataResult.data || []

    // Find current category
    const currentCategory = categories.find(cat => cat.slug === currentSlug)
    const currentIndex = categories.findIndex(cat => cat.slug === currentSlug)

    // Find current vote
    const currentVoteData = currentCategory
      ? userVotes.find(vote => vote.category_id === currentCategory.id)
      : null
    
    const currentVote = currentVoteData ? {
      id: currentVoteData.id,
      user_id: userId,
      category_id: currentVoteData.category_id,
      nominee_id: currentVoteData.nominee_id,
      is_final: currentVoteData.is_final,
      created_at: currentVoteData.created_at,
      updated_at: currentVoteData.created_at, // Use created_at as fallback for updated_at
    } : null

    // Create a map of user votes by category for quick lookup
    const votesMap = userVotes.reduce((acc, vote) => {
      acc[vote.category_id] = {
        id: vote.id,
        user_id: userId,
        category_id: vote.category_id,
        nominee_id: vote.nominee_id,
        is_final: vote.is_final,
        created_at: vote.created_at,
        updated_at: vote.created_at, // Use created_at as fallback for updated_at
      }
      return acc
    }, {} as Record<string, Vote>)

    return NextResponse.json({
      categories: categories.map(cat => ({
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        display_order: cat.display_order,
        nominees: cat.nominees,
        hasVote: !!votesMap[cat.id]
      })),
      currentCategory,
      currentIndex,
      ballot: ballot || null,
      currentVote: currentVote || null,
      userVotes: votesMap,
      _meta: {
        user_id: userId,
        fetched_at: new Date().toISOString(),
        cache_key: `voting-optimized-${currentSlug}-${userId}`,
        fallback: true,
        optimized: true
      }
    })

  } catch (error) {
    console.error('Fallback query failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voting data' },
      { status: 500 }
    )
  }
}
