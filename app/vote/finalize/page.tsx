'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/lib/auth/auth-context'
import { AlertTriangle, CheckCircle, Vote } from 'lucide-react'

export default function FinalizeBallotPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [votes, setVotes] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [ballot, setBallot] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [finalizing, setFinalizing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchData()
    }
  }, [user, loading])

  const fetchData = async () => {
    try {
      const [votesRes, categoriesRes, ballotRes] = await Promise.all([
        fetch('/api/votes'),
        fetch('/api/categories'),
        fetch('/api/ballot/status')
      ])

      const votesData = await votesRes.json()
      const categoriesData = await categoriesRes.json()
      const ballotData = await ballotRes.json()

      setVotes(votesData.votes || [])
      setCategories(categoriesData.categories || [])
      setBallot(ballotData.ballot)

      // If ballot is already finalized, redirect
      if (ballotData.ballot?.is_final) {
        router.push('/vote')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleFinalize = async () => {
    setFinalizing(true)
    try {
      const response = await fetch('/api/ballot/finalize', {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to finalize ballot')
      }

      router.push('/vote')
    } catch (error) {
      console.error('Error finalizing ballot:', error)
      alert('Failed to finalize ballot. Please try again.')
    } finally {
      setFinalizing(false)
    }
  }

  const getVoteForCategory = (categoryId: string) => {
    return votes.find(vote => vote.category_id === categoryId)
  }

  const votedCategories = votes.length
  const totalCategories = categories.length
  const completionPercentage = totalCategories > 0 ? (votedCategories / totalCategories) * 100 : 0

  if (loading || loadingData) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
            <p>Loading ballot...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Finalize Your Ballot</h1>
        <p className="text-muted-foreground">
          Review your votes before submitting your final ballot. Once finalized, you cannot make changes.
        </p>
      </div>

      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Voting Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Categories completed:</span>
              <span className="font-semibold">{votedCategories} / {totalCategories}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            {votedCategories < totalCategories && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You haven't voted in all categories yet. You can still finalize your ballot, 
                  but you won't be able to vote in the remaining categories afterward.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vote Summary */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Your Votes</h2>
        
        {votes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">You haven't cast any votes yet.</p>
              <Button asChild className="mt-4">
                <Link href="/vote">Start Voting</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {categories.map((category) => {
              const vote = getVoteForCategory(category.id)
              
              return (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      {vote ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {vote ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{vote.nominees?.name}</p>
                          <p className="text-sm text-muted-foreground">Your choice</p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/vote/category/${category.slug}`}>
                            Change
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground">No vote cast</p>
                        <Button asChild size="sm">
                          <Link href={`/vote/category/${category.slug}`}>
                            Vote Now
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Finalization Actions */}
      {votes.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="text-orange-800 dark:text-orange-200">
              Ready to Finalize?
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Once you finalize your ballot, you will not be able to make any changes to your votes.
              Make sure you're satisfied with all your choices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href="/vote">Continue Voting</Link>
              </Button>
              <Button 
                onClick={handleFinalize}
                disabled={finalizing}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {finalizing ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Finalizing...
                  </div>
                ) : (
                  'Finalize Ballot'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
