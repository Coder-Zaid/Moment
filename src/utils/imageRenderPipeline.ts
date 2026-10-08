import type { CapturedPhoto, FilterId, FrameId, PhotoCropAdjustments } from '../types/photobooth'
import { FILTER_PRESETS, FRAME_PRESETS } from '../constants/theme'

/**
 * Shared canvas-based rendering pipeline for photo filters, crops, and frame composites.
 * Works strictly in-browser with zero external dependencies.
 */

export interface RenderPipelineOptions {
  width?: number
  height?: number
  filterId?: FilterId
  frameId?: FrameId
  crop?: PhotoCropAdjustments
}

/**
 * Helper to get the CSS filter string for any FilterId.
 */
export function getCssFilterForId(filterId: FilterId | undefined): string {
  if (!filterId || filterId === 'original') return 'none'
  const preset = FILTER_PRESETS.find((f) => f.id === filterId)
  return preset ? preset.cssFilter : 'none'
}

/**
 * Helper to get the frame styling for any FrameId.
 */
export function getFrameClassesForId(frameId: FrameId | undefined) {
  if (!frameId || frameId === 'classic_cream') {
    return {
      bgClass: 'bg-[#f4efe6]',
      borderClass: 'border-[#e0d8ca]',
      innerBorderClass: '',
    }
  }
  const preset = FRAME_PRESETS.find((f) => f.id === frameId)
  return preset || FRAME_PRESETS[0]
}

/**
 * Computes CSS transform style string from PhotoCropAdjustments.
 */
export function getTransformStyle(crop: PhotoCropAdjustments | undefined) {
  if (!crop) return { transform: 'scale(1) translate(0px, 0px)' }
  const scale = crop.scale || 1
  const x = crop.offsetX || 0
  const y = crop.offsetY || 0
  const rotation = crop.rotation || 0
  return {
    transform: `scale(${scale}) translate(${x}%, ${y}%) rotate(${rotation}deg)`,
    transformOrigin: 'center center',
  }
}

/**
 * Renders a photo onto a canvas with zoom, translation, and filter matrix applied.
 * Used for both interactive previews and high-resolution export.
 */
export async function renderPhotoToCanvas(
  photo: CapturedPhoto,
  canvas: HTMLCanvasElement,
  options: RenderPipelineOptions = {}
): Promise<void> {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  const width = options.width || canvas.width || 800
  const height = options.height || canvas.height || 600
  canvas.width = width
  canvas.height = height

  const filterId = options.filterId || photo.filterId || 'original'
  const crop = options.crop || photo.crop || { scale: 1, offsetX: 0, offsetY: 0 }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Apply filter
      ctx.filter = getCssFilterForId(filterId)

      ctx.save()

      // Center origin for zoom and pan
      ctx.translate(width / 2, height / 2)

      const scale = crop.scale || 1
      const offsetX = ((crop.offsetX || 0) / 100) * width
      const offsetY = ((crop.offsetY || 0) / 100) * height
      const rotation = ((crop.rotation || 0) * Math.PI) / 180

      ctx.scale(scale, scale)
      ctx.translate(offsetX, offsetY)
      if (rotation) {
        ctx.rotate(rotation)
      }

      // Draw image object-fit: cover inside target bounds
      const imgAspect = img.width / img.height
      const targetAspect = width / height
      let drawW = width
      let drawH = height

      if (imgAspect > targetAspect) {
        drawH = height
        drawW = height * imgAspect
      } else {
        drawW = width
        drawH = width / imgAspect
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
      ctx.restore()

      resolve()
    }
    img.onerror = () => {
      reject(new Error('Failed to load image for canvas rendering'))
    }
    img.src = photo.url || photo.previewUrl || ''
  })
}
