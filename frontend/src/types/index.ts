export type EventType = 
  | 'school'
  | 'beach'
  | 'party'
  | 'wedding' 
  | 'birthday' 
  | 'graduation' 
  | 'corporate' 
  | 'debut' 
  | 'other';

export interface EventTypeMetadata {
  id: EventType;
  label: string;
  emoji: string;
  tier: 'pro_studio' | 'all';
  description: string;
}

export const EVENT_TYPES_LIST: EventTypeMetadata[] = [
  { id: 'school', label: 'School', emoji: '🎓', tier: 'pro_studio', description: 'School fairs, proms, and campus events' },
  { id: 'beach', label: 'Beach', emoji: '🏖️', tier: 'pro_studio', description: 'Beach outings, coastal celebrations, and summer parties' },
  { id: 'party', label: 'Party', emoji: '🎉', tier: 'pro_studio', description: 'Nightlife, social parties, and festivals' },
  { id: 'wedding', label: 'Wedding', emoji: '💍', tier: 'pro_studio', description: 'Receptions, vows, and anniversary banquets' },
  { id: 'birthday', label: 'Birthday', emoji: '🎂', tier: 'pro_studio', description: 'Milestone birthdays, debuts, and family gatherings' },
  { id: 'graduation', label: 'Graduation', emoji: '🎓', tier: 'pro_studio', description: 'Commencements, grad parties, and milestone achievements' },
  { id: 'corporate', label: 'Corporate', emoji: '🏢', tier: 'pro_studio', description: 'Conferences, brand activations, and company galas' },
  { id: 'other', label: 'Other Occasion', emoji: '✨', tier: 'all', description: 'General photobooth testing and private gatherings' },
];

export function getEventEmoji(type?: string): string {
  const match = EVENT_TYPES_LIST.find(e => e.id === type);
  return match ? match.emoji : '✨';
}

export function getEventLabel(type?: string): string {
  const match = EVENT_TYPES_LIST.find(e => e.id === type);
  return match ? `${match.emoji} ${match.label}` : (type || 'Event');
}

export function getEventBareLabel(type?: string): string {
  const match = EVENT_TYPES_LIST.find(e => e.id === type);
  return match ? match.label : (type || 'Event');
}

export type PlanType = 'free' | 'event_premium' | 'business';

export interface EventSettings {
  id: string;
  eventId: string;
  countdownSeconds: number; // 0, 3, 5, 10
  maxPhotosPerGuest: number;
  enableGallery: boolean;
  isPublicGallery: boolean;
  enableStickers: boolean;
  enableFilters: boolean;
  watermarkEnabled: boolean;
  primaryColor: string;
  secondaryColor: string;
  customHeading?: string;
  customSubheading?: string;
  logoUrl?: string;
}

export interface PhotoboothEvent {
  id: string;
  userId: string;
  name: string;
  slug: string;
  eventType: EventType;
  eventDate: string;
  description?: string;
  location?: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  isPremium: boolean;
  coverImageUrl?: string;
  settings: EventSettings;
  photoCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type LayoutType = 
  | 'single' 
  | 'strip-2' 
  | 'strip-3' 
  | 'strip-4' 
  | 'grid-4' 
  | 'polaroid';

export type FilterPreset = 
  | 'normal' 
  | 'warm' 
  | 'cool' 
  | 'vintage' 
  | 'bw' 
  | 'bright' 
  | 'contrast' 
  | 'sepia' 
  | 'glamour';

export interface StickerItem {
  id: string;
  name: string;
  emoji?: string;
  svgUrl?: string;
  category: 'celebration' | 'love' | 'party' | 'funny';
}

export interface PhotoTemplate {
  id: string;
  name: string;
  category: string;
  layout: LayoutType;
  isPremium: boolean;
  thumbnailUrl: string;
  frameOverlayUrl?: string;
  backgroundColor: string;
  textColor: string;
  aspectRatio: string; // e.g. "4:3", "9:16", "1:1", "1:3"
}

export interface CapturedFrame {
  id: string;
  dataUrl: string;
  timestamp: number;
}

export interface ProcessedPhoto {
  id: string;
  eventId: string;
  templateId?: string;
  layout: LayoutType;
  filter: FilterPreset;
  dataUrl: string; // Final rendered composite image
  thumbnailUrl?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'admin';
  activePlan: PlanType;
}
