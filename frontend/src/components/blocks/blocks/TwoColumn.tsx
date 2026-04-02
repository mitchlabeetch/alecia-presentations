import type { BlockContent, SlideData } from '@/types';

interface TwoColumnProps {
  content: BlockContent;
  data?: SlideData | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function TwoColumn({ content, isEditing = false, onChange }: TwoColumnProps) {
  const leftText = content.text || '';
  const rightText = content.caption || '';

  const handleLeftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange({ ...content, text: e.target.value });
    }
  };

  const handleRightChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange({ ...content, caption: e.target.value });
    }
  };

  if (isEditing) {
    return (
      <div className="w-full h-full p-4 flex gap-8">
        <div className="flex-1">
          <label className="text-xs font-medium text-alecia-silver mb-2 block">Colonne gauche</label>
          <textarea
            value={leftText}
            onChange={handleLeftChange}
            className="w-full h-full text-alecia-navy bg-transparent border border-alecia-silver/20 rounded p-2 resize-none"
            placeholder="Contenu gauche..."
          />
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium text-alecia-silver mb-2 block">Colonne droite</label>
          <textarea
            value={rightText}
            onChange={handleRightChange}
            className="w-full h-full text-alecia-navy bg-transparent border border-alecia-silver/20 rounded p-2 resize-none"
            placeholder="Contenu droit..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 flex gap-12">
      <div className="flex-1">
        <div className="prose prose-alecia text-alecia-navy whitespace-pre-wrap">
          {leftText || <span className="text-alecia-silver italic">Colonne gauche</span>}
        </div>
      </div>
      <div className="flex-1">
        <div className="prose prose-alecia text-alecia-navy whitespace-pre-wrap">
          {rightText || <span className="text-alecia-silver italic">Colonne droite</span>}
        </div>
      </div>
    </div>
  );
}
