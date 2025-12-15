'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/lib/auth/auth-context'
import { CategoryWithNominees, Nominee } from '@/lib/types/database'
import { ArrowLeft, ArrowRight, Check, Trophy, CheckCircle, Star } from 'lucide-react'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
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
  const [ballot, setBallot] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Cache categories in sessionStorage to avoid refetching
  const getCachedCategories = () => {
    try {
      const cached = sessionStorage.getItem('voting_categories')
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        // Cache valid for 5 minutes
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          return data
        }
      }
    } catch (e) {
      console.error('Error reading categories cache:', e)
    }
    return null
  }

  const setCachedCategories = (categories: any[]) => {
    try {
      sessionStorage.setItem('voting_categories', JSON.stringify({
        data: categories,
        timestamp: Date.now()
      }))
    } catch (e) {
      console.error('Error setting categories cache:', e)
    }
  }

  useEffect(() => {
    // Detect device type
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    setLoadingData(true)
    try {
      // Check if categories are cached
      const cachedCategories = getCachedCategories()
      
      // Prepare parallel requests - skip categories fetch if cached
      const requests = [
        fetch('/api/ballot/status'),
        fetch(`/api/categories/${slug}`),
        fetch(`/api/votes?category=${slug}`)
      ]
      
      if (!cachedCategories) {
        requests.push(fetch('/api/categories'))
      }

      // Fetch all data in parallel for much faster loading
      const responses = await Promise.all(requests)
      
      // Parse all responses in parallel
      const [ballotRes, categoryRes, votesRes, allCategoriesRes] = responses
      const parsedData = await Promise.all(
        responses.map(res => res.json())
      )
      
      const [ballotData, categoryData, votesData, allCategoriesData] = parsedData

      setBallot(ballotData.ballot)

      // If ballot is finalized, don't allow further voting
      if (ballotData.ballot?.is_final) {
        setLoadingData(false)
        return // Component will render thank you message
      }

      if (!categoryRes.ok) {
        throw new Error(categoryData.error || 'Failed to fetch category')
      }

      setCategory(categoryData.category)
      
      // Use cached categories or fresh data
      const categoriesData = cachedCategories || allCategoriesData?.categories || []
      
      // Cache categories if we just fetched them
      if (!cachedCategories && categoriesData.length > 0) {
        setCachedCategories(categoriesData)
      }
      
      // Reverse categories array so voting starts from the last category (highest display_order)
      const reversedCategories = [...categoriesData].reverse()
      setAllCategories(reversedCategories)
      
      const currentVoteForCategory = votesData.votes?.[0]
      if (currentVoteForCategory) {
        setCurrentVote(currentVoteForCategory.nominee_id)
        setSelectedNominee(currentVoteForCategory.nominee_id)
      } else {
        // Reset selection if no vote exists for this category
        setCurrentVote(null)
        setSelectedNominee(null)
      }

      // Find current category index in reversed array
      const index = reversedCategories.findIndex((cat: any) => cat.slug === slug) ?? 0
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
      
      // Navigate to next category or summary page if this is the last one
      const nextCategory = allCategories[currentIndex + 1]
      if (nextCategory) {
        router.push(`/vote/category/${nextCategory.slug}`)
      } else {
        // This was the last category, go to summary
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
    // Device-responsive skeleton count
    const skeletonCount = isMobile ? 4 : 6

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
        {/* Hero Header Skeleton */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-red-primary/20 via-transparent to-red-secondary/20" />
          </div>

          <div className="relative container mx-auto px-4 py-4 lg:py-6">
            {/* Navigation Skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
              <Skeleton className="h-10 w-40 bg-white/10" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-32 bg-white/10" />
                <Skeleton className="h-6 w-20 bg-white/10" />
              </div>
            </div>

            {/* Category Title Skeleton */}
            <div className="text-center space-y-3 mb-6">
              <Skeleton className="h-12 w-64 sm:w-96 mx-auto bg-white/10" />
              <Skeleton className="h-6 w-full max-w-3xl mx-auto bg-white/10" />
              <Skeleton className="h-6 w-3/4 max-w-2xl mx-auto bg-white/10" />
            </div>
          </div>
        </div>

        {/* Nominees Skeleton Section */}
        <div className="container mx-auto px-4 pb-6">
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4 max-w-[1400px] mx-auto">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <div
                key={index}
                className="w-[160px] sm:w-[180px] lg:w-[200px] animate-pulse"
              >
                <Card className="h-full flex flex-col overflow-hidden border-white/20 bg-background-secondary/50 backdrop-blur-sm">
                  {/* Image Skeleton */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden flex-shrink-0">
                    <Skeleton className="w-full h-full bg-white/5" />
                  </div>

                  {/* Content Skeleton */}
                  <CardHeader className="relative p-3 flex-1 flex flex-col justify-between min-h-[120px]">
                    {/* Vote Button Skeleton */}
                    <div className="text-center pt-2">
                      <Skeleton className="h-7 w-full bg-white/10" />
                    </div>

                    {/* Title and Description Skeleton */}
                    <div className="text-center pt-2 flex-1 flex flex-col justify-center space-y-2">
                      <Skeleton className="h-4 w-3/4 mx-auto bg-white/10" />
                      <Skeleton className="h-3 w-full mx-auto bg-white/10" />
                      <Skeleton className="h-3 w-5/6 mx-auto bg-white/10" />
                    </div>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex flex-col lg:flex-row items-center justify-between pt-6 border-t border-white/10 mt-6 gap-4">
            <Skeleton className="h-10 w-40 bg-white/10" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32 bg-white/10" />
              <Skeleton className="h-10 w-40 bg-white/10" />
            </div>
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
            <h1 className="text-5xl md:text-6xl font-normal tracking-tight leading-none" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              <span className="bg-gradient-to-r from-green-300 via-green-200 to-green-400 bg-clip-text text-transparent">
                Thank You!
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-xl mx-auto leading-relaxed font-body">
              Your ballot has been successfully submitted and finalized. Your voice matters in the gaming community!
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-red-primary/20 via-transparent to-red-secondary/20" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-4 lg:py-6">
          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <Button asChild variant="outline" className="border-white/20 hover:border-red-primary/50">
              <Link href="/vote">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Link>
            </Button>
            
            <div className="text-sm text-foreground-muted flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <span>Category {currentIndex + 1} of {allCategories.length}</span>
              {currentVote && (
                <Badge variant="outline" className="text-green-500 border-green-500/50 bg-green-500/10">
                  <Check className="h-3 w-3 mr-1" />
                  Voted
                </Badge>
              )}
            </div>
          </div>

          {/* Category Title */}
          <div className="text-center space-y-3 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in-up">
              <h1 className="text-responsive-title font-normal tracking-tight leading-none text-center sm:text-left" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                  {category.name}
                </span>
              </h1>
            </div>
            
            {category.description && (
              <p className="text-foreground-muted text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Nominees Section */}
      <div className="container mx-auto px-4 pb-6">
        <div className="flex flex-wrap justify-center gap-3 lg:gap-4 max-w-[1400px] mx-auto">
          {category.nominees.map((nominee: Nominee, index: number) => (
            <div
              key={nominee.id}
              className={`group relative cursor-pointer animate-slide-in-up w-[160px] sm:w-[180px] lg:w-[200px] ${
                index < 4 ? `animate-delay-${(index + 1) * 100}` : ''
              }`}
              onClick={() => setSelectedNominee(nominee.id)}
            >
              {/* Nominee Card */}
              <Card className={`h-full flex flex-col overflow-hidden border-white/20 bg-background-secondary/50 backdrop-blur-sm ${
                selectedNominee === nominee.id 
                  ? 'ring-2 ring-red-primary border-red-primary shadow-[0_0_40px_rgba(229,9,20,0.5)]' 
                  : ''
              }`}>
                {/* Selection Indicator */}
                {selectedNominee === nominee.id && (
                  <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-red-primary rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Image */}
                {nominee.image_url && (
                  <div className="relative w-full aspect-[3/4] overflow-hidden flex-shrink-0">
                    <Image
                      src={nominee.image_url}
                      alt={nominee.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    
                  </div>
                )}

                {/* Content */}
                <CardHeader className="relative p-3 flex-1 flex flex-col justify-between min-h-[120px]">
                  {/* Accent Line */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${
                    selectedNominee === nominee.id 
                      ? 'bg-gradient-to-r from-red-primary to-red-secondary' 
                      : ''
                  }`} />

                  {/* Vote Button */}
                  <div className="text-center pt-2">
                    <Button
                      size="sm"
                      className={`w-full text-xs py-1.5 font-semibold transition-all duration-300 ${
                        selectedNominee === nominee.id
                          ? 'bg-red-primary hover:bg-red-secondary text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]'
                          : 'bg-white/10 border border-white/30 text-white hover:bg-red-primary/80 hover:border-red-primary hover:shadow-[0_0_10px_rgba(229,9,20,0.3)]'
                      }`}
                    >
                      VOTE
                    </Button>
                  </div>

                  <div className="text-center pt-2 flex-1 flex flex-col justify-center">
                    <CardTitle className={`text-sm lg:text-base font-bold leading-tight line-clamp-2 ${
                      selectedNominee === nominee.id ? 'text-red-primary' : 'text-white'
                    }`}>
                      {nominee.name}
                    </CardTitle>
                    
                    {nominee.description && (
                      <CardDescription className="text-foreground-muted mt-1 text-xs leading-tight line-clamp-2">
                        {nominee.description}
                      </CardDescription>
                    )}
                  </div>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row items-center justify-between pt-6 border-t border-white/10 mt-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 order-2 lg:order-1">
            {prevCategory && (
              <Button asChild variant="outline" className="border-white/20 hover:border-red-primary/50">
                <Link href={`/vote/category/${prevCategory.slug}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{prevCategory.name}</span>
                  <span className="sm:hidden">Previous</span>
                </Link>
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 order-1 lg:order-2 w-full lg:w-auto">
            <Button
              onClick={handleVote}
              disabled={!selectedNominee || submitting}
              className="min-w-[140px] bg-red-primary hover:bg-red-secondary text-white w-full sm:w-auto"
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Saving...
                </div>
              ) : !selectedNominee ? (
                'Save Vote'
              ) : currentVote === selectedNominee ? (
                'Vote Saved'
              ) : (
                'Save Vote'
              )}
            </Button>

            {nextCategory && (
              <Button asChild variant="outline" className="border-white/20 hover:border-red-primary/50 w-full sm:w-auto">
                <Link href={`/vote/category/${nextCategory.slug}`}>
                  <span className="hidden sm:inline">{nextCategory.name}</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
