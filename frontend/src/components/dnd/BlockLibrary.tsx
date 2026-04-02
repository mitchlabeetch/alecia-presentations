import { useDraggable } from '@dnd-kit/core';
import type { BlockType } from '@/types';
import { 
  Type, 
  Heading2, 
  AlignLeft, 
  List, 
  Quote,
  BarChart3,
  Table,
  Image as ImageIcon,
  Users,
  Building2,
  Target,
  Grid3X3,
  Columns,
  Navigation
} from 'lucide-react';

interface BlockItem {
  type: BlockType;
  name: string;
  icon: React.ReactNode;
  category: string;
}

const BLOCKS: BlockItem[] = [
  // Text blocks
  { type: 'Titre', name: 'Titre', icon: <Type className="w-4 h-4" />, category: 'Texte' },
  { type: 'Sous-titre', name: 'Sous-titre', icon: <Heading2 className="w-4 h-4" />, category: 'Texte' },
  { type: 'Paragraphe', name: 'Paragraphe', icon: <AlignLeft className="w-4 h-4" />, category: 'Texte' },
  { type: 'Liste', name: 'Liste', icon: <List className="w-4 h-4" />, category: 'Texte' },
  { type: 'Citation', name: 'Citation', icon: <Quote className="w-4 h-4" />, category: 'Texte' },
  
  // Financial blocks
  { type: 'KPI_Card', name: 'Carte KPI', icon: <BarChart3 className="w-4 h-4" />, category: 'Financier' },
  { type: 'Table_Block', name: 'Tableau', icon: <Table className="w-4 h-4" />, category: 'Financier' },
  
  // M&A blocks
  { type: 'Company_Overview', name: 'Vue entreprise', icon: <Building2 className="w-4 h-4" />, category: 'M&A' },
  { type: 'Deal_Rationale', name: 'Logique deal', icon: <Target className="w-4 h-4" />, category: 'M&A' },
  
  // Team blocks
  { type: 'Team_Row', name: 'Équipe', icon: <Users className="w-4 h-4" />, category: 'Équipe' },
  
  // Visual blocks
  { type: 'Image', name: 'Image', icon: <ImageIcon className="w-4 h-4" />, category: 'Visuel' },
  { type: 'Logo_Grid', name: 'Grille logos', icon: <Grid3X3 className="w-4 h-4" />, category: 'Visuel' },
  
  // Layout blocks
  { type: 'Two_Column', name: '2 colonnes', icon: <Columns className="w-4 h-4" />, category: 'Layout' },
  { type: 'Section_Navigator', name: 'Navigateur', icon: <Navigation className="w-4 h-4" />, category: 'Navigation' },
];

export function BlockLibrary() {
  const categories = Array.from(new Set(BLOCKS.map(b => b.category)));

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-alecia-silver/20">
        <h3 className="font-semibold text-alecia-navy">Bibliothèque de blocs</h3>
        <p className="text-xs text-alecia-silver mt-1">
          Glissez-déposez pour ajouter
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
        {categories.map(category => (
          <div key={category}>
            <h4 className="text-xs font-medium text-alecia-silver uppercase tracking-wider px-2 mb-2">
              {category}
            </h4>
            <div className="space-y-1">
              {BLOCKS.filter(b => b.category === category).map(block => (
                <DraggableBlock key={block.type} block={block} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DraggableBlockProps {
  block: BlockItem;
}

function DraggableBlock({ block }: DraggableBlockProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: block.type,
    data: block,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-grab transition-all ${
        isDragging 
          ? 'opacity-50 bg-alecia-navy text-white' 
          : 'hover:bg-alecia-silver/10 text-alecia-navy'
      }`}
    >
      {block.icon}
      <span className="text-sm">{block.name}</span>
    </div>
  );
}
