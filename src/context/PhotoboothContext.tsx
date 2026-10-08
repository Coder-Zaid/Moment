import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from 'react'
import type {
  PhotoboothState,
  PhotoboothAction,
  ScreenState,
  PhotoboothMode,
  FilmFormatId,
  CapturedPhoto,
  FilterId,
  FrameId,
  PhotoboothError,
  PhotoboothTheme,
} from '../types/photobooth'
import { revokePhotoUrl } from '../utils/photoValidation'

const getInitialTheme = (): PhotoboothTheme => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('moment_theme')
    if (saved === 'light' || saved === 'dark') return saved
  }
  return 'dark'
}

const initialState: PhotoboothState = {
  currentScreen: 'HOME',
  mode: null,
  selectedFormat: '1x4',
  photos: [],
  selectedFilter: 'original',
  selectedFrame: 'classic_cream',
  isGenerating: false,
  isPrinting: false,
  printState: null,
  filmArtifact: null,
  generationStage: null,
  error: null,
  isKioskMode: false,
  soundEnabled: true,
  theme: getInitialTheme(),
}

function photoboothReducer(state: PhotoboothState, action: PhotoboothAction): PhotoboothState {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        currentScreen: action.payload,
        error: null,
      }

    case 'START_MODE':
      return {
        ...state,
        mode: action.payload.mode,
        currentScreen: action.payload.targetScreen || 'FORMAT_SELECTION',
        error: null,
      }

    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
      }

    case 'SELECT_FORMAT': {
      const newFormat = action.payload
      const targetCount = newFormat === '1x2' ? 2 : 4
      // Reconcile photos safely: if changing from 1x4 to 1x2, keep up to 2
      let reconciledPhotos = state.photos
      if (state.photos.length > targetCount) {
        // Revoke sliced-out photo URLs
        state.photos.slice(targetCount).forEach((p) => revokePhotoUrl(p))
        reconciledPhotos = state.photos.slice(0, targetCount)
      }
      return {
        ...state,
        selectedFormat: newFormat,
        photos: reconciledPhotos,
      }
    }

    case 'SET_PHOTOS':
      // Revoke previous URLs that are not in the new set
      state.photos.forEach((oldP) => {
        if (!action.payload.some((newP) => newP.id === oldP.id)) {
          revokePhotoUrl(oldP)
        }
      })
      return {
        ...state,
        photos: action.payload,
      }

    case 'ADD_PHOTOS':
      return {
        ...state,
        photos: [...state.photos, ...action.payload],
      }

    case 'REMOVE_PHOTO': {
      const target = state.photos.find((p) => p.id === action.payload)
      if (target) {
        revokePhotoUrl(target)
      }
      return {
        ...state,
        photos: state.photos.filter((p) => p.id !== action.payload),
      }
    }

    case 'REPLACE_PHOTO': {
      const { id, newPhoto } = action.payload
      const updated = state.photos.map((p) => {
        if (p.id === id) {
          revokePhotoUrl(p)
          return newPhoto
        }
        return p
      })
      return {
        ...state,
        photos: updated,
      }
    }

    case 'REORDER_PHOTOS': {
      const { fromIndex, toIndex } = action.payload
      if (
        fromIndex < 0 ||
        fromIndex >= state.photos.length ||
        toIndex < 0 ||
        toIndex >= state.photos.length ||
        fromIndex === toIndex
      ) {
        return state
      }
      const reordered = [...state.photos]
      const [moved] = reordered.splice(fromIndex, 1)
      reordered.splice(toIndex, 0, moved)
      return {
        ...state,
        photos: reordered,
      }
    }

    case 'UPDATE_PHOTO_EDIT': {
      const { id, edits } = action.payload
      const updated = state.photos.map((p) => {
        if (p.id === id) {
          return { ...p, ...edits }
        }
        return p
      })
      return {
        ...state,
        photos: updated,
      }
    }

    case 'RESET_PHOTO_EDIT': {
      const targetId = action.payload
      const updated = state.photos.map((p) => {
        if (p.id === targetId) {
          return {
            ...p,
            filterId: undefined,
            crop: undefined,
            brightness: undefined,
            contrast: undefined,
            saturation: undefined,
          }
        }
        return p
      })
      return {
        ...state,
        photos: updated,
      }
    }

    case 'APPLY_FILTER_TO_ALL': {
      const filterId = action.payload
      const updated = state.photos.map((p) => ({
        ...p,
        filterId,
      }))
      return {
        ...state,
        selectedFilter: filterId,
        photos: updated,
      }
    }

    case 'APPLY_FRAME_TO_ALL': {
      const frameId = action.payload
      const updated = state.photos.map((p) => ({
        ...p,
        frameId,
      }))
      return {
        ...state,
        selectedFrame: frameId,
        photos: updated,
      }
    }

    case 'CLEAR_PHOTOS':
      state.photos.forEach((p) => revokePhotoUrl(p))
      return {
        ...state,
        photos: [],
      }

    case 'SELECT_FILTER':
      return {
        ...state,
        selectedFilter: action.payload,
      }

    case 'SELECT_FRAME':
      return {
        ...state,
        selectedFrame: action.payload,
      }

    case 'SET_GENERATING':
      return {
        ...state,
        isGenerating: action.payload,
      }

    case 'SET_GENERATION_STAGE':
      return {
        ...state,
        generationStage: action.payload,
      }

    case 'SET_FILM_ARTIFACT':
      if (state.filmArtifact?.blobUrl && state.filmArtifact.blobUrl !== action.payload?.blobUrl) {
        URL.revokeObjectURL(state.filmArtifact.blobUrl)
      }
      return {
        ...state,
        filmArtifact: action.payload,
      }

    case 'SET_PRINTING':
      return {
        ...state,
        isPrinting: action.payload,
      }

    case 'SET_PRINT_STATE':
      return {
        ...state,
        printState: action.payload,
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }

    case 'RESET_SESSION':
      state.photos.forEach((p) => revokePhotoUrl(p))
      if (state.filmArtifact?.blobUrl) {
        URL.revokeObjectURL(state.filmArtifact.blobUrl)
      }
      return {
        ...initialState,
        isKioskMode: state.isKioskMode,
        soundEnabled: state.soundEnabled,
        theme: state.theme,
      }

    case 'TOGGLE_KIOSK_MODE':
      return {
        ...state,
        isKioskMode: !state.isKioskMode,
      }

    case 'TOGGLE_THEME': {
      const nextTheme: PhotoboothTheme = state.theme === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('moment_theme', nextTheme)
      } catch {}
      return {
        ...state,
        theme: nextTheme,
      }
    }

    case 'SET_THEME': {
      try {
        localStorage.setItem('moment_theme', action.payload)
      } catch {}
      return {
        ...state,
        theme: action.payload,
      }
    }

    default:
      return state
  }
}

interface PhotoboothContextType {
  state: PhotoboothState
  requiredPhotoCount: number
  navigate: (screen: ScreenState) => void
  startMode: (mode: 'camera' | 'upload') => void
  setMode: (mode: PhotoboothMode) => void
  selectFormat: (formatId: FilmFormatId) => void
  setPhotos: (photos: CapturedPhoto[]) => void
  addPhotos: (photos: CapturedPhoto[]) => void
  removePhoto: (id: string) => void
  replacePhoto: (id: string, newPhoto: CapturedPhoto) => void
  reorderPhotos: (fromIndex: number, toIndex: number) => void
  updatePhotoEdit: (id: string, edits: Partial<CapturedPhoto>) => void
  resetPhotoEdit: (id: string) => void
  applyFilterToAll: (filterId: FilterId) => void
  applyFrameToAll: (frameId: FrameId) => void
  clearPhotos: () => void
  selectFilter: (filterId: FilterId) => void
  selectFrame: (frameId: FrameId) => void
  setGenerating: (generating: boolean) => void
  setGenerationStage: (stage: import('../types/photobooth').GenerationStage | null) => void
  setFilmArtifact: (artifact: import('../types/photobooth').FilmArtifact | null) => void
  setPrinting: (printing: boolean) => void
  setPrintState: (state: import('../types/photobooth').PrintSimulationState | null) => void
  resetSession: () => void
  setError: (error: PhotoboothError | null) => void
  toggleKioskMode: () => void
  toggleTheme: () => void
  setTheme: (theme: PhotoboothTheme) => void
}


const PhotoboothContext = createContext<PhotoboothContextType | undefined>(undefined)

export const PhotoboothProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(photoboothReducer, initialState)
  const isNavigatingRef = useRef(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        dispatch({ type: 'TOGGLE_KIOSK_MODE' })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', state.theme)
      document.body.setAttribute('data-theme', state.theme)
    }
  }, [state.theme])

  // Guard against rapid duplicate taps on kiosk touchscreens
  const navigate = (screen: ScreenState) => {
    if (isNavigatingRef.current) return
    isNavigatingRef.current = true
    dispatch({ type: 'NAVIGATE', payload: screen })
    setTimeout(() => {
      isNavigatingRef.current = false
    }, 280)
  }

  const startMode = (mode: 'camera' | 'upload') => {
    if (isNavigatingRef.current) return
    isNavigatingRef.current = true
    dispatch({ type: 'START_MODE', payload: { mode, targetScreen: 'FORMAT_SELECTION' } })
    setTimeout(() => {
      isNavigatingRef.current = false
    }, 280)
  }

  const setMode = (mode: PhotoboothMode) => {
    dispatch({ type: 'SET_MODE', payload: mode })
  }

  const selectFormat = (formatId: FilmFormatId) => {
    dispatch({ type: 'SELECT_FORMAT', payload: formatId })
  }

  const setPhotos = (photos: CapturedPhoto[]) => {
    dispatch({ type: 'SET_PHOTOS', payload: photos })
  }

  const addPhotos = (photos: CapturedPhoto[]) => {
    dispatch({ type: 'ADD_PHOTOS', payload: photos })
  }

  const removePhoto = (id: string) => {
    dispatch({ type: 'REMOVE_PHOTO', payload: id })
  }

  const replacePhoto = (id: string, newPhoto: CapturedPhoto) => {
    dispatch({ type: 'REPLACE_PHOTO', payload: { id, newPhoto } })
  }

  const reorderPhotos = (fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_PHOTOS', payload: { fromIndex, toIndex } })
  }

  const updatePhotoEdit = (id: string, edits: Partial<CapturedPhoto>) => {
    dispatch({ type: 'UPDATE_PHOTO_EDIT', payload: { id, edits } })
  }

  const resetPhotoEdit = (id: string) => {
    dispatch({ type: 'RESET_PHOTO_EDIT', payload: id })
  }

  const applyFilterToAll = (filterId: FilterId) => {
    dispatch({ type: 'APPLY_FILTER_TO_ALL', payload: filterId })
  }

  const applyFrameToAll = (frameId: FrameId) => {
    dispatch({ type: 'APPLY_FRAME_TO_ALL', payload: frameId })
  }

  const clearPhotos = () => {
    dispatch({ type: 'CLEAR_PHOTOS' })
  }

  const selectFilter = (filterId: FilterId) => {
    dispatch({ type: 'SELECT_FILTER', payload: filterId })
  }

  const selectFrame = (frameId: FrameId) => {
    dispatch({ type: 'SELECT_FRAME', payload: frameId })
  }

  const resetSession = () => {
    try {
      window.dispatchEvent(new CustomEvent('moment:cleanup-camera'))
    } catch {
      // event dispatch handled safely
    }
    dispatch({ type: 'RESET_SESSION' })
  }

  const setError = (error: PhotoboothError | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }

  const toggleKioskMode = () => {
    dispatch({ type: 'TOGGLE_KIOSK_MODE' })
  }

  const setGenerating = (generating: boolean) => {
    dispatch({ type: 'SET_GENERATING', payload: generating })
  }

  const setGenerationStage = (stage: import('../types/photobooth').GenerationStage | null) => {
    dispatch({ type: 'SET_GENERATION_STAGE', payload: stage })
  }

  const setFilmArtifact = (artifact: import('../types/photobooth').FilmArtifact | null) => {
    dispatch({ type: 'SET_FILM_ARTIFACT', payload: artifact })
  }

  const setPrinting = (printing: boolean) => {
    dispatch({ type: 'SET_PRINTING', payload: printing })
  }

  const setPrintState = (printState: import('../types/photobooth').PrintSimulationState | null) => {
    dispatch({ type: 'SET_PRINT_STATE', payload: printState })
  }

  const requiredPhotoCount = state.selectedFormat === '1x2' ? 2 : 4

  return (
    <PhotoboothContext.Provider
      value={{
        state,
        requiredPhotoCount,
        navigate,
        startMode,
        setMode,
        selectFormat,
        setPhotos,
        addPhotos,
        removePhoto,
        replacePhoto,
        reorderPhotos,
        updatePhotoEdit,
        resetPhotoEdit,
        applyFilterToAll,
        applyFrameToAll,
        clearPhotos,
        selectFilter,
        selectFrame,
        setGenerating,
        setGenerationStage,
        setFilmArtifact,
        setPrinting,
        setPrintState,
        resetSession,
        setError,
        toggleKioskMode,
        toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
        setTheme: (theme: PhotoboothTheme) => dispatch({ type: 'SET_THEME', payload: theme }),
      }}
    >
      {children}
    </PhotoboothContext.Provider>
  )
}


export function usePhotobooth() {
  const context = useContext(PhotoboothContext)
  if (!context) {
    throw new Error('usePhotobooth must be used within a PhotoboothProvider')
  }
  return context
}
