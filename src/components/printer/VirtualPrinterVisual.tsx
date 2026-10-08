import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { FilmArtifact, PrintSimulationState } from '../../types/photobooth'
import { CheckCircle2 } from 'lucide-react'

interface VirtualPrinterVisualProps {
  artifact: FilmArtifact
  printState: PrintSimulationState
  progress: number
  onCollect?: () => void
}

export const VirtualPrinterVisual: React.FC<VirtualPrinterVisualProps> = ({
  artifact,
  printState,
  progress,
  onCollect,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const is1x2 = artifact.formatId === '1x2'
  const isComplete = printState === 'FILM_COMPLETE'
  const isEmerging = printState === 'FILM_EMERGING' || printState === 'PRINTING'

  // Calculate physical vertical translation of the emerging film based on progress
  // At progress <= 15%: film is tucked inside behind the slot
  // From progress 15% to 95%: film smoothly emerges downward
  // At 100%: film has completely cleared the feed roller and rests settled
  const getEmergenceTranslateY = () => {
    if (shouldReduceMotion) {
      return isComplete ? '0%' : '-15%'
    }
    if (printState === 'PRINT_PREPARING') return '-92%'
    if (printState === 'PRINTING') return '-78%'
    if (printState === 'FILM_EMERGING') {
      // Map progress from 30% -> 90% to translation from -75% -> 0%
      const normalized = Math.min(Math.max((progress - 30) / 60, 0), 1)
      const startY = -75
      const endY = 0
      return `${startY + normalized * (endY - startY)}%`
    }
    if (isComplete) return '0%'
    return '-92%'
  }

  // LED status color and animation
  const getLedStatus = () => {
    switch (printState) {
      case 'PRINT_PREPARING':
        return {
          color: 'bg-amber-400',
          shadow: 'shadow-[0_0_10px_rgba(251,191,36,0.8)]',
          animate: { opacity: [0.4, 1, 0.4] },
          duration: 1.2,
        }
      case 'PRINTING':
      case 'FILM_EMERGING':
        return {
          color: 'bg-[#d89f68]',
          shadow: 'shadow-[0_0_14px_rgba(216,159,104,0.9)]',
          animate: { opacity: [0.3, 1, 0.3] },
          duration: 0.7,
        }
      case 'FILM_COMPLETE':
        return {
          color: 'bg-emerald-400',
          shadow: 'shadow-[0_0_16px_rgba(52,211,153,1)]',
          animate: { opacity: [0.8, 1, 0.8] },
          duration: 2,
        }
      default:
        return {
          color: 'bg-amber-400',
          shadow: 'shadow-none',
          animate: { opacity: 0.5 },
          duration: 1,
        }
    }
  }

  const led = getLedStatus()

  return (
    <div className="relative w-full max-w-md sm:max-w-lg mx-auto flex flex-col items-center select-none">
      {/* --- PRINTER HOUSING BODY (TOP MODULE) --- */}
      <div className="relative z-30 w-full rounded-2xl bg-gradient-to-b from-[#211d18] via-[#181512] to-[#120f0d] p-4 sm:p-5 border border-[#3b3329] shadow-2xl shadow-black/95">
        {/* Subtle brushed metallic texture */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none paper-grain opacity-20" />

        {/* Top Control Bar: Logo, Model & LED Lamp */}
        <div className="relative z-10 flex items-center justify-between px-2 pb-3 border-b border-[#2a241d]">
          <div className="flex items-center gap-2.5">
            <span className="font-serif tracking-[0.25em] text-sm sm:text-base font-semibold text-[#f0e7db]">
              MOMENT
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase text-[#948877] px-2 py-0.5 rounded bg-[#100d0b] border border-[#26201a]">
              P-200 STUDIO
            </span>
          </div>

          {/* Precision Status LED */}
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono tracking-widest uppercase text-[#807464] hidden sm:inline">
              FEED MOTOR
            </span>
            <motion.div
              animate={led.animate}
              transition={{ duration: led.duration, repeat: Infinity, ease: 'easeInOut' }}
              className={`w-2.5 h-2.5 rounded-full ${led.color} ${led.shadow}`}
            />
          </div>
        </div>

        {/* Mid Module: Heat Dissipation Louvers / Mechanical Details */}
        <div className="flex justify-between items-center py-2 px-3 text-[9px] font-mono text-[#6e6252] tracking-widest opacity-70">
          <span>DYE-SUB THERMAL HEAD</span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#302820]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#302820]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#302820]" />
          </div>
          <span>300 DPI CONTINUOUS TONE</span>
        </div>

        {/* --- PRINTER DISPENSER SLOT (THE PHYSICAL APERTURE) --- */}
        <div className="relative mt-1 w-full h-8 sm:h-9 rounded-lg bg-[#070605] border-t-2 border-b border-[#2e261f] shadow-inner flex items-center justify-center overflow-hidden">
          {/* Inner Cavern Shadow */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0807] to-transparent pointer-events-none z-10" />

          {/* Stepper Feed Roller Bar Highlight */}
          <motion.div
            animate={
              isEmerging && !shouldReduceMotion
                ? { opacity: [0.4, 0.9, 0.4] }
                : { opacity: 0.5 }
            }
            transition={{ duration: 0.6, repeat: Infinity }}
            className="w-[94%] h-1 rounded-full bg-gradient-to-r from-transparent via-[#8a7259] to-transparent shadow-[0_0_6px_rgba(201,142,90,0.4)] z-10"
          />

          {/* Mechanical Bevel Lip */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-[#26201a] border-t border-[#3b3228]" />
        </div>
      </div>

      {/* --- FILM EMERGENCE STAGE (DISPENSING CHUTE & TRAY) --- */}
      <div className="relative z-10 -mt-3 w-full flex flex-col items-center justify-start overflow-hidden pt-3 pb-8">
        {/* Soft Ambient Backdrop Cast Shadow */}
        <div className="absolute top-0 inset-x-8 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-20" />

        {/* Physical Emerging Film Strip */}
        <div className="relative z-10 flex justify-center py-2">
          <motion.div
            animate={{
              y: getEmergenceTranslateY(),
              // Micro stepper motor jitter during emergence for tactile realism
              x: isEmerging && !shouldReduceMotion ? [0, 0.4, -0.4, 0] : 0,
            }}
            transition={{
              y: { duration: shouldReduceMotion ? 0.4 : 0.85, ease: [0.16, 1, 0.3, 1] },
              x: { duration: 0.18, repeat: isEmerging ? Infinity : 0 },
            }}
            onClick={isComplete ? onCollect : undefined}
            className={`
              relative transition-all duration-300
              ${isComplete ? 'cursor-pointer hover:scale-[1.02] hover:-translate-y-1' : ''}
            `}
          >
            {/* The Actual Rendered 300 DPI Canvas Strip Image */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black border border-[#383126]">
              <img
                src={artifact.blobUrl || artifact.dataUrl}
                alt="Printed Heirloom Photo Strip"
                className={`
                  w-auto object-contain select-none rounded-xl
                  ${is1x2 ? 'max-h-[50vh] sm:max-h-[56vh]' : 'max-h-[56vh] sm:max-h-[64vh]'}
                `}
              />

              {/* Surface Gloss Sheen Overlay on Completion */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: '-100%' }}
                  animate={{ opacity: [0, 0.5, 0], y: ['-100%', '150%'] }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent pointer-events-none"
                />
              )}
            </div>

            {/* Tap to Collect Floating Badge on Completion */}
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.3 }}
                className="absolute -bottom-4 inset-x-0 flex justify-center z-30 pointer-events-none"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b1713]/95 border border-[#b87d4b] text-[10px] font-mono tracking-widest text-[#f5ebd9] uppercase shadow-lg shadow-black/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  TAP TO COLLECT STRIP
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Collection Tray Base Stand / Footing */}
        <div className="w-[88%] h-4 rounded-b-xl bg-gradient-to-b from-[#141210] to-[#0c0a09] border-x border-b border-[#2d261e] shadow-lg shadow-black/80 mt-2" />
      </div>
    </div>
  )
}
