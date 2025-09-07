'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/shared/navigation'
import { Trophy, Users, Award, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { FloatingElements } from '@/components/shared/floating-elements'
import { SocialShare } from '@/components/shared/social-share'
import { CountdownTimer } from '@/components/shared/countdown-timer'
import { getVotingSettings } from '@/lib/db-queries'
import Link from 'next/link'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const [votingSettings, setVotingSettings] = useState<any>(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getVotingSettings()
        setVotingSettings(settings)
      } catch (error) {
        console.error('Failed to load voting settings:', error)
      }
    }
    loadSettings()
  }, [])

  const features = [
    {
      icon: Trophy,
      title: "Community Driven",
      description: "Vote for your favorite games chosen by the gaming community"
    },
    {
      icon: Users,
      title: "Fair Voting",
      description: "One vote per category per user ensures fairness"
    },
    {
      icon: Award,
      title: "Multiple Categories",
      description: "Vote across various game categories and genres"
    },
    {
      icon: Sparkles,
      title: "Real-time Results",
      description: "See live voting results with beautiful animations"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative">
      <FloatingElements />
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 mb-16"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6"
            >
              <Trophy className="w-10 h-10 text-primary" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Community Gaming
              <span className="text-primary"> Awards</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of gamers in voting for the best games of the year. 
              Your voice matters in celebrating the gaming community&apos;s favorites.
            </p>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            {status === 'authenticated' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <p className="text-lg text-primary font-medium">
                  Welcome back, {session?.user?.name}!
                </p>
                <Link href="/vote">
                  <Button size="lg" className="text-lg px-8 py-3 h-auto">
                    Start Voting
                    <Trophy className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <Button 
                  onClick={() => signIn()} 
                  size="lg" 
                  className="text-lg px-8 py-3 h-auto"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Loading...' : 'Sign In to Vote'}
                  <Trophy className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-muted-foreground">
                  Sign in with Google or Twitch to participate
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 mx-auto">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center space-y-8"
        >
          <h2 className="text-3xl font-bold">Join the Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10+</div>
              <div className="text-muted-foreground">Categories</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">Nominees</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">∞</div>
              <div className="text-muted-foreground">Possibilities</div>
            </div>
          </div>
        </motion.div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Countdown Timer */}
          <CountdownTimer
            endDate={votingSettings?.voting_end_date}
            isOpen={votingSettings?.voting_open || false}
          />

          {/* Social Share */}
          <SocialShare />
        </div>
      </main>
    </div>
  )
}