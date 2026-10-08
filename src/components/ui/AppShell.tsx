import React, { type ReactNode } from 'react'
import { usePhotobooth } from '../../context/PhotoboothContext'
import type { ScreenState } from '../../types/photobooth'
import { Monitor, RotateCcw, Sun, Moon } from 'lucide-react'

interface AppShellProps {
  children: ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { state, navigate, resetSession, toggleKioskMode, toggleTheme } = usePhotobooth()
  const isLight = state.theme === 'light'

  // Developer quick-navigation screens for verifying all workflow states in development
  const allScreens: ScreenState[] = [
    'HOME',
    'MODE_SELECTION',
    'FORMAT_SELECTION',
    'CAMERA_CAPTURE',
    'PHOTO_UPLOAD',
    'PHOTO_EDIT',
    'FILM_PREVIEW',
    'PRINTING',
    'COMPLETE',
  ]

  return (
    <div
      data-theme={state.theme}
      className={`relative min-h-[100dvh] w-full flex flex-col transition-colors duration-300 overflow-x-hidden ${
        isLight ? 'bg-[#f7f4ee] text-[#1a1714]' : 'dark bg-[#0b0a09] text-[#f4efe6]'
      }`}
    >
      {/* Cinematic Background Atmosphere: Dedicated Photo Booth Studio Wallpaper & Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Paired Photo Booth Wallpaper Image (Light and Dark paired versions matching reference) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none scale-[1.01]"
          style={{
            backgroundImage: `url(${isLight ? '/backgrounds/photobooth_bg_light.jpg' : '/backgrounds/photobooth_bg_dark.jpg'})`,
            opacity: isLight ? 0.85 : 0.70,
          }}
        />

        {/* Soft Vignette / Ambient Center Illumination to keep central content ultra-readable */}
        {isLight ? (
          <>
            {/* Fine Art Paper / Soft Morning Center Glow */}
            <div
              className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full opacity-30 blur-[130px]"
              style={{
                background:
                  'radial-gradient(circle, rgba(245, 238, 228, 0.8) 0%, rgba(247, 244, 238, 0.4) 60%, transparent 80%)',
              }}
            />
            <div
              className="absolute -bottom-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-25 blur-[110px]"
              style={{
                background:
                  'radial-gradient(circle, rgba(230, 215, 195, 0.4) 0%, transparent 70%)',
              }}
            />
            <div className="absolute inset-0 paper-grain opacity-20" />
          </>
        ) : (
          <>
            {/* Central top warm glow / spotlight */}
            <div
              className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full opacity-30 blur-[120px]"
              style={{
                background:
                  'radial-gradient(circle, rgba(184, 125, 75, 0.35) 0%, rgba(138, 85, 45, 0.15) 50%, transparent 80%)',
              }}
            />
            {/* Bottom subtle ambient warmth */}
            <div
              className="absolute -bottom-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-[100px]"
              style={{
                background:
                  'radial-gradient(circle, rgba(196, 140, 89, 0.25) 0%, transparent 70%)',
              }}
            />
            <div className="absolute inset-0 paper-grain opacity-20" />
          </>
        )}
      </div>

      {/* Discreet Developer / Kiosk Diagnostic Top Ribbon (Can be toggled or clicked) */}
      <header
        className={`relative z-20 w-full px-4 sm:px-6 py-2 flex items-center justify-between border-b backdrop-blur-sm text-[11px] transition-colors ${
          isLight
            ? 'border-[#e4dcce] bg-[#ffffff]/85 text-[#6b6154]'
            : 'border-[#201d19]/80 bg-[#0e0d0b]/80 text-[#a09485]'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetSession}
            title="Reset Photobooth Session"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer touch-press"
            aria-label="Reset Photobooth Session"
          >
            <div className="w-2 h-2 rounded-full bg-[#b87d4b] animate-pulse" />
            <span
              className={`font-serif tracking-widest font-bold ${
                isLight ? 'text-[#241e18]' : 'text-[#d8cebe]'
              }`}
            >
              MOMENT
            </span>
            <span
              className={`text-[10px] tracking-wider uppercase ${
                isLight ? 'text-[#8c8072]' : 'text-[#786e62]'
              }`}
            >
              KIOSK
            </span>
          </button>
        </div>

        {/* Center: Sleek Kiosk Status in Production or Workflow Switcher in Development */}
        {state.isKioskMode ? (
          <div
            className={`hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono ${
              isLight ? 'text-[#6b6154]' : 'text-[#948777]'
            }`}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#b87d4b]" />
            <span>TOUCHSCREEN KIOSK • 300 DPI ARCHIVAL FILM</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto py-0.5">
            <span
              className={`text-[10px] uppercase tracking-wider mr-1 ${
                isLight ? 'text-[#8c8072]' : 'text-[#6b6256]'
              }`}
            >
              Phase:
            </span>
            {allScreens.map((screen) => {
              const isActive = state.currentScreen === screen
              return (
                <button
                  key={screen}
                  type="button"
                  onClick={() => navigate(screen)}
                  className={`px-2 py-0.5 rounded text-[10px] tracking-wider uppercase transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#b87d4b] text-[#140e08] font-semibold'
                      : isLight
                        ? 'text-[#6b6154] hover:text-[#191612] hover:bg-[#ede5d8]'
                        : 'text-[#877c6e] hover:text-[#f4efe6] hover:bg-[#1f1c18]'
                  }`}
                >
                  {screen.replace('_', ' ')}
                </button>
              )
            })}
          </div>
        )}

        {/* Right side controls: Theme toggle, Reset & Kiosk mode */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer touch-press ${
              isLight
                ? 'bg-[#f4efe6] border-[#dfd6c8] text-[#1a1714] hover:bg-[#eae3d5]'
                : 'bg-[#141210] border-[#26211a] text-[#f4efe6] hover:bg-[#1f1c18]'
            }`}
            title={isLight ? 'Switch to Dark Studio Mode' : 'Switch to Archival Warm Paper Light Mode'}
            aria-label="Toggle Theme"
          >
            {isLight ? (
              <>
                <Moon className="w-3 h-3 text-[#8a5223]" />
                <span className="hidden sm:inline text-[10px] uppercase tracking-wider font-medium text-[#4a3f31]">
                  Dark
                </span>
              </>
            ) : (
              <>
                <Sun className="w-3 h-3 text-[#d89f68]" />
                <span className="hidden sm:inline text-[10px] uppercase tracking-wider font-medium text-[#d8cebe]">
                  Light
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={resetSession}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer touch-press ${
              isLight
                ? 'bg-[#ffffff] border-[#dfd6c8] text-[#4a3f31] hover:bg-[#f4efe6]'
                : 'bg-[#141210] border-[#26211a] hover:bg-[#1f1c18] hover:text-[#f4efe6]'
            }`}
            title="Reset Kiosk State (Start Fresh Session)"
            aria-label="Start fresh session"
          >
            <RotateCcw className="w-3 h-3 text-[#b87d4b]" />
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider">Reset</span>
          </button>

          <button
            type="button"
            onClick={toggleKioskMode}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer touch-press ${
              state.isKioskMode
                ? 'bg-[#b87d4b]/20 border-[#b87d4b]/50 text-[#b87d4b]'
                : isLight
                  ? 'bg-[#ffffff] border-[#dfd6c8] text-[#4a3f31] hover:bg-[#f4efe6]'
                  : 'bg-[#141210] border-[#26211a] hover:bg-[#1f1c18]'
            }`}
            title="Toggle Kiosk Fullscreen Mode (Ctrl+K)"
            aria-label="Toggle Kiosk Mode"
          >
            <Monitor className="w-3 h-3" />
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider">
              {state.isKioskMode ? 'Kiosk On' : 'Kiosk'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Kiosk Content Area */}
      <main className="relative z-10 flex-1 flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        {children}
      </main>
    </div>
  )
}
