import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePhotobooth } from '../context/PhotoboothContext'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { BackButton } from '../components/ui/BackButton'
import { VirtualPrinterVisual } from '../components/printer/VirtualPrinterVisual'
import { getPrinterService } from '../services/printerService'
import { PrinterArtifactService } from '../utils/printerArtifact'
import { renderFinalFilmStrip } from '../utils/filmRenderer'
import { SAMPLE_PORTRAITS } from '../constants/samples'
import type { FilmArtifact, PrinterStatus } from '../types/photobooth'
import {
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { DateStamp, Doodle } from '../components/decorations'

export const PrintingScreen: React.FC = () => {
  const {
    state,
    setPrintState,
    setFilmArtifact,
    navigate,
    setError,
  } = usePhotobooth()

  const isLight = state.theme === 'light'
  const shouldReduceMotion = useReducedMotion()

  const [artifact, setLocalArtifact] = useState<FilmArtifact | null>(state.filmArtifact)
  const [printStatus, setLocalStatus] = useState<PrinterStatus>({
    state: state.printState || 'PRINT_PREPARING',
    progress: 0,
    message: 'INITIALIZING PRINT SUBSYSTEM...',
  })
  const [isDownloading, setIsDownloading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isReprinting, setIsReprinting] = useState(false)

  const abortControllerRef = useRef<AbortController | null>(null)

  // Ensure artifact exists, or generate fallback on-the-fly for standalone test reliability
  const ensureArtifact = async (): Promise<FilmArtifact> => {
    if (artifact && (artifact.dataUrl || artifact.blobUrl)) {
      return artifact
    }
    // Generate fallback strip using current session photos or sample portraits
    const samplePhotos =
      state.photos.length > 0
        ? state.photos
        : SAMPLE_PORTRAITS.slice(0, state.selectedFormat === '1x2' ? 2 : 4)

    const generated = await renderFinalFilmStrip({
      formatId: state.selectedFormat,
      photos: samplePhotos,
      selectedFilter: state.selectedFilter,
      selectedFrame: state.selectedFrame,
    })
    setLocalArtifact(generated)
    setFilmArtifact(generated)
    return generated
  }

  const runPrintJob = async (signal?: AbortSignal) => {
    setErrorMessage(null)
    setIsReprinting(false)

    try {
      const activeArtifact = await ensureArtifact()
      if (signal?.aborted) return

      const printer = getPrinterService()
      await printer.preparePrint(activeArtifact)
      if (signal?.aborted) return

      await printer.startPrint(
        activeArtifact,
        (status) => {
          if (signal?.aborted) return
          setLocalStatus(status)
          setPrintState(status.state)
        },
        signal,
        { reducedMotion: shouldReduceMotion ?? false }
      )
    } catch (err: unknown) {
      if (signal?.aborted) {
        return
      }
      console.error('Print simulation error:', err)
      const msg =
        err instanceof Error ? err.message : 'Simulated mechanical paper jam'
      setErrorMessage(msg)
      setPrintState('PRINT_ERROR')
      setError({
        code: 'ERR_PRINT_FAILED',
        message: msg,
        recoverable: true,
      })
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    abortControllerRef.current = controller

    runPrintJob(controller.signal)

    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCollect = () => {
    navigate('COMPLETE')
  }

  const handleDownload = () => {
    if (!artifact) return
    PrinterArtifactService.downloadArtifact(artifact)
    setIsDownloading(true)
    setTimeout(() => setIsDownloading(false), 2800)
  }

  const handleReprint = () => {
    if (printStatus.state !== 'FILM_COMPLETE' || isReprinting) return
    setIsReprinting(true)
    const controller = new AbortController()
    abortControllerRef.current = controller
    runPrintJob(controller.signal)
  }

  const isComplete = printStatus.state === 'FILM_COMPLETE'

  // --- PRINT ERROR SCREEN ---
  if (errorMessage) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center max-w-lg mx-auto w-full px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-800/60 flex items-center justify-center mb-4 text-red-400">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl text-[#f6efe4] mb-2 uppercase tracking-wide">
          Printer Notice
        </h2>
        <p className="text-sm text-[#b5a999] mb-6 leading-relaxed">
          {errorMessage}. Your digital strip is preserved safely.
        </p>

        <div className="flex gap-3 w-full justify-center">
          <PrimaryButton
            variant="dark"
            onClick={() => navigate('FILM_PREVIEW')}
            className="flex-1"
          >
            RETURN TO PREVIEW
          </PrimaryButton>

          <PrimaryButton
            variant="bronze"
            onClick={runPrintJob}
            icon={<RotateCcw className="w-4 h-4" />}
            className="flex-1"
          >
            RETRY PRINT
          </PrimaryButton>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 h-full max-h-full flex flex-col justify-between w-full px-2 py-0.5 sm:py-1 select-none overflow-hidden">
      {/* Screen Reader Live Status */}
      <div role="status" aria-live="polite" className="sr-only">
        {printStatus.message}
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between text-xs font-mono tracking-widest text-[#8a7e70] uppercase mb-2">
        <div className="flex items-center gap-2">
          <BackButton
            onClick={() => navigate('FILM_PREVIEW')}
            label="BACK"
          />
          <span className="text-[#d49b64] flex items-center gap-1.5 ml-2">
            <Printer className="w-4 h-4" />
            VIRTUAL PRINTER SUBSYSTEM
          </span>
        </div>

        <div className="flex items-center gap-3">
          <DateStamp color="amber" rotation={1} />
          <span className="hidden sm:inline">
            {isComplete ? 'DISPENSED' : `${printStatus.progress}%`}
          </span>
        </div>
      </div>

      {/* Main Visual Stage: Virtual Printer Simulation with Playful Mascots */}
      <div className="my-auto flex flex-col items-center justify-center py-2 relative">
        <div className="relative">
          {/* Left Cheering Mascot */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, -10, 0],
                    rotate: [-6, 6, -6],
                  }
            }
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-12 sm:-left-20 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none select-none"
          >
            <div
              className={`p-2 rounded-2xl border-2 shadow-lg ${
                isLight
                  ? 'bg-[#e2f1f8] border-[#382f25]'
                  : 'bg-[#1b2a32] border-[#38bdf8]'
              }`}
            >
              <Doodle
                type="mascot_bean"
                size={42}
                color={isLight ? '#1c1814' : '#38bdf8'}
              />
            </div>
            <span
              className={`text-[9px] font-mono font-bold tracking-wider uppercase mt-1 ${
                isLight ? 'text-[#5a4e3e]' : 'text-[#38bdf8]'
              }`}
            >
              YAY!
            </span>
          </motion.div>

          {/* Center Printer */}
          {artifact && (
            <VirtualPrinterVisual
              artifact={artifact}
              printState={printStatus.state}
              progress={printStatus.progress}
              onCollect={handleCollect}
            />
          )}

          {/* Right Cheering Mascot */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, -12, 0],
                    rotate: [6, -6, 6],
                  }
            }
            transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute -right-12 sm:-right-20 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none select-none"
          >
            <div
              className={`p-2 rounded-2xl border-2 shadow-lg ${
                isLight
                  ? 'bg-[#fce5df] border-[#382f25]'
                  : 'bg-[#351e1b] border-[#f472b6]'
              }`}
            >
              <Doodle
                type="mascot_bean"
                size={42}
                color={isLight ? '#1c1814' : '#f472b6'}
              />
            </div>
            <span
              className={`text-[9px] font-mono font-bold tracking-wider uppercase mt-1 ${
                isLight ? 'text-[#5a4e3e]' : 'text-[#f472b6]'
              }`}
            >
              PRINTING!
            </span>
          </motion.div>
        </div>

        {/* Dynamic Status Text & Progress Storytelling */}
        <div className="text-center mt-3 max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={printStatus.message}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181512] border border-[#2b251e] text-[10px] font-mono tracking-widest text-[#d89f68] uppercase mb-1.5">
                {isComplete ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    PRINT COMPLETE
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-[#d89f68]" />
                    {printStatus.state}
                  </>
                )}
              </div>

              <h2 className="font-serif text-lg sm:text-xl text-[#f6efe4] tracking-wide mb-1">
                {isComplete ? 'Your Moment Has Emerged' : 'Printing Your Moment'}
              </h2>

              <p className="text-xs text-[#a89b8a] leading-relaxed">
                {printStatus.message}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Secondary Progress Bar */}
          {!isComplete && (
            <div className="w-48 sm:w-64 h-1 bg-[#1a1714] rounded-full overflow-hidden mx-auto mt-4 border border-[#26201a]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8a5d35] to-[#e8cfb5] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${printStatus.progress}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
          )}
        </div>

        {/* Action Tray Upon Completion */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-3 mt-5 w-full max-w-md justify-center"
          >
            <PrimaryButton
              variant="dark"
              size="md"
              onClick={handleDownload}
              icon={<Download className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              {isDownloading ? 'SAVED!' : 'DOWNLOAD PNG'}
            </PrimaryButton>

            <PrimaryButton
              variant="dark"
              size="md"
              onClick={handleReprint}
              disabled={isReprinting}
              icon={<RotateCcw className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              REPRINT
            </PrimaryButton>

            <PrimaryButton
              variant="bronze"
              size="lg"
              onClick={handleCollect}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto flex-1 font-semibold tracking-widest"
            >
              COLLECT STRIP
            </PrimaryButton>
          </motion.div>
        )}
      </div>

      {/* Bottom Kiosk Status Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#786e60] tracking-widest pt-3 border-t border-[#1e1a16]">
        <span>SIMULATED MECHANICAL FEED</span>
        <span>ZERO PRINTER HARDWARE REQUIRED</span>
        <span>MOMENT KIOSK V1.0</span>
      </div>
    </div>
  )
}
