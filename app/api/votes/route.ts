import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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
    const { category_id, nominee_id } = body

    // Validate required fields
    if (!category_id || !nominee_id) {
      return NextResponse.json(
        { error: 'Missing required fields: category_id and nominee_id are required' },
        { status: 400 }
      )
    }

    // Ensure user exists in public.users table
    const { data: publicUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (userError || !publicUser) {
      console.error('User not found in public.users table:', userError)
      // Create user record if it doesn't exist
      const { error: createUserError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
          avatar_url: user.user_metadata?.avatar_url || null,
        })

      if (createUserError) {
        console.error('Failed to create user record:', createUserError)
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        )
      }
    }

    // Validate that the nominee exists and belongs to the category
    const { data: nominee, error: nomineeError } = await supabase
      .from('nominees')
      .select('id, category_id')
      .eq('id', nominee_id)
      .single()

    if (nomineeError || !nominee) {
      console.error('Nominee validation failed:', nomineeError)
      return NextResponse.json(
        { error: 'Invalid nominee selected' },
        { status: 400 }
      )
    }

    if (nominee.category_id !== category_id) {
      return NextResponse.json(
        { error: 'Nominee does not belong to the specified category' },
        { status: 400 }
      )
    }

    // Check if voting is active for this category
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('voting_start, voting_end, is_active')
      .eq('id', category_id)
      .single()

    if (categoryError) {
      console.error('Category validation failed:', categoryError)
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    if (!category?.is_active) {
      return NextResponse.json(
        { error: 'Voting is not active for this category' },
        { status: 400 }
      )
    }

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

    // Check if user's ballot is already finalized
    const { data: ballot } = await supabase
      .from('ballots')
      .select('is_final')
      .eq('user_id', user.id)
      .single()

    if (ballot?.is_final) {
      return NextResponse.json(
        { error: 'Ballot is already finalized' },
        { status: 400 }
      )
    }

    // Upsert the vote (insert or update if exists)
    const { data, error } = await supabase
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
      .single()

    if (error) {
      console.error('Error creating/updating vote:', error)
      console.error('Vote data:', { user_id: user.id, category_id, nominee_id })
      return NextResponse.json(
        { 
          error: 'Failed to save vote',
          details: error.message,
          code: error.code 
        },
        { status: 500 }
      )
    }

    // Create or update ballot entry
    const { error: ballotError } = await supabase
      .from('ballots')
      .upsert({
        user_id: user.id,
        is_final: false
      }, {
        onConflict: 'user_id'
      })

    if (ballotError) {
      console.error('Error creating/updating ballot:', ballotError)
      // Don't fail the request if ballot creation fails, as the vote was successful
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
