import type { FilmFormat, FilterPreset, FramePreset } from '../types/photobooth'

export const BRAND = {
  name: 'MOMENT',
  tagline: 'MAKE A MOMENT.',
  subtitle: 'Choose your way to make a strip.',
} as const

export const FILM_FORMATS: Record<'1x2' | '1x4', FilmFormat> = {
  '1x2': {
    id: '1x2',
    name: '1 × 2 Mini Strip',
    photoCount: 2,
    description: 'Two portrait frames. Perfect for duos and quick memories.',
    aspectRatio: '1:2.4',
  },
  '1x4': {
    id: '1x4',
    name: '1 × 4 Classic Strip',
    photoCount: 4,
    description: 'Four vertical frames. The timeless vintage photobooth format.',
    aspectRatio: '1:3.8',
  },
}

export const FILTER_PRESETS: FilterPreset[] = [
  { id: 'original', label: 'Natural', description: 'Original capture without color grading', cssFilter: 'none' },
  { id: 'warm_editorial', label: 'Warm Glow', description: 'Subtle golden hour warmth and gentle contrast', cssFilter: 'sepia(0.2) contrast(1.06) brightness(1.02) saturate(1.1)' },
  { id: 'mono_noir', label: 'Noir', description: 'Timeless high-contrast black & white', cssFilter: 'grayscale(1) contrast(1.22) brightness(0.96)' },
  { id: 'sepia_vintage', label: 'Vintage 1974', description: 'Nostalgic analog film with warm sepia grain', cssFilter: 'sepia(0.65) contrast(1.08) brightness(0.96) hue-rotate(-10deg)' },
  { id: 'vivid_chroma', label: 'Editorial Chroma', description: 'High fashion punch with enhanced vibrancy', cssFilter: 'saturate(1.3) contrast(1.12) brightness(1.02)' },
  { id: 'cool_platinum', label: 'Cool Platinum', description: 'Modern sleek tones with cool silver undertones', cssFilter: 'contrast(1.1) brightness(1.03) saturate(0.85) hue-rotate(185deg)' },
]

export const FRAME_PRESETS: FramePreset[] = [
  {
    id: 'classic_cream',
    label: 'Classic Cream',
    bgClass: 'bg-[#f4efe6]',
    borderClass: 'border-[#e0d8ca]',
  },
  {
    id: 'dark_obsidian',
    label: 'Dark Obsidian',
    bgClass: 'bg-[#181614]',
    borderClass: 'border-[#2d2925]',
  },
  {
    id: 'vintage_grain',
    label: 'Vintage Parchment',
    bgClass: 'bg-[#ede5d8]',
    borderClass: 'border-[#d4c8b6]',
  },
  {
    id: 'minimal_white',
    label: 'Studio White',
    bgClass: 'bg-[#ffffff]',
    borderClass: 'border-[#e8e8e8]',
  },
  {
    id: 'golden_crest',
    label: 'Golden Luxe',
    bgClass: 'bg-[#1a1714]',
    borderClass: 'border-[#b87d4b]',
    innerBorderClass: 'border-[#c98e5a]/60',
  },
  {
    id: 'none',
    label: 'Borderless',
    bgClass: 'bg-transparent',
    borderClass: 'border-transparent',
  },
]


export const MOTION_TRANSITIONS = {
  springTactile: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  },
  springSmooth: {
    type: 'spring',
    stiffness: 260,
    damping: 24,
  },
  easeCinematic: [0.16, 1, 0.3, 1] as const,
  durationFast: 0.2,
  durationMedium: 0.45,
  durationSlow: 0.75,
}

export const KIOSK_TARGET_MIN_PX = 52
