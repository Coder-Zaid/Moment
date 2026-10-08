import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { usePhotobooth } from '../context/PhotoboothContext'
import { BackButton } from '../components/ui/BackButton'
import { Camera, Upload, Check, ArrowRight } from 'lucide-react'
import { SAMPLE_PORTRAITS } from '../constants/samples'
import {
  Doodle,
  Sticker,
  WashiTape,
  HandwrittenNote,
  DateStamp,
} from '../components/decorations'

export const ModeSelectionScreen: React.FC = () => {
  const { state, setMode, navigate } = usePhotobooth()
  const shouldReduceMotion = useReducedMotion()

  const handleSelectMode = (mode: 'camera' | 'upload') => {
    setMode(mode)
    navigate('FORMAT_SELECTION')
  }

  return (
    <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full py-2 sm:py-6 select-none relative">
      {/* Decorative background doodles */}
      <div className="absolute top-12 left-4 opacity-70 pointer-events-none hidden sm:block">
        <Doodle type="sparkle" size={26} color="#d49b64" />
      </div>
      <div className="absolute top-20 right-6 opacity-60 pointer-events-none hidden sm:block">
        <Doodle type="star" size={24} color="#e5ceb8" rotation={20} />
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <BackButton onClick={() => navigate('HOME')} />
        <div className="flex items-center gap-2">
          <DateStamp color="amber" rotation={-1} />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1a16] border border-[#342d25] text-xs text-[#b8ab9a]">
            <span className="font-mono uppercase tracking-wider text-[11px] text-[#b87d4b]">STEP 01</span>
            <span className="text-[#685c4c]">•</span>
            <span className="uppercase tracking-wider text-[11px]">CHOOSE MODE</span>
          </div>
        </div>
      </div>

      {/* Main Experience Choices */}
      <div className="my-auto flex flex-col items-center text-center px-2">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 relative"
        >
          <div className="inline-block relative">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-widest text-[#f5f0e6] uppercase">
              HOW WILL YOU MAKE YOUR MOMENT?
            </h2>
            <div className="absolute -top-3 -right-6 text-[#d49b64] opacity-80 hidden sm:block">
              <Doodle type="heart" size={22} color="#e07a68" rotation={12} />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#9e9282] tracking-wider uppercase mt-2">
            Select your preferred method to capture or curate your photos
          </p>
        </motion.div>

        {/* Dual Mode Cards with Washi Tape and Photo Booth Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-3xl">
          {/* Card 1: Studio Camera */}
          <div className="relative">
            {/* Washi Tape Pinning Top Left */}
            <div className="absolute -top-3.5 left-8 z-30 pointer-events-none">
              <WashiTape angle={-8} width="w-20" pattern="stripes" />
            </div>

            {/* Sticker attached to card corner */}
            <div className="absolute -top-3 -right-2 z-30 pointer-events-none">
              <Sticker text="LIVE BOOTH" variant="badge" color="bronze" rotation={8} />
            </div>

            <motion.button
              type="button"
              onClick={() => handleSelectMode('camera')}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -4 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`
                relative flex flex-col items-center p-6 sm:p-8 rounded-2xl cursor-pointer
                border-2 transition-all duration-300 text-left w-full
                ${
                  state.mode === 'camera'
                    ? 'bg-[#1e1b17] border-[#b87d4b] shadow-2xl shadow-[#b87d4b]/20 ring-1 ring-[#b87d4b]/50'
                    : 'bg-[#141210]/90 border-[#2e2924] hover:border-[#473f37] hover:bg-[#1a1714]'
                }
              `}
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full bg-[#2a241e] border border-[#3f352a] text-[10px] uppercase font-mono tracking-wider text-[#b87d4b]">
                Kiosk Studio
              </div>

              {state.mode === 'camera' && (
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#b87d4b] text-[#140e08] flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              {/* Visual Viewfinder Mock */}
              <div className="relative w-full aspect-[16/10] my-4 rounded-xl overflow-hidden bg-[#221f1c] border border-[#3b342c] flex items-center justify-center shadow-inner">
                <img
                  src={SAMPLE_PORTRAITS[0].url}
                  alt="Camera Capture Mode"
                  className="w-full h-full object-cover opacity-85"
                />
                {/* Studio Viewfinder Guidelines */}
                <div className="absolute inset-2 border border-white/20 rounded pointer-events-none flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-white">3</span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-mono text-[#d8cebe] uppercase">
                  Live Shutter
                </div>
              </div>

              {/* Content Details */}
              <div className="w-full mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-[#f4efe6] text-[#121110] flex items-center justify-center shadow">
                    <Camera className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-2xl tracking-wider text-[#f4efe6] uppercase">
                    TAKE PHOTO
                  </h3>
                </div>
                <p className="text-xs text-[#a09483] leading-relaxed mt-1">
                  Step in front of the lens. Posed portrait session with studio countdown and flash.
                </p>
              </div>

              {/* Call to action arrow */}
              <div className="w-full mt-5 pt-3 border-t border-[#26211b] flex items-center justify-between text-xs font-semibold tracking-widest text-[#f4efe6] uppercase">
                <span>Start Camera Session</span>
                <ArrowRight className="w-4 h-4 text-[#b87d4b]" />
              </div>
            </motion.button>
          </div>

          {/* Card 2: Upload Photos */}
          <div className="relative">
            {/* Washi Tape Pinning Top Right */}
            <div className="absolute -top-3.5 right-8 z-30 pointer-events-none">
              <WashiTape angle={6} width="w-20" pattern="kraft" />
            </div>

            {/* Sticker attached to card */}
            <div className="absolute -top-3 -left-2 z-30 pointer-events-none">
              <Sticker text="GALLERY" variant="badge" color="cream" rotation={-6} />
            </div>

            <motion.button
              type="button"
              onClick={() => handleSelectMode('upload')}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -4 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`
                relative flex flex-col items-center p-6 sm:p-8 rounded-2xl cursor-pointer
                border-2 transition-all duration-300 text-left w-full
                ${
                  state.mode === 'upload'
                    ? 'bg-[#1e1b17] border-[#b87d4b] shadow-2xl shadow-[#b87d4b]/20 ring-1 ring-[#b87d4b]/50'
                    : 'bg-[#141210]/90 border-[#2e2924] hover:border-[#473f37] hover:bg-[#1a1714]'
                }
              `}
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full bg-[#2a241e] border border-[#3f352a] text-[10px] uppercase font-mono tracking-wider text-[#b87d4b]">
                Digital Album
              </div>

              {state.mode === 'upload' && (
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#b87d4b] text-[#140e08] flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              {/* Visual Scrapbook Mock */}
              <div className="relative w-full aspect-[16/10] my-4 rounded-xl overflow-hidden bg-[#221f1c] border border-[#3b342c] flex items-center justify-center shadow-inner">
                <img
                  src={SAMPLE_PORTRAITS[1].url}
                  alt="Upload Photos Mode"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-mono text-[#d8cebe] uppercase">
                  Local Files
                </div>
              </div>

              {/* Content Details */}
              <div className="w-full mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-[#b87d4b] text-[#140e08] flex items-center justify-center shadow">
                    <Upload className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-2xl tracking-wider text-[#f4efe6] uppercase">
                    UPLOAD PHOTOS
                  </h3>
                </div>
                <p className="text-xs text-[#a09483] leading-relaxed mt-1">
                  Bring your existing phone or camera portraits into the booth for fine art strip printing.
                </p>
              </div>

              {/* Call to action arrow */}
              <div className="w-full mt-5 pt-3 border-t border-[#26211b] flex items-center justify-between text-xs font-semibold tracking-widest text-[#f4efe6] uppercase">
                <span>Upload From Device</span>
                <ArrowRight className="w-4 h-4 text-[#b87d4b]" />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Playful Bottom Handwritten Note */}
        <div className="mt-6">
          <HandwrittenNote
            text="either way, it prints like real film ✨"
            doodle="smile"
            size="sm"
            color="text-[#cfbca8]"
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#786e60] tracking-widest pt-4 border-t border-[#1e1a16]">
        <span>MOMENT PHOTO STUDIO</span>
        <span>ALL IMAGES PROCESSED LOCALLY</span>
        <span>STAGE 01 / 07</span>
      </div>
    </div>
  )
}
