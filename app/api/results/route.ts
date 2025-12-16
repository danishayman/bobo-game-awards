import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface VoteResult {
  category_id: string
  category_name: string
  category_slug: string
  nominee_id: string
  nominee_name: string
  nominee_image_url?: string
  nominee_description?: string
  vote_count: number
}

interface GroupedCategory {
  category_id: string
  category_name: string
  category_slug: string
  nominees: Array<{
    nominee_id: string
    nominee_name: string
    nominee_image_url?: string
    nominee_description?: string
    vote_count: number
  }>
}

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

    // Get vote results using database function
    const { data, error } = await supabase
      .rpc('get_vote_results', { p_category_slug: categorySlug })

    if (error) {
      console.error('Error fetching results:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: 'Failed to fetch results', details: error.message || JSON.stringify(error) },
        { status: 500 }
      )
    }

    if (!data) {
      console.error('No data returned from get_vote_results')
      return NextResponse.json(
        { error: 'No data returned' },
        { status: 500 }
      )
    }

    // Group results by category
    const groupedResults = data.reduce((acc: Record<string, GroupedCategory>, result: VoteResult) => {
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
