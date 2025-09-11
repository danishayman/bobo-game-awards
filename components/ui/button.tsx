import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-red-primary text-white hover:bg-red-secondary hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] border border-red-primary hover:border-red-secondary",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]",
        outline:
          "border border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-red-primary hover:text-red-primary hover:shadow-[0_0_15px_rgba(229,9,20,0.2)]",
        secondary:
          "bg-background-secondary text-white hover:bg-background-tertiary border border-white/10 hover:border-white/20",
        ghost: "text-white hover:bg-white/10 hover:text-red-primary",
        link: "text-red-primary underline-offset-4 hover:underline hover:text-red-secondary",
        premium: "bg-gradient-to-r from-red-primary to-red-secondary text-white hover:shadow-[0_0_30px_rgba(229,9,20,0.6)] border border-red-primary",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

