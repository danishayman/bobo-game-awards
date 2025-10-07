'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/auth-context'
import { canUserVote, isVotingLocked } from '@/lib/config/voting'
import { validateCompleteVote } from '@/lib/utils/client-validation'
import { LiveVotingCountdown } from '@/components/ui/live-voting-countdown'
import { useVotingData, usePrefetchVotingData, useVoteMutation } from '@/lib/hooks/use-voting-data'
import { Nominee } from '@/lib/types/database'
import { ArrowLeft, ArrowRight, Check, Trophy, CheckCircle, Star } from 'lucide-react'
import { NomineeLoadingSkeleton } from '@/components/ui/nominee-loading-skeleton'
import { NomineeCard } from '@/components/ui/nominee-card'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function CategoryVotePage() {
  const { user, appUser, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  // Use React Query for data fetching
  const { data: votingData, isLoading: loadingData, error, isError } = useVotingData(slug)
  const prefetchVotingData = usePrefetchVotingData()
  const { optimisticVoteUpdate, revertOptimisticUpdate, updateVoteCache } = useVoteMutation()

  const [selectedNominee, setSelectedNominee] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [justVoted, setJustVoted] = useState(false)
  const [userCanVote, setUserCanVote] = useState(true)
  const [votingLocked, setVotingLocked] = useState(false)

  // Extract data from React Query result
  const category = votingData?.currentCategory || null
  const allCategories = useMemo(() => votingData?.categories || [], [votingData?.categories])
  const currentIndex = votingData?.currentIndex || 0
  const ballot = votingData?.ballot || null
  const currentVote = votingData?.currentVote || null

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
  }, [user, loading, router])

  useEffect(() => {
    // Check if user can vote (considering admin status and voting lock)
    setVotingLocked(isVotingLocked())
    if (appUser) {
      setUserCanVote(canUserVote(appUser.is_admin))
    }
  }, [appUser])

  // Set initial selected nominee when data loads
  useEffect(() => {
    if (currentVote?.nominee_id) {
      setSelectedNominee(currentVote.nominee_id)
    }
  }, [currentVote])

  // Prefetch next category data for better UX
  useEffect(() => {
    if (allCategories.length > 0 && currentIndex < allCategories.length - 1) {
      const nextCategory = allCategories[currentIndex + 1]
      if (nextCategory) {
        // Prefetch next category data after a short delay
        const timer = setTimeout(() => {
          prefetchVotingData(nextCategory.slug)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [allCategories, currentIndex, prefetchVotingData])

  // Handle error states
  if (isError) {
    console.error('Error fetching voting data:', error)
    router.push('/vote')
    return null
  }

  // Show voting locked message with countdown if voting is locked and user is not admin
  if (votingLocked && !userCanVote) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div 
            className="text-center space-y-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="relative w-20 h-20">
                <Image
                  src="/logo.webp"
                  alt="Bobo Game Awards Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                Voting Opening Soon!
              </h1>
              <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
                Live voting hasn&apos;t started yet. Check back when the countdown reaches zero!
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <LiveVotingCountdown 
                onLiveVotingStarted={() => {
                  setVotingLocked(false)
                  setUserCanVote(true)
                }}
                className="max-w-2xl mx-auto"
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-red-primary hover:bg-red-secondary text-white px-8 py-3 font-semibold"
              >
                <Link href="/vote">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Voting
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  const handleVoteAndNavigate = async () => {
    if (!selectedNominee || !category) return

    // Client-side validation for immediate feedback (no server round-trip)
    const validation = validateCompleteVote(
      category.id,
      selectedNominee,
      appUser?.is_admin || false
    )

    if (!validation.isValid) {
      alert(`Vote failed: ${validation.error}`)
      return
    }

    setSubmitting(true)
    
    // Apply optimistic update immediately for better UX
    optimisticVoteUpdate(slug, category.id, selectedNominee)
    setJustVoted(true)
    
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category_id: category.id,
          nominee_id: selectedNominee,
          is_admin: appUser?.is_admin || false,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Vote save failed:', error)
        
        // Revert optimistic update on error
        revertOptimisticUpdate(slug)
        setJustVoted(false)
        throw new Error(error.error || 'Failed to save vote')
      }

      const result = await response.json()
      
      // Update cache with actual server response
      updateVoteCache(slug, result.vote)
      
      // Small delay to show success state
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // Navigate to next category or back to vote overview
      const nextCategory = allCategories[currentIndex + 1]
      if (nextCategory) {
        router.push(`/vote/category/${nextCategory.slug}`)
      } else {
        router.push('/vote/summary')
      }
    } catch (error) {
      console.error('Error saving vote:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save vote. Please try again.'
      alert(`Vote failed: ${errorMessage}`)
      setJustVoted(false)
    } finally {
      setSubmitting(false)
    }
  }

  const getNavigationInfo = () => {
    const prevCategory = allCategories[currentIndex - 1]
    const nextCategory = allCategories[currentIndex + 1]
    
    return { prevCategory, nextCategory }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Simple header skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="h-10 w-32 bg-gray-700/50 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-700/50 rounded animate-pulse" />
          </div>

          {/* Category title skeleton */}
          <div className="text-center mb-12">
            <div className="h-12 w-80 mx-auto bg-gray-700/50 rounded animate-pulse mb-4" />
            <div className="h-4 w-96 mx-auto bg-gray-700/50 rounded animate-pulse" />
          </div>

          {/* Nominees skeleton */}
          <NomineeLoadingSkeleton count={6} />
          
          {/* Action button skeleton */}
          <div className="flex justify-center mt-12">
            <div className="h-12 w-48 bg-gray-700/50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  // If ballot is finalized, show thank you page
  if (ballot?.is_final) {
    return (
      <div className="flex items-center justify-center relative overflow-hidden py-20 min-h-screen">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <motion.div 
          className="relative text-center space-y-12 px-6 max-w-2xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="relative w-24 h-24">
              <Image
                src="/logo.webp"
                alt="Bobo Game Awards Logo"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-6">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]" />
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-normal tracking-tight leading-none" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              <span className="bg-gradient-to-r from-green-300 via-green-200 to-green-400 bg-clip-text text-transparent">
                Thank You!
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-xl mx-auto leading-relaxed font-body">
              Your votes has been successfully submitted and finalized. Your voice matters in the gaming community!
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-red-primary hover:bg-red-secondary text-white px-8 py-6 text-lg font-semibold rounded-full shadow-[0_0_30px_rgba(229,9,20,0.4)] hover:shadow-[0_0_40px_rgba(229,9,20,0.6)] transition-all duration-300 transform hover:scale-105 font-body mr-4"
            >
              <Link href="/vote/summary">
                <Star className="mr-3 h-6 w-6" />
                View Your Votes
              </Link>
            </Button>
            {appUser?.is_admin && (
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-white/20 hover:border-red-primary/50 text-white hover:text-red-primary px-8 py-6 text-lg font-semibold rounded-full hover:shadow-[0_0_20px_rgba(229,9,20,0.2)] transition-all duration-300 transform hover:scale-105 font-body"
              >
                <Link href="/results">
                  <Trophy className="mr-3 h-6 w-6" />
                  See Results
                </Link>
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container py-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <Button asChild>
            <Link href="/vote">Back to Voting</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { prevCategory, nextCategory } = getNavigationInfo()

  // Compact layout for all categories - optimized for smaller cards
  const getLayoutClasses = (count: number) => {
    if (count === 1) {
      return {
        container: 'flex justify-center',
        item: 'w-full max-w-xs'
      }
    }
    
    // Compact grid layout for all categories (2+ nominees)
    // Fixed 6-column layout like the design
    const gridCols = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
    
    return {
      container: `grid ${gridCols} justify-center`,
      item: ''
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Simple Header */}
        <div className="flex items-center justify-between mb-4">
          <Button asChild variant="outline" className="border-white/20 hover:border-red-primary/50">
            <Link href="/vote">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          
          <div className="flex items-center gap-4 text-sm text-foreground-muted">
            <span>{currentIndex + 1} of {allCategories.length}</span>
          </div>
        </div>

        {/* Category Title - Compact */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            {category.name}
          </h1>
          
          {category.description && (
            <p className="text-sm text-foreground-muted max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>

        {/* Nominees Section - Compact */}
        <motion.div 
          className={`${getLayoutClasses(category.nominees.length).container} gap-1 sm:gap-2 md:gap-3 max-w-6xl mx-auto justify-items-center`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {category.nominees.map((nominee: Nominee, index: number) => (
            <motion.div
              key={nominee.id}
              variants={itemVariants}
              className={`${getLayoutClasses(category.nominees.length).item} w-full`}
            >
              <NomineeCard
                id={nominee.id}
                name={nominee.name}
                description={nominee.description || undefined}
                imageUrl={nominee.image_url || undefined}
                isSelected={selectedNominee === nominee.id}
                isVoted={currentVote?.nominee_id === nominee.id}
                priority={index < 4}
                index={index}
                onClick={() => {
                  if (!submitting) {
                    setSelectedNominee(nominee.id)
                    setJustVoted(false)
                  }
                }}
                className={submitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Compact Action Section - Reduced spacing for better button visibility */}
        <div className="flex flex-col items-center gap-3 mt-6 pt-4 border-t border-white/10">
          {/* Navigation hint - Compact */}
          <div className="text-xs text-foreground-muted text-center">
            {prevCategory && (
              <Link 
                href={`/vote/category/${prevCategory.slug}`}
                className="text-red-primary hover:text-red-secondary transition-colors mr-3"
              >
                ← Previous: {prevCategory.name}
              </Link>
            )}
            {nextCategory && (
              <span className="text-foreground-muted">
                Next: {nextCategory.name} →
              </span>
            )}
          </div>

          {/* Main action button */}
          <Button
            onClick={handleVoteAndNavigate}
            disabled={!selectedNominee || submitting}
            size="lg"
            className={`min-w-[200px] px-8 py-3 font-semibold transition-all duration-300 ${
              justVoted 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-red-primary hover:bg-red-secondary text-white disabled:opacity-50'
            }`}
          >
            {submitting ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                {justVoted ? 'Saved! Going to next...' : 'Saving vote...'}
              </div>
            ) : justVoted ? (
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Vote Saved!
              </div>
            ) : nextCategory ? (
              <div className="flex items-center">
                Submit & Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            ) : (
              <div className="flex items-center">
                Submit & Finish
                <Check className="h-4 w-4 ml-2" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
