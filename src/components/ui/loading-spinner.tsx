import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const sizeConfig = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8"
}

export function LoadingSpinner({ className, size = "md", ...props }: LoadingSpinnerProps) {
  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeConfig[size],
        className
      )}
      {...props}
    />
  )
}