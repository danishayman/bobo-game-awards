'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth/auth-context'
import { Trophy, Clock, Crown, Shield } from 'lucide-react'
import { PageSkeleton } from '@/components/ui/page-skeleton'

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

  // Show loading while checking auth or loading results
  if (authLoading || loading) {
    return <PageSkeleton variant="results" />
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

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Awards Results</h1>
        <p className="text-muted-foreground">
          Community winners
        </p>
      </div>

      {/* Results by Category */}
      <div className="grid gap-6 max-w-4xl mx-auto">
        {results.map((category) => {
          const sortedNominees = [...category.nominees].sort((a, b) => b.vote_count - a.vote_count)
          const winner = sortedNominees[0]

          return (
            <Card key={category.category_id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-purple-600" />
                  {category.category_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Winner */}
                  {winner && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/10 rounded-lg border border-yellow-200">
                      <Crown className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{winner.nominee_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {winner.vote_count.toLocaleString()} votes
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Other nominees */}
                  {sortedNominees.slice(1).map((nominee, index) => (
                    <div key={nominee.nominee_id} className="flex items-center justify-between py-2 px-3">
                      <span className="text-muted-foreground text-sm">#{index + 2}</span>
                      <span className="flex-1 px-3 truncate">{nominee.nominee_name}</span>
                      <span className="text-sm text-muted-foreground">
                        {nominee.vote_count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
