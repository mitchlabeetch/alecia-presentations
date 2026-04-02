import type { BlockContent } from '@/types';

interface Logo_GridProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Logo_Grid({ content, isEditing = false, onChange }: Logo_GridProps) {
  const logos = [
    { name: 'Entreprise A', url: '' },
    { name: 'Entreprise B', url: '' },
    { name: 'Entreprise C', url: '' },
    { name: 'Entreprise D', url: '' },
    { name: 'Entreprise E', url: '' },
    { name: 'Entreprise F', url: '' },
  ];

  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6 text-center">Partenaires</h3>
      <div className="grid grid-cols-3 gap-6">
        {logos.map((logo, index) => (
          <div
            key={index}
            className="aspect-video bg-alecia-silver/10 rounded-xl flex items-center justify-center"
          >
            <span className="text-sm font-medium text-alecia-silver">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
