import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user exists in public.users table
    const { data: publicUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // Check categories count
    const { count: categoriesCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })

    // Check nominees count  
    const { count: nomineesCount } = await supabase
      .from('nominees')
      .select('*', { count: 'exact', head: true })

    // Check user's votes
    const { data: userVotes, error: votesError } = await supabase
      .from('votes')
      .select('*')
      .eq('user_id', user.id)

    return NextResponse.json({
      auth_user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      public_user: publicUser,
      public_user_error: userError?.message,
      categories_count: categoriesCount,
      nominees_count: nomineesCount,
      user_votes: userVotes,
      votes_error: votesError?.message
    })
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
