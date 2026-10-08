import React, { type ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

interface ScreenTransitionProps {
  children: ReactNode
  screenKey: string
  className?: string
}

export const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  children,
  screenKey,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion()

  const variants: Variants = {
    initial: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
      scale: shouldReduceMotion ? 1 : 0.99,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.35,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -10,
      scale: shouldReduceMotion ? 1 : 0.99,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.25,
        ease: 'easeIn',
      },
    },
  }

  return (
    <motion.div
      key={screenKey}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full h-full flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  )
}
