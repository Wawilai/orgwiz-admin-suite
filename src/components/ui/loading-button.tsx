import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, loading = false, loadingText, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={loading || disabled}
        className={cn(className)}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner className="mr-2 h-4 w-4" />
            {loadingText || "กำลังดำเนินการ..."}
          </>
        ) : (
          children
        )}
      </Button>
    )
  }
)

LoadingButton.displayName = "LoadingButton"