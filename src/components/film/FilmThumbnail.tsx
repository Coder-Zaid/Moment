import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { FilmFormatId } from '../../types/photobooth'
import { FILM_FORMATS } from '../../constants/theme'
import { Check } from 'lucide-react'

interface FilmThumbnailProps {
  formatId: FilmFormatId
  isSelected: boolean
  onSelect: () => void
  samplePhotos?: string[]
}

export const FilmThumbnail: React.FC<FilmThumbnailProps> = ({
  formatId,
  isSelected,
  onSelect,
  samplePhotos = [],
}) => {
  const shouldReduceMotion = useReducedMotion()
  const format = FILM_FORMATS[formatId]
  const photoCount = format.photoCount

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative flex flex-col items-center p-4 sm:p-6 rounded-2xl cursor-pointer
        border-2 transition-all duration-200 select-none
        ${
          isSelected
            ? 'bg-[#1e1b17] border-[#b87d4b] shadow-xl shadow-[#b87d4b]/10'
            : 'bg-[#141210] border-[#2e2924] hover:border-[#473f37] hover:bg-[#191714]'
        }
      `}
    >
      {/* Selected Indicator Checkmark */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#b87d4b] text-[#140e08] flex items-center justify-center shadow-md">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
      )}

      {/* Mini Visual Representation of the Strip */}
      <div className="my-2 p-2 bg-[#f4efe6] rounded-md shadow-film-strip flex flex-col items-center gap-1.5 w-[90px] sm:w-[110px]">
        {Array.from({ length: photoCount }).map((_, i) => (
          <div
            key={i}
            className="w-full aspect-[4/3] rounded-[2px] overflow-hidden bg-[#2d2925] flex items-center justify-center"
          >
            {samplePhotos[i] ? (
              <img
                src={samplePhotos[i]}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-[#3a342c] opacity-80" />
            )}
          </div>
        ))}
        <div className="text-[7px] font-serif tracking-widest text-[#241e18] uppercase font-bold pt-1">
          MOMENT
        </div>
      </div>

      {/* Format Label */}
      <div className="mt-4 text-center">
        <h4 className="font-serif text-lg sm:text-xl tracking-wider text-[#f4efe6]">
          {format.name}
        </h4>
        <p className="text-xs text-[#a39786] tracking-wide mt-1">
          {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'} • {format.aspectRatio}
        </p>
      </div>
    </motion.button>
  )
}
