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
  Calendar, 
  Share2, 
  Download,
  ExternalLink,
  Clock,
  Star,
  Medal,
  ChevronRight,
  Eye
} from 'lucide-react'

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
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
  const [categories, setCategories] = useState<any[]>([])

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Gaming Awards 2024 Ballot',
          text: `I've cast my votes for the Gaming Awards 2024! Check out the results.`,
          url: window.location.origin + '/results'
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.origin + '/results')
      alert('Results link copied to clipboard!')
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin h-12 w-12 border-2 border-red-primary border-t-transparent rounded-full mx-auto" />
            <div className="absolute inset-0 h-12 w-12 border-2 border-red-primary/20 rounded-full mx-auto"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Loading Your Ballot</h3>
            <p className="text-white/60">Gathering your votes...</p>
          </div>
        </div>
      </div>
    )
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
                You haven't cast any votes yet. Start voting to see your ballot summary here.
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
  const completionPercentage = totalCategories > 0 ? (votedCategories / totalCategories) * 100 : 0

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
              <Trophy className="w-4 h-4" />
              Your Gaming Awards 2024 Ballot
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Vote Summary</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {ballot?.is_final 
                ? "Your finalized ballot for the Gaming Awards 2024" 
                : "Review your current votes before finalizing"
              }
            </p>
          </div>
        </motion.div>

        {/* Ballot Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`border-2 ${ballot?.is_final 
            ? 'border-green-500/50 bg-gradient-to-r from-green-500/10 to-green-600/10' 
            : 'border-orange-500/50 bg-gradient-to-r from-orange-500/10 to-orange-600/10'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${ballot?.is_final 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {ballot?.is_final ? <CheckCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">
                      {ballot?.is_final ? 'Ballot Finalized' : 'Ballot in Progress'}
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {ballot?.is_final 
                        ? `Submitted on ${new Date(ballot.submitted_at!).toLocaleDateString()}`
                        : `${votedCategories} of ${totalCategories} categories completed`
                      }
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant={ballot?.is_final ? "success" : "secondary"} 
                  className="text-sm px-3 py-1"
                >
                  {ballot?.is_final ? 'Final' : 'Draft'}
                </Badge>
              </div>
              
              {!ballot?.is_final && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(completionPercentage)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-primary to-red-secondary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </CardHeader>
            
            {!ballot?.is_final && (
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/vote">
                      <Vote className="mr-2 h-4 w-4" />
                      Continue Voting
                    </Link>
                  </Button>
                  {votes.length > 0 && (
                    <Button asChild variant="premium" size="sm">
                      <Link href="/vote/finalize">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Finalize Ballot
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Your Votes */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Your Votes</h2>
            <p className="text-white/60">
              {ballot?.is_final 
                ? "Your final selections for each category"
                : "Your current selections - you can still make changes"
              }
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {votes.map((vote, index) => {
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
                      <div className="flex items-start justify-between">
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
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Voted
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Nominee Selection */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-3">
                          {vote.nominees.image_url && (
                            <img 
                              src={vote.nominees.image_url} 
                              alt={vote.nominees.name}
                              className="w-12 h-12 rounded-lg object-cover bg-white/10"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-lg">{vote.nominees.name}</h4>
                            {vote.nominees.description && (
                              <p className="text-white/60 text-sm mt-1 line-clamp-2">
                                {vote.nominees.description}
                              </p>
                            )}
                          </div>
                          <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                        </div>
                      </div>
                      
                      {/* Vote Details */}
                      <div className="flex items-center justify-between text-sm text-white/60">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Voted {new Date(vote.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        {!ballot?.is_final && (
                          <Button 
                            asChild 
                            variant="ghost" 
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Link href={`/vote/category/${vote.categories.slug}`}>
                              <span className="mr-1">Change</span>
                              <ChevronRight className="h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
        >
          <Button asChild variant="premium" size="lg" className="text-lg px-8 py-4">
            <Link href="/results">
              <Eye className="mr-2 h-5 w-5" />
              View Results
            </Link>
          </Button>
          
          <Button 
            onClick={handleShare}
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-4"
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share Ballot
          </Button>
          
          {!ballot?.is_final && (
            <Button asChild variant="ghost" size="lg" className="text-lg px-8 py-4">
              <Link href="/vote">
                <Vote className="mr-2 h-5 w-5" />
                Back to Voting
              </Link>
            </Button>
          )}
        </motion.div>

        {/* Missing Categories Alert */}
        {!ballot?.is_final && votedCategories < totalCategories && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
