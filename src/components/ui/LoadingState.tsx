import React from 'react'
import { motion } from 'framer-motion'

interface LoadingStateProps {
  title?: string
  subtitle?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'PREPARING YOUR MOMENT',
  subtitle = 'Processing high-resolution frames...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        {/* Pulsing ambient circle */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full bg-[#b87d4b]/20 border border-[#b87d4b]/50"
        />

        {/* Inner spinning iris aperture ring */}
        <div className="w-10 h-10 border-2 border-t-[#f4efe6] border-r-[#b87d4b] border-b-transparent border-l-transparent rounded-full animate-spin" />
      </div>

      <h3 className="font-serif text-2xl tracking-widest text-[#f4efe6] mb-2">{title}</h3>
      <p className="text-xs uppercase tracking-widest text-[#a89e90] max-w-xs">{subtitle}</p>
    </div>
  )
}
