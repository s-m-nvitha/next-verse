import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-none border-2 border-ink dark:border-[#F7F5EE] bg-white dark:bg-[#1A1A17] px-3 py-2 text-sm font-mono text-ink dark:text-[#F7F5EE] placeholder:text-ink/40 dark:placeholder:text-[#F7F5EE]/40 shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_rgba(247,245,238,0.3)] focus:outline-none focus:ring-2 focus:ring-lime-accent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
