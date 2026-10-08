import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FRAME_PRESETS } from '../../constants/theme'
import type { FrameId, CapturedPhoto } from '../../types/photobooth'
import { Check, Sparkles } from 'lucide-react'

interface FrameSelectorProps {
  activePhoto: CapturedPhoto | null
  selectedFrame: FrameId
  onSelectFrame: (frameId: FrameId) => void
  onApplyToAll?: (frameId: FrameId) => void
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  activePhoto,
  selectedFrame,
  onSelectFrame,
  onApplyToAll,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const sampleUrl = activePhoto?.url || activePhoto?.previewUrl

  return (
    <div className="w-full flex flex-col gap-2.5 my-2 select-none">
      <div className="flex items-center justify-between px-1">
        <span className="font-serif text-lg tracking-wider text-[#f4efe6] uppercase font-medium">
          Frame
        </span>

        {onApplyToAll && (
          <button
            type="button"
            onClick={() => onApplyToAll(selectedFrame)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#201c18] hover:bg-[#2c2620] text-[10px] font-mono tracking-wider text-[#b87d4b] uppercase border border-[#3b3226] transition-colors cursor-pointer touch-press"
          >
            <Sparkles className="w-3 h-3" />
            <span>Apply to All Frames</span>
          </button>
        )}
      </div>

      {/* Horizontal Swatches Carousel matching Reference Panel 4 */}
      <div className="w-full flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 px-1">
        {FRAME_PRESETS.map((frame) => {
          const isSelected = selectedFrame === frame.id

          return (
            <motion.button
              key={frame.id}
              type="button"
              onClick={() => onSelectFrame(frame.id)}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              className="flex flex-col items-center gap-1.5 cursor-pointer touch-press shrink-0 group"
            >
              {/* Rectangular Frame Swatch showing miniature framed photo */}
              <div
                className={`
                  relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden p-1.5 border-2
                  transition-all duration-200 shadow-md flex items-center justify-center
                  ${frame.bgClass} ${frame.borderClass}
                  ${
                    isSelected
                      ? 'ring-2 ring-[#b87d4b] ring-offset-2 ring-offset-[#0b0a09] scale-105 shadow-xl shadow-[#b87d4b]/20'
                      : 'hover:border-[#b87d4b]/60'
                  }
                `}
              >
                {/* Inner simulated photo slot */}
                <div className="w-full h-full rounded-[4px] overflow-hidden bg-[#241f1a] flex items-center justify-center">
                  {sampleUrl ? (
                    <img src={sampleUrl} alt="" className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className="w-full h-full bg-[#3d3226]" />
                  )}
                </div>

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#b87d4b] text-[#140e08] flex items-center justify-center shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Frame Label */}
              <span
                className={`text-[10px] font-mono tracking-wider uppercase transition-colors text-center max-w-[75px] truncate ${
                  isSelected ? 'text-[#f4efe6] font-semibold' : 'text-[#8c8072] group-hover:text-[#c2b6a4]'
                }`}
              >
                {frame.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
