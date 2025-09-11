'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth/auth-context'
import { Category } from '@/lib/types/database'
import { CheckCircle, Vote, Target, Award, Star } from 'lucide-react'
import Image from 'next/image'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
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


  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center relative overflow-hidden py-20 min-h-screen">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <motion.div 
          className="relative text-center space-y-8 px-6 max-w-md mx-auto"
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
                className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="relative">
              <div className="animate-spin h-12 w-12 border-2 border-red-primary border-t-transparent rounded-full mx-auto" />
              <div className="absolute inset-0 h-12 w-12 border-2 border-red-primary/20 rounded-full mx-auto"></div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-2">
            <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              Loading Your Voting Dashboard
            </h3>
            <p className="text-white/60 font-body">Preparing categories and your voting progress...</p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (ballot?.is_final) {
    return (
      <div className="flex items-center justify-center relative overflow-hidden py-20 min-h-screen">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <motion.div 
          className="relative text-center space-y-12 px-6 max-w-2xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="relative w-24 h-24">
              <Image
                src="/logo.webp"
                alt="Bobo Game Awards Logo"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-6">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]" />
            <h1 className="text-5xl md:text-6xl font-normal tracking-tight leading-none" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              <span className="bg-gradient-to-r from-green-300 via-green-200 to-green-400 bg-clip-text text-transparent">
                Thank You!
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-xl mx-auto leading-relaxed font-body">
              Your ballot has been successfully submitted and finalized. Your voice matters in the gaming community!
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-red-primary hover:bg-red-secondary text-white px-8 py-6 text-lg font-semibold rounded-full shadow-[0_0_30px_rgba(229,9,20,0.4)] hover:shadow-[0_0_40px_rgba(229,9,20,0.6)] transition-all duration-300 transform hover:scale-105 font-body mr-4"
            >
              <Link href="/vote/summary">
                <Star className="mr-3 h-6 w-6" />
                View Your Votes
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-white/20 hover:border-red-primary/50 text-white hover:text-red-primary px-8 py-6 text-lg font-semibold rounded-full hover:shadow-[0_0_20px_rgba(229,9,20,0.2)] transition-all duration-300 transform hover:scale-105 font-body"
            >
              <Link href="/results">
                <Trophy className="mr-3 h-6 w-6" />
                See Results
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center relative overflow-hidden py-20 min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Main Content */}
      <motion.div 
        className="relative w-full max-w-7xl mx-auto px-6 space-y-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative w-20 h-20 md:w-24 md:h-24">
              <Image
                src="/logo.webp"
                alt="Bobo Game Awards Logo"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                priority
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-none" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                Cast Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-300 via-red-200 to-red-400 bg-clip-text text-transparent">
                Votes
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-body mt-6">
              Vote for your favorite games in each category. You can change your votes until you finalize your ballot.
            </p>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div variants={itemVariants}>
          <Card className="border-red-primary/20 bg-gradient-to-r from-red-primary/5 to-red-secondary/5 backdrop-blur-sm shadow-[0_0_30px_rgba(229,9,20,0.1)] hover:shadow-[0_0_40px_rgba(229,9,20,0.2)] transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-xl" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                <div className="p-3 rounded-xl bg-red-primary/20 shadow-[0_0_20px_rgba(229,9,20,0.3)]">
                  <Target className="h-6 w-6 text-red-primary" />
                </div>
                Your Voting Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="text-4xl font-normal text-white" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                    <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                      {userVotes.length}
                    </span>
                    <span className="text-white/60"> / {categories.length}</span>
                  </div>
                  <div className="text-white/70 font-body">Categories completed</div>
                  
                  {/* Progress Bar */}
                  <div className="w-full lg:w-80 bg-white/10 rounded-full h-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-red-primary to-red-secondary h-3 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(229,9,20,0.5)]"
                      style={{ width: `${(userVotes.length / categories.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg"
                    className="border-white/20 hover:border-red-primary/50 text-white hover:text-red-primary px-6 py-3 rounded-full hover:shadow-[0_0_20px_rgba(229,9,20,0.2)] transition-all duration-300 transform hover:scale-105 font-body"
                  >
                    <Link href="/vote/summary">
                      <Star className="mr-2 h-5 w-5" />
                      Review Votes
                    </Link>
                  </Button>
                  {userVotes.length > 0 && (
                    <Button 
                      asChild 
                      size="lg"
                      className="bg-red-primary hover:bg-red-secondary text-white px-6 py-3 rounded-full shadow-[0_0_30px_rgba(229,9,20,0.4)] hover:shadow-[0_0_40px_rgba(229,9,20,0.6)] transition-all duration-300 transform hover:scale-105 font-body"
                    >
                      <Link href="/vote/finalize">
                        <Award className="mr-2 h-5 w-5" />
                        Finalize Ballot
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Start Voting Section */}
        <motion.div variants={itemVariants} className="text-center space-y-8">
          <Card className="border-red-primary/20 bg-gradient-to-r from-red-primary/5 to-red-secondary/5 backdrop-blur-sm shadow-[0_0_30px_rgba(229,9,20,0.1)] hover:shadow-[0_0_40px_rgba(229,9,20,0.2)] transition-all duration-300 max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-red-primary/20 shadow-[0_0_20px_rgba(229,9,20,0.3)]">
                    <Vote className="h-12 w-12 text-red-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-normal" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                    <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                      Ready to Vote?
                    </span>
                  </h2>
                  <p className="text-white/70 font-body text-lg leading-relaxed max-w-lg mx-auto">
                    Start the guided voting experience and go through each category one by one. You can change your votes anytime before finalizing.
                  </p>
                </div>
                <Button 
                  asChild 
                  size="lg"
                  className="bg-red-primary hover:bg-red-secondary text-white px-8 py-6 text-xl font-semibold rounded-full shadow-[0_0_30px_rgba(229,9,20,0.4)] hover:shadow-[0_0_40px_rgba(229,9,20,0.6)] transition-all duration-300 transform hover:scale-105 font-body"
                >
                  <Link href="/vote/start">
                    <Vote className="mr-3 h-6 w-6" />
                    Start Voting
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  )
}
