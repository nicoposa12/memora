let landmarkerInstance: any = null;
let initPromise: Promise<any> | null = null;
let isLogFilterInstalled = false;

/**
 * MediaPipe's WASM runtime writes routine status lines (e.g. "INFO: Created TensorFlow
 * Lite XNNPACK delegate for CPU.") to stderr, which surfaces as console.error and trips
 * the Next.js dev error overlay. Drop only those informational lines; real errors pass through.
 */
function installMediaPipeLogFilter() {
  if (isLogFilterInstalled) return;
  isLogFilterInstalled = true;

  const originalError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    const first = args[0];
    if (typeof first === 'string' && /^(INFO|VERBOSE):\s/.test(first)) {
      return;
    }
    originalError(...args);
  };
}

/**
 * Initializes and returns a singleton instance of MediaPipe FaceLandmarker.
 * Uses dynamic import so it is never evaluated during SSR and loads on-demand on the client.
 */
export async function getFaceLandmarker(): Promise<any> {
  if (typeof window === 'undefined') return null;
  if (landmarkerInstance) return landmarkerInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      installMediaPipeLogFilter();

      // Dynamic import prevents Webpack SSR bundling issues
      const { FilesetResolver, FaceLandmarker } = await import('@mediapipe/tasks-vision');

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm'
      );

      try {
        landmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU',
          },
          outputFaceBlendshapes: false,
          runningMode: 'VIDEO',
          numFaces: 2,
        });
        return landmarkerInstance;
      } catch (gpuError) {
        console.warn('MediaPipe GPU initialization failed, attempting CPU fallback:', gpuError);
        landmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'CPU',
          },
          outputFaceBlendshapes: false,
          runningMode: 'VIDEO',
          numFaces: 2,
        });
        return landmarkerInstance;
      }
    } catch (err) {
      console.error('Failed to load MediaPipe FaceLandmarker:', err);
      initPromise = null;
      return null;
    }
  })();

  return initPromise;
}
