import { toast as sonnerToast } from "sonner"
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react"

export interface ToastOptions {
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning" | "info"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

const variantConfig = {
  default: {
    icon: Info,
    className: "border-border bg-card text-card-foreground"
  },
  success: {
    icon: CheckCircle,
    className: "border-success bg-success text-success-foreground"
  },
  error: {
    icon: AlertCircle,
    className: "border-destructive bg-destructive text-destructive-foreground"
  },
  warning: {
    icon: AlertTriangle,
    className: "border-warning bg-warning text-warning-foreground"
  },
  info: {
    icon: Info,
    className: "border-primary bg-primary text-primary-foreground"
  }
}

export function enhancedToast(options: ToastOptions) {
  const { title, description, variant = "default", duration = 4000, action } = options
  const config = variantConfig[variant]
  const Icon = config.icon

  const content = (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        {title && (
          <div className="font-medium text-sm">{title}</div>
        )}
        {description && (
          <div className="text-sm opacity-90 mt-1">{description}</div>
        )}
      </div>
    </div>
  )

  sonnerToast(content, {
    duration,
    className: config.className,
    action: action ? {
      label: action.label,
      onClick: action.onClick
    } : undefined,
  })
}

// Convenience methods
export const toastSuccess = (title: string, description?: string) => {
  enhancedToast({ title, description, variant: "success" })
}

export const toastError = (title: string, description?: string) => {
  enhancedToast({ title, description, variant: "error" })
}

export const toastWarning = (title: string, description?: string) => {
  enhancedToast({ title, description, variant: "warning" })
}

export const toastInfo = (title: string, description?: string) => {
  enhancedToast({ title, description, variant: "info" })
}

// Action toast for undo functionality
export const toastWithUndo = (
  title: string, 
  description: string, 
  onUndo: () => void,
  undoLabel: string = "เลิกทำ"
) => {
  enhancedToast({
    title,
    description,
    variant: "success",
    duration: 6000,
    action: {
      label: undoLabel,
      onClick: onUndo
    }
  })
}

// Progress toast for long operations
export const toastProgress = (title: string, description?: string) => {
  enhancedToast({
    title,
    description,
    variant: "info",
    duration: Infinity // Don't auto-dismiss
  })
}