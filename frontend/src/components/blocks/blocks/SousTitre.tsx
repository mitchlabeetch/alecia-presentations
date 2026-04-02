import type { BlockContent } from '@/types';

interface SousTitreProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function SousTitre({ content, isEditing = false, onChange }: SousTitreProps) {
  const text = content.text || 'Sous-titre';

  const handleChange = (e: React.ChangeEvent<HTMLParagraphElement>) => {
    if (onChange) {
      onChange({ ...content, text: e.target.value });
    }
  };

  if (isEditing) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          className="w-full text-center text-2xl text-alecia-silver bg-transparent border-none outline-none focus:ring-2 focus:ring-alecia-red/30 rounded"
          placeholder="Entrez le sous-titre..."
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <p className="text-2xl text-alecia-silver text-center">
        {text}
      </p>
    </div>
  );
}
