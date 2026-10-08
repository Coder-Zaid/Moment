import React, { type RefObject } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CameraViewfinderProps {
  videoRef: RefObject<HTMLVideoElement | null>
  isMirrored?: boolean
  countdownNumber: number | null
  showFlash: boolean
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  videoRef,
  isMirrored = true,
  countdownNumber,
  showFlash,
}) => {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[58vh] rounded-2xl overflow-hidden bg-[#0d0c0b] border border-[#2e2821] shadow-2xl flex items-center justify-center select-none">
      {/* Live Video Feed */}
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

      {/* Cinematic Studio Viewfinder Framing Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6">
        {/* Top Framing Guidelines */}
        <div className="w-full flex justify-between items-start">
          {/* Top-left corner bracket */}
          <div className="w-8 sm:w-12 h-8 sm:h-12 border-t-2 border-l-2 border-white/60 rounded-tl" />
          {/* Top center guide */}
          <div className="w-6 h-0.5 bg-white/40" />
          {/* Top-right corner bracket */}
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
          {/* Bottom-left corner bracket */}
          <div className="w-8 sm:w-12 h-8 sm:h-12 border-b-2 border-l-2 border-white/60 rounded-bl" />
          {/* Bottom center guide */}
          <div className="w-6 h-0.5 bg-white/40" />
          {/* Bottom-right corner bracket */}
          <div className="w-8 sm:w-12 h-8 sm:h-12 border-b-2 border-r-2 border-white/60 rounded-br" />
        </div>
      </div>

      {/* Subtle Studio Lens Vignette */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 shadow-[inset_0_0_60px_rgba(0,0,0,0.7)]" />

      {/* 3. CINEMATIC COUNTDOWN OVERLAY (Matching Reference Panel 3: concentric radar circle) */}
      <AnimatePresence>
        {countdownNumber !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none z-20"
          >
            {/* Concentric Circular Aperture Reticle from Reference Image */}
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

              {/* Countdown Number with High Impact Spring Animation */}
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

      {/* 4. STUDIO FLASH / EXPOSURE EFFECT */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 bg-white pointer-events-none z-30"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
