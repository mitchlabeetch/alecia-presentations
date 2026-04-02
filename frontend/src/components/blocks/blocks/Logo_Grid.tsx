import type { BlockContent } from '@/types';
import { Pencil } from 'lucide-react';

interface Logo_GridProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Logo_Grid({ content, isEditing = false, onChange }: Logo_GridProps) {
  const logos = content.items || [
    { name: 'Entreprise A', url: '' },
    { name: 'Entreprise B', url: '' },
    { name: 'Entreprise C', url: '' },
    { name: 'Entreprise D', url: '' },
    { name: 'Entreprise E', url: '' },
    { name: 'Entreprise F', url: '' },
  ];

  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6 text-center flex items-center justify-center gap-2">
        {isEditing && <Pencil className="w-4 h-4" />}
        Partenaires
      </h3>
      <div className="grid grid-cols-3 gap-6">
        {logos.map((logo: { name?: string; url?: string }, index: number) => (
          <div
            key={index}
            className="aspect-video bg-alecia-silver/10 rounded-xl flex items-center justify-center"
          >
            <span className="text-sm font-medium text-alecia-silver">
              {logo.name || `Logo ${index + 1}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}