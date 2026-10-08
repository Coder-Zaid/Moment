import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { PrimaryButton } from './PrimaryButton'

interface ErrorStateProps {
  code?: string
  message: string
  onRetry?: () => void
  onDismiss?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  code,
  message,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-auto bg-[#181512] border border-[#3e342a] rounded-2xl shadow-2xl">
      <div className="w-14 h-14 rounded-full bg-[#8c3527]/20 border border-[#b84a3b]/40 flex items-center justify-center text-[#e87060] mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="font-serif text-2xl tracking-wider text-[#f4efe6] mb-1">
        SOMETHING HAPPENED
      </h3>

      {code && (
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#94897a] mb-3">
          CODE: {code}
        </span>
      )}

      <p className="text-sm text-[#c8beaf] leading-relaxed mb-6">{message}</p>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {onRetry && (
          <PrimaryButton
            variant="bronze"
            size="md"
            fullWidth
            onClick={onRetry}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            TRY AGAIN
          </PrimaryButton>
        )}
        {onDismiss && (
          <PrimaryButton
            variant="dark"
            size="md"
            fullWidth
            onClick={onDismiss}
          >
            GO TO HOME
          </PrimaryButton>
        )}
      </div>
    </div>
  )
}
