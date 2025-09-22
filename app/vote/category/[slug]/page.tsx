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
import { useVotingData, usePrefetchVotingData } from '@/lib/hooks/use-voting-data'
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

  const [selectedNominee, setSelectedNominee] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [justVoted, setJustVoted] = useState(false)

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

  const handleVoteAndNavigate = async () => {
    if (!selectedNominee || !category) return

    setSubmitting(true)
    try {
      console.log('Submitting vote:', {
        category_id: category.id,
        nominee_id: selectedNominee,
        category_slug: category.slug
      })

      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category_id: category.id,
          nominee_id: selectedNominee,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Vote save failed:', {
          status: response.status,
          statusText: response.statusText,
          error: error
        })
        throw new Error(error.error || 'Failed to save vote')
      }

        setJustVoted(true)
        
        // Invalidate and refetch the voting data to get latest state
        // This will update the currentVote state from server
      
      // Small delay to show success state
      await new Promise(resolve => setTimeout(resolve, 800))
      
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

  // Dynamic layout calculation based on nominee count - 3 columns on mobile
  const getLayoutClasses = (count: number) => {
    if (count === 1) {
      return {
        container: 'flex justify-center',
        item: 'w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg'
      }
    }
    
    // Grid layout for multiple nominees - 3 cols on mobile, scaling up on larger screens
    let gridCols = ''
    if (count === 2) gridCols = 'grid-cols-2 sm:grid-cols-2'
    else if (count === 3) gridCols = 'grid-cols-3 sm:grid-cols-3 lg:grid-cols-3'
    else if (count === 4) gridCols = 'grid-cols-3 sm:grid-cols-2 lg:grid-cols-4'
    else if (count <= 6) gridCols = 'grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
    else gridCols = 'grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7'
    
    return {
      container: `grid ${gridCols}`,
      item: ''
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 py-8">
        {/* Simple Header */}
        <div className="flex items-center justify-between mb-8">
          <Button asChild variant="outline" className="border-white/20 hover:border-red-primary/50">
            <Link href="/vote">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          
          <div className="flex items-center gap-4 text-sm text-foreground-muted">
            <span>{currentIndex + 1} of {allCategories.length}</span>
            {(currentVote || justVoted) && (
              <Badge variant="outline" className="text-green-500 border-green-500/50 bg-green-500/10">
                <Check className="h-3 w-3 mr-1" />
                Voted
              </Badge>
            )}
          </div>
        </div>

        {/* Category Title - Simplified */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            {category.name}
          </h1>
          
          {category.description && (
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>

        {/* Nominees Section - Simplified */}
        <motion.div 
          className={`${getLayoutClasses(category.nominees.length).container} gap-2 sm:gap-3 md:gap-4`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {category.nominees.map((nominee: Nominee, index: number) => (
            <motion.div
              key={nominee.id}
              variants={itemVariants}
              className={getLayoutClasses(category.nominees.length).item}
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

        {/* Simplified Action Section */}
        <div className="flex flex-col items-center gap-6 mt-16 pt-8 border-t border-white/10">
          {/* Navigation hint */}
          <div className="text-sm text-foreground-muted text-center">
            {prevCategory && (
              <Link 
                href={`/vote/category/${prevCategory.slug}`}
                className="text-red-primary hover:text-red-secondary transition-colors mr-4"
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
