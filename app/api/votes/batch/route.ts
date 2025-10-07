import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateVotingPeriod } from '@/lib/utils/voting-protection'

interface BatchVoteRequest {
  votes: Array<{
    category_id: string
    nominee_id: string
  }>
  is_admin?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: BatchVoteRequest = await request.json()
    const { votes, is_admin } = body

    // Validate required fields
    if (!votes || !Array.isArray(votes) || votes.length === 0) {
      return NextResponse.json(
        { error: 'Missing required field: votes array is required' },
        { status: 400 }
      )
    }

    if (votes.length > 20) {
      return NextResponse.json(
        { error: 'Too many votes in batch. Maximum 20 votes allowed.' },
        { status: 400 }
      )
    }

    // Validate each vote has required fields
    for (const vote of votes) {
      if (!vote.category_id || !vote.nominee_id) {
        return NextResponse.json(
          { error: 'Each vote must have category_id and nominee_id' },
          { status: 400 }
        )
      }
    }

    // Check global voting deadline and voting lock (with admin bypass from client)
    const votingValidation = validateVotingPeriod(is_admin || false);
    if (!votingValidation.isActive) {
      return votingValidation.response!;
    }

    // Use optimized batch function
    const { data, error } = await supabase.rpc('submit_batch_votes_optimized', {
      user_id_param: user.id,
      votes_param: votes,
      user_display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
      user_avatar_url: user.user_metadata?.avatar_url || null
    })

    if (error) {
      console.error('Error in batch vote submission:', error)
      return NextResponse.json({ 
        error: 'Failed to submit votes',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      votes: data,
      count: data?.length || 0,
      message: `Successfully submitted ${data?.length || 0} votes`
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in batch vote submission:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
