import { useEffect, useRef, useState, useCallback } from 'react';
import { getFaceLandmarker } from '../utils/faceLandmarkerService';
import { renderARPropOnCanvas, ARPropType, DetectedFaceAnchors } from '../utils/arProps';

interface SmoothedFaceState {
  eyeCenterX: number;
  eyeCenterY: number;
  eyeSpan: number;
  rollAngle: number;
  foreheadX: number;
  foreheadY: number;
  mouthX: number;
  mouthY: number;
}

export function useARFaceTracker(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isActive: boolean
) {
  const [activeProp, setActiveProp] = useState<ARPropType>('none');
  const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
  const arCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const smoothedFacesRef = useRef<SmoothedFaceState[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const activePropRef = useRef<ARPropType>(activeProp);
  activePropRef.current = activeProp;

  // Pre-load MediaPipe FaceLandmarker model when camera becomes active or prop is selected
  useEffect(() => {
    if (!isActive) return;

    let isMounted = true;
    setIsModelLoading(true);

    getFaceLandmarker()
      .then((landmarker) => {
        if (isMounted) {
          setIsModelLoading(false);
        }
      })
      .catch((err) => {
        console.warn('FaceLandmarker preload warning:', err);
        if (isMounted) setIsModelLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isActive]);

  // Main 60 FPS detection and overlay rendering loop
  useEffect(() => {
    if (!isActive || activeProp === 'none') {
      // Clear canvas if prop turned off
      if (arCanvasRef.current) {
        const ctx = arCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, arCanvasRef.current.width, arCanvasRef.current.height);
        }
      }
      smoothedFacesRef.current = [];
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    let isRunning = true;

    const processFrame = async () => {
      if (!isRunning) return;

      const video = videoRef.current;
      const canvas = arCanvasRef.current;

      if (
        video &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        canvas &&
        activePropRef.current !== 'none'
      ) {
        // Match canvas coordinate size to video aspect ratio
        if (canvas.width !== 640 || canvas.height !== 480) {
          canvas.width = 640;
          canvas.height = 480;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          try {
            const landmarker = await getFaceLandmarker();
            if (landmarker && isRunning) {
              const videoWidth = video.videoWidth;
              const videoHeight = video.videoHeight;
              const targetRatio = 4 / 3;
              const currentRatio = videoWidth / videoHeight;

              let cropW = videoWidth;
              let cropH = videoHeight;
              if (currentRatio > targetRatio) {
                cropW = cropH * targetRatio;
              } else {
                cropH = cropW / targetRatio;
              }

              const cropX = (videoWidth - cropW) / 2;
              const cropY = (videoHeight - cropH) / 2;

              const result = landmarker.detectForVideo(video, performance.now());

              if (result && result.faceLandmarks && result.faceLandmarks.length > 0) {
                const currentRawFaces: SmoothedFaceState[] = [];

                for (const landmarks of result.faceLandmarks) {
                  // Key landmarks for alignment
                  const leftOuter = landmarks[33] || landmarks[130];
                  const rightOuter = landmarks[263] || landmarks[359];
                  const noseBridge = landmarks[168] || landmarks[6];
                  const forehead = landmarks[10] || landmarks[151];
                  const mouth = landmarks[164] || landmarks[0];

                  const mapPoint = (p: { x: number; y: number }) => {
                    const rawX = p.x * videoWidth;
                    const rawY = p.y * videoHeight;
                    return {
                      x: ((rawX - cropX) / cropW) * canvas.width,
                      y: ((rawY - cropY) / cropH) * canvas.height,
                    };
                  };

                  const leftP = mapPoint(leftOuter);
                  const rightP = mapPoint(rightOuter);
                  const noseP = mapPoint(noseBridge);
                  const foreheadP = mapPoint(forehead);
                  const mouthP = mapPoint(mouth);

                  const dx = rightP.x - leftP.x;
                  const dy = rightP.y - leftP.y;
                  const eyeSpan = Math.sqrt(dx * dx + dy * dy);
                  const rollAngle = Math.atan2(dy, dx);

                  currentRawFaces.push({
                    eyeCenterX: noseP.x,
                    eyeCenterY: noseP.y,
                    eyeSpan,
                    rollAngle,
                    foreheadX: foreheadP.x,
                    foreheadY: foreheadP.y,
                    mouthX: mouthP.x,
                    mouthY: mouthP.y,
                  });
                }

                // Exponential moving average smoothing (alpha = 0.5 for responsive yet buttery movement)
                const smoothedFaces: SmoothedFaceState[] = [];
                for (let i = 0; i < currentRawFaces.length; i++) {
                  const target = currentRawFaces[i];
                  const prev = smoothedFacesRef.current[i];

                  if (prev) {
                    const alpha = 0.52;
                    smoothedFaces.push({
                      eyeCenterX: prev.eyeCenterX + (target.eyeCenterX - prev.eyeCenterX) * alpha,
                      eyeCenterY: prev.eyeCenterY + (target.eyeCenterY - prev.eyeCenterY) * alpha,
                      eyeSpan: prev.eyeSpan + (target.eyeSpan - prev.eyeSpan) * alpha,
                      rollAngle: prev.rollAngle + (target.rollAngle - prev.rollAngle) * alpha,
                      foreheadX: prev.foreheadX + (target.foreheadX - prev.foreheadX) * alpha,
                      foreheadY: prev.foreheadY + (target.foreheadY - prev.foreheadY) * alpha,
                      mouthX: prev.mouthX + (target.mouthX - prev.mouthX) * alpha,
                      mouthY: prev.mouthY + (target.mouthY - prev.mouthY) * alpha,
                    });
                  } else {
                    smoothedFaces.push(target);
                  }
                }

                smoothedFacesRef.current = smoothedFaces;

                // Render active prop onto all detected faces
                for (const face of smoothedFaces) {
                  renderARPropOnCanvas(ctx, activePropRef.current, face);
                }
              } else {
                smoothedFacesRef.current = [];
              }
            }
          } catch (loopErr) {
            // Non-fatal, continue next frame
          }
        }
      }

      if (isRunning) {
        animFrameIdRef.current = requestAnimationFrame(processFrame);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(processFrame);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isActive, activeProp, videoRef]);

  /**
   * Composites the active AR prop onto the captured snapshot canvas.
   * Call this from snapFrame() right after drawing the camera video image!
   */
  const drawARPropsOnSnapshot = useCallback(
    (targetCtx: CanvasRenderingContext2D, targetWidth: number, targetHeight: number) => {
      if (activePropRef.current === 'none' || smoothedFacesRef.current.length === 0) return;

      const overlayCanvas = arCanvasRef.current;
      if (!overlayCanvas || overlayCanvas.width === 0 || overlayCanvas.height === 0) return;

      const scaleX = targetWidth / overlayCanvas.width;
      const scaleY = targetHeight / overlayCanvas.height;

      for (const face of smoothedFacesRef.current) {
        const scaledFace: DetectedFaceAnchors = {
          eyeCenterX: face.eyeCenterX * scaleX,
          eyeCenterY: face.eyeCenterY * scaleY,
          eyeSpan: face.eyeSpan * scaleX,
          rollAngle: face.rollAngle,
          foreheadX: face.foreheadX * scaleX,
          foreheadY: face.foreheadY * scaleY,
          mouthX: face.mouthX * scaleX,
          mouthY: face.mouthY * scaleY,
        };

        renderARPropOnCanvas(targetCtx, activePropRef.current, scaledFace);
      }
    },
    []
  );

  return {
    activeProp,
    setActiveProp,
    isModelLoading,
    arCanvasRef,
    drawARPropsOnSnapshot,
  };
}
