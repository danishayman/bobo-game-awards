'use client'

import { motion, Variants } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CardSkeleton } from '@/components/ui/card-skeleton'
import { SkeletonPulse } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

interface PageSkeletonProps {
  variant: 'vote-dashboard' | 'vote-summary' | 'category-vote' | 'admin-dashboard' | 'results' | 'finalize' | 'nominees'
  className?: string
}

export function PageSkeleton({ variant, className }: PageSkeletonProps) {
  if (variant === 'vote-dashboard') {
    return (
      <div className={cn("flex items-center justify-center relative overflow-hidden py-20 min-h-screen", className)}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <motion.div 
          className="relative w-full max-w-7xl mx-auto px-6 space-y-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center space-y-8">
            <div className="flex justify-center">
              <SkeletonPulse className="w-20 h-20 md:w-24 md:h-24 rounded-full" variant="shimmer" />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <SkeletonPulse className="h-16 md:h-20 lg:h-24 w-80 mx-auto" variant="shimmer" />
                <SkeletonPulse className="h-16 md:h-20 lg:h-24 w-60 mx-auto" variant="shimmer" />
              </div>
              <SkeletonPulse className="h-6 w-96 mx-auto mt-6" variant="shimmer" />
            </div>
          </motion.div>

          {/* Start Voting Card */}
          <motion.div variants={itemVariants} className="text-center space-y-8">
            <Card className="border-red-primary/20 bg-gradient-to-r from-red-primary/5 to-red-secondary/5 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-6">
                  <SkeletonPulse className="w-20 h-20 rounded-full mx-auto" variant="shimmer" />
                  <div className="space-y-4">
                    <SkeletonPulse className="h-10 w-64 mx-auto" variant="shimmer" />
                    <SkeletonPulse className="h-5 w-96 mx-auto" variant="shimmer" />
                    <SkeletonPulse className="h-5 w-80 mx-auto" variant="shimmer" />
                  </div>
                  <SkeletonPulse className="h-12 w-40 rounded-full mx-auto" variant="shimmer" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress Card */}
          <motion.div variants={itemVariants}>
            <Card className="border-red-primary/20 bg-gradient-to-r from-red-primary/5 to-red-secondary/5 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <SkeletonPulse className="w-12 h-12 rounded-xl" variant="shimmer" />
                  <SkeletonPulse className="h-6 w-48" variant="shimmer" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-4">
                    <SkeletonPulse className="h-12 w-32" variant="shimmer" />
                    <SkeletonPulse className="h-4 w-40" variant="shimmer" />
                    <SkeletonPulse className="w-80 h-3 rounded-full" variant="shimmer" />
                  </div>
                  <div className="flex gap-4">
                    <SkeletonPulse className="h-10 w-32 rounded-full" variant="shimmer" />
                    <SkeletonPulse className="h-10 w-36 rounded-full" variant="shimmer" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (variant === 'vote-summary') {
    return (
      <div className={cn("min-h-screen bg-gradient-to-b from-background via-background to-background-secondary", className)}>
        <div className="container py-8 space-y-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="space-y-4">
              <SkeletonPulse className="w-64 h-8 rounded-full mx-auto" variant="shimmer" />
              <SkeletonPulse className="h-12 w-80 mx-auto" variant="shimmer" />
              <SkeletonPulse className="h-6 w-96 mx-auto" variant="shimmer" />
            </div>
          </motion.div>

          {/* Ballot Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-orange-500/50 bg-gradient-to-r from-orange-500/10 to-orange-600/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SkeletonPulse className="w-12 h-12 rounded-xl" variant="shimmer" />
                    <div className="space-y-2">
                      <SkeletonPulse className="h-6 w-48" variant="shimmer" />
                      <SkeletonPulse className="h-4 w-64" variant="shimmer" />
                    </div>
                  </div>
                  <SkeletonPulse className="w-16 h-6 rounded-full" variant="shimmer" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <SkeletonPulse className="h-4 w-16" variant="shimmer" />
                    <SkeletonPulse className="h-4 w-8" variant="shimmer" />
                  </div>
                  <SkeletonPulse className="w-full h-2 rounded-full" variant="shimmer" />
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Vote Cards */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <SkeletonPulse className="h-8 w-32 mx-auto" variant="shimmer" />
              <SkeletonPulse className="h-5 w-80 mx-auto" variant="shimmer" />
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <CardSkeleton variant="vote" count={4} />
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <SkeletonPulse className="h-12 w-40 rounded-full" variant="shimmer" />
            <SkeletonPulse className="h-12 w-36 rounded-full" variant="shimmer" />
            <SkeletonPulse className="h-12 w-44 rounded-full" variant="shimmer" />
          </motion.div>
        </div>
      </div>
    )
  }

  if (variant === 'category-vote') {
    return (
      <div className={cn("container py-8", className)}>
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <SkeletonPulse className="w-48 h-8 rounded-full mx-auto" variant="shimmer" />
            <SkeletonPulse className="h-12 w-80 mx-auto" variant="shimmer" />
            <SkeletonPulse className="h-6 w-96 mx-auto" variant="shimmer" />
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <SkeletonPulse key={i} className="w-8 h-8 rounded-full" variant="shimmer" />
            ))}
          </div>

          {/* Nominees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton variant="nominee" count={6} />
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <SkeletonPulse className="h-10 w-24 rounded" variant="shimmer" />
            <SkeletonPulse className="h-10 w-24 rounded" variant="shimmer" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'admin-dashboard') {
    return (
      <div className={cn("container py-8 space-y-8", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonPulse className="h-8 w-64" variant="shimmer" />
            <SkeletonPulse className="h-5 w-96" variant="shimmer" />
          </div>
          <SkeletonPulse className="h-10 w-32 rounded" variant="shimmer" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <SkeletonPulse className="h-4 w-24" variant="shimmer" />
                <SkeletonPulse className="w-4 h-4 rounded" variant="shimmer" />
              </CardHeader>
              <CardContent>
                <SkeletonPulse className="h-8 w-16 mb-2" variant="shimmer" />
                <SkeletonPulse className="h-3 w-20" variant="shimmer" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <SkeletonPulse className="h-7 w-32" variant="shimmer" />
            <SkeletonPulse className="h-8 w-24 rounded" variant="shimmer" />
          </div>
          
          <div className="grid gap-4">
            <CardSkeleton variant="admin" count={3} />
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <SkeletonPulse className="h-6 w-32" variant="shimmer" />
            <SkeletonPulse className="h-4 w-48" variant="shimmer" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SkeletonPulse className="h-10 w-full rounded" variant="shimmer" />
              <SkeletonPulse className="h-10 w-full rounded" variant="shimmer" />
              <SkeletonPulse className="h-10 w-full rounded" variant="shimmer" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (variant === 'results') {
    return (
      <div className={cn("container py-8 space-y-8", className)}>
        {/* Header */}
        <div className="text-center space-y-4">
          <SkeletonPulse className="h-12 w-96 mx-auto" variant="shimmer" />
          <SkeletonPulse className="h-6 w-80 mx-auto" variant="shimmer" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <SkeletonPulse className="h-4 w-24" variant="shimmer" />
                <SkeletonPulse className="w-4 h-4 rounded" variant="shimmer" />
              </CardHeader>
              <CardContent>
                <SkeletonPulse className="h-8 w-16 mb-2" variant="shimmer" />
                <SkeletonPulse className="h-3 w-20" variant="shimmer" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Results Section */}
        <div className="space-y-8">
          <SkeletonPulse className="h-8 w-48 mx-auto" variant="shimmer" />
          
          <div className="grid gap-8">
            <CardSkeleton variant="result" count={3} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <SkeletonPulse className="h-4 w-80 mx-auto" variant="shimmer" />
          <SkeletonPulse className="h-4 w-96 mx-auto" variant="shimmer" />
        </div>
      </div>
    )
  }

  if (variant === 'finalize') {
    return (
      <div className={cn("container py-8 space-y-8", className)}>
        {/* Header */}
        <div className="space-y-4">
          <SkeletonPulse className="h-8 w-64" variant="shimmer" />
          <SkeletonPulse className="h-5 w-96" variant="shimmer" />
        </div>

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SkeletonPulse className="w-5 h-5 rounded" variant="shimmer" />
              <SkeletonPulse className="h-6 w-32" variant="shimmer" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <SkeletonPulse className="h-4 w-40" variant="shimmer" />
                <SkeletonPulse className="h-4 w-16" variant="shimmer" />
              </div>
              <SkeletonPulse className="w-full h-2 rounded-full" variant="shimmer" />
            </div>
          </CardContent>
        </Card>

        {/* Vote Summary */}
        <div className="space-y-6">
          <SkeletonPulse className="h-7 w-32" variant="shimmer" />
          
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <SkeletonPulse className="h-6 w-48" variant="shimmer" />
                    <SkeletonPulse className="w-5 h-5 rounded-full" variant="shimmer" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <SkeletonPulse className="h-5 w-32" variant="shimmer" />
                      <SkeletonPulse className="h-4 w-24" variant="shimmer" />
                    </div>
                    <SkeletonPulse className="h-8 w-20 rounded" variant="shimmer" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Card */}
        <Card className="border-orange-200 bg-orange-50/10">
          <CardHeader>
            <SkeletonPulse className="h-6 w-48" variant="shimmer" />
            <SkeletonPulse className="h-4 w-96" variant="shimmer" />
            <SkeletonPulse className="h-4 w-80" variant="shimmer" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <SkeletonPulse className="h-10 w-32 rounded" variant="shimmer" />
              <SkeletonPulse className="h-10 w-32 rounded" variant="shimmer" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (variant === 'nominees') {
    return (
      <div className={cn("container py-8 space-y-8", className)}>
        {/* Header */}
        <div className="text-center space-y-4">
          <SkeletonPulse className="h-12 w-96 mx-auto" variant="shimmer" />
          <SkeletonPulse className="h-6 w-[32rem] mx-auto" variant="shimmer" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <SkeletonPulse className="h-4 w-24" variant="shimmer" />
                <SkeletonPulse className="w-4 h-4 rounded" variant="shimmer" />
              </CardHeader>
              <CardContent>
                <SkeletonPulse className="h-8 w-16 mb-2" variant="shimmer" />
                <SkeletonPulse className="h-3 w-20" variant="shimmer" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories and Nominees */}
        <div className="space-y-12">
          {[...Array(3)].map((_, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6">
              {/* Category Header */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <SkeletonPulse className="h-8 w-8 rounded" variant="shimmer" />
                  <SkeletonPulse className="h-8 w-64" variant="shimmer" />
                </div>
                <SkeletonPulse className="h-5 w-96 mx-auto" variant="shimmer" />
                <div className="flex items-center justify-center gap-4">
                  <SkeletonPulse className="h-4 w-20" variant="shimmer" />
                  <SkeletonPulse className="h-4 w-1" variant="shimmer" />
                  <SkeletonPulse className="h-4 w-32" variant="shimmer" />
                </div>
              </div>

              {/* Nominees Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
                <CardSkeleton variant="nominee" count={6} />
              </div>

              {/* Divider */}
              {categoryIndex !== 2 && (
                <div className="flex items-center justify-center pt-8">
                  <SkeletonPulse className="w-32 h-px" variant="shimmer" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <SkeletonPulse className="h-4 w-80 mx-auto" variant="shimmer" />
        </div>
      </div>
    )
  }

  return null
}
