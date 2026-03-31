/**
 * Hook personnalisé pour la gestion du drag-and-drop
 * Alecia Presentations - Conseil financier français
 *
 * Utilise @dnd-kit/core pour la gestion complète des opérations de glisser-déposer
 */

import { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragStartEvent,
  DragMoveEvent,
  DragOverEvent,
  DragEndEvent,
  DragCancelEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  MouseSensor,
  closestCenter,
  closestCorners,
  pointerWithin,
  rectIntersection,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import type { DragType, DragState, SlideData, BlockData, BlockType } from './types';

export interface UseDragAndDropOptions {
  onSlideReorder?: (slides: SlideData[]) => void;
  onBlockAdd?: (block: BlockData, slideId: string) => void;
  onBlockMove?: (blockId: string, position: { x: number; y: number }) => void;
  onTemplateApply?: (templateId: string) => void;
  onImageAdd?: (imageUrl: string, slideId: string) => void;
  collisionDetection?: 'closestCenter' | 'closestCorners' | 'pointerWithin' | 'rectIntersection';
  snapToGrid?: boolean;
  gridSize?: number;
  showGridGuides?: boolean;
}

export interface UseDragAndDropReturn {
  // Sensors
  sensors: ReturnType<typeof useSensors>;

  // État
  dragState: DragState;
  activeDragType: DragType | null;
  activeDragId: string | null;

  // Handlers
  handleDragStart: (event: DragStartEvent) => void;
  handleDragMove: (event: DragMoveEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: (event: DragCancelEvent) => void;

  // Helpers
  isDragging: boolean;
  isDraggingSlide: boolean;
  isDraggingBlock: boolean;
  isDraggingTemplate: boolean;
  isDraggingImage: boolean;

  // Configuration
  collisionDetection: typeof closestCenter;
  dropAnimation: DropAnimation;

  // Sortable
  sortableItems: string[];
  setSortableItems: (items: string[]) => void;
  handleSlideReorder: (activeId: string, overId: string) => SlideData[] | null;
}

const defaultDropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export function useDragAndDrop(
  slides: SlideData[],
  options: UseDragAndDropOptions = {}
): UseDragAndDropReturn {
  const {
    onSlideReorder,
    onBlockAdd,
    onBlockMove,
    onTemplateApply,
    onImageAdd,
    collisionDetection: collisionDetectionType = 'closestCenter',
  } = options;

  // État du drag-and-drop
  const [dragState, setDragState] = useState<DragState>({
    activeId: null,
    activeType: null,
    overId: null,
    isDragging: false,
  });

  const [sortableItems, setSortableItems] = useState<string[]>(slides.map((slide) => slide.id));

  // Configuration des capteurs pour différents types d'entrée
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Détection de collision
  const collisionDetection = useMemo(() => {
    switch (collisionDetectionType) {
      case 'closestCorners':
        return closestCorners;
      case 'pointerWithin':
        return pointerWithin;
      case 'rectIntersection':
        return rectIntersection;
      case 'closestCenter':
      default:
        return closestCenter;
    }
  }, [collisionDetectionType]);

  // Handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const activeType = active.data.current?.type as DragType;

    setDragState({
      activeId: active.id as string,
      activeType,
      overId: null,
      isDragging: true,
    });
  }, []);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    const { over } = event;

    setDragState((prev) => ({
      ...prev,
      overId: over ? (over.id as string) : null,
    }));
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;

    setDragState((prev) => ({
      ...prev,
      overId: over ? (over.id as string) : null,
    }));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        setDragState({
          activeId: null,
          activeType: null,
          overId: null,
          isDragging: false,
        });
        return;
      }

      const activeType = active.data.current?.type as DragType;
      const activeId = active.id as string;
      const overId = over.id as string;

      // Gestion du réordonnancement des slides
      if (activeType === 'SLIDE' && activeId !== overId) {
        const reorderedSlides = handleSlideReorder(activeId, overId);
        if (reorderedSlides && onSlideReorder) {
          onSlideReorder(reorderedSlides);
        }
      }

      // Gestion de l'ajout de blocs
      if (activeType === 'BLOCK' && over.data.current?.accepts?.includes('BLOCK')) {
        const blockType = active.data.current?.blockType as BlockType;
        const slideId = overId;

        if (blockType && onBlockAdd) {
          const newBlock: BlockData = createDefaultBlock(blockType);
          onBlockAdd(newBlock, slideId);
        }
      }

      // Gestion de l'application de templates
      if (activeType === 'TEMPLATE' && onTemplateApply) {
        onTemplateApply(activeId);
      }

      // Gestion de l'ajout d'images
      if (activeType === 'IMAGE' && over.data.current?.accepts?.includes('IMAGE')) {
        const imageUrl = active.data.current?.imageUrl as string;
        if (imageUrl && onImageAdd) {
          onImageAdd(imageUrl, overId);
        }
      }

      setDragState({
        activeId: null,
        activeType: null,
        overId: null,
        isDragging: false,
      });
    },
    [onSlideReorder, onBlockAdd, onTemplateApply, onImageAdd]
  );

  const handleDragCancel = useCallback((event: DragCancelEvent) => {
    setDragState({
      activeId: null,
      activeType: null,
      overId: null,
      isDragging: false,
    });
  }, []);

  // Fonction pour réordonner les slides
  const handleSlideReorder = useCallback(
    (activeId: string, overId: string): SlideData[] | null => {
      const oldIndex = sortableItems.indexOf(activeId);
      const newIndex = sortableItems.indexOf(overId);

      if (oldIndex === -1 || newIndex === -1) {
        return null;
      }

      const newItems = arrayMove(sortableItems, oldIndex, newIndex);
      setSortableItems(newItems);

      // Mettre à jour l'ordre des slides
      return newItems
        .map((id, index) => {
          const slide = slides.find((s) => s.id === id);
          return slide ? { ...slide, order: index } : null;
        })
        .filter((s): s is SlideData => s !== null);
    },
    [sortableItems, slides]
  );

  // Helpers
  const isDragging = dragState.isDragging;
  const isDraggingSlide = dragState.activeType === 'SLIDE';
  const isDraggingBlock = dragState.activeType === 'BLOCK';
  const isDraggingTemplate = dragState.activeType === 'TEMPLATE';
  const isDraggingImage = dragState.activeType === 'IMAGE';

  return {
    sensors,
    dragState,
    activeDragType: dragState.activeType,
    activeDragId: dragState.activeId,
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    isDragging,
    isDraggingSlide,
    isDraggingBlock,
    isDraggingTemplate,
    isDraggingImage,
    collisionDetection,
    dropAnimation: defaultDropAnimation,
    sortableItems,
    setSortableItems,
    handleSlideReorder,
  };
}

// Fonction utilitaire pour créer un bloc par défaut
function createDefaultBlock(type: BlockType): BlockData {
  const defaultSizes: Record<BlockType, { width: number; height: number }> = {
    // Text Blocks
    Titre: { width: 400, height: 60 },
    'Sous-titre': { width: 350, height: 50 },
    Paragraphe: { width: 400, height: 150 },
    Liste: { width: 350, height: 150 },
    Citation: { width: 400, height: 100 },
    // Financial Blocks
    KPI_Card: { width: 200, height: 120 },
    Chart_Block: { width: 400, height: 250 },
    Table_Block: { width: 500, height: 200 },
    Timeline_Block: { width: 500, height: 180 },
    // M&A Content Blocks
    Company_Overview: { width: 400, height: 200 },
    Deal_Rationale: { width: 450, height: 220 },
    SWOT: { width: 500, height: 300 },
    Key_Metrics: { width: 450, height: 200 },
    Process_Timeline: { width: 500, height: 180 },
    // Team Blocks
    Team_Grid: { width: 450, height: 200 },
    Team_Row: { width: 500, height: 100 },
    Advisor_List: { width: 400, height: 180 },
    // Visual Blocks
    Image: { width: 300, height: 200 },
    Logo_Grid: { width: 400, height: 150 },
    Icon_Text: { width: 300, height: 80 },
    // Layout Blocks
    Two_Column: { width: 600, height: 200 },
    Three_Column: { width: 700, height: 200 },
    Grid: { width: 500, height: 250 },
  };

  const defaultContents: Record<BlockType, string> = {
    // Text Blocks
    Titre: 'Nouveau titre',
    'Sous-titre': 'Sous-titre',
    Paragraphe: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    Liste: '• Premier élément\n• Deuxième élément\n• Troisième élément',
    Citation: '"Une citation inspirante" - Auteur',
    // Financial Blocks
    KPI_Card: '1.2M EUR',
    Chart_Block: '',
    Table_Block: '',
    Timeline_Block: '',
    // M&A Content Blocks
    Company_Overview: '',
    Deal_Rationale: '',
    SWOT: '',
    Key_Metrics: '',
    Process_Timeline: '',
    // Team Blocks
    Team_Grid: '',
    Team_Row: '',
    Advisor_List: '',
    // Visual Blocks
    Image: '',
    Logo_Grid: '',
    Icon_Text: '',
    // Layout Blocks
    Two_Column: '',
    Three_Column: '',
    Grid: '',
  };

  return {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    content: defaultContents[type] || '',
    position: { x: 50, y: 50 },
    size: defaultSizes[type] || { width: 200, height: 100 },
  };
}

// Helper function to snap position to grid
export function snapToGrid(
  position: { x: number; y: number },
  gridSize: number
): { x: number; y: number } {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

// Helper function to check if position is near grid line
export function isNearGridLine(position: number, gridSize: number, threshold: number = 5): boolean {
  const remainder = position % gridSize;
  return remainder < threshold || remainder > gridSize - threshold;
}

export default useDragAndDrop;
