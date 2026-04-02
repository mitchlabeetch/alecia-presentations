import type { BlockContent } from '@/types';

interface ParagrapheProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Paragraphe({ content, isEditing = false, onChange }: ParagrapheProps) {
  const text = content.text || 'Contenu du paragraphe';

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange({ ...content, text: e.target.value });
    }
  };

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <textarea
          value={text}
          onChange={handleChange}
          className="w-full h-full text-lg text-alecia-navy bg-transparent border-none outline-none focus:ring-2 focus:ring-alecia-red/30 rounded resize-none leading-relaxed"
          placeholder="Entrez le contenu..."
          rows={6}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <p className="text-lg text-alecia-navy leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}
