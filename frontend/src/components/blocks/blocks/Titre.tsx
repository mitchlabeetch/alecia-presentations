import { useInlineEdit } from '@/hooks/useInlineEdit';
import type { BlockContent } from '@/types';
import { Pencil } from 'lucide-react';

interface TitreProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Titre({ content, isEditing = false, onChange }: TitreProps) {
  const text = content.text || 'Titre de la slide';

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

  // Mode d'edition global (depuis la barre d'outils)
  if (isEditing && !isInlineEditing) {
    return (
      <div
        className="w-full h-full flex items-center justify-center p-8"
        onDoubleClick={handleDoubleClick}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => onChange?.({ ...content, text: e.target.value })}
          className="w-full text-center text-5xl font-bold text-alecia-navy bg-white/80 border-2 border-alecia-red/30 rounded-lg outline-none px-4 py-2"
          style={{ fontFamily: 'Bierstadt, sans-serif' }}
          placeholder="Entrez le titre..."
        />
      </div>
    );
  }

  // Mode d'edition inline
  if (isInlineEditing) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="relative w-full">
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full text-center text-5xl font-bold text-alecia-navy bg-white/90 border-2 border-alecia-red rounded-lg outline-none px-4 py-2 shadow-lg"
            style={{ fontFamily: 'Bierstadt, sans-serif' }}
            placeholder="Entrez le titre..."
            autoFocus
          />
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-xs text-alecia-red bg-white px-2 py-1 rounded-full shadow">
            <Pencil className="w-3 h-3" />
            <span>Double-clic pour editer</span>
          </div>
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div
      className={`w-full h-full flex items-center justify-center p-8 transition-all ${editIndicatorStyle}`}
      onDoubleClick={handleDoubleClick}
    >
      <h1
        className="text-5xl font-bold text-alecia-navy text-center"
        style={{ fontFamily: 'Bierstadt, sans-serif' }}
      >
        {text}
      </h1>
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Pencil className="w-4 h-4 text-alecia-red" />
        </div>
      )}
    </div>
  );
}