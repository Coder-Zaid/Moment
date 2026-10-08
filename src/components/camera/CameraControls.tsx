import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SwitchCamera, Volume2, VolumeX, X } from 'lucide-react'

interface CameraControlsProps {
  onCapture: () => void
  onFlipCamera: () => void
  isCountingDown: boolean
  isCapturing: boolean
  isRetakeMode: boolean
  retakeIndex: number | null
  onCancelRetake: () => void
  soundEnabled: boolean
  onToggleSound: () => void
  disabled?: boolean
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onCapture,
  onFlipCamera,
  isCountingDown,
  isCapturing,
  isRetakeMode,
  retakeIndex,
  onCancelRetake,
  soundEnabled,
  onToggleSound,
  disabled = false,
}) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="w-full flex items-center justify-between px-4 sm:px-12 my-2 select-none">
      {/* Left Control: Flip Camera */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onFlipCamera}
          disabled={disabled || isCountingDown}
          title="Switch Camera"
          aria-label="Switch Camera"
          className="w-12 h-12 rounded-full bg-[#1b1713]/80 border border-[#332a21] hover:bg-[#28221b] text-[#d8cebe] flex items-center justify-center transition-colors cursor-pointer touch-press disabled:opacity-40"
        >
          <SwitchCamera className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute shutter sound' : 'Enable shutter sound'}
          aria-label={soundEnabled ? 'Mute shutter sound' : 'Enable shutter sound'}
          className="w-12 h-12 rounded-full bg-[#1b1713]/80 border border-[#332a21] hover:bg-[#28221b] text-[#d8cebe] flex items-center justify-center transition-colors cursor-pointer touch-press"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 opacity-60" />}
        </button>
      </div>

      {/* Center Shutter Button (Matching Reference Image Panel 3) */}
      <div className="relative flex flex-col items-center">
        {isRetakeMode && retakeIndex !== null && (
          <div className="absolute -top-7 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#b87d4b] text-[#140e08] text-[10px] font-mono uppercase font-bold tracking-wider shadow">
            <span>RETAKING FRAME {String(retakeIndex + 1).padStart(2, '0')}</span>
            <button
              type="button"
              onClick={onCancelRetake}
              title="Cancel retake"
              className="hover:opacity-75 cursor-pointer ml-1"
            >
              <X className="w-3 h-3 stroke-[3]" />
            </button>
          </div>
        )}

        <motion.button
          type="button"
          onClick={disabled || isCountingDown || isCapturing ? undefined : onCapture}
          disabled={disabled || isCountingDown || isCapturing}
          whileHover={shouldReduceMotion || disabled ? undefined : { scale: 1.05 }}
          whileTap={shouldReduceMotion || disabled ? undefined : { scale: 0.93 }}
          title={isCountingDown ? 'Counting down...' : 'Take Photo'}
          aria-label={isCountingDown ? 'Counting down...' : 'Take Photo'}
          className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 border-white/80 p-1 flex items-center justify-center cursor-pointer touch-press disabled:opacity-60 shadow-xl"
        >
          {/* Inner tactile shutter circle */}
          <div
            className={`w-full h-full rounded-full transition-all duration-150 flex items-center justify-center ${
              isCountingDown
                ? 'bg-[#b87d4b] scale-90'
                : 'bg-[#c97d66] hover:bg-[#d98b74] active:bg-[#b56e58]'
            }`}
          >
            {isCountingDown && (
              <span className="font-mono text-sm font-bold text-[#140e08] animate-pulse">
                WAIT
              </span>
            )}
          </div>
        </motion.button>
      </div>

      {/* Right Spacer / Balance */}
      <div className="w-24 flex justify-end">
        {isRetakeMode && (
          <button
            type="button"
            onClick={onCancelRetake}
            className="px-3 py-1.5 rounded-xl bg-[#201c18] border border-[#382f23] text-xs font-mono text-[#d8cebe] hover:text-white uppercase tracking-wider transition-colors cursor-pointer touch-press"
          >
            Done Retake
          </button>
        )}
      </div>
    </div>
  )
}
