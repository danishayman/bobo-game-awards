import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const supabase = await createClient()
    
    // Sign out on the server side
    await supabase.auth.signOut({ scope: 'global' })
    
    // Explicitly clear all Supabase-related cookies
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    // Clear all cookies that might contain auth data
    allCookies.forEach(cookie => {
      if (cookie.name.includes('sb-') || cookie.name.includes('supabase')) {
        cookieStore.delete(cookie.name)
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Server sign out error:', error)
    // Return success anyway to allow client-side sign out to proceed
    return NextResponse.json({ success: true })
  }
}
