import { useInlineEdit } from '@/hooks/useInlineEdit';
import type { BlockContent } from '@/types';
import { Pencil } from 'lucide-react';

interface Disclaimer_BlockProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Disclaimer_Block({ content, isEditing = false, onChange }: Disclaimer_BlockProps) {
  const text = content.text || 'Ce document est strictement confidentiel et a ete prepare exclusively a des fins d\'information. Les informations qu\'il contient sont considerees comme fiables, mais leur exactitude et leur exhaustivite ne sont pas garanties.';

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
  } = useInlineEdit({
    initialValue: text,
    onSave: handleSave,
  });

  // Mode d'edition global
  if (isEditing && !isInlineEditing) {
    return (
      <div className="w-full h-full p-8 flex items-end">
        <div className="w-full">
          <div className="flex items-center gap-2 text-xs text-alecia-silver mb-2">
            <Pencil className="w-3 h-3" />
            <span>Texte du disclaimer</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => onChange?.({ ...content, text: e.target.value })}
            className="w-full text-xs text-alecia-silver bg-white border-2 border-alecia-red/30 rounded p-3 resize-none"
            rows={4}
          />
        </div>
      </div>
    );
  }

  // Mode inline editing
  if (isInlineEditing) {
    return (
      <div className="w-full h-full p-8 flex items-end">
        <div className="w-full relative">
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full text-xs text-alecia-silver bg-white/90 border-2 border-alecia-red rounded p-3 resize-none shadow-lg"
            rows={4}
            autoFocus
          />
          <div className="absolute -top-8 left-0 flex items-center gap-1 text-xs text-alecia-red bg-white px-2 py-1 rounded-full shadow">
            <Pencil className="w-3 h-3" />
            <span>Entree=OK | Echap=Annuler</span>
          </div>
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full p-8 flex items-end">
      <p
        className={`text-xs text-alecia-silver leading-relaxed cursor-text hover:bg-alecia-silver/5 px-2 py-1 rounded transition-colors ${isEditing ? 'group' : ''}`}
        onDoubleClick={handleDoubleClick}
      >
        {text}
      </p>
    </div>
  );
}