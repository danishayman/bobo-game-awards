'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/10",
        className
      )}
      {...props}
    />
  )
}

interface SkeletonPulseProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'shimmer'
}

export function SkeletonPulse({ className, variant = 'default', ...props }: SkeletonPulseProps) {
  if (variant === 'shimmer') {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-white/5 rounded-md",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "animate-pulse bg-white/10 rounded-md",
        className
      )}
      {...props}
    />
  )
}
