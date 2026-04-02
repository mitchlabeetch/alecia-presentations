import { useInlineEdit } from '@/hooks/useInlineEdit';
import type { BlockContent } from '@/types';
import { Pencil } from 'lucide-react';

interface ParagrapheProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Paragraphe({ content, isEditing = false, onChange }: ParagrapheProps) {
  const text = content.text || 'Contenu du paragraphe';

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
        className="w-full h-full p-8"
        onDoubleClick={handleDoubleClick}
      >
        <textarea
          value={text}
          onChange={(e) => onChange?.({ ...content, text: e.target.value })}
          className="w-full h-full text-lg text-alecia-navy bg-white/80 border-2 border-alecia-red/30 rounded-lg outline-none px-4 py-2 resize-none leading-relaxed"
          placeholder="Entrez le contenu..."
          rows={6}
        />
      </div>
    );
  }

  // Mode d'edition inline
  if (isInlineEditing) {
    return (
      <div className="w-full h-full p-8">
        <div className="relative h-full">
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full text-lg text-alecia-navy bg-white/90 border-2 border-alecia-red rounded-lg outline-none px-4 py-2 resize-none leading-relaxed shadow-lg"
            placeholder="Entrez le contenu..."
            rows={6}
            autoFocus
          />
          <div className="absolute -top-8 left-0 flex items-center gap-1 text-xs text-alecia-red bg-white px-2 py-1 rounded-full shadow">
            <Pencil className="w-3 h-3" />
            <span>Double-clic pour editer | Entree=OK | Echap=Annuler</span>
          </div>
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div
      className={`w-full h-full p-8 transition-all ${editIndicatorStyle}`}
      onDoubleClick={handleDoubleClick}
    >
      <p className="text-lg text-alecia-navy leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}