import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Combined API endpoint that fetches all voting data in one request
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

    // First get the category to get its ID for the vote query
    const categoryResult = await supabase
      .from('categories')
      .select(`
        id,
        slug,
        name,
        description,
        voting_start,
        voting_end,
        display_order,
        nominees (
          id,
          name,
          description,
          image_url
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (categoryResult.error) {
      if (categoryResult.error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching category:', categoryResult.error)
      return NextResponse.json(
        { error: 'Failed to fetch category data' },
        { status: 500 }
      )
    }

    // Now run the remaining queries in parallel
    const [
      allCategoriesResult,
      ballotResult,
      userVoteResult
    ] = await Promise.all([
      // Get all categories for navigation - minimal data only
      supabase
        .from('categories')
        .select('id, slug, name, display_order')
        .eq('is_active', true)
        .order('display_order'),

      // Get user's ballot status - only what we need
      supabase
        .from('ballots')
        .select('id, is_final, submitted_at')
        .eq('user_id', user.id)
        .maybeSingle(),

      // Get user's vote for this category - now we have the category ID
      supabase
        .from('votes')
        .select('id, nominee_id, is_final, created_at')
        .eq('user_id', user.id)
        .eq('category_id', categoryResult.data.id)
        .maybeSingle()
    ])

    // Check for errors from the parallel queries
    if (allCategoriesResult.error) {
      console.error('Error fetching categories:', allCategoriesResult.error)
      return NextResponse.json(
        { error: 'Failed to fetch navigation data' },
        { status: 500 }
      )
    }

    // Find current category index
    const currentIndex = allCategoriesResult.data?.findIndex(
      cat => cat.slug === slug
    ) ?? 0

    return NextResponse.json({
      category: categoryResult.data,
      allCategories: allCategoriesResult.data || [],
      currentIndex,
      ballot: ballotResult.data || null,
      currentVote: userVoteResult.data || null,
      // Add some metadata for debugging
      _meta: {
        user_id: user.id,
        fetched_at: new Date().toISOString(),
        cache_key: `voting-${slug}-${user.id}`
      }
    })

  } catch (error) {
    console.error('Unexpected error in voting data fetch:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
