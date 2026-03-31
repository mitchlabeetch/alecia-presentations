/**
 * Hook for drag zone highlighting
 * Alecia Presentations - Conseil financier français
 *
 * Provides drop zone highlighting with gold border animation
 * when dragging blocks over valid drop zones
 */

import { useState, useCallback, useEffect } from 'react';

interface UseDragZoneOptions {
  enabled?: boolean;
  highlightColor?: string;
  borderColor?: string;
  animationDuration?: number;
}

interface UseDragZoneReturn {
  isOver: boolean;
  isValidDropZone: boolean;
  dropPosition: { x: number; y: number } | null;
  setIsOver: (value: boolean) => void;
  setIsValidDropZone: (value: boolean) => void;
  setDropPosition: (pos: { x: number; y: number } | null) => void;
  handleDragOver: (e: React.MouseEvent | React.TouchEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => { x: number; y: number } | null;
  getDropZoneProps: () => {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    style: {
      outline: string;
      outlineOffset: string;
      transition: string;
    };
  };
}

export function useDragZone(options: UseDragZoneOptions = {}): UseDragZoneReturn {
  const {
    enabled = true,
    highlightColor = 'rgba(233, 30, 99, 0.1)',
    borderColor = '#e91e63',
    animationDuration = 200,
  } = options;

  const [isOver, setIsOver] = useState(false);
  const [isValidDropZone, setIsValidDropZone] = useState(false);
  const [dropPosition, setDropPosition] = useState<{ x: number; y: number } | null>(null);

  const handleDragOver = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!enabled) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = 'clientX' in e ? e.clientX - rect.left : 0;
    const y = 'clientY' in e ? e.clientY - rect.top : 0;

    setDropPosition({ x, y });
    setIsValidDropZone(true);
  }, [enabled]);

  const handleDragLeave = useCallback(() => {
    if (!enabled) return;
    setIsOver(false);
    setIsValidDropZone(false);
    setDropPosition(null);
  }, [enabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (!enabled) return null;

    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsOver(false);
    setIsValidDropZone(false);
    setDropPosition(null);

    return { x, y };
  }, [enabled]);

  const getDropZoneProps = useCallback(() => ({
    onDragOver: (e: React.DragEvent) => {
      if (!enabled) return;
      e.preventDefault();
      setIsOver(true);
      setIsValidDropZone(true);

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDropPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    onDragLeave: (e: React.DragEvent) => {
      if (!enabled) return;
      e.preventDefault();
      setIsOver(false);
      setIsValidDropZone(false);
      setDropPosition(null);
    },
    onDrop: (e: React.DragEvent) => {
      if (!enabled) return;
      e.preventDefault();
      setIsOver(false);
      setIsValidDropZone(false);
      setDropPosition(null);
    },
    style: {
      outline: isOver && isValidDropZone ? `3px dashed ${borderColor}` : 'none',
      outlineOffset: isOver && isValidDropZone ? '-3px' : '0',
      transition: `outline ${animationDuration}ms ease, outline-offset ${animationDuration}ms ease`,
    },
  }), [enabled, isOver, isValidDropZone, borderColor, animationDuration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsOver(false);
      setIsValidDropZone(false);
      setDropPosition(null);
    };
  }, []);

  return {
    isOver,
    isValidDropZone,
    dropPosition,
    setIsOver,
    setIsValidDropZone,
    setDropPosition,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    getDropZoneProps,
  };
}

export default useDragZone;
