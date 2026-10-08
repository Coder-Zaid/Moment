import React from 'react'

export type StickerVariant = 'badge' | 'oval' | 'starburst' | 'tag' | 'tape'
export type StickerColor = 'cream' | 'bronze' | 'noir' | 'blush' | 'gold' | 'kraft'

interface StickerProps {
  text: string
  subtext?: string
  variant?: StickerVariant
  color?: StickerColor
  rotation?: number
  scale?: number
  className?: string
  icon?: React.ReactNode
}

export const Sticker: React.FC<StickerProps> = ({
  text,
  subtext,
  variant = 'badge',
  color = 'cream',
  rotation = -4,
  scale = 1,
  className = '',
  icon,
}) => {
  const colorStyles: Record<StickerColor, { bg: string; text: string; border: string }> = {
    cream: {
      bg: 'bg-[#f7f2e8]',
      text: 'text-[#1c1814]',
      border: 'border-[#dfd4c2]',
    },
    bronze: {
      bg: 'bg-[#b87d4b]',
      text: 'text-[#faf5ee]',
      border: 'border-[#8f5a2b]',
    },
    noir: {
      bg: 'bg-[#141210]',
      text: 'text-[#f5ede2]',
      border: 'border-[#362e24]',
    },
    blush: {
      bg: 'bg-[#f4ded4]',
      text: 'text-[#4a261c]',
      border: 'border-[#e0c2b6]',
    },
    gold: {
      bg: 'bg-gradient-to-br from-[#d4af37] to-[#aa8014]',
      text: 'text-[#141210]',
      border: 'border-[#e8ca68]',
    },
    kraft: {
      bg: 'bg-[#c9b295]',
      text: 'text-[#261e16]',
      border: 'border-[#b09677]',
    },
  }

  const c = colorStyles[color]

  const getVariantClasses = () => {
    switch (variant) {
      case 'oval':
        return 'rounded-[999px] px-3.5 py-1.5 border-2'
      case 'tag':
        return 'rounded-md px-3 py-1 border'
      case 'starburst':
        return 'rounded-full px-4 py-2 border-2 border-dashed'
      case 'tape':
        return 'rounded-sm px-3.5 py-1 border-t border-b'
      case 'badge':
      default:
        return 'rounded-full px-3 py-1 border'
    }
  }

  return (
    <div
      aria-hidden="true"
      style={{
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transformOrigin: 'center center',
      }}
      className={`
        inline-flex flex-col items-center justify-center select-none pointer-events-none
        ${getVariantClasses()} ${c.bg} ${c.text} ${c.border}
        sticker-shadow transition-transform
        ${className}
      `}
    >
      <div className="flex items-center gap-1">
        {icon && <span className="opacity-80">{icon}</span>}
        <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap">
          {text}
        </span>
      </div>
      {subtext && (
        <span className="text-[8px] font-mono tracking-tight uppercase opacity-70 -mt-0.5">
          {subtext}
        </span>
      )}
    </div>
  )
}
