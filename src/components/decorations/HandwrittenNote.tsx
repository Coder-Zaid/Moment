import React from 'react'
import { Doodle } from './Doodle'
import type { DoodleType } from './Doodle'

interface HandwrittenNoteProps {
  text: string
  subtext?: string
  doodle?: DoodleType
  doodlePosition?: 'left' | 'right' | 'bottom'
  rotation?: number
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const HandwrittenNote: React.FC<HandwrittenNoteProps> = ({
  text,
  subtext,
  doodle,
  doodlePosition = 'right',
  rotation = -3,
  color = 'text-[#e8cfb5]',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  }

  return (
    <div
      aria-hidden="true"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
      className={`inline-flex items-center gap-1.5 select-none pointer-events-none font-handwritten ${color} ${className}`}
    >
      {doodle && doodlePosition === 'left' && (
        <Doodle type={doodle} size={22} color="currentColor" />
      )}

      <div className="flex flex-col">
        <span className={`${sizeClasses[size]} tracking-wide leading-none font-semibold drop-shadow-sm`}>
          {text}
        </span>
        {subtext && (
          <span className="text-sm opacity-80 -mt-1 font-normal">
            {subtext}
          </span>
        )}
      </div>

      {doodle && (doodlePosition === 'right' || doodlePosition === 'bottom') && (
        <Doodle type={doodle} size={22} color="currentColor" />
      )}
    </div>
  )
}
