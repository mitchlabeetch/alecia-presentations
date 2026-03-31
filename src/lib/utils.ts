import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Type definitions
export interface Slide {
  id: string;
  title: string;
  content: string;
  order: number;
  type?: string;
}

// ==================== ID Generation ====================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// ==================== Date Formatting ====================

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "à l'instant";
  if (diffMins < 60) return `il y a ${diffMins} min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays < 7) return `il y a ${diffDays}j`;
  return formatDate(d);
}

// ==================== File Utilities ====================

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 o';
  const k = 1024;
  const sizes = ['o', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function downloadFile(data: string | Blob, filename: string): void {
  const blob = data instanceof Blob ? data : new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadBlob(blob: Blob, filename: string): void {
  downloadFile(blob, filename);
}

// ==================== Color Utilities ====================

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function adjustColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const adjust = (c: number) => Math.min(255, Math.max(0, Math.round(c + (255 * percent) / 100)));
  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
}

export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const { r, g, b } = rgb;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function getContrastColor(hex: string): 'white' | 'black' {
  return getLuminance(hex) > 128 ? 'black' : 'white';
}

// ==================== Text Utilities ====================

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function replaceVariables(text: string, variables: Record<string, string>): string {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, 'g'), value),
    text
  );
}

// ==================== Validation ====================

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s-()]{8,}$/.test(phone);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ==================== Slide Utilities ====================

export function createEmptySlide(order: number): Slide {
  return {
    id: generateId(),
    title: '',
    content: '',
    order,
    type: 'blank',
  };
}

export function duplicateSlide(slide: Slide, newOrder: number): Slide {
  return {
    ...slide,
    id: generateId(),
    title: `${slide.title} (copie)`,
    order: newOrder,
  };
}

export function reorderSlides(slides: Slide[], startIndex: number, endIndex: number): Slide[] {
  const result = Array.from(slides);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result.map((slide, index) => ({ ...slide, order: index }));
}

// ==================== Array Utilities ====================

export function sortBy<T>(array: T[], key: keyof T): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) result[groupKey] = [];
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
}

export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

// ==================== Logging Utilities ====================

export function log(...args: unknown[]): void {
  if (import.meta.env.DEV) {
    console.log('[Alecia]', ...args);
  }
}

export function logError(...args: unknown[]): void {
  console.error('[Alecia Error]', ...args);
}

export function measureTime<T>(fn: () => T, label: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  log(`${label}: ${(end - start).toFixed(2)}ms`);
  return result;
}

// ==================== Async Utilities ====================

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
  );
  return Promise.race([promise, timeout]);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(fn: () => Promise<T>, maxAttempts = 3, delayMs = 1000): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e as Error;
      if (attempt < maxAttempts) {
        await sleep(delayMs * attempt);
      }
    }
  }
  throw lastError;
}

// ==================== Constants ====================

export const ALECIA_COLORS = {
  primary: '#1e3a5f',
  secondary: '#2d4a6f',
  accent: '#e91e63',
  background: '#0d1a2d',
  surface: '#152238',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
} as const;

export const SLIDE_TYPE_LABELS = {
  title: 'Titre',
  subtitle: 'Sous-titre',
  paragraph: 'Paragraphe',
  image: 'Image',
  chart: 'Graphique',
  table: 'Tableau',
  'two-column': 'Deux colonnes',
  list: 'Liste',
  quote: 'Citation',
  kpi: 'Indicateur KPI',
  timeline: 'Chronologie',
  team: 'Équipe',
  contact: 'Contact',
  cover: 'Page de garde',
  summary: 'Résumé',
  blank: 'Vierge',
} as const;

export const CHAT_SUGGESTIONS = [
  'Améliorer ce texte',
  'Raccourcir le contenu',
  'Développer cette idée',
  'Traduire en anglais',
  'Ajouter des données chiffrées',
  'Créer un tableau comparatif',
] as const;

// ==================== Main Export ====================

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
