import { useState, useCallback, useMemo } from "react"
import { toast } from "@/hooks/use-toast"

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  email?: boolean
  phone?: boolean
  custom?: (value: any) => string | null
}

export interface FieldConfig {
  [key: string]: ValidationRule
}

export interface ValidationErrors {
  [key: string]: string
}

export interface FormValidationHook<T> {
  values: T
  errors: ValidationErrors
  isValid: boolean
  isSubmitting: boolean
  setValue: (field: keyof T, value: any) => void
  setValues: (values: Partial<T>) => void
  validateField: (field: keyof T) => boolean
  validateAll: () => boolean
  clearErrors: () => void
  clearError: (field: keyof T) => void
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => Promise<void>
  reset: (initialValues?: T) => void
}

// Validation patterns
const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9]{2,3}-[0-9]{3}-[0-9]{4}$/,
  phoneLoose: /^[0-9\-\s+()]{8,15}$/,
} as const

// Validation messages
const MESSAGES = {
  required: "ฟิลด์นี้จำเป็นต้องกรอก",
  email: "รูปแบบอีเมลไม่ถูกต้อง",
  phone: "รูปแบบเบอร์โทรไม่ถูกต้อง (เช่น 081-234-5678)",
  minLength: (min: number) => `ต้องมีอย่างน้อย ${min} ตัวอักษร`,
  maxLength: (max: number) => `ต้องมีไม่เกิน ${max} ตัวอักษร`,
} as const

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  fieldConfig: FieldConfig
): FormValidationHook<T> {
  const [values, setValuesState] = useState<T>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = useCallback((field: keyof T): boolean => {
    const value = values[field]
    const rules = fieldConfig[field as string]
    
    if (!rules) return true

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      setErrors(prev => ({ ...prev, [field]: MESSAGES.required }))
      return false
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
      return true
    }

    const stringValue = String(value).trim()

    // Email validation
    if (rules.email && !PATTERNS.email.test(stringValue)) {
      setErrors(prev => ({ ...prev, [field]: MESSAGES.email }))
      return false
    }

    // Phone validation
    if (rules.phone && !PATTERNS.phoneLoose.test(stringValue)) {
      setErrors(prev => ({ ...prev, [field]: MESSAGES.phone }))
      return false
    }

    // Length validations
    if (rules.minLength && stringValue.length < rules.minLength) {
      setErrors(prev => ({ ...prev, [field]: MESSAGES.minLength(rules.minLength!) }))
      return false
    }

    if (rules.maxLength && stringValue.length > rules.maxLength) {
      setErrors(prev => ({ ...prev, [field]: MESSAGES.maxLength(rules.maxLength!) }))
      return false
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      setErrors(prev => ({ ...prev, [field]: "รูปแบบข้อมูลไม่ถูกต้อง" }))
      return false
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value)
      if (customError) {
        setErrors(prev => ({ ...prev, [field]: customError }))
        return false
      }
    }

    // Clear error if validation passes
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field as string]
      return newErrors
    })

    return true
  }, [values, fieldConfig])

  const validateAll = useCallback((): boolean => {
    const fields = Object.keys(fieldConfig) as (keyof T)[]
    let isFormValid = true
    
    fields.forEach(field => {
      const isFieldValid = validateField(field)
      if (!isFieldValid) {
        isFormValid = false
      }
    })

    return isFormValid
  }, [fieldConfig, validateField])

  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }))
    
    // Validate field after setting value
    setTimeout(() => {
      validateField(field)
    }, 0)
  }, [validateField])

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }))
    
    // Validate changed fields
    setTimeout(() => {
      Object.keys(newValues).forEach(field => {
        validateField(field as keyof T)
      })
    }, 0)
  }, [validateField])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field as string]
      return newErrors
    })
  }, [])

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void> | void) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    
    try {
      const isFormValid = validateAll()
      
      if (!isFormValid) {
        toast({
          title: "ข้อมูลไม่ถูกต้อง",
          description: "กรุณาตรวจสอบข้อมูลที่กรอกและลองใหม่อีกครั้ง",
          variant: "destructive",
        })
        return
      }

      await onSubmit(values)
      
      toast({
        title: "สำเร็จ",
        description: "บันทึกข้อมูลเรียบร้อยแล้ว",
        variant: "default",
      })
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validateAll, isSubmitting])

  const reset = useCallback((newInitialValues?: T) => {
    const resetValues = newInitialValues || initialValues
    setValuesState(resetValues)
    setErrors({})
    setIsSubmitting(false)
  }, [initialValues])

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0
  }, [errors])

  return {
    values,
    errors,
    isValid,
    isSubmitting,
    setValue,
    setValues,
    validateField,
    validateAll,
    clearErrors,
    clearError,
    handleSubmit,
    reset,
  }
}

// Helper function to create duplicate validation
export function createDuplicateValidator<T>(
  existingItems: T[],
  currentItemId: number | string | null,
  getItemValue: (item: T) => string,
  fieldName: string = "ข้อมูล"
) {
  return (value: string): string | null => {
    if (!value) return null
    
    const isDuplicate = existingItems.some(item => 
      getItemValue(item).toLowerCase() === value.toLowerCase() && 
      (item as any).id !== currentItemId
    )
    
    return isDuplicate ? `${fieldName}นี้มีอยู่ในระบบแล้ว` : null
  }
}

// Helper function for required fields with custom message
export function createRequiredRule(message?: string): ValidationRule {
  return {
    required: true,
    custom: message ? () => message : undefined
  }
}

// Helper function for email validation
export function createEmailRule(): ValidationRule {
  return {
    email: true,
    required: true
  }
}

// Helper function for phone validation
export function createPhoneRule(): ValidationRule {
  return {
    phone: true
  }
}