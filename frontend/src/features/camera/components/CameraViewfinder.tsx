'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, AlertCircle, Sparkles, Grid, Eye, Timer, Hand, Sliders } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { Button } from '@/components/ui/Button';
import { FilterType, FILTER_STYLES } from '@/features/editor/components/PhotoEditor';

export interface CameraViewfinderProps {
  countdownDuration?: number; // 3, 5, 10
  requiredShots?: number; // 1, 2, 3, 4
  onCaptureComplete: (capturedFrames: string[], selectedFilter: FilterType) => void;
  eventName: string;
  initialFilter?: FilterType;
}

export function CameraViewfinder({
  countdownDuration = 3,
  requiredShots = 4,
  onCaptureComplete,
  eventName,
  initialFilter = 'normal',
}: CameraViewfinderProps) {
  const {
    videoRef,
    status,
    errorMessage,
    facingMode,
    startCamera,
    toggleFacingMode,
    captureFrame,
  } = useCamera({ preferredFacingMode: 'user' });

  // Interactive user-selectable pre-capture filter
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(initialFilter || 'normal');

  // Interactive user-selectable timer duration (3s, 5s, 10s)
  const [countdownSeconds, setCountdownSeconds] = useState<number>(countdownDuration || 3);
  // Interactive user-selectable hands-free mode (true: auto continuous countdown sequence, false: manual tap per shot)
  const [isHandsFree, setIsHandsFree] = useState<boolean>(true);

  // Sync if initialFilter prop changes
  useEffect(() => {
    if (initialFilter) {
      setSelectedFilter(initialFilter);
    }
  }, [initialFilter]);

  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [currentCountdown, setCurrentCountdown] = useState<number>(countdownSeconds);
  const [activeShotNumber, setActiveShotNumber] = useState<number>(1);
  const [capturedShots, setCapturedShots] = useState<string[]>([]);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [shotTarget, setShotTarget] = useState<number>(requiredShots);
  const [showGrid, setShowGrid] = useState<boolean>(false);

  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-request camera on mount
  useEffect(() => {
    startCamera('user');
  }, [startCamera]);

  // Sync shot target with requiredShots prop (e.g. 3 for Free Trial, 4 for Event Pass)
  useEffect(() => {
    setShotTarget(requiredShots);
  }, [requiredShots]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // Cancel countdown handler
  const cancelCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setIsCountingDown(false);
    setCurrentCountdown(countdownSeconds);
  };

  // Reset captured shots
  const handleResetShots = () => {
    cancelCountdown();
    setCapturedShots([]);
    setActiveShotNumber(1);
  };

  // Start or trigger next shot
  const handleShutterClick = () => {
    if (isCountingDown || status !== 'granted') return;

    if (capturedShots.length >= shotTarget) {
      // If already filled target, complete
      onCaptureComplete(capturedShots, selectedFilter);
      return;
    }

    const nextShotIndex = capturedShots.length + 1;
    setActiveShotNumber(nextShotIndex);
    runCountdownForShot(nextShotIndex, capturedShots);
  };

  // Spacebar to trigger shutter, Escape to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isCountingDown && status === 'granted') {
        e.preventDefault();
        handleShutterClick();
      }
      if (e.code === 'Escape' && isCountingDown) {
        e.preventDefault();
        cancelCountdown();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCountingDown, status, capturedShots, shotTarget, countdownSeconds, isHandsFree]);

  const runCountdownForShot = (shotNumber: number, accumulated: string[]) => {
    setActiveShotNumber(shotNumber);

    if (countdownSeconds === 0) {
      takeSnapshot(shotNumber, accumulated);
      return;
    }

    setIsCountingDown(true);
    setCurrentCountdown(countdownSeconds);

    let count = countdownSeconds;
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCurrentCountdown(count);
      } else {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        setIsCountingDown(false);
        takeSnapshot(shotNumber, accumulated);
      }
    }, 1000);
  };

  const takeSnapshot = (shotNumber: number, accumulated: string[]) => {
    // Trigger realistic studio flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 250);

    const frame = captureFrame();
    if (frame) {
      const nextAccumulated = [...accumulated, frame];
      setCapturedShots(nextAccumulated);

      if (shotNumber < shotTarget) {
        if (isHandsFree) {
          // Hands-Free Mode: Automatically start countdown for next pose after 1200ms grace period
          setTimeout(() => {
            runCountdownForShot(shotNumber + 1, nextAccumulated);
          }, 1200);
        } else {
          // Manual Mode: Pause and wait for user to tap the shutter for next pose
          setActiveShotNumber(shotNumber + 1);
        }
      } else {
        // All shots taken
        setTimeout(() => {
          onCaptureComplete(nextAccumulated, selectedFilter);
        }, 450);
      }
    }
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center justify-between py-2 sm:py-4 px-2 sm:px-4 select-none">
      {/* Main Viewfinder Frame: Standard Photobooth Mirror (Classic 4:3 Aspect Ratio) */}
      <div className="relative w-full aspect-[4/3] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#07080a] border border-white/10 ring-1 ring-white/5 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(216,184,106,0.06)] my-auto flex items-center justify-center">
        {/* Live Video Feed with Real-Time Applied Filter */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          style={{ filter: FILTER_STYLES[selectedFilter].canvasFilter }}
          className={`w-full h-full object-cover transition-[filter] duration-300 ${facingMode === 'user' ? '-scale-x-100' : ''}`}
        />

        {/* Soft Vignette Overlay for Studio Look */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.35)_100%)] z-10" />

        {/* Top Viewfinder Controls: Grid, Timer Duration Selector & Hands-Free Mode */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-auto gap-1.5">
          {/* Subtle Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shrink-0 ${
              showGrid 
                ? 'bg-[#d8b86a]/25 text-[#d8b86a] border border-[#d8b86a]/40' 
                : 'bg-black/40 border border-white/10 text-white/50 hover:text-white'
            }`}
            title="Toggle Composition Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Time Countdown Selector (3s, 5s, 10s) */}
          <div className="flex items-center p-0.5 rounded-full bg-black/45 backdrop-blur-md border border-white/10 text-[10px] font-mono shadow-sm">
            <Timer className="w-3 h-3 text-[#d8b86a] ml-2 mr-1 shrink-0" />
            {[3, 5, 10].map((sec) => (
              <button
                key={sec}
                onClick={() => setCountdownSeconds(sec)}
                disabled={isCountingDown}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  countdownSeconds === sec
                    ? 'bg-[#d8b86a] text-black font-bold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
                title={`Set countdown timer to ${sec} seconds`}
              >
                {sec}s
              </button>
            ))}
          </div>

          {/* Hands-Free Mode Toggle */}
          <button
            onClick={() => setIsHandsFree(!isHandsFree)}
            disabled={isCountingDown}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md transition-all cursor-pointer text-[10px] font-mono border shrink-0 ${
              isHandsFree
                ? 'bg-[#d8b86a]/20 border-[#d8b86a]/50 text-[#d8b86a] font-semibold shadow-[0_0_12px_rgba(216,184,106,0.15)]'
                : 'bg-black/40 border-white/10 text-white/50 hover:text-white'
            }`}
            title={isHandsFree ? 'Hands-Free: 1 click automatically captures all poses with countdown' : 'Manual: Tap shutter for each pose'}
          >
            <Hand className="w-3 h-3" />
            <span>{isHandsFree ? 'Hands-Free' : 'Manual'}</span>
          </button>
        </div>

        {/* Subtle Sequence Indicator Bar */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 pointer-events-none">
          {Array.from({ length: shotTarget }).map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i < capturedShots.length
                  ? 'bg-[#d8b86a] shadow-[0_0_8px_#d8b86a] scale-110'
                  : i === capturedShots.length && isCountingDown
                  ? 'bg-[#d8b86a]/80 animate-ping'
                  : 'bg-white/30'
              }`}
            />
          ))}
          <span className="text-[9px] font-mono text-white/80 ml-1 tracking-wider">
            {capturedShots.length > 0 ? `${capturedShots.length}/${shotTarget}` : `${shotTarget}x`}
          </span>
        </div>

        {/* Precision Leica-Style Corner Hairlines */}
        <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-[#d8b86a]/50 pointer-events-none z-10" />
        <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-[#d8b86a]/50 pointer-events-none z-10" />
        <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-[#d8b86a]/50 pointer-events-none z-10" />
        <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-[#d8b86a]/50 pointer-events-none z-10" />

        {/* Optional Ultra-Delicate Grid (Hairlines Only, No Yellow Dot) */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="w-full h-full grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/[0.07]" />
              <div className="border-r border-b border-white/[0.07]" />
              <div className="border-b border-white/[0.07]" />
              <div className="border-r border-b border-white/[0.07]" />
              <div className="border-r border-b border-white/[0.07]" />
              <div className="border-b border-white/[0.07]" />
              <div className="border-r border-white/[0.07]" />
              <div className="border-r border-white/[0.07]" />
              <div />
            </div>
          </div>
        )}

        {/* Studio Flash Animation */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white z-50 camera-flash" />
        )}

        {/* Camera Permission & Requesting State */}
        {status === 'requesting' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-30">
            <div className="w-12 h-12 rounded-2xl bg-[#d8b86a]/15 border border-[#d8b86a]/30 flex items-center justify-center animate-pulse">
              <Camera className="w-6 h-6 text-[#d8b86a]" />
            </div>
            <h3 className="text-sm font-editorial text-white tracking-wide">Initializing Studio Camera</h3>
            <p className="text-xs text-slate-400 max-w-xs font-mono">Please tap &ldquo;Allow&rdquo; on the browser prompt to start taking photos.</p>
          </div>
        )}

        {(status === 'denied' || status === 'unavailable' || status === 'error') && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-30">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-editorial text-white">Camera Access Required</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs font-mono">{errorMessage}</p>
            <Button
              variant="glow"
              size="sm"
              onClick={() => startCamera(facingMode)}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Minimalist Editorial Countdown Display */}
        {isCountingDown && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center z-40 animate-in fade-in">
            {/* Status indicator pill */}
            <div className="mb-3 px-3 py-1 rounded-full bg-black/60 border border-[#d8b86a]/30 text-[11px] font-mono text-[#d8b86a] flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3 h-3" />
              <span>
                Pose {activeShotNumber} of {shotTarget}
                {isHandsFree ? ' • Hands-Free' : ' • Manual'}
              </span>
            </div>

            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Circular Progress Hairline */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-white/10"
                  strokeWidth="2"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-[#d8b86a] transition-all duration-1000 ease-linear"
                  strokeWidth="3"
                  strokeDasharray="276.46"
                  strokeDashoffset={276.46 * (1 - currentCountdown / countdownSeconds)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute font-editorial text-6xl text-white drop-shadow-[0_0_25px_rgba(216,184,106,0.8)] font-bold">
                {currentCountdown}
              </div>
            </div>

            {/* Cancel countdown button */}
            <button
              onClick={cancelCountdown}
              className="mt-4 px-3.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-mono uppercase tracking-wider text-white/80 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Live captured frame strip thumbnail in bottom corner */}
        {capturedShots.length > 0 && (
          <div className="absolute bottom-3.5 left-3.5 flex items-end gap-1.5 z-20 animate-in fade-in">
            {capturedShots.map((shot, idx) => (
              <div
                key={idx}
                className="w-9 h-12 rounded-lg overflow-hidden border border-[#d8b86a]/60 shadow-2xl bg-black"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={shot} 
                  alt={`shot ${idx + 1}`} 
                  style={{ filter: FILTER_STYLES[selectedFilter].canvasFilter }}
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
            {!isCountingDown && (
              <button
                onClick={handleResetShots}
                className="w-6 h-6 rounded-full bg-black/60 border border-white/20 text-white/60 hover:text-white flex items-center justify-center text-[10px] cursor-pointer hover:bg-black/80"
                title="Restart poses"
              >
                ↺
              </button>
            )}
          </div>
        )}

        {/* Live Active Filter Indicator Badge (Bottom Right) */}
        <div className="absolute bottom-3.5 right-3.5 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-[9px] font-mono tracking-wider uppercase text-white/90 shadow-md">
          <span 
            className="w-1.5 h-1.5 rounded-full" 
            style={{ backgroundColor: FILTER_STYLES[selectedFilter].dotColor }} 
          />
          <span className="text-[#d8b86a] font-semibold">{FILTER_STYLES[selectedFilter].name}</span>
        </div>
      </div>

      {/* Pre-Capture Filter Selector Carousel: Choose Filter First */}
      <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center mt-3 mb-1 z-20">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full px-2 py-1 scrollbar-none">
          {(Object.keys(FILTER_STYLES) as FilterType[]).map((filterKey) => {
            const filter = FILTER_STYLES[filterKey];
            const isSelected = selectedFilter === filterKey;
            return (
              <button
                key={filterKey}
                onClick={() => setSelectedFilter(filterKey)}
                disabled={isCountingDown}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-mono transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                  isCountingDown ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  isSelected
                    ? 'bg-[#d8b86a] text-[#07080b] border-[#f5eccb] font-bold shadow-[0_0_16px_rgba(216,184,106,0.35)] scale-[1.03]'
                    : 'bg-black/40 backdrop-blur-md text-white/70 border-white/10 hover:border-white/25 hover:text-white hover:bg-white/[0.06]'
                }`}
                title={`Select ${filter.name} (${filter.tag})`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-transform ${isSelected ? 'scale-110 shadow-sm' : ''}`}
                  style={{ backgroundColor: filter.dotColor }}
                />
                <span>{filter.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Shutter & Controls: Leica-Inspired Tactile Luxury */}
      <div className="w-full flex flex-col items-center justify-center pt-4 pb-2 z-20">
        {/* Helper badge when in manual mode between shots */}
        {!isHandsFree && capturedShots.length > 0 && capturedShots.length < shotTarget && !isCountingDown && (
          <div className="mb-2.5 px-3 py-1 rounded-full bg-[#d8b86a]/15 border border-[#d8b86a]/30 text-[10px] font-mono text-[#d8b86a] flex items-center gap-1.5 animate-pulse">
            <span>Pose {capturedShots.length} of {shotTarget} saved • Tap shutter when ready for Pose {capturedShots.length + 1}</span>
          </div>
        )}

        <div className="w-full flex items-center justify-between max-w-[320px] px-2">
          {/* Flip Lens Button */}
          <button
            onClick={toggleFacingMode}
            disabled={status !== 'granted' || isCountingDown}
            className="w-11 h-11 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#d8b86a]/40 text-slate-300 hover:text-white transition-all flex items-center justify-center active:scale-95 disabled:opacity-30 cursor-pointer shadow-sm"
            title="Switch Camera Lens"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Luxury Shutter Button */}
          <button
            onClick={handleShutterClick}
            disabled={status !== 'granted' || isCountingDown}
            className="relative w-20 h-20 rounded-full border-2 border-[#d8b86a]/40 hover:border-[#d8b86a] p-1.5 flex items-center justify-center transition-all duration-300 active:scale-90 disabled:opacity-30 cursor-pointer group shadow-[0_0_30px_rgba(216,184,106,0.15)] hover:shadow-[0_0_45px_rgba(216,184,106,0.35)]"
            title={isHandsFree ? 'Start Hands-Free Sequence' : `Take Pose ${capturedShots.length + 1}`}
          >
            {/* Outer tactile ring */}
            <div className={`w-full h-full rounded-full p-[3px] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
              isHandsFree 
                ? 'bg-gradient-to-tr from-[#fdfbf7] via-[#f5eccb] to-[#d8b86a]' 
                : 'bg-gradient-to-tr from-white/90 via-white/50 to-[#d8b86a]/90'
            }`}>
              <div className="w-full h-full rounded-full bg-[#07080b] group-hover:bg-[#0e1118] transition-colors flex flex-col items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#fdfbf7] to-[#d8b86a] flex items-center justify-center text-[#07080b] shadow-inner">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
            </div>
          </button>

          {/* Strip Sequence Toggle (Strip vs Single) */}
          <button
            onClick={() => {
              if (capturedShots.length > 0) handleResetShots();
              setShotTarget(prev => prev === 1 ? requiredShots : 1);
            }}
            disabled={isCountingDown}
            className="w-11 h-11 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#d8b86a]/40 text-slate-300 hover:text-white transition-all flex flex-col items-center justify-center text-[10px] font-mono active:scale-95 disabled:opacity-30 cursor-pointer shadow-sm"
            title={`Toggle Single Shot or ${requiredShots}-Strip`}
          >
            <span className="font-bold text-[#d8b86a]">{shotTarget === requiredShots ? `${requiredShots}x` : '1x'}</span>
            <span className="text-[7px] text-white/50 tracking-wider">STRIP</span>
          </button>
        </div>

        {/* Minimalist Micro-Caption */}
        <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/35 text-center mt-3">
          {isHandsFree ? 'Hands-Free 1-Tap Sequence • Space to Start' : 'Manual Tap Per Pose • Space to Shoot'}
        </p>
      </div>
    </div>
  );
}
