import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FILTER_PRESETS } from '../../constants/theme'
import type { FilterId, CapturedPhoto } from '../../types/photobooth'
import { Check, Sparkles } from 'lucide-react'

interface FilterSelectorProps {
  activePhoto: CapturedPhoto | null
  selectedFilter: FilterId
  onSelectFilter: (filterId: FilterId) => void
  onApplyToAll?: (filterId: FilterId) => void
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({
  activePhoto,
  selectedFilter,
  onSelectFilter,
  onApplyToAll,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const sampleUrl = activePhoto?.url || activePhoto?.previewUrl

  return (
    <div className="w-full flex flex-col gap-2.5 my-2 select-none">
      <div className="flex items-center justify-between px-1">
        <span className="font-serif text-lg tracking-wider text-[#f4efe6] uppercase font-medium">
          Filter
        </span>

        {onApplyToAll && (
          <button
            type="button"
            onClick={() => onApplyToAll(selectedFilter)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#201c18] hover:bg-[#2c2620] text-[10px] font-mono tracking-wider text-[#b87d4b] uppercase border border-[#3b3226] transition-colors cursor-pointer touch-press"
          >
            <Sparkles className="w-3 h-3" />
            <span>Apply to All Frames</span>
          </button>
        )}
      </div>

      {/* Horizontal Swatches Carousel matching Reference Panel 4 */}
      <div className="w-full flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 px-1">
        {FILTER_PRESETS.map((filter) => {
          const isSelected = selectedFilter === filter.id

          return (
            <motion.button
              key={filter.id}
              type="button"
              onClick={() => onSelectFilter(filter.id)}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              className="flex flex-col items-center gap-1.5 cursor-pointer touch-press shrink-0 group"
            >
              {/* Circular preview swatch with live image & filter applied */}
              <div
                className={`
                  relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2
                  transition-all duration-200 shadow-md flex items-center justify-center
                  ${
                    isSelected
                      ? 'border-[#b87d4b] ring-2 ring-[#b87d4b]/60 scale-105 shadow-xl shadow-[#b87d4b]/20'
                      : 'border-[#332c23] hover:border-[#524638]'
                  }
                `}
              >
                {sampleUrl ? (
                  <img
                    src={sampleUrl}
                    alt={filter.label}
                    style={{ filter: filter.cssFilter }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    style={{ filter: filter.cssFilter }}
                    className="w-full h-full bg-gradient-to-br from-[#4a3f32] to-[#1f1a14]"
                  />
                )}

                {/* Selected Indicator Checkmark */}
                {isSelected && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center text-[#f4efe6]">
                    <div className="w-5 h-5 rounded-full bg-[#b87d4b] text-[#140e08] flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Label */}
              <span
                className={`text-[10px] font-mono tracking-wider uppercase transition-colors text-center max-w-[70px] truncate ${
                  isSelected ? 'text-[#f4efe6] font-semibold' : 'text-[#8c8072] group-hover:text-[#c2b6a4]'
                }`}
              >
                {filter.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
