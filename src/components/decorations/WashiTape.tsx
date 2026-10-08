import React from 'react'

export type TapePattern = 'translucent' | 'stripes' | 'kraft' | 'bronze' | 'grid'

interface WashiTapeProps {
  angle?: number
  width?: string
  height?: string
  pattern?: TapePattern
  className?: string
}

export const WashiTape: React.FC<WashiTapeProps> = ({
  angle = -12,
  width = 'w-20 sm:w-24',
  height = 'h-5 sm:h-6',
  pattern = 'translucent',
  className = '',
}) => {
  const getPatternStyles = () => {
    switch (pattern) {
      case 'stripes':
        return 'bg-[repeating-linear-gradient(45deg,rgba(244,239,230,0.7),rgba(244,239,230,0.7)_4px,rgba(215,195,170,0.4)_4px,rgba(215,195,170,0.4)_8px)]'
      case 'kraft':
        return 'bg-[#d8c3a5]/80 border-t border-b border-[#bda688]/50'
      case 'bronze':
        return 'bg-[#b87d4b]/65 border-t border-b border-[#8f5a2b]/60'
      case 'grid':
        return 'bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:6px_6px] bg-[#f4efe6]/75'
      case 'translucent':
      default:
        return 'bg-[#f4efe6]/75 border-t border-b border-white/30'
    }
  }

  return (
    <div
      aria-hidden="true"
      style={{
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'center center',
      }}
      className={`
        ${width} ${height} ${getPatternStyles()}
        relative pointer-events-none select-none z-20
        backdrop-blur-[2px] shadow-sm shadow-black/30
        before:content-[''] before:absolute before:inset-y-0 before:-left-1 before:w-1.5
        before:bg-transparent before:border-r-2 before:border-dashed before:border-black/20
        after:content-[''] after:absolute after:inset-y-0 after:-right-1 after:w-1.5
        after:bg-transparent after:border-l-2 after:border-dashed after:border-black/20
        ${className}
      `}
    />
  )
}
