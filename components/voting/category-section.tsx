'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VoteCard } from './vote-card'
import { motion } from 'framer-motion'
import { type Category, type Nominee } from '@/lib/supabase'
import { CheckCircle } from 'lucide-react'

interface CategorySectionProps {
  category: Category
  nominees: Nominee[]
  selectedNomineeId?: string
  onVote: (categoryId: string, nomineeId: string) => void
  disabled?: boolean
}

export function CategorySection({ 
  category, 
  nominees, 
  selectedNomineeId, 
  onVote, 
  disabled 
}: CategorySectionProps) {
  const hasVoted = !!selectedNomineeId

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Category Header */}
      <Card className={`${hasVoted ? 'bg-green-50 dark:bg-green-950/20' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                {category.name}
                {hasVoted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </motion.div>
                )}
              </CardTitle>
              <CardDescription className="text-base">
                {category.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Nominees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nominees.map((nominee, index) => (
          <motion.div
            key={nominee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <VoteCard
              nominee={nominee}
              isSelected={selectedNomineeId === nominee.id}
              hasVoted={hasVoted}
              onVote={(nomineeId) => onVote(category.id, nomineeId)}
              disabled={disabled}
            />
          </motion.div>
        ))}
      </div>

      {nominees.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No nominees available for this category yet.
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}



