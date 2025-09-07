import { supabase, type Category, type Nominee, type VotingSettings } from './supabase'
import { DatabaseError } from './db-queries'

// Category Management
export async function createCategory(name: string, description: string): Promise<Category> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, description })
      .select()
      .single()

    if (error) throw new DatabaseError('Failed to create category', error)
    return data
  } catch (error) {
    throw new DatabaseError('Failed to create category', error)
  }
}

export async function updateCategory(id: string, name: string, description: string): Promise<Category> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({ name, description })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new DatabaseError('Failed to update category', error)
    return data
  } catch (error) {
    throw new DatabaseError('Failed to update category', error)
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw new DatabaseError('Failed to delete category', error)
  } catch (error) {
    throw new DatabaseError('Failed to delete category', error)
  }
}

// Nominee Management
export async function createNominee(
  categoryId: string, 
  title: string, 
  description: string, 
  imageUrl: string
): Promise<Nominee> {
  try {
    const { data, error } = await supabase
      .from('nominees')
      .insert({ 
        category_id: categoryId, 
        title, 
        description, 
        image_url: imageUrl 
      })
      .select()
      .single()

    if (error) throw new DatabaseError('Failed to create nominee', error)
    return data
  } catch (error) {
    throw new DatabaseError('Failed to create nominee', error)
  }
}

export async function updateNominee(
  id: string, 
  title: string, 
  description: string, 
  imageUrl: string
): Promise<Nominee> {
  try {
    const { data, error } = await supabase
      .from('nominees')
      .update({ title, description, image_url: imageUrl })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new DatabaseError('Failed to update nominee', error)
    return data
  } catch (error) {
    throw new DatabaseError('Failed to update nominee', error)
  }
}

export async function deleteNominee(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('nominees')
      .delete()
      .eq('id', id)

    if (error) throw new DatabaseError('Failed to delete nominee', error)
  } catch (error) {
    throw new DatabaseError('Failed to delete nominee', error)
  }
}

// Voting Settings Management
export async function updateVotingSettings(
  votingOpen: boolean,
  votingEndDate?: string
): Promise<VotingSettings> {
  try {
    // Get current settings
    const { data: currentSettings } = await supabase
      .from('voting_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (currentSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('voting_settings')
        .update({ 
          voting_open: votingOpen,
          voting_end_date: votingEndDate || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSettings.id)
        .select()
        .single()

      if (error) throw new DatabaseError('Failed to update voting settings', error)
      return data
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('voting_settings')
        .insert({ 
          voting_open: votingOpen,
          voting_end_date: votingEndDate || null
        })
        .select()
        .single()

      if (error) throw new DatabaseError('Failed to create voting settings', error)
      return data
    }
  } catch (error) {
    throw new DatabaseError('Failed to update voting settings', error)
  }
}

// Statistics
export async function getAdminStats(): Promise<{
  totalCategories: number
  totalNominees: number
  totalVotes: number
  totalUsers: number
}> {
  try {
    const [
      { count: categoriesCount },
      { count: nomineesCount },
      { count: votesCount },
      { count: usersCount }
    ] = await Promise.all([
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('nominees').select('*', { count: 'exact', head: true }),
      supabase.from('votes').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true })
    ])

    return {
      totalCategories: categoriesCount || 0,
      totalNominees: nomineesCount || 0,
      totalVotes: votesCount || 0,
      totalUsers: usersCount || 0
    }
  } catch (error) {
    throw new DatabaseError('Failed to fetch admin stats', error)
  }
}



