import type { BlockContent } from '@/types';

interface TitreProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Titre({ content, isEditing = false, onChange }: TitreProps) {
  const text = content.text || 'Titre de la slide';

  const handleChange = (e: React.ChangeEvent<HTMLHeadingElement>) => {
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
          className="w-full text-center text-5xl font-bold text-alecia-navy bg-transparent border-none outline-none focus:ring-2 focus:ring-alecia-red/30 rounded"
          placeholder="Entrez le titre..."
          style={{ fontFamily: 'Bierstadt, sans-serif' }}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <h1
        className="text-5xl font-bold text-alecia-navy text-center"
        style={{ fontFamily: 'Bierstadt, sans-serif' }}
      >
        {text}
      </h1>
    </div>
  );
}
