import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'

const CAMERA_MESSAGES = {
  secureContext:
    'Live camera preview needs HTTPS or localhost. You can still upload a receipt image.',
  unsupported:
    'This browser does not support live camera preview. Please use Gallery or Upload instead.',
  denied:
    'Camera permission denied. Please allow camera access or upload an image.',
  generic:
    'Unable to open the camera right now. Please allow permission or upload an image instead.',
  preview:
    'Camera opened, but preview could not be displayed. Please try refreshing or use Upload.',
}

function UploadScreen({ previewUrl, onFileSelect, onStartScan, errorMessage }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const [cameraStatus, setCameraStatus] = useState('idle')
  const [cameraError, setCameraError] = useState('')
  const [facingMode, setFacingMode] = useState('environment')

  const stopCameraTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const stopCameraStream = () => {
    stopCameraTracks()

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
    }

    setCameraStatus('idle')
  }

  useEffect(() => {
    return () => {
      stopCameraStream()
    }
  }, [])

  useEffect(() => {
    if (cameraStatus !== 'live' || !streamRef.current || !videoRef.current) {
      return undefined
    }

    let cancelled = false

    const attachStreamToVideo = async () => {
      try {
        const videoElement = videoRef.current

        if (!videoElement || !streamRef.current) {
          return
        }

        videoElement.srcObject = streamRef.current

        await new Promise((resolve) => window.requestAnimationFrame(resolve))

        if (!cancelled) {
          await videoElement.play()
        }
      } catch (error) {
        if (!cancelled) {
          setCameraError(CAMERA_MESSAGES.preview)
        }
      }
    }

    attachStreamToVideo()

    return () => {
      cancelled = true
    }
  }, [cameraStatus, facingMode])

  const requestCameraStream = async (preferredFacingMode) => {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: preferredFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
    } catch (error) {
      return navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      })
    }
  }

  const startCameraPreview = async (nextFacingMode = facingMode) => {
    if (!window.isSecureContext) {
      setCameraError(CAMERA_MESSAGES.secureContext)
      return
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(CAMERA_MESSAGES.unsupported)
      return
    }

    try {
      setCameraStatus('starting')
      setCameraError('')
      stopCameraTracks()

      const mediaStream = await requestCameraStream(nextFacingMode)

      streamRef.current = mediaStream
      setFacingMode(nextFacingMode)
      setCameraStatus('live')
    } catch (error) {
      stopCameraStream()

      if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
        setCameraError(CAMERA_MESSAGES.denied)
        return
      }

      setCameraError(CAMERA_MESSAGES.generic)
    }
  }

  const handleSwitchCamera = () => {
    const nextFacingMode = facingMode === 'environment' ? 'user' : 'environment'
    startCameraPreview(nextFacingMode)
  }

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) {
      return
    }

    const videoElement = videoRef.current
    const canvasElement = canvasRef.current
    const width = videoElement.videoWidth || 1280
    const height = videoElement.videoHeight || 720

    canvasElement.width = width
    canvasElement.height = height

    const canvasContext = canvasElement.getContext('2d')

    if (!canvasContext) {
      setCameraError('Unable to capture the camera image. Please try again or upload a file instead.')
      return
    }

    canvasContext.drawImage(videoElement, 0, 0, width, height)

    const blob = await new Promise((resolve) => {
      canvasElement.toBlob(resolve, 'image/jpeg', 0.92)
    })

    if (!blob) {
      setCameraError('Unable to create a receipt snapshot. Please try again.')
      return
    }

    const capturedFile = new File([blob], `receipt-capture-${Date.now()}.jpg`, {
      type: 'image/jpeg',
    })

    onFileSelect(capturedFile)
    stopCameraStream()
  }

  const handleCameraButton = () => {
    if (cameraStatus === 'live') {
      handleCapture()
      return
    }

    startCameraPreview(facingMode)
  }

  const handlePickerSelect = (event) => {
    stopCameraStream()
    setCameraError('')
    onFileSelect(event)
  }

  const isCameraLive = cameraStatus === 'live'
  const cameraButtonLabel = isCameraLive ? 'Capture' : 'Camera'
  const videoClassName =
    facingMode === 'user' ? 'preview-video preview-video-mirrored' : 'preview-video'

  return (
    <section className="screen-root upload-screen">
      <Header
        title="Capture Receipt"
        leftIcon="☰"
        rightIcon="⚡"
        leftLabel="Menu"
        rightLabel="Quick actions"
      />

      <div className="scanner-panel">
        <div className="preview-frame">
          {isCameraLive ? (
            <video
              ref={videoRef}
              className={videoClassName}
              autoPlay
              playsInline
              muted
            />
          ) : previewUrl ? (
            <img src={previewUrl} alt="Receipt preview" className="preview-image" />
          ) : (
            <div className="preview-placeholder">
              <div className="preview-placeholder-icon">📷</div>
              <div className="preview-placeholder-copy">
                <strong>Ready to Scan</strong>
                <span>Align your receipt inside the glowing frame</span>
              </div>
            </div>
          )}

          <div className="scan-overlay" aria-hidden="true">
            <div className="scan-corner top-left"></div>
            <div className="scan-corner top-right"></div>
            <div className="scan-corner bottom-left"></div>
            <div className="scan-corner bottom-right"></div>
          </div>

          {cameraStatus === 'starting' ? (
            <div className="preview-status-chip">Opening camera...</div>
          ) : null}

          {isCameraLive ? (
            <div className="camera-toolbar">
              <button type="button" className="camera-tool-button" onClick={handleSwitchCamera}>
                🔄 Switch
              </button>
              <button
                type="button"
                className="camera-tool-button secondary-tool"
                onClick={stopCameraStream}
                aria-label="Close camera"
              >
                ✕
              </button>
            </div>
          ) : null}
        </div>

        {errorMessage || cameraError ? (
          <div className="upload-feedback">
            {errorMessage ? <p className="upload-banner upload-banner-error">{errorMessage}</p> : null}
            {cameraError ? <p className="upload-banner upload-banner-note">{cameraError}</p> : null}
          </div>
        ) : null}

        <div className="upload-actions">
          <div className="action-bar">
            <label className="action-pill" htmlFor="gallery-input">
              <span className="action-icon">🖼️</span>
              <span>Gallery</span>
            </label>

            <button
              type="button"
              className="capture-button"
              onClick={handleCameraButton}
              disabled={cameraStatus === 'starting'}
              aria-label={isCameraLive ? 'Capture receipt from live camera' : 'Open camera preview'}
            >
              <span className="capture-button-core"></span>
              <span className="capture-button-text">{cameraButtonLabel}</span>
            </button>

            <label className="action-pill" htmlFor="upload-input">
              <span className="action-icon">⤴</span>
              <span>Upload</span>
            </label>
          </div>

          <button
            type="button"
            className="primary-button scan-button"
            onClick={onStartScan}
            disabled={!previewUrl}
          >
            Scan Receipt
          </button>
        </div>
      </div>

      <input
        id="gallery-input"
        className="hidden-input"
        type="file"
        accept="image/*"
        onChange={handlePickerSelect}
      />
      <input
        id="upload-input"
        className="hidden-input"
        type="file"
        accept="image/*"
        onChange={handlePickerSelect}
      />

      <canvas ref={canvasRef} className="hidden-canvas" aria-hidden="true"></canvas>
    </section>
  )
}

export default UploadScreen
