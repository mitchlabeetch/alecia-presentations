import type { BlockContent } from '@/types';

interface Disclaimer_BlockProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Disclaimer_Block({ content, isEditing = false, onChange }: Disclaimer_BlockProps) {
  const text = content.text || 'Ce document est strictement confidentiel et a été préparé exclusively à des fins d\'information. Les informations qu\'il contient sont considérées comme fiables, mais leur exactitude et leur exhaustivité ne sont pas garanties.';

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange({ ...content, text: e.target.value });
    }
  };

  if (isEditing) {
    return (
      <div className="w-full h-full p-8 flex items-end">
        <div className="w-full">
          <textarea
            value={text}
            onChange={handleChange}
            className="w-full text-xs text-alecia-silver bg-transparent border border-alecia-silver/20 rounded p-3 resize-none"
            rows={4}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 flex items-end">
      <p className="text-xs text-alecia-silver leading-relaxed">
        {text}
      </p>
    </div>
  );
}
