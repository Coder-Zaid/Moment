import React from 'react'

export type DoodleType =
  | 'sparkle'
  | 'star'
  | 'heart'
  | 'arrow'
  | 'swirl'
  | 'sunburst'
  | 'flower'
  | 'underline'
  | 'lightning'
  | 'smile'
  | 'brackets'
  | 'camera'
  | 'tulip'
  | 'bow'
  | 'mascot_bean'
  | 'mascot_sun'
  | 'pencil'
  | 'hearts_cluster'

interface DoodleProps {
  type: DoodleType
  color?: string
  size?: number | string
  rotation?: number
  className?: string
}

export const Doodle: React.FC<DoodleProps> = ({
  type,
  color = 'currentColor',
  size = 28,
  rotation = 0,
  className = '',
}) => {
  const pixelSize = typeof size === 'number' ? size : 28

  const renderPath = () => {
    switch (type) {
      case 'sparkle':
        return (
          <path
            d="M16 2 C16 9 23 16 30 16 C23 16 16 23 16 30 C16 23 9 16 2 16 C9 16 16 9 16 2 Z"
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )

      case 'star':
        return (
          <path
            d="M16 3 L19.8 11.8 L29.5 12.5 L22.1 18.6 L24.4 28 L16 23 L7.6 28 L9.9 18.6 L2.5 12.5 L12.2 11.8 Z"
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )

      case 'heart':
        return (
          <path
            d="M16 27 C16 27 5 19.5 5 11.5 C5 6.5 9 3.5 13.5 4.5 C16 5 16 7 16 7 C16 7 16 5 18.5 4.5 C23 3.5 27 6.5 27 11.5 C27 19.5 16 27 16 27 Z"
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )

      case 'arrow':
        return (
          <path
            d="M5 24 C10 18 16 15 25 12 M18 6 L26 12 L20 18"
            fill="none"
            stroke={color}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )

      case 'swirl':
        return (
          <path
            d="M6 18 C8 10 16 6 22 9 C27 12 26 20 20 23 C14 26 9 21 11 15 C13 10 18 10 21 13"
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        )

      case 'sunburst':
        return (
          <g stroke={color} strokeWidth="2.2" strokeLinecap="round">
            <circle cx="16" cy="16" r="4.5" fill="none" />
            <line x1="16" y1="4" x2="16" y2="8" />
            <line x1="16" y1="24" x2="16" y2="28" />
            <line x1="4" y1="16" x2="8" y2="16" />
            <line x1="24" y1="16" x2="28" y2="16" />
            <line x1="7.5" y1="7.5" x2="10.5" y2="10.5" />
            <line x1="21.5" y1="21.5" x2="24.5" y2="24.5" />
            <line x1="7.5" y1="24.5" x2="10.5" y2="21.5" />
            <line x1="21.5" y1="10.5" x2="24.5" y2="7.5" />
          </g>
        )

      case 'flower':
        return (
          <g stroke={color} strokeWidth="2" strokeLinecap="round" fill="none">
            <circle cx="16" cy="16" r="3" fill={color} />
            <path d="M16 13 C16 7 12 7 12 11 C12 14 16 13 16 13 Z" />
            <path d="M19 16 C25 16 25 12 21 12 C18 12 19 16 19 16 Z" />
            <path d="M16 19 C16 25 20 25 20 21 C20 18 16 19 16 19 Z" />
            <path d="M13 16 C7 16 7 20 11 20 C14 20 13 16 13 16 Z" />
          </g>
        )

      case 'underline':
        return (
          <path
            d="M2 14 C9 19 18 12 24 16 C27 18 29 17 30 15"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )

      case 'lightning':
        return (
          <path
            d="M17 3 L9 16 L16 16 L13 29 L23 14 L16 14 Z"
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )

      case 'smile':
        return (
          <g stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none">
            <circle cx="16" cy="16" r="12" />
            <circle cx="12" cy="13" r="1.2" fill={color} />
            <circle cx="20" cy="13" r="1.2" fill={color} />
            <path d="M11 19 C13 23 19 23 21 19" />
          </g>
        )

      case 'brackets':
        return (
          <g stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none">
            <path d="M8 8 C5 12 5 20 8 24" />
            <path d="M24 8 C27 12 27 20 24 24" />
          </g>
        )

      case 'camera':
        return (
          <g stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Camera Body */}
            <rect x="4" y="9" width="24" height="17" rx="3.5" />
            {/* Top flash / prism */}
            <path d="M10 9 L12 5 L20 5 L22 9" />
            {/* Lens outer */}
            <circle cx="16" cy="17.5" r="5" />
            {/* Lens inner */}
            <circle cx="16" cy="17.5" r="2.2" fill={color} />
            {/* Flash dot */}
            <circle cx="23.5" cy="12.5" r="1" fill={color} />
          </g>
        )

      case 'tulip':
        return (
          <g stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Tulip flower head */}
            <path d="M10 13 C10 19 16 20 16 20 C16 20 22 19 22 13 C22 10 19 8 16 11 C13 8 10 10 10 13 Z" />
            <path d="M16 11 L16 19" />
            {/* Stem */}
            <path d="M16 20 L16 29" strokeWidth="2.2" />
            {/* Side leaf */}
            <path d="M16 25 C19 23 23 23 23 21 C23 25 19 27 16 27" fill={color} opacity="0.3" />
          </g>
        )

      case 'bow':
        return (
          <g stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Center knot */}
            <circle cx="16" cy="15" r="2.5" fill={color} />
            {/* Left loop */}
            <path d="M14 15 C8 9 5 13 8 18 C11 19 14 16 14 15 Z" />
            {/* Right loop */}
            <path d="M18 15 C24 9 27 13 24 18 C21 19 18 16 18 15 Z" />
            {/* Ribbon tails */}
            <path d="M15 17.5 C13 22 10 26 9 27" />
            <path d="M17 17.5 C19 22 22 26 23 27" />
          </g>
        )

      case 'mascot_bean':
        return (
          <g stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Jumping arms */}
            <path d="M6 13 C8 8 10 9 10 14" strokeWidth="2.2" />
            <path d="M26 13 C24 8 22 9 22 14" strokeWidth="2.2" />
            {/* Cute bean body */}
            <rect x="9" y="10" width="14" height="15" rx="7" />
            {/* Cute eyes */}
            <circle cx="13" cy="15" r="1.3" fill={color} />
            <circle cx="19" cy="15" r="1.3" fill={color} />
            {/* Happy smile */}
            <path d="M14 18 C15.2 20 16.8 20 18 18" strokeWidth="1.8" />
            {/* Blush cheeks */}
            <circle cx="11.5" cy="17" r="1" fill={color} opacity="0.4" />
            <circle cx="20.5" cy="17" r="1" fill={color} opacity="0.4" />
            {/* Little feet */}
            <path d="M12 25 L11 29" strokeWidth="2.2" />
            <path d="M20 25 L21 29" strokeWidth="2.2" />
            {/* Cheer sparkles */}
            <path d="M5 8 L6 6" strokeWidth="1.8" />
            <path d="M27 8 L26 6" strokeWidth="1.8" />
          </g>
        )

      case 'mascot_sun':
        return (
          <g stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Sun circle */}
            <circle cx="16" cy="16" r="8" />
            {/* Smiling face */}
            <circle cx="13.5" cy="14.5" r="1.2" fill={color} />
            <circle cx="18.5" cy="14.5" r="1.2" fill={color} />
            <path d="M14 17.5 C15 19.5 17 19.5 18 17.5" strokeWidth="1.6" />
            {/* Waving stick arm */}
            <path d="M8 17 C5 14 4 10 5 9" strokeWidth="2" />
            <path d="M24 17 C26 18 28 20 28 20" strokeWidth="2" />
            {/* Rays */}
            <line x1="16" y1="4" x2="16" y2="6.5" />
            <line x1="16" y1="25.5" x2="16" y2="28" />
            <line x1="4" y1="16" x2="6.5" y2="16" />
            <line x1="25.5" y1="16" x2="28" y2="16" />
            <line x1="7.5" y1="7.5" x2="9.5" y2="9.5" />
            <line x1="22.5" y1="22.5" x2="24.5" y2="24.5" />
            <line x1="7.5" y1="24.5" x2="9.5" y2="22.5" />
            <line x1="22.5" y1="9.5" x2="24.5" y2="7.5" />
          </g>
        )

      case 'pencil':
        return (
          <g stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M7 25 L6 26 L10 25 Z" fill={color} />
            <path d="M10 25 L24 11 C25 10 26 11 25 12 L11 26 Z" />
            <line x1="22" y1="9" x2="25" y2="12" />
          </g>
        )

      case 'hearts_cluster':
        return (
          <g stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M12 18 C12 18 6 13 6 8.5 C6 5.5 8.5 4 11 5 C12.5 5.5 12 7 12 7 C12 7 11.5 5.5 13 5 C15.5 4 18 5.5 18 8.5 C18 13 12 18 12 18 Z" />
            <path d="M22 13 C22 13 18 9 18 6 C18 4 19.5 3 21 3.5 C22 4 22 5 22 5 C22 5 22 4 23 3.5 C24.5 3 26 4 26 6 C26 9 22 13 22 13 Z" strokeWidth="1.6" />
          </g>
        )

      default:
        return null
    }
  }

  const isUnderline = type === 'underline'
  const svgHeight = isUnderline ? Math.max(12, Math.round(pixelSize * 0.22)) : pixelSize
  const viewBox = isUnderline ? '0 10 32 12' : '0 0 32 32'

  return (
    <svg
      width={pixelSize}
      height={svgHeight}
      viewBox={viewBox}
      aria-hidden="true"
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        transformOrigin: 'center center',
      }}
      className={`inline-block select-none pointer-events-none transition-transform ${className}`}
    >
      {renderPath()}
    </svg>
  )
}
