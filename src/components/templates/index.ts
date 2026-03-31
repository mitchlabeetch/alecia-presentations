// Système de templates Alecia Presentations
// Export de tous les composants et hooks du système de templates

export { default as TemplateGallery } from './TemplateGallery';
export { default as TemplateCard } from './TemplateCard';
export { default as TemplatePreview } from './TemplatePreview';
export { default as SaveTemplateModal } from './SaveTemplateModal';
export { default as TemplateCategories } from './TemplateCategories';
export { default as useTemplates } from './useTemplates';

// Types exportés
export type {
  Template,
  TemplateCategory,
  TemplateVariable,
  SlideContent,
  TemplateFilters
} from './useTemplates';

// Données et utilitaires
export {
  defaultTemplates,
  categoryLabels,
  categoryIcons
} from './useTemplates';
