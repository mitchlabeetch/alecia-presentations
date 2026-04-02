import { useInlineEdit } from '@/hooks/useInlineEdit';
import type { BlockContent } from '@/types';
import { Pencil } from 'lucide-react';

interface CitationProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Citation({ content, isEditing = false, onChange }: CitationProps) {
  const text = content.text || 'Citation';
  const caption = content.caption || '';

  const handleTextSave = (newText: string) => {
    if (onChange && newText !== text) {
      onChange({ ...content, text: newText });
    }
  };

  const handleCaptionSave = (newCaption: string) => {
    if (onChange && newCaption !== caption) {
      onChange({ ...content, caption: newCaption });
    }
  };

  const {
    isEditing: isTextEditing,
    value: textValue,
    handleDoubleClick: textDoubleClick,
    handleBlur: textBlur,
    handleKeyDown: textKeyDown,
    handleChange: textChange,
    inputRef: textRef,
  } = useInlineEdit({
    initialValue: text,
    onSave: handleTextSave,
  });

  const {
    isEditing: isCaptionEditing,
    value: captionValue,
    handleDoubleClick: captionDoubleClick,
    handleBlur: captionBlur,
    handleKeyDown: captionKeyDown,
    handleChange: captionChange,
    inputRef: captionRef,
  } = useInlineEdit({
    initialValue: caption,
    onSave: handleCaptionSave,
  });

  // Mode d'edition global
  if (isEditing && !isTextEditing && !isCaptionEditing) {
    return (
      <div className="w-full h-full p-8 flex flex-col justify-center">
        <div className="relative">
          <div className="absolute -left-4 top-0 text-6xl text-alecia-red/30">"</div>
          <textarea
            value={text}
            onChange={(e) => onChange?.({ ...content, text: e.target.value })}
            className="w-full text-2xl text-alecia-navy italic bg-white/80 border-2 border-alecia-red/30 rounded p-3 resize-none leading-relaxed pl-8"
            rows={3}
            placeholder="Entrez la citation..."
          />
        </div>
        <input
          type="text"
          value={caption}
          onChange={(e) => onChange?.({ ...content, caption: e.target.value })}
          className="mt-4 w-full text-right text-alecia-silver bg-white/80 border-2 border-alecia-red/30 rounded px-3 py-2 italic"
          placeholder="— Source"
        />
      </div>
    );
  }

  // Mode inline editing - citation
  if (isTextEditing) {
    return (
      <div className="w-full h-full p-8 flex flex-col justify-center">
        <div className="relative">
          <div className="absolute -left-4 top-0 text-6xl text-alecia-red/30">"</div>
          <textarea
            ref={textRef as React.RefObject<HTMLTextAreaElement>}
            value={textValue}
            onChange={textChange}
            onBlur={textBlur}
            onKeyDown={textKeyDown}
            className="w-full text-2xl text-alecia-navy italic bg-white/90 border-2 border-alecia-red rounded p-3 resize-none leading-relaxed pl-8 shadow-lg"
            rows={3}
            placeholder="Entrez la citation..."
            autoFocus
          />
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-alecia-red">
          <Pencil className="w-3 h-3" />
          <span>Entree=OK | Echap=Annuler</span>
        </div>
      </div>
    );
  }

  // Mode inline editing - caption
  if (isCaptionEditing) {
    return (
      <div className="w-full h-full p-8 flex flex-col justify-center">
        <div className="relative">
          <div className="absolute -left-4 top-0 text-6xl text-alecia-red/30">"</div>
          <p className="text-2xl text-alecia-navy italic leading-relaxed pl-8">{text}</p>
        </div>
        <div className="mt-4 relative">
          <input
            ref={captionRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={captionValue}
            onChange={captionChange}
            onBlur={captionBlur}
            onKeyDown={captionKeyDown}
            className="w-full text-right text-alecia-silver italic bg-white/90 border-2 border-alecia-red rounded px-3 py-2 shadow-lg"
            placeholder="— Source"
            autoFocus
          />
          <div className="absolute -bottom-6 right-0 flex items-center gap-2 text-xs text-alecia-red">
            <Pencil className="w-3 h-3" />
            <span>Entree=OK | Echap=Annuler</span>
          </div>
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full p-8 flex flex-col justify-center">
      <div
        className="relative cursor-text hover:bg-alecia-silver/5 p-2 rounded transition-colors"
        onDoubleClick={textDoubleClick}
      >
        <div className="absolute -left-4 top-0 text-6xl text-alecia-red/30">"</div>
        <p className="text-2xl text-alecia-navy italic leading-relaxed pl-8">
          {text}
        </p>
      </div>
      {caption && (
        <p
          className="mt-4 text-right text-alecia-silver italic cursor-text hover:bg-alecia-silver/5 px-2 py-1 rounded transition-colors"
          onDoubleClick={captionDoubleClick}
        >
          — {caption}
        </p>
      )}
    </div>
  );
}