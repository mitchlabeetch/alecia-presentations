import { useState, useCallback, useEffect } from 'react';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';

interface UseKeyboardDragOptions {
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  enabled?: boolean;
}

interface KeyboardDragState {
  activeId: string | null;
  currentIndex: number;
  items: string[];
}

export function useKeyboardDrag({
  onDragStart,
  onDragEnd,
  enabled = true,
}: UseKeyboardDragOptions = {}) {
  const [state, setState] = useState<KeyboardDragState>({
    activeId: null,
    currentIndex: -1,
    items: [],
  });

  const handleKeyDown = useCallback(
    (event: KeyboardEvent, items: string[]) => {
      if (!enabled) return;

      const { activeId, currentIndex } = state;

      if (!activeId && event.key === ' ') {
        event.preventDefault();
        const target = event.target as HTMLElement;
        const itemId = target.dataset.sortableId || target.closest('[data-sortable-id]')?.getAttribute('data-sortable-id');
        
        if (itemId && items.includes(itemId)) {
          setState((prev) => ({
            ...prev,
            activeId: itemId,
            currentIndex: items.indexOf(itemId),
            items,
          }));
          
          onDragStart?.({
            active: { id: itemId, data: { current: {} } },
            over: null,
          } as DragStartEvent);
        }
      }

      if (activeId) {
        if (event.key === 'Escape') {
          event.preventDefault();
          setState((prev) => ({
            ...prev,
            activeId: null,
            currentIndex: -1,
          }));
          
          onDragEnd?.({
            active: { id: activeId, data: { current: {} } },
            over: null,
          } as DragEndEvent);
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          
          const direction = event.key === 'ArrowUp' ? -1 : 1;
          const newIndex = Math.max(0, Math.min(items.length - 1, currentIndex + direction));
          
          if (newIndex !== currentIndex) {
            setState((prev) => ({
              ...prev,
              currentIndex: newIndex,
            }));
            
            onDragEnd?.({
              active: { id: activeId, data: { current: {} } },
              over: { id: items[newIndex], data: { current: {} } },
            } as DragEndEvent);
          }
        }
      }
    },
    [enabled, state, onDragStart, onDragEnd]
  );

  const reset = useCallback(() => {
    setState({
      activeId: null,
      currentIndex: -1,
      items: [],
    });
  }, []);

  const setItems = useCallback((items: string[]) => {
    setState((prev) => ({ ...prev, items }));
  }, []);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', (e) => handleKeyDown(e, state.items));
      return () => window.removeEventListener('keydown', (e) => handleKeyDown(e, state.items));
    }
  }, [enabled, handleKeyDown, state.items]);

  return {
    activeId: state.activeId,
    currentIndex: state.currentIndex,
    isKeyboardDragging: state.activeId !== null,
    reset,
    setItems,
  };
}

export { useKeyboardDrag };
