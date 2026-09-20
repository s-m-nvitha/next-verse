import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 border border-ink dark:border-[#F7F5EE] px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_rgba(247,245,238,0.4)] rounded-none transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-lime-accent text-ink",
        secondary:
          "bg-yellow-accent text-ink",
        destructive:
          "bg-rose-300 text-ink",
        outline:
          "bg-white dark:bg-[#1A1A17] text-ink dark:text-[#F7F5EE]",
        blue:
          "bg-blue-accent text-ink",
        mint:
          "bg-mint-accent text-ink",
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
