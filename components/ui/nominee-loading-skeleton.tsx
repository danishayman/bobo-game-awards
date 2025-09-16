"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface NomineeLoadingSkeletonProps {
  count?: number;
}

export function NomineeLoadingSkeleton({ count = 6 }: NomineeLoadingSkeletonProps) {
  const getGridCols = (count: number) => {
    if (count <= 2) return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2'
    if (count <= 3) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3'
    if (count <= 4) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
    if (count <= 6) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
  }

  return (
    <div className={`grid ${getGridCols(count)} gap-3 lg:gap-4`}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="h-full flex flex-col overflow-hidden border-white/20 bg-background-secondary/50 backdrop-blur-sm">
          {/* Image Skeleton */}
          <div className="relative w-full aspect-[3/4] overflow-hidden flex-shrink-0 bg-gray-800">
            <Skeleton className="w-full h-full bg-gray-700/50" />
          </div>

          {/* Content Skeleton */}
          <CardHeader className="relative p-3 flex-1 flex flex-col justify-between min-h-[120px]">
            {/* Button Skeleton */}
            <div className="text-center pt-2">
              <Skeleton className="w-full h-7 bg-gray-700/50" />
            </div>

            {/* Title and Description Skeleton */}
            <div className="text-center pt-2 flex-1 flex flex-col justify-center space-y-2">
              <Skeleton className="h-4 w-3/4 mx-auto bg-gray-700/50" />
              <Skeleton className="h-3 w-full bg-gray-700/50" />
              <Skeleton className="h-3 w-2/3 mx-auto bg-gray-700/50" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
