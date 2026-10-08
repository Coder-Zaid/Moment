import type { FilmFormatId, FrameId } from '../types/photobooth'

export interface PhotoCellLayout {
  index: number
  x: number
  y: number
  width: number
  height: number
  cornerRadius: number
}

export interface FilmLayoutDimensions {
  formatId: FilmFormatId
  renderWidth: number
  renderHeight: number
  dpi: number
  cornerRadius: number
  sideMargin: number
  topMargin: number
  bottomMargin: number
  photoGap: number
  cells: PhotoCellLayout[]
  headerY: number
  footerY: number
  brandHeight: number
  dimensionsInch: string
}

export interface PaperStyleConfig {
  bgColor: string
  borderColor: string
  borderWidth: number
  innerBorderColor?: string
  textColor: string
  subtextColor: string
  foilAccentColor?: string
  accentLines: boolean
}

export const PAPER_STYLES: Record<FrameId, PaperStyleConfig> = {
  classic_cream: {
    bgColor: '#F6F2E9',
    borderColor: '#E2D9C8',
    borderWidth: 6,
    textColor: '#1E1B18',
    subtextColor: '#7A7062',
    accentLines: false,
  },
  dark_obsidian: {
    bgColor: '#100E0D',
    borderColor: '#26221D',
    borderWidth: 6,
    textColor: '#F5EFE6',
    subtextColor: '#B5A895',
    foilAccentColor: '#C4975A',
    accentLines: true,
  },
  vintage_grain: {
    bgColor: '#EFE8DC',
    borderColor: '#D8CBBA',
    borderWidth: 6,
    textColor: '#2E2820',
    subtextColor: '#8C7D6B',
    accentLines: false,
  },
  minimal_white: {
    bgColor: '#FFFFFF',
    borderColor: '#ECECEC',
    borderWidth: 4,
    textColor: '#111111',
    subtextColor: '#666666',
    accentLines: false,
  },
  golden_crest: {
    bgColor: '#141210',
    borderColor: '#B87D4B',
    borderWidth: 8,
    innerBorderColor: 'rgba(201, 142, 90, 0.45)',
    textColor: '#F8F3EA',
    subtextColor: '#C99E6E',
    foilAccentColor: '#D4AF37',
    accentLines: true,
  },
  none: {
    bgColor: '#FBF9F5',
    borderColor: '#EFECE6',
    borderWidth: 2,
    textColor: '#1E1B18',
    subtextColor: '#7A7062',
    accentLines: false,
  },
}

/**
 * Calculates deterministic high-resolution physical layout for 1x2 and 1x4 strips.
 * Generates exact pixel boundaries at 300 DPI target print resolution.
 */
export function calculateFilmLayout(formatId: FilmFormatId): FilmLayoutDimensions {
  const is1x2 = formatId === '1x2'
  const photoCount = is1x2 ? 2 : 4

  // Output Canvas dimensions at print grade (300 DPI equivalent)
  const renderWidth = 1200
  const renderHeight = is1x2 ? 2880 : 4560
  const dpi = 300
  const cornerRadius = 32
  const photoCornerRadius = 16

  const sideMargin = 96
  const topMargin = is1x2 ? 110 : 124
  const bottomMargin = is1x2 ? 220 : 250
  const photoGap = is1x2 ? 72 : 64

  const photoWidth = renderWidth - sideMargin * 2
  const availablePhotoHeight =
    renderHeight - topMargin - bottomMargin - photoGap * (photoCount - 1)
  const photoHeight = Math.floor(availablePhotoHeight / photoCount)

  const cells: PhotoCellLayout[] = []
  for (let i = 0; i < photoCount; i++) {
    const y = topMargin + i * (photoHeight + photoGap)
    cells.push({
      index: i,
      x: sideMargin,
      y,
      width: photoWidth,
      height: photoHeight,
      cornerRadius: photoCornerRadius,
    })
  }

  return {
    formatId,
    renderWidth,
    renderHeight,
    dpi,
    cornerRadius,
    sideMargin,
    topMargin,
    bottomMargin,
    photoGap,
    cells,
    headerY: Math.round(topMargin * 0.55),
    footerY: renderHeight - Math.round(bottomMargin * 0.58),
    brandHeight: bottomMargin,
    dimensionsInch: is1x2 ? '2" × 4.8"' : '2" × 7.6"',
  }
}
