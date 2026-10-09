import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { usePhotobooth } from '../context/PhotoboothContext'
import { BackButton } from '../components/ui/BackButton'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { FilmStrip } from '../components/film/FilmStrip'
import { PhotoSlot } from '../components/upload/PhotoSlot'
import { PhotoUploader } from '../components/upload/PhotoUploader'
import { validateImageFile, createPhotoFromFile } from '../utils/photoValidation'
import type { CapturedPhoto } from '../types/photobooth'
import { FILM_FORMATS } from '../constants/theme'
import { Sparkles, ArrowRight, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react'
import { WashiTape, Sticker, HandwrittenNote } from '../components/decorations'

export const PhotoUploadScreen: React.FC = () => {
  const {
    state,
    requiredPhotoCount,
    addPhotos,
    removePhoto,
    replacePhoto,
    reorderPhotos,
    clearPhotos,
    navigate,
  } = usePhotobooth()
  const isLight = state.theme === 'light'

  const [validationError, setValidationError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'strip'>('upload')

  const formatConfig = FILM_FORMATS[state.selectedFormat]
  const currentPhotos = state.photos
  const isComplete = currentPhotos.length >= requiredPhotoCount
  const remainingCount = Math.max(0, requiredPhotoCount - currentPhotos.length)

  // Trigger brief user feedback notification
  const notify = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Handle photos processed from bulk uploader
  const handleBulkPhotos = (newPhotos: CapturedPhoto[]) => {
    setValidationError(null)
    const availableSlots = requiredPhotoCount - currentPhotos.length
    if (availableSlots <= 0) {
      notify('All frames already filled. Tap individual frames to replace.')
      return
    }

    if (newPhotos.length > availableSlots) {
      const accepted = newPhotos.slice(0, availableSlots)
      addPhotos(accepted)
      notify(`Accepted ${accepted.length} photos to complete your ${formatConfig.name}.`)
    } else {
      addPhotos(newPhotos)
      notify(`Added ${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''}.`)
    }
  }

  // Handle single slot direct file upload
  const handleSlotAdd = async (file: File, index: number) => {
    setValidationError(null)
    const result = await validateImageFile(file)
    if (!result.valid) {
      setValidationError(result.error || 'Invalid file')
      return
    }

    const photo = await createPhotoFromFile(file, index)
    if (index < currentPhotos.length) {
      replacePhoto(currentPhotos[index].id, photo)
    } else {
      addPhotos([photo])
    }
    notify(`Frame 0${index + 1} updated.`)
  }

  // Handle slot replacement
  const handleSlotReplace = async (file: File, index: number) => {
    setValidationError(null)
    const result = await validateImageFile(file)
    if (!result.valid) {
      setValidationError(result.error || 'Invalid file')
      return
    }

    const existingId = currentPhotos[index]?.id
    if (existingId) {
      const newPhoto = await createPhotoFromFile(file, index)
      replacePhoto(existingId, newPhoto)
      notify(`Replaced photo in Frame 0${index + 1}.`)
    }
  }

  const handleContinue = () => {
    if (isComplete) {
      navigate('PHOTO_EDIT')
    }
  }

  return (
    <div className="flex-1 h-full max-h-full flex flex-col justify-between w-full py-0.5 sm:py-1 select-none overflow-hidden">
      {/* 1. TOP HEADER & KIOSK STATUS */}
      <header className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#24201b] shrink-0">
        <div className="flex items-center gap-2">
          <BackButton onClick={() => navigate('FORMAT_SELECTION')} />
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-lg sm:text-xl text-[#f4efe6] tracking-wider font-medium">
              UPLOAD PHOTOS
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#241f19] border border-[#3e3528] text-[9px] font-mono tracking-wider text-[#b87d4b] uppercase">
              {formatConfig.name}
            </span>
          </div>
        </div>

        {/* Clear All action (only when photos exist) */}
        {currentPhotos.length > 0 && (
          <button
            type="button"
            onClick={clearPhotos}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1c1815] hover:bg-[#2a221b] text-[10px] text-[#a89d8d] hover:text-[#f4efe6] border border-[#332a20] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3 text-[#8c3527]" />
            <span className="uppercase tracking-wider">Reset</span>
          </button>
        )}
      </header>

      {/* Responsive View Switcher for Narrow Kiosk Displays */}
      <div className="flex lg:hidden items-center justify-center gap-1.5 py-1 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider border cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-[#b87d4b] text-[#140e08] font-bold border-[#c98e5a] shadow'
              : 'bg-[#181512] text-[#c2b6a5] border-[#30271e]'
          }`}
        >
          <span>Frames ({currentPhotos.length}/{requiredPhotoCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('strip')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider border cursor-pointer ${
            activeTab === 'strip'
              ? 'bg-[#b87d4b] text-[#140e08] font-bold border-[#c98e5a] shadow'
              : 'bg-[#181512] text-[#c2b6a5] border-[#30271e]'
          }`}
        >
          <span>Live Strip</span>
        </button>
      </div>

      {/* 2. PROGRESS BANNER */}
      <div className="my-3 p-3.5 rounded-xl bg-[#161411] border border-[#2c261e] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          {isComplete ? (
            <CheckCircle2 className="w-5 h-5 text-[#b87d4b] shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-[#b87d4b] border-t-transparent animate-spin shrink-0" />
          )}

          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-[#f4efe6]">
              {isComplete
                ? 'ALL FRAMES COMPLETED • READY TO CONTINUE'
                : `FRAME PROGRESS: ${currentPhotos.length} / ${requiredPhotoCount} PHOTOS ADDED`}
            </div>
            <div className="text-[11px] text-[#9c9080]">
              {isComplete
                ? 'Photos can be reordered or replaced before proceeding to filter grading'
                : `Please select ${remainingCount} more portrait${remainingCount > 1 ? 's' : ''} to complete your ${state.selectedFormat} film strip`}
            </div>
          </div>
        </div>

        {/* Progress bar visual */}
        <div className="w-full sm:w-44 h-2 rounded-full bg-[#24201b] overflow-hidden self-center">
          <div
            className="h-full bg-gradient-to-r from-[#b87d4b] to-[#d69c6b] transition-all duration-300"
            style={{ width: `${(currentPhotos.length / requiredPhotoCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Validation / Notification Banner */}
      {validationError && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-3 rounded-xl bg-[#8c3527]/20 border border-[#b84a3b]/50 flex items-center justify-between text-xs text-[#f4cfc8]"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#e87060] shrink-0" />
            <span>{validationError}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100 cursor-pointer ml-2"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-2.5 rounded-xl bg-[#1e1a15] border border-[#b87d4b]/40 text-xs text-[#d8cebe] flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#b87d4b] shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* 3. WORKSPACE: INTERACTIVE SLOTS & LIVE PHYSICAL FILM STRIP */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-3 items-start py-1 overflow-hidden shrink">
        {/* Left Section: Photo Uploader & Interactive Sequence Slots (col 8) */}
        <div
          className={`lg:col-span-8 flex flex-col gap-2.5 w-full ${
            activeTab === 'upload' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Quick Bulk Intake Dropzone with Washi Accent */}
          <div className="relative">
            <div className="absolute -top-3.5 right-6 z-20 pointer-events-none">
              <WashiTape angle={4} width="w-16" pattern="translucent" />
            </div>
            <PhotoUploader
              onPhotosProcessed={handleBulkPhotos}
              onError={(err) => setValidationError(err)}
              remainingSlots={remainingCount}
              disabled={isComplete}
            />
          </div>

          {/* Sequential Photo Slots Grid */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1 px-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono tracking-widest text-[#a89d8d] uppercase">
                  CONTACT SHEET CELLS
                </span>
                <Sticker text="TAKE 01" variant="tag" color="cream" rotation={-2} />
              </div>
              <HandwrittenNote
                text="tap or drag ✨"
                size="sm"
                color="text-[#d4ba9f]"
              />
            </div>

            <div
              className={`grid gap-2 sm:gap-3 ${
                requiredPhotoCount === 2 ? 'grid-cols-2' : 'grid-cols-2'
              }`}
            >
              {Array.from({ length: requiredPhotoCount }).map((_, index) => {
                const photo = currentPhotos[index] || null
                return (
                  <PhotoSlot
                    key={photo?.id || `slot-${index}`}
                    slotIndex={index}
                    totalSlots={requiredPhotoCount}
                    photo={photo}
                    onAdd={(file) => handleSlotAdd(file, index)}
                    onReplace={(file) => handleSlotReplace(file, index)}
                    onRemove={() => photo && removePhoto(photo.id)}
                    onMoveUp={
                      index > 0 && photo
                        ? () => reorderPhotos(index, index - 1)
                        : undefined
                    }
                    onMoveDown={
                      index < currentPhotos.length - 1 && photo
                        ? () => reorderPhotos(index, index + 1)
                        : undefined
                    }
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Section: Live Physical Film Strip Preview (col 4) */}
        <div
          className={`lg:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-[#141210]/60 border border-[#2b251f] relative w-full ${
            activeTab === 'strip' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Washi Tape Pinning Preview Panel */}
          <div className="absolute -top-3 inset-x-0 flex justify-center z-20 pointer-events-none">
            <WashiTape angle={-1} width="w-20" pattern="stripes" />
          </div>

          <div className="w-full flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] font-mono tracking-widest text-[#a89d8d] uppercase">
              Live Strip Preview
            </span>
            <span className="text-[9px] font-mono tracking-wider text-[#b87d4b]">
              {formatConfig.aspectRatio}
            </span>
          </div>

          {/* Physical Film Strip rendering actual local uploaded photos */}
          <div className="relative py-1 flex items-center justify-center">
            <FilmStrip
              format={state.selectedFormat}
              photos={currentPhotos}
              filterId="original"
              elevation="floating"
              size="xs"
              showBrand={true}
              className="ring-1 ring-white/10"
            />
          </div>

          <p className="text-[9px] text-[#786e61] text-center mt-2 tracking-wide">
            Your photos will print in this exact vertical sequence
          </p>
        </div>
      </div>

      {/* 4. FOOTER CONTROLS */}
      <footer className="flex items-center justify-between gap-3 pt-2 border-t border-stone-300 dark:border-[#24201b] shrink-0">
        <PrimaryButton
          variant={isLight ? 'outline' : 'dark'}
          size="sm"
          onClick={() => navigate('FORMAT_SELECTION')}
          className="w-28 sm:w-36 text-[10px] tracking-widest"
        >
          BACK
        </PrimaryButton>

        <PrimaryButton
          variant={isComplete ? 'terracotta' : isLight ? 'outline' : 'dark'}
          size="sm"
          scalloped={isComplete}
          scallopColor={isLight ? '#382f25' : '#ffd166'}
          disabled={!isComplete}
          onClick={handleContinue}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
          className="w-40 sm:w-48 text-[11px] sm:text-xs tracking-widest font-semibold"
        >
          {isComplete ? 'CONTINUE TO EDIT' : `NEED ${remainingCount} MORE`}
        </PrimaryButton>
      </footer>
    </div>
  )
}
