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
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
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

  return (
    <div className="container py-8 space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/vote">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Category {currentIndex + 1} of {allCategories.length}
        </div>
      </div>

      {/* Category Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground text-lg">{category.description}</p>
            )}
          </div>
        </div>
        
        {currentVote && (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Check className="h-3 w-3 mr-1" />
            You have voted in this category
          </Badge>
        )}
      </div>

      {/* Nominees Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Choose your favorite:</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.nominees.map((nominee: Nominee) => (
            <Card 
              key={nominee.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedNominee === nominee.id 
                  ? 'ring-2 ring-purple-600 bg-purple-50 dark:bg-purple-950/20' 
                  : ''
              }`}
              onClick={() => setSelectedNominee(nominee.id)}
            >
              <CardHeader className="pb-3">
                {nominee.image_url && (
                  <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                    <Image
                      src={nominee.image_url}
                      alt={nominee.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{nominee.name}</CardTitle>
                  {selectedNominee === nominee.id && (
                    <Check className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  )}
                </div>
                {nominee.description && (
                  <CardDescription>{nominee.description}</CardDescription>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex gap-2">
          {prevCategory && (
            <Button asChild variant="outline">
              <Link href={`/vote/category/${prevCategory.slug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {prevCategory.name}
              </Link>
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleVote}
            disabled={!selectedNominee || submitting}
            className="min-w-[120px]"
          >
            {submitting ? (
              <div className="flex items-center">
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
            <Button asChild variant="outline">
              <Link href={`/vote/category/${nextCategory.slug}`}>
                {nextCategory.name}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
