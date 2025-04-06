
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeWithAnimationVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 animate-fade-in",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: 
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeWithAnimationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeWithAnimationVariants> {}

function BadgeWithAnimation({ className, variant, ...props }: BadgeWithAnimationProps) {
  return (
    <div className={cn(badgeWithAnimationVariants({ variant }), className)} {...props} />
  )
}

export { BadgeWithAnimation, badgeWithAnimationVariants }
