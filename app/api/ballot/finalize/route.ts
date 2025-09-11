import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has any votes
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('id')
      .eq('user_id', user.id)

    if (votesError) {
      console.error('Error checking votes:', votesError)
      return NextResponse.json(
        { error: 'Failed to check votes' },
        { status: 500 }
      )
    }

    if (!votes || votes.length === 0) {
      return NextResponse.json(
        { error: 'No votes to finalize' },
        { status: 400 }
      )
    }

    // Check if ballot is already finalized
    const { data: existingBallot } = await supabase
      .from('ballots')
      .select('is_final')
      .eq('user_id', user.id)
      .single()

    if (existingBallot?.is_final) {
      return NextResponse.json(
        { error: 'Ballot is already finalized' },
        { status: 400 }
      )
    }

    // Use the finalize_ballot function
    const { error: finalizeError } = await supabase
      .rpc('finalize_ballot', { p_user_id: user.id })

    if (finalizeError) {
      console.error('Error finalizing ballot:', finalizeError)
      return NextResponse.json(
        { error: 'Failed to finalize ballot' },
        { status: 500 }
      )
    }

    // Get the finalized ballot
    const { data: ballot, error: ballotError } = await supabase
      .from('ballots')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (ballotError) {
      console.error('Error fetching finalized ballot:', ballotError)
      return NextResponse.json(
        { error: 'Failed to fetch finalized ballot' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Ballot finalized successfully',
      ballot 
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
