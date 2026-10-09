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
  const [editTab, setEditTab] = useState<'editor' | 'strip'>('editor')

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
    <div className="flex-1 h-full max-h-full flex flex-col justify-between w-full py-0.5 sm:py-1 select-none overflow-hidden">
      {/* 1. TOP HEADER */}
      <header className="flex items-center justify-between pb-1.5 border-b border-[#24201b] shrink-0">
        <div className="flex items-center gap-2">
          <BackButton onClick={handleBack} />
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-lg sm:text-xl text-[#f4efe6] tracking-wider font-medium">
              PHOTO EDIT
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#241f19] border border-[#3e3528] text-[9px] font-mono tracking-wider text-[#b87d4b] uppercase">
              {formatConfig.name}
            </span>
          </div>
        </div>

        {/* Reset Actions */}
        <button
          type="button"
          onClick={handleResetCurrent}
          title="Reset current frame edits"
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1c1815] hover:bg-[#28221b] text-[10px] text-[#b8ab99] hover:text-white border border-[#332a21] transition-colors cursor-pointer touch-press"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="uppercase tracking-wider">Reset</span>
        </button>
      </header>

      {/* Responsive View Switcher for Narrow Kiosk Displays */}
      <div className="flex lg:hidden items-center justify-center gap-1.5 py-1 shrink-0">
        <button
          type="button"
          onClick={() => setEditTab('editor')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider border cursor-pointer ${
            editTab === 'editor'
              ? 'bg-[#b87d4b] text-[#140e08] font-bold border-[#c98e5a] shadow'
              : 'bg-[#181512] text-[#c2b6a5] border-[#30271e]'
          }`}
        >
          <span>Frame 0{activeIndex + 1} Editor</span>
        </button>
        <button
          type="button"
          onClick={() => setEditTab('strip')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider border cursor-pointer ${
            editTab === 'strip'
              ? 'bg-[#b87d4b] text-[#140e08] font-bold border-[#c98e5a] shadow'
              : 'bg-[#181512] text-[#c2b6a5] border-[#30271e]'
          }`}
        >
          <span>Strip Preview</span>
        </button>
      </div>

      {/* Toast Feedback Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="my-1 p-2 rounded-xl bg-[#1e1a15] border border-[#b87d4b]/40 text-[11px] text-[#d8cebe] flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b87d4b] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. WORKSPACE LAYOUT (Left Focal Editor + Right Live Film Strip) */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-3 items-start py-1 overflow-hidden shrink">
        {/* Left Section: Active Photo Preview & Controls (col 8) */}
        <div
          className={`lg:col-span-8 flex flex-col gap-2 w-full ${
            editTab === 'editor' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Frame Selection Tabs Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-[10px] font-mono tracking-wider text-[#8c8072] uppercase mr-0.5">
              Frames:
            </span>
            {photos.map((p, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={p.id || idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider uppercase
                    border transition-all cursor-pointer touch-press
                    ${
                      isActive
                        ? 'bg-[#b87d4b] text-[#140e08] border-[#c98e5a] font-bold shadow'
                        : 'bg-[#181512] text-[#c2b6a5] border-[#30271e] hover:bg-[#221c17]'
                    }
                  `}
                >
                  <span>0{idx + 1}</span>
                  {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              )
            })}
          </div>

          {/* Focal Large Photo Preview with Washi Tape & Editorial Accents */}
          <div className="relative w-full aspect-[16/10] max-h-[18vh] sm:max-h-[22vh] rounded-xl overflow-hidden bg-[#161310] border border-[#332b22] shadow-xl flex items-center justify-center select-none shrink">
            {/* Top Washi Tape Pinning Focal Photo */}
            <div className="absolute -top-3 inset-x-0 flex justify-center z-20 pointer-events-none">
              <WashiTape angle={-1} width="w-20" pattern="translucent" />
            </div>

            {/* Sticker on Preview Corner */}
            <div className="absolute bottom-2 right-2 z-20 pointer-events-none">
              <Sticker text="GRADE" variant="tag" color="gold" rotation={-4} />
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
              <div className="text-[10px] font-mono text-[#8c8072] uppercase">No photo loaded</div>
            )}

            {/* Frame & Filter Info Pill */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 pointer-events-none">
              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[9px] font-mono text-[#d8cebe] uppercase tracking-wider border border-white/10">
                0{activeIndex + 1} / 0{photos.length}
              </span>
              <span className="px-2 py-0.2 rounded-full bg-[#b87d4b]/20 text-[#b87d4b] text-[8px] font-mono uppercase tracking-wider border border-[#b87d4b]/30">
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
        <div
          className={`lg:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-[#141210]/60 border border-[#2b251f] w-full ${
            editTab === 'strip' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="w-full flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] font-mono tracking-widest text-[#a89d8d] uppercase">
              Live Film Composition
            </span>
            <span className="text-[9px] font-mono tracking-wider text-[#b87d4b]">
              Tap Frame
            </span>
          </div>

          {/* The Live Physical Film Strip */}
          <div className="relative py-1 flex items-center justify-center">
            <FilmStrip
              format={state.selectedFormat}
              photos={photos}
              filterId={currentFilterId}
              frameId={currentFrameId}
              elevation="floating"
              size="xs"
              showBrand={true}
              activeSlotIndex={activeIndex}
              onSlotClick={(idx) => {
                setActiveIndex(idx)
                setEditTab('editor')
              }}
              interactive={true}
              className="ring-1 ring-white/15"
            />
          </div>

          <p className="text-[9px] text-[#786e61] text-center mt-2 tracking-wide">
            Cardstock finish with color grading & frames
          </p>
        </div>
      </div>

      {/* 3. FOOTER ACTIONS */}
      <footer className="flex items-center justify-between gap-3 pt-2 border-t border-stone-300 dark:border-[#24201b] shrink-0">
        <PrimaryButton
          variant={isLight ? 'outline' : 'dark'}
          size="sm"
          onClick={handleBack}
          className="w-28 sm:w-36 text-[10px] tracking-widest"
        >
          BACK
        </PrimaryButton>

        <PrimaryButton
          variant="terracotta"
          size="sm"
          scalloped={true}
          scallopColor={isLight ? '#382f25' : '#ffd166'}
          onClick={handleContinue}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
          className="w-44 sm:w-52 text-[11px] sm:text-xs tracking-widest font-semibold"
        >
          CONTINUE TO PREVIEW
        </PrimaryButton>
      </footer>
    </div>
  )
}
