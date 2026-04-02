import type { BlockContent } from '@/types';

interface CitationProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Citation({ content, isEditing = false, onChange }: CitationProps) {
  const text = content.text || 'Citation';
  const caption = content.caption || '';

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange({ ...content, text: e.target.value });
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({ ...content, caption: e.target.value });
    }
  };

  if (isEditing) {
    return (
      <div className="w-full h-full p-8 flex flex-col justify-center">
        <div className="relative">
          <div className="absolute -left-4 top-0 text-6xl text-alecia-red/30">"</div>
          <textarea
            value={text}
            onChange={handleTextChange}
            className="w-full text-2xl text-alecia-navy italic bg-transparent border-none outline-none focus:ring-2 focus:ring-alecia-red/30 rounded resize-none leading-relaxed pl-8"
            rows={3}
            placeholder="Entrez la citation..."
          />
        </div>
        <input
          type="text"
          value={caption}
          onChange={handleCaptionChange}
          className="mt-4 w-full text-right text-alecia-silver bg-transparent border-none outline-none focus:ring-2 focus:ring-alecia-red/30 rounded italic"
          placeholder="— Source"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 flex flex-col justify-center">
      <div className="relative">
        <div className="absolute -left-4 top-0 text-6xl text-alecia-red/30">"</div>
        <p className="text-2xl text-alecia-navy italic leading-relaxed pl-8">
          {text}
        </p>
      </div>
      {caption && (
        <p className="mt-4 text-right text-alecia-silver italic">— {caption}</p>
      )}
    </div>
  );
}
