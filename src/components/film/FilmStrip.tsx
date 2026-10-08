import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { CapturedPhoto, FilmFormatId, FilterId, FrameId } from '../../types/photobooth'
import { FILTER_PRESETS, FRAME_PRESETS } from '../../constants/theme'
import { Image as ImageIcon } from 'lucide-react'

export interface FilmStripProps {
  format?: FilmFormatId
  photos?: CapturedPhoto[]
  filterId?: FilterId
  frameId?: FrameId
  tiltAngle?: number
  scale?: number
  elevation?: 'flat' | 'raised' | 'floating'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showBrand?: boolean
  isSelected?: boolean
  className?: string
  onClick?: () => void
  onSlotClick?: (index: number) => void
  activeSlotIndex?: number | null
  interactive?: boolean
}

export const FilmStrip: React.FC<FilmStripProps> = ({
  format = '1x4',
  photos = [],
  filterId = 'original',
  frameId = 'classic_cream',
  tiltAngle = 0,
  scale = 1,
  elevation = 'raised',
  size = 'md',
  showBrand = true,
  isSelected = false,
  className = '',
  onClick,
  onSlotClick,
  activeSlotIndex = null,
  interactive = false,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const photoCount = format === '1x2' ? 2 : 4

  // Match presets
  const activeFilter = FILTER_PRESETS.find((f) => f.id === filterId)?.cssFilter || 'none'
  const activeFrame = FRAME_PRESETS.find((f) => f.id === frameId) || FRAME_PRESETS[0]

  const elevationShadows = {
    flat: 'shadow-sm',
    raised: 'shadow-film-strip',
    floating: 'shadow-film-strip-hover',
  }

  // Ensure we have slots up to required count
  const slots = Array.from({ length: photoCount }, (_, i) => photos[i] || null)

  return (
    <motion.div
      style={{
        transform: `rotate(${shouldReduceMotion ? 0 : tiltAngle}deg) scale(${scale})`,
        transformOrigin: 'center center',
      }}
      whileHover={interactive && !shouldReduceMotion ? { scale: scale * 1.025, y: -4 } : undefined}
      whileTap={interactive && !shouldReduceMotion ? { scale: scale * 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onClick={onClick}
      className={`
        relative inline-flex flex-col items-center select-none
        rounded-[10px] p-2.5 sm:p-3
        border ${activeFrame.borderClass} ${activeFrame.bgClass}
        ${elevationShadows[elevation]}
        transition-all duration-300
        ${isSelected ? 'ring-2 ring-[#b87d4b] ring-offset-4 ring-offset-[#0b0a09]/50 shadow-xl shadow-[#b87d4b]/20' : ''}
        ${interactive ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 rounded-[10px] pointer-events-none paper-grain opacity-40" />

      {/* Subtle top indicator / header space */}
      <div className="w-full flex justify-between items-center px-1 mb-1.5 opacity-40">
        <span className="text-[7px] font-mono tracking-widest uppercase text-current">ISO 400</span>
        <span className="text-[7px] font-mono tracking-widest text-current">#0{photoCount}</span>
      </div>

      {/* Photos Stack */}
      <div className="flex flex-col gap-2 w-full">
        {slots.map((photo, index) => (
          <FilmPhotoSlot
            key={photo?.id || `empty-${index}`}
            photo={photo}
            index={index}
            size={size}
            stripFilterCss={activeFilter}
            isActive={activeSlotIndex === index}
            onSlotClick={onSlotClick ? () => onSlotClick(index) : undefined}
          />
        ))}
      </div>

      {/* Bottom Chin with Luxury MOMENT branding */}
      {showBrand && (
        <div className="w-full pt-2.5 pb-1 flex flex-col items-center justify-center">
          <span
            className={`font-serif tracking-[0.25em] text-xs font-semibold ${
              frameId === 'dark_obsidian' || frameId === 'golden_crest'
                ? 'text-[#e6dfd1]'
                : 'text-[#2a241e]'
            }`}
          >
            MOMENT
          </span>
          <span
            className={`text-[7px] tracking-[0.3em] uppercase opacity-60 font-sans -mt-0.5 ${
              frameId === 'dark_obsidian' || frameId === 'golden_crest'
                ? 'text-[#b8af9f]'
                : 'text-[#6b6154]'
            }`}
          >
            STUDIO
          </span>
        </div>
      )}
    </motion.div>
  )
}

interface FilmPhotoSlotProps {
  photo: CapturedPhoto | null
  index: number
  size: 'xs' | 'sm' | 'md' | 'lg'
  stripFilterCss: string
  isActive?: boolean
  onSlotClick?: () => void
}

const FilmPhotoSlot: React.FC<FilmPhotoSlotProps> = ({
  photo,
  index,
  size,
  stripFilterCss,
  isActive = false,
  onSlotClick,
}) => {
  const [imgError, setImgError] = useState(false)

  const sizeClasses = {
    xs: 'w-[80px] sm:w-[96px]',
    sm: 'w-[105px] sm:w-[125px]',
    md: 'w-[130px] sm:w-[150px]',
    lg: 'w-[155px] sm:w-[175px]',
  }

  // Priority: photo's individual filterId if set, otherwise the strip-level filter
  const effectiveFilter = photo?.filterId
    ? FILTER_PRESETS.find((f) => f.id === photo.filterId)?.cssFilter || stripFilterCss
    : stripFilterCss

  const cropTransform = photo?.crop
    ? `scale(${photo.crop.scale || 1}) translate(${photo.crop.offsetX || 0}%, ${photo.crop.offsetY || 0}%)`
    : undefined

  return (
    <div
      onClick={onSlotClick}
      className={`
        relative ${sizeClasses[size]} aspect-[4/3] rounded-[4px] overflow-hidden bg-[#24211d]
        border border-black/10 shadow-inner flex items-center justify-center
        ${onSlotClick ? 'cursor-pointer' : ''}
        ${isActive ? 'ring-2 ring-[#b87d4b] ring-offset-1 ring-offset-transparent' : ''}
      `}
    >
      {photo && !imgError ? (
        <img
          src={photo.url || photo.previewUrl}
          alt={`Photo frame ${index + 1}`}
          loading="lazy"
          onError={() => setImgError(true)}
          style={{
            filter: effectiveFilter,
            transform: cropTransform,
            transformOrigin: 'center center',
          }}
          className="w-full h-full object-cover transition-all duration-200"
        />
      ) : (
        <div
          style={{ filter: effectiveFilter }}
          className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-[#38332a] via-[#2a2620] to-[#1c1915]"
        >
          <ImageIcon className="w-6 h-6 text-[#9e8f7a] mb-1 opacity-70" />
          <span className="text-[9px] font-mono tracking-wider uppercase text-[#c2b5a1]">
            FRAME 0{index + 1}
          </span>
        </div>
      )}

      {/* Subtle glossy film gloss / inner shadow */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/15 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15)]" />
    </div>
  )
}
