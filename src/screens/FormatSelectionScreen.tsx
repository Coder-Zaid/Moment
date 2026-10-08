import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { usePhotobooth } from '../context/PhotoboothContext'
import { FilmStrip } from '../components/film/FilmStrip'
import { BackButton } from '../components/ui/BackButton'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SAMPLE_PORTRAITS } from '../constants/samples'
import { Camera, Upload, ArrowRight, Sparkles, Check } from 'lucide-react'
import {
  Doodle,
  Sticker,
  WashiTape,
  ScallopBorder,
} from '../components/decorations'

export const FormatSelectionScreen: React.FC = () => {
  const { state, selectFormat, setMode, navigate } = usePhotobooth()
  const isLight = state.theme === 'light'
  const shouldReduceMotion = useReducedMotion()

  const handleContinue = () => {
    if (state.mode === 'camera') {
      navigate('CAMERA_CAPTURE')
    } else {
      navigate('PHOTO_UPLOAD')
    }
  }

  const isCamera = state.mode === 'camera'

  return (
    <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full py-1 sm:py-2 select-none h-full">
      {/* 1. TOP HEADER & NAVIGATION */}
      <header className="flex items-center justify-between gap-3 pb-2 border-b border-[#24201b]/80 z-20">
        <BackButton onClick={() => navigate('MODE_SELECTION')} />

        {/* Center / Right: Mode Switcher & Step Indicator */}
        <div className="flex items-center gap-2">
          {/* Step Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1815] border border-[#332a21] text-xs text-[#a89d8d]">
            <span className="font-mono text-[10px] text-[#b87d4b] uppercase tracking-wider">STEP 02</span>
            <span className="text-[#594d3f]">•</span>
            <span className="uppercase tracking-wider text-[10px]">CHOOSE STRIP</span>
          </div>

          {/* Mode Pill Toggle */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#161411] border border-[#2e271f] text-xs">
            <button
              type="button"
              onClick={() => setMode('camera')}
              aria-label="Switch to Take Photo mode"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer touch-press ${
                isCamera
                  ? 'bg-[#b87d4b] text-[#140e08] font-bold shadow'
                  : 'text-[#8c8072] hover:text-[#f4efe6] hover:bg-[#201c18]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider text-[11px]">Take Photo</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('upload')}
              aria-label="Switch to Upload mode"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer touch-press ${
                !isCamera
                  ? 'bg-[#b87d4b] text-[#140e08] font-bold shadow'
                  : 'text-[#8c8072] hover:text-[#f4efe6] hover:bg-[#201c18]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider text-[11px]">Upload</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. EDITORIAL HEADING WITH SUBTLE SPARKLE */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center relative my-1 sm:my-2 z-10"
      >
        <div className="inline-block relative">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.22em] text-[#faf6f0] uppercase">
            CHOOSE YOUR STRIP
          </h1>
          <div className="absolute -top-2 -right-6 text-[#d49b64] opacity-80 hidden sm:block">
            <Doodle type="sparkle" size={20} color="#d49b64" rotation={10} />
          </div>
        </div>
        <p className="text-[11px] sm:text-xs font-sans tracking-[0.25em] uppercase text-[#9e9282] mt-0.5">
          Select your physical print layout
        </p>
      </motion.div>

      {/* 3. PHYSICAL FILM STRIP COMPARISON STAGE */}
      <div className="my-auto flex items-end justify-center gap-6 sm:gap-12 md:gap-16 py-1 px-2 z-10">
        {/* OPTION 1: 1 x 2 Strip */}
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          onClick={() => selectFormat('1x2')}
          className="flex flex-col items-center cursor-pointer group relative"
        >
          {/* Top Washi Tape Pinning Strip */}
          <div className="absolute -top-2.5 inset-x-0 flex justify-center z-30 pointer-events-none">
            <WashiTape angle={-5} width="w-14 sm:w-16" pattern="translucent" />
          </div>

          {/* Cute Bow Doodle on top right */}
          <div className="absolute -top-3.5 -right-2 z-30 pointer-events-none">
            <Doodle type="bow" size={24} color={isLight ? '#c97d66' : '#ffd166'} rotation={14} />
          </div>

          {/* Mini Strip Badge */}
          <div className="absolute top-8 -left-3 z-30 pointer-events-none">
            <Sticker text="DUO" variant="badge" color="blush" rotation={-10} />
          </div>

          {/* Cute Pencil Doodle on bottom right */}
          <div className="absolute -bottom-2 -right-3 z-30 pointer-events-none">
            <Doodle type="pencil" size={22} color={isLight ? '#d99c6b' : '#ffd166'} rotation={-20} />
          </div>

          {/* Active selection card wrapper */}
          <div
            className={`p-2 sm:p-2.5 rounded-2xl transition-all duration-300 relative ${
              state.selectedFormat === '1x2'
                ? 'bg-[#181512]/90 ring-2 ring-[#b87d4b] ring-offset-2 ring-offset-[#0b0a09] shadow-2xl shadow-[#b87d4b]/20 scale-[1.02]'
                : 'bg-[#141210]/60 border border-[#2b251f] opacity-80 hover:opacity-100 hover:border-[#42392e]'
            }`}
          >
            {state.selectedFormat === '1x2' && (
              <>
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#b87d4b] text-[#140e08] flex items-center justify-center shadow-lg z-30">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <ScallopBorder color={isLight ? '#c97d66' : '#ffd166'} />
              </>
            )}

            <FilmStrip
              format="1x2"
              photos={SAMPLE_PORTRAITS.slice(0, 2)}
              filterId="warm_editorial"
              elevation={state.selectedFormat === '1x2' ? 'floating' : 'raised'}
              size="xs"
              showBrand={true}
            />
          </div>

          {/* Format Label */}
          <div className="mt-2 text-center">
            <span
              className={`font-serif text-lg sm:text-xl tracking-[0.2em] transition-colors ${
                state.selectedFormat === '1x2'
                  ? 'text-[#f5ebd9] font-semibold'
                  : 'text-[#8a7e70] group-hover:text-[#c4baa8]'
              }`}
            >
              1 × 2
            </span>
            <div className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-[#a89d8d]">
              2 Frames • Pocket Size
            </div>
          </div>
        </motion.div>

        {/* OPTION 2: 1 x 4 Strip */}
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          onClick={() => selectFormat('1x4')}
          className="flex flex-col items-center cursor-pointer group relative"
        >
          {/* Top Washi Tape Pinning Strip */}
          <div className="absolute -top-2.5 inset-x-0 flex justify-center z-30 pointer-events-none">
            <WashiTape angle={4} width="w-14 sm:w-16" pattern="stripes" />
          </div>

          {/* Cute Bow Doodle on top right */}
          <div className="absolute -top-3.5 -right-2 z-30 pointer-events-none">
            <Doodle type="bow" size={24} color={isLight ? '#c97d66' : '#ffd166'} rotation={-10} />
          </div>

          {/* Gold Oval Sticker */}
          <div className="absolute top-10 -right-3 z-30 pointer-events-none">
            <Sticker
              text="CLASSIC"
              variant="oval"
              color="gold"
              rotation={10}
              icon={<Sparkles className="w-2.5 h-2.5 text-black" />}
            />
          </div>

          {/* Active selection card wrapper */}
          <div
            className={`p-2 sm:p-2.5 rounded-2xl transition-all duration-300 relative ${
              state.selectedFormat === '1x4'
                ? 'bg-[#181512]/90 ring-2 ring-[#b87d4b] ring-offset-2 ring-offset-[#0b0a09] shadow-2xl shadow-[#b87d4b]/20 scale-[1.02]'
                : 'bg-[#141210]/60 border border-[#2b251f] opacity-80 hover:opacity-100 hover:border-[#42392e]'
            }`}
          >
            {state.selectedFormat === '1x4' && (
              <>
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#b87d4b] text-[#140e08] flex items-center justify-center shadow-lg z-30">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <ScallopBorder color={isLight ? '#c97d66' : '#ffd166'} />
              </>
            )}

            <FilmStrip
              format="1x4"
              photos={SAMPLE_PORTRAITS}
              filterId="warm_editorial"
              elevation={state.selectedFormat === '1x4' ? 'floating' : 'raised'}
              size="xs"
              showBrand={true}
            />
          </div>

          {/* Format Label */}
          <div className="mt-2 text-center">
            <span
              className={`font-serif text-lg sm:text-xl tracking-[0.2em] transition-colors ${
                state.selectedFormat === '1x4'
                  ? 'text-[#f5ebd9] font-semibold'
                  : 'text-[#8a7e70] group-hover:text-[#c4baa8]'
              }`}
            >
              1 × 4
            </span>
            <div className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-[#a89d8d]">
              4 Frames • Vintage Strip
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. BOTTOM ACTION BAR */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-sm mx-auto flex flex-col items-center gap-1 px-4 pt-2 pb-1 z-20"
      >
        <PrimaryButton
          variant="terracotta"
          size="md"
          scalloped={true}
          scallopColor={isLight ? '#382f25' : '#ffd166'}
          onClick={handleContinue}
          icon={<ArrowRight className="w-4 h-4 text-white" />}
          fullWidth
          className="tracking-[0.16em] font-bold shadow-xl"
        >
          {isCamera
            ? `PROCEED TO CAMERA (${state.selectedFormat.replace('x', ' × ')})`
            : `PROCEED TO UPLOAD (${state.selectedFormat.replace('x', ' × ')})`}
        </PrimaryButton>
      </motion.div>
    </div>
  )
}
