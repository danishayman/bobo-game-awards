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
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (data && !error) {
      setAppUser(data)
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
      // Set a timeout for the sign-out operation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Sign out timeout')), 10000) // 10 second timeout
      })
      
      const signOutPromise = supabase.auth.signOut()
      
      // Race between sign-out and timeout
      const result = await Promise.race([signOutPromise, timeoutPromise])
      const { error } = result as { error: Error | null }
      
      if (error) throw error
      
    } catch (error) {
      console.error('Sign out error:', error)
      
      // Force local session clearing as fallback
      try {
        // Clear local storage items that Supabase might use
        localStorage.removeItem('supabase.auth.token')
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key)
          }
        })
        
        // Clear cookies by setting them to expire
        document.cookie.split(";").forEach(cookie => {
          const eqPos = cookie.indexOf("=")
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
          if (name.trim().includes('sb-') || name.trim().includes('supabase')) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          }
        })
        
        // Force update the auth state
        setUser(null)
        setAppUser(null)
        setSigningOut(false)
        
        // Force a page reload as final fallback
        window.location.href = '/'
        
      } catch (fallbackError) {
        console.error('Fallback sign out error:', fallbackError)
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
