import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SwitchCamera, Volume2, VolumeX, X, Camera, Shuffle } from 'lucide-react'

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
  isLight?: boolean
  onNextPose?: () => void
  showPoseGuide?: boolean
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
  isLight = false,
  onNextPose,
  showPoseGuide = false,
}) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="w-full flex items-center justify-between px-2 sm:px-10 my-2 select-none">
      {/* Left Control: Flip Camera & Sound Mute */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onFlipCamera}
          disabled={disabled || isCountingDown}
          title="Switch Camera"
          aria-label="Switch Camera"
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer touch-press disabled:opacity-40 shadow-md ${
            isLight
              ? 'bg-white hover:bg-stone-50 border-stone-300 text-stone-800'
              : 'bg-[#1b1713] hover:bg-[#28221b] border-[#3b3227] text-[#ffd166]'
          }`}
        >
          <SwitchCamera className="w-5 h-5 stroke-[2.2]" />
        </button>

        <button
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute shutter sound' : 'Enable shutter sound'}
          aria-label={soundEnabled ? 'Mute shutter sound' : 'Enable shutter sound'}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer touch-press shadow-md ${
            isLight
              ? 'bg-white hover:bg-stone-50 border-stone-300 text-stone-800'
              : 'bg-[#1b1713] hover:bg-[#28221b] border-[#3b3227] text-[#ffd166]'
          }`}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 stroke-[2.2]" />
          ) : (
            <VolumeX className="w-5 h-5 opacity-60" />
          )}
        </button>
      </div>

      {/* Center Shutter Button: Bold, Terracotta, Highly Visible */}
      <div className="relative flex flex-col items-center">
        {isRetakeMode && retakeIndex !== null ? (
          <div className="absolute -top-8 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c97d66] text-white text-[11px] font-mono uppercase font-bold tracking-wider shadow-lg z-30">
            <span>RETAKING FRAME {String(retakeIndex + 1).padStart(2, '0')}</span>
            <button
              type="button"
              onClick={onCancelRetake}
              title="Cancel retake"
              className="hover:opacity-75 cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        ) : showPoseGuide && !isCountingDown && !disabled ? (
          <div className="absolute -top-7 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900/80 text-[#ffd166] text-[10px] font-mono tracking-wider shadow-md backdrop-blur-xs border border-white/10 z-20 whitespace-nowrap">
            <span>📸 Click shutter to pose & snap</span>
          </div>
        ) : null}

        <motion.button
          type="button"
          onClick={disabled || isCountingDown || isCapturing ? undefined : onCapture}
          disabled={disabled || isCountingDown || isCapturing}
          whileHover={shouldReduceMotion || disabled ? undefined : { scale: 1.05 }}
          whileTap={shouldReduceMotion || disabled ? undefined : { scale: 0.93 }}
          title={isCountingDown ? 'Counting down...' : 'Take Photo (Switches to camera)'}
          aria-label={isCountingDown ? 'Counting down...' : 'Take Photo'}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 p-1.5 flex items-center justify-center cursor-pointer touch-press disabled:opacity-50 shadow-2xl transition-all ${
            isLight
              ? 'border-[#c97d66] bg-white shadow-[#c97d66]/30 ring-4 ring-[#c97d66]/20'
              : 'border-[#ffd166] bg-[#141210] shadow-black ring-4 ring-[#ffd166]/20'
          }`}
        >
          {/* Inner tactile shutter circle */}
          <div
            className={`w-full h-full rounded-full transition-all duration-150 flex items-center justify-center shadow-md ${
              isCountingDown
                ? 'bg-[#b87d4b] scale-90'
                : 'bg-[#c97d66] hover:bg-[#d98b74] active:bg-[#b56e58] text-white'
            }`}
          >
            {isCountingDown ? (
              <span className="font-mono text-base font-bold text-[#140e08] animate-pulse">
                WAIT
              </span>
            ) : (
              <Camera className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-[2.2] drop-shadow" />
            )}
          </div>
        </motion.button>
      </div>

      {/* Right Controls: Next Pose or Retake Done or Shutter Badge */}
      <div className="w-28 flex justify-end">
        {isRetakeMode ? (
          <button
            type="button"
            onClick={onCancelRetake}
            className={`px-3 py-1.5 rounded-xl border-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer touch-press shadow-sm ${
              isLight
                ? 'bg-white hover:bg-stone-50 border-stone-300 text-stone-800'
                : 'bg-[#201c18] hover:bg-[#2b251f] border-[#382f23] text-[#ffd166]'
            }`}
          >
            Done
          </button>
        ) : showPoseGuide && onNextPose ? (
          <button
            type="button"
            onClick={onNextPose}
            title="Randomize / Next Pose Idea"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer touch-press shadow-sm active:scale-95 ${
              isLight
                ? 'bg-white hover:bg-stone-50 border-stone-300 text-stone-800'
                : 'bg-[#1b1713] hover:bg-[#28221b] border-[#3b3227] text-[#ffd166]'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5 text-[#c97d66]" />
            <span>Pose</span>
          </button>
        ) : (
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm ${
              isLight
                ? 'bg-white/90 border-stone-300 text-stone-800'
                : 'bg-[#1b1713]/90 border-[#332a21] text-[#ffd166]'
            }`}
          >
            <span>SHUTTER</span>
          </div>
        )}
      </div>
    </div>
  )
}
