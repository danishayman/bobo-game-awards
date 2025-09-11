import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')

    // Check if user is admin or if voting has ended for public access
    const { data: { user } } = await supabase.auth.getUser()
    let isAdmin = false

    if (user) {
      const { data: appUser } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      
      isAdmin = appUser?.is_admin || false
    }

    // If not admin, check if voting has ended for the requested categories
    if (!isAdmin) {
      let votingEndedQuery = supabase
        .from('categories')
        .select('slug, voting_end')
        .eq('is_active', true)

      if (categorySlug) {
        votingEndedQuery = votingEndedQuery.eq('slug', categorySlug)
      }

      const { data: categories } = await votingEndedQuery

      const now = new Date()
      const hasEndedCategories = categories?.filter(cat => 
        !cat.voting_end || new Date(cat.voting_end) < now
      )

      if (!hasEndedCategories || hasEndedCategories.length === 0) {
        return NextResponse.json(
          { error: 'Results not yet available' },
          { status: 403 }
        )
      }
    }

    // Get vote results - try database function first, fallback to manual query
    let { data, error } = await supabase
      .rpc('get_vote_results', { category_slug: categorySlug })

    // If function doesn't exist, use manual query as fallback
    if (error && error.message?.includes('Could not find the function')) {
      console.log('Database function not found, using fallback query')
      
      // Manual query to get results
      let query = supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          nominees:nominees(
            id,
            name
          )
        `)
        .eq('is_active', true)

      if (categorySlug) {
        query = query.eq('slug', categorySlug)
      }

      const { data: categoriesData, error: categoriesError } = await query

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError)
        return NextResponse.json(
          { error: 'Failed to fetch results', details: categoriesError.message },
          { status: 500 }
        )
      }

      // Get vote counts separately for better performance and accuracy
      const { data: voteData, error: voteError } = await supabase
        .from('votes')
        .select('nominee_id')
        .eq('is_final', true)

      const voteCounts: Record<string, number> = {}
      voteData?.forEach(vote => {
        voteCounts[vote.nominee_id] = (voteCounts[vote.nominee_id] || 0) + 1
      })

      // Transform data to match expected format
      data = []
      categoriesData?.forEach(category => {
        category.nominees?.forEach(nominee => {
          data.push({
            category_id: category.id,
            category_name: category.name,
            category_slug: category.slug,
            nominee_id: nominee.id,
            nominee_name: nominee.name,
            vote_count: voteCounts[nominee.id] || 0
          })
        })
      })

      error = null
    }

    if (error) {
      console.error('Error fetching results:', error)
      return NextResponse.json(
        { error: 'Failed to fetch results', details: error.message || error },
        { status: 500 }
      )
    }

    // Group results by category
    const groupedResults = data.reduce((acc: any, result: any) => {
      if (!acc[result.category_id]) {
        acc[result.category_id] = {
          category_id: result.category_id,
          category_name: result.category_name,
          category_slug: result.category_slug,
          nominees: []
        }
      }
      
      if (result.nominee_id) {
        acc[result.category_id].nominees.push({
          nominee_id: result.nominee_id,
          nominee_name: result.nominee_name,
          vote_count: result.vote_count
        })
      }
      
      return acc
    }, {})

    const results = Object.values(groupedResults)

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
