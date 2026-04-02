import { useState, useCallback, useRef, useEffect } from 'react';

interface UseInlineEditOptions {
  initialValue: string;
  onSave: (value: string) => void;
  debounceMs?: number;
}

interface UseInlineEditReturn {
  isEditing: boolean;
  value: string;
  displayValue: string;
  startEdit: () => void;
  stopEdit: () => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  handleBlur: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  editIndicatorStyle: string;
}

/**
 * Hook pour l'edition inline avec double-clic
 * - Double-clic pour activer l'edition
 * - Enter/Echap pour confirmer/annuler
 * - Auto-sauvegarde sur blur
 */
export function useInlineEdit({
  initialValue,
  onSave,
  debounceMs = 300,
}: UseInlineEditOptions): UseInlineEditReturn {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync avec la valeur externe
  useEffect(() => {
    if (!isEditing) {
      setValue(initialValue);
    }
  }, [initialValue, isEditing]);

  const startEdit = useCallback(() => {
    setIsEditing(true);
    setValue(initialValue);
    // Focus automatique apres le render
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [initialValue]);

  const stopEdit = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onSave(value);
      setIsEditing(false);
    }, debounceMs);
  }, [value, onSave, debounceMs]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    startEdit();
  }, [startEdit]);

  const handleBlur = useCallback(() => {
    stopEdit();
  }, [stopEdit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Sauvegarde immediate
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      onSave(value);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      // Annulation
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      setValue(initialValue);
      setIsEditing(false);
    }
  }, [value, initialValue, onSave]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(e.target.value);
    },
    []
  );

  // Style pour l'indicateur visuel d'edition
  const editIndicatorStyle = isEditing
    ? 'ring-2 ring-alecia-red ring-offset-2 cursor-text'
    : 'hover:bg-alecia-silver/5 cursor-text';

  return {
    isEditing,
    value,
    displayValue: value,
    startEdit,
    stopEdit,
    handleDoubleClick,
    handleBlur,
    handleKeyDown,
    handleChange,
    inputRef,
    editIndicatorStyle,
  };
}

/**
 * Hook pour l'edition inline avec textarea
 */
export function useInlineTextarea({
  initialValue,
  onSave,
  debounceMs = 300,
}: UseInlineEditOptions): UseInlineEditReturn & { rows: number } {
  const hook = useInlineEdit({ initialValue, onSave, debounceMs });
  return { ...hook, rows: 4 };
}