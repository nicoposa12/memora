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
 * Loads the standalone MediaPipe Vision bundle into the browser window.
 * Avoids Turbopack/Webpack dynamic import resolution errors during production build.
 */
function loadVisionScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve(null);
    const win = window as any;
    if (win.Vision) {
      return resolve(win.Vision);
    }

    const script = document.createElement('script');
    script.src = '/vendor/mediapipe/vision_bundle.js';
    script.async = true;

    script.onload = () => {
      if (win.Vision) {
        resolve(win.Vision);
      } else {
        loadCdnFallback().then(resolve).catch(reject);
      }
    };

    script.onerror = () => {
      loadCdnFallback().then(resolve).catch(reject);
    };

    document.head.appendChild(script);
  });
}

function loadCdnFallback(): Promise<any> {
  return new Promise((resolve, reject) => {
    const win = window as any;
    const cdnScript = document.createElement('script');
    cdnScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.js';
    cdnScript.async = true;
    cdnScript.onload = () => {
      if (win.Vision) resolve(win.Vision);
      else reject(new Error('MediaPipe Vision bundle failed to load from CDN'));
    };
    cdnScript.onerror = () => reject(new Error('Failed to load MediaPipe Vision from CDN'));
    document.head.appendChild(cdnScript);
  });
}

/**
 * Initializes and returns a singleton instance of MediaPipe FaceLandmarker.
 * Runs 100% client-side with zero Turbopack/Webpack bundling conflicts.
 */
export async function getFaceLandmarker(): Promise<any> {
  if (typeof window === 'undefined') return null;
  if (landmarkerInstance) return landmarkerInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      installMediaPipeLogFilter();

      const Vision = await loadVisionScript();
      if (!Vision) return null;

      const { FilesetResolver, FaceLandmarker } = Vision;

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
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
