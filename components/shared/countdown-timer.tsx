'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Clock, Calendar } from 'lucide-react'
import Countdown from 'react-countdown'

interface CountdownTimerProps {
  endDate: string | null
  isOpen: boolean
  className?: string
}

export function CountdownTimer({ endDate, isOpen, className }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !endDate) return null

  const targetDate = new Date(endDate)
  const now = new Date()
  const isEnded = now > targetDate

  // Countdown renderer
  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed || isEnded) {
      return (
        <div className="text-center">
          <Badge variant="destructive">Voting Ended</Badge>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-primary/10 rounded-lg p-2">
          <div className="text-2xl font-bold text-primary">{days}</div>
          <div className="text-xs text-muted-foreground">Days</div>
        </div>
        <div className="bg-primary/10 rounded-lg p-2">
          <div className="text-2xl font-bold text-primary">{String(hours).padStart(2, '0')}</div>
          <div className="text-xs text-muted-foreground">Hours</div>
        </div>
        <div className="bg-primary/10 rounded-lg p-2">
          <div className="text-2xl font-bold text-primary">{String(minutes).padStart(2, '0')}</div>
          <div className="text-xs text-muted-foreground">Minutes</div>
        </div>
        <div className="bg-primary/10 rounded-lg p-2">
          <div className="text-2xl font-bold text-primary">{String(seconds).padStart(2, '0')}</div>
          <div className="text-xs text-muted-foreground">Seconds</div>
        </div>
      </div>
    )
  }

  if (!isOpen || isEnded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={className}
      >
        <Card>
          <CardContent className="py-6 text-center">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              {isEnded ? 'Voting has ended' : 'Voting is currently closed'}
            </p>
            {!isOpen && (
              <p className="text-sm text-muted-foreground mt-1">
                Check back later for the next voting period
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Clock className="h-5 w-5" />
            <span>Time Remaining</span>
          </CardTitle>
          <CardDescription>
            Voting ends on {targetDate.toLocaleDateString()} at {targetDate.toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Countdown date={targetDate} renderer={renderer} />
        </CardContent>
      </Card>
    </motion.div>
  )
}



