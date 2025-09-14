'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/auth-context'
import { Trophy, Users, Clock, Crown, Shield } from 'lucide-react'

interface ResultNominee {
  nominee_id: string
  nominee_name: string
  vote_count: number
}

interface CategoryResult {
  category_id: string
  category_name: string
  category_slug: string
  nominees: ResultNominee[]
}

export default function ResultsPage() {
  const { appUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [results, setResults] = useState<CategoryResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!authLoading) {
      if (!appUser || !appUser.is_admin) {
        router.push('/')
        return
      }
      fetchResults()
    }
  }, [appUser, authLoading, router])

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch results')
      }

      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Error fetching results:', error)
      setError(error instanceof Error ? error.message : 'Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const getTotalVotes = () => {
    return results.reduce((total, category) => {
      return total + category.nominees.reduce((catTotal, nominee) => catTotal + nominee.vote_count, 0)
    }, 0)
  }

  const getWinner = (nominees: ResultNominee[]) => {
    return nominees.reduce((winner, nominee) => 
      nominee.vote_count > winner.vote_count ? nominee : winner
    )
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 1: return 'text-gray-600 bg-gray-50 border-gray-200'
      case 2: return 'text-amber-600 bg-amber-50 border-amber-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  // Show loading while checking auth or loading results
  if (authLoading || loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
            <p>{authLoading ? 'Checking permissions...' : 'Loading results...'}</p>
          </div>
        </div>
      </div>
    )
  }

  // Show access denied for non-admin users (fallback, should redirect before this)
  if (!appUser?.is_admin) {
    return (
      <div className="container py-8">
        <div className="text-center space-y-4">
          <Shield className="h-16 w-16 text-red-400 mx-auto" />
          <h1 className="text-2xl font-bold">Access Restricted</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Results are only available to administrators. Please contact an admin if you believe this is an error.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center space-y-4">
          <Clock className="h-16 w-16 text-gray-400 mx-auto" />
          <h1 className="text-2xl font-bold">Results Not Available</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {error === 'Results not yet available' 
              ? 'Voting is still ongoing. Results will be available after the voting period ends.'
              : error
            }
          </p>
          {appUser?.is_admin && (
            <p className="text-sm text-purple-600">
              As an admin, you can view live results in the admin dashboard.
            </p>
          )}
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center space-y-4">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto" />
          <h1 className="text-2xl font-bold">No Results Available</h1>
          <p className="text-muted-foreground">
            No voting results are available at this time.
          </p>
        </div>
      </div>
    )
  }

  const totalVotes = getTotalVotes()

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter">
          Gaming Awards Results
        </h1>
        <p className="text-muted-foreground text-lg">
          Community choice winners across all categories
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
            <p className="text-xs text-muted-foreground">
              Award categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Winners</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
            <p className="text-xs text-muted-foreground">
              Games crowned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results by Category */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center">Category Winners</h2>
        
        <div className="grid gap-8">
          {results.map((category) => {
            const sortedNominees = [...category.nominees].sort((a, b) => b.vote_count - a.vote_count)
            const winner = sortedNominees[0]
            const totalCategoryVotes = category.nominees.reduce((sum, nom) => sum + nom.vote_count, 0)

            return (
              <Card key={category.category_id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Trophy className="h-6 w-6 text-purple-600" />
                    {category.category_name}
                  </CardTitle>
                  <CardDescription>
                    {totalCategoryVotes.toLocaleString()} total votes cast
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {sortedNominees.map((nominee, index) => {
                      const percentage = totalCategoryVotes > 0 
                        ? (nominee.vote_count / totalCategoryVotes) * 100 
                        : 0
                      
                      return (
                        <div 
                          key={nominee.nominee_id}
                          className={`relative p-4 border-b last:border-b-0 ${
                            index === 0 ? 'bg-yellow-50/50 dark:bg-yellow-950/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className={`${getRankColor(index)} font-bold min-w-[2rem] justify-center`}
                              >
                                #{index + 1}
                              </Badge>
                              <div>
                                <h3 className={`font-semibold ${index === 0 ? 'text-lg' : ''}`}>
                                  {nominee.nominee_name}
                                  {index === 0 && (
                                    <Crown className="inline h-4 w-4 ml-2 text-yellow-600" />
                                  )}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {nominee.vote_count.toLocaleString()} votes ({percentage.toFixed(1)}%)
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Vote percentage bar */}
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                index === 0 ? 'bg-yellow-500' : 'bg-purple-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Results are updated in real-time as votes are cast.</p>
        {appUser?.is_admin && (
          <p className="mt-1 text-purple-600">
            Admin view: You can see results even during active voting periods.
          </p>
        )}
      </div>
    </div>
  )
}
