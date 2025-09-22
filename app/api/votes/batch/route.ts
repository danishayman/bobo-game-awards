import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateVotingPeriod } from '@/lib/utils/voting-protection'

interface BatchVoteRequest {
  votes: Array<{
    category_id: string
    nominee_id: string
  }>
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

    const body: BatchVoteRequest = await request.json()
    const { votes } = body

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

    // Try optimized batch function first
    try {
      const { data, error } = await supabase.rpc('submit_batch_votes_optimized', {
        user_id_param: user.id,
        votes_param: votes,
        user_display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        user_avatar_url: user.user_metadata?.avatar_url || null
      })

      if (error) {
        console.error('Error in batch vote submission:', error)
        throw error
      }

      return NextResponse.json({ 
        votes: data,
        count: data?.length || 0,
        message: `Successfully submitted ${data?.length || 0} votes`
      }, { status: 201 })
    } catch (functionError) {
      console.error('Batch function failed, falling back to individual submissions:', functionError)
      
      // Fallback to individual vote submissions in a transaction
      const submittedVotes = []
      const errors = []

      for (const vote of votes) {
        try {
          const response = await fetch('/api/votes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': request.headers.get('Authorization') || '',
              'Cookie': request.headers.get('Cookie') || ''
            },
            body: JSON.stringify(vote),
          })

          if (response.ok) {
            const result = await response.json()
            submittedVotes.push(result.vote)
          } else {
            const errorData = await response.json()
            errors.push({ vote, error: errorData.error })
          }
        } catch {
          errors.push({ vote, error: 'Network error during submission' })
        }
      }

      if (errors.length > 0) {
        return NextResponse.json({
          votes: submittedVotes,
          errors,
          count: submittedVotes.length,
          message: `Submitted ${submittedVotes.length} votes with ${errors.length} errors`
        }, { status: 207 }) // 207 Multi-Status for partial success
      }

      return NextResponse.json({
        votes: submittedVotes,
        count: submittedVotes.length,
        message: `Successfully submitted ${submittedVotes.length} votes`
      }, { status: 201 })
    }
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
