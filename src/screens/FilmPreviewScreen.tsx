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
    <div className="flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full px-2 sm:px-4 py-2 sm:py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-3 sm:mb-6">
        <BackButton
          onClick={() => navigate('PHOTO_EDIT')}
          label="BACK"
        />

        <div className="flex items-center gap-2">
          <span
            className={`font-serif text-xl sm:text-2xl tracking-wider uppercase font-semibold ${
              isLight ? 'text-stone-900' : 'text-[#faf6f0]'
            }`}
          >
            FILM PREVIEW
          </span>
          <span
            className={`px-2 py-0.5 rounded-full border text-[10px] font-mono tracking-wider uppercase ${
              isLight
                ? 'bg-stone-100 border-stone-300 text-[#b87d4b]'
                : 'bg-[#241f19] border-[#3e3528] text-[#ffd166]'
            }`}
          >
            {formatConfig.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono uppercase tracking-widest ${
              isLight
                ? 'bg-stone-100 border-stone-300 text-[#b87d4b]'
                : 'bg-[#1b1713] border-[#332b22] text-[#ffd166]'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            READY
          </span>
        </div>
      </div>

      {/* Main Studio Preview Stage */}
      <div className="my-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 py-4">
        {/* Left / Center: Photorealistic Physical Strip Presentation */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center justify-center"
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
              size="lg"
              showBrand={true}
              tiltAngle={shouldReduceMotion ? 0 : -0.75}
              className="shadow-2xl shadow-black/80"
            />
          </div>

          <p
            className={`font-serif text-xs sm:text-sm tracking-wider uppercase mt-3 font-medium ${
              isLight ? 'text-stone-700' : 'text-[#ffd166]'
            }`}
          >
            YOUR MOMENT IS READY.
          </p>
        </motion.div>

        {/* Right Pane: Composition Specs & Action Rail */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md w-full"
        >
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono tracking-widest uppercase mb-3 ${
              isLight
                ? 'bg-stone-100 border-stone-300 text-[#b87d4b]'
                : 'bg-[#181512] border-[#2d261e] text-[#ffd166]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            FINAL FILM INSPECTION
          </div>

          <h1
            className={`font-serif text-3xl sm:text-4xl tracking-wide mb-2 ${
              isLight ? 'text-stone-900' : 'text-[#faf6f0]'
            }`}
          >
            Your Heirloom Strip
          </h1>
          <p
            className={`text-sm leading-relaxed mb-6 ${
              isLight ? 'text-stone-600' : 'text-[#c4baa8]'
            }`}
          >
            Review your finished {formatConfig.name.toLowerCase()} before it enters
            the darkroom development sequence and printer emulation.
          </p>

          {/* Composition Metadata Badges */}
          <div className="w-full grid grid-cols-2 gap-2.5 mb-4 text-left">
            <div
              className={`p-3 rounded-xl border ${
                isLight
                  ? 'bg-white/80 border-stone-200'
                  : 'bg-[#181512]/90 border-[#332b22]'
              }`}
            >
              <div
                className={`text-[10px] font-mono uppercase tracking-widest mb-0.5 ${
                  isLight ? 'text-stone-500' : 'text-[#a89d8d]'
                }`}
              >
                PAPER MOUNT
              </div>
              <div
                className={`text-sm font-medium ${
                  isLight ? 'text-stone-900' : 'text-[#f0e8dc]'
                }`}
              >
                {activeFrame.label}
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border ${
                isLight
                  ? 'bg-white/80 border-stone-200'
                  : 'bg-[#181512]/90 border-[#332b22]'
              }`}
            >
              <div
                className={`text-[10px] font-mono uppercase tracking-widest mb-0.5 ${
                  isLight ? 'text-stone-500' : 'text-[#a89d8d]'
                }`}
              >
                COLOR GRADE
              </div>
              <div
                className={`text-sm font-medium ${
                  isLight ? 'text-stone-900' : 'text-[#f0e8dc]'
                }`}
              >
                {activeFilter.label}
              </div>
            </div>
          </div>

          {/* Quick Modifier Action Pills (matching reference board) */}
          <div className="w-full flex flex-wrap gap-2.5 mb-4">
            <button
              type="button"
              onClick={() => navigate('PHOTO_EDIT')}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-mono tracking-wider uppercase transition-all cursor-pointer text-center ${
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
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-mono tracking-wider uppercase transition-all cursor-pointer text-center ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800'
                  : 'bg-[#1c1814] hover:bg-[#28221b] border-[#3b3125] text-[#ffd166]'
              }`}
            >
              CHANGE FRAME
            </button>
            <button
              type="button"
              onClick={handleCycleFilter}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-mono tracking-wider uppercase transition-all cursor-pointer text-center ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800'
                  : 'bg-[#1c1814] hover:bg-[#28221b] border-[#3b3125] text-[#ffd166]'
              }`}
            >
              CHANGE FILTER
            </button>
          </div>

          {/* Primary Action Button: PRINT */}
          <div className="w-full pt-1">
            <PrimaryButton
              variant="terracotta"
              size="lg"
              scalloped={true}
              scallopColor={isLight ? '#382f25' : '#ffd166'}
              onClick={handleProceedToGenerate}
              disabled={isTransitioning}
              icon={<Sparkles className="w-4 h-4" />}
              className="w-full justify-center tracking-widest font-semibold"
            >
              {isTransitioning ? 'PREPARING...' : 'PRINT'}
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
