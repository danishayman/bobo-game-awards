'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/lib/auth/auth-context'
import { 
  CheckCircle, 
  Trophy, 
  Vote, 
  Clock,
  Star,
  Medal,
  ChevronRight,
  Edit
} from 'lucide-react'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import { Category } from '@/lib/types/database'
import Image from 'next/image'

interface VoteWithDetails {
  id: string
  category_id: string
  nominee_id: string
  created_at: string
  updated_at: string
  nominees: {
    name: string
    description: string | null
    image_url: string | null
  }
  categories: {
    name: string
    slug: string
    description: string | null
  }
}

interface BallotData {
  is_final: boolean
  submitted_at: string | null
  created_at: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  }
}

export default function VoteSummaryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [votes, setVotes] = useState<VoteWithDetails[]>([])
  const [ballot, setBallot] = useState<BallotData | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [finalizing, setFinalizing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchData()
    }
  }, [user, loading, router])

  const fetchData = async () => {
    try {
      const [votesRes, ballotRes, categoriesRes] = await Promise.all([
        fetch('/api/votes'),
        fetch('/api/ballot/status'),
        fetch('/api/categories')
      ])

      const votesData = await votesRes.json()
      const ballotData = await ballotRes.json()
      const categoriesData = await categoriesRes.json()

      setVotes(votesData.votes || [])
      setBallot(ballotData.ballot)
      setCategories(categoriesData.categories || [])
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

      const data = await response.json()

      if (!response.ok) {
        console.error('API Error:', data)
        throw new Error(data.error || 'Failed to finalize ballot')
      }

      console.log('✅ Ballot finalized successfully:', data)
      
      // Refresh data to show updated ballot status
      await fetchData()
      router.push('/vote')
    } catch (error: unknown) {
      console.error('Error finalizing ballot:', error)
      
      // Show more detailed error information
      const errorMessage = error instanceof Error ? error.message : 'Failed to finalize ballot. Please try again.'
      alert(`Failed to finalize ballot: ${errorMessage}`)
    } finally {
      setFinalizing(false)
    }
  }

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase()
    if (name.includes('year') || name.includes('game of')) return Trophy
    if (name.includes('indie')) return Star
    if (name.includes('multiplayer')) return Medal
    return Vote
  }

  if (loading || loadingData) {
    return <PageSkeleton variant="vote-summary" />
  }

  if (votes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-background-secondary">
        <div className="container py-8">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-full bg-red-primary/20 w-20 h-20 flex items-center justify-center mx-auto">
                <Vote className="h-10 w-10 text-red-primary" />
              </div>
              <h1 className="text-3xl font-bold text-white">No Votes Yet</h1>
              <p className="text-white/70 text-lg">
                You haven&rsquo;t cast any votes yet. Start voting to see your ballot summary here.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button asChild variant="premium" size="lg" className="text-lg px-8 py-4">
                <Link href="/vote">
                  <Vote className="mr-2 h-5 w-5" />
                  Start Voting
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const totalCategories = categories.length
  const votedCategories = votes.length

  return (
    <div className="bg-full-viewport bg-gradient-to-b from-background via-background to-background-secondary">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Vote Summary</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {ballot?.is_final 
                ? "Your finalized votes for the Bobo Gaming Awards 2025" 
                : "Review your current votes before finalizing"
              }
            </p>
          </div>
        </motion.div>


        {/* Your Votes */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {votes.map((vote) => {
              const IconComponent = getCategoryIcon(vote.categories.name)
              
              return (
                <motion.div
                  key={vote.id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="group"
                >
                  <Card className="h-full border-white/20 bg-gradient-to-br from-background-secondary/50 to-background-secondary/20 hover:border-red-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(229,9,20,0.15)]">
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-primary to-red-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-3 rounded-xl bg-red-primary/20 group-hover:bg-red-primary/30 transition-colors">
                            <IconComponent className="h-6 w-6 text-red-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-white group-hover:text-red-primary transition-colors">
                              {vote.categories.name}
                            </CardTitle>
                            <CardDescription className="text-white/60 mt-1">
                              {vote.categories.description}
                            </CardDescription>
                          </div>
                        </div>
                        {!ballot?.is_final && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="border-white/20 hover:border-red-primary/50 hover:bg-red-primary/10"
                          >
                            <Link href={`/vote/category/${vote.categories.slug}`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Change
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Nominee Selection */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-3">
                          {vote.nominees.image_url && (
                            <Image 
                              src={vote.nominees.image_url} 
                              alt={vote.nominees.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-lg object-cover bg-white/10"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-lg">{vote.nominees.name}</h4>
                          </div>
                          <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>


        {/* Finalize Ballot Section */}
        {!ballot?.is_final && votes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-orange-500/50 bg-gradient-to-r from-orange-500/10 to-orange-600/10">
              <CardHeader>
                <CardTitle className="text-orange-200 text-xl text-center">
                  Ready to Finalize Your Votes?
                </CardTitle>
                <CardDescription className="text-orange-300 text-center">
                  Once you finalize, you won&rsquo;t be able to make any changes to your votes.
                  {votedCategories < totalCategories && (
                    ` You still have ${totalCategories - votedCategories} categories left to vote in, but you can finalize now if you&rsquo;re satisfied with your current choices.`
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleFinalize}
                    disabled={finalizing}
                    variant="premium"
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {finalizing ? (
                      <div className="flex items-center">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Finalizing Votes...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Finalize Votes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Missing Categories Alert */}
        {!ballot?.is_final && votedCategories < totalCategories && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Alert className="border-orange-500/50 bg-orange-500/10">
              <Clock className="h-4 w-4 text-orange-400" />
              <AlertDescription className="text-orange-200">
                You have {totalCategories - votedCategories} categories left to vote in. 
                <Link href="/vote" className="font-semibold hover:underline ml-1">
                  Continue voting →
                </Link>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>
    </div>
  )
}
