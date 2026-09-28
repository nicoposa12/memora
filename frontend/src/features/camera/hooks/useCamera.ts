'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export type CameraStatus = 
  | 'idle' 
  | 'requesting' 
  | 'granted' 
  | 'denied' 
  | 'unavailable' 
  | 'error';

export interface UseCameraOptions {
  preferredFacingMode?: 'user' | 'environment';
}

export function useCamera(options: UseCameraOptions = {}) {
  const [status, setStatus] = useState<CameraStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    options.preferredFacingMode || 'user'
  );
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check if multiple video devices exist (e.g. front & back)
  useEffect(() => {
    async function checkDevices() {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter((d) => d.kind === 'videoinput');
          setHasMultipleCameras(videoInputs.length > 1);
        } catch {
          // Ignore failure during device check
        }
      }
    }
    checkDevices();
  }, []);

  // Stop active camera stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Start or switch camera stream
  const startCamera = useCallback(
    async (requestedFacing?: 'user' | 'environment') => {
      const mode = requestedFacing || facingMode;
      stopStream();
      setStatus('requesting');
      setErrorMessage(null);

      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setStatus('unavailable');
        setErrorMessage('Camera access is not supported by this browser. Please try Chrome or Safari.');
        return;
      }

      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        setStatus('granted');
        setFacingMode(mode);
      } catch (err: any) {
        stopStream();
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setStatus('denied');
          setErrorMessage('Camera access was denied. Please allow camera permissions in your browser settings to take photos.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setStatus('unavailable');
          setErrorMessage("We couldn't detect a camera on your device.");
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setStatus('error');
          setErrorMessage('Your camera is currently in use by another application.');
        } else {
          setStatus('error');
          setErrorMessage(err.message || 'Unable to access camera.');
        }
      }
    },
    [facingMode, stopStream]
  );

  // Toggle between front and rear cameras
  const toggleFacingMode = useCallback(() => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    startCamera(nextMode);
  }, [facingMode, startCamera]);

  // Capture frame from video to DataURL matching the standard photobooth framing (4:3)
  const captureFrame = useCallback((targetAspectRatio: number = 4 / 3): string | null => {
    if (!videoRef.current || status !== 'granted') return null;

    const video = videoRef.current;
    const vWidth = video.videoWidth || 1280;
    const vHeight = video.videoHeight || 720;
    const videoRatio = vWidth / vHeight;

    // Calculate source crop rectangle matching CSS object-cover in the viewfinder
    let sWidth = vWidth;
    let sHeight = vHeight;
    let sx = 0;
    let sy = 0;

    if (videoRatio > targetAspectRatio) {
      // Video is wider than viewfinder (e.g. 16:9 webcam stream)
      // Crop horizontal sides so only the centered region matching targetAspectRatio is captured
      sWidth = vHeight * targetAspectRatio;
      sx = (vWidth - sWidth) / 2;
    } else {
      // Video is taller than viewfinder
      sHeight = vWidth / targetAspectRatio;
      sy = (vHeight - sHeight) / 2;
    }

    // High resolution standard output canvas (1600 x 1200 for 4:3)
    const outputWidth = 1600;
    const outputHeight = Math.round(outputWidth / targetAspectRatio);

    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Flip horizontally if front camera for natural selfie mirror effect matching viewfinder
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, outputWidth, outputHeight);
    return canvas.toDataURL('image/jpeg', 0.95);
  }, [facingMode, status]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return {
    videoRef,
    status,
    errorMessage,
    facingMode,
    hasMultipleCameras,
    startCamera,
    stopStream,
    toggleFacingMode,
    captureFrame,
  };
}
