import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { usePhotobooth } from '../context/PhotoboothContext'
import { FilmStrip } from '../components/film/FilmStrip'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { Camera, Upload, Sparkles } from 'lucide-react'
import {
  SAMPLE_PORTRAITS,
  SAMPLE_PORTRAITS_LEFT_STRIP,
  SAMPLE_PORTRAITS_RIGHT_STRIP,
} from '../constants/samples'
import { BRAND } from '../constants/theme'
import {
  Doodle,
  Sticker,
  WashiTape,
  HandwrittenNote,
  DateStamp,
  FilmMarkings,
} from '../components/decorations'

export const HomeScreen: React.FC = () => {
  const { state, startMode } = usePhotobooth()
  const isLight = state.theme === 'light'
  const shouldReduceMotion = useReducedMotion()

  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10
    setTilt({ x, y })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  // Doodlish colors adaptive to dark/light
  const doodleGold = isLight ? '#c98e5a' : '#ffd166'
  const doodleCoral = isLight ? '#e07a68' : '#ff758f'
  const doodleAmber = isLight ? '#df9b52' : '#fca311'

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex-1 h-full max-h-full flex flex-col items-center justify-between py-0.5 sm:py-1.5 overflow-hidden select-none"
    >
      {/* --- PLAYFUL AMBIENT BACKGROUND DOODLES & MOTIFS --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-Left Vintage Camera & Star Cluster */}
        <div className="absolute top-2 left-4 sm:left-8 opacity-80">
          <Doodle type="camera" size={28} color={doodleGold} rotation={12} />
        </div>
        <div className="absolute top-12 left-12 sm:left-16 opacity-70">
          <Doodle type="star" size={20} color={doodleGold} rotation={-15} />
        </div>

        {/* Top-Right Heart Cluster & Sparkle */}
        <div className="absolute top-3 right-6 sm:right-12 opacity-80 flex items-center gap-1">
          <Doodle type="heart" size={24} color={doodleCoral} rotation={15} />
          <Doodle type="heart" size={16} color={doodleCoral} rotation={-10} />
        </div>
        <div className="absolute top-12 right-14 sm:right-24 opacity-70">
          <Doodle type="sparkle" size={20} color={doodleGold} rotation={-8} />
        </div>

        {/* Bottom Sparkle & Camera Flourishes */}
        <div className="absolute bottom-12 left-6 sm:left-12 opacity-70">
          <Doodle type="tulip" size={26} color={doodleCoral} rotation={-12} />
        </div>
        <div className="absolute bottom-14 right-6 sm:right-16 opacity-75">
          <Doodle type="camera" size={24} color={doodleGold} rotation={-18} />
        </div>
      </div>

      {/* --- 1. EDITORIAL HEADER & BRAND CREST --- */}
      <motion.header
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center text-center z-10 pt-0.5 sm:pt-1 shrink-0"
      >
        {/* Floating Playful Handwritten Tag */}
        <div className="absolute -top-1 -right-12 sm:-right-20 hidden xs:block">
          <HandwrittenNote
            text="your little memory machine ✨"
            rotation={6}
            size="sm"
            color={isLight ? 'text-[#8a5223]' : 'text-[#ffd166]'}
          />
        </div>

        {/* Luxury Monogram with Washi Accent */}
        <div className="relative mb-1 flex items-center justify-center">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[#b87d4b]/60 shadow-[0_0_16px_rgba(184,125,75,0.35)]" />
            <div className="absolute inset-[2px] rounded-full border border-[#b87d4b]/20" />
            <div className="absolute inset-[4px] rounded-full border border-[#b87d4b]/10" />
            <span
              className={`font-serif text-sm sm:text-base font-normal tracking-normal ${
                isLight ? 'text-[#241e18]' : 'text-[#faf4ea]'
              }`}
            >
              M
            </span>
          </div>
        </div>

        {/* Wordmark with Subtle Sparkle */}
        <div className="relative">
          <h1
            className={`font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.22em] uppercase mb-0.5 drop-shadow-sm ${
              isLight ? 'text-[#1c1814]' : 'text-[#faf6f0]'
            }`}
          >
            {BRAND.name}
          </h1>
          <div className="absolute -top-1 -right-5 text-[#d49b64] opacity-90 hidden sm:block">
            <Doodle type="sparkle" size={16} color={doodleGold} />
          </div>
        </div>

        {/* Tagline & Date Stamp Pair */}
        <div className="flex items-center gap-2 mt-0.5">
          <p
            className={`text-[9px] sm:text-[10px] font-sans font-medium tracking-[0.32em] uppercase ${
              isLight ? 'text-[#7d705f]' : 'text-[#b8ab99]'
            }`}
          >
            {BRAND.tagline}
          </p>
          <span className={isLight ? 'text-[#a39786]' : 'text-[#695d4e]'}>•</span>
          <DateStamp color="amber" rotation={-2} />
        </div>
      </motion.header>

      {/* --- 2. EDITORIAL PHOTO BOOTH SCRAPBOOK WALL COMPOSITION --- */}
      <div className="relative my-auto w-full max-w-sm sm:max-w-md py-1 flex items-center justify-center shrink">
        {/* 35mm Background Grid Lines */}
        <div className="absolute inset-x-2 top-0 hidden md:block opacity-30 pointer-events-none">
          <FilmMarkings frameNumber="ROLL 001" filmStock="MOMENT ARCHIVAL 400" />
        </div>

        {/* Interactive Floating Strips Triad with Real Washi Tape & Die-Cut Stickers */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  rotateY: tilt.x * 0.4,
                  rotateX: tilt.y * 0.4,
                }
          }
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative flex items-center justify-center w-full min-h-[250px] sm:min-h-[285px]"
          style={{ perspective: 1000 }}
        >
          {/* Left Tilted Strip with Washi Tape, Cute Tulip & "SAY CHEESE" Sticker */}
          <motion.div
            initial={{ opacity: 0, x: -35, rotate: -15 }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.94, x: 0, rotate: -8 }
                : {
                    opacity: 0.94,
                    x: 0,
                    y: [0, -5, 0],
                    rotate: [-8, -7.2, -8],
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.5 }
                : {
                    opacity: { duration: 0.6, delay: 0.12 },
                    x: { duration: 0.6, delay: 0.12 },
                    y: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
            className="absolute -left-1 sm:left-1 md:left-6 -translate-y-1 z-10 scale-[0.74] sm:scale-[0.82] origin-bottom"
          >
            {/* Top Washi Tape Pinning Left Strip */}
            <div className="absolute -top-3 left-4 z-30">
              <WashiTape angle={-16} width="w-14 sm:w-16" pattern="stripes" />
            </div>

            {/* Camera doodle attached to left strip */}
            <div className="absolute -top-2.5 -right-2.5 z-30 bg-[#ffd166]/90 rounded-lg p-0.5 border border-[#2b241d] shadow-md">
              <Doodle type="camera" size={18} color="#1c1814" rotation={-8} />
            </div>

            {/* Sticker attached to left strip */}
            <div className="absolute top-20 -left-3 z-30">
              <Sticker text="SAY CHEESE" variant="badge" color="blush" rotation={-14} />
            </div>

            {/* Tulip flower sticker at bottom */}
            <div className="absolute -bottom-2 -left-2 z-30">
              <Doodle type="tulip" size={24} color={doodleCoral} rotation={-15} />
            </div>

            <FilmStrip
              format="1x4"
              photos={SAMPLE_PORTRAITS_LEFT_STRIP}
              filterId="warm_editorial"
              elevation="raised"
              size="xs"
              tiltAngle={-8}
              showBrand={true}
              interactive={true}
            />
          </motion.div>

          {/* Right Tilted Strip with Washi Tape, Floating Hearts & "CUTIE" Sticker */}
          <motion.div
            initial={{ opacity: 0, x: 35, rotate: 15 }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.94, x: 0, rotate: 8 }
                : {
                    opacity: 0.94,
                    x: 0,
                    y: [0, -4, 0],
                    rotate: [8, 7.2, 8],
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.5 }
                : {
                    opacity: { duration: 0.6, delay: 0.16 },
                    x: { duration: 0.6, delay: 0.16 },
                    y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                    rotate: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                  }
            }
            className="absolute -right-1 sm:right-1 md:right-6 -translate-y-1 z-10 scale-[0.74] sm:scale-[0.82] origin-bottom"
          >
            {/* Top Washi Tape Pinning Right Strip */}
            <div className="absolute -top-3 right-4 z-30">
              <WashiTape angle={14} width="w-14 sm:w-16" pattern="kraft" />
            </div>

            {/* Floating hearts near top of right strip */}
            <div className="absolute -top-3 -left-2 z-30 flex items-center gap-0.5">
              <Doodle type="heart" size={18} color={doodleCoral} rotation={18} />
              <Doodle type="heart" size={12} color={doodleAmber} rotation={-8} />
            </div>

            {/* Sticker attached to right strip */}
            <div className="absolute top-22 -right-2 z-30">
              <Sticker text="CUTIE" variant="badge" color="bronze" rotation={12} />
            </div>

            {/* Mini Camera doodle near bottom */}
            <div className="absolute -bottom-1 -right-2 z-30 bg-[#f4a896]/90 rounded-lg p-0.5 border border-[#2b241d] shadow-md">
              <Doodle type="camera" size={18} color="#1c1814" rotation={10} />
            </div>

            <FilmStrip
              format="1x4"
              photos={SAMPLE_PORTRAITS_RIGHT_STRIP}
              filterId="warm_editorial"
              elevation="raised"
              size="xs"
              tiltAngle={8}
              showBrand={true}
              interactive={true}
            />
          </motion.div>

          {/* Center Prominent Film Strip (Hero Object with Gold Sticker, Top Tape & Smiley Coin) */}
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.9 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1, y: 0, scale: 0.94 }
                : {
                    opacity: 1,
                    y: [0, -6, 0],
                    scale: 0.94,
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.7 }
                : {
                    opacity: { duration: 0.7, delay: 0.05 },
                    scale: { duration: 0.7, delay: 0.05 },
                    y: { duration: 4.4, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
            className="relative z-20 sm:scale-100"
          >
            {/* Centered Translucent Washi Tape at Top */}
            <div className="absolute -top-3 inset-x-0 flex justify-center z-30">
              <WashiTape angle={-1} width="w-20 sm:w-24" pattern="translucent" />
            </div>

            {/* Star sparkle above center strip */}
            <div className="absolute -top-6 -left-3 z-30">
              <Doodle type="star" size={20} color={doodleGold} rotation={-12} />
            </div>

            {/* Cute Camera doodle on left hip */}
            <div className="absolute top-28 -left-4 z-30 bg-[#ffd166] rounded-lg p-1 border-2 border-[#2b241d] shadow-md">
              <Doodle type="camera" size={20} color="#1c1814" rotation={-14} />
            </div>

            {/* Die-Cut Gold "KEEP THIS" Sticker on Chin */}
            <div className="absolute -bottom-2.5 -right-2.5 z-30">
              <Sticker
                text="KEEP THIS"
                variant="oval"
                color="gold"
                rotation={-8}
                icon={<Sparkles className="w-2.5 h-2.5 text-black" />}
              />
            </div>

            {/* Smiley Face Coin Sticker on bottom left chin */}
            <div className="absolute -bottom-2.5 -left-2.5 z-30 bg-[#f7b267] rounded-full p-0.5 border-2 border-[#2b241d] shadow-md">
              <Doodle type="smile" size={18} color="#1c1814" />
            </div>

            <FilmStrip
              format="1x4"
              photos={SAMPLE_PORTRAITS}
              filterId="warm_editorial"
              elevation="floating"
              size="xs"
              tiltAngle={0}
              showBrand={true}
              interactive={true}
              className="ring-1 ring-white/20 shadow-2xl shadow-black/90"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* --- 3. DUAL PRIMARY ACTIONS WITH SCALLOPED TACTILE BUTTONS & PLAYFUL CALLOUT --- */}
      <motion.footer
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm flex flex-col items-center gap-1.5 z-10 pb-1 sm:pb-2 shrink-0"
      >
        {/* Prominent Scalloped Action Buttons Side-by-Side */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full px-1">
          {/* Primary Action 1: TAKE PHOTO */}
          <div className="relative">
            <PrimaryButton
              variant="terracotta"
              size="sm"
              scalloped={true}
              scallopColor={isLight ? '#382f25' : '#ffd166'}
              onClick={() => startMode('camera')}
              icon={<Camera className="w-4 h-4 text-white" />}
              fullWidth
              className="tracking-[0.14em] shadow-lg hover:shadow-xl font-bold py-2 sm:py-2.5"
            >
              TAKE PHOTO
            </PrimaryButton>
          </div>

          {/* Primary Action 2: UPLOAD PHOTOS */}
          <div className="relative">
            <PrimaryButton
              variant="terracotta"
              size="sm"
              scalloped={true}
              scallopColor={isLight ? '#382f25' : '#ffd166'}
              onClick={() => startMode('upload')}
              icon={<Upload className="w-4 h-4 text-white" />}
              fullWidth
              className="tracking-[0.14em] shadow-lg hover:shadow-xl font-bold py-2 sm:py-2.5"
            >
              UPLOAD
            </PrimaryButton>
          </div>
        </div>

        {/* Playful Reference Microcopy */}
        <p
          className={`text-[10px] font-medium tracking-wider text-center mt-0.5 ${
            isLight ? 'text-[#6b5e4d]' : 'text-[#d8cebe]'
          }`}
        >
          Choose your way to make a strip.
        </p>
      </motion.footer>
    </div>
  )
}
