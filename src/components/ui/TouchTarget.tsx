import React, { type ReactNode } from 'react'

interface TouchTargetProps {
  children: ReactNode
  minSize?: number
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

/**
 * TouchTarget ensures interactive elements meet minimum kiosk touch-target guidelines
 * (default 52px) regardless of visual padding or icon sizing.
 */
export const TouchTarget: React.FC<TouchTargetProps> = ({
  children,
  minSize = 52,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{ minWidth: `${minSize}px`, minHeight: `${minSize}px` }}
      className={`inline-flex items-center justify-center cursor-pointer select-none ${className}`}
    >
      {children}
    </div>
  )
}
