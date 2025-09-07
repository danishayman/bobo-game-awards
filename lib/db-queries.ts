import { supabase, type Category, type Nominee, type Vote, type VotingSettings } from './supabase'

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message)
    this.name = 'DatabaseError'
  }
}

/**
 * Get all categories with their nominees
 */
export async function getCategoriesWithNominees(): Promise<(Category & { nominees: Nominee[] })[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        nominees (*)
      `)
      .order('name')

    if (error) throw new DatabaseError('Failed to fetch categories', error)
    return data || []
  } catch (error) {
    throw new DatabaseError('Failed to fetch categories with nominees', error)
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw new DatabaseError('Failed to fetch categories', error)
    return data || []
  } catch (error) {
    throw new DatabaseError('Failed to fetch categories', error)
  }
}

/**
 * Get nominees for a specific category
 */
export async function getNominees(categoryId: string): Promise<Nominee[]> {
  try {
    const { data, error } = await supabase
      .from('nominees')
      .select('*')
      .eq('category_id', categoryId)
      .order('title')

    if (error) throw new DatabaseError('Failed to fetch nominees', error)
    return data || []
  } catch (error) {
    throw new DatabaseError('Failed to fetch nominees', error)
  }
}

/**
 * Get user's votes
 */
export async function getUserVotes(userId: string): Promise<Vote[]> {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('user_id', userId)

    if (error) throw new DatabaseError('Failed to fetch user votes', error)
    return data || []
  } catch (error) {
    throw new DatabaseError('Failed to fetch user votes', error)
  }
}

/**
 * Submit a vote
 */
export async function submitVote(
  userId: string, 
  categoryId: string, 
  nomineeId: string
): Promise<void> {
  try {
    // First check if user already voted in this category
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .single()

    if (existingVote) {
      // Update existing vote
      const { error } = await supabase
        .from('votes')
        .update({ nominee_id: nomineeId })
        .eq('user_id', userId)
        .eq('category_id', categoryId)

      if (error) throw new DatabaseError('Failed to update vote', error)
    } else {
      // Insert new vote
      const { error } = await supabase
        .from('votes')
        .insert({
          user_id: userId,
          category_id: categoryId,
          nominee_id: nomineeId
        })

      if (error) throw new DatabaseError('Failed to submit vote', error)
    }
  } catch (error) {
    throw new DatabaseError('Failed to submit vote', error)
  }
}

/**
 * Get voting settings
 */
export async function getVotingSettings(): Promise<VotingSettings | null> {
  try {
    const { data, error } = await supabase
      .from('voting_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw new DatabaseError('Failed to fetch voting settings', error)
    }
    
    return data
  } catch (error) {
    throw new DatabaseError('Failed to fetch voting settings', error)
  }
}

/**
 * Get vote results for a category
 */
export async function getCategoryResults(categoryId: string): Promise<{
  nominee: Nominee
  voteCount: number
  percentage: number
}[]> {
  try {
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select(`
        nominee_id,
        nominees (*)
      `)
      .eq('category_id', categoryId)

    if (votesError) throw new DatabaseError('Failed to fetch votes', votesError)

    // Count votes per nominee
    const voteCount: { [nomineeId: string]: number } = {}
    const nominees: { [nomineeId: string]: Nominee } = {}
    
    votes?.forEach((vote: any) => {
      const nomineeId = vote.nominee_id
      voteCount[nomineeId] = (voteCount[nomineeId] || 0) + 1
      nominees[nomineeId] = vote.nominees
    })

    // Get all nominees for this category to include those with 0 votes
    const { data: allNominees, error: nomineesError } = await supabase
      .from('nominees')
      .select('*')
      .eq('category_id', categoryId)

    if (nomineesError) throw new DatabaseError('Failed to fetch nominees', nomineesError)

    // Calculate total votes
    const totalVotes = Object.values(voteCount).reduce((sum, count) => sum + count, 0)

    // Build results
    const results = allNominees?.map((nominee) => ({
      nominee,
      voteCount: voteCount[nominee.id] || 0,
      percentage: totalVotes > 0 ? ((voteCount[nominee.id] || 0) / totalVotes) * 100 : 0
    })) || []

    // Sort by vote count (highest first)
    return results.sort((a, b) => b.voteCount - a.voteCount)
  } catch (error) {
    throw new DatabaseError('Failed to fetch category results', error)
  }
}

/**
 * Get all results
 */
export async function getAllResults(): Promise<{
  [categoryId: string]: {
    category: Category
    results: {
      nominee: Nominee
      voteCount: number
      percentage: number
    }[]
  }
}> {
  try {
    const categories = await getCategories()
    const results: any = {}

    for (const category of categories) {
      results[category.id] = {
        category,
        results: await getCategoryResults(category.id)
      }
    }

    return results
  } catch (error) {
    throw new DatabaseError('Failed to fetch all results', error)
  }
}



