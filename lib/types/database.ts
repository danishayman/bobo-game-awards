export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          display_name: string
          avatar_url: string | null
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          display_name: string
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          voting_start: string | null
          voting_end: string | null
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          voting_start?: string | null
          voting_end?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          voting_start?: string | null
          voting_end?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      nominees: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          image_url: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          image_url?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          display_order?: number
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string
          category_id: string
          nominee_id: string
          is_final: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          nominee_id: string
          is_final?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          nominee_id?: string
          is_final?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ballots: {
        Row: {
          id: string
          user_id: string
          is_final: boolean
          submitted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          is_final?: boolean
          submitted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          is_final?: boolean
          submitted_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Nominee = Database['public']['Tables']['nominees']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']
export type Ballot = Database['public']['Tables']['ballots']['Row']

export type CategoryWithNominees = Category & {
  nominees: Nominee[]
}

export type VoteResult = {
  nominee_id: string
  nominee_name: string
  vote_count: number
  category_id: string
  category_name: string
}
