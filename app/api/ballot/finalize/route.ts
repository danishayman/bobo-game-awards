import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🔍 Starting ballot finalization process...')
  
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    if (!user) {
      console.error('❌ No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', user.id)

    // Check if user has any votes
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('id, nominee_id, category_id')
      .eq('user_id', user.id)

    if (votesError) {
      console.error('❌ Error checking votes:', votesError)
      return NextResponse.json(
        { error: 'Failed to check votes', details: votesError.message },
        { status: 500 }
      )
    }

    console.log(`📊 Found ${votes?.length || 0} votes for user`)

    if (!votes || votes.length === 0) {
      console.error('❌ No votes found for user')
      return NextResponse.json(
        { error: 'No votes to finalize' },
        { status: 400 }
      )
    }

    // Check if ballot is already finalized
    const { data: existingBallot, error: ballotCheckError } = await supabase
      .from('ballots')
      .select('is_final, submitted_at')
      .eq('user_id', user.id)
      .maybeSingle()

    if (ballotCheckError) {
      console.error('❌ Error checking existing ballot:', ballotCheckError)
      return NextResponse.json(
        { error: 'Failed to check ballot status', details: ballotCheckError.message },
        { status: 500 }
      )
    }

    if (existingBallot?.is_final) {
      console.log('⚠️ Ballot already finalized')
      return NextResponse.json(
        { error: 'Ballot is already finalized', ballot: existingBallot },
        { status: 400 }
      )
    }

    console.log('🚀 Calling finalize_ballot function...')

    // Use the finalize_ballot function
    const { data: rpcData, error: finalizeError } = await supabase
      .rpc('finalize_ballot', { p_user_id: user.id })

    if (finalizeError) {
      console.error('❌ Error calling finalize_ballot function:', finalizeError)
      return NextResponse.json(
        { error: 'Failed to finalize ballot', details: finalizeError.message },
        { status: 500 }
      )
    }

    console.log('✅ Finalize function completed successfully')

    // Get the finalized ballot
    const { data: ballot, error: ballotError } = await supabase
      .from('ballots')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (ballotError) {
      console.error('❌ Error fetching finalized ballot:', ballotError)
      return NextResponse.json(
        { error: 'Failed to fetch finalized ballot', details: ballotError.message },
        { status: 500 }
      )
    }

    console.log('🎉 Ballot finalization complete!')

    return NextResponse.json({ 
      message: 'Ballot finalized successfully',
      ballot,
      votes_count: votes.length
    })
  } catch (error: any) {
    console.error('💥 Unexpected error in ballot finalization:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error?.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}
