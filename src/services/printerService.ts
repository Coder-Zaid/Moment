import type { FilmArtifact, PrintSimulationState, PrinterStatus } from '../types/photobooth'

/**
 * Standard Hardware Abstraction Interface for Photo Booth Printers.
 * Both the Virtual Printer Simulation and any future Physical Printer Drivers
 * (Web Print API, IPP, local WebSocket / USB daemon) implement this contract.
 */
export interface IPrinterService {
  preparePrint(artifact: FilmArtifact): Promise<void>
  startPrint(
    artifact: FilmArtifact,
    onProgress?: (status: PrinterStatus) => void,
    signal?: AbortSignal,
    options?: { reducedMotion?: boolean }
  ): Promise<PrinterStatus>
  getStatus(): PrinterStatus
  cancelPrint(): Promise<void>
  dispose(): void
}

/**
 * VirtualPrinter: Production-grade client-side simulation adapter.
 * Replicates physical thermal dye-sublimation print mechanics:
 * roll feeding, thermal head pass, progressive emergence, and tray clearing.
 */
export class VirtualPrinter implements IPrinterService {
  private currentStatus: PrinterStatus = {
    state: 'PRINT_PREPARING',
    progress: 0,
    message: 'PRINTER STANDBY • READY FOR JOB',
  }

  private isPrinting = false

  getStatus(): PrinterStatus {
    return { ...this.currentStatus }
  }

  async preparePrint(artifact: FilmArtifact): Promise<void> {
    if (!artifact) {
      throw new Error('No valid film artifact provided to printer')
    }
    this.isPrinting = false
    this.currentStatus = {
      state: 'PRINT_PREPARING',
      progress: 5,
      message: 'CALIBRATING THERMAL PRINT HEAD & ENGAGING FEED ROLLERS...',
    }
  }

  async startPrint(
    artifact: FilmArtifact,
    onProgress?: (status: PrinterStatus) => void,
    signal?: AbortSignal,
    options?: { reducedMotion?: boolean }
  ): Promise<PrinterStatus> {
    if (this.isPrinting && signal?.aborted) {
      throw new Error('Print job cancelled')
    }
    this.isPrinting = true

    if (!artifact || (!artifact.dataUrl && !artifact.blobUrl)) {
      this.currentStatus = {
        state: 'PRINT_ERROR',
        progress: 0,
        message: 'PRINT ABORTED: ARTIFACT DATA INVALID OR MISSING',
        error: 'INVALID_ARTIFACT',
      }
      onProgress?.(this.currentStatus)
      throw new Error(this.currentStatus.message)
    }

    this.isPrinting = true
    const is1x2 = artifact.formatId === '1x2'
    const isReduced = options?.reducedMotion ?? false

    // Timing profile tuned for believable mechanical physicality
    const prepDuration = isReduced ? 250 : 700
    const feedDuration = isReduced ? 300 : 900
    const emergeDuration = isReduced ? 800 : is1x2 ? 2600 : 3600
    const settleDuration = isReduced ? 200 : 500

    const updateStatus = (
      state: PrintSimulationState,
      progress: number,
      message: string
    ) => {
      if (signal?.aborted) return
      this.currentStatus = { state, progress, message }
      onProgress?.(this.currentStatus)
    }

    try {
      // Phase 1: PRINT_PREPARING
      updateStatus('PRINT_PREPARING', 10, 'WARMING THERMAL HEAD & FEEDING ARCHIVAL STOCK...')
      await this.sleep(prepDuration, signal)

      // Phase 2: PRINTING (Feed mechanism actively engaged)
      updateStatus('PRINTING', 28, 'APPLYING DYE-DIFFUSION COLOR MATRIX...')
      await this.sleep(feedDuration, signal)

      // Phase 3: FILM_EMERGING (Strip physically ejecting through the slot)
      const emergeSteps = isReduced ? 3 : is1x2 ? 6 : 8
      const stepTime = emergeDuration / emergeSteps
      for (let i = 1; i <= emergeSteps; i++) {
        const emergeProgress = 30 + Math.round((i / emergeSteps) * 60)
        const frameNote = is1x2 ? 'FRAME 1–2 OF 2' : `FRAME ${Math.min(i, 4)} OF 4`
        updateStatus(
          'FILM_EMERGING',
          emergeProgress,
          `DISPENSING STRIP • ${frameNote} CLEARING ROLLER...`
        )
        await this.sleep(stepTime, signal)
      }

      // Phase 4: Settle & FILM_COMPLETE
      await this.sleep(settleDuration, signal)
      updateStatus(
        'FILM_COMPLETE',
        100,
        'PRINT COMPLETE • YOUR HEIRLOOM STRIP IS READY TO COLLECT'
      )

      return this.currentStatus
    } catch (err: unknown) {
      if (signal?.aborted) {
        updateStatus('PRINT_PREPARING', 0, 'PRINT CANCELLED')
      } else {
        const msg = err instanceof Error ? err.message : 'Simulated mechanical feed error'
        updateStatus('PRINT_ERROR', 0, `PRINTER HALTED: ${msg}`)
      }
      throw err
    } finally {
      this.isPrinting = false
    }
  }

  async cancelPrint(): Promise<void> {
    this.isPrinting = false
    this.currentStatus = {
      state: 'PRINT_PREPARING',
      progress: 0,
      message: 'PRINT JOB CANCELLED BY OPERATOR',
    }
  }

  dispose(): void {
    this.isPrinting = false
  }

  private sleep(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        return reject(new Error('Print job aborted'))
      }
      const timer = setTimeout(() => resolve(), ms)
      signal?.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new Error('Print job aborted'))
      })
    })
  }
}

// Singleton provider instance for UI consumption
let printerInstance: IPrinterService | null = null

export function getPrinterService(): IPrinterService {
  if (!printerInstance) {
    printerInstance = new VirtualPrinter()
  }
  return printerInstance
}
