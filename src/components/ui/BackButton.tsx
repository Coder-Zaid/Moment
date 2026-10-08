import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = 'BACK',
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={shouldReduceMotion ? undefined : { x: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`
        inline-flex items-center gap-2.5 px-5 py-2.5 min-h-[48px] rounded-xl
        bg-[#1b1916]/80 text-[#d8cfbe] border border-[#38322a]
        hover:bg-[#25221e] hover:border-[#52493e] hover:text-white
        uppercase tracking-widest text-xs font-semibold
        cursor-pointer touch-press select-none shadow-sm
        ${className}
      `}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </motion.button>
  )
}
