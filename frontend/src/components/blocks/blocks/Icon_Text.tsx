import { useInlineEdit } from '@/hooks/useInlineEdit';
import type { BlockContent } from '@/types';
import { Pencil } from 'lucide-react';

interface Icon_TextProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Icon_Text({ content, isEditing = false, onChange }: Icon_TextProps) {
  const title = content.text || 'Titre';
  const description = content.caption || '';
  const icon = content.icon || '📌';

  const handleTitleSave = (newTitle: string) => {
    if (onChange && newTitle !== title) {
      onChange({ ...content, text: newTitle });
    }
  };

  const handleDescriptionSave = (newDescription: string) => {
    if (onChange && newDescription !== description) {
      onChange({ ...content, caption: newDescription });
    }
  };

  const {
    isEditing: isTitleEditing,
    value: titleValue,
    handleDoubleClick: titleDoubleClick,
    handleBlur: titleBlur,
    handleKeyDown: titleKeyDown,
    handleChange: titleChange,
    inputRef: titleRef,
  } = useInlineEdit({
    initialValue: title,
    onSave: handleTitleSave,
  });

  const {
    isEditing: isDescriptionEditing,
    value: descriptionValue,
    handleDoubleClick: descriptionDoubleClick,
    handleBlur: descriptionBlur,
    handleKeyDown: descriptionKeyDown,
    handleChange: descriptionChange,
    inputRef: descriptionRef,
  } = useInlineEdit({
    initialValue: description,
    onSave: handleDescriptionSave,
  });

  // Mode d'edition global
  if (isEditing && !isTitleEditing && !isDescriptionEditing) {
    return (
      <div className="w-full h-full p-8 flex items-center gap-6">
        <div className="w-16 h-16 bg-alecia-navy/10 rounded-xl flex items-center justify-center text-3xl">
          {icon}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => onChange?.({ ...content, text: e.target.value })}
            className="w-full text-xl font-bold text-alecia-navy bg-white border-2 border-alecia-red/30 rounded px-3 py-2 outline-none"
            placeholder="Titre"
          />
          <textarea
            value={description}
            onChange={(e) => onChange?.({ ...content, caption: e.target.value })}
            className="w-full text-alecia-silver bg-white border-2 border-alecia-red/30 rounded px-3 py-2 resize-none outline-none"
            rows={2}
            placeholder="Description..."
          />
        </div>
      </div>
    );
  }

  // Mode inline editing - titre
  if (isTitleEditing) {
    return (
      <div className="w-full h-full p-8 flex items-center gap-6">
        <div className="w-16 h-16 bg-alecia-navy/10 rounded-xl flex items-center justify-center text-3xl">
          {icon}
        </div>
        <div className="flex-1 relative">
          <input
            ref={titleRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={titleValue}
            onChange={titleChange}
            onBlur={titleBlur}
            onKeyDown={titleKeyDown}
            className="w-full text-xl font-bold text-alecia-navy bg-white/90 border-2 border-alecia-red rounded px-3 py-2 outline-none shadow-lg"
            placeholder="Titre"
            autoFocus
          />
          <div className="absolute -top-8 left-0 flex items-center gap-1 text-xs text-alecia-red bg-white px-2 py-1 rounded-full shadow">
            <Pencil className="w-3 h-3" />
            <span>Entree=OK | Echap=Annuler</span>
          </div>
          {description && (
            <p className="text-alecia-silver mt-2">{description}</p>
          )}
        </div>
      </div>
    );
  }

  // Mode inline editing - description
  if (isDescriptionEditing) {
    return (
      <div className="w-full h-full p-8 flex items-center gap-6">
        <div className="w-16 h-16 bg-alecia-navy/10 rounded-xl flex items-center justify-center text-3xl">
          {icon}
        </div>
        <div className="flex-1 relative">
          <h3 className="text-xl font-bold text-alecia-navy mb-2 cursor-text hover:bg-alecia-silver/10 px-2 py-1 rounded" onClick={titleDoubleClick}>
            {title}
          </h3>
          <textarea
            ref={descriptionRef as React.RefObject<HTMLTextAreaElement>}
            value={descriptionValue}
            onChange={descriptionChange}
            onBlur={descriptionBlur}
            onKeyDown={descriptionKeyDown}
            className="w-full text-alecia-silver bg-white/90 border-2 border-alecia-red rounded px-3 py-2 resize-none outline-none shadow-lg"
            rows={2}
            placeholder="Description..."
            autoFocus
          />
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full p-8 flex items-center gap-6">
      <div className="w-16 h-16 bg-alecia-navy/10 rounded-xl flex items-center justify-center text-3xl">
        {icon}
      </div>
      <div className="flex-1">
        <h3
          className={`text-xl font-bold text-alecia-navy cursor-text hover:bg-alecia-silver/10 px-2 py-1 rounded transition-colors ${isEditing ? 'group' : ''}`}
          onClick={titleDoubleClick}
        >
          {title}
        </h3>
        {description && (
          <p
            className={`text-alecia-silver mt-1 cursor-text hover:bg-alecia-silver/10 px-2 py-1 rounded transition-colors ${isEditing ? 'group' : ''}`}
            onClick={descriptionDoubleClick}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}