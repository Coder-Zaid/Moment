import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Shuffle, Eye, Camera, Lightbulb } from 'lucide-react'
import type { PoseIdea } from '../../constants/poseIdeas'

interface PoseInspirationCardProps {
  pose: PoseIdea
  shotNumber: number
  totalShots: number
  onShuffle: () => void
  onPeekCamera?: () => void
}

export const PoseInspirationCard: React.FC<PoseInspirationCardProps> = ({
  pose,
  shotNumber,
  totalShots,
  onShuffle,
  onPeekCamera,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-black select-none">
      {/* Background Pose Image with Cinematic Vignette */}
      <div className="absolute inset-0">
        <motion.img
          key={pose.id}
          src={pose.imageUrl}
          alt={pose.title}
          onLoad={() => setImageLoaded(true)}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: imageLoaded ? 1 : 0.8, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full h-full object-cover object-center"
        />

        {/* Ambient Dark Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/75 pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/15 pointer-events-none" />
      </div>

      {/* Top Header Badge & Action Controls */}
      <div className="relative z-10 w-full flex items-center justify-between p-3 sm:p-5">
        {/* Shot & Category Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg text-xs font-mono font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd166] animate-pulse" />
            <span>
              POSE IDEA {String(shotNumber).padStart(2, '0')}/{String(totalShots).padStart(2, '0')}
            </span>
          </div>

          <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-sans font-medium tracking-wide">
            {pose.vibe}
          </span>
        </div>

        {/* Shuffle / Next Pose Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onShuffle}
            title="Show another pose idea"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-stone-900 text-xs font-mono font-bold tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 stroke-[2.5] text-[#c97d66]" />
            <span className="hidden xs:inline">Next Pose</span>
          </button>

          {onPeekCamera && (
            <button
              type="button"
              onClick={onPeekCamera}
              title="Peek at your live camera"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 text-xs font-mono font-medium tracking-wider backdrop-blur-md shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#ffd166]" />
              <span className="hidden md:inline">Peek Camera</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Pose Details Card */}
      <div className="relative z-10 p-3 sm:p-5 max-w-xl">
        <motion.div
          key={pose.id}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl p-3 sm:p-4 bg-black/65 backdrop-blur-md border border-white/20 shadow-2xl"
        >
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-white tracking-wide drop-shadow">
              {pose.title}
            </h3>
            {pose.koreanTitle && (
              <span className="text-xs sm:text-sm font-sans font-medium text-[#ffd166]/90">
                {pose.koreanTitle}
              </span>
            )}
          </div>

          <p className="flex items-start gap-2 text-xs sm:text-sm text-stone-200 font-sans leading-relaxed">
            <Lightbulb className="w-4 h-4 text-[#ffd166] shrink-0 mt-0.5" />
            <span>{pose.tip}</span>
          </p>

          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-300">
            <span className="flex items-center gap-1 text-[#ffd166]">
              <Camera className="w-3 h-3" /> Hit shutter to switch to camera & capture
            </span>
            <span className="opacity-75 hidden sm:inline">Tap shutter below</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
