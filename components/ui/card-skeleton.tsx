'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton, SkeletonPulse } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface CardSkeletonProps {
  className?: string
  variant?: 'default' | 'vote' | 'nominee' | 'admin' | 'result'
  count?: number
}

export function CardSkeleton({ className, variant = 'default', count = 1 }: CardSkeletonProps) {
  const cards = Array.from({ length: count }, (_, i) => i)

  return (
    <>
      {cards.map((index) => (
        <Card key={index} className={cn("border-white/20 bg-gradient-to-br from-background-secondary/50 to-background-secondary/20", className)}>
          {variant === 'vote' && (
            <>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <SkeletonPulse className="w-12 h-12 rounded-xl" variant="shimmer" />
                  <div className="flex-1 space-y-2">
                    <SkeletonPulse className="h-6 w-3/4" variant="shimmer" />
                    <SkeletonPulse className="h-4 w-full" variant="shimmer" />
                  </div>
                  <SkeletonPulse className="w-16 h-6 rounded-full" variant="shimmer" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <SkeletonPulse className="w-12 h-12 rounded-lg" variant="shimmer" />
                    <div className="flex-1 space-y-2">
                      <SkeletonPulse className="h-5 w-2/3" variant="shimmer" />
                      <SkeletonPulse className="h-4 w-full" variant="shimmer" />
                    </div>
                    <SkeletonPulse className="w-5 h-5 rounded" variant="shimmer" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <SkeletonPulse className="h-4 w-1/3" variant="shimmer" />
                  <SkeletonPulse className="h-8 w-16 rounded" variant="shimmer" />
                </div>
              </CardContent>
            </>
          )}

          {variant === 'nominee' && (
            <>
              <div className="relative overflow-hidden">
                <SkeletonPulse className="w-full h-48" variant="shimmer" />
                <div className="absolute top-4 right-4">
                  <SkeletonPulse className="w-8 h-8 rounded-full" variant="shimmer" />
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <SkeletonPulse className="h-6 w-3/4" variant="shimmer" />
                  <SkeletonPulse className="h-4 w-full" variant="shimmer" />
                  <SkeletonPulse className="h-4 w-5/6" variant="shimmer" />
                </div>
                <div className="flex items-center gap-2">
                  <SkeletonPulse className="w-16 h-6 rounded-full" variant="shimmer" />
                  <SkeletonPulse className="w-20 h-6 rounded-full" variant="shimmer" />
                </div>
              </CardContent>
            </>
          )}

          {variant === 'admin' && (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <SkeletonPulse className="h-6 w-2/3" variant="shimmer" />
                    <SkeletonPulse className="h-4 w-full" variant="shimmer" />
                  </div>
                  <div className="flex items-center gap-2">
                    <SkeletonPulse className="w-16 h-6 rounded-full" variant="shimmer" />
                    <SkeletonPulse className="w-12 h-8 rounded" variant="shimmer" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <SkeletonPulse className="h-4 w-1/4" variant="shimmer" />
                  <SkeletonPulse className="h-4 w-1/4" variant="shimmer" />
                </div>
              </CardContent>
            </>
          )}

          {variant === 'result' && (
            <>
              <CardHeader className="bg-gradient-to-r from-purple-50/10 to-blue-50/10">
                <div className="flex items-center gap-2">
                  <SkeletonPulse className="w-6 h-6 rounded" variant="shimmer" />
                  <SkeletonPulse className="h-6 w-1/2" variant="shimmer" />
                </div>
                <SkeletonPulse className="h-4 w-1/3 mt-2" variant="shimmer" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="relative p-4 border-b last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <SkeletonPulse className="w-8 h-6 rounded-full" variant="shimmer" />
                          <div className="space-y-2">
                            <SkeletonPulse className="h-5 w-32" variant="shimmer" />
                            <SkeletonPulse className="h-4 w-24" variant="shimmer" />
                          </div>
                        </div>
                      </div>
                      <SkeletonPulse className="mt-2 w-full h-2 rounded-full" variant="shimmer" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {variant === 'default' && (
            <>
              <CardHeader>
                <SkeletonPulse className="h-6 w-3/4" variant="shimmer" />
                <SkeletonPulse className="h-4 w-full" variant="shimmer" />
              </CardHeader>
              <CardContent className="space-y-4">
                <SkeletonPulse className="h-4 w-full" variant="shimmer" />
                <SkeletonPulse className="h-4 w-5/6" variant="shimmer" />
                <SkeletonPulse className="h-8 w-24" variant="shimmer" />
              </CardContent>
            </>
          )}
        </Card>
      ))}
    </>
  )
}
