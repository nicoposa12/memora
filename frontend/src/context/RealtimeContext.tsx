'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  RealtimeEventType, 
  RealtimeMessage, 
  broadcastRealtime, 
  subscribeRealtime 
} from '@/lib/realtime';
import { Camera, Sparkles, AlertCircle, X, CheckCircle2, QrCode } from 'lucide-react';

interface LiveToast {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'event' | 'system' | 'default';
  timestamp: string;
}

interface RealtimeContextValue {
  isConnected: boolean;
  lastMessage: RealtimeMessage | null;
  broadcast: (type: RealtimeEventType, payload?: any) => RealtimeMessage;
  showLiveToast: (title: string, description: string, type?: LiveToast['type']) => void;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  isConnected: true,
  lastMessage: null,
  broadcast: broadcastRealtime,
  showLiveToast: () => {},
});

export function useRealtimeContext() {
  return useContext(RealtimeContext);
}

/**
 * Custom React Hook for components to subscribe to specific realtime events
 */
export function useRealtime(
  types: RealtimeEventType[] | '*',
  callback: (message: RealtimeMessage) => void
) {
  useEffect(() => {
    const unsubscribe = subscribeRealtime(types, callback);
    return () => unsubscribe();
  }, [types, callback]);
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(true);
  const [lastMessage, setLastMessage] = useState<RealtimeMessage | null>(null);
  const [activeToast, setActiveToast] = useState<LiveToast | null>(null);

  const showLiveToast = useCallback((title: string, description: string, type: LiveToast['type'] = 'default') => {
    const toast: LiveToast = {
      id: `toast_${Date.now()}`,
      title,
      description,
      type,
      timestamp: 'Just now',
    };
    setActiveToast(toast);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setActiveToast((current) => (current?.id === toast.id ? null : current));
    }, 4000);
  }, []);

  // Listen to all realtime events to update lastMessage and show non-intrusive live notifications
  useEffect(() => {
    const unsubscribe = subscribeRealtime('*', (msg) => {
      setLastMessage(msg);

      // Trigger subtle luxury toast notifications for key events
      if (msg.type === 'PHOTO_CAPTURED') {
        const eventName = msg.payload?.eventName || 'Photobooth';
        showLiveToast(
          'Live Photo Captured',
          `New memory saved at ${eventName} • Gallery updated in real time`,
          'photo'
        );
      } else if (msg.type === 'EVENT_CREATED') {
        const name = msg.payload?.name || 'New Event';
        showLiveToast(
          'Live Event Published',
          `"${name}" is now live and ready for guests`,
          'event'
        );
      } else if (msg.type === 'BOOTH_STATUS_CHANGED') {
        showLiveToast(
          'Photobooth Synchronized',
          'Kiosk status and settings updated across all devices',
          'system'
        );
      } else if (msg.type === 'TEMPLATE_UPDATED') {
        showLiveToast(
          'Template Updated',
          'Photostrip colors, typography, and logo refreshed live',
          'system'
        );
      }
    });

    return () => unsubscribe();
  }, [showLiveToast]);

  return (
    <RealtimeContext.Provider
      value={{
        isConnected,
        lastMessage,
        broadcast: broadcastRealtime,
        showLiveToast,
      }}
    >
      {children}

      {/* Floating Minimalist Realtime Notification Pill */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-sm pointer-events-auto">
          <div className="bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-2xl p-3.5 pr-4 flex items-start gap-3 ring-1 ring-border/30">
            <div className={`p-2 rounded-xl shrink-0 ${
              activeToast.type === 'photo' 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                : activeToast.type === 'event'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-secondary text-foreground border border-border/60'
            }`}>
              {activeToast.type === 'photo' && <Camera className="w-4 h-4" />}
              {activeToast.type === 'event' && <Sparkles className="w-4 h-4" />}
              {activeToast.type === 'system' && <CheckCircle2 className="w-4 h-4" />}
              {activeToast.type === 'default' && <Sparkles className="w-4 h-4" />}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground tracking-tight">
                  {activeToast.title}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                {activeToast.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveToast(null)}
              className="text-muted-foreground/60 hover:text-foreground p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </RealtimeContext.Provider>
  );
}

/**
 * Reusable Minimalist Realtime Status Pill
 */
export function RealtimeStatusBadge({ className = '' }: { className?: string }) {
  return null;
}
