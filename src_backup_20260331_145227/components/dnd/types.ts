/**
 * Types pour le système de drag-and-drop d'Alecia Presentations
 * Alecia - Conseil financier français
 */

export type DragType = 'SLIDE' | 'BLOCK' | 'TEMPLATE' | 'IMAGE';

export interface DragItem {
  id: string;
  type: DragType;
  data?: unknown;
}

export interface SlideData {
  id: string;
  title: string;
  order: number;
  thumbnail?: string;
  content?: BlockData[];
}

export type BlockType = 
  | 'Titre' 
  | 'Sous-titre' 
  | 'Paragraphe' 
  | 'Image' 
  | 'Graphique' 
  | 'Tableau' 
  | 'Deux colonnes' 
  | 'Liste';

export interface BlockData {
  id: string;
  type: BlockType;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  styles?: Record<string, string>;
}

export interface TemplateData {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  slides: SlideData[];
}

export interface DragState {
  activeId: string | null;
  activeType: DragType | null;
  overId: string | null;
  isDragging: boolean;
}

export interface BlockLibraryItem {
  type: BlockType;
  icon: string;
  label: string;
  description: string;
  defaultContent: string;
}
