import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export interface SlideSnapshot {
  slideId: string;
  title: string;
  content: string;
  notes: string;
  type: string;
  timestamp: number;
}

export interface UndoRedoState {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => SlideSnapshot | null;
  redo: () => SlideSnapshot | null;
  pushSnapshot: (snapshot: SlideSnapshot) => void;
  clearHistory: () => void;
  lastAction: string | null;
}

const MAX_HISTORY_SIZE = 50;

export function useUndoRedo(): UndoRedoState {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  
  const historyRef = useRef<SlideSnapshot[]>([]);
  const currentIndexRef = useRef<number>(-1);
  const isUndoingRef = useRef(false);

  const updateFlags = useCallback(() => {
    setCanUndo(currentIndexRef.current > 0);
    setCanRedo(currentIndexRef.current < historyRef.current.length - 1);
  }, []);

  const pushSnapshot = useCallback((snapshot: SlideSnapshot) => {
    if (isUndoingRef.current) {
      isUndoingRef.current = false;
    }

    if (currentIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);
    }

    const currentSnapshot = historyRef.current[currentIndexRef.current];
    if (currentSnapshot &&
        currentSnapshot.slideId === snapshot.slideId &&
        currentSnapshot.title === snapshot.title &&
        currentSnapshot.content === snapshot.content &&
        currentSnapshot.notes === snapshot.notes &&
        currentSnapshot.type === snapshot.type) {
      return;
    }

    historyRef.current.push(snapshot);
    currentIndexRef.current = historyRef.current.length - 1;

    if (historyRef.current.length > MAX_HISTORY_SIZE) {
      historyRef.current.shift();
      currentIndexRef.current--;
    }

    updateFlags();
    setLastAction("edit");
  }, [updateFlags]);

  const undo = useCallback((): SlideSnapshot | null => {
    if (currentIndexRef.current <= 0) {
      toast.info("Rien à annuler");
      return null;
    }

    isUndoingRef.current = true;
    currentIndexRef.current--;
    const snapshot = historyRef.current[currentIndexRef.current];
    updateFlags();
    setLastAction("undo");
    toast.success("Action annulée");
    return snapshot;
  }, [updateFlags]);

  const redo = useCallback((): SlideSnapshot | null => {
    if (currentIndexRef.current >= historyRef.current.length - 1) {
      toast.info("Rien à rétablir");
      return null;
    }

    isUndoingRef.current = false;
    currentIndexRef.current++;
    const snapshot = historyRef.current[currentIndexRef.current];
    updateFlags();
    setLastAction("redo");
    toast.success("Action rétablie");
    return snapshot;
  }, [updateFlags]);

  const clearHistory = useCallback(() => {
    historyRef.current = [];
    currentIndexRef.current = -1;
    isUndoingRef.current = false;
    updateFlags();
    setLastAction(null);
  }, [updateFlags]);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    pushSnapshot,
    clearHistory,
    lastAction,
  };
}
