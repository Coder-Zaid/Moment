import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { usePhotobooth } from '../context/PhotoboothContext'
import { ScreenTransition } from '../components/ui/ScreenTransition'
import { HomeScreen } from './HomeScreen'
import { ModeSelectionScreen } from './ModeSelectionScreen'
import { FormatSelectionScreen } from './FormatSelectionScreen'
import { CameraCaptureScreen } from './CameraCaptureScreen'
import { PhotoUploadScreen } from './PhotoUploadScreen'
import { PhotoEditScreen } from './PhotoEditScreen'
import { FilmPreviewScreen } from './FilmPreviewScreen'
import { FilmGenerationScreen } from './FilmGenerationScreen'
import { PrintingScreen } from './PrintingScreen'
import { CompletionScreen } from './CompletionScreen'
import { ErrorState } from '../components/ui/ErrorState'

export const ScreenRenderer: React.FC = () => {
  const { state, navigate, resetSession } = usePhotobooth()

  const renderActiveScreen = () => {
    switch (state.currentScreen) {
      case 'HOME':
        return <HomeScreen />

      case 'MODE_SELECTION':
        return <ModeSelectionScreen />

      case 'FORMAT_SELECTION':
        return <FormatSelectionScreen />

      case 'CAMERA_CAPTURE':
        return <CameraCaptureScreen />

      case 'PHOTO_UPLOAD':
        return <PhotoUploadScreen />



      case 'PHOTO_EDIT':
        return <PhotoEditScreen />

      case 'FILM_PREVIEW':
        return <FilmPreviewScreen />

      case 'GENERATING':
        return <FilmGenerationScreen />

      case 'PRINTING':
        return <PrintingScreen />

      case 'COMPLETE':
        return <CompletionScreen />

      case 'ERROR':
        return (
          <div className="flex-1 flex items-center justify-center">
            <ErrorState
              code={state.error?.code || 'ERR_GENERIC'}
              message={
                state.error?.message ||
                'An unexpected error occurred. Please tap below to restart your session.'
              }
              onRetry={resetSession}
              onDismiss={() => navigate('HOME')}
            />
          </div>
        )

      default:
        return <HomeScreen />
    }
  }

  return (
    <AnimatePresence mode="wait">
      <ScreenTransition screenKey={state.currentScreen}>
        {renderActiveScreen()}
      </ScreenTransition>
    </AnimatePresence>
  )
}
