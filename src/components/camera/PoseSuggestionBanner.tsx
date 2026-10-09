import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Shuffle, Lightbulb, X } from 'lucide-react'
import type { PoseIdea } from '../../constants/poseIdeas'

interface PoseSuggestionBannerProps {
  pose: PoseIdea
  shotNumber: number
  totalShots: number
  onShuffle: () => void
  onDismiss?: () => void
}

export const PoseSuggestionBanner: React.FC<PoseSuggestionBannerProps> = ({
  pose,
  shotNumber,
  totalShots,
  onShuffle,
  onDismiss,
}) => {
  return (
    <motion.div
      key={pose.id}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 15, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full rounded-2xl p-3 sm:p-3.5 bg-black/75 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col gap-1.5 select-none"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-[#ffd166]/20 border border-[#ffd166]/40 text-[#ffd166] text-[10px] sm:text-xs font-mono font-bold tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#ffd166]" />
            POSE IDEA {String(shotNumber).padStart(2, '0')}/{String(totalShots).padStart(2, '0')}
          </span>

          <span className="text-xs sm:text-sm font-serif font-bold text-white tracking-wide flex items-center gap-1.5">
            <span className="text-base sm:text-lg">{pose.emoji}</span>
            <span>{pose.title}</span>
            {pose.koreanTitle && (
              <span className="text-[#ffd166]/90 font-sans font-normal text-xs">
                ({pose.koreanTitle})
              </span>
            )}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onShuffle}
            title="Try another pose suggestion"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-mono font-medium tracking-wide transition-all active:scale-95 cursor-pointer border border-white/20"
          >
            <Shuffle className="w-3 h-3 text-[#ffd166]" />
            <span className="hidden xs:inline">Next</span>
          </button>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              title="Hide suggestion"
              className="p-1 rounded-full text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tip Message */}
      <p className="text-xs sm:text-[13px] text-stone-200 font-sans leading-relaxed flex items-start gap-1.5">
        <Lightbulb className="w-3.5 h-3.5 text-[#ffd166] shrink-0 mt-0.5" />
        <span>{pose.tip}</span>
      </p>
    </motion.div>
  )
}
