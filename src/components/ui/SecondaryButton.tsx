import React, { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface SecondaryButtonProps {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
  disabled?: boolean
  className?: string
  fullWidth?: boolean
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  onClick,
  icon,
  disabled = false,
  className = '',
  fullWidth = false,
}) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileHover={shouldReduceMotion || disabled ? undefined : { scale: 1.015 }}
      whileTap={shouldReduceMotion || disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`
        min-h-[52px] px-6 py-3
        rounded-xl uppercase tracking-wider text-sm font-medium
        bg-[#1b1916]/80 text-[#d8cfbe]
        border border-[#38322a] hover:border-[#52493e] hover:bg-[#25221e]
        active:bg-[#141210] active:border-[#2b2620]
        transition-colors duration-150
        inline-flex items-center justify-center gap-2.5
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        touch-press
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  )
}
