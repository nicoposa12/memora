'use client';

import React from 'react';
import { ARPropType, AR_PROP_OPTIONS } from '../utils/arProps';
import { Sparkles } from 'lucide-react';

interface ARPropsSelectorProps {
  activeProp: ARPropType;
  onSelectProp: (prop: ARPropType) => void;
  isLoading?: boolean;
}

export function ARPropsSelector({
  activeProp,
  onSelectProp,
  isLoading = false,
}: ARPropsSelectorProps) {
  return (
    <div className="w-full flex flex-col items-center select-none py-1.5">
      <div className="flex items-center justify-between w-full px-2 mb-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/50 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>Live AR Props & Hats</span>
        </span>
        {isLoading && (
          <span className="font-mono text-[8px] uppercase tracking-wider text-amber-400/80 animate-pulse">
            Loading AI Tracker…
          </span>
        )}
      </div>

      <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 px-1 scrollbar-none">
        {AR_PROP_OPTIONS.map((opt) => {
          const isSelected = activeProp === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectProp(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-primary text-primary-foreground font-semibold shadow-md ring-1 ring-primary/40 scale-102'
                  : 'bg-black/50 text-cream/75 hover:text-cream hover:bg-black/70 border border-white/10'
              }`}
            >
              <span className="text-sm leading-none">{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
