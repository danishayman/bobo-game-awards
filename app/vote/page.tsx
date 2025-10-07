'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth/auth-context'
import { Category, Vote as VoteType, Ballot } from '@/lib/types/database'
import { CheckCircle, Vote, Target, Award, Star, Trophy, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import { isVotingActive, canUserVote, isVotingLocked } from '@/lib/config/voting'
import { LiveVotingCountdown } from '@/components/ui/live-voting-countdown'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};


export default function VotePage() {
  const { user, appUser, loading } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [userVotes, setUserVotes] = useState<VoteType[]>([])
  const [ballot, setBallot] = useState<Ballot | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [votingActive, setVotingActive] = useState(true)
  const [userCanVote, setUserCanVote] = useState(true)
  const [votingLocked, setVotingLocked] = useState(false)

  useEffect(() => {
    // Check if voting is still active and if user can vote
    setVotingActive(isVotingActive())
    setVotingLocked(isVotingLocked())
    
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchData()
    }
  }, [user, loading, router])

  useEffect(() => {
    // Check if user can vote (considering admin status and voting lock)
    if (appUser) {
      setUserCanVote(canUserVote(appUser.is_admin))
    }
  }, [appUser])

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


  if (loading || loadingData) {
    return <PageSkeleton variant="vote-dashboard" />
  }

  // Show voting ended message if voting is no longer active
  if (!votingActive) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div 
            className="text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="relative w-20 h-20">
                <Image
                  src="/logo.webp"
                  alt="Bobo Game Awards Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-6">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
              <h1 className="text-4xl md:text-5xl font-bold text-red-500" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                Voting Has Ended
              </h1>
              <p className="text-lg text-foreground-muted max-w-xl mx-auto">
                The voting period has concluded. Thank you for your interest in the Bobo Game Awards!
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-red-primary hover:bg-red-secondary text-white px-8 py-3 font-semibold"
              >
                <Link href="/">
                  <Star className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
              {appUser?.is_admin && (
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-white/20 hover:border-red-primary/50 text-white hover:text-red-primary px-8 py-3 font-semibold"
                >
                  <Link href="/results">
                    <Trophy className="mr-2 h-5 w-5" />
                    See Results
                  </Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Show voting locked message with countdown if voting is locked and user is not admin
  if (votingLocked && !userCanVote) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div 
            className="text-center space-y-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="relative w-20 h-20">
                <Image
                  src="/logo.webp"
                  alt="Bobo Game Awards Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                Voting Opening Soon!
              </h1>
              <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
                Live voting hasn&apos;t started yet. Check back when the countdown reaches zero!
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <LiveVotingCountdown 
                onLiveVotingStarted={() => {
                  setVotingLocked(false)
                  setUserCanVote(true)
                }}
                className="max-w-2xl mx-auto"
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-red-primary hover:bg-red-secondary text-white px-8 py-3 font-semibold"
              >
                <Link href="/">
                  <Star className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (ballot?.is_final) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div 
            className="text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="relative w-20 h-20">
                <Image
                  src="/logo.webp"
                  alt="Bobo Game Awards Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                Thank You!
              </h1>
              <p className="text-lg text-foreground-muted max-w-xl mx-auto">
                Your votes have been successfully submitted and finalized. Your voice matters in the gaming community!
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-red-primary hover:bg-red-secondary text-white px-8 py-3 font-semibold"
              >
                <Link href="/vote/summary">
                  <Star className="mr-2 h-5 w-5" />
                  View Your Votes
                </Link>
              </Button>
              {appUser?.is_admin && (
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-white/20 hover:border-red-primary/50 text-white hover:text-red-primary px-8 py-3 font-semibold"
                >
                  <Link href="/results">
                    <Trophy className="mr-2 h-5 w-5" />
                    See Results
                  </Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          className="space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header Section - Simplified */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <Image
                  src="/logo.webp"
                  alt="Bobo Game Awards Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                Cast Your Votes
              </h1>
              
              <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
                Vote for your favorite games in each category. You can change your votes until you finalize your ballot.
              </p>

              {/* Admin early access notice */}
              {votingLocked && appUser?.is_admin && (
                <div className="inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                  <p className="text-yellow-300 text-sm font-medium">
                    🔓 Admin Early Access - Live voting opens for everyone soon!
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Progress Overview - Simplified */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Target className="h-5 w-5 text-red-primary" />
              <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                Your Voting Progress
              </h2>
            </div>
            
            <div className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              {userVotes.length}
              <span className="text-foreground-muted text-xl"> / {categories.length}</span>
            </div>
            
            <div className="text-foreground-muted">Categories completed</div>
            
            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto bg-white/10 rounded-full h-2">
              <div 
                className="bg-red-primary h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(userVotes.length / categories.length) * 100}%` }}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button 
                asChild 
                variant="outline" 
                className="border-white/20 hover:border-red-primary/50 text-white hover:text-red-primary"
              >
                <Link href="/vote/summary">
                  <Star className="mr-2 h-4 w-4" />
                  Review Votes
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Start Voting Section - Simplified */}
          <motion.div variants={itemVariants}>
            <Card className="border-white/10 bg-background-secondary/50 hover:border-red-primary/30 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-red-primary/20">
                      <Vote className="h-8 w-8 text-red-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                      Ready to Vote?
                    </h2>
                    <p className="text-foreground-muted leading-relaxed max-w-lg mx-auto">
                      Start the guided voting experience and go through each category one by one. You can change your votes anytime before finalizing.
                    </p>
                  </div>
                  
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-red-primary hover:bg-red-secondary text-white px-8 py-3 font-semibold transition-all duration-300"
                  >
                    <Link href="/vote/start">
                      <Vote className="mr-2 h-5 w-5" />
                      Start Voting
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
