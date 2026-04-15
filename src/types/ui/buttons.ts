// src/types/ui/buttons.ts
import { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  children?: ReactNode
}

export interface IconButtonProps extends ButtonProps {
  ariaLabel: string
}