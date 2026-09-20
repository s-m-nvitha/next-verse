import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-none font-heading font-extrabold uppercase text-xs md:text-sm tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent disabled:pointer-events-none disabled:opacity-50 active:translate-x-[2px] active:translate-y-[2px]",
  {
    variants: {
      variant: {
        default:
          "nb-btn bg-lime-accent text-ink hover:bg-lime-300 shadow-brutal hover:shadow-brutal-hover active:shadow-brutal-active",
        secondary:
          "nb-btn bg-yellow-accent text-ink hover:bg-amber-300 shadow-brutal hover:shadow-brutal-hover active:shadow-brutal-active",
        outline:
          "nb-btn bg-white dark:bg-[#1A1A17] text-ink dark:text-[#F7F5EE] hover:bg-cream dark:hover:bg-[#2A2A25] shadow-brutal hover:shadow-brutal-hover active:shadow-brutal-active",
        destructive:
          "nb-btn bg-rose-400 text-ink hover:bg-rose-500 shadow-brutal hover:shadow-brutal-hover active:shadow-brutal-active",
        ghost:
          "border-2 border-transparent hover:border-ink dark:hover:border-[#F7F5EE] hover:bg-yellow-accent/30 dark:hover:bg-white/10 text-ink dark:text-[#F7F5EE]",
        link:
          "text-ink dark:text-[#F7F5EE] underline-offset-4 hover:underline p-0 h-auto font-mono font-bold lowercase",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-sm md:text-base",
        icon: "h-10 w-10 p-0",
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
