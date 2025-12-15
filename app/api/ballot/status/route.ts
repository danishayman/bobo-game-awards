import { authenticateRequest } from '@/lib/auth/server-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const auth = await authenticateRequest()
    if (auth.error) return auth.error

    const { supabase, user } = auth

    const { data: ballot, error } = await supabase
      .from('ballots')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching ballot:', error)
      return NextResponse.json(
        { error: 'Failed to fetch ballot' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ballot: ballot || null })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
