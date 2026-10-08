import React from 'react'

interface ScallopBorderProps {
  className?: string
  color?: string
}

export const ScallopBorder: React.FC<ScallopBorderProps> = ({
  className = '',
  color = 'currentColor',
}) => {
  return (
    <svg
      className={`absolute -inset-2 sm:-inset-2.5 w-[calc(100%+16px)] sm:w-[calc(100%+20px)] h-[calc(100%+16px)] sm:h-[calc(100%+20px)] pointer-events-none select-none ${className}`}
      preserveAspectRatio="none"
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 10 4 
           Q 15 0 20 4 Q 25 0 30 4 Q 35 0 40 4 Q 45 0 50 4 Q 55 0 60 4 Q 65 0 70 4 Q 75 0 80 4 Q 85 0 90 4 Q 95 0 100 4 Q 105 0 110 4 Q 115 0 120 4 Q 125 0 130 4 Q 135 0 140 4 Q 145 0 150 4 Q 155 0 160 4 Q 165 0 170 4 Q 175 0 180 4 Q 185 0 190 4
           Q 196 6 196 10
           Q 200 15 196 20 Q 200 25 196 30 Q 200 35 196 40 Q 200 45 196 50
           Q 196 54 190 56
           Q 185 60 180 56 Q 175 60 170 56 Q 165 60 160 56 Q 155 60 150 56 Q 145 60 140 56 Q 135 60 130 56 Q 125 60 120 56 Q 115 60 110 56 Q 105 60 100 56 Q 95 60 90 56 Q 85 60 80 56 Q 75 60 70 56 Q 65 60 60 56 Q 55 60 50 56 Q 45 60 40 56 Q 35 60 30 56 Q 25 60 20 56 Q 15 60 10 56
           Q 4 54 4 50
           Q 0 45 4 40 Q 0 35 4 30 Q 0 25 4 20 Q 0 15 4 10
           Q 4 6 10 4 Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
