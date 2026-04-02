import type { BlockContent } from '@/types';

interface Icon_TextProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Icon_Text({ content, isEditing = false, onChange }: Icon_TextProps) {
  const title = content.text || 'Titre';
  const description = content.caption || '';
  const icon = content.icon || '📌';

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({ ...content, text: e.target.value });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange({ ...content, caption: e.target.value });
    }
  };

  if (isEditing) {
    return (
      <div className="w-full h-full p-8 flex items-center gap-6">
        <div className="w-16 h-16 bg-alecia-navy/10 rounded-xl flex items-center justify-center text-3xl">
          {icon}
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full text-xl font-bold text-alecia-navy bg-transparent border-none outline-none focus:ring-2 focus:ring-alecia-red/30 rounded"
            placeholder="Titre"
          />
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            className="w-full text-alecia-silver bg-transparent border-none outline-none focus:ring-2 focus:ring-alecia-red/30 rounded resize-none mt-2"
            rows={2}
            placeholder="Description..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 flex items-center gap-6">
      <div className="w-16 h-16 bg-alecia-navy/10 rounded-xl flex items-center justify-center text-3xl">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-alecia-navy">{title}</h3>
        {description && (
          <p className="text-alecia-silver mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
