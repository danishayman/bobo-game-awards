'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CategoryWithNominees, Category, Ballot, Vote } from '@/lib/types/database'

interface VotingData {
  category: CategoryWithNominees
  allCategories: Category[]
  currentIndex: number
  ballot: Ballot | null
  currentVote: Vote | null
  _meta: {
    user_id: string
    fetched_at: string
    cache_key: string
  }
}

export function useVotingData(slug: string) {
  return useQuery({
    queryKey: ['voting-data', slug],
    queryFn: async (): Promise<VotingData> => {
      const response = await fetch(`/api/categories/${slug}/voting-data`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch voting data')
      }
      
      return response.json()
    },
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}

// Hook for prefetching next category data
export function usePrefetchVotingData() {
  const queryClient = useQueryClient()
  
  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ['voting-data', slug],
      queryFn: async (): Promise<VotingData> => {
        const response = await fetch(`/api/categories/${slug}/voting-data`)
        if (!response.ok) throw new Error('Failed to prefetch')
        return response.json()
      },
      staleTime: 30 * 1000,
    })
  }
}
