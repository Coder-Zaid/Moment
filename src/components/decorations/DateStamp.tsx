import React, { useState } from 'react'

interface DateStampProps {
  date?: string
  color?: 'amber' | 'red' | 'charcoal'
  rotation?: number
  className?: string
}

const getDefaultDateString = () => {
  const d = new Date()
  return `'${d.getFullYear().toString().slice(-2)} ${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getDate()).padStart(2, '0')}`
}

export const DateStamp: React.FC<DateStampProps> = ({
  date,
  color = 'amber',
  rotation = 2,
  className = '',
}) => {
  const [currentDate] = useState<string>(() => date || getDefaultDateString())

  const colorStyles = {
    amber: 'text-[#e58a36] border-[#e58a36]/50 bg-[#e58a36]/10 shadow-[0_0_8px_rgba(229,138,54,0.3)]',
    red: 'text-[#e04838] border-[#e04838]/50 bg-[#e04838]/10 shadow-[0_0_8px_rgba(224,72,56,0.3)]',
    charcoal: 'text-[#8a7f70] border-[#8a7f70]/50 bg-[#8a7f70]/10',
  }

  return (
    <div
      aria-hidden="true"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm border
        font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold
        select-none pointer-events-none ${colorStyles[color]} ${className}
      `}
    >
      <span>DATE</span>
      <span>{currentDate}</span>
    </div>
  )
}
