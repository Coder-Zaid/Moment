/**
 * Studio photobooth audio cues synthesized using native Web Audio API.
 * Requires zero external audio files and works completely offline.
 */

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioContextClass) {
        audioCtx = new AudioContextClass()
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
    return audioCtx
  } catch {
    return null
  }
}

/**
 * Play a short countdown tone (pitch rises for final beat).
 */
export function playCountdownTone(number: number): void {
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    // 3 -> 600Hz, 2 -> 750Hz, 1 -> 900Hz
    const freq = number === 1 ? 950 : number === 2 ? 800 : 650
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.type = 'sine'

    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.18)
  } catch {
    // Graceful fallback if audio is disabled
  }
}

/**
 * Play a mechanical shutter snap click sound.
 */
export function playShutterSound(): void {
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    // 1. White noise burst for shutter curtain mechanical click
    const bufferSize = ctx.sampleRate * 0.08
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1400, ctx.currentTime)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start()
    noise.stop(ctx.currentTime + 0.09)
  } catch {
    // Graceful fallback
  }
}
