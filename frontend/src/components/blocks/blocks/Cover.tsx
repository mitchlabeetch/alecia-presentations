import { useInlineEdit } from '@/hooks/useInlineEdit';
import type { BlockContent } from '@/types';
import { AleciaLogo } from '@/components/ui/AleciaLogo';
import { Pencil } from 'lucide-react';

interface CoverProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Cover({ content, isEditing = false, onChange }: CoverProps) {
  const title = content.text || 'Titre du projet';
  const subtitle = content.caption || 'Description du projet';

  const handleTitleSave = (newTitle: string) => {
    if (onChange && newTitle !== title) {
      onChange({ ...content, text: newTitle });
    }
  };

  const handleSubtitleSave = (newSubtitle: string) => {
    if (onChange && newSubtitle !== subtitle) {
      onChange({ ...content, caption: newSubtitle });
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
    isEditing: isSubtitleEditing,
    value: subtitleValue,
    handleDoubleClick: subtitleDoubleClick,
    handleBlur: subtitleBlur,
    handleKeyDown: subtitleKeyDown,
    handleChange: subtitleChange,
    inputRef: subtitleRef,
  } = useInlineEdit({
    initialValue: subtitle,
    onSave: handleSubtitleSave,
  });

  // Mode d'edition global
  if (isEditing && !isTitleEditing && !isSubtitleEditing) {
    return (
      <div className="w-full h-full flex">
        {/* Left panel - decorative pattern */}
        <div className="w-2/5 bg-gradient-to-br from-[#b80c09] via-[#ff6b35] to-[#f7c948]" />

        {/* Right panel - content */}
        <div className="flex-1 bg-white p-16 flex flex-col justify-center items-center">
          <AleciaLogo className="h-12 text-alecia-navy mb-8" />
          <div className="w-full">
            <input
              type="text"
              value={title}
              onChange={(e) => onChange?.({ ...content, text: e.target.value })}
              className="w-full text-4xl font-bold text-alecia-navy text-center bg-white/80 border-2 border-alecia-red/30 rounded-lg px-4 py-2"
              style={{ fontFamily: 'Bierstadt, sans-serif' }}
            />
            <input
              type="text"
              value={subtitle}
              onChange={(e) => onChange?.({ ...content, caption: e.target.value })}
              className="mt-4 w-full text-xl text-alecia-silver text-center bg-white/80 border-2 border-alecia-red/30 rounded-lg px-4 py-2"
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-alecia-red">
            <Pencil className="w-3 h-3" />
            <span>Double-cliquez sur un element pour l'editer</span>
          </div>
        </div>
      </div>
    );
  }

  // Mode inline editing - titre
  if (isTitleEditing) {
    return (
      <div className="w-full h-full flex">
        <div className="w-2/5 bg-gradient-to-br from-[#b80c09] via-[#ff6b35] to-[#f7c948]" />
        <div className="flex-1 bg-white p-16 flex flex-col justify-center items-center">
          <AleciaLogo className="h-12 text-alecia-navy mb-8" />
          <input
            ref={titleRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={titleValue}
            onChange={titleChange}
            onBlur={titleBlur}
            onKeyDown={titleKeyDown}
            className="w-full text-4xl font-bold text-alecia-navy text-center bg-white/90 border-2 border-alecia-red rounded-lg px-4 py-2 shadow-lg"
            style={{ fontFamily: 'Bierstadt, sans-serif' }}
            autoFocus
          />
          {subtitle && (
            <p className="mt-4 text-xl text-alecia-silver text-center">{subtitle}</p>
          )}
        </div>
      </div>
    );
  }

  // Mode inline editing - sous-titre
  if (isSubtitleEditing) {
    return (
      <div className="w-full h-full flex">
        <div className="w-2/5 bg-gradient-to-br from-[#b80c09] via-[#ff6b35] to-[#f7c948]" />
        <div className="flex-1 bg-white p-16 flex flex-col justify-center items-center">
          <AleciaLogo className="h-12 text-alecia-navy mb-8" />
          <h1
            className="text-4xl font-bold text-alecia-navy text-center"
            style={{ fontFamily: 'Bierstadt, sans-serif' }}
          >
            {title}
          </h1>
          <input
            ref={subtitleRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={subtitleValue}
            onChange={subtitleChange}
            onBlur={subtitleBlur}
            onKeyDown={subtitleKeyDown}
            className="mt-4 w-full text-xl text-alecia-silver text-center bg-white/90 border-2 border-alecia-red rounded-lg px-4 py-2 shadow-lg"
            autoFocus
          />
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full flex">
      <div className="w-2/5 bg-gradient-to-br from-[#b80c09] via-[#ff6b35] to-[#f7c948]" />
      <div className="flex-1 bg-white p-16 flex flex-col justify-center items-center">
        <AleciaLogo className="h-12 text-alecia-navy mb-8" />
        <h1
          className="text-4xl font-bold text-alecia-navy text-center cursor-text hover:bg-alecia-silver/10 px-4 py-2 rounded transition-colors"
          style={{ fontFamily: 'Bierstadt, sans-serif' }}
          onDoubleClick={titleDoubleClick}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-4 text-xl text-alecia-silver text-center cursor-text hover:bg-alecia-silver/10 px-4 py-2 rounded transition-colors"
            onDoubleClick={subtitleDoubleClick}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}