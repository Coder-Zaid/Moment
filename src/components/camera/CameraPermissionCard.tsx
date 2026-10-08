import React from 'react'
import { motion } from 'framer-motion'
import { CameraOff, RotateCcw, Upload, ArrowLeft } from 'lucide-react'
import { PrimaryButton } from '../ui/PrimaryButton'

interface CameraPermissionCardProps {
  type: 'permission_denied' | 'unavailable' | 'error'
  message: string
  onRetry: () => void
  onChooseUpload: () => void
  onGoHome: () => void
}

export const CameraPermissionCard: React.FC<CameraPermissionCardProps> = ({
  type,
  message,
  onRetry,
  onChooseUpload,
  onGoHome,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-auto max-w-lg mx-auto w-full p-6 sm:p-8 rounded-2xl bg-[#161310] border border-[#382f25] shadow-2xl flex flex-col items-center text-center select-none"
    >
      <div className="w-16 h-16 rounded-full bg-[#8c3527]/20 border border-[#b84a3b]/40 flex items-center justify-center text-[#e87060] mb-4">
        <CameraOff className="w-8 h-8" />
      </div>

      <h3 className="font-serif text-2xl sm:text-3xl tracking-wider text-[#f5efe6] uppercase mb-2">
        {type === 'permission_denied'
          ? 'CAMERA ACCESS NEEDED'
          : type === 'unavailable'
          ? 'NO CAMERA DETECTED'
          : 'CAMERA INITIALIZATION ERROR'}
      </h3>

      <p className="text-xs sm:text-sm text-[#b8ab9a] leading-relaxed mb-6 max-w-md">
        {message}
      </p>

      {/* Suggested next actions */}
      <div className="flex flex-col gap-3 w-full">
        {type !== 'unavailable' && (
          <PrimaryButton
            variant="bronze"
            size="md"
            fullWidth
            onClick={onRetry}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            TRY CAMERA AGAIN
          </PrimaryButton>
        )}

        <PrimaryButton
          variant="cream"
          size="md"
          fullWidth
          onClick={onChooseUpload}
          icon={<Upload className="w-4 h-4" />}
        >
          UPLOAD PHOTOS INSTEAD
        </PrimaryButton>

        <button
          type="button"
          onClick={onGoHome}
          className="inline-flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8c8071] hover:text-[#f4efe6] transition-colors py-2 cursor-pointer mt-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Home</span>
        </button>
      </div>
    </motion.div>
  )
}
