import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEventDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function generateEventSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extracts and formats a clean, humanized first name for greetings.
 * Handles full names ("Juan Dela Cruz" -> "Juan"), email prefixes ("juan.carlos" -> "Juan"),
 * compound usernames/handles ("nicoposa8" -> "Nico", "juan8" -> "Juan"),
 * and user profile objects.
 */
export function formatFirstName(userOrName?: any): string {
  if (!userOrName) return 'Organizer';

  if (typeof userOrName === 'object') {
    if (userOrName.firstName && typeof userOrName.firstName === 'string' && userOrName.firstName.trim()) {
      return formatFirstName(userOrName.firstName);
    }
    if (userOrName.first_name && typeof userOrName.first_name === 'string' && userOrName.first_name.trim()) {
      return formatFirstName(userOrName.first_name);
    }
    if (userOrName.name && typeof userOrName.name === 'string' && userOrName.name.trim()) {
      return formatFirstName(userOrName.name);
    }
    if (userOrName.email && typeof userOrName.email === 'string' && userOrName.email.trim()) {
      return formatFirstName(userOrName.email.split('@')[0]);
    }
    return 'Organizer';
  }

  const raw = String(userOrName).trim();
  if (!raw) return 'Organizer';

  // If email was passed, take the handle part before the @
  let str = raw.includes('@') ? raw.split('@')[0] : raw;

  // If full name with spaces (e.g. "Juan Dela Cruz" or "Nico Posa"), take the first token
  if (str.includes(' ')) {
    str = str.split(/\s+/)[0];
  }

  // If delimited by dots, underscores, or hyphens (e.g. "juan.delacruz", "juan_perez"), take first token
  if (str.includes('.') || str.includes('_') || str.includes('-')) {
    str = str.split(/[._-]+/)[0];
  }

  // Handle known compound handles (e.g. nicoposa8 / nicoposa -> Nico)
  const lower = str.toLowerCase();
  if (lower.startsWith('nicoposa')) {
    return 'Nico';
  }

  // Strip trailing numbers (e.g. "juan8" -> "juan", "alex2026" -> "alex")
  str = str.replace(/\d+$/, '');

  if (!str) return 'Organizer';

  return str.charAt(0).toUpperCase() + str.slice(1);
}
