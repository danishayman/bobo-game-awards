import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import TwitchProvider from "next-auth/providers/twitch"
import { supabase } from "./supabase"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false
      
      try {
        // Check if user exists in Supabase
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single()

        if (!existingUser) {
          // Create new user in Supabase
          const { error } = await supabase
            .from('users')
            .insert({
              name: user.name || '',
              email: user.email || '',
              provider: account.provider as 'google' | 'twitch',
            })

          if (error) {
            console.error('Error creating user:', error)
            return false
          }
        }
        
        return true
      } catch (error) {
        console.error('SignIn error:', error)
        return false
      }
    },
    async session({ session }) {
      if (session.user?.email) {
        // Get user data from Supabase
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (userData) {
          // Add user ID to session
          session.user.id = userData.id
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}



