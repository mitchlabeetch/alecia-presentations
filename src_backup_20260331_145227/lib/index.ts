/**
 * Bibliothèque de fonctions utilitaires pour Alecia Presentations
 */

// Fonctions utilitaires générales
export {
  // Génération d'identifiants
  generateId,
  generateShortId,
  
  // Manipulation de dates
  formatDate,
  formatDateTime,
  formatRelativeTime,
  
  // Manipulation de fichiers
  formatFileSize,
  getFileExtension,
  isImageFile,
  fileToDataUrl,
  downloadFile,
  downloadBlob,
  
  // Manipulation de couleurs
  hexToRgb,
  rgbToHex,
  adjustColor,
  getLuminance,
  getContrastColor,
  
  // Manipulation de textes
  truncateText,
  capitalize,
  slugify,
  getInitials,
  replaceVariables,
  
  // Validation
  isValidEmail,
  isValidPhone,
  isValidUrl,
  
  // Fonctions spécifiques aux slides
  createEmptySlide,
  duplicateSlide,
  reorderSlides,
  
  // Fonctions de classement
  sortBy,
  groupBy,
  uniqueBy,
  
  // Fonctions de débogage
  log,
  logError,
  measureTime,
  
  // Fonctions asynchrones
  withTimeout,
  sleep,
  retry,
} from './utils';

// Constantes
export { ALECIA_COLORS, SLIDE_TYPE_LABELS, CHAT_SUGGESTIONS } from './utils';

// Export du générateur PPTX
export * from './pptx';
