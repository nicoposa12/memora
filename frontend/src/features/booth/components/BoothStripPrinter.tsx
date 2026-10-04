'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Printer,
  Volume2,
  VolumeX,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface BoothStripPrinterProps {
  stripElement: React.ReactNode;
  onComplete: () => void;
  onSkip: () => void;
  onRetake: () => void;
  eventName: string;
  isWideLayout?: boolean;
}

/**
 * Synthesizes a quiet, realistic photobooth thermal printer sound effect
 * using the standard browser Web Audio API (zero external assets).
 */
function createPrinterAudioEngine() {
  let ctx: AudioContext | null = null;
  let isStopped = false;

  const start = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 1. Motor gear hum (low frequency gear train)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const motorGain = ctx.createGain();
      const motorFilter = ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(65, ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(74, ctx.currentTime + 1.6);
      osc1.frequency.linearRampToValueAtTime(68, ctx.currentTime + 3.0);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(130, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(148, ctx.currentTime + 1.6);

      motorFilter.type = 'lowpass';
      motorFilter.frequency.value = 260;

      motorGain.gain.setValueAtTime(0.001, ctx.currentTime);
      motorGain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.2);
      motorGain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 2.8);
      motorGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.1);

      osc1.connect(motorFilter);
      osc2.connect(motorFilter);
      motorFilter.connect(motorGain);
      motorGain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 3.2);
      osc2.stop(ctx.currentTime + 3.2);

      // 2. Paper feed friction (white noise bandpassed through rollers)
      const bufferSize = ctx.sampleRate * 3.0;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1100;
      noiseFilter.Q.value = 3.5;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.018, ctx.currentTime + 0.3);
      noiseGain.gain.linearRampToValueAtTime(0.018, ctx.currentTime + 2.8);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseSource.start(ctx.currentTime);
      noiseSource.stop(ctx.currentTime + 3.0);

      // 3. Guillotine paper cutter "snip" at 2.95s
      setTimeout(() => {
        if (isStopped || !ctx) return;
        try {
          const cutOsc = ctx.createOscillator();
          const cutGain = ctx.createGain();
          cutOsc.type = 'sine';
          cutOsc.frequency.setValueAtTime(360, ctx.currentTime);
          cutOsc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.08);

          cutGain.gain.setValueAtTime(0.07, ctx.currentTime);
          cutGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

          cutOsc.connect(cutGain);
          cutGain.connect(ctx.destination);
          cutOsc.start();
          cutOsc.stop(ctx.currentTime + 0.09);
        } catch {}
      }, 2950);
    } catch {}
  };

  const stop = () => {
    isStopped = true;
    if (ctx && ctx.state !== 'closed') {
      try {
        ctx.close();
      } catch {}
    }
  };

  return { start, stop };
}

export function BoothStripPrinter({
  stripElement,
  onComplete,
  onSkip,
  onRetake,
  eventName,
  isWideLayout = false,
}: BoothStripPrinterProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const TOTAL_DURATION_MS = 3200;

  // Initialize and run audio & progress animation
  useEffect(() => {
    if (!isMuted) {
      audioRef.current = createPrinterAudioEngine();
      audioRef.current.start();
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min(1, elapsed / TOTAL_DURATION_MS);

      // Smooth custom easing: mechanical acceleration, steady feed, gentle settling
      // S-curve with realistic stepper motor feel
      const eased =
        rawProgress < 0.2
          ? (rawProgress / 0.2) * 0.15
          : 0.15 + ((rawProgress - 0.2) / 0.8) * 0.85;

      const currentPct = Math.round(eased * 100);
      setProgress(currentPct);

      if (rawProgress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setIsDone(true);
        // Directly transition to show strip layout upon 100% completion
        autoAdvanceTimerRef.current = setTimeout(() => {
          onComplete();
        }, 150);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      if (audioRef.current) audioRef.current.stop();
    };
  }, [onComplete, isMuted]);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next && audioRef.current) {
        audioRef.current.stop();
      }
      return next;
    });
  }, []);

  // Compute status badge copy based on dye-sub progress
  const getStepLabel = () => {
    if (progress < 25) return 'FEEDING GLOSSY PAPER';
    if (progress < 60) return 'PRINTING COLOR EMULSION';
    if (progress < 85) return 'APPLYING UV OVERCOAT';
    if (progress < 100) return 'CUTTING PHOTO STRIP';
    return 'PRINT READY';
  };

  // Calculate paper displacement: starts tucked up inside printer slot (-86%) down to 0%
  const translateY = -(100 - progress) * 0.86;

  return (
    <div className="flex-1 flex flex-col justify-between items-center w-full max-w-[460px] mx-auto py-2 select-none animate-rise">
      {/* Top Banner Status */}
      <div className="w-full flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-cream/10 border border-white/10 flex items-center justify-center text-primary">
            <Printer className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-display text-sm font-medium tracking-wide text-cream leading-tight">
              Printing your strip
            </h2>
            <p className="font-mono text-[10px] text-cream/50 uppercase tracking-widest">
              {eventName} • Impressa IP-60
            </p>
          </div>
        </div>

        {/* Audio Mute & Skip controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleMute}
            className="w-7 h-7 rounded-full bg-cream/5 hover:bg-cream/10 border border-white/10 flex items-center justify-center text-cream/70 hover:text-cream transition-colors cursor-pointer"
            title={isMuted ? 'Turn printer sound on' : 'Mute printer sound'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cream/10 hover:bg-cream/20 text-cream/80 hover:text-cream font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer border border-white/10"
          >
            <span>Skip</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* The Physical Photobooth Printer Apparatus */}
      <div
        className={`w-full ${
          isWideLayout ? 'max-w-[440px]' : 'max-w-[380px]'
        } flex flex-col items-center relative my-auto`}
      >
        {/* Printer Chassis (Top Lid & Chamfer Housing) */}
        <div
          className={`w-full rounded-t-[26px] bg-gradient-to-b from-[#2e2f36] via-[#202126] to-[#15161a] border-t border-x border-white/20 shadow-2xl p-3 sm:p-4 pb-2 z-20 relative overflow-hidden transition-transform duration-75 ${
            !isDone ? 'translate-x-[0.3px]' : ''
          }`}
        >
          {/* Subtle metallic chamfer highlight line */}
          <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Top Cooling Louvers / Grooves */}
          <div className="flex justify-center gap-2 opacity-25 mb-2.5">
            <span className="w-8 h-1 rounded-full bg-black shadow-inner" />
            <span className="w-8 h-1 rounded-full bg-black shadow-inner" />
            <span className="w-8 h-1 rounded-full bg-black shadow-inner" />
            <span className="w-8 h-1 rounded-full bg-black shadow-inner" />
          </div>

          {/* Front Bezel Branding Plate (like Primera IP60 / HiTi) */}
          <div className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg bg-black/85 border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`size-2 rounded-full transition-colors duration-300 ${
                  isDone
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse'
                }`}
              />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-semibold text-cream/90">
                NXMEMORA IP-60
              </span>
            </div>
            <div className="font-mono text-[8px] uppercase tracking-wider font-medium text-cyan-400/90 truncate">
              {getStepLabel()}
            </div>
          </div>

          {/* Ejection Mouth Slot (Dark Recessed Bezel Opening) */}
          <div className="relative w-full flex justify-center">
            <div
              className={`h-4 sm:h-5 ${
                isWideLayout ? 'w-[330px] sm:w-[360px]' : 'w-[260px] sm:w-[270px]'
              } rounded-t-md bg-[#08080a] border-t border-x border-black shadow-[inset_0_6px_12px_rgba(0,0,0,0.98)] relative overflow-hidden flex items-center justify-center`}
            >
              {/* Internal Cyan/Blue LED Glow from inside the feed slot */}
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
              {/* Internal Feed Guide Rollers */}
              <div className="w-full flex justify-around opacity-20">
                <span className="w-4 h-1 rounded-xs bg-stone-300" />
                <span className="w-4 h-1 rounded-xs bg-stone-300" />
                <span className="w-4 h-1 rounded-xs bg-stone-300" />
                <span className="w-4 h-1 rounded-xs bg-stone-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Slot Mouth Bottom Lip & Upper Feed Shadow (Sits directly on top of the emerging strip) */}
        <div className="w-full flex justify-center z-20 pointer-events-none -mt-[1px]">
          <div
            className={`h-2 ${
              isWideLayout ? 'w-[330px] sm:w-[360px]' : 'w-[260px] sm:w-[270px]'
            } bg-gradient-to-b from-[#0c0d10] to-[#1a1b20] border-b border-black/80 shadow-[0_3px_6px_rgba(0,0,0,0.7)] rounded-b-xs`}
          />
        </div>

        {/* The Emerging Photo Strip Chamber */}
        <div
          className={`relative w-full overflow-hidden flex flex-col items-center z-10 -mt-2 pt-2 pb-3 min-h-[360px] sm:min-h-[420px] max-h-[62vh] flex-1`}
        >
          {/* Paper Slot Cast Shadow on the Emerging Strip */}
          <div className="pointer-events-none absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-black/95 via-black/50 to-transparent z-30" />

          {/* The Actual Strip Sliding Downwards */}
          <div
            style={{
              transform: `translate3d(0, ${translateY}%, 0) scale(${isDone ? 0.85 : 0.84})`,
              willChange: 'transform',
            }}
            className="relative transition-all duration-100 ease-linear shrink-0 drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] origin-top cursor-pointer select-none"
            onClick={isDone ? onComplete : undefined}
            title={isDone ? 'Click to collect your strip' : 'Printing in progress...'}
          >
            {/* Dynamic Glossy Light Reflection Sweep on Paper Surface */}
            <div
              className="pointer-events-none absolute inset-0 z-30 opacity-30 bg-gradient-to-b from-transparent via-white/40 to-transparent transform -skew-y-3"
              style={{
                transform: `translateY(${(progress * 2) - 100}%)`,
                transition: 'transform 80ms linear',
              }}
            />

            {/* The User's Real Photo Strip */}
            <div className="relative">
              {stripElement}
            </div>
          </div>
        </div>

        {/* Printer Bottom Catch Tray Lip */}
        <div className="w-full flex flex-col items-center z-20 -mt-3">
          <div
            className={`h-4 ${
              isWideLayout ? 'w-[350px] sm:w-[380px]' : 'w-[280px] sm:w-[290px]'
            } rounded-b-xl bg-gradient-to-b from-[#18181c] to-[#0f1013] border-b border-x border-white/10 shadow-2xl flex items-center justify-center`}
          >
            <div className="w-16 h-1 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {/* Bottom Controls & Progress Card */}
      <div className="w-full mt-3 pt-2 flex flex-col items-center gap-3">
        {/* Progress Bar & Real-time Indicator */}
        <div className="w-full max-w-[380px] px-3 py-2 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-lg flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-cream/70 flex items-center gap-1.5">
              {isDone ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Print Complete!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" />
                  <span>Dye-Sub Printing…</span>
                </>
              )}
            </span>
            <span className="font-semibold text-primary font-mono">{progress}%</span>
          </div>

          {/* Progress Track */}
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-100 ease-linear rounded-full ${
                isDone ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-primary shadow-[0_0_10px_rgba(244,63,94,0.5)]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="w-full max-w-[380px] flex items-center gap-3">
          <button
            type="button"
            onClick={onRetake}
            className="flex-1 rounded-full border border-cream/20 py-3.5 text-xs font-mono uppercase tracking-wider text-cream/70 hover:text-cream hover:bg-cream/5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake</span>
          </button>

          <button
            type="button"
            onClick={onComplete}
            className="flex-[2] rounded-full bg-primary py-3.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:opacity-95 active:scale-98 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <span>View Strip Layout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
