'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NomineeCard } from '@/components/ui/nominee-card'
import { useAuth } from '@/lib/auth/auth-context'
import { CategoryWithNominees, Nominee } from '@/lib/types/database'
import { ArrowLeft, ArrowRight, Check, Trophy, Vote } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function CategoryVotePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [category, setCategory] = useState<CategoryWithNominees | null>(null)
  const [selectedNominee, setSelectedNominee] = useState<string | null>(null)
  const [currentVote, setCurrentVote] = useState<string | null>(null)
  const [allCategories, setAllCategories] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadingData, setLoadingData] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user && slug) {
      fetchData()
    }
  }, [user, loading, slug])

  const fetchData = async () => {
    try {
      // Fetch category with nominees
      const categoryRes = await fetch(`/api/categories/${slug}`)
      const categoryData = await categoryRes.json()
      
      if (!categoryRes.ok) {
        throw new Error(categoryData.error || 'Failed to fetch category')
      }

      // Fetch all categories for navigation
      const allCategoriesRes = await fetch('/api/categories')
      const allCategoriesData = await allCategoriesRes.json()
      
      // Fetch current user vote for this category
      const votesRes = await fetch(`/api/votes?category=${slug}`)
      const votesData = await votesRes.json()

      setCategory(categoryData.category)
      setAllCategories(allCategoriesData.categories || [])
      
      const currentVoteForCategory = votesData.votes?.[0]
      if (currentVoteForCategory) {
        setCurrentVote(currentVoteForCategory.nominee_id)
        setSelectedNominee(currentVoteForCategory.nominee_id)
      }

      // Find current category index
      const index = allCategoriesData.categories?.findIndex((cat: any) => cat.slug === slug) ?? 0
      setCurrentIndex(index)
    } catch (error) {
      console.error('Error fetching data:', error)
      router.push('/vote')
    } finally {
      setLoadingData(false)
    }
  }

  const handleVote = async () => {
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

      setCurrentVote(selectedNominee)
      
      // Navigate to next category or back to vote overview
      const nextCategory = allCategories[currentIndex + 1]
      if (nextCategory) {
        router.push(`/vote/category/${nextCategory.slug}`)
      } else {
        router.push('/vote')
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin h-12 w-12 border-2 border-red-primary border-t-transparent rounded-full mx-auto" />
            <div className="absolute inset-0 h-12 w-12 border-2 border-red-primary/20 rounded-full mx-auto"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Loading Category</h3>
            <p className="text-white/60">Preparing your voting experience...</p>
          </div>
        </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background-secondary">
      <div className="container py-8 space-y-8">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/vote">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Categories
            </Link>
          </Button>
          
          <div className="text-sm text-white/60 font-medium bg-background-secondary px-4 py-2 rounded-full border border-white/10">
            Category {currentIndex + 1} of {allCategories.length}
          </div>
        </motion.div>

        {/* Category Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 text-center"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-primary/10 border border-red-primary/30">
              <Trophy className="h-8 w-8 text-red-primary" />
              <div className="text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{category.name}</h1>
                {category.description && (
                  <p className="text-white/70 text-lg mt-1">{category.description}</p>
                )}
              </div>
            </div>
          </div>
          
          {currentVote && (
            <Badge variant="success" className="text-base px-4 py-2">
              <Check className="h-4 w-4 mr-2" />
              You have voted in this category
            </Badge>
          )}
        </motion.div>

        {/* Nominees Grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Choose your favorite</h2>
            <p className="text-white/60">Select the game that deserves this award the most</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {category.nominees.map((nominee: Nominee) => (
              <motion.div key={nominee.id} variants={itemVariants}>
                <NomineeCard
                  id={nominee.id}
                  name={nominee.name}
                  description={nominee.description || undefined}
                  imageUrl={nominee.image_url || undefined}
                  isSelected={selectedNominee === nominee.id}
                  isVoted={currentVote === nominee.id}
                  onClick={() => setSelectedNominee(nominee.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between pt-8 border-t border-white/10"
        >
          <div className="flex gap-3">
            {prevCategory && (
              <Button asChild variant="outline" size="lg">
                <Link href={`/vote/category/${prevCategory.slug}`}>
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">{prevCategory.name}</span>
                  <span className="sm:hidden">Previous</span>
                </Link>
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleVote}
              disabled={!selectedNominee || submitting}
              variant="premium"
              size="lg"
              className="min-w-[140px]"
            >
              {submitting ? (
                <div className="flex items-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Saving...
                </div>
              ) : currentVote === selectedNominee ? (
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Vote Saved
                </div>
              ) : (
                <div className="flex items-center">
                  <Vote className="h-5 w-5 mr-2" />
                  Save Vote
                </div>
              )}
            </Button>

            {nextCategory && (
              <Button asChild variant="outline" size="lg">
                <Link href={`/vote/category/${nextCategory.slug}`}>
                  <span className="hidden sm:inline">{nextCategory.name}</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
