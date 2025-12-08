'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NomineeCard } from '@/components/ui/nominee-card'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import { Trophy, Users, GamepadIcon, AlertTriangle } from 'lucide-react'
import type { CategoryWithNominees } from '@/lib/types/database'

export default function NomineesPage() {
  const [categories, setCategories] = useState<CategoryWithNominees[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategoriesWithNominees()
  }, [])

  const fetchCategoriesWithNominees = async () => {
    try {
      const response = await fetch('/api/categories?include_nominees=true')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch categories and nominees')
      }

      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories and nominees:', error)
      setError(error instanceof Error ? error.message : 'Failed to load nominees')
    } finally {
      setLoading(false)
    }
  }

  const getTotalNominees = () => {
    return categories.reduce((total, category) => total + (category.nominees?.length || 0), 0)
  }

  if (loading) {
    return <PageSkeleton variant="nominees" />
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto" />
          <h1 className="text-2xl font-bold">Error Loading Nominees</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {error}
          </p>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center space-y-4">
          <GamepadIcon className="h-16 w-16 text-gray-400 mx-auto" />
          <h1 className="text-2xl font-bold">No Nominees Available</h1>
          <p className="text-muted-foreground">
            No categories or nominees are available at this time.
          </p>
        </div>
      </div>
    )
  }

  const totalNominees = getTotalNominees()

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-purple-400 via-red-primary to-orange-400 bg-clip-text text-transparent">
          Gaming Awards Nominees
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover all the incredible games nominated across every category in our community-driven gaming awards
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-white/20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Categories</CardTitle>
            <Trophy className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{categories.length}</div>
            <p className="text-xs text-white/60">
              Award categories
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-white/20 bg-gradient-to-br from-red-900/20 to-orange-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Nominees</CardTitle>
            <GamepadIcon className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalNominees}</div>
            <p className="text-xs text-white/60">
              Games nominated
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-white/20 bg-gradient-to-br from-green-900/20 to-teal-900/20 md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Average per Category</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {categories.length > 0 ? Math.round(totalNominees / categories.length) : 0}
            </div>
            <p className="text-xs text-white/60">
              Nominees per category
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories and Nominees */}
      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category.id} className="space-y-6">
            {/* Category Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                <Trophy className="h-8 w-8 text-purple-400" />
                {category.name}
              </h2>
              {category.description && (
                <p className="text-white/70 text-lg max-w-3xl mx-auto">
                  {category.description}
                </p>
              )}
              <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                <span>{category.nominees?.length || 0} nominees</span>
                {category.voting_start && category.voting_end && (
                  <span>•</span>
                )}
                {category.voting_start && category.voting_end && (
                  <span>
                    Voting: {new Date(category.voting_start).toLocaleDateString()} - {new Date(category.voting_end).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Nominees Grid */}
            {category.nominees && category.nominees.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3 md:gap-6">
                {category.nominees
                  .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                  .map((nominee) => (
                    <div key={nominee.id} className="w-[calc(33.333%-0.5rem)] sm:w-[calc(33.333%-0.5rem)] md:w-[calc(25%-1.125rem)] lg:w-[calc(20%-1.2rem)] xl:w-[calc(16.666%-1.25rem)]">
                      <NomineeCard
                      id={nominee.id}
                      name={nominee.name}
                      description={nominee.description || undefined}
                      imageUrl={nominee.image_url || undefined}
                      showGlow={false}
                      className="hover:scale-105 transition-transform duration-200"
                    />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <GamepadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-white/60">No nominees available for this category yet.</p>
              </div>
            )}

            {/* Divider */}
            {category !== categories[categories.length - 1] && (
              <div className="flex items-center justify-center pt-8">
                <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-white/60 pt-8">
        <p>Ready to vote? Visit the voting page to cast your ballot for your favorite games!</p>
      </div>
    </div>
  )
}
