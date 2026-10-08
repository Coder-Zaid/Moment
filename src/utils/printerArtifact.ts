import type { FilmArtifact, FilmFormatId } from '../types/photobooth'

export interface PrinterMetadata {
  jobId: string
  formatId: FilmFormatId
  dimensionsInch: string
  pixelWidth: number
  pixelHeight: number
  dpi: number
  paperStock: string
  colorProfile: 'sRGB' | 'AdobeRGB'
  estimatedPrintSeconds: number
}

/**
 * Abstraction boundary between the film composition engine and future physical/virtual printer hardware.
 * Provides clean printer-ready contracts without coupling to USB/network hardware or manufacturer SDKs.
 */
export class PrinterArtifactService {
  /**
   * Generates structured print job metadata from a rendered FilmArtifact.
   */
  static getPrintMetadata(artifact: FilmArtifact): PrinterMetadata {
    return {
      jobId: `PRINT_JOB_${artifact.id.toUpperCase()}`,
      formatId: artifact.formatId,
      dimensionsInch: artifact.printMetadata.dimensionsInch,
      pixelWidth: artifact.width,
      pixelHeight: artifact.height,
      dpi: artifact.dpi,
      paperStock: artifact.printMetadata.paperStock,
      colorProfile: 'sRGB',
      estimatedPrintSeconds: artifact.formatId === '1x2' ? 12 : 22,
    }
  }

  /**
   * Triggers a local direct file download for kiosk backup or guest take-home.
   */
  static downloadArtifact(artifact: FilmArtifact, customFileName?: string) {
    const link = document.createElement('a')
    const filename =
      customFileName ||
      `moment-film-strip-${artifact.formatId}-${new Date(artifact.renderedAt)
        .toISOString()
        .slice(0, 10)}.png`
    link.href = artifact.blobUrl || artifact.dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
