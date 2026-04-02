import type { BlockContent } from '@/types';
import { AleciaLogo } from '@/components/ui/AleciaLogo';

interface CoverProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Cover({ content, isEditing = false, onChange }: CoverProps) {
  const title = content.text || 'Titre du projet';
  const subtitle = content.caption || 'Description du projet';

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({ ...content, text: e.target.value });
    }
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({ ...content, caption: e.target.value });
    }
  };

  return (
    <div className="w-full h-full flex">
      {/* Left panel - decorative pattern */}
      <div className="w-2/5 bg-gradient-to-br from-[#b80c09] via-[#ff6b35] to-[#f7c948]" />

      {/* Right panel - content */}
      <div className="flex-1 bg-white p-16 flex flex-col justify-center items-center">
        {isEditing ? (
          <>
            <AleciaLogo className="h-12 text-alecia-navy mb-8" />
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-4xl font-bold text-alecia-navy text-center bg-transparent border-none outline-none focus:ring-2 focus:ring-alecia-red/30 rounded px-4 py-2 w-full"
              style={{ fontFamily: 'Bierstadt, sans-serif' }}
            />
            <input
              type="text"
              value={subtitle}
              onChange={handleSubtitleChange}
              className="mt-4 text-xl text-alecia-silver text-center bg-transparent border-none outline-none focus:ring-2 focus:ring-alecia-red/30 rounded px-4 py-2 w-full"
            />
          </>
        ) : (
          <>
            <AleciaLogo className="h-12 text-alecia-navy mb-8" />
            <h1
              className="text-4xl font-bold text-alecia-navy text-center"
              style={{ fontFamily: 'Bierstadt, sans-serif' }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 text-xl text-alecia-silver text-center">{subtitle}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
