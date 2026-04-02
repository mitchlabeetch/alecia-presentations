import type { BlockContent } from '@/types';

interface Deal_RationaleProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Deal_Rationale({ content, isEditing = false, onChange }: Deal_RationaleProps) {
  const title = content.text || 'Justification de l\'opération';
  const description = content.caption || '';

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <div className="bg-alecia-red/5 rounded-xl p-6 border-l-4 border-alecia-red">
          <h3 className="text-lg font-bold text-alecia-navy mb-3">{title}</h3>
          <textarea
            value={description}
            className="w-full text-alecia-navy bg-transparent border-none outline-none focus:ring-2 focus:ring-alecia-red/30 rounded resize-none"
            rows={6}
            placeholder="Expliquez la justification de l'opération..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <div className="bg-alecia-red/5 rounded-xl p-6 border-l-4 border-alecia-red">
        <h3 className="text-lg font-bold text-alecia-navy mb-3">{title}</h3>
        <p className="text-alecia-navy whitespace-pre-wrap">{description}</p>
      </div>
    </div>
  );
}
