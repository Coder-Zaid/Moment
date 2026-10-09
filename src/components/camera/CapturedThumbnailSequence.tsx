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
  isLight?: boolean
}

export const CapturedThumbnailSequence: React.FC<CapturedThumbnailSequenceProps> = ({
  totalSlots,
  photos,
  activeTargetIndex,
  isRetakeMode,
  retakeIndex,
  onSelectRetake,
  disabled = false,
  isLight = false,
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
              relative w-16 sm:w-20 aspect-[4/3] rounded-xl overflow-hidden border-2
              transition-all duration-200 cursor-pointer touch-press shrink-0 shadow-sm
              ${
                isBeingRetaken
                  ? isLight
                    ? 'border-[#c97d66] ring-2 ring-[#c97d66] shadow-md bg-white'
                    : 'border-[#ffd166] ring-2 ring-[#ffd166] shadow-md bg-[#1c1814]'
                  : isCurrentTarget
                  ? isLight
                    ? 'border-[#c97d66] border-dashed ring-2 ring-[#c97d66]/40 bg-[#c97d66]/10'
                    : 'border-[#ffd166] border-dashed ring-2 ring-[#ffd166]/40 bg-[#ffd166]/10'
                  : photo
                  ? isLight
                    ? 'border-stone-300 hover:border-stone-500 shadow bg-white'
                    : 'border-[#3d362d] hover:border-[#b87d4b]/80 shadow bg-[#181512]'
                  : isLight
                  ? 'border-stone-300 bg-white/95'
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
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono font-bold text-white shadow">
                  {slotNumber}
                </div>

                {/* Retake badge overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-[#f4efe6] uppercase">
                  <RotateCcw className="w-3.5 h-3.5 text-[#ffd166]" />
                  <span>Retake</span>
                </div>
              </div>
            ) : (
              <div
                className={`w-full h-full flex flex-col items-center justify-center ${
                  isLight ? 'bg-white text-stone-700' : 'bg-[#171411] text-[#736758]'
                }`}
              >
                <span
                  className={`font-mono text-sm font-bold ${
                    isCurrentTarget
                      ? isLight
                        ? 'text-[#c97d66]'
                        : 'text-[#ffd166]'
                      : isLight
                      ? 'text-stone-900'
                      : 'text-[#f4efe6]'
                  }`}
                >
                  {slotNumber}
                </span>
                {isCurrentTarget && (
                  <span
                    className={`text-[8px] font-mono font-bold uppercase tracking-wider mt-0.5 ${
                      isLight ? 'text-[#c97d66]' : 'text-[#ffd166]'
                    }`}
                  >
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
