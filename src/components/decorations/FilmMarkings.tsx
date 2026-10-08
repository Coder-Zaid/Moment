import React from 'react'

interface FilmMarkingsProps {
  frameNumber?: string
  filmStock?: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export const FilmMarkings: React.FC<FilmMarkingsProps> = ({
  frameNumber = '04A',
  filmStock = 'MOMENT 400',
  orientation = 'horizontal',
  className = '',
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        aria-hidden="true"
        className={`flex flex-col items-center justify-between text-[8px] font-mono tracking-widest text-[#948777]/60 select-none pointer-events-none py-2 ${className}`}
      >
        <span className="[writing-mode:vertical-lr] rotate-180 uppercase">{filmStock}</span>
        <div className="flex flex-col gap-1.5 my-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-3.5 rounded-[2px] bg-[#070605] border border-[#2b251f]"
            />
          ))}
        </div>
        <span className="font-semibold text-[#b87d4b]">{frameNumber}</span>
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-between text-[8px] sm:text-[9px] font-mono tracking-widest text-[#948777]/70 select-none pointer-events-none px-2 py-1 ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#b87d4b]">{frameNumber}</span>
        <span className="uppercase">{filmStock}</span>
      </div>

      {/* Sprocket Holes */}
      <div className="flex items-center gap-1.5 opacity-80">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-3.5 rounded-[2px] bg-[#070605] border border-[#26201a]"
          />
        ))}
      </div>

      <span className="hidden sm:inline opacity-70">EXP 2026</span>
    </div>
  )
}
