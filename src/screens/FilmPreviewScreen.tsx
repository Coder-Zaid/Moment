import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { usePhotobooth } from '../context/PhotoboothContext'
import { BackButton } from '../components/ui/BackButton'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { FilmStrip } from '../components/film/FilmStrip'
import { SAMPLE_PORTRAITS } from '../constants/samples'
import { FILM_FORMATS, FRAME_PRESETS, FILTER_PRESETS } from '../constants/theme'
import { Sparkles, Check } from 'lucide-react'
import { WashiTape, Sticker, Doodle } from '../components/decorations'

export const FilmPreviewScreen: React.FC = () => {
  const { state, requiredPhotoCount, navigate, selectFilter, selectFrame } = usePhotobooth()
  const isLight = state.theme === 'light'
  const shouldReduceMotion = useReducedMotion()

  const [isTransitioning, setIsTransitioning] = useState(false)

  // Photos fallback to sample portraits if empty during dev/testing
  const photos =
    state.photos.length >= requiredPhotoCount
      ? state.photos.slice(0, requiredPhotoCount)
      : state.photos.length > 0
      ? state.photos
      : SAMPLE_PORTRAITS.slice(0, requiredPhotoCount)

  const formatConfig = FILM_FORMATS[state.selectedFormat]
  const activeFrame =
    FRAME_PRESETS.find((f) => f.id === state.selectedFrame) || FRAME_PRESETS[0]
  const activeFilter =
    FILTER_PRESETS.find((f) => f.id === state.selectedFilter) || FILTER_PRESETS[0]

  const handleCycleFrame = () => {
    const currentIndex = FRAME_PRESETS.findIndex((f) => f.id === state.selectedFrame)
    const nextIndex = (currentIndex + 1) % FRAME_PRESETS.length
    selectFrame(FRAME_PRESETS[nextIndex].id)
  }

  const handleCycleFilter = () => {
    const currentIndex = FILTER_PRESETS.findIndex((f) => f.id === state.selectedFilter)
    const nextIndex = (currentIndex + 1) % FILTER_PRESETS.length
    selectFilter(FILTER_PRESETS[nextIndex].id)
  }

  const handleProceedToGenerate = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    navigate('GENERATING')
  }

  return (
    <div className="flex-1 h-full max-h-full flex flex-col justify-between w-full px-2 py-0.5 sm:py-1 select-none overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-1 shrink-0">
        <BackButton
          onClick={() => navigate('PHOTO_EDIT')}
          label="BACK"
        />

        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif text-lg sm:text-xl tracking-wider uppercase font-semibold ${
              isLight ? 'text-stone-900' : 'text-[#faf6f0]'
            }`}
          >
            FILM PREVIEW
          </span>
          <span
            className={`px-1.5 py-0.2 rounded-full border text-[9px] font-mono tracking-wider uppercase ${
              isLight
                ? 'bg-stone-100 border-stone-300 text-[#b87d4b]'
                : 'bg-[#241f19] border-[#3e3528] text-[#ffd166]'
            }`}
          >
            {formatConfig.name}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-mono uppercase tracking-widest ${
              isLight
                ? 'bg-stone-100 border-stone-300 text-[#b87d4b]'
                : 'bg-[#1b1713] border-[#332b22] text-[#ffd166]'
            }`}
          >
            <Check className="w-3 h-3" />
            READY
          </span>
        </div>
      </div>

      {/* Main Studio Preview Stage */}
      <div className="my-auto flex flex-col items-center justify-center gap-2 sm:gap-3 py-1 overflow-hidden shrink">
        {/* Left / Center: Photorealistic Physical Strip Presentation */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center justify-center shrink"
        >
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#b87d4b]/15 via-transparent to-[#e8d5be]/10 blur-3xl rounded-full scale-110 pointer-events-none" />

          {/* Cute Playful Doodles around Strip */}
          <div className="absolute -top-5 -left-8 z-30 pointer-events-none">
            <Doodle type="tulip" size={34} color={isLight ? '#d97d54' : '#ff758f'} rotation={-15} />
          </div>
          <div className="absolute top-1/2 -right-10 z-30 pointer-events-none">
            <Doodle type="sparkle" size={28} color={isLight ? '#c97d66' : '#ffd166'} />
          </div>
          <div className="absolute -bottom-8 -left-6 z-30 pointer-events-none">
            <Doodle type="camera" size={32} color={isLight ? '#382f25' : '#ffd166'} rotation={8} />
          </div>

          {/* Top Washi Tape Pinning Preview Strip */}
          <div className="absolute -top-3.5 inset-x-0 flex justify-center z-30 pointer-events-none">
            <WashiTape angle={-1.5} width="w-24 sm:w-28" pattern="stripes" />
          </div>

          {/* Die-Cut Inspection Sticker on Corner */}
          <div className="absolute -bottom-3 -right-3 z-30 pointer-events-none">
            <Sticker text="PRINT READY" variant="oval" color="gold" rotation={-5} />
          </div>

          {/* Physical Film Strip with Luxury Shadow and Frame Styling */}
          <div className="relative z-10 transition-transform duration-500 hover:scale-[1.015]">
            <FilmStrip
              format={state.selectedFormat}
              photos={photos}
              filterId={state.selectedFilter}
              frameId={state.selectedFrame}
              elevation="floating"
              size="xs"
              showBrand={true}
              tiltAngle={shouldReduceMotion ? 0 : -0.75}
              className="shadow-2xl shadow-black/80"
            />
          </div>

          <p
            className={`font-serif text-[11px] sm:text-xs tracking-wider uppercase mt-1.5 font-medium ${
              isLight ? 'text-stone-700' : 'text-[#ffd166]'
            }`}
          >
            YOUR MOMENT IS READY.
          </p>
        </motion.div>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex flex-col items-center max-w-sm w-full px-2 shrink-0"
        >
          {/* Quick Modifier Action Pills */}
          <div className="w-full flex gap-1.5 mb-2">
            <button
              type="button"
              onClick={() => navigate('PHOTO_EDIT')}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-[10px] font-mono tracking-wider uppercase transition-all cursor-pointer text-center ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800'
                  : 'bg-[#1c1814] hover:bg-[#28221b] border-[#3b3125] text-[#ffd166]'
              }`}
            >
              EDIT
            </button>
            <button
              type="button"
              onClick={handleCycleFrame}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-[9px] font-mono tracking-wider uppercase transition-all cursor-pointer text-center truncate ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800'
                  : 'bg-[#1c1814] hover:bg-[#28221b] border-[#3b3125] text-[#ffd166]'
              }`}
              title={`Active Frame: ${activeFrame.label}. Click to cycle.`}
            >
              FRAME: {activeFrame.label.split(' ')[0]}
            </button>
            <button
              type="button"
              onClick={handleCycleFilter}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-[9px] font-mono tracking-wider uppercase transition-all cursor-pointer text-center truncate ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800'
                  : 'bg-[#1c1814] hover:bg-[#28221b] border-[#3b3125] text-[#ffd166]'
              }`}
              title={`Active Filter: ${activeFilter.label}. Click to cycle.`}
            >
              GRADE: {activeFilter.label.split(' ')[0]}
            </button>
          </div>

          {/* Primary Action Button: PRINT */}
          <div className="w-full">
            <PrimaryButton
              variant="terracotta"
              size="sm"
              scalloped={true}
              scallopColor={isLight ? '#382f25' : '#ffd166'}
              onClick={handleProceedToGenerate}
              disabled={isTransitioning}
              icon={<Sparkles className="w-3.5 h-3.5" />}
              className="w-full justify-center tracking-widest font-semibold py-2"
            >
              {isTransitioning ? 'PREPARING...' : 'PRINT PHOTO STRIP'}
            </PrimaryButton>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar Info */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#786e60] tracking-widest pt-4 border-t border-[#1e1a16]">
        <span>MOMENT ARCHIVAL ENGINE</span>
        <span className="hidden sm:inline">PROCESSED LOCALLY • HIGH FIDELITY</span>
        <span>STAGE 05 / 07</span>
      </div>
    </div>
  )
}
