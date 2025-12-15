'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { User as AppUser } from '@/lib/types/database'

type AuthContextType = {
  user: User | null
  appUser: AppUser | null
  loading: boolean
  signingOut: boolean
  signInWithGoogle: () => Promise<void>
  signInWithTwitch: () => Promise<void>
  signInWithDiscord: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const supabase = createClient()

  // Safety mechanism: Reset signing out state after 5 seconds if it gets stuck
  useEffect(() => {
    if (signingOut) {
      const timeout = setTimeout(() => {
        console.warn('Sign out process seems stuck, resetting state')
        setSigningOut(false)
        // Force clear state and reload if stuck
        setUser(null)
        setAppUser(null)
        window.location.href = '/'
      }, 5000) // 5 second safety timeout
      
      return () => clearTimeout(timeout)
    }
  }, [signingOut])

  const fetchAppUser = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (data && !error) {
        setAppUser(data)
      } else if (error) {
        console.error('Error fetching app user:', error)
      }
    } catch (error) {
      console.error('Exception fetching app user:', error)
    }
  }, [supabase])

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchAppUser(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session ? 'session exists' : 'no session')
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          try {
            await fetchAppUser(session.user.id)
          } catch (error) {
            console.error('Error fetching app user:', error)
            // Continue anyway, we have auth user even if app user fetch fails
          }
        } else {
          setAppUser(null)
        }
        
        setLoading(false)
        setSigningOut(false) // Reset signing out state on any auth change
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchAppUser, supabase.auth])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signInWithTwitch = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitch',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signInWithDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (signingOut) return // Prevent duplicate sign out attempts
    
    setSigningOut(true)
    
    try {
      // Helper to add timeout to any promise
      const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
        return Promise.race([
          promise,
          new Promise<T>((_, reject) => 
            setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
          )
        ])
      }
      
      // First, try to clear the server-side session via API route
      // Use a short timeout (2 seconds) to avoid hanging
      try {
        await withTimeout(
          fetch('/api/auth/signout', { 
            method: 'POST',
            credentials: 'include'
          }),
          2000 // 2 second timeout
        )
      } catch (err) {
        console.warn('Server sign out failed or timed out, continuing:', err)
      }
      
      // Then clear client-side session with timeout
      try {
        await withTimeout(
          supabase.auth.signOut({ scope: 'global' }),
          2000 // 2 second timeout
        )
      } catch (err) {
        console.warn('Client sign out failed or timed out, forcing clear:', err)
      }
      
      // Clear local state immediately
      setUser(null)
      setAppUser(null)
      
      // Clear all cached data
      try {
        sessionStorage.clear()
        // Also clear auth-related localStorage
        Object.keys(localStorage)
          .filter(key => key.includes('sb-') || key.includes('supabase'))
          .forEach(key => localStorage.removeItem(key))
      } catch (e) {
        console.warn('Failed to clear storage:', e)
      }
      
      // Navigate to home page
      window.location.href = '/'
      
    } catch (error) {
      console.error('Sign out error:', error)
      
      // Fallback: Force clear everything
      setUser(null)
      setAppUser(null)
      
      // Clear all storage aggressively
      try {
        localStorage.clear()
        sessionStorage.clear()
      } catch (e) {
        console.warn('Failed to clear storage:', e)
      }
      
      // Force reload to clear any remaining state
      window.location.href = '/'
    }
    // Note: Don't reset signingOut here - let the page reload or safety timeout handle it
  }

  const value = {
    user,
    appUser,
    loading,
    signingOut,
    signInWithGoogle,
    signInWithTwitch,
    signInWithDiscord,
    signInWithGithub,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
