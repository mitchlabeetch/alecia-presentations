import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
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
  Navigation,
  LayoutTemplate,
  TrendingUp,
  PieChart,
  GitBranch,
  Award,
  Scissors,
  Briefcase,
  Clock,
  Shield,
  FileText,
  ImagePlus,
  MousePointer2,
  BookOpen,
  AlertTriangle,
  Percent,
  DollarSign,
  UserCheck,
  Star,
} from 'lucide-react';

// Types pour les blocs de la bibliothèque
export interface BlockLibraryItem {
  type: BlockType;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'Texte' | 'Financier' | 'M&A' | 'Équipe' | 'Mise en page' | 'Visuel';
}

// Définition de tous les blocs disponibles
const BLOCK_LIBRARY: BlockLibraryItem[] = [
  // TEXTE
  {
    type: 'Titre',
    name: 'Titre',
    description: 'Titre principal de la diapositive',
    icon: <Type className="w-4 h-4" />,
    category: 'Texte',
  },
  {
    type: 'Sous-titre',
    name: 'Sous-titre',
    description: 'Sous-titre ou description',
    icon: <Heading2 className="w-4 h-4" />,
    category: 'Texte',
  },
  {
    type: 'Paragraphe',
    name: 'Paragraphe',
    description: 'Bloc de texte descriptif',
    icon: <AlignLeft className="w-4 h-4" />,
    category: 'Texte',
  },
  {
    type: 'Liste',
    name: 'Liste',
    description: 'Liste à puces ou numérotée',
    icon: <List className="w-4 h-4" />,
    category: 'Texte',
  },
  {
    type: 'Citation',
    name: 'Citation',
    description: 'Citation ou témoignage',
    icon: <Quote className="w-4 h-4" />,
    category: 'Texte',
  },

  // FINANCIER
  {
    type: 'KPI_Card',
    name: 'Carte KPI',
    description: 'Indicateurs clés de performance',
    icon: <BarChart3 className="w-4 h-4" />,
    category: 'Financier',
  },
  {
    type: 'Chart_Block',
    name: 'Graphique',
    description: 'Graphique (barres, lignes, camembert)',
    icon: <PieChart className="w-4 h-4" />,
    category: 'Financier',
  },
  {
    type: 'Table_Block',
    name: 'Tableau',
    description: 'Tableau de données',
    icon: <Table className="w-4 h-4" />,
    category: 'Financier',
  },
  {
    type: 'Timeline_Block',
    name: 'Chronologie',
    description: 'Timeline ou frise chronologique',
    icon: <Clock className="w-4 h-4" />,
    category: 'Financier',
  },
  {
    type: 'Key_Metrics',
    name: 'Métriques clés',
    description: 'Ensemble de métriques financières',
    icon: <TrendingUp className="w-4 h-4" />,
    category: 'Financier',
  },

  // M&A
  {
    type: 'Company_Overview',
    name: 'Vue entreprise',
    description: 'Présentation de la société cible',
    icon: <Building2 className="w-4 h-4" />,
    category: 'M&A',
  },
  {
    type: 'Deal_Rationale',
    name: 'Logique du deal',
    description: 'Rationnel stratégique de la transaction',
    icon: <Target className="w-4 h-4" />,
    category: 'M&A',
  },
  {
    type: 'SWOT',
    name: 'Analyse SWOT',
    description: 'Forces, faiblesses, opportunités, menaces',
    icon: <Grid3X3 className="w-4 h-4" />,
    category: 'M&A',
  },
  {
    type: 'Process_Timeline',
    name: 'Processus',
    description: 'Étapes du processus M&A',
    icon: <GitBranch className="w-4 h-4" />,
    category: 'M&A',
  },
  {
    type: 'Cover',
    name: 'Couverture',
    description: 'Page de garde du pitch deck',
    icon: <LayoutTemplate className="w-4 h-4" />,
    category: 'M&A',
  },
  {
    type: 'Disclaimer',
    name: 'Avertissement',
    description: 'Clause de confidentialité',
    icon: <Shield className="w-4 h-4" />,
    category: 'M&A',
  },
  {
    type: 'Trackrecord_Block',
    name: 'Trackrecord',
    description: 'Historique des transactions',
    icon: <Award className="w-4 h-4" />,
    category: 'M&A',
  },

  // ÉQUIPE
  {
    type: 'Team_Grid',
    name: 'Équipe (grille)',
    description: 'Équipe en format grille',
    icon: <Users className="w-4 h-4" />,
    category: 'Équipe',
  },
  {
    type: 'Team_Row',
    name: 'Équipe (ligne)',
    description: 'Équipe en format horizontal',
    icon: <UserCheck className="w-4 h-4" />,
    category: 'Équipe',
  },
  {
    type: 'Advisor_List',
    name: 'Conseillers',
    description: 'Liste des conseillers',
    icon: <Briefcase className="w-4 h-4" />,
    category: 'Équipe',
  },

  // MISE EN PAGE
  {
    type: 'TwoColumn',
    name: 'Deux colonnes',
    description: 'Disposition en deux colonnes',
    icon: <Columns className="w-4 h-4" />,
    category: 'Mise en page',
  },
  {
    type: 'Section_Navigator',
    name: 'Navigation',
    description: 'Table des matières / navigation',
    icon: <Navigation className="w-4 h-4" />,
    category: 'Mise en page',
  },
  {
    type: 'SectionDivider',
    name: 'Séparateur',
    description: 'Séparateur de section',
    icon: <Scissors className="w-4 h-4" />,
    category: 'Mise en page',
  },

  // VISUEL
  {
    type: 'Image',
    name: 'Image',
    description: 'Image avec légende',
    icon: <ImageIcon className="w-4 h-4" />,
    category: 'Visuel',
  },
  {
    type: 'Logo_Grid',
    name: 'Grille logos',
    description: 'Logos de clients ou partenaires',
    icon: <Grid3X3 className="w-4 h-4" />,
    category: 'Visuel',
  },
  {
    type: 'Icon_Text',
    name: 'Icône + Texte',
    description: 'Bloc icône avec texte',
    icon: <MousePointer2 className="w-4 h-4" />,
    category: 'Visuel',
  },
];

// Catégories ordonnées
const CATEGORIES: BlockLibraryItem['category'][] = [
  'Mise en page',
  'Texte',
  'Financier',
  'M&A',
  'Équipe',
  'Visuel',
];

// Composant pour un bloc individualisable
interface DraggableBlockProps {
  block: BlockLibraryItem;
  onAdd?: (type: BlockType) => void;
}

function DraggableBlock({ block, onAdd }: DraggableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `block-library-${block.type}`,
    data: {
      type: 'block',
      blockType: block.type,
      name: block.name,
      description: block.description,
    },
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 999 : undefined,
      }
    : undefined;

  const handleClick = () => {
    onAdd?.(block.type);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        group flex items-center gap-2 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing
        transition-all duration-200 select-none
        ${isDragging
          ? 'opacity-50 bg-alecia-navy text-white shadow-lg scale-105'
          : 'hover:bg-alecia-navy/5 hover:shadow-sm'
        }
      `}
      onClick={handleClick}
      title={block.description}
    >
      <span className={`flex-shrink-0 ${isDragging ? 'text-white' : 'text-alecia-navy'}`}>
        {block.icon}
      </span>
      <span className={`text-sm font-medium truncate ${isDragging ? 'text-white' : 'text-alecia-navy'}`}>
        {block.name}
      </span>
    </div>
  );
}

// Contenu de la bibliothèque (utilisé à l'intérieur du DndProvider)
interface BlockLibraryContentProps {
  onAddBlock?: (type: BlockType) => void;
}

export function BlockLibraryContent({ onAddBlock }: BlockLibraryContentProps) {
  const categories = CATEGORIES.filter(
    (cat) => BLOCK_LIBRARY.some((block) => block.category === cat)
  );

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category}>
          <h4 className="text-xs font-semibold text-alecia-silver uppercase tracking-wide mb-2 px-1">
            {category}
          </h4>
          <div className="space-y-1">
            {BLOCK_LIBRARY.filter((b) => b.category === category).map((block) => (
              <DraggableBlock
                key={block.type}
                block={block}
                onAdd={onAddBlock}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Export pour le type
export { BLOCK_LIBRARY as BLOCKS };
