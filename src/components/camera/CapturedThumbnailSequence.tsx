import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { CapturedPhoto } from '../../types/photobooth'
import { RotateCcw } from 'lucide-react'

interface CapturedThumbnailSequenceProps {
  totalSlots: number
  photos: CapturedPhoto[]
  activeTargetIndex: number
  isRetakeMode: boolean
  retakeIndex: number | null
  onSelectRetake: (index: number) => void
  disabled?: boolean
}

export const CapturedThumbnailSequence: React.FC<CapturedThumbnailSequenceProps> = ({
  totalSlots,
  photos,
  activeTargetIndex,
  isRetakeMode,
  retakeIndex,
  onSelectRetake,
  disabled = false,
}) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="w-full flex items-center justify-center gap-3 sm:gap-4 my-2 px-2 select-none overflow-x-auto py-1">
      {Array.from({ length: totalSlots }).map((_, index) => {
        const photo = photos[index] || null
        const isCurrentTarget = index === activeTargetIndex && !isRetakeMode
        const isBeingRetaken = isRetakeMode && retakeIndex === index
        const slotNumber = String(index + 1).padStart(2, '0')

        return (
          <motion.div
            key={photo?.id || `thumb-slot-${index}`}
            whileHover={photo && !disabled && !shouldReduceMotion ? { scale: 1.05 } : undefined}
            whileTap={photo && !disabled && !shouldReduceMotion ? { scale: 0.95 } : undefined}
            onClick={() => {
              if (photo && !disabled) {
                onSelectRetake(index)
              }
            }}
            className={`
              relative w-16 sm:w-20 aspect-[4/3] rounded-lg overflow-hidden border-2
              transition-all duration-200 cursor-pointer touch-press shrink-0
              ${
                isBeingRetaken
                  ? 'border-[#b87d4b] ring-2 ring-[#b87d4b] shadow-lg shadow-[#b87d4b]/30'
                  : isCurrentTarget
                  ? 'border-[#b87d4b] border-dashed ring-1 ring-[#b87d4b]/60'
                  : photo
                  ? 'border-[#3d362d] hover:border-[#b87d4b]/80 shadow'
                  : 'border-[#29241e] bg-[#141210]'
              }
            `}
          >
            {photo ? (
              <div className="relative w-full h-full group">
                <img
                  src={photo.url || photo.previewUrl}
                  alt={`Capture ${slotNumber}`}
                  className="w-full h-full object-cover"
                />

                {/* Slot index indicator */}
                <div className="absolute top-1 left-1 px-1 rounded bg-black/60 text-[8px] font-mono text-white">
                  {slotNumber}
                </div>

                {/* Retake badge overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-[9px] font-mono text-[#f4efe6] uppercase">
                  <RotateCcw className="w-3 h-3 text-[#b87d4b]" />
                  <span>Retake</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#171411] text-[#736758]">
                <span className="font-mono text-xs font-semibold text-[#8c7f70]">
                  {slotNumber}
                </span>
                {isCurrentTarget && (
                  <span className="text-[7px] font-mono uppercase text-[#b87d4b] tracking-wider mt-0.5">
                    Next
                  </span>
                )}
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
