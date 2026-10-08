import type { CapturedPhoto } from '../types/photobooth'

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024 // 25 MB kiosk limit

export interface ValidationResult {
  valid: boolean
  error?: string
  width?: number
  height?: number
}

/**
 * Validates file type, size, non-zero bytes, and decodability without server transmission.
 */
export async function validateImageFile(file: File): Promise<ValidationResult> {
  // 1. Check file existence & 0-byte corruption
  if (!file || file.size === 0) {
    return {
      valid: false,
      error: `"${file?.name || 'File'}" is empty or corrupted (0 bytes).`,
    }
  }

  // 2. Check maximum file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    return {
      valid: false,
      error: `"${file.name}" is ${sizeMb} MB. Maximum allowed size is 25 MB.`,
    }
  }

  // 3. Check MIME type or extension
  const matchesMime = ACCEPTED_IMAGE_TYPES.includes(file.type.toLowerCase())
  const lowerName = file.name.toLowerCase()
  const matchesExt = ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))

  if (!matchesMime && !matchesExt) {
    return {
      valid: false,
      error: `"${file.name}" is not a supported format. Please select JPEG, PNG, or WebP.`,
    }
  }

  // 4. Verify client-side image decodability
  try {
    const dimensions = await inspectImageDimensions(file)
    return {
      valid: true,
      width: dimensions.width,
      height: dimensions.height,
    }
  } catch {
    return {
      valid: false,
      error: `"${file.name}" could not be decoded as a valid image.`,
    }
  }
}

/**
 * Inspects natural image dimensions using local createImageBitmap or Image element.
 */
function inspectImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (typeof createImageBitmap === 'function') {
      createImageBitmap(file)
        .then((bitmap) => {
          const { width, height } = bitmap
          bitmap.close()
          resolve({ width, height })
        })
        .catch(reject)
    } else {
      const tempUrl = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        const { naturalWidth: width, naturalHeight: height } = img
        URL.revokeObjectURL(tempUrl)
        resolve({ width, height })
      }
      img.onerror = () => {
        URL.revokeObjectURL(tempUrl)
        reject(new Error('Image failed to decode'))
      }
      img.src = tempUrl
    }
  })
}

/**
 * Creates a strongly typed CapturedPhoto object with local object URL preview.
 */
export async function createPhotoFromFile(file: File, order: number = 0): Promise<CapturedPhoto> {
  const previewUrl = URL.createObjectURL(file)
  let width = 0
  let height = 0

  try {
    const dimensions = await inspectImageDimensions(file)
    width = dimensions.width
    height = dimensions.height
  } catch {
    // Keep 0 if inspection fails
  }

  const id = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

  return {
    id,
    url: previewUrl,
    previewUrl,
    timestamp: Date.now(),
    source: 'upload',
    file,
    name: file.name,
    mimeType: file.type || 'image/jpeg',
    size: file.size,
    width,
    height,
    order,
  }
}

/**
 * Safely revokes local blob object URLs to prevent browser memory leaks.
 */
export function revokePhotoUrl(photo: CapturedPhoto | null | undefined): void {
  if (!photo) return
  if (photo.url && photo.url.startsWith('blob:')) {
    URL.revokeObjectURL(photo.url)
  }
  if (photo.previewUrl && photo.previewUrl.startsWith('blob:') && photo.previewUrl !== photo.url) {
    URL.revokeObjectURL(photo.previewUrl)
  }
}
