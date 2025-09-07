'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type Nominee } from '@/lib/supabase'
import { Trophy, Users } from 'lucide-react'
import Image from 'next/image'

interface ResultData {
  nominee: Nominee
  voteCount: number
  percentage: number
}

interface ResultsChartProps {
  title: string
  description: string
  results: ResultData[]
  totalVotes: number
  showAnimation?: boolean
}

export function ResultsChart({ 
  title, 
  description, 
  results, 
  totalVotes,
  showAnimation = true 
}: ResultsChartProps) {
  const [animationProgress, setAnimationProgress] = useState(0)

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setAnimationProgress(100)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setAnimationProgress(100)
    }
  }, [showAnimation])

  // Sort results by vote count (highest first)
  const sortedResults = [...results].sort((a, b) => b.voteCount - a.voteCount)
  const winner = sortedResults[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Category Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="text-base">{description}</CardDescription>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {sortedResults.map((result, index) => (
          <motion.div
            key={result.nominee.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card className={`relative ${index === 0 && result.voteCount > 0 ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    {index === 0 && result.voteCount > 0 ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 text-white font-bold"
                      >
                        <Trophy className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground font-bold text-lg">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Nominee Image */}
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={result.nominee.image_url}
                        alt={result.nominee.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">
                          {result.nominee.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {result.nominee.description}
                        </p>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className="text-2xl font-bold">
                          {result.percentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {result.voteCount} {result.voteCount === 1 ? 'vote' : 'votes'}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <Progress 
                        value={(result.percentage * animationProgress) / 100} 
                        className="h-3"
                      />
                    </div>
                  </div>
                </div>

                {/* Winner Badge */}
                {index === 0 && result.voteCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className="absolute top-4 right-4"
                  >
                    <Badge variant="success" className="text-xs">
                      <Trophy className="h-3 w-3 mr-1" />
                      Winner
                    </Badge>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {results.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No votes yet for this category.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}



