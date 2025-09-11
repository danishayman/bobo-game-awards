import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-red-primary/30 bg-red-primary/20 text-red-primary hover:bg-red-primary/30",
        secondary:
          "border-white/20 bg-white/10 text-white hover:bg-white/20",
        destructive:
          "border-red-600/30 bg-red-600/20 text-red-400 hover:bg-red-600/30",
        outline: "border-white/30 text-white hover:bg-white/10",
        success:
          "border-green-500/30 bg-green-500/20 text-green-400 hover:bg-green-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
