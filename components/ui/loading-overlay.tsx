'use client'

import { LogOut } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  submessage?: string
  variant?: 'spinner' | 'skeleton'
}

export function LoadingOverlay({ 
  isVisible, 
  message = "Signing out...", 
  submessage = "Please wait while we securely sign you out",
  variant = 'spinner'
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6 text-center">
        {variant === 'spinner' ? (
          <>
            {/* Animated loading icon */}
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-white/20 border-t-red-primary animate-spin"></div>
              <LogOut className="absolute inset-0 m-auto h-6 w-6 text-white" />
            </div>
            
            {/* Loading message */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">{message}</h2>
              <p className="text-sm text-white/70">{submessage}</p>
            </div>
            
            {/* Animated dots */}
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-red-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-red-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-red-primary rounded-full animate-bounce"></div>
            </div>
          </>
        ) : (
          <>
            {/* Skeleton loading */}
            <div className="space-y-4">
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex space-x-1 justify-center">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-2 w-2 rounded-full" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
