'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/auth-context'
import { Category } from '@/lib/types/database'
import { CheckCircle, Clock, Users } from 'lucide-react'

export default function VotePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [userVotes, setUserVotes] = useState<any[]>([])
  const [ballot, setBallot] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(true)

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
      // Fetch categories
      const categoriesRes = await fetch('/api/categories')
      const categoriesData = await categoriesRes.json()
      
      // Fetch user votes
      const votesRes = await fetch('/api/votes')
      const votesData = await votesRes.json()
      
      // Fetch ballot status
      const ballotRes = await fetch('/api/ballot/status')
      const ballotData = await ballotRes.json()

      setCategories(categoriesData.categories || [])
      setUserVotes(votesData.votes || [])
      setBallot(ballotData.ballot)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const hasVotedInCategory = (categoryId: string) => {
    return userVotes.some(vote => vote.category_id === categoryId)
  }

  const getVotingStatus = (category: Category) => {
    const now = new Date()
    
    if (category.voting_start && new Date(category.voting_start) > now) {
      return { status: 'upcoming', label: 'Upcoming', color: 'secondary' }
    }
    
    if (category.voting_end && new Date(category.voting_end) < now) {
      return { status: 'ended', label: 'Ended', color: 'destructive' }
    }
    
    return { status: 'active', label: 'Active', color: 'default' }
  }

  if (loading || loadingData) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
            <p>Loading voting categories...</p>
          </div>
        </div>
      </div>
    )
  }

  if (ballot?.is_final) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h1 className="text-3xl font-bold">Thank You for Voting!</h1>
            <p className="text-muted-foreground text-lg">
              Your ballot has been successfully submitted and finalized.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button asChild>
              <Link href="/vote/summary">View Your Votes</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/results">See Results</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Cast Your Votes</h1>
        <p className="text-muted-foreground">
          Vote for your favorite games in each category. You can change your votes until you finalize your ballot.
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Voting Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Categories voted: {userVotes.length} / {categories.length}</span>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/vote/summary">Review Votes</Link>
              </Button>
              {userVotes.length > 0 && (
                <Button asChild size="sm">
                  <Link href="/vote/finalize">Finalize Ballot</Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const hasVoted = hasVotedInCategory(category.id)
          const votingStatus = getVotingStatus(category)
          
          return (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={votingStatus.color as any}>
                      {votingStatus.label}
                    </Badge>
                    {hasVoted && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Voted
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {votingStatus.status === 'upcoming' ? (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      Starts {new Date(category.voting_start!).toLocaleDateString()}
                    </div>
                  ) : votingStatus.status === 'ended' ? (
                    <div className="text-sm text-muted-foreground">
                      Voting has ended
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {category.voting_end 
                        ? `Ends ${new Date(category.voting_end).toLocaleDateString()}`
                        : 'No end date set'
                      }
                    </div>
                  )}
                  
                  <Button 
                    asChild 
                    variant={hasVoted ? "outline" : "default"}
                    size="sm"
                    disabled={votingStatus.status !== 'active'}
                  >
                    <Link href={`/vote/category/${category.slug}`}>
                      {hasVoted ? 'Change Vote' : 'Vote Now'}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
