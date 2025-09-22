'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CategoryWithNominees, Category, Ballot, Vote, Nominee } from '@/lib/types/database'

interface VotingData {
  categories: (Category & { hasVote: boolean, nominees: Nominee[] })[]
  currentCategory: CategoryWithNominees | null
  currentIndex: number
  userVotes: Record<string, Vote>
  ballot: Ballot | null
  currentVote: Vote | null
  _meta: {
    user_id: string
    fetched_at: string
    cache_key: string
    optimized: boolean
    fallback?: boolean
  }
}

export function useVotingData(slug?: string) {
  const queryKey = slug ? ['voting-data', slug] : ['voting-data', 'all']
  
  return useQuery({
    queryKey,
    queryFn: async (): Promise<VotingData> => {
      if (slug) {
        const response = await fetch(`/api/categories/${slug}/voting-data`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch voting data')
        }
        return response.json()
      } else {
        // For all categories, use the first category to get all data
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        if (categoriesData.categories?.length > 0) {
          const firstSlug = categoriesData.categories[0].slug
          const response = await fetch(`/api/categories/${firstSlug}/voting-data`)
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to fetch voting data')
          }
          return response.json()
        }
        throw new Error('No categories found')
      }
    },
    staleTime: 60 * 1000, // 1 minute - longer for optimized data
    gcTime: 10 * 60 * 1000, // 10 minutes in cache
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    // Enable background updates for better UX
    refetchOnMount: false,
  })
}

// Hook for prefetching voting data (renamed from original)
export function usePrefetchVotingData() {
  const queryClient = useQueryClient()
  
  return (slug: string) => {
    // Only prefetch if not already in cache or stale
    if (!queryClient.getQueryData(['voting-data', slug])) {
      queryClient.prefetchQuery({
        queryKey: ['voting-data', slug],
        queryFn: async (): Promise<VotingData> => {
          const response = await fetch(`/api/categories/${slug}/voting-data`)
          if (!response.ok) throw new Error('Failed to prefetch')
          return response.json()
        },
        staleTime: 60 * 1000,
      })
    }
  }
}

// Hook for prefetching all voting data at once
export function usePrefetchAllVotingData() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: ['voting-data', 'all'],
      queryFn: async (): Promise<VotingData> => {
        // For all categories, use the first category to get all data
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        if (categoriesData.categories?.length > 0) {
          const firstSlug = categoriesData.categories[0].slug
          const response = await fetch(`/api/categories/${firstSlug}/voting-data`)
          if (!response.ok) throw new Error('Failed to prefetch')
          return response.json()
        }
        throw new Error('No categories found')
      },
      staleTime: 60 * 1000,
    })
  }
}

// Hook for optimistic updates and cache management
export function useVoteMutation() {
  const queryClient = useQueryClient()
  
  return {
    // Optimistic update for immediate UI feedback
    optimisticVoteUpdate: (slug: string, categoryId: string, nomineeId: string) => {
      queryClient.setQueryData(['voting-data', slug], (oldData: VotingData | undefined) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          currentVote: {
            id: 'temp-optimistic-id',
            user_id: oldData._meta.user_id,
            category_id: categoryId,
            nominee_id: nomineeId,
            is_final: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          userVotes: {
            ...oldData.userVotes,
            [categoryId]: {
              id: 'temp-optimistic-id',
              user_id: oldData._meta.user_id,
              category_id: categoryId,
              nominee_id: nomineeId,
              is_final: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          },
          categories: oldData.categories.map(cat => 
            cat.id === categoryId ? { ...cat, hasVote: true } : cat
          )
        }
      })
    },

    // Revert optimistic update on error
    revertOptimisticUpdate: (slug: string) => {
      queryClient.invalidateQueries({ queryKey: ['voting-data', slug] })
    },

    // Update cache with server response
    updateVoteCache: (slug: string, voteData: Vote) => {
      queryClient.setQueryData(['voting-data', slug], (oldData: VotingData | undefined) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          currentVote: voteData,
          userVotes: {
            ...oldData.userVotes,
            [voteData.category_id]: voteData
          },
          categories: oldData.categories.map(cat => 
            cat.id === voteData.category_id ? { ...cat, hasVote: true } : cat
          )
        }
      })
    }
  }
}

// Hook for updating local cache after vote submission
export function useUpdateVotingCache() {
  const queryClient = useQueryClient()
  
  return (slug: string, voteData: { category_id: string, nominee_id: string }) => {
    // Update specific category cache
    queryClient.setQueryData(
      ['voting-data', slug],
      (oldData: VotingData | undefined) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          currentVote: {
            id: `temp-${Date.now()}`,
            category_id: voteData.category_id,
            nominee_id: voteData.nominee_id,
            user_id: oldData._meta.user_id,
            is_final: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          userVotes: {
            ...oldData.userVotes,
            [voteData.category_id]: {
              id: `temp-${Date.now()}`,
              category_id: voteData.category_id,
              nominee_id: voteData.nominee_id,
              user_id: oldData._meta.user_id,
              is_final: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          }
        }
      }
    )
    
    // Update all categories cache
    queryClient.setQueryData(
      ['voting-data', 'all'],
      (oldData: VotingData | undefined) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          categories: oldData.categories.map(cat => ({
            ...cat,
            hasVote: cat.id === voteData.category_id ? true : cat.hasVote
          })),
          userVotes: {
            ...oldData.userVotes,
            [voteData.category_id]: {
              id: `temp-${Date.now()}`,
              category_id: voteData.category_id,
              nominee_id: voteData.nominee_id,
              user_id: oldData._meta.user_id,
              is_final: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          }
        }
      }
    )
    
    // Prefetch next category data
    const allData = queryClient.getQueryData(['voting-data', 'all']) as VotingData
    if (allData) {
      const currentIndex = allData.categories.findIndex(cat => cat.slug === slug)
      const nextCategory = allData.categories[currentIndex + 1]
      
      if (nextCategory) {
        // Data is already cached from the 'all' query, just create specific cache entry
        queryClient.setQueryData(
          ['voting-data', nextCategory.slug],
          {
            ...allData,
            currentCategory: nextCategory,
            currentIndex: currentIndex + 1,
            currentVote: allData.userVotes[nextCategory.id] || null
          }
        )
      }
    }
  }
}
