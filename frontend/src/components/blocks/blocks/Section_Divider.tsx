import type { BlockContent } from '@/types';

interface SectionDividerProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function SectionDivider({ content, isEditing = false, onChange }: SectionDividerProps) {
  const text = content.text || 'Nouvelle section';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({ ...content, text: e.target.value });
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-alecia-navy to-[#0a2a68]">
      <div className="flex items-center gap-4">
        <div className="w-16 h-px bg-alecia-red" />
        {isEditing ? (
          <input
            type="text"
            value={text}
            onChange={handleChange}
            className="text-3xl font-bold text-white bg-transparent border-none outline-none text-center"
            style={{ fontFamily: 'Bierstadt, sans-serif' }}
          />
        ) : (
          <h2
            className="text-3xl font-bold text-white"
            style={{ fontFamily: 'Bierstadt, sans-serif' }}
          >
            {text}
          </h2>
        )}
        <div className="w-16 h-px bg-alecia-red" />
      </div>
    </div>
  );
}
