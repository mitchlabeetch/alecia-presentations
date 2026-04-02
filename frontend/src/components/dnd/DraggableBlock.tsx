import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { BlockType } from '@/types';

interface DraggableBlockProps {
  id: string;
  type: BlockType;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function DraggableBlock({ id, type, label, icon, onClick }: DraggableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type, label },
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 999 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-2 p-2 rounded-lg cursor-grab active:cursor-grabbing
        transition-all duration-200
        ${isDragging ? 'opacity-50 shadow-lg' : 'hover:bg-alecia-silver/10'}
      `}
      onClick={onClick}
    >
      {icon && (
        <span className="flex-shrink-0 text-alecia-navy">
          {icon}
        </span>
      )}
      <span className="text-sm text-alecia-navy">{label}</span>
    </div>
  );
}

interface DraggableBlockLibraryProps {
  onAddBlock?: (type: BlockType) => void;
}

export function DraggableBlockLibrary({ onAddBlock }: DraggableBlockLibraryProps) {
  const blocks: { type: BlockType; label: string; category: string }[] = [
    { type: 'Titre', label: 'Titre', category: 'Texte' },
    { type: 'Sous-titre', label: 'Sous-titre', category: 'Texte' },
    { type: 'Paragraphe', label: 'Paragraphe', category: 'Texte' },
    { type: 'Liste', label: 'Liste', category: 'Texte' },
    { type: 'Citation', label: 'Citation', category: 'Texte' },
    { type: 'TwoColumn', label: 'Deux colonnes', category: 'Mise en page' },
    { type: 'SectionNavigator', label: 'Navigation', category: 'Mise en page' },
    { type: 'Cover', label: 'Couverture', category: 'Mise en page' },
    { type: 'SectionDivider', label: 'Séparateur', category: 'Mise en page' },
    { type: 'KPI_Card', label: 'Indicateur KPI', category: 'Financier' },
    { type: 'Table_Block', label: 'Tableau', category: 'Financier' },
    { type: 'Chart_Block', label: 'Graphique', category: 'Financier' },
    { type: 'Timeline_Block', label: 'Chronologie', category: 'Financier' },
    { type: 'Company_Overview', label: 'Entreprise', category: 'M&A' },
    { type: 'Deal_Rationale', label: 'Logique deal', category: 'M&A' },
    { type: 'SWOT', label: 'Analyse SWOT', category: 'M&A' },
    { type: 'Key_Metrics', label: 'Métriques clés', category: 'M&A' },
    { type: 'Process_Timeline', label: 'Processus', category: 'M&A' },
    { type: 'Team_Grid', label: 'Équipe (grille)', category: 'Équipe' },
    { type: 'Team_Row', label: 'Équipe (ligne)', category: 'Équipe' },
    { type: 'Advisor_List', label: 'Conseillers', category: 'Équipe' },
    { type: 'Image', label: 'Image', category: 'Visuel' },
    { type: 'Logo_Grid', label: 'Logos', category: 'Visuel' },
    { type: 'Icon_Text', label: 'Icône + Texte', category: 'Visuel' },
    { type: 'Trackrecord_Block', label: 'Trackrecord', category: 'Visuel' },
    { type: 'Disclaimer', label: 'Avertissement', category: 'Visuel' },
  ];

  const categories = [...new Set(blocks.map((b) => b.category))];

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category}>
          <h4 className="text-xs font-semibold text-alecia-silver uppercase tracking-wide mb-2">
            {category}
          </h4>
          <div className="space-y-1">
            {blocks
              .filter((b) => b.category === category)
              .map((block) => (
                <DraggableBlock
                  key={block.type}
                  id={`block-${block.type}`}
                  type={block.type}
                  label={block.label}
                  onClick={() => onAddBlock?.(block.type)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
