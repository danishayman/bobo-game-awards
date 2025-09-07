'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center space-x-2"
    >
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && (
        <span className="text-muted-foreground">{text}</span>
      )}
    </motion.div>
  )
}



