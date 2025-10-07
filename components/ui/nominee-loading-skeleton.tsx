"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface NomineeLoadingSkeletonProps {
  count?: number;
}

export function NomineeLoadingSkeleton({ count = 6 }: NomineeLoadingSkeletonProps) {
  const getGridCols = (count: number) => {
    if (count === 1) return 'flex justify-center'
    // Matches the compact layout from category vote page
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
  }

  return (
    <div className={cn(`grid ${getGridCols(count)} gap-1 sm:gap-2 md:gap-3 max-w-6xl mx-auto`, count === 1 && 'flex justify-center')}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className={cn("h-full flex flex-col overflow-hidden border-white/20 bg-background-secondary/50", count === 1 && "w-full max-w-xs")}>
          {/* Image Skeleton - Matches NomineeCard aspect-[4/5] */}
          <div className="relative w-full aspect-[4/5] overflow-hidden flex-shrink-0 bg-gray-800">
            <Skeleton className="w-full h-full bg-gray-700/50" />
          </div>

          {/* Content Skeleton - Matches NomineeCard CardHeader */}
          <CardHeader className="relative p-1 sm:p-2 flex-grow flex flex-col justify-between">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-white/10" />

            <div className="flex flex-col h-full min-h-0">
              <div className="flex-1 space-y-1 min-h-0 text-center">
                {/* Title Skeleton */}
                <Skeleton className="h-3 w-3/4 mx-auto bg-gray-700/50" />
                
                {/* Description Skeleton (hidden on mobile like the real card) */}
                <Skeleton className="h-2 w-full mx-auto bg-gray-700/50 hidden md:block" />
              </div>
              
              {/* Selection dot */}
              <div className="flex justify-center mt-1">
                <Skeleton className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/20" />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
