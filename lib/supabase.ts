import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  name: string
  email: string
  provider: 'google' | 'twitch'
  created_at: string
}

export interface Category {
  id: string
  name: string
  description: string
}

export interface Nominee {
  id: string
  category_id: string
  title: string
  description: string
  image_url: string
}

export interface Vote {
  id: string
  user_id: string
  category_id: string
  nominee_id: string
  created_at: string
}

export interface VotingSettings {
  id: string
  voting_open: boolean
  voting_end_date: string
  created_at: string
  updated_at: string
}



