import React, { useRef, useState } from 'react'
import type { CapturedPhoto } from '../../types/photobooth'
import { Plus, RefreshCw, Trash2, ArrowUp, ArrowDown } from 'lucide-react'


interface PhotoSlotProps {
  slotIndex: number
  totalSlots: number
  photo: CapturedPhoto | null
  onAdd: (file: File) => void
  onReplace: (file: File) => void
  onRemove: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  disabled?: boolean
}

export const PhotoSlot: React.FC<PhotoSlotProps> = ({
  slotIndex,
  totalSlots,
  photo,
  onAdd,
  onReplace,
  onRemove,
  onMoveUp,
  onMoveDown,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const slotNumber = String(slotIndex + 1).padStart(2, '0')



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isReplacing: boolean) => {
    const file = e.target.files?.[0]
    if (file) {
      if (isReplacing) {
        onReplace(file)
      } else {
        onAdd(file)
      }
    }
    // Reset input so re-selecting same file triggers change
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (photo) {
        onReplace(file)
      } else {
        onAdd(file)
      }
    }
  }

  return (
    <div className="relative flex flex-col w-full">
      {/* Hidden file inputs for direct slot upload & replacement */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFileChange(e, false)}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFileChange(e, true)}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`
          relative w-full aspect-[4/3] rounded-xl overflow-hidden
          border-2 transition-all duration-200 select-none
          ${
            isDragOver
              ? 'border-[#b87d4b] bg-[#b87d4b]/15 scale-[1.01]'
              : photo
              ? 'border-[#383229] bg-[#1a1714] shadow-lg'
              : 'border-dashed border-[#3d372e] bg-[#141210]/80 hover:border-[#b87d4b]/60 hover:bg-[#1a1714]'
          }
        `}
      >
        {photo ? (
          /* FILLED STATE */
          <div className="relative w-full h-full group">
            <img
              src={photo.url || photo.previewUrl}
              alt={photo.name || `Photo slot ${slotNumber}`}
              className="w-full h-full object-cover"
            />

            {/* Subtle gloss / dark vignette on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-70 group-hover:opacity-90 transition-opacity" />

            {/* Top Info Bar */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-mono text-[#d8cebe] uppercase tracking-wider border border-white/10">
                FRAME {slotNumber}
              </span>

              {photo.size && (
                <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono text-[#a89d8d]">
                  {(photo.size / (1024 * 1024)).toFixed(1)} MB
                </span>
              )}
            </div>

            {/* Interactive Control Overlay Bar (Large touch targets) */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1 z-10">
              {/* Reordering arrows */}
              <div className="flex items-center gap-1">
                {onMoveUp && (
                  <button
                    type="button"
                    onClick={onMoveUp}
                    title="Move photo up"
                    aria-label={`Move photo ${slotNumber} up`}
                    className="w-8 h-8 rounded-lg bg-black/70 hover:bg-[#b87d4b] text-[#e8ded0] hover:text-[#121110] flex items-center justify-center transition-colors cursor-pointer touch-press"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                )}
                {onMoveDown && (
                  <button
                    type="button"
                    onClick={onMoveDown}
                    title="Move photo down"
                    aria-label={`Move photo ${slotNumber} down`}
                    className="w-8 h-8 rounded-lg bg-black/70 hover:bg-[#b87d4b] text-[#e8ded0] hover:text-[#121110] flex items-center justify-center transition-colors cursor-pointer touch-press"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Replace and Delete actions */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => replaceInputRef.current?.click()}
                  title="Replace photo"
                  aria-label={`Replace photo in frame ${slotNumber}`}
                  className="px-2.5 py-1.5 h-8 rounded-lg bg-black/70 hover:bg-[#b87d4b] text-[#e8ded0] hover:text-[#121110] flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer touch-press"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Replace</span>
                </button>

                <button
                  type="button"
                  onClick={onRemove}
                  title="Remove photo"
                  aria-label={`Remove photo from frame ${slotNumber}`}
                  className="w-8 h-8 rounded-lg bg-[#8c3527]/80 hover:bg-[#a64030] text-[#f4efe6] flex items-center justify-center transition-colors cursor-pointer touch-press"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* EMPTY STATE (INVITES INTERACTION) */
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            aria-label={`Add photo to frame ${slotNumber}`}
            className="w-full h-full flex flex-col items-center justify-center p-4 cursor-pointer text-center group touch-press"
          >
            <div className="w-12 h-12 rounded-full bg-[#1f1b17] border border-[#383025] group-hover:border-[#b87d4b] group-hover:bg-[#b87d4b]/15 flex items-center justify-center transition-all duration-200 mb-2">
              <Plus className="w-5 h-5 text-[#b8ab9a] group-hover:text-[#f4efe6] transition-colors" />
            </div>

            <span className="font-serif text-base tracking-wider text-[#e6dfd1] uppercase group-hover:text-white transition-colors">
              FRAME {slotNumber} OF {String(totalSlots).padStart(2, '0')}
            </span>

            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8c8072] mt-0.5 group-hover:text-[#b87d4b] transition-colors">
              Tap or drop photo here
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
