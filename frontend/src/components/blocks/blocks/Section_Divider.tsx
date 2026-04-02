import { useInlineEdit } from '@/hooks/useInlineEdit';
import type { BlockContent } from '@/types';
import { Pencil } from 'lucide-react';

interface SectionDividerProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function SectionDivider({ content, isEditing = false, onChange }: SectionDividerProps) {
  const text = content.text || 'Nouvelle section';

  const handleSave = (newText: string) => {
    if (onChange && newText !== text) {
      onChange({ ...content, text: newText });
    }
  };

  const {
    isEditing: isInlineEditing,
    value: editValue,
    handleDoubleClick,
    handleBlur,
    handleKeyDown,
    handleChange,
    inputRef,
    editIndicatorStyle,
  } = useInlineEdit({
    initialValue: text,
    onSave: handleSave,
  });

  // Mode d'edition global
  if (isEditing && !isInlineEditing) {
    return (
      <div
        className="w-full h-full flex items-center justify-center bg-gradient-to-r from-alecia-navy to-[#0a2a68]"
        onDoubleClick={handleDoubleClick}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-px bg-alecia-red" />
          <input
            type="text"
            value={text}
            onChange={(e) => onChange?.({ ...content, text: e.target.value })}
            className="text-3xl font-bold text-white bg-white/80 border-2 border-alecia-red/30 rounded-lg px-4 py-2 outline-none"
            style={{ fontFamily: 'Bierstadt, sans-serif' }}
          />
          <div className="w-16 h-px bg-alecia-red" />
        </div>
      </div>
    );
  }

  // Mode inline editing
  if (isInlineEditing) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-alecia-navy to-[#0a2a68]">
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-px bg-alecia-red" />
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="text-3xl font-bold text-white bg-white/90 border-2 border-alecia-red rounded-lg px-4 py-2 outline-none shadow-lg"
            style={{ fontFamily: 'Bierstadt, sans-serif' }}
            autoFocus
          />
          <div className="w-16 h-px bg-alecia-red" />
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-xs text-alecia-red bg-white px-2 py-1 rounded-full shadow">
            <Pencil className="w-3 h-3" />
            <span>Entree=OK | Echap=Annuler</span>
          </div>
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-alecia-navy to-[#0a2a68]">
      <div className="flex items-center gap-4">
        <div className="w-16 h-px bg-alecia-red" />
        <h2
          className={`text-3xl font-bold text-white cursor-text hover:bg-white/10 px-4 py-2 rounded transition-colors ${editIndicatorStyle}`}
          style={{ fontFamily: 'Bierstadt, sans-serif' }}
          onDoubleClick={handleDoubleClick}
        >
          {text}
        </h2>
        <div className="w-16 h-px bg-alecia-red" />
      </div>
    </div>
  );
}