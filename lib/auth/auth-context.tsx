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

  // Safety mechanism: Reset signing out state after 15 seconds if it gets stuck
  useEffect(() => {
    if (signingOut) {
      const timeout = setTimeout(() => {
        console.warn('Sign out process seems stuck, resetting state')
        setSigningOut(false)
      }, 15000) // 15 second safety timeout
      
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
    setSigningOut(true)
    
    try {
      // Optimized: Shorter timeout for better UX (3 seconds instead of 10)
      const timeoutPromise = new Promise<{ error: Error }>((_, reject) => {
        setTimeout(() => reject(new Error('Sign out timeout')), 3000)
      })
      
      const signOutPromise = supabase.auth.signOut({ scope: 'local' })
      
      // Race between sign-out and timeout
      await Promise.race([signOutPromise, timeoutPromise])
      
      // Immediately clear local state (don't wait for auth listener)
      setUser(null)
      setAppUser(null)
      
      // Navigate immediately for better perceived performance
      window.location.href = '/'
      
    } catch (error) {
      console.error('Sign out error:', error)
      
      // Fast fallback: Clear local session immediately
      try {
        // Clear Supabase auth storage keys
        const storageKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('sb-') || key.includes('supabase-auth')
        )
        storageKeys.forEach(key => localStorage.removeItem(key))
        
        // Clear state immediately
        setUser(null)
        setAppUser(null)
        
        // Navigate to home
        window.location.href = '/'
        
      } catch (fallbackError) {
        console.error('Fallback sign out error:', fallbackError)
        // Last resort: Force reload to clear everything
        window.location.reload()
      } finally {
        setSigningOut(false)
      }
    }
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
