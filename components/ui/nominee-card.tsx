"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface NomineeCardProps {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isSelected?: boolean;
  isVoted?: boolean;
  onClick?: () => void;
  className?: string;
  showGlow?: boolean;
  priority?: boolean;
  index?: number;
}

// Memoized component to prevent unnecessary re-renders
export const NomineeCard = React.memo(function NomineeCard({
  name,
  description,
  imageUrl,
  isSelected = false,
  isVoted = false,
  onClick,
  className,
  showGlow = true,
  priority = false,
  index = 0,
}: NomineeCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Optimized image loading strategy
  const shouldLoadEagerly = priority || index < 6; // Load first 6 images eagerly
  const imageSizes = "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw";

  // Preload critical images
  React.useEffect(() => {
    if (shouldLoadEagerly && imageUrl && !imageError) {
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
    }
  }, [imageUrl, shouldLoadEagerly, imageError]);

  return (
    <motion.div
      layout
      whileHover={{ scale: shouldLoadEagerly ? 1.02 : 1.01 }} // Reduce animation complexity for non-priority items
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }} // Faster animations
      className="w-full"
    >
      <Card
        className={cn(
          "group relative overflow-hidden cursor-pointer transition-all duration-200 border-white/20", // Faster transitions
          "hover:border-red-primary/50",
          showGlow && "hover:shadow-[0_0_20px_rgba(229,9,20,0.2)]", // Reduced glow intensity
          "flex flex-col w-full",
          isSelected && [
            "ring-2 ring-red-primary border-red-primary",
            showGlow && "shadow-[0_0_25px_rgba(229,9,20,0.4)]"
          ],
          isVoted && !isSelected && "border-green-500/50 bg-green-500/5",
          className
        )}
        onClick={onClick}
      >
        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15 }}
            className="absolute top-1 right-1 z-10 w-4 h-4 sm:w-5 sm:h-5 bg-red-primary rounded-full flex items-center justify-center shadow-lg"
          >
            <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
          </motion.div>
        )}

        {/* Vote Status Indicator */}
        {isVoted && !isSelected && (
          <div className="absolute top-1 right-1 z-10 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
          </div>
        )}

        {/* Compact Image Section */}
        {imageUrl && !imageError && (
          <div className="relative w-full aspect-[3/4] overflow-hidden bg-background-tertiary">
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 animate-pulse" />
            )}
            
            <Image
              src={imageUrl}
              alt={name}
              fill
              className={cn(
                "object-contain transition-all duration-300",
                imageLoaded ? "opacity-100" : "opacity-0",
                shouldLoadEagerly && "group-hover:scale-105" // Only scale on hover for priority images
              )}
              sizes={imageSizes}
              priority={shouldLoadEagerly}
              loading={shouldLoadEagerly ? "eager" : "lazy"}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            
            {/* Simplified gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            
            {/* Reduced hover effect for better performance */}
            {shouldLoadEagerly && (
              <div className="absolute inset-0 bg-red-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            )}
          </div>
        )}

        {/* Fallback for missing/error images */}
        {(!imageUrl || imageError) && (
          <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
            <div className="text-4xl font-bold text-white/20">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        <CardHeader className="relative p-1.5 sm:p-3 h-[88px] sm:h-[100px] flex-shrink-0">
          {/* Simplified accent line */}
          <div className={cn(
            "absolute top-0 left-0 w-full h-0.5 transition-all duration-200",
            isSelected 
              ? "bg-red-primary" 
              : isVoted 
                ? "bg-green-500"
                : "bg-white/10 opacity-0 group-hover:opacity-100"
          )} />

          <div className="flex flex-col gap-1 text-center h-full">
            <CardTitle className={cn(
              "text-sm sm:text-base font-bold leading-tight transition-colors duration-150 line-clamp-2",
              isSelected ? "text-red-primary" : "text-white group-hover:text-red-primary"
            )}>
              {name}
            </CardTitle>
            
            {description && (
              <CardDescription className={cn(
                "text-[10px] sm:text-xs leading-tight transition-colors duration-150 line-clamp-2",
                isSelected ? "text-white/80" : "text-white/60 group-hover:text-white/70"
              )}>
                {description}
              </CardDescription>
            )}
            
            {/* Simplified selection dot */}
            <div className="flex justify-center mt-auto">
              <div className={cn(
                "w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors duration-150",
                isSelected ? "bg-red-primary" : "bg-white/20"
              )} />
            </div>
          </div>
        </CardHeader>

        {/* Simplified bottom accent */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200",
          isSelected 
            ? "bg-red-primary opacity-100" 
            : "bg-red-primary opacity-0 group-hover:opacity-60"
        )} />
      </Card>
    </motion.div>
  );
});

// Display name for React DevTools
NomineeCard.displayName = "NomineeCard";

export default NomineeCard;
