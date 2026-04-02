import { DndContext, DragOverlay, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ReactNode, useState, useCallback } from 'react';
import type { BlockType } from '@/types';

export interface DragItem {
  id: string;
  type: 'slide' | 'block';
  blockType?: BlockType;
  blockName?: string;
  data?: Record<string, unknown>;
}

interface DnDProviderProps {
  children: ReactNode;
  onDragEnd?: (event: DragEndEvent, item?: DragItem) => void;
  onDragStart?: (event: DragStartEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
}

export function DnDProvider({ children, onDragEnd, onDragStart, onDragOver }: DnDProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<DragItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    const item: DragItem = {
      id: active.id as string,
      type: (active.data.current?.type === 'slide' ? 'slide' : 'block') as 'slide' | 'block',
      blockType: active.data.current?.blockType,
      blockName: active.data.current?.name,
      data: active.data.current as Record<string, unknown>,
    };
    setActiveItem(item);
    onDragStart?.(event);
  }, [onDragStart]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    onDragOver?.(event);
  }, [onDragOver]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveItem(null);
    onDragEnd?.(event, activeItem);
  }, [onDragEnd, activeItem]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveItem(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={[]} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      <DragOverlay dropAnimation={null}>
        {activeId && activeItem ? (
          <div className="flex items-center gap-2 px-4 py-3 bg-alecia-navy text-white rounded-lg shadow-xl border-2 border-alecia-red">
            <span className="text-sm font-semibold">
              {activeItem.blockName || activeItem.type}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
