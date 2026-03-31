/**
 * Index du module de gestion de variables Alecia Presentations
 * Alecia - Conseil financier
 * 
 * Ce module fournit un système complet de gestion de variables pour les présentations.
 * Les variables utilisent la syntaxe {{variable_name}} et peuvent être remplacées
 * automatiquement dans tout le contenu des diapositives.
 */

// Types
export * from './types';

// Hook principal
export { useVariables, type UseVariablesReturn } from './useVariables';

// Composants
export { VariablePanel } from './VariablePanel';
export { VariableRow } from './VariableRow';
export { PresetManager } from './PresetManager';
export {
  VariableHighlighter,
  VariablePreview,
  DetectedVariablesList,
  useVariableHighlighter,
} from './VariableHighlighter';
export { BulkReplaceModal } from './BulkReplaceModal';

// Réexport par défaut
export { default } from './VariablePanel';
