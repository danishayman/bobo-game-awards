'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function StartVotingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      startVotingFlow()
    }
  }, [user, loading])

  const startVotingFlow = async () => {
    try {
      // Fetch categories ordered by display_order
      const response = await fetch('/api/categories')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch categories')
      }

      const categories = data.categories || []

      if (categories.length === 0) {
        router.push('/vote')
        return
      }

      // Redirect to first category (categories are already ordered by display_order from API)
      router.push(`/vote/category/${categories[0].slug}`)
    } catch (error) {
      console.error('Error starting voting flow:', error)
      router.push('/vote')
    }
  }

  return (
    <div className="flex items-center justify-center relative overflow-hidden py-20 min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <motion.div 
        className="relative text-center space-y-8 px-6 max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="relative w-20 h-20">
            <Image
              src="/logo.webp"
              alt="Bobo Game Awards Logo"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative">
            <div className="animate-spin h-12 w-12 border-2 border-red-primary border-t-transparent rounded-full mx-auto" />
            <div className="absolute inset-0 h-12 w-12 border-2 border-red-primary/20 rounded-full mx-auto"></div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-2"
        >
          <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            Starting Your Voting Journey
          </h3>
          <p className="text-white/60 font-body">Preparing categories in the perfect order...</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
