import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { SupabaseClient, User } from '@supabase/supabase-js'

type AuthResult = {
  supabase: SupabaseClient
  user: User
  error: null
} | {
  supabase: null
  user: null
  error: NextResponse
}

/**
 * Optimized authentication helper for API routes
 * Creates Supabase client and validates user in a single call
 * Returns both client and user to avoid redundant calls
 */
export async function authenticateRequest(): Promise<AuthResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return {
        supabase: null,
        user: null,
        error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    return {
      supabase,
      user,
      error: null
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      supabase: null,
      user: null,
      error: NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  }
}
