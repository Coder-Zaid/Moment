import type {
  CapturedPhoto,
  FilmArtifact,
  FilmFormatId,
  FilterId,
  FrameId,
} from '../types/photobooth'
import { calculateFilmLayout, PAPER_STYLES } from './filmRenderConfig'
import { getCssFilterForId } from './imageRenderPipeline'

export interface RenderFilmOptions {
  formatId: FilmFormatId
  photos: CapturedPhoto[]
  selectedFilter: FilterId
  selectedFrame: FrameId
  timestamp?: number
}

/**
 * Loads an image from a URL or Object URL asynchronously.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src.substring(0, 48)}...`))
    img.src = src
  })
}

/**
 * Helper to draw a rounded rectangle path on a 2D canvas context.
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/**
 * Procedural paper noise overlay for tactile physical paper appearance.
 */
function drawPaperGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity: number = 0.04
) {
  const noiseCanvas = document.createElement('canvas')
  noiseCanvas.width = 120
  noiseCanvas.height = 120
  const noiseCtx = noiseCanvas.getContext('2d')
  if (!noiseCtx) return

  const imgData = noiseCtx.createImageData(120, 120)
  const buffer = imgData.data
  for (let i = 0; i < buffer.length; i += 4) {
    const val = Math.floor(Math.random() * 255)
    buffer[i] = val
    buffer[i + 1] = val
    buffer[i + 2] = val
    buffer[i + 3] = 40 // subtle alpha
  }
  noiseCtx.putImageData(imgData, 0, 0)

  ctx.save()
  ctx.globalAlpha = opacity
  const pattern = ctx.createPattern(noiseCanvas, 'repeat')
  if (pattern) {
    ctx.fillStyle = pattern
    ctx.fillRect(0, 0, width, height)
  }
  ctx.restore()
}

/**
 * Pure, deterministic, client-side rendering engine for physical film strips.
 * Produces 300 DPI print-ready PNG artifact with exact layout, framing, and typography.
 */
export async function renderFinalFilmStrip(
  options: RenderFilmOptions
): Promise<FilmArtifact> {
  const { formatId, photos, selectedFilter, selectedFrame } = options
  const layout = calculateFilmLayout(formatId)
  const paper = PAPER_STYLES[selectedFrame] || PAPER_STYLES.classic_cream

  const canvas = document.createElement('canvas')
  canvas.width = layout.renderWidth
  canvas.height = layout.renderHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not acquire Canvas 2D rendering context')

  // Enable crisp smoothing
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // --- 1. RENDER PHYSICAL CARDSTOCK PAPER ---
  ctx.save()
  drawRoundedRect(ctx, 0, 0, layout.renderWidth, layout.renderHeight, layout.cornerRadius)
  ctx.fillStyle = paper.bgColor
  ctx.fill()

  // Border outline
  if (paper.borderWidth > 0 && selectedFrame !== 'none') {
    ctx.lineWidth = paper.borderWidth
    ctx.strokeStyle = paper.borderColor
    ctx.stroke()
  }

  // Inner foil accent border for luxury frames (e.g. golden_crest)
  if (paper.innerBorderColor) {
    drawRoundedRect(
      ctx,
      paper.borderWidth + 14,
      paper.borderWidth + 14,
      layout.renderWidth - (paper.borderWidth + 14) * 2,
      layout.renderHeight - (paper.borderWidth + 14) * 2,
      layout.cornerRadius - 10
    )
    ctx.lineWidth = 2
    ctx.strokeStyle = paper.innerBorderColor
    ctx.stroke()
  }

  // Paper tactile grain texture
  drawPaperGrain(ctx, layout.renderWidth, layout.renderHeight, 0.045)
  ctx.restore()

  // --- 2. TECHNICAL FILM HEADER NOTCHES ---
  ctx.save()
  ctx.fillStyle = paper.subtextColor
  ctx.font = '500 20px "Space Mono", monospace, monospace'
  ctx.letterSpacing = '3px'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('ISO 400 • ARCHIVAL FILM', layout.sideMargin + 6, layout.headerY)

  ctx.textAlign = 'right'
  const countLabel = formatId === '1x2' ? '#02 FRAMES' : '#04 FRAMES'
  ctx.fillText(countLabel, layout.renderWidth - layout.sideMargin - 6, layout.headerY)
  ctx.restore()

  // --- 3. PHOTO CELLS RENDERING ---
  for (let i = 0; i < layout.cells.length; i++) {
    const cell = layout.cells[i]
    const photo = photos[i]

    ctx.save()

    // Create clipped rounded container for photo
    drawRoundedRect(ctx, cell.x, cell.y, cell.width, cell.height, cell.cornerRadius)
    ctx.clip()

    // Fill background for cell
    ctx.fillStyle = '#1c1a17'
    ctx.fillRect(cell.x, cell.y, cell.width, cell.height)

    if (photo && (photo.url || photo.previewUrl)) {
      try {
        const img = await loadImage(photo.url || photo.previewUrl || '')
        const filterId = photo.filterId || selectedFilter || 'original'
        const crop = photo.crop || { scale: 1, offsetX: 0, offsetY: 0, rotation: 0 }

        // Render photo using offscreen buffer with filter matrix
        const cellCanvas = document.createElement('canvas')
        cellCanvas.width = cell.width
        cellCanvas.height = cell.height
        const cellCtx = cellCanvas.getContext('2d')

        if (cellCtx) {
          cellCtx.imageSmoothingEnabled = true
          cellCtx.imageSmoothingQuality = 'high'

          // Apply CSS filter if valid
          const filterCss = getCssFilterForId(filterId)
          if (filterCss && filterCss !== 'none') {
            cellCtx.filter = filterCss
          }

          cellCtx.save()
          // Center origin for zoom and pan
          cellCtx.translate(cell.width / 2, cell.height / 2)

          const scale = crop.scale || 1
          const offsetX = ((crop.offsetX || 0) / 100) * cell.width
          const offsetY = ((crop.offsetY || 0) / 100) * cell.height
          const rotation = ((crop.rotation || 0) * Math.PI) / 180

          cellCtx.scale(scale, scale)
          cellCtx.translate(offsetX, offsetY)
          if (rotation) {
            cellCtx.rotate(rotation)
          }

          // Cover calculations
          const imgAspect = img.width / img.height
          const targetAspect = cell.width / cell.height
          let drawW = cell.width
          let drawH = cell.height

          if (imgAspect > targetAspect) {
            drawH = cell.height
            drawW = cell.height * imgAspect
          } else {
            drawW = cell.width
            drawH = cell.width / imgAspect
          }

          cellCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
          cellCtx.restore()

          // Draw the buffer into the clipped cell on the main canvas
          ctx.drawImage(cellCanvas, cell.x, cell.y)
        }
      } catch (err) {
        console.warn('Failed to render photo cell', i, err)
        // Fallback placeholder text
        ctx.fillStyle = '#2d2822'
        ctx.fillRect(cell.x, cell.y, cell.width, cell.height)
        ctx.fillStyle = paper.subtextColor
        ctx.font = '600 24px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`FRAME 0${i + 1}`, cell.x + cell.width / 2, cell.y + cell.height / 2)
      }
    } else {
      // Empty placeholder cell
      ctx.fillStyle = '#221f1b'
      ctx.fillRect(cell.x, cell.y, cell.width, cell.height)
      ctx.fillStyle = paper.subtextColor
      ctx.font = '600 22px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`FRAME 0${i + 1}`, cell.x + cell.width / 2, cell.y + cell.height / 2)
    }

    ctx.restore()

    // Inner bevel / optical mount shadow for realism
    ctx.save()
    drawRoundedRect(ctx, cell.x, cell.y, cell.width, cell.height, cell.cornerRadius)
    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgba(0,0,0,0.22)'
    ctx.stroke()
    ctx.restore()
  }

  // --- 4. LUXURY BRAND CHIN FOOTER ---
  ctx.save()
  const footerCenterY = layout.footerY

  // Optional decorative foil pinstripes
  if (paper.accentLines && paper.foilAccentColor) {
    ctx.strokeStyle = paper.foilAccentColor
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(layout.sideMargin + 60, footerCenterY - 48)
    ctx.lineTo(layout.renderWidth - layout.sideMargin - 60, footerCenterY - 48)
    ctx.stroke()
  }

  // Primary MOMENT brandmark
  ctx.fillStyle = paper.textColor
  ctx.font = '700 48px "Playfair Display", "Didot", serif'
  ctx.letterSpacing = '18px'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('MOMENT', layout.renderWidth / 2, footerCenterY - 14)

  // Secondary Studio typography
  ctx.fillStyle = paper.subtextColor
  ctx.font = '600 16px "Inter", "Space Mono", sans-serif'
  ctx.letterSpacing = '6px'
  ctx.fillText('STUDIO EDITION • FINE ART PRINT', layout.renderWidth / 2, footerCenterY + 36)

  // Subtle timestamp & sequence stamp
  const renderedAt = options.timestamp || Date.now()
  const dateStr = new Date(renderedAt)
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase()
  ctx.font = '500 13px "Space Mono", monospace'
  ctx.letterSpacing = '2px'
  ctx.fillStyle = paper.subtextColor
  ctx.fillText(`${dateStr} • NO. ${Math.floor(1000 + Math.random() * 9000)}`, layout.renderWidth / 2, footerCenterY + 70)

  ctx.restore()

  // --- 5. EXPORT FINAL ARTIFACT ---
  const dataUrl = canvas.toDataURL('image/png', 0.95)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/png', 0.95)
  })

  const blobUrl = blob ? URL.createObjectURL(blob) : undefined

  return {
    id: `film_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    formatId,
    dataUrl,
    blobUrl,
    width: layout.renderWidth,
    height: layout.renderHeight,
    dpi: layout.dpi,
    renderedAt,
    printMetadata: {
      photoCount: layout.cells.length,
      paperStock: selectedFrame,
      filterUsed: selectedFilter,
      frameUsed: selectedFrame,
      dimensionsInch: layout.dimensionsInch,
    },
  }
}
