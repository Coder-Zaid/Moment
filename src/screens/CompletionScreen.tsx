import React, { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { usePhotobooth } from '../context/PhotoboothContext'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { PrinterArtifactService } from '../utils/printerArtifact'
import { FILM_FORMATS } from '../constants/theme'
import {
  Doodle,
  Sticker,
  WashiTape,
  HandwrittenNote,
  DateStamp,
} from '../components/decorations'
import {
  Download,
  RotateCcw,
  Sparkles,
  QrCode,
  Heart,
} from 'lucide-react'

export const CompletionScreen: React.FC = () => {
  const { state, resetSession, navigate } = usePhotobooth()
  const isLight = state.theme === 'light'
  const shouldReduceMotion = useReducedMotion()

  const [downloaded, setDownloaded] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [autoResetSeconds, setAutoResetSeconds] = useState(60)

  const artifact = state.filmArtifact
  const formatConfig = FILM_FORMATS[state.selectedFormat]

  // Gentle auto-reset countdown for unattended kiosk hardware
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoResetSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          resetSession()
          navigate('HOME')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate, resetSession])

  const handleDownload = () => {
    if (!artifact) return
    PrinterArtifactService.downloadArtifact(artifact)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  const handleStartFresh = () => {
    resetSession()
    navigate('HOME')
  }

  return (
    <div className="flex-1 flex flex-col justify-between max-w-5xl mx-auto w-full px-4 py-3 sm:py-6 select-none relative">
      {/* --- PLAYFUL AMBIENT BACKGROUND DOODLE CLUSTER --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-8 left-8 opacity-75">
          <Doodle type="sparkle" size={30} color="#d49b64" rotation={10} />
        </div>
        <div className="absolute top-16 left-24 opacity-60">
          <Doodle type="star" size={22} color="#e5ceb8" rotation={-12} />
        </div>
        <div className="absolute top-10 right-12 opacity-80">
          <Doodle type="heart" size={28} color="#e07a68" rotation={16} />
        </div>
        <div className="absolute top-24 right-24 opacity-60">
          <Doodle type="sparkle" size={24} color="#d4af37" rotation={-5} />
        </div>
        <div className="absolute bottom-20 left-12 opacity-70">
          <Doodle type="flower" size={26} color="#d49b64" />
        </div>
        <div className="absolute bottom-24 right-16 opacity-75">
          <Doodle type="sunburst" size={32} color="#d49b64" />
        </div>
      </div>

      {/* --- TOP HEADER & BRAND BADGES --- */}
      <header className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-full border flex items-center justify-center ${
              isLight
                ? 'bg-stone-100 border-stone-300 text-[#c97d66]'
                : 'bg-[#1b1713] border-[#3b3227] text-[#ffd166]'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span
              className={`font-serif text-lg sm:text-2xl tracking-wider uppercase font-semibold ${
                isLight ? 'text-stone-900' : 'text-[#faf6f0]'
              }`}
            >
              YOUR MOMENT IS READY.
            </span>
            <div
              className={`flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase ${
                isLight ? 'text-stone-500' : 'text-[#a89d8d]'
              }`}
            >
              <span>{formatConfig.name}</span>
              <span>•</span>
              <span>PRINT JOB COMPLETED</span>
            </div>
          </div>
        </div>

        {/* Date Stamp & Kiosk Auto-Reset Notice */}
        <div className="flex items-center gap-3">
          <DateStamp color="amber" rotation={-1} />
          <span className={`text-[10px] font-mono hidden sm:inline ${isLight ? 'text-stone-500' : 'text-[#8a7e70]'}`}>
            RESET IN {autoResetSeconds}S
          </span>
        </div>
      </header>

      {/* --- MAIN HERO SOUVENIR COMPOSITION --- */}
      <div className="my-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 py-4 z-10">
        {/* Left: The Finished Physical Film Strip with Washi Tape & Die-Cut Stickers */}
        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* Ambient Warm Golden Halo Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#c48d56]/25 via-transparent to-[#faf0e1]/15 blur-3xl rounded-full scale-110 pointer-events-none" />

          {/* Top Washi Tape Pinning Completed Souvenir Strip */}
          <div className="absolute -top-3.5 inset-x-0 flex justify-center z-30 pointer-events-none">
            <WashiTape angle={-2} width="w-24 sm:w-28" pattern="stripes" />
          </div>

          {/* Die-Cut "KEEP THIS" Sticker on Strip Chin */}
          <div className="absolute -bottom-3 -right-3 z-30 pointer-events-none">
            <Sticker
              text="KEEP THIS"
              variant="oval"
              color="gold"
              rotation={-6}
              icon={<Sparkles className="w-3.5 h-3.5 text-black" />}
            />
          </div>

          {/* Die-Cut "100% LOVE" Tag on Strip Corner */}
          <div className="absolute top-12 -left-4 z-30 pointer-events-none">
            <Sticker text="100% MEMORY" variant="badge" color="blush" rotation={-12} />
          </div>

          {/* Animated cute mascot sun character (matching reference board FINAL/COMPLETE) */}
          <motion.div
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-5 -left-7 z-30 drop-shadow-md pointer-events-none"
          >
            <Doodle type="mascot_sun" size={46} color={isLight ? '#d97d54' : '#ffd166'} />
          </motion.div>

          {/* The Physical Strip Canvas Image */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/95 border border-[#3d3429] transition-transform duration-500 hover:scale-[1.015]">
            {artifact ? (
              <img
                src={artifact.blobUrl || artifact.dataUrl}
                alt="Your Developed Photo Strip"
                className="max-h-[52vh] sm:max-h-[60vh] w-auto object-contain rounded-xl select-none"
              />
            ) : (
              <div className="w-56 h-80 rounded-xl bg-[#1a1714] border border-[#332b22] flex items-center justify-center text-xs font-mono text-[#a89b8a]">
                PHOTO STRIP READY
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Pane: Celebration Text & Souvenir Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md w-full"
        >
          {/* Handwritten Annotation */}
          <div className="mb-2">
            <HandwrittenNote
              text="a keeper forever 🤍"
              doodle="heart"
              doodlePosition="right"
              rotation={-4}
              size="md"
              color={isLight ? 'text-[#8a5223]' : 'text-[#ffd166]'}
            />
          </div>

          <h1
            className={`font-serif text-3xl sm:text-4xl md:text-5xl tracking-wide mb-2 ${
              isLight ? 'text-stone-900' : 'text-[#faf6f0]'
            }`}
          >
            Make A Moment Last.
          </h1>

          <p
            className={`text-xs sm:text-sm leading-relaxed mb-6 ${
              isLight ? 'text-stone-600' : 'text-[#c4baa8]'
            }`}
          >
            Your physical film strip has been printed. Save a digital fine art copy
            to keep on your phone or share with your friends.
          </p>

          {/* QR Code Quick Transfer Card */}
          <div
            className={`w-full p-4 rounded-2xl shadow-xl mb-6 flex items-center justify-between gap-4 border ${
              isLight
                ? 'bg-white/80 border-[#dcd0be]'
                : 'bg-[#181512]/90 border-[#332b22]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl p-1.5 flex items-center justify-center shadow ${
                  isLight
                    ? 'bg-stone-100 text-stone-800'
                    : 'bg-[#f7f2e8] text-[#140e08]'
                }`}
              >
                <QrCode className="w-full h-full" />
              </div>
              <div className="text-left">
                <div
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isLight ? 'text-stone-900' : 'text-[#f5ebd9]'
                  }`}
                >
                  Mobile Download
                </div>
                <div
                  className={`text-[10px] font-mono tracking-wide ${
                    isLight ? 'text-stone-500' : 'text-[#a89d8d]'
                  }`}
                >
                  Scan to save directly to phone
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(!showQrModal)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-200 text-[#c97d66] border-stone-300'
                  : 'bg-[#241f19] hover:bg-[#332a22] text-[#ffd166] border-[#3b3125]'
              }`}
            >
              {showQrModal ? 'Close' : 'View QR'}
            </button>
          </div>

          {/* Action Triggers */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <PrimaryButton
              variant="terracotta"
              size="lg"
              scalloped={true}
              scallopColor={isLight ? '#382f25' : '#ffd166'}
              onClick={handleDownload}
              icon={<Download className="w-4 h-4" />}
              className="flex-1 justify-center tracking-widest font-semibold"
            >
              {downloaded ? 'SAVED TO DISK!' : 'SAVE PHOTO'}
            </PrimaryButton>

            <PrimaryButton
              variant={isLight ? 'outline' : 'dark'}
              size="lg"
              onClick={handleStartFresh}
              icon={<RotateCcw className="w-4 h-4" />}
              className="flex-1 justify-center tracking-widest font-semibold"
            >
              START AGAIN
            </PrimaryButton>
          </div>
        </motion.div>
      </div>

      {/* QR Modal Overlay (If Toggled) */}
      {showQrModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-[#181512] border border-[#3b3227] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center flex flex-col items-center shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-3.5 inset-x-0 flex justify-center">
              <WashiTape angle={2} width="w-24" pattern="translucent" />
            </div>

            <h3 className="font-serif text-2xl text-[#f4efe6] uppercase tracking-wider mt-2 mb-1">
              SCAN TO DOWNLOAD
            </h3>
            <p className="text-xs text-[#a39786] mb-5">
              Open your camera app to save your 300 DPI master strip
            </p>

            <div className="w-48 h-48 rounded-2xl bg-[#faf6f0] p-4 flex items-center justify-center shadow-inner mb-4">
              <QrCode className="w-full h-full text-[#141210]" />
            </div>

            <span className="text-[10px] font-mono tracking-widest uppercase text-[#b87d4b] mb-4">
              SESSION NO. {artifact?.id.slice(-6).toUpperCase() || 'MOMENT'}
            </span>

            <PrimaryButton
              variant="dark"
              size="md"
              onClick={() => setShowQrModal(false)}
              className="w-full"
            >
              CLOSE
            </PrimaryButton>
          </div>
        </motion.div>
      )}

      {/* Footer Info */}
      <footer className="flex items-center justify-between text-[11px] font-mono text-[#786e60] tracking-widest pt-3 border-t border-[#1e1a16] z-10">
        <span>MOMENT PHOTO STUDIO</span>
        <span className="hidden sm:inline">THANK YOU FOR MAKING A MOMENT</span>
        <span>FINAL SOUVENIR</span>
      </footer>
    </div>
  )
}
