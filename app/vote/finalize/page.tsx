'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth/auth-context'
import { CheckCircle, Trophy, Award, Star, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PageSkeleton } from '@/components/ui/page-skeleton'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

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
}

export default function FinalizePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [finalizing, setFinalizing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
  }, [user, loading, router])

  const handleFinalize = async () => {
    setFinalizing(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ballot/finalize', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to finalize ballot')
      }

      setSuccess(true)
      
      // Redirect to main vote page after a short delay
      setTimeout(() => {
        router.push('/vote')
      }, 2000)
      
    } catch (error: unknown) {
      console.error('Error finalizing ballot:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setFinalizing(false)
    }
  }

  if (loading) {
    return <PageSkeleton variant="vote-dashboard" />
  }

  if (success) {
    return (
      <div className="flex items-center justify-center relative overflow-hidden py-20 min-h-screen">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-green-500/10 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-green-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
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
                Ballot Finalized!
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-xl mx-auto leading-relaxed font-body">
              Your votes have been successfully submitted and finalized. Thank you for participating in the Gaming Awards 2025!
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-white/60 text-sm">
            Redirecting you back to the main page...
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center relative overflow-hidden py-20 bg-full-viewport bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <motion.div 
        className="relative w-full max-w-2xl mx-auto px-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center space-y-8 mb-12">
          <div className="flex justify-center">
            <div className="relative w-20 h-20 md:w-24 md:h-24">
              <Image
                src="/logo.webp"
                alt="Bobo Game Awards Logo"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                priority
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-none" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              <span className="bg-gradient-to-r from-red-300 via-red-200 to-red-400 bg-clip-text text-transparent">
                Finalize Your Ballot
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto leading-relaxed font-body">
              You&rsquo;re about to finalize your Bobo Gaming Awards 2025 votes. Once finalized, you won&rsquo;t be able to make any changes to your votes.
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-red-primary/20 bg-gradient-to-r from-red-primary/5 to-red-secondary/5 backdrop-blur-sm shadow-[0_0_30px_rgba(229,9,20,0.1)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl justify-center" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                <div className="p-3 rounded-xl bg-red-primary/20 shadow-[0_0_20px_rgba(229,9,20,0.3)]">
                  <Trophy className="h-8 w-8 text-red-primary" />
                </div>
                Final Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Error finalizing ballot</p>
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}

              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <p className="text-white/80 font-body text-lg">
                    Are you sure you want to finalize your ballot? This action cannot be undone.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-white/20 hover:border-red-primary/50 text-white hover:text-red-primary px-8 py-6 text-lg font-semibold rounded-full hover:shadow-[0_0_20px_rgba(229,9,20,0.2)] transition-all duration-300 transform hover:scale-105 font-body"
                    >
                      <Link href="/vote/summary">
                        <Star className="mr-3 h-6 w-6" />
                        Review Votes
                      </Link>
                    </Button>
                    
                    <Button
                      onClick={handleFinalize}
                      disabled={finalizing}
                      size="lg"
                      className="bg-red-primary hover:bg-red-secondary text-white px-8 py-6 text-lg font-semibold rounded-full shadow-[0_0_30px_rgba(229,9,20,0.4)] hover:shadow-[0_0_40px_rgba(229,9,20,0.6)] transition-all duration-300 transform hover:scale-105 font-body"
                    >
                      {finalizing ? (
                        <div className="flex items-center">
                          <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mr-3" />
                          Finalizing...
                        </div>
                      ) : (
                        <>
                          <Award className="mr-3 h-6 w-6" />
                          Finalize Ballot
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
