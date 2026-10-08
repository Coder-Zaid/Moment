import React, { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface IconButtonProps {
  children: ReactNode
  onClick?: () => void
  label: string
  variant?: 'ghost' | 'surface' | 'gold'
  size?: 'md' | 'lg'
  disabled?: boolean
  className?: string
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  label,
  variant = 'surface',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion()

  const variantStyles = {
    ghost: 'text-[#d8cfbe] hover:bg-[#25221e]/80 hover:text-white',
    surface: 'bg-[#1b1916]/80 text-[#d8cfbe] border border-[#38322a] hover:bg-[#25221e] hover:border-[#52493e]',
    gold: 'bg-[#b87d4b] text-[#140e08] hover:bg-[#c98e5a]',
  }

  const sizeStyles = {
    md: 'w-12 h-12 min-w-[48px] min-h-[48px] text-lg',
    lg: 'w-14 h-14 min-w-[56px] min-h-[56px] text-xl',
  }

  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-label={label}
      disabled={disabled}
      whileHover={shouldReduceMotion || disabled ? undefined : { scale: 1.05 }}
      whileTap={shouldReduceMotion || disabled ? undefined : { scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`
        rounded-full inline-flex items-center justify-center
        transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        touch-press
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}
