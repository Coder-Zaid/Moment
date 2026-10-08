import React from 'react'
import type { PhotoCropAdjustments } from '../../types/photobooth'
import { ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'

interface CropPositionControlsProps {
  crop: PhotoCropAdjustments | undefined
  onChangeCrop: (newCrop: PhotoCropAdjustments) => void
  onResetCrop: () => void
  disabled?: boolean
}

export const CropPositionControls: React.FC<CropPositionControlsProps> = ({
  crop,
  onChangeCrop,
  onResetCrop,
  disabled = false,
}) => {
  const currentScale = crop?.scale || 1
  const currentX = crop?.offsetX || 0
  const currentY = crop?.offsetY || 0

  const handleZoom = (delta: number) => {
    const nextScale = Math.min(2.5, Math.max(1, +(currentScale + delta).toFixed(2)))
    onChangeCrop({
      scale: nextScale,
      offsetX: currentX,
      offsetY: currentY,
    })
  }

  const handlePan = (dx: number, dy: number) => {
    // Only allow pan if zoomed in, or bounded within -30% to +30%
    const nextX = Math.min(35, Math.max(-35, currentX + dx))
    const nextY = Math.min(35, Math.max(-35, currentY + dy))
    onChangeCrop({
      scale: currentScale,
      offsetX: nextX,
      offsetY: nextY,
    })
  }

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#141210]/90 border border-[#2b251e] text-xs select-none">
      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-[#a09483] uppercase tracking-wider">
          Zoom
        </span>
        <button
          type="button"
          disabled={disabled || currentScale <= 1}
          onClick={() => handleZoom(-0.15)}
          title="Zoom Out"
          className="w-8 h-8 rounded-lg bg-[#201c18] hover:bg-[#2e2720] text-[#e6ded1] flex items-center justify-center border border-[#382f25] transition-colors cursor-pointer touch-press disabled:opacity-40"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="w-12 text-center font-mono font-bold text-[#b87d4b] text-[11px]">
          {currentScale.toFixed(1)}x
        </span>

        <button
          type="button"
          disabled={disabled || currentScale >= 2.5}
          onClick={() => handleZoom(0.15)}
          title="Zoom In"
          className="w-8 h-8 rounded-lg bg-[#201c18] hover:bg-[#2e2720] text-[#e6ded1] flex items-center justify-center border border-[#382f25] transition-colors cursor-pointer touch-press disabled:opacity-40"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Pan / Directional Positioning Controls */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[11px] text-[#a09483] uppercase tracking-wider mr-1">
          Adjust
        </span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handlePan(-5, 0)}
          title="Pan Left"
          className="w-7 h-7 rounded bg-[#201c18] hover:bg-[#2e2720] text-[#d8cebe] flex items-center justify-center border border-[#382f25] cursor-pointer touch-press"
        >
          <ArrowLeft className="w-3 h-3" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handlePan(0, -5)}
          title="Pan Up"
          className="w-7 h-7 rounded bg-[#201c18] hover:bg-[#2e2720] text-[#d8cebe] flex items-center justify-center border border-[#382f25] cursor-pointer touch-press"
        >
          <ArrowUp className="w-3 h-3" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handlePan(0, 5)}
          title="Pan Down"
          className="w-7 h-7 rounded bg-[#201c18] hover:bg-[#2e2720] text-[#d8cebe] flex items-center justify-center border border-[#382f25] cursor-pointer touch-press"
        >
          <ArrowDown className="w-3 h-3" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handlePan(5, 0)}
          title="Pan Right"
          className="w-7 h-7 rounded bg-[#201c18] hover:bg-[#2e2720] text-[#d8cebe] flex items-center justify-center border border-[#382f25] cursor-pointer touch-press"
        >
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Reset Button */}
      <button
        type="button"
        disabled={disabled || (currentScale === 1 && currentX === 0 && currentY === 0)}
        onClick={onResetCrop}
        title="Reset crop and positioning"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#201c18] hover:bg-[#2e2720] text-[#d8cebe] hover:text-[#f4efe6] border border-[#382f25] cursor-pointer touch-press disabled:opacity-40"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase font-mono tracking-wider">Reset</span>
      </button>
    </div>
  )
}
