'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { useVotingData, usePrefetchAllVotingData } from '@/lib/hooks/use-voting-data'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'

export default function StartVotingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const prefetchAllVotingData = usePrefetchAllVotingData()
  
  // Fetch all voting data optimally in one request
  const { data: votingData, isLoading: loadingData, error } = useVotingData()

  const startVotingFlow = useCallback(() => {
    if (!votingData?.categories?.length) {
      router.push('/vote')
      return
    }

    // Redirect to first category that user hasn't voted for, or first category
    const firstUnvotedCategory = votingData.categories.find(cat => !cat.hasVote)
    const targetCategory = firstUnvotedCategory || votingData.categories[0]
    
    router.push(`/vote/category/${targetCategory.slug}`)
  }, [router, votingData])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    // Prefetch all voting data immediately when user is confirmed
    if (user && !loadingData) {
      prefetchAllVotingData()
    }
  }, [user, loading, router, prefetchAllVotingData, loadingData])

  useEffect(() => {
    // Start voting flow when data is ready
    if (votingData && !error) {
      // Small delay for better UX (shows loading state briefly)
      const timer = setTimeout(startVotingFlow, 500)
      return () => clearTimeout(timer)
    }
  }, [votingData, error, startVotingFlow])

  useEffect(() => {
    // Handle errors
    if (error) {
      console.error('Error starting voting flow:', error)
      router.push('/vote')
    }
  }, [error, router])

  return (
    <div className="flex items-center justify-center relative overflow-hidden py-20 bg-full-viewport bg-gradient-to-br from-background via-background-secondary to-background-tertiary min-h-screen">
      {/* Optimized Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <motion.div 
        className="relative text-center space-y-8 px-6 max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="relative w-20 h-20">
            <Image
              src="/logo.webp"
              alt="Bobo Game Awards Logo"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              priority
            />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-2"
        >
          <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            {loadingData ? 'Loading Your Voting Data...' : 'Starting Your Voting Journey'}
          </h3>
          <p className="text-white/60 font-body">
            {loadingData 
              ? 'Fetching categories and your previous votes...' 
              : votingData?.categories?.length 
                ? `Found ${votingData.categories.length} categories. Taking you to voting...`
                : 'Preparing your personalized voting experience...'
            }
          </p>
          
          {/* Progress indicator */}
          {votingData && (
            <div className="mt-4">
              <div className="text-sm text-white/40">
                {votingData.categories.filter(c => c.hasVote).length} of {votingData.categories.length} categories completed
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-primary h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${(votingData.categories.filter(c => c.hasVote).length / votingData.categories.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
