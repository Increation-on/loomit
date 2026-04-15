// src/types/ui/inputs.ts
import { InputHTMLAttributes, ReactNode } from 'react'

export interface RadioGroupProps {
  options: Array<{ id: string; label: string; disabled?: boolean }>
  value?: string
  onChange: (value: string) => void
  name: string
  error?: string
  disabled?: boolean
  className?: string
}

export interface CheckboxGroupProps {
  options: Array<{ id: string; label: string; checked?: boolean }>
  onChange: (selectedIds: string[]) => void
  name: string
  error?: string
  disabled?: boolean
  className?: string
}

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
  fullWidth?: boolean
}

export interface FormFieldProps {
  label?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}