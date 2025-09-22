'use client'

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Optimized defaults for voting app performance
            staleTime: 2 * 60 * 1000, // 2 minutes - longer for better UX
            gcTime: 15 * 60 * 1000, // 15 minutes in cache
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors or auth errors
              if (error instanceof Error) {
                if (error.message.includes('404') || 
                    error.message.includes('401') || 
                    error.message.includes('403')) {
                  return false
                }
              }
              return failureCount < 2
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            // Optimize for mobile networks
            networkMode: 'offlineFirst',
            // Enable background updates for smoother UX
            refetchInterval: false,
            refetchIntervalInBackground: false,
          },
          mutations: {
            retry: 1,
            // Enable optimistic updates
            networkMode: 'offlineFirst',
          },
        },
        // Enhanced query cache configuration
        queryCache: new QueryCache({
          onError: (error, query) => {
            console.error('Query error:', error, 'Query key:', query.queryKey)
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, variables) => {
            console.error('Mutation error:', error, 'Variables:', variables)
          },
        }),
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}

