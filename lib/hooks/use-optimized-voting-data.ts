'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CategoryWithNominees, Category, Ballot, Vote } from '@/lib/types/database'

interface OptimizedVotingData {
  categories: (Category & { hasVote: boolean, nominees: any[] })[]
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

export function useOptimizedVotingData(slug?: string) {
  const queryKey = slug ? ['voting-data-optimized', slug] : ['voting-data-optimized', 'all']
  
  return useQuery({
    queryKey,
    queryFn: async (): Promise<OptimizedVotingData> => {
      const params = new URLSearchParams()
      if (slug) params.set('slug', slug)
      
      const response = await fetch(`/api/voting-data-optimized?${params}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch voting data')
      }
      
      return response.json()
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

// Hook for prefetching all voting data at once
export function usePrefetchAllVotingData() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: ['voting-data-optimized', 'all'],
      queryFn: async (): Promise<OptimizedVotingData> => {
        const response = await fetch('/api/voting-data-optimized')
        if (!response.ok) throw new Error('Failed to prefetch')
        return response.json()
      },
      staleTime: 60 * 1000,
    })
  }
}

// Hook for updating local cache after vote submission
export function useUpdateVotingCache() {
  const queryClient = useQueryClient()
  
  return (slug: string, voteData: { category_id: string, nominee_id: string }) => {
    // Update specific category cache
    queryClient.setQueryData(
      ['voting-data-optimized', slug],
      (oldData: OptimizedVotingData | undefined) => {
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
      ['voting-data-optimized', 'all'],
      (oldData: OptimizedVotingData | undefined) => {
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
    const allData = queryClient.getQueryData(['voting-data-optimized', 'all']) as OptimizedVotingData
    if (allData) {
      const currentIndex = allData.categories.findIndex(cat => cat.slug === slug)
      const nextCategory = allData.categories[currentIndex + 1]
      
      if (nextCategory) {
        // Data is already cached from the 'all' query, just create specific cache entry
        queryClient.setQueryData(
          ['voting-data-optimized', nextCategory.slug],
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



