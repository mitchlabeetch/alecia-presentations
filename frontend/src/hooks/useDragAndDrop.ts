import { useState, useCallback } from 'react';
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export function useDragAndDrop() {
  const [activeId, setActiveId] = useState<string | null>(null);

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
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (over && active.id !== over.id) {
      // Handle reordering logic here
      console.log('Dropped', active.id, 'over', over.id);
    }
  }, []);

  return {
    sensors,
    activeId,
    handleDragStart,
    handleDragEnd,
  };
}
