import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertTriangle, Trash2, Edit, Info, CheckCircle } from "lucide-react"

export interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive" | "warning" | "info"
  isLoading?: boolean
  onConfirm: () => void | Promise<void>
  children?: React.ReactNode
}

const variantConfig = {
  default: {
    icon: CheckCircle,
    iconClass: "text-primary",
    confirmVariant: "default" as const,
  },
  destructive: {
    icon: Trash2,
    iconClass: "text-destructive",
    confirmVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-warning",
    confirmVariant: "warning" as const,
  },
  info: {
    icon: Info,
    iconClass: "text-primary",
    confirmVariant: "default" as const,
  },
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  variant = "default",
  isLoading = false,
  onConfirm,
  children,
}: ConfirmationDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = async () => {
    try {
      await onConfirm()
    } catch (error) {
      console.error("Confirmation action failed:", error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-muted ${config.iconClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {description}
          </AlertDialogDescription>
          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              config.confirmVariant === "destructive" 
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : config.confirmVariant === "warning"
                ? "bg-warning text-warning-foreground hover:bg-warning/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                กำลังดำเนินการ...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Convenience hooks for common confirmation dialogs
export function useDeleteConfirmation() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [deleteAction, setDeleteAction] = React.useState<(() => void | Promise<void>) | null>(null)
  const [itemName, setItemName] = React.useState("")

  const showDeleteConfirmation = React.useCallback((name: string, action: () => void | Promise<void>) => {
    setItemName(name)
    setDeleteAction(() => action)
    setIsOpen(true)
  }, [])

  const handleConfirm = React.useCallback(async () => {
    if (!deleteAction) return
    
    setIsLoading(true)
    try {
      await deleteAction()
      setIsOpen(false)
    } catch (error) {
      console.error("Delete failed:", error)
    } finally {
      setIsLoading(false)
    }
  }, [deleteAction])

  const Dialog = React.useCallback(() => (
    <ConfirmationDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title="ยืนยันการลบ"
      description={`คุณแน่ใจหรือไม่ที่จะลบ "${itemName}" การดำเนินการนี้ไม่สามารถย้อนกลับได้`}
      confirmText="ลบ"
      cancelText="ยกเลิก"
      variant="destructive"
      isLoading={isLoading}
      onConfirm={handleConfirm}
    />
  ), [isOpen, itemName, isLoading, handleConfirm])

  return {
    showDeleteConfirmation,
    DeleteConfirmationDialog: Dialog,
  }
}

export function useStatusChangeConfirmation() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [changeAction, setChangeAction] = React.useState<(() => void | Promise<void>) | null>(null)
  const [message, setMessage] = React.useState("")

  const showStatusConfirmation = React.useCallback((message: string, action: () => void | Promise<void>) => {
    setMessage(message)
    setChangeAction(() => action)
    setIsOpen(true)
  }, [])

  const handleConfirm = React.useCallback(async () => {
    if (!changeAction) return
    
    setIsLoading(true)
    try {
      await changeAction()
      setIsOpen(false)
    } catch (error) {
      console.error("Status change failed:", error)
    } finally {
      setIsLoading(false)
    }
  }, [changeAction])

  const Dialog = React.useCallback(() => (
    <ConfirmationDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title="ยืนยันการเปลี่ยนสถานะ"
      description={message}
      confirmText="ยืนยัน"
      cancelText="ยกเลิก"
      variant="warning"
      isLoading={isLoading}
      onConfirm={handleConfirm}
    />
  ), [isOpen, message, isLoading, handleConfirm])

  return {
    showStatusConfirmation,
    StatusConfirmationDialog: Dialog,
  }
}