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
    <div className="flex-1 h-full max-h-full flex flex-col justify-between w-full py-1 sm:py-2 select-none relative overflow-hidden">
      {/* Decorative background doodles */}
      <div className="absolute top-10 left-3 opacity-60 pointer-events-none hidden sm:block">
        <Doodle type="sparkle" size={20} color="#d49b64" />
      </div>
      <div className="absolute top-14 right-4 opacity-50 pointer-events-none hidden sm:block">
        <Doodle type="star" size={18} color="#e5ceb8" rotation={20} />
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <BackButton onClick={() => navigate('HOME')} />
        <div className="flex items-center gap-2">
          <DateStamp color="amber" rotation={-1} />
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1e1a16] border border-[#342d25] text-[10px] text-[#b8ab9a]">
            <span className="font-mono uppercase tracking-wider text-[10px] text-[#b87d4b]">STEP 01</span>
            <span className="text-[#685c4c]">•</span>
            <span className="uppercase tracking-wider text-[10px]">CHOOSE MODE</span>
          </div>
        </div>
      </div>

      {/* Main Experience Choices */}
      <div className="my-auto flex flex-col items-center text-center px-1">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-2 sm:mb-3 relative shrink-0"
        >
          <div className="inline-block relative">
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl tracking-widest text-[#f5f0e6] uppercase">
              HOW WILL YOU MAKE YOUR MOMENT?
            </h2>
            <div className="absolute -top-2.5 -right-5 text-[#d49b64] opacity-80 hidden sm:block">
              <Doodle type="heart" size={18} color="#e07a68" rotation={12} />
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-[#9e9282] tracking-wider uppercase mt-0.5">
            Select your preferred method to capture or curate your photos
          </p>
        </motion.div>

        {/* Dual Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl">
          {/* Card 1: Studio Camera */}
          <div className="relative">
            <div className="absolute -top-2.5 left-4 z-30 pointer-events-none">
              <WashiTape angle={-8} width="w-16" pattern="stripes" />
            </div>
            <div className="absolute -top-2.5 -right-1 z-30 pointer-events-none">
              <Sticker text="LIVE BOOTH" variant="badge" color="bronze" rotation={8} />
            </div>

            <motion.button
              type="button"
              onClick={() => handleSelectMode('camera')}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`
                relative flex flex-row sm:flex-col items-center p-3 sm:p-4 rounded-xl cursor-pointer
                border-2 transition-all duration-300 text-left w-full gap-3 sm:gap-2
                ${
                  state.mode === 'camera'
                    ? 'bg-[#1e1b17] border-[#b87d4b] shadow-xl shadow-[#b87d4b]/20 ring-1 ring-[#b87d4b]/50'
                    : 'bg-[#141210]/90 border-[#2e2924] hover:border-[#473f37] hover:bg-[#1a1714]'
                }
              `}
            >
              {state.mode === 'camera' && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#b87d4b] text-[#140e08] flex items-center justify-center shadow-lg z-20">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Visual Viewfinder Mock */}
              <div className="relative w-24 h-18 sm:w-full sm:aspect-[16/10] sm:max-h-[100px] rounded-lg overflow-hidden bg-[#221f1c] border border-[#3b342c] flex items-center justify-center shadow-inner shrink-0">
                <img
                  src={SAMPLE_PORTRAITS[0].url}
                  alt="Camera Capture Mode"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/70 text-[8px] font-mono text-[#d8cebe] uppercase">
                  Live
                </div>
              </div>

              {/* Content Details */}
              <div className="w-full flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-6 h-6 rounded bg-[#f4efe6] text-[#121110] flex items-center justify-center shadow">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg tracking-wider text-[#f4efe6] uppercase">
                    TAKE PHOTO
                  </h3>
                </div>
                <p className="text-[10px] sm:text-xs text-[#a09483] leading-snug">
                  Pose in front of the lens with countdown & studio flash.
                </p>

                <div className="mt-1.5 pt-1.5 border-t border-[#26211b] flex items-center justify-between text-[10px] font-bold tracking-wider text-[#ffd166] uppercase">
                  <span>Start Camera</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#b87d4b]" />
                </div>
              </div>
            </motion.button>
          </div>

          {/* Card 2: Upload Photos */}
          <div className="relative">
            <div className="absolute -top-2.5 right-4 z-30 pointer-events-none">
              <WashiTape angle={6} width="w-16" pattern="kraft" />
            </div>
            <div className="absolute -top-2.5 -left-1 z-30 pointer-events-none">
              <Sticker text="GALLERY" variant="badge" color="cream" rotation={-6} />
            </div>

            <motion.button
              type="button"
              onClick={() => handleSelectMode('upload')}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`
                relative flex flex-row sm:flex-col items-center p-3 sm:p-4 rounded-xl cursor-pointer
                border-2 transition-all duration-300 text-left w-full gap-3 sm:gap-2
                ${
                  state.mode === 'upload'
                    ? 'bg-[#1e1b17] border-[#b87d4b] shadow-xl shadow-[#b87d4b]/20 ring-1 ring-[#b87d4b]/50'
                    : 'bg-[#141210]/90 border-[#2e2924] hover:border-[#473f37] hover:bg-[#1a1714]'
                }
              `}
            >
              {state.mode === 'upload' && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#b87d4b] text-[#140e08] flex items-center justify-center shadow-lg z-20">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Visual Scrapbook Mock */}
              <div className="relative w-24 h-18 sm:w-full sm:aspect-[16/10] sm:max-h-[100px] rounded-lg overflow-hidden bg-[#221f1c] border border-[#3b342c] flex items-center justify-center shadow-inner shrink-0">
                <img
                  src={SAMPLE_PORTRAITS[1].url}
                  alt="Upload Photos Mode"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/70 text-[8px] font-mono text-[#d8cebe] uppercase">
                  Files
                </div>
              </div>

              {/* Content Details */}
              <div className="w-full flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-6 h-6 rounded bg-[#b87d4b] text-[#140e08] flex items-center justify-center shadow">
                    <Upload className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg tracking-wider text-[#f4efe6] uppercase">
                    UPLOAD PHOTOS
                  </h3>
                </div>
                <p className="text-[10px] sm:text-xs text-[#a09483] leading-snug">
                  Import existing phone or camera portraits from your device.
                </p>

                <div className="mt-1.5 pt-1.5 border-t border-[#26211b] flex items-center justify-between text-[10px] font-bold tracking-wider text-[#ffd166] uppercase">
                  <span>Upload Files</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#b87d4b]" />
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Playful Bottom Handwritten Note */}
        <div className="mt-2 sm:mt-3">
          <HandwrittenNote
            text="either way, it prints like real film ✨"
            doodle="smile"
            size="sm"
            color="text-[#cfbca8]"
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[9px] font-mono text-[#786e60] tracking-widest pt-2 border-t border-[#1e1a16] shrink-0">
        <span>MOMENT PHOTO STUDIO</span>
        <span>STAGE 01 / 07</span>
      </div>
    </div>
  )
}
