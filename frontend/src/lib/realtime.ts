'use client';

/**
 * Memora Realtime Engine
 * High-performance, zero-latency cross-context event bus.
 * Synchronizes photobooth captures, guest downloads, event updates,
 * templates, and system activity across all tabs, windows, and pages.
 */

export type RealtimeEventType =
  | 'PHOTO_CAPTURED'
  | 'PHOTO_DOWNLOADED'
  | 'PHOTO_DELETED'
  | 'EVENT_CREATED'
  | 'EVENT_UPDATED'
  | 'EVENT_DELETED'
  | 'BOOTH_STATUS_CHANGED'
  | 'TEMPLATE_UPDATED'
  | 'USER_UPDATED'
  | 'PLANS_UPDATED'
  | 'ACTIVITY_LOGGED'
  | 'QR_SCANNED'
  | 'SYSTEM_PING';

export interface RealtimeMessage<T = any> {
  id: string;
  type: RealtimeEventType;
  payload?: T;
  timestamp: number;
  senderId: string;
}

const CHANNEL_NAME = 'memora_realtime_channel';
const STORAGE_KEY = 'memora_realtime_sync';
const DOM_EVENT_NAME = 'memora:realtime_event';

// Unique tab/window identifier
const CLIENT_ID = typeof window !== 'undefined'
  ? `client_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`
  : 'server';

// Singleton BroadcastChannel instance
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  } catch {
    broadcastChannel = null;
  }
}

/**
 * Broadcast an event in real time to all pages, components, and browser tabs.
 */
export function broadcastRealtime<T = any>(type: RealtimeEventType, payload?: T): RealtimeMessage<T> {
  const message: RealtimeMessage<T> = {
    id: `rt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    payload,
    timestamp: Date.now(),
    senderId: CLIENT_ID,
  };

  if (typeof window === 'undefined') return message;

  // 1. Send via BroadcastChannel (modern W3C API for cross-tab sync)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(message);
    } catch {}
  }

  // 2. Dispatch CustomEvent for intra-page component listeners
  try {
    window.dispatchEvent(new CustomEvent(DOM_EVENT_NAME, { detail: message }));
  } catch {}

  // 3. Update localStorage key for cross-window / fallback sync
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(message));
  } catch {}

  return message;
}

/**
 * Subscribe to realtime events.
 * Returns an unsubscribe function.
 */
export function subscribeRealtime(
  types: RealtimeEventType | RealtimeEventType[] | '*',
  handler: (msg: RealtimeMessage) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (msg: RealtimeMessage) => {
    if (!msg || !msg.type) return;
    if (
      types === '*' ||
      (Array.isArray(types) && types.includes(msg.type)) ||
      types === msg.type
    ) {
      handler(msg);
    }
  };

  // 1. Listen via BroadcastChannel
  const onBcMessage = (event: MessageEvent) => {
    if (event.data && event.data.senderId !== CLIENT_ID) {
      handleMessage(event.data);
    }
  };
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', onBcMessage);
  }

  // 2. Listen via DOM CustomEvent (intra-tab)
  const onDomEvent = (event: Event) => {
    const custom = event as CustomEvent<RealtimeMessage>;
    if (custom.detail) {
      handleMessage(custom.detail);
    }
  };
  window.addEventListener(DOM_EVENT_NAME, onDomEvent);

  // 3. Listen via StorageEvent (cross-tab fallback)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed: RealtimeMessage = JSON.parse(event.newValue);
        if (parsed.senderId !== CLIENT_ID) {
          handleMessage(parsed);
        }
      } catch {}
    }
  };
  window.addEventListener('storage', onStorage);

  // Return unsubscribe cleanup
  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', onBcMessage);
    }
    window.removeEventListener(DOM_EVENT_NAME, onDomEvent);
    window.removeEventListener('storage', onStorage);
  };
}
