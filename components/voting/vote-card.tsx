'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Check, ExternalLink } from 'lucide-react'
import { type Nominee } from '@/lib/supabase'
import Image from 'next/image'

interface VoteCardProps {
  nominee: Nominee
  isSelected: boolean
  hasVoted: boolean
  onVote: (nomineeId: string) => void
  disabled?: boolean
}

export function VoteCard({ nominee, isSelected, hasVoted, onVote, disabled }: VoteCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`
          relative h-full cursor-pointer transition-all duration-300 overflow-hidden
          ${isSelected ? 'ring-2 ring-primary shadow-lg bg-primary/5' : 'hover:shadow-md'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && onVote(nominee.id)}
      >
        {/* Image Section */}
        <div className="relative aspect-video w-full overflow-hidden">
          {!imageError ? (
            <Image
              src={nominee.image_url}
              alt={nominee.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted">
              <ExternalLink className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          {/* Selection Indicator */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1"
            >
              <Check className="h-4 w-4" />
            </motion.div>
          )}

          {/* Vote Status Badge */}
          {hasVoted && (
            <Badge 
              variant="success" 
              className="absolute top-2 left-2"
            >
              Voted
            </Badge>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg leading-tight">{nominee.title}</CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <CardDescription className="text-sm line-clamp-3">
            {nominee.description}
          </CardDescription>
          
          <div className="mt-4">
            <Button 
              className="w-full"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                if (!disabled) onVote(nominee.id)
              }}
            >
              {isSelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Selected
                </>
              ) : hasVoted ? (
                'Change Vote'
              ) : (
                'Vote'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}



