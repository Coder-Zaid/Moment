import React, { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { validateImageFile, createPhotoFromFile } from '../../utils/photoValidation'
import type { CapturedPhoto } from '../../types/photobooth'

interface PhotoUploaderProps {
  onPhotosProcessed: (photos: CapturedPhoto[]) => void
  onError: (message: string) => void
  remainingSlots: number
  disabled?: boolean
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onPhotosProcessed,
  onError,
  remainingSlots,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)


  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || disabled) return
    setIsProcessing(true)

    const rawFiles = Array.from(fileList)
    const validPhotos: CapturedPhoto[] = []
    const errors: string[] = []

    for (const file of rawFiles) {
      const validation = await validateImageFile(file)
      if (validation.valid) {
        const photo = await createPhotoFromFile(file, validPhotos.length)
        validPhotos.push(photo)
      } else if (validation.error) {
        errors.push(validation.error)
      }
    }

    setIsProcessing(false)

    if (errors.length > 0) {
      onError(errors[0]) // Report the primary validation error
    }

    if (validPhotos.length > 0) {
      onPhotosProcessed(validPhotos)
    }

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && !isProcessing) inputRef.current?.click()
        }}
        className={`
          relative w-full p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200
          flex items-center justify-between gap-4 cursor-pointer select-none
          touch-press
          ${
            isDragging
              ? 'border-[#b87d4b] bg-[#b87d4b]/20 scale-[1.01]'
              : 'border-[#332e27] bg-[#141210]/90 hover:border-[#b87d4b]/60 hover:bg-[#1a1714]'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#201c18] border border-[#3d352b] flex items-center justify-center text-[#b87d4b] shrink-0">
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-t-[#b87d4b] border-r-transparent border-b-[#b87d4b] border-l-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>

          <div className="text-left">
            <h4 className="font-serif text-lg tracking-wider text-[#f4efe6] uppercase">
              {isProcessing ? 'PROCESSING PHOTOS...' : 'ADD MULTIPLE PHOTOS'}
            </h4>
            <p className="text-xs text-[#a09483] tracking-wide">
              {remainingSlots > 0
                ? `Select up to ${remainingSlots} images from your device or gallery`
                : 'All frames filled • Tap individual frames to replace'}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={disabled || isProcessing}
          className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-[#b87d4b] text-[#140e08] text-xs font-semibold uppercase tracking-widest hover:bg-[#c98e5a] transition-colors pointer-events-none"
        >
          BROWSE FILES
        </button>
      </div>
    </div>
  )
}
