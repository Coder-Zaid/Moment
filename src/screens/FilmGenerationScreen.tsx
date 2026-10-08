import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePhotobooth } from '../context/PhotoboothContext'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { renderFinalFilmStrip } from '../utils/filmRenderer'
import { PrinterArtifactService } from '../utils/printerArtifact'
import { SAMPLE_PORTRAITS } from '../constants/samples'
import type { GenerationStage, FilmArtifact } from '../types/photobooth'
import {
  Sparkles,
  Printer,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react'

interface StageStep {
  stage: GenerationStage
  title: string
  subtitle: string
  progress: number
}

const STAGES: StageStep[] = [
  {
    stage: 'PREPARING',
    title: 'CALIBRATING ARCHIVAL PAPER',
    subtitle: 'Cutting 300 DPI cardstock boundaries and applying tactile matte grain...',
    progress: 20,
  },
  {
    stage: 'PROCESSING',
    title: 'DEVELOPING ANALOGUE EMULSION',
    subtitle: 'Balancing silver halides, color grading, and exposure curves...',
    progress: 45,
  },
  {
    stage: 'ASSEMBLING',
    title: 'MOUNTING PHOTOGRAPHIC CELLS',
    subtitle: 'Precision cell alignment, frame margins, and optical beveling...',
    progress: 70,
  },
  {
    stage: 'FINISHING',
    title: 'EMBOSSING STUDIO STAMP',
    subtitle: 'Hot foil typography, archival timestamp, and seal verification...',
    progress: 90,
  },
  {
    stage: 'READY',
    title: 'STRIP FULLY DEVELOPED',
    subtitle: 'Your heirloom photostrip is ready for physical printer simulation.',
    progress: 100,
  },
]

export const FilmGenerationScreen: React.FC = () => {
  const {
    state,
    requiredPhotoCount,
    setFilmArtifact,
    setGenerationStage,
    navigate,
    setError,
  } = usePhotobooth()

  const shouldReduceMotion = useReducedMotion()

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [artifact, setLocalArtifact] = useState<FilmArtifact | null>(state.filmArtifact)
  const [renderError, setRenderError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const hasStartedRef = useRef(false)
  const currentStep = STAGES[currentStepIndex]

  // Use session photos or fallback portraits
  const photos =
    state.photos.length >= requiredPhotoCount
      ? state.photos.slice(0, requiredPhotoCount)
      : state.photos.length > 0
      ? state.photos
      : SAMPLE_PORTRAITS.slice(0, requiredPhotoCount)

  const runGenerationPipeline = async () => {
    setRenderError(null)
    setCurrentStepIndex(0)
    setGenerationStage('PREPARING')

    const stepDelay = shouldReduceMotion ? 250 : 650

    try {
      // Step 1: PREPARING
      await new Promise((r) => setTimeout(r, stepDelay))
      setCurrentStepIndex(1)
      setGenerationStage('PROCESSING')

      // Step 2: PROCESSING (Start background render in parallel)
      const renderPromise = renderFinalFilmStrip({
        formatId: state.selectedFormat,
        photos,
        selectedFilter: state.selectedFilter,
        selectedFrame: state.selectedFrame,
      })

      await new Promise((r) => setTimeout(r, stepDelay))
      setCurrentStepIndex(2)
      setGenerationStage('ASSEMBLING')

      // Step 3: ASSEMBLING
      await new Promise((r) => setTimeout(r, stepDelay))
      setCurrentStepIndex(3)
      setGenerationStage('FINISHING')

      // Wait for rendering to complete
      const generatedArtifact = await renderPromise

      // Step 4: FINISHING
      await new Promise((r) => setTimeout(r, stepDelay))
      setLocalArtifact(generatedArtifact)
      setFilmArtifact(generatedArtifact)
      setCurrentStepIndex(4)
      setGenerationStage('READY')
    } catch (err: unknown) {
      console.error('Render error during film generation:', err)
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Unable to render the final film strip locally.'
      setRenderError(errorMessage)
      setError({
        code: 'ERR_RENDER_FAILED',
        message: errorMessage,
        recoverable: true,
      })
    }
  }

  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      runGenerationPipeline()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRetry = () => {
    setIsRetrying(true)
    setTimeout(() => {
      setIsRetrying(false)
      runGenerationPipeline()
    }, 150)
  }

  const handleDownload = () => {
    if (!artifact) return
    PrinterArtifactService.downloadArtifact(artifact)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  const handleProceedToPrinting = () => {
    navigate('PRINTING')
  }

  // --- RENDER ERROR STATE ---
  if (renderError) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center max-w-lg mx-auto w-full px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-800/60 flex items-center justify-center mb-4 text-red-400">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl text-[#f6efe4] mb-2 uppercase tracking-wide">
          Rendering Interrupted
        </h2>
        <p className="text-sm text-[#b5a999] mb-6 leading-relaxed">
          {renderError} Your photos, filters, and crops are safely preserved.
        </p>

        <div className="flex gap-3 w-full justify-center">
          <PrimaryButton
            variant="dark"
            onClick={() => navigate('PHOTO_EDIT')}
            className="flex-1"
          >
            BACK TO EDITING
          </PrimaryButton>

          <PrimaryButton
            variant="bronze"
            onClick={handleRetry}
            disabled={isRetrying}
            icon={<RotateCcw className="w-4 h-4" />}
            className="flex-1"
          >
            {isRetrying ? 'RETRYING...' : 'RETRY GENERATION'}
          </PrimaryButton>
        </div>
      </div>
    )
  }

  const isReady = currentStep.stage === 'READY' && artifact !== null

  return (
    <div className="flex-1 flex flex-col justify-between max-w-5xl mx-auto w-full px-4 py-4 sm:py-6">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs font-mono tracking-widest text-[#8a7e70] uppercase">
        <span className="flex items-center gap-2 text-[#d49b64]">
          <Sparkles className="w-4 h-4 animate-spin text-[#d49b64]" style={{ animationDuration: '6s' }} />
          MOMENT DARKROOM ENGINE
        </span>
        <span>
          {isReady ? 'DEVELOPMENT COMPLETE' : `STEP 0${currentStepIndex + 1} OF 05`}
        </span>
      </div>

      {/* Main Cinematic Visual Stage */}
      <div className="my-auto flex flex-col items-center justify-center text-center py-6">
        {/* Animated Central Artifact Stage */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Ambient Lighting Flash on Ready */}
          <motion.div
            animate={
              isReady
                ? {
                    opacity: [0.1, 0.45, 0.2],
                    scale: [0.95, 1.15, 1.05],
                  }
                : { opacity: 0.15, scale: 1 }
            }
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute -inset-10 bg-gradient-to-tr from-[#c48d56]/20 via-[#e0cfba]/10 to-transparent blur-3xl rounded-full pointer-events-none"
          />

          {/* Film Preview Container */}
          <div className="relative z-10">
            {artifact ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/90 border border-[#3b3329]"
              >
                {/* Generated High-Resolution Physical Canvas Image */}
                <img
                  src={artifact.blobUrl || artifact.dataUrl}
                  alt="Final Developed Film Strip"
                  className="max-h-[50vh] sm:max-h-[56vh] w-auto object-contain rounded-xl select-none"
                />

                {/* Subtle Sheen Sweep Animation on Completion */}
                <motion.div
                  initial={{ x: '-150%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1.4, delay: 0.3, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                />
              </motion.div>
            ) : (
              // Progressive Assembly Simulation Graphic
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(184, 125, 75, 0.1)',
                    '0 0 45px rgba(184, 125, 75, 0.25)',
                    '0 0 20px rgba(184, 125, 75, 0.1)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-56 sm:w-64 h-80 sm:h-96 rounded-xl bg-[#141210] border border-[#332b22] p-4 flex flex-col justify-between items-center relative overflow-hidden"
              >
                {/* Paper Notches */}
                <div className="w-full flex justify-between items-center opacity-40 text-[9px] font-mono text-[#a89c8a]">
                  <span>ISO 400</span>
                  <span>MOMENT #04</span>
                </div>

                {/* Simulated Photo Slots Progressively Developing */}
                <div className="w-full flex flex-col gap-2.5 my-auto">
                  {Array.from({ length: state.selectedFormat === '1x2' ? 2 : 4 }).map(
                    (_, idx) => {
                      const isSlotLit = currentStepIndex >= 2 || (currentStepIndex === 1 && idx === 0)
                      return (
                        <motion.div
                          key={idx}
                          animate={
                            isSlotLit
                              ? { opacity: 1, backgroundColor: '#26221c' }
                              : { opacity: 0.35, backgroundColor: '#181614' }
                          }
                          className="w-full h-12 sm:h-14 rounded-md border border-[#362e24] flex items-center justify-center relative overflow-hidden"
                        >
                          {isSlotLit && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0.2, 0.6, 0.3] }}
                              transition={{ duration: 1.2, repeat: Infinity }}
                              className="text-[10px] font-mono uppercase text-[#b87d4b] tracking-widest"
                            >
                              FRAME 0{idx + 1} • MOUNTED
                            </motion.div>
                          )}
                        </motion.div>
                      )
                    }
                  )}
                </div>

                {/* Footer Brand Seal Stamp Simulation */}
                <div className="text-center pt-2">
                  <span className="font-serif text-sm tracking-[0.25em] text-[#e8dfd1] font-semibold">
                    MOMENT
                  </span>
                </div>

                {/* Scanning Light Sweep */}
                <motion.div
                  animate={{ y: ['-100%', '300%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#b87d4b]/20 to-transparent pointer-events-none"
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Dynamic Stage Text Storytelling */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-md"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b1713] border border-[#2b241d] text-[11px] font-mono tracking-widest text-[#d89f68] uppercase mb-2">
              {isReady ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ARCHIVAL MASTER COMPLETE
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#d89f68]" />
                  {currentStep.stage}
                </>
              )}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#f6efe4] tracking-wide mb-2">
              {currentStep.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#b0a494] leading-relaxed">
              {currentStep.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Tactile Progress Indicator Bar */}
        {!isReady && (
          <div className="w-64 sm:w-80 h-1.5 bg-[#1f1b16] rounded-full overflow-hidden mt-6 border border-[#2d2720]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#8a5d35] via-[#c99563] to-[#e8cfb5] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${currentStep.progress}%` }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          </div>
        )}

        {/* Ready Actions */}
        {isReady && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full max-w-md justify-center"
          >
            <PrimaryButton
              variant="dark"
              size="md"
              onClick={handleDownload}
              icon={<Download className="w-4 h-4" />}
              className="w-full sm:w-auto flex-1"
            >
              {downloaded ? 'SAVED TO DISK!' : 'SAVE PNG'}
            </PrimaryButton>

            <PrimaryButton
              variant="dark"
              size="md"
              onClick={() => navigate('FILM_PREVIEW')}
              icon={<Eye className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              PREVIEW
            </PrimaryButton>

            <PrimaryButton
              variant="bronze"
              size="md"
              onClick={handleProceedToPrinting}
              icon={<Printer className="w-4 h-4" />}
              className="w-full sm:w-auto flex-1 font-semibold tracking-widest"
            >
              PRINT STRIP
            </PrimaryButton>
          </motion.div>
        )}
      </div>

      {/* Bottom Kiosk Status Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#786e60] tracking-widest pt-4 border-t border-[#1e1a16]">
        <span>LOCAL 300 DPI ARTIFACT</span>
        <span>ZERO EXTERNAL TRANSMISSION</span>
        <span>MOMENT STUDIO V1.0</span>
      </div>
    </div>
  )
}
