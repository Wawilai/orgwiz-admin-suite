import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface FormFieldWrapperProps {
  label?: string
  required?: boolean
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}

export function FormFieldWrapper({ 
  label, 
  required, 
  error, 
  hint, 
  className,
  children 
}: FormFieldWrapperProps) {
  const hasError = !!error

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={cn(
          "text-sm font-medium",
          hasError && "text-destructive",
          required && "after:content-['*'] after:ml-1 after:text-destructive"
        )}>
          {label}
        </Label>
      )}
      
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          className: cn(
            (children as React.ReactElement).props.className,
            hasError && "border-destructive focus:border-destructive focus:ring-destructive"
          )
        })}
        
        {hasError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
        )}
      </div>

      {hint && !hasError && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      
      {hasError && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}