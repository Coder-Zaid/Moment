import React, { type RefObject } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EyeOff, Sparkles } from 'lucide-react'
import type { PoseIdea } from '../../constants/poseIdeas'
import { PoseInspirationCard } from './PoseInspirationCard'

interface CameraViewfinderProps {
  videoRef: RefObject<HTMLVideoElement | null>
  isMirrored?: boolean
  countdownNumber: number | null
  showFlash: boolean
  currentPose?: PoseIdea | null
  showPoseGuide?: boolean
  onNextPose?: () => void
  onTogglePeekCamera?: () => void
  isPeekingCamera?: boolean
  currentShotIndex?: number
  totalShots?: number
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  videoRef,
  isMirrored = true,
  countdownNumber,
  showFlash,
  currentPose,
  showPoseGuide = false,
  onNextPose,
  onTogglePeekCamera,
  isPeekingCamera = false,
  currentShotIndex = 1,
  totalShots = 4,
}) => {
  const isPoseActive = showPoseGuide && !isPeekingCamera && countdownNumber === null && currentPose

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[58vh] rounded-2xl overflow-hidden bg-[#0d0c0b] border border-[#2e2821] shadow-2xl flex items-center justify-center select-none">
      {/* 1. Live Video Feed (Always mounted in DOM to prevent video restarts) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          transform: isMirrored ? 'scaleX(-1)' : 'none',
        }}
        className="w-full h-full object-cover"
      />

      {/* 2. Cinematic Studio Viewfinder Framing Overlay (Shown when camera is visible) */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-10">
        {/* Top Framing Guidelines */}
        <div className="w-full flex justify-between items-start">
          <div className="w-8 sm:w-12 h-8 sm:h-12 border-t-2 border-l-2 border-white/60 rounded-tl" />
          <div className="w-6 h-0.5 bg-white/40" />
          <div className="w-8 sm:w-12 h-8 sm:h-12 border-t-2 border-r-2 border-white/60 rounded-tr" />
        </div>

        {/* Center Golden Ratio / Eye-line guidelines */}
        <div className="w-full flex items-center justify-between px-2 opacity-30">
          <div className="w-8 h-0.5 bg-white" />
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
          <div className="w-8 h-0.5 bg-white" />
        </div>

        {/* Bottom Framing Guidelines */}
        <div className="w-full flex justify-between items-end">
          <div className="w-8 sm:w-12 h-8 sm:h-12 border-b-2 border-l-2 border-white/60 rounded-bl" />
          <div className="w-6 h-0.5 bg-white/40" />
          <div className="w-8 sm:w-12 h-8 sm:h-12 border-b-2 border-r-2 border-white/60 rounded-br" />
        </div>
      </div>

      {/* Subtle Studio Lens Vignette */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 shadow-[inset_0_0_60px_rgba(0,0,0,0.7)] z-10" />

      {/* 3. POSE INSPIRATION OVERLAY (Shown before clicking shutter) */}
      <AnimatePresence>
        {isPoseActive && currentPose && (
          <motion.div
            key={currentPose.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-20"
          >
            <PoseInspirationCard
              pose={currentPose}
              shotNumber={currentShotIndex}
              totalShots={totalShots}
              onShuffle={onNextPose || (() => {})}
              onPeekCamera={onTogglePeekCamera}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. CAMERA PEEK FLOATING BADGE (When guest temporarily peeks live camera before shutter) */}
      {isPeekingCamera && showPoseGuide && countdownNumber === null && currentPose && (
        <div className="absolute top-4 inset-x-0 mx-auto w-fit z-20">
          <button
            type="button"
            onClick={onTogglePeekCamera}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 hover:bg-black/90 text-white text-xs font-mono font-medium backdrop-blur-md border border-[#ffd166]/40 shadow-xl cursor-pointer transition-transform active:scale-95"
          >
            <EyeOff className="w-3.5 h-3.5 text-[#ffd166]" />
            <span>Peeking Camera • Tap to view Pose Idea</span>
          </button>
        </div>
      )}

      {/* 5. FLOATING POSE MINI-GUIDE DURING COUNTDOWN (Reference reminder while guest strikes pose) */}
      <AnimatePresence>
        {countdownNumber !== null && currentPose && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 left-4 z-30 flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/30 text-white shadow-2xl"
          >
            <img
              src={currentPose.imageUrl}
              alt={currentPose.title}
              className="w-10 h-10 rounded-lg object-cover border border-white/40 shadow-sm shrink-0"
            />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#ffd166] flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Pose Target
              </span>
              <span className="text-xs font-bold font-serif leading-tight text-white drop-shadow">
                {currentPose.title}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. CINEMATIC COUNTDOWN OVERLAY */}
      <AnimatePresence>
        {countdownNumber !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none z-30"
          >
            {/* Concentric Circular Aperture Reticle */}
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
              {/* Outer Pulsing Aperture Ring */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full border border-white/40"
              />

              {/* Inner Crosshair Lines */}
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className="w-full h-[1px] bg-white" />
                <div className="h-full w-[1px] bg-white absolute" />
              </div>

              {/* Middle Dial Circle */}
              <div className="absolute inset-6 rounded-full border border-white/60 bg-black/30 backdrop-blur-sm" />

              {/* Countdown Number */}
              <motion.span
                key={countdownNumber}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.4, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                className="font-serif text-6xl sm:text-7xl font-bold text-white tracking-normal drop-shadow-lg z-10"
              >
                {countdownNumber}
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. STUDIO FLASH / EXPOSURE EFFECT */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 bg-white pointer-events-none z-40"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
