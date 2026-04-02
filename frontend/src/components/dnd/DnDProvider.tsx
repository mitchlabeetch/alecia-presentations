import { DndContext, DragOverlay, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ReactNode, useState, useCallback } from 'react';

interface DragItem {
  id: string;
  type: 'slide' | 'block';
  data?: Record<string, unknown>;
}

interface DnDProviderProps {
  children: ReactNode;
  onDragEnd?: (event: DragEndEvent) => void;
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
      type: 'slide',
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
    onDragEnd?.(event);
  }, [onDragEnd]);

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
        {activeId ? (
          <div className="opacity-80 bg-alecia-navy text-white px-4 py-2 rounded-lg shadow-lg border-2 border-alecia-red">
            <span className="text-sm font-medium">
              {activeItem?.type === 'slide' ? 'Diapositive' : 'Bloc'}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export { DndContext, DragOverlay, closestCenter };
export type { DragStartEvent, DragEndEvent, DragOverEvent };
