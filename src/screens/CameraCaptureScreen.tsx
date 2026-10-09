import React, { useState, useEffect, useRef } from 'react'
import { usePhotobooth } from '../context/PhotoboothContext'
import { useCamera } from '../hooks/useCamera'
import { CameraViewfinder } from '../components/camera/CameraViewfinder'
import { CameraControls } from '../components/camera/CameraControls'
import { CapturedThumbnailSequence } from '../components/camera/CapturedThumbnailSequence'
import { CameraPermissionCard } from '../components/camera/CameraPermissionCard'
import { BackButton } from '../components/ui/BackButton'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { playCountdownTone, playShutterSound } from '../utils/audioCues'
import { FILM_FORMATS } from '../constants/theme'
import { ArrowRight } from 'lucide-react'
import { Sticker, WashiTape } from '../components/decorations'
import { getRandomPose, POSE_IDEAS, type PoseIdea } from '../constants/poseIdeas'

export const CameraCaptureScreen: React.FC = () => {
  const {
    state,
    requiredPhotoCount,
    addPhotos,
    replacePhoto,
    navigate,
    startMode,
  } = usePhotobooth()
  const isLight = state.theme === 'light'

  const {
    videoRef,
    cameraState,
    errorMessage,
    startCamera,
    stopStream,
    toggleFacingMode,
    captureFrame,
  } = useCamera({ facingMode: 'user', mirrored: true })

  const [countdownNumber, setCountdownNumber] = useState<number | null>(null)
  const [showFlash, setShowFlash] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(state.soundEnabled)

  // Pose suggestion state: text/emoji suggestions over live camera; cycle to different each time
  const [usedPoseIds, setUsedPoseIds] = useState<string[]>([])
  const [currentPose, setCurrentPose] = useState<PoseIdea>(() => getRandomPose([]))
  const [showPoseGuide, setShowPoseGuide] = useState(true)

  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentPhotos = state.photos
  const formatConfig = FILM_FORMATS[state.selectedFormat]

  const isComplete = currentPhotos.length >= requiredPhotoCount && retakeIndex === null
  const activeTargetIndex = retakeIndex !== null ? retakeIndex : currentPhotos.length

  // Pick a fresh, different pose suggestion
  const handleNextPose = () => {
    setCurrentPose((prev) => {
      const nextExcluded = [...usedPoseIds, prev.id]
      const availableCount = POSE_IDEAS.filter((p) => !nextExcluded.includes(p.id)).length
      const candidate = getRandomPose(availableCount > 0 ? nextExcluded : [prev.id])
      setUsedPoseIds((prevUsed) => [...prevUsed, prev.id])
      return candidate
    })
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current)
      }
    }
  }, [])

  // Execute shutter capture after countdown
  const performCapture = async () => {
    setIsCapturing(true)
    setShowFlash(true)

    if (soundEnabled) {
      playShutterSound()
    }

    try {
      const order = retakeIndex !== null ? retakeIndex : currentPhotos.length
      const photo = await captureFrame(order)

      if (retakeIndex !== null && retakeIndex < currentPhotos.length) {
        // Replace existing photo in slot
        replacePhoto(currentPhotos[retakeIndex].id, photo)
        setRetakeIndex(null)
      } else {
        // Add new photo to sequence
        addPhotos([photo])
      }

      // Check if more shots remain: if yes, pick a DIFFERENT pose suggestion!
      const totalNow = currentPhotos.length + (retakeIndex === null ? 1 : 0)
      if (totalNow < requiredPhotoCount) {
        handleNextPose()
        setShowPoseGuide(true)
      } else {
        setShowPoseGuide(false)
      }
    } catch {
      // Capture error handled gracefully
    } finally {
      setTimeout(() => {
        setShowFlash(false)
        setIsCapturing(false)
      }, 350)
    }
  }

  // Trigger 3-2-1 countdown: instantly switches to camera view so guest sees themselves!
  const handleStartCapture = () => {
    if (cameraState !== 'ready' || isCapturing || countdownNumber !== null) return

    // Hide suggestion banner during countdown
    setShowPoseGuide(false)

    let count = 3
    setCountdownNumber(count)
    if (soundEnabled) playCountdownTone(count)

    countdownTimerRef.current = setInterval(() => {
      count -= 1
      if (count > 0) {
        setCountdownNumber(count)
        if (soundEnabled) playCountdownTone(count)
      } else {
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
        setCountdownNumber(null)
        performCapture()
      }
    }, 1000)
  }

  // Cancel in-flight countdown if guest taps back
  const handleCancelCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }
    setCountdownNumber(null)
    setShowPoseGuide(true)
  }

  const handleBack = () => {
    handleCancelCountdown()
    stopStream()
    navigate('FORMAT_SELECTION')
  }

  const handleContinue = () => {
    handleCancelCountdown()
    stopStream()
    navigate('PHOTO_EDIT')
  }

  // Handle retaking a specific slot
  const handleSelectRetake = (index: number) => {
    setRetakeIndex(index)
    handleNextPose()
    setShowPoseGuide(true)
  }

  // Render camera permission or error cards if device fails
  if (
    cameraState === 'permission_denied' ||
    cameraState === 'unavailable' ||
    cameraState === 'error'
  ) {
    return (
      <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full py-4">
        <div className="flex items-center justify-between mb-4">
          <BackButton onClick={handleBack} />
        </div>
        <CameraPermissionCard
          type={cameraState}
          message={
            errorMessage ||
            'Camera could not be accessed. Please check permissions or select upload mode.'
          }
          onRetry={startCamera}
          onChooseUpload={() => startMode('upload')}
          onGoHome={() => navigate('HOME')}
        />
      </div>
    )
  }

  const displayCount = String(Math.min(currentPhotos.length + 1, requiredPhotoCount)).padStart(
    2,
    '0'
  )
  const totalCount = String(requiredPhotoCount).padStart(2, '0')

  return (
    <div className="flex-1 h-full max-h-full flex flex-col justify-between w-full py-0.5 sm:py-1 select-none overflow-hidden">
      {/* 1. TOP HEADER & COUNTER */}
      <header
        className={`flex items-center justify-between px-3 sm:px-6 py-2 z-10 rounded-2xl shadow-sm backdrop-blur-md mb-1 sm:mb-2 border ${
          isLight
            ? 'bg-white/95 border-stone-200 text-stone-900'
            : 'bg-[#181512]/95 border-[#382f23] text-[#faf6f0]'
        }`}
      >
        <BackButton onClick={handleBack} />

        {/* Center Progress Counter */}
        <div className="flex flex-col items-center">
          <div
            className={`font-mono text-base sm:text-xl font-bold tracking-[0.25em] ${
              isLight ? 'text-stone-900' : 'text-[#faf6f0]'
            }`}
          >
            {isComplete ? `${totalCount} / ${totalCount}` : `${displayCount} / ${totalCount}`}
          </div>
          <span
            className={`text-[10px] font-mono uppercase tracking-[0.25em] font-semibold ${
              isLight ? 'text-[#8a5223]' : 'text-[#ffd166]'
            }`}
          >
            {formatConfig.name}
          </span>
        </div>

        {/* Status Pill */}
        <div className="w-20 flex justify-end">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase shadow-sm ${
              isLight
                ? 'bg-stone-100 border-stone-300 text-stone-800'
                : 'bg-[#1b1713] border-[#332a21] text-[#ffd166]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>LIVE</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN IMMERSIVE CAMERA VIEWFINDER WITH POSE GUIDE & PHOTO BOOTH ACCENTS */}
      <div className="relative w-full my-auto flex flex-col items-center">
        {/* Playful Top-Right Sticker on Viewfinder Frame */}
        <div className="absolute -top-3.5 right-6 z-20 pointer-events-none hidden sm:block">
          <Sticker text="SAY CHEESE" variant="badge" color="blush" rotation={6} />
        </div>

        <CameraViewfinder
          videoRef={videoRef}
          isMirrored={true}
          countdownNumber={countdownNumber}
          showFlash={showFlash}
          currentPose={currentPose}
          showPoseGuide={showPoseGuide && !isComplete}
          onNextPose={handleNextPose}
          currentShotIndex={Math.min(activeTargetIndex + 1, requiredPhotoCount)}
          totalShots={requiredPhotoCount}
        />
      </div>

      {/* 3. CAPTURED THUMBNAILS SEQUENCE STRIP */}
      <div className="w-full relative">
        <div className="absolute -top-3 left-4 z-20 pointer-events-none hidden sm:block">
          <WashiTape angle={-2} width="w-16" pattern="translucent" />
        </div>

        <CapturedThumbnailSequence
          totalSlots={requiredPhotoCount}
          photos={currentPhotos}
          activeTargetIndex={activeTargetIndex}
          isRetakeMode={retakeIndex !== null}
          retakeIndex={retakeIndex}
          onSelectRetake={handleSelectRetake}
          disabled={countdownNumber !== null || isCapturing}
          isLight={isLight}
        />
      </div>

      {/* 4. SHUTTER & CAMERA CONTROLS BAR */}
      <div className="w-full flex flex-col items-center">
        <CameraControls
          onCapture={handleStartCapture}
          onFlipCamera={toggleFacingMode}
          isCountingDown={countdownNumber !== null}
          isCapturing={isCapturing}
          isRetakeMode={retakeIndex !== null}
          retakeIndex={retakeIndex}
          onCancelRetake={() => {
            setRetakeIndex(null)
            setShowPoseGuide(false)
          }}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          disabled={cameraState !== 'ready' || (isComplete && retakeIndex === null)}
          isLight={isLight}
          onNextPose={handleNextPose}
          showPoseGuide={showPoseGuide && !isComplete}
        />
      </div>

      {/* 5. BOTTOM NAVIGATION / COMPLETION BAR */}
      <footer
        className={`w-full flex items-center justify-between gap-4 p-2.5 rounded-2xl shadow-md backdrop-blur-md px-4 mt-1 sm:mt-2 border ${
          isLight
            ? 'bg-white/95 border-stone-200'
            : 'bg-[#181512]/95 border-[#382f23]'
        }`}
      >
        <button
          type="button"
          onClick={handleBack}
          className={`text-xs font-mono font-bold uppercase tracking-widest transition-colors py-1.5 px-3.5 rounded-xl border cursor-pointer shadow-sm ${
            isLight
              ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
              : 'bg-[#221d18] hover:bg-[#2e2720] text-[#ffd166] border-[#3e3428]'
          }`}
        >
          Cancel & Exit
        </button>

        {isComplete ? (
          <PrimaryButton
            variant="terracotta"
            size="md"
            scalloped={true}
            scallopColor={isLight ? '#382f25' : '#ffd166'}
            onClick={handleContinue}
            icon={<ArrowRight className="w-4 h-4 text-white" />}
            className="w-48 sm:w-56 tracking-widest font-semibold"
          >
            CONTINUE TO EDIT
          </PrimaryButton>
        ) : (
          <div
            className={`text-xs tracking-wider uppercase font-mono font-bold px-3.5 py-1.5 rounded-full border shadow-sm ${
              isLight
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-[#241f19] border-[#3e3528] text-[#ffd166]'
            }`}
          >
            {requiredPhotoCount - currentPhotos.length} Shots Remaining
          </div>
        )}
      </footer>
    </div>
  )
}
