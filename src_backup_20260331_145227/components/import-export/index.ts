// Import/Export Components and Hooks for Alecia Presentations
// Alecia - Cabinet de conseil financier

// Components
export { default as FileUploader } from './FileUploader';
export { default as AssetLibrary } from './AssetLibrary';
export { default as ExportModal } from './ExportModal';
export { default as ImportModal } from './ImportModal';
export { default as ExportProgress } from './ExportProgress';

// Hooks
export { useFileUpload, default as useFileUploadDefault } from './useFileUpload';
export { useExport, default as useExportDefault } from './useExport';

// Types
export type {
  UploadedFile,
  FileType,
  FileUploadOptions,
} from './useFileUpload';

export type {
  ExportFormat,
  ExportQuality,
  SlideData,
  SlideElement,
  PresentationData,
  PptxExportOptions,
  PdfExportOptions,
  ExportProgress as ExportProgressType,
} from './useExport';

export type {
  Asset,
} from './AssetLibrary';

export type {
  ImportedPresentation,
  ImportedSlide,
  ImportedElement,
} from './ImportModal';

export type {
  ExportStatus,
} from './ExportProgress';

// Constants
export const SUPPORTED_IMAGE_FORMATS = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
  'image/webp',
] as const;

export const SUPPORTED_DOCUMENT_FORMATS = [
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
] as const;

export const SUPPORTED_EXPORT_FORMATS = ['pptx', 'pdf'] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const BRAND_COLORS = {
  primary: '#0a1628',    // Dark navy
  accent: '#e91e63',     // Pink accent
  background: '#f8fafc',
  text: '#0a1628',
  textMuted: '#64748b',
  border: '#e2e8f0',
  error: '#dc2626',
  success: '#22c55e',
} as const;

// French UI Text Constants
export const UI_TEXT = {
  // General
  import: 'Importer',
  export: 'Exporter',
  cancel: 'Annuler',
  confirm: 'Confirmer',
  delete: 'Supprimer',
  save: 'Enregistrer',
  close: 'Fermer',
  
  // File Upload
  dropzoneText: 'Glisser-déposer vos fichiers ici',
  browseText: 'ou cliquer pour parcourir',
  supportedFormats: 'Formats supportés',
  maxFileSize: 'Taille maximale',
  
  // Export
  exportPptx: 'Télécharger en PPTX',
  exportPdf: 'Télécharger en PDF',
  exportInProgress: 'Export en cours...',
  exportComplete: 'Export terminé !',
  
  // Asset Library
  mediaLibrary: 'Bibliothèque de médias',
  search: 'Rechercher',
  allCategories: 'Toutes les catégories',
  noMedia: 'Aucun média dans la bibliothèque',
  
  // Progress
  preparing: 'Préparation...',
  generating: 'Génération...',
  finalizing: 'Finalisation...',
  
  // Errors
  uploadError: 'Erreur lors du téléchargement',
  invalidFileType: 'Type de fichier non supporté',
  fileTooLarge: 'Le fichier dépasse la taille maximale',
} as const;

// File Type Helpers
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const isImageFile = (mimeType: string): boolean => {
  return SUPPORTED_IMAGE_FORMATS.includes(mimeType as any);
};

export const isPptxFile = (mimeType: string): boolean => {
  return SUPPORTED_DOCUMENT_FORMATS.includes(mimeType as any);
};

export const getFileTypeLabel = (mimeType: string): string => {
  if (isImageFile(mimeType)) {
    const ext = mimeType.split('/')[1]?.toUpperCase() || 'Image';
    return ext === 'SVG+XML' ? 'SVG' : ext;
  }
  if (isPptxFile(mimeType)) return 'PowerPoint';
  if (mimeType === 'application/pdf') return 'PDF';
  return 'Fichier';
};
