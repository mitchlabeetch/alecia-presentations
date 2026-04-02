import type { BlockContent } from '@/types';

interface Company_OverviewProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Company_Overview({ content, isEditing = false, onChange }: Company_OverviewProps) {
  const title = content.text || 'Présentation de l\'entreprise';
  const description = content.caption || '';

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-alecia-navy rounded-xl flex items-center justify-center">
            <span className="text-4xl font-bold text-white">Logo</span>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={title}
              className="text-2xl font-bold text-alecia-navy bg-transparent border-none outline-none focus:ring-2 focus:ring-alecia-red/30 rounded w-full mb-4"
              placeholder="Nom de l'entreprise"
            />
            <textarea
              value={description}
              className="w-full text-alecia-silver bg-transparent border-none outline-none focus:ring-2 focus:ring-alecia-red/30 rounded resize-none"
              rows={4}
              placeholder="Description de l'entreprise..."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <div className="flex items-start gap-6">
        <div className="w-32 h-32 bg-alecia-navy rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-4xl font-bold text-white">Logo</span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-alecia-navy mb-4">{title}</h2>
          <p className="text-alecia-silver whitespace-pre-wrap">{description}</p>
        </div>
      </div>
    </div>
  );
}
