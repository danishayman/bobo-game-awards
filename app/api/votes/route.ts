import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateVotingPeriod } from '@/lib/utils/voting-protection'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')

    let query = supabase
      .from('votes')
      .select(`
        *,
        categories (name, slug),
        nominees (name, image_url)
      `)
      .eq('user_id', user.id)

    if (categorySlug) {
      query = query.eq('categories.slug', categorySlug)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching votes:', error)
      return NextResponse.json(
        { error: 'Failed to fetch votes' },
        { status: 500 }
      )
    }

    return NextResponse.json({ votes: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { category_id, nominee_id, is_admin } = body

    // Validate required fields
    if (!category_id || !nominee_id) {
      return NextResponse.json(
        { error: 'Missing required fields: category_id and nominee_id are required' },
        { status: 400 }
      )
    }

    // Check global voting deadline and voting lock (with admin bypass from client)
    const votingValidation = validateVotingPeriod(is_admin || false);
    if (!votingValidation.isActive) {
      return votingValidation.response!;
    }

    // Use optimized PostgreSQL function for validation and vote submission
    const { data, error } = await supabase.rpc('submit_vote_optimized', {
      user_id_param: user.id,
      category_id_param: category_id,
      nominee_id_param: nominee_id,
      user_display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
      user_avatar_url: user.user_metadata?.avatar_url || null
    })

    if (error) {
      // Handle specific error cases
      if (error.message.includes('VOTING_ENDED')) {
        return NextResponse.json({ error: 'Voting has ended' }, { status: 403 })
      }
      if (error.message.includes('BALLOT_FINALIZED')) {
        return NextResponse.json({ error: 'Ballot is already finalized' }, { status: 400 })
      }
      if (error.message.includes('INVALID_NOMINEE')) {
        return NextResponse.json({ error: 'Invalid nominee selected' }, { status: 400 })
      }
      if (error.message.includes('CATEGORY_INACTIVE')) {
        return NextResponse.json({ error: 'Voting is not active for this category' }, { status: 400 })
      }
      
      console.error('Error in optimized vote submission:', error)
      return NextResponse.json({ 
        error: 'Failed to submit vote',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ vote: data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/votes:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

