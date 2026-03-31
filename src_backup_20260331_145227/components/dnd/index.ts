/**
 * Exportations du système de drag-and-drop
 * Alecia Presentations - Conseil financier français
 */

// Types
export type {
  DragType,
  DragItem,
  SlideData,
  BlockType,
  BlockData,
  TemplateData,
  DragState,
  BlockLibraryItem,
} from './types';

// Hook
export { useDragAndDrop, type UseDragAndDropOptions, type UseDragAndDropReturn } from './useDragAndDrop';

// Composants
export { DragOverlay, useDragOverlay } from './DragOverlay';
export { DraggableSlide, CanvasBlock } from './DraggableSlide';
export { SortableSlideList } from './SortableSlideList';
export { DraggableBlock } from './DraggableBlock';
export { BlockLibrary } from './BlockLibrary';
export { DroppableCanvas } from './DroppableCanvas';
