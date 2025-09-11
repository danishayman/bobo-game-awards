'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/auth-context'
import { Category } from '@/lib/types/database'
import { CheckCircle, Clock, Users, Trophy, Vote, Target } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin h-12 w-12 border-2 border-red-primary border-t-transparent rounded-full mx-auto" />
            <div className="absolute inset-0 h-12 w-12 border-2 border-red-primary/20 rounded-full mx-auto"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Loading Categories</h3>
            <p className="text-white/60">Preparing your voting dashboard...</p>
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background-secondary">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-primary/30 bg-red-primary/10 text-red-primary text-sm font-semibold">
              <Vote className="w-4 h-4" />
              Gaming Awards 2024
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Cast Your Votes</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Vote for your favorite games in each category. You can change your votes until you finalize your ballot.
            </p>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-red-primary/20 bg-gradient-to-r from-red-primary/5 to-red-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 rounded-xl bg-red-primary/20">
                  <Target className="h-6 w-6 text-red-primary" />
                </div>
                Your Voting Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">
                    {userVotes.length} / {categories.length}
                  </div>
                  <div className="text-white/70">Categories completed</div>
                  
                  {/* Progress Bar */}
                  <div className="w-full sm:w-64 bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-primary to-red-secondary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(userVotes.length / categories.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/vote/summary">Review Votes</Link>
                  </Button>
                  {userVotes.length > 0 && (
                    <Button asChild variant="premium" size="sm">
                      <Link href="/vote/finalize">Finalize Ballot</Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Choose Your Categories</h2>
            <p className="text-white/60">Click on any category to start voting</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category) => {
              const hasVoted = hasVotedInCategory(category.id)
              const votingStatus = getVotingStatus(category)
              
              return (
                <motion.div key={category.id} variants={itemVariants}>
                  <Card className="group relative overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(229,9,20,0.2)] border-white/20 hover:border-red-primary/50 transition-all duration-300">
                    {/* Top Accent Line */}
                    <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-300 ${
                      hasVoted 
                        ? 'bg-gradient-to-r from-green-500 to-green-600' 
                        : votingStatus.status === 'active'
                          ? 'bg-gradient-to-r from-red-primary to-red-secondary opacity-0 group-hover:opacity-100'
                          : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`} />

                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-red-primary/20">
                            <Trophy className="h-5 w-5 text-red-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-white group-hover:text-red-primary transition-colors">
                              {category.name}
                            </CardTitle>
                            <div className="flex gap-2 mt-2">
                              <Badge variant={votingStatus.color as any}>
                                {votingStatus.label}
                              </Badge>
                              {hasVoted && (
                                <Badge variant="success">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Voted
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-white/70 leading-relaxed">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between">
                        {votingStatus.status === 'upcoming' ? (
                          <div className="flex items-center text-sm text-white/60">
                            <Clock className="h-4 w-4 mr-2" />
                            Starts {new Date(category.voting_start!).toLocaleDateString()}
                          </div>
                        ) : votingStatus.status === 'ended' ? (
                          <div className="text-sm text-white/60">
                            Voting has ended
                          </div>
                        ) : (
                          <div className="text-sm text-white/60">
                            {category.voting_end 
                              ? `Ends ${new Date(category.voting_end).toLocaleDateString()}`
                              : 'No end date set'
                            }
                          </div>
                        )}
                        
                        <Button 
                          asChild 
                          variant={hasVoted ? "outline" : "premium"}
                          size="sm"
                          disabled={votingStatus.status !== 'active'}
                          className="group-hover:scale-105 transition-transform"
                        >
                          <Link href={`/vote/category/${category.slug}`}>
                            {hasVoted ? 'Change Vote' : 'Vote Now'}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
