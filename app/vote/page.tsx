'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/shared/navigation'
import { CategorySection } from '@/components/voting/category-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { 
  getCategoriesWithNominees, 
  getUserVotes, 
  submitVote, 
  getVotingSettings,
  DatabaseError 
} from '@/lib/db-queries'
import { type Category, type Nominee, type Vote } from '@/lib/supabase'
import { Trophy, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Confetti } from '@/components/shared/confetti'
import toast from 'react-hot-toast'
import Countdown from 'react-countdown'

interface CategoryWithNominees extends Category {
  nominees: Nominee[]
}

export default function VotePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [categories, setCategories] = useState<CategoryWithNominees[]>([])
  const [userVotes, setUserVotes] = useState<Vote[]>([])
  const [votingSettings, setVotingSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // Load data
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      loadData()
    }
  }, [status, session?.user?.id])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [categoriesData, votesData, settingsData] = await Promise.all([
        getCategoriesWithNominees(),
        getUserVotes(session!.user.id),
        getVotingSettings()
      ])
      
      setCategories(categoriesData)
      setUserVotes(votesData)
      setVotingSettings(settingsData)
    } catch (error) {
      console.error('Failed to load voting data:', error)
      setError(error instanceof DatabaseError ? error.message : 'Failed to load voting data')
      toast.error('Failed to load voting data')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (categoryId: string, nomineeId: string) => {
    if (!session?.user?.id || submitting) return

    try {
      setSubmitting(true)
      await submitVote(session.user.id, categoryId, nomineeId)
      
      // Update local state
      const newVotes = userVotes.filter(v => v.category_id !== categoryId)
      newVotes.push({
        id: `temp-${Date.now()}`,
        user_id: session.user.id,
        category_id: categoryId,
        nominee_id: nomineeId,
        created_at: new Date().toISOString()
      })
      setUserVotes(newVotes)
      
      // Check if user has completed all categories
      if (newVotes.length === totalCategories && totalCategories > 0) {
        setShowConfetti(true)
      }
      
      toast.success('Vote submitted successfully!')
    } catch (error) {
      console.error('Failed to submit vote:', error)
      toast.error('Failed to submit vote')
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate voting progress
  const totalCategories = categories.length
  const votedCategories = userVotes.length
  const progressPercentage = totalCategories > 0 ? (votedCategories / totalCategories) * 100 : 0

  // Check if voting is open
  const isVotingOpen = votingSettings?.voting_open
  const votingEndDate = votingSettings?.voting_end_date ? new Date(votingSettings.voting_end_date) : null
  const isVotingEnded = votingEndDate ? new Date() > votingEndDate : false

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading voting data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Voting Data</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadData}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Countdown renderer
  const countdownRenderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return <span className="text-destructive">Voting has ended</span>
    } else {
      return (
        <span className="font-mono">
          {days > 0 && `${days}d `}
          {String(hours).padStart(2, '0')}:
          {String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </span>
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Cast Your Votes</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vote for your favorite games in each category. You can change your votes at any time.
          </p>
        </motion.div>

        {/* Voting Status */}
        <Card>
          <CardContent className="py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Voting Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {votedCategories}/{totalCategories}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Status</span>
                <div>
                  {!isVotingOpen || isVotingEnded ? (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Voting Closed
                    </Badge>
                  ) : (
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Voting Open
                    </Badge>
                  )}
                </div>
              </div>

              {/* Countdown */}
              {votingEndDate && isVotingOpen && !isVotingEnded && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Time Remaining</span>
                  </div>
                  <div className="text-lg font-mono">
                    <Countdown date={votingEndDate} renderer={countdownRenderer} />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        {categories.length > 0 ? (
          <div className="space-y-12">
            {categories.map((category) => {
              const userVote = userVotes.find(v => v.category_id === category.id)
              return (
                <CategorySection
                  key={category.id}
                  category={category}
                  nominees={category.nominees}
                  selectedNomineeId={userVote?.nominee_id}
                  onVote={handleVote}
                  disabled={submitting || !isVotingOpen || isVotingEnded}
                />
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Categories Available</h2>
              <p className="text-muted-foreground">
                Categories and nominees haven&apos;t been set up yet. Check back later!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Completion Message */}
        {totalCategories > 0 && votedCategories === totalCategories && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardContent className="py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                  All Votes Cast!
                </h2>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Thank you for participating in the Community Gaming Awards!
                </p>
                <Button asChild variant="outline">
                  <a href="/results">View Results</a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Confetti Animation */}
      <Confetti 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
    </div>
  )
}
