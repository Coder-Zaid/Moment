import React, { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ScallopBorder } from '../decorations/ScallopBorder'

export type ButtonVariant = 'cream' | 'bronze' | 'dark' | 'outline' | 'terracotta'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface PrimaryButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  disabled?: boolean
  loading?: boolean
  className?: string
  fullWidth?: boolean
  type?: 'button' | 'submit'
  scalloped?: boolean
  scallopColor?: string
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  variant = 'cream',
  size = 'lg',
  icon,
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
  type = 'button',
  scalloped = false,
  scallopColor,
}) => {
  const shouldReduceMotion = useReducedMotion()

  const variantStyles: Record<ButtonVariant, string> = {
    cream:
      'bg-[#f4efe6] text-[#121110] hover:bg-[#ffffff] shadow-md border border-[#e6dfd1]/80 hover:shadow-lg active:bg-[#e8e2d5]',
    bronze:
      'bg-[#b87d4b] text-[#140e08] hover:bg-[#c98e5a] shadow-md border border-[#cfa076]/40 hover:shadow-lg active:bg-[#a66e3f] font-semibold',
    terracotta:
      'bg-[#c97d66] text-white hover:bg-[#d98b74] shadow-md border border-[#b36952]/40 hover:shadow-lg active:bg-[#b56e58] font-semibold tracking-widest',
    dark:
      'bg-[#1a1815] text-[#ece4d8] border border-[#332e29] hover:bg-[#25221e] hover:border-[#4a433c] active:bg-[#141210]',
    outline:
      'bg-transparent text-[#e8dfd2] border border-[#423c34] hover:bg-[#1f1c18] hover:border-[#635b51] active:bg-[#171512]',
  }

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'min-h-[40px] px-3.5 py-2 text-xs tracking-wider',
    md: 'min-h-[48px] px-6 py-2.5 text-sm tracking-wider',
    lg: 'min-h-[58px] px-8 py-3.5 text-base tracking-widest',
    xl: 'min-h-[66px] px-10 py-4 text-lg tracking-widest',
  }

  return (
    <motion.button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      whileHover={shouldReduceMotion || disabled ? undefined : { scale: 1.02 }}
      whileTap={shouldReduceMotion || disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`
        relative inline-flex items-center justify-center gap-3
        rounded-xl uppercase font-medium
        transition-colors duration-150
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        touch-press
        ${fullWidth ? 'w-full' : ''}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {scalloped && (
        <ScallopBorder color={scallopColor || '#382f25'} />
      )}
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span>PLEASE WAIT...</span>
        </span>
      ) : (
        <>
          {icon && <span className="inline-flex shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  )
}
