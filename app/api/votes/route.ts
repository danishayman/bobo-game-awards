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
    // Check global voting deadline first
    const votingValidation = validateVotingPeriod();
    if (!votingValidation.isActive) {
      return votingValidation.response!;
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { category_id, nominee_id } = body

    // Validate required fields
    if (!category_id || !nominee_id) {
      return NextResponse.json(
        { error: 'Missing required fields: category_id and nominee_id are required' },
        { status: 400 }
      )
    }

    // Use optimized PostgreSQL function for validation and vote submission
    try {
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
        throw error
      }

      return NextResponse.json({ vote: data }, { status: 201 })
    } catch (functionError) {
      console.error('Optimized function failed, falling back to manual queries:', functionError)
      
      // Fallback to manual validation if function doesn't exist
      return await fallbackVoteSubmission(supabase, user, category_id, nominee_id)
    }
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

// Fallback function for manual vote submission
async function fallbackVoteSubmission(
  supabase: Awaited<ReturnType<typeof createClient>>, 
  user: { id: string; user_metadata?: { full_name?: string; avatar_url?: string }; email?: string }, 
  category_id: string, 
  nominee_id: string
) {
  // Combine validation queries into fewer round trips
  const [userCheck, validationData] = await Promise.all([
    // Ensure user exists - upsert for efficiency
    supabase
      .from('users')
      .upsert({
        id: user.id,
        display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        avatar_url: user.user_metadata?.avatar_url || null,
      }, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select('id')
      .single(),

    // Combined validation query using joins
    supabase
      .from('nominees')
      .select(`
        id,
        category_id,
        categories!inner(
          id,
          is_active,
          voting_start,
          voting_end
        )
      `)
      .eq('id', nominee_id)
      .eq('category_id', category_id)
      .eq('categories.is_active', true)
      .single()
  ])

  if (userCheck.error) {
    console.error('Failed to ensure user exists:', userCheck.error)
    return NextResponse.json(
      { error: 'Failed to create user profile' },
      { status: 500 }
    )
  }

  if (validationData.error || !validationData.data) {
    console.error('Validation failed:', validationData.error)
    return NextResponse.json(
      { error: 'Invalid nominee or category' },
      { status: 400 }
    )
  }

  const nominee = validationData.data
  const category = Array.isArray(nominee.categories) ? nominee.categories[0] : nominee.categories

  // Check voting timing
  const now = new Date()
  if (category.voting_start && new Date(category.voting_start) > now) {
    return NextResponse.json(
      { error: 'Voting has not started yet' },
      { status: 400 }
    )
  }

  if (category.voting_end && new Date(category.voting_end) < now) {
    return NextResponse.json(
      { error: 'Voting has ended' },
      { status: 400 }
    )
  }

  // Check if ballot is finalized and submit vote in single query
  const { data: ballot } = await supabase
    .from('ballots')
    .select('is_final')
    .eq('user_id', user.id)
    .maybeSingle()

  if (ballot?.is_final) {
    return NextResponse.json(
      { error: 'Ballot is already finalized' },
      { status: 400 }
    )
  }

  // Submit vote and ensure ballot exists in parallel
  const [voteResult, ballotResult] = await Promise.all([
    supabase
      .from('votes')
      .upsert({
        user_id: user.id,
        category_id,
        nominee_id,
        is_final: false
      }, {
        onConflict: 'user_id,category_id'
      })
      .select()
      .single(),

    supabase
      .from('ballots')
      .upsert({
        user_id: user.id,
        is_final: false
      }, {
        onConflict: 'user_id'
      })
  ])

  if (voteResult.error) {
    console.error('Error creating/updating vote:', voteResult.error)
    return NextResponse.json(
      { 
        error: 'Failed to save vote',
        details: voteResult.error.message,
        code: voteResult.error.code 
      },
      { status: 500 }
    )
  }

  if (ballotResult.error) {
    console.error('Error creating/updating ballot:', ballotResult.error)
    // Don't fail the request if ballot creation fails, as the vote was successful
  }

  return NextResponse.json({ vote: voteResult.data }, { status: 201 })
}
