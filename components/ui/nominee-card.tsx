"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
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
}

export function NomineeCard({
  id,
  name,
  description,
  imageUrl,
  isSelected = false,
  isVoted = false,
  onClick,
  className,
  showGlow = true,
}: NomineeCardProps) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden cursor-pointer transition-all duration-300 border-white/20",
          "hover:border-red-primary/50 hover:shadow-[0_0_30px_rgba(229,9,20,0.3)]",
          isSelected && [
            "ring-2 ring-red-primary border-red-primary",
            showGlow && "shadow-[0_0_40px_rgba(229,9,20,0.5)]"
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
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-red-primary rounded-full flex items-center justify-center shadow-lg"
          >
            <Check className="w-5 h-5 text-white" />
          </motion.div>
        )}

        {/* Vote Status Indicator */}
        {isVoted && !isSelected && (
          <div className="absolute top-4 right-4 z-10 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Image Section */}
        {imageUrl && (
          <div className="relative w-full h-56 overflow-hidden">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            
            {/* Red Glow Effect on Hover */}
            <div className="absolute inset-0 bg-red-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        <CardHeader className={cn("relative", !imageUrl && "pt-8")}>
          {/* Premium Accent Line */}
          <div className={cn(
            "absolute top-0 left-0 w-full h-1 transition-all duration-300",
            isSelected 
              ? "bg-gradient-to-r from-red-primary to-red-secondary" 
              : isVoted 
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
          )} />

          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <CardTitle className={cn(
                "text-xl font-bold leading-tight transition-colors duration-200",
                isSelected ? "text-red-primary" : "text-white group-hover:text-red-primary"
              )}>
                {name}
              </CardTitle>
              
              {description && (
                <CardDescription className="text-white/70 leading-relaxed">
                  {description}
                </CardDescription>
              )}
            </div>

            {/* Star Rating Placeholder */}
            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3 transition-colors",
                    i < 4 ? "fill-yellow-400 text-yellow-400" : "text-white/30"
                  )}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        {/* Hover Effects */}
        <div className={cn(
          "absolute inset-0 transition-all duration-300 pointer-events-none",
          "opacity-0 group-hover:opacity-100",
          "bg-gradient-to-br from-red-primary/5 via-transparent to-red-primary/5"
        )} />

        {/* Bottom Glow */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-1 transition-all duration-300",
          isSelected 
            ? "bg-gradient-to-r from-red-primary to-red-secondary opacity-100" 
            : "bg-gradient-to-r from-red-primary to-red-secondary opacity-0 group-hover:opacity-60"
        )} />
      </Card>
    </motion.div>
  );
}

// Export default for easier importing
export default NomineeCard;
