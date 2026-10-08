import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePhotobooth } from '../context/PhotoboothContext'
import { BackButton } from '../components/ui/BackButton'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { FilmStrip } from '../components/film/FilmStrip'
import { FilterSelector } from '../components/edit/FilterSelector'
import { FrameSelector } from '../components/edit/FrameSelector'
import { CropPositionControls } from '../components/edit/CropPositionControls'
import { SAMPLE_PORTRAITS } from '../constants/samples'
import { FILM_FORMATS, FILTER_PRESETS } from '../constants/theme'
import type { FilterId, FrameId, PhotoCropAdjustments } from '../types/photobooth'
import { ArrowRight, RotateCcw, Check, Sparkles } from 'lucide-react'
import { WashiTape, Sticker } from '../components/decorations'

export const PhotoEditScreen: React.FC = () => {
  const {
    state,
    requiredPhotoCount,
    updatePhotoEdit,
    resetPhotoEdit,
    applyFilterToAll,
    applyFrameToAll,
    selectFilter,
    selectFrame,
    navigate,
  } = usePhotobooth()
  const isLight = state.theme === 'light'

  // Use session photos or fallback to curated sample portraits for standalone verification
  const photos =
    state.photos.length >= requiredPhotoCount
      ? state.photos.slice(0, requiredPhotoCount)
      : state.photos.length > 0
      ? state.photos
      : SAMPLE_PORTRAITS.slice(0, requiredPhotoCount)

  const [activeIndex, setActiveIndex] = useState(0)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const activePhoto = photos[activeIndex] || photos[0]
  const formatConfig = FILM_FORMATS[state.selectedFormat]

  // Active edits for the focused photo
  const currentFilterId = activePhoto?.filterId || state.selectedFilter || 'original'
  const currentFrameId = activePhoto?.frameId || state.selectedFrame || 'classic_cream'
  const currentCrop = activePhoto?.crop

  const notify = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Filter change handlers
  const handleFilterChange = (filterId: FilterId) => {
    if (activePhoto) {
      updatePhotoEdit(activePhoto.id, { filterId })
      selectFilter(filterId)
    }
  }

  const handleApplyFilterToAll = (filterId: FilterId) => {
    applyFilterToAll(filterId)
    notify(`Applied ${filterId.replace('_', ' ')} filter to all frames.`)
  }

  // Frame change handlers
  const handleFrameChange = (frameId: FrameId) => {
    if (activePhoto) {
      updatePhotoEdit(activePhoto.id, { frameId })
      selectFrame(frameId)
    }
  }

  const handleApplyFrameToAll = (frameId: FrameId) => {
    applyFrameToAll(frameId)
    notify(`Applied ${frameId.replace('_', ' ')} frame to all frames.`)
  }

  // Crop / zoom adjustment handler
  const handleCropChange = (crop: PhotoCropAdjustments) => {
    if (activePhoto) {
      updatePhotoEdit(activePhoto.id, { crop })
    }
  }

  const handleResetCrop = () => {
    if (activePhoto) {
      updatePhotoEdit(activePhoto.id, {
        crop: { scale: 1, offsetX: 0, offsetY: 0, rotation: 0 },
      })
      notify(`Reset crop adjustments for Frame 0${activeIndex + 1}.`)
    }
  }

  const handleResetCurrent = () => {
    if (activePhoto) {
      resetPhotoEdit(activePhoto.id)
      notify(`Reset edits for Frame 0${activeIndex + 1}.`)
    }
  }

  const handleBack = () => {
    if (state.mode === 'camera') {
      navigate('CAMERA_CAPTURE')
    } else {
      navigate('PHOTO_UPLOAD')
    }
  }

  const handleContinue = () => {
    navigate('FILM_PREVIEW')
  }

  // Compute CSS filter string
  const activeCssFilter =
    FILTER_PRESETS.find((f) => f.id === currentFilterId)?.cssFilter || 'none'

  const cropTransform = currentCrop
    ? `scale(${currentCrop.scale || 1}) translate(${currentCrop.offsetX || 0}%, ${currentCrop.offsetY || 0}%)`
    : 'scale(1) translate(0%, 0%)'

  return (
    <div className="flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full py-2 sm:py-4 select-none">
      {/* 1. TOP HEADER */}
      <header className="flex items-center justify-between pb-3 border-b border-[#24201b]">
        <div className="flex items-center gap-3">
          <BackButton onClick={handleBack} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl text-[#f4efe6] tracking-wider font-medium">
                PHOTO EDIT
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#241f19] border border-[#3e3528] text-[10px] font-mono tracking-wider text-[#b87d4b] uppercase">
                {formatConfig.name}
              </span>
            </div>
            <p className="text-xs text-[#a09483] tracking-wide mt-0.5">
              Grade filters, select frames, and refine photo positioning
            </p>
          </div>
        </div>

        {/* Reset Actions */}
        <button
          type="button"
          onClick={handleResetCurrent}
          title="Reset current frame edits"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c1815] hover:bg-[#28221b] text-xs text-[#b8ab99] hover:text-white border border-[#332a21] transition-colors cursor-pointer touch-press"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider">Reset Frame</span>
        </button>
      </header>

      {/* Toast Feedback Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="my-2 p-2.5 rounded-xl bg-[#1e1a15] border border-[#b87d4b]/40 text-xs text-[#d8cebe] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#b87d4b] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. WORKSPACE LAYOUT (Left Focal Editor + Right Live Film Strip) */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start py-2">
        {/* Left Section: Active Photo Preview & Controls (col 8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Frame Selection Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono tracking-wider text-[#8c8072] uppercase mr-1">
              Select Frame:
            </span>
            {photos.map((p, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={p.id || idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono tracking-wider uppercase
                    border transition-all cursor-pointer touch-press
                    ${
                      isActive
                        ? 'bg-[#b87d4b] text-[#140e08] border-[#c98e5a] font-bold shadow'
                        : 'bg-[#181512] text-[#c2b6a5] border-[#30271e] hover:bg-[#221c17]'
                    }
                  `}
                >
                  <span>Frame 0{idx + 1}</span>
                  {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              )
            })}
          </div>

          {/* Focal Large Photo Preview with Washi Tape & Editorial Accents */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#161310] border border-[#332b22] shadow-2xl flex items-center justify-center select-none">
            {/* Top Washi Tape Pinning Focal Photo */}
            <div className="absolute -top-3.5 inset-x-0 flex justify-center z-20 pointer-events-none">
              <WashiTape angle={-1} width="w-24 sm:w-28" pattern="translucent" />
            </div>

            {/* Sticker on Preview Corner */}
            <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
              <Sticker text="ANALOG GRADE" variant="tag" color="gold" rotation={-4} />
            </div>

            {activePhoto ? (
              <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                <img
                  src={activePhoto.url || activePhoto.previewUrl}
                  alt={`Active frame ${activeIndex + 1}`}
                  style={{
                    filter: activeCssFilter,
                    transform: cropTransform,
                    transformOrigin: 'center center',
                  }}
                  className="w-full h-full object-cover transition-all duration-200"
                />
              </div>
            ) : (
              <div className="text-xs font-mono text-[#8c8072] uppercase">No photo loaded</div>
            )}

            {/* Frame & Filter Info Pill */}
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-mono text-[#d8cebe] uppercase tracking-wider border border-white/10">
                FRAME 0{activeIndex + 1} OF 0{photos.length}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#b87d4b]/20 text-[#b87d4b] text-[9px] font-mono uppercase tracking-wider border border-[#b87d4b]/30">
                {currentFilterId.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Crop & Positioning Controls Bar */}
          <CropPositionControls
            crop={currentCrop}
            onChangeCrop={handleCropChange}
            onResetCrop={handleResetCrop}
          />

          {/* Curated Filters Carousel */}
          <FilterSelector
            activePhoto={activePhoto}
            selectedFilter={currentFilterId}
            onSelectFilter={handleFilterChange}
            onApplyToAll={handleApplyFilterToAll}
          />

          {/* Curated Frames Carousel */}
          <FrameSelector
            activePhoto={activePhoto}
            selectedFrame={currentFrameId}
            onSelectFrame={handleFrameChange}
            onApplyToAll={handleApplyFrameToAll}
          />
        </div>

        {/* Right Section: Live Physical Film Strip (col 4) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#141210]/60 border border-[#2b251f]">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] font-mono tracking-widest text-[#a89d8d] uppercase">
              Live Film Composition
            </span>
            <span className="text-[10px] font-mono tracking-wider text-[#b87d4b]">
              Tap Frame to Edit
            </span>
          </div>

          {/* The Live Physical Film Strip */}
          <div className="relative py-2 flex items-center justify-center">
            <FilmStrip
              format={state.selectedFormat}
              photos={photos}
              filterId={currentFilterId}
              frameId={currentFrameId}
              elevation="floating"
              size="sm"
              showBrand={true}
              activeSlotIndex={activeIndex}
              onSlotClick={(idx) => setActiveIndex(idx)}
              interactive={true}
              className="ring-1 ring-white/15"
            />
          </div>

          <p className="text-[10px] text-[#786e61] text-center mt-3 tracking-wide">
            Physical cardstock finish with applied color grading & frames
          </p>
        </div>
      </div>

      {/* 3. FOOTER ACTIONS */}
      <footer className="flex items-center justify-between gap-4 pt-4 border-t border-stone-300 dark:border-[#24201b] mt-4">
        <PrimaryButton
          variant={isLight ? 'outline' : 'dark'}
          size="md"
          onClick={handleBack}
          className="w-36 sm:w-44 text-xs tracking-widest"
        >
          BACK
        </PrimaryButton>

        <PrimaryButton
          variant="terracotta"
          size="md"
          scalloped={true}
          scallopColor={isLight ? '#382f25' : '#ffd166'}
          onClick={handleContinue}
          icon={<ArrowRight className="w-4 h-4" />}
          className="w-52 sm:w-60 text-xs sm:text-sm tracking-widest font-semibold"
        >
          CONTINUE TO PREVIEW
        </PrimaryButton>
      </footer>
    </div>
  )
}
