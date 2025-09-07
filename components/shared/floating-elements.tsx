'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, Award } from 'lucide-react'

export function FloatingElements() {
  const elements = [
    { Icon: Trophy, delay: 0, x: '10%', y: '20%' },
    { Icon: Star, delay: 1, x: '80%', y: '30%' },
    { Icon: Award, delay: 2, x: '15%', y: '70%' },
    { Icon: Trophy, delay: 3, x: '85%', y: '80%' },
    { Icon: Star, delay: 4, x: '50%', y: '10%' },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute opacity-5"
          style={{ left: element.x, top: element.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <element.Icon className="h-12 w-12 text-primary" />
        </motion.div>
      ))}
    </div>
  )
}



