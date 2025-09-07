'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/shared/navigation'
import { ResultsChart } from '@/components/results/results-chart'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { getAllResults, getVotingSettings, DatabaseError } from '@/lib/db-queries'
import { type Category, type Nominee } from '@/lib/supabase'
import { Trophy, BarChart3, AlertCircle, Loader2, Lock, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface ResultData {
  nominee: Nominee
  voteCount: number
  percentage: number
}

interface CategoryResults {
  category: Category
  results: ResultData[]
}

export default function ResultsPage() {
  const [results, setResults] = useState<{ [categoryId: string]: CategoryResults }>({})
  const [votingSettings, setVotingSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [resultsData, settingsData] = await Promise.all([
        getAllResults(),
        getVotingSettings()
      ])
      
      setResults(resultsData)
      setVotingSettings(settingsData)
    } catch (error) {
      console.error('Failed to load results:', error)
      setError(error instanceof DatabaseError ? error.message : 'Failed to load results')
      toast.error('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  // Calculate total votes across all categories
  const totalVotes = Object.values(results).reduce((total, categoryResult) => {
    return total + categoryResult.results.reduce((sum, result) => sum + result.voteCount, 0)
  }, 0)

  // Check if results should be visible
  const isVotingOpen = votingSettings?.voting_open
  const votingEndDate = votingSettings?.voting_end_date ? new Date(votingSettings.voting_end_date) : null
  const isVotingEnded = votingEndDate ? new Date() > votingEndDate : false
  const canViewResults = !isVotingOpen || isVotingEnded

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading results...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Results</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadResults}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show locked message if voting is still open
  if (!canViewResults) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6"
              >
                <Lock className="w-10 h-10 text-muted-foreground" />
              </motion.div>
              
              <h1 className="text-3xl md:text-4xl font-bold">
                Results Coming Soon
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Results will be available once voting has ended. Keep checking back!
              </p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardContent className="py-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="outline">
                      Voting Status: Open
                    </Badge>
                  </div>
                  {votingEndDate && (
                    <div className="text-sm text-muted-foreground">
                      Voting ends: {votingEndDate.toLocaleDateString()} at {votingEndDate.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-x-4">
              <Button asChild>
                <a href="/vote">Continue Voting</a>
              </Button>
              <Button variant="outline" onClick={loadResults}>
                <Eye className="h-4 w-4 mr-2" />
                Check Again
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  const categories = Object.values(results)

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
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Voting Results</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how the community voted across all categories in the Community Gaming Awards.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">{categories.length}</div>
                  <div className="text-muted-foreground">Categories</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">
                    {categories.reduce((sum, cat) => sum + cat.results.length, 0)}
                  </div>
                  <div className="text-muted-foreground">Nominees</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">{totalVotes}</div>
                  <div className="text-muted-foreground">Total Votes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results by Category */}
        {categories.length > 0 ? (
          <div className="space-y-12">
            {categories.map((categoryResult, index) => {
              const categoryTotalVotes = categoryResult.results.reduce(
                (sum, result) => sum + result.voteCount, 
                0
              )
              
              return (
                <motion.div
                  key={categoryResult.category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <ResultsChart
                    title={categoryResult.category.name}
                    description={categoryResult.category.description}
                    results={categoryResult.results}
                    totalVotes={categoryTotalVotes}
                    showAnimation={true}
                  />
                </motion.div>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Results Available</h2>
              <p className="text-muted-foreground">
                No voting data available yet. Results will appear once voting begins.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center space-y-4 pt-8"
        >
          <Card>
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4">Thank You for Participating!</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                These results represent the voice of the gaming community. 
                Thank you to everyone who participated in the Community Gaming Awards.
              </p>
              <div className="flex justify-center space-x-4">
                <Button asChild variant="outline">
                  <a href="/vote">View My Votes</a>
                </Button>
                <Button onClick={loadResults}>
                  Refresh Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
