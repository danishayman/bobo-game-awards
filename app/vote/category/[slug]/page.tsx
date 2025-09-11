'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/auth-context'
import { CategoryWithNominees, Nominee } from '@/lib/types/database'
import { ArrowLeft, ArrowRight, Check, Trophy } from 'lucide-react'

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

      // Fetch all categories for navigation (ordered by display_order)
      const allCategoriesRes = await fetch('/api/categories')
      const allCategoriesData = await allCategoriesRes.json()
      
      // Fetch current user vote for this category
      const votesRes = await fetch(`/api/votes?category=${slug}`)
      const votesData = await votesRes.json()

      setCategory(categoryData.category)
      
      // Categories are already ordered by display_order and filtered for active ones from the API
      setAllCategories(allCategoriesData.categories || [])
      
      const currentVoteForCategory = votesData.votes?.[0]
      if (currentVoteForCategory) {
        setCurrentVote(currentVoteForCategory.nominee_id)
        setSelectedNominee(currentVoteForCategory.nominee_id)
      }

      // Find current category index
      const index = (allCategoriesData.categories || []).findIndex((cat: any) => cat.slug === slug) ?? 0
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
      <div className="container py-8 justify-items-center">
        <div className="flex items-center justify-items-center min-h-[400px]">
          <div className="text-center space-y-4 justify-items-center">
            <div className="animate-spin h-8 w-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
            <p>Loading category...</p>
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

  // Dynamic grid calculation based on nominee count - optimized for smaller cards
  const getGridCols = (count: number) => {
    if (count <= 2) return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2'
    if (count <= 3) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3'
    if (count <= 4) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
    if (count <= 6) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
  }

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

        <div className="relative container mx-auto px-4 py-12 lg:py-20">
          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
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
          <div className="text-center space-y-6 mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in-up">
              <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-red-primary" />
              <h1 className="text-responsive-title font-bold bg-gradient-to-r from-white via-white to-red-primary bg-clip-text text-transparent text-center sm:text-left">
                {category.name.toUpperCase()}
              </h1>
            </div>
            
            {category.description && (
              <p className="text-foreground-muted text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                {category.description}
              </p>
            )}

            {/* Tell Others to Vote Button */}
            <div className="pt-6">
              <Button 
                variant="outline" 
                className="border-red-primary/50 text-red-primary hover:bg-red-primary hover:text-white transition-all duration-300"
              >
                TELL OTHERS TO VOTE
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Nominees Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className={`grid ${getGridCols(category.nominees.length)} gap-3 lg:gap-4`}>
          {category.nominees.map((nominee: Nominee, index: number) => (
            <div
              key={nominee.id}
              className={`group relative cursor-pointer animate-slide-in-up ${
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
                      className={`w-full text-xs py-1.5 ${
                        selectedNominee === nominee.id
                          ? 'bg-red-primary hover:bg-red-secondary text-white'
                          : 'bg-background-tertiary border border-white/20 text-white hover:bg-red-primary hover:border-red-primary'
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
        <div className="flex flex-col lg:flex-row items-center justify-between pt-16 border-t border-white/10 mt-16 gap-6">
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
