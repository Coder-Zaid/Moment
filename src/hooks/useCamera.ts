import { useState, useEffect, useRef, useCallback } from 'react'
import type { CameraState, CapturedPhoto } from '../types/photobooth'

interface UseCameraOptions {
  facingMode?: 'user' | 'environment'
  mirrored?: boolean
}

export function useCamera(options: UseCameraOptions = {}) {
  const { facingMode = 'user', mirrored = true } = options
  const [cameraState, setCameraState] = useState<CameraState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [activeFacingMode, setActiveFacingMode] = useState<'user' | 'environment'>(facingMode)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const isMountedRef = useRef<boolean>(true)

  // Cleanly stops all active media stream tracks
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop()
        } catch {
          // Track stop handled safely
        }
      })
      streamRef.current = null
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  // Starts the camera stream
  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (isMountedRef.current) {
        setCameraState('unavailable')
        setErrorMessage('Camera access is not supported by this browser.')
      }
      return
    }

    stopStream()
    if (!isMountedRef.current) return

    setCameraState('requesting_permission')
    setErrorMessage(null)

    try {
      // 1. Try preferred high-definition resolution
      let mediaStream: MediaStream
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: activeFacingMode,
            width: { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 },
          },
          audio: false,
        })
      } catch {
        // 2. Fallback to basic video capability
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: activeFacingMode },
          audio: false,
        })
      }

      // If component unmounted while waiting for user permission, terminate tracks immediately!
      if (!isMountedRef.current) {
        mediaStream.getTracks().forEach((track) => track.stop())
        return
      }

      streamRef.current = mediaStream
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          if (!isMountedRef.current) return
          videoRef.current?.play().catch(() => {})
          setCameraState('ready')
        }
      } else {
        setCameraState('ready')
      }
    } catch (err: unknown) {
      if (!isMountedRef.current) return
      const error = err as { name?: string; message?: string }
      if (
        error.name === 'NotAllowedError' ||
        error.name === 'PermissionDeniedError' ||
        error.name === 'SecurityError'
      ) {
        setCameraState('permission_denied')
        setErrorMessage(
          'Camera permission was denied. Please allow camera access in your browser settings to take photos.'
        )
      } else if (
        error.name === 'NotFoundError' ||
        error.name === 'DevicesNotFoundError' ||
        error.name === 'OverconstrainedError'
      ) {
        setCameraState('unavailable')
        setErrorMessage('No camera device was detected on this kiosk hardware.')
      } else {
        setCameraState('error')
        setErrorMessage(
          error.message || 'An unexpected error occurred while accessing the camera.'
        )
      }
    }
  }, [activeFacingMode, stopStream])

  // Toggle between front/user and rear camera
  const toggleFacingMode = useCallback(() => {
    setActiveFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }, [])

  // Captures the current video frame into a high-resolution CapturedPhoto
  const captureFrame = useCallback(
    async (order: number = 0): Promise<CapturedPhoto> => {
      const video = videoRef.current
      if (!video) {
        throw new Error('Video element is not available')
      }

      const width = video.videoWidth || 1280
      const height = video.videoHeight || 720

      // Offscreen canvas matching native video dimensions
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Could not create canvas 2D rendering context')
      }

      // If mirrored preview is enabled, mirror the captured frame so the photo matches the viewfinder!
      if (mirrored && activeFacingMode === 'user') {
        ctx.translate(width, 0)
        ctx.scale(-1, 1)
      }

      ctx.drawImage(video, 0, 0, width, height)

      // Convert to blob and object URL
      return new Promise<CapturedPhoto>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas frame capture produced empty blob'))
              return
            }

            const previewUrl = URL.createObjectURL(blob)
            const id = `camera-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

            const photo: CapturedPhoto = {
              id,
              url: previewUrl,
              previewUrl,
              timestamp: Date.now(),
              capturedAt: Date.now(),
              source: 'camera',
              width,
              height,
              size: blob.size,
              mimeType: 'image/jpeg',
              order,
            }

            resolve(photo)
          },
          'image/jpeg',
          0.96
        )
      })
    },
    [mirrored, activeFacingMode]
  )

  // Start stream on mount, stop tracks on unmount or session reset
  useEffect(() => {
    isMountedRef.current = true
    const initTimer = setTimeout(() => {
      if (isMountedRef.current) {
        startCamera()
      }
    }, 0)

    const handleForceStop = () => {
      stopStream()
    }
    window.addEventListener('moment:cleanup-camera', handleForceStop)

    return () => {
      isMountedRef.current = false
      clearTimeout(initTimer)
      window.removeEventListener('moment:cleanup-camera', handleForceStop)
      stopStream()
    }
  }, [startCamera, stopStream])

  return {
    videoRef,
    cameraState,
    errorMessage,
    stream,
    activeFacingMode,
    startCamera,
    stopStream,
    toggleFacingMode,
    captureFrame,
  }
}
