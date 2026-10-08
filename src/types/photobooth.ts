/**
 * Strongly typed workflow state model for the MOMENT Photo Booth application.
 * Defines screen progression, modes, formats, filters, and device abstractions.
 */

export type ScreenState =
  | 'HOME'
  | 'MODE_SELECTION'
  | 'FORMAT_SELECTION'
  | 'CAMERA_CAPTURE'
  | 'PHOTO_UPLOAD'
  | 'PHOTO_REVIEW'
  | 'PHOTO_EDIT'
  | 'FILM_PREVIEW'
  | 'GENERATING'
  | 'PRINTING'
  | 'COMPLETE'
  | 'ERROR'


export type PhotoboothMode = 'camera' | 'upload' | null

export type FilmFormatId = '1x2' | '1x4'

export interface FilmFormat {
  id: FilmFormatId
  name: string
  photoCount: number
  description: string
  aspectRatio: string
}

export type FilterId =
  | 'original'
  | 'warm_editorial'
  | 'mono_noir'
  | 'sepia_vintage'
  | 'vivid_chroma'
  | 'cool_platinum'

export interface FilterPreset {
  id: FilterId
  label: string
  description?: string
  cssFilter: string
}

export type FrameId =
  | 'classic_cream'
  | 'dark_obsidian'
  | 'vintage_grain'
  | 'minimal_white'
  | 'golden_crest'
  | 'none'

export interface FramePreset {
  id: FrameId
  label: string
  bgClass: string
  borderClass: string
  innerBorderClass?: string
}

export interface PhotoCropAdjustments {
  scale: number
  offsetX: number
  offsetY: number
  rotation?: number
}

export type UploadState = 'idle' | 'selecting' | 'processing' | 'ready' | 'error'


export type CameraState =
  | 'idle'
  | 'requesting_permission'
  | 'ready'
  | 'countdown'
  | 'capturing'
  | 'reviewing'
  | 'complete'
  | 'permission_denied'
  | 'unavailable'
  | 'error'

export interface CapturedPhoto {
  id: string
  url: string
  previewUrl?: string
  timestamp: number
  capturedAt?: number
  source: 'camera' | 'upload' | 'sample'
  file?: File
  name?: string
  mimeType?: string
  width?: number
  height?: number
  size?: number
  order?: number
  filterId?: FilterId
  frameId?: FrameId
  crop?: PhotoCropAdjustments
  brightness?: number
  contrast?: number
  saturation?: number
}

export type GenerationStage =
  | 'PREPARING'
  | 'PROCESSING'
  | 'ASSEMBLING'
  | 'FINISHING'
  | 'READY'

export interface FilmArtifact {
  id: string
  formatId: FilmFormatId
  dataUrl: string
  blobUrl?: string
  width: number
  height: number
  dpi: number
  renderedAt: number
  printMetadata: {
    photoCount: number
    paperStock: string
    filterUsed: string
    frameUsed: string
    dimensionsInch: string
  }
}

export interface PhotoboothError {
  code: string
  message: string
  recoverable: boolean
}

export type PrintSimulationState =
  | 'PRINT_PREPARING'
  | 'PRINTING'
  | 'FILM_EMERGING'
  | 'FILM_COMPLETE'
  | 'PRINT_ERROR'

export interface PrinterStatus {
  state: PrintSimulationState
  progress: number
  message: string
  error?: string
}

export interface PhotoboothState {
  currentScreen: ScreenState
  mode: PhotoboothMode
  selectedFormat: FilmFormatId
  photos: CapturedPhoto[]
  selectedFilter: FilterId
  selectedFrame: FrameId
  isGenerating: boolean
  isPrinting: boolean
  printState: PrintSimulationState | null
  filmArtifact: FilmArtifact | null
  generationStage: GenerationStage | null
  error: PhotoboothError | null
  // Kiosk runtime settings
  isKioskMode: boolean
  soundEnabled: boolean
  theme: PhotoboothTheme
}

export type PhotoboothTheme = 'dark' | 'light'

export type PhotoboothAction =
  | { type: 'NAVIGATE'; payload: ScreenState }
  | { type: 'START_MODE'; payload: { mode: 'camera' | 'upload'; targetScreen?: ScreenState } }
  | { type: 'SET_MODE'; payload: PhotoboothMode }
  | { type: 'SELECT_FORMAT'; payload: FilmFormatId }
  | { type: 'SET_PHOTOS'; payload: CapturedPhoto[] }
  | { type: 'ADD_PHOTOS'; payload: CapturedPhoto[] }
  | { type: 'REMOVE_PHOTO'; payload: string }
  | { type: 'REPLACE_PHOTO'; payload: { id: string; newPhoto: CapturedPhoto } }
  | { type: 'REORDER_PHOTOS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'UPDATE_PHOTO_EDIT'; payload: { id: string; edits: Partial<CapturedPhoto> } }
  | { type: 'RESET_PHOTO_EDIT'; payload: string }
  | { type: 'APPLY_FILTER_TO_ALL'; payload: FilterId }
  | { type: 'APPLY_FRAME_TO_ALL'; payload: FrameId }
  | { type: 'CLEAR_PHOTOS' }
  | { type: 'SELECT_FILTER'; payload: FilterId }
  | { type: 'SELECT_FRAME'; payload: FrameId }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_GENERATION_STAGE'; payload: GenerationStage | null }
  | { type: 'SET_FILM_ARTIFACT'; payload: FilmArtifact | null }
  | { type: 'SET_PRINTING'; payload: boolean }
  | { type: 'SET_PRINT_STATE'; payload: PrintSimulationState | null }
  | { type: 'SET_ERROR'; payload: PhotoboothError | null }
  | { type: 'RESET_SESSION' }
  | { type: 'TOGGLE_KIOSK_MODE' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: PhotoboothTheme }



