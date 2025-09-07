'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  useEffect(() => {
    if (trigger && onComplete) {
      const timer = setTimeout(onComplete, 3000)
      return () => clearTimeout(timer)
    }
  }, [trigger, onComplete])

  if (!trigger) return null

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d'][Math.floor(Math.random() * 5)]
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: piece.color,
            left: `${piece.x}%`,
            top: '-10px'
          }}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 10,
            opacity: 0,
            rotate: 360
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  )
}



