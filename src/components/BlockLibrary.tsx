import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  Image,
  Video,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Quote,
  List,
  CheckSquare,
  Calendar,
  MapPin,
  Link,
  Code,
  Divide,
  Search,
  Grid3X3,
  Layout,
  Star,
} from 'lucide-react';
import { Input } from './Input';
import { Tabs } from './Tabs';
import { Tooltip } from './Tooltip';

export type BlockCategory =
  | 'all'
  | 'text'
  | 'media'
  | 'charts'
  | 'data'
  | 'layout'
  | 'favorites'
  | 'recent';

export interface BlockItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: BlockCategory;
  isFavorite?: boolean;
  lastUsed?: string;
  preview?: string;
}

export interface BlockLibraryProps {
  onBlockSelect?: (block: BlockItem) => void;
  onBlockDragStart?: (block: BlockItem) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  recentBlocks?: BlockItem[];
  favoriteBlocks?: BlockItem[];
}

const defaultBlocks: BlockItem[] = [
  // Text blocks
  {
    id: 'heading',
    name: 'Titre',
    description: 'Titre de section',
    icon: <Type className="w-5 h-5" />,
    category: 'text',
  },
  {
    id: 'paragraph',
    name: 'Paragraphe',
    description: 'Bloc de texte',
    icon: <Type className="w-5 h-5" />,
    category: 'text',
  },
  {
    id: 'quote',
    name: 'Citation',
    description: 'Citation stylisée',
    icon: <Quote className="w-5 h-5" />,
    category: 'text',
  },
  {
    id: 'list',
    name: 'Liste',
    description: 'Liste à puces',
    icon: <List className="w-5 h-5" />,
    category: 'text',
  },

  // Media blocks
  {
    id: 'image',
    name: 'Image',
    description: 'Insérer une image',
    icon: <Image className="w-5 h-5" />,
    category: 'media',
  },
  {
    id: 'video',
    name: 'Vidéo',
    description: 'Vidéo intégrée',
    icon: <Video className="w-5 h-5" />,
    category: 'media',
  },

  // Chart blocks
  {
    id: 'bar-chart',
    name: 'Graphique à barres',
    description: 'Diagramme en barres',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'charts',
  },
  {
    id: 'pie-chart',
    name: 'Graphique circulaire',
    description: 'Diagramme circulaire',
    icon: <PieChart className="w-5 h-5" />,
    category: 'charts',
  },
  {
    id: 'line-chart',
    name: 'Graphique linéaire',
    description: 'Courbe de tendance',
    icon: <LineChart className="w-5 h-5" />,
    category: 'charts',
  },

  // Data blocks
  {
    id: 'table',
    name: 'Tableau',
    description: 'Tableau de données',
    icon: <Table className="w-5 h-5" />,
    category: 'data',
  },
  {
    id: 'checklist',
    name: 'Checklist',
    description: 'Liste de cases à cocher',
    icon: <CheckSquare className="w-5 h-5" />,
    category: 'data',
  },
  {
    id: 'calendar',
    name: 'Calendrier',
    description: 'Vue calendrier',
    icon: <Calendar className="w-5 h-5" />,
    category: 'data',
  },

  // Layout blocks
  {
    id: 'divider',
    name: 'Séparateur',
    description: 'Ligne de séparation',
    icon: <Divide className="w-5 h-5" />,
    category: 'layout',
  },
  {
    id: 'two-columns',
    name: 'Deux colonnes',
    description: 'Mise en page 2 colonnes',
    icon: <Layout className="w-5 h-5" />,
    category: 'layout',
  },
  {
    id: 'three-columns',
    name: 'Trois colonnes',
    description: 'Mise en page 3 colonnes',
    icon: <Grid3X3 className="w-5 h-5" />,
    category: 'layout',
  },

  // Other
  {
    id: 'map',
    name: 'Carte',
    description: 'Carte géographique',
    icon: <MapPin className="w-5 h-5" />,
    category: 'data',
  },
  {
    id: 'link',
    name: 'Lien',
    description: 'Lien hypertexte',
    icon: <Link className="w-5 h-5" />,
    category: 'text',
  },
  {
    id: 'code',
    name: 'Code',
    description: 'Bloc de code',
    icon: <Code className="w-5 h-5" />,
    category: 'text',
  },
];

export const BlockLibrary: React.FC<BlockLibraryProps> = ({
  onBlockSelect,
  onBlockDragStart,
  collapsed = false,
  onToggleCollapse,
  recentBlocks: _recentBlocks = [],
  favoriteBlocks: _favoriteBlocks = [],
}) => {
  const [activeTab, setActiveTab] = useState<BlockCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const tabs = [
    { id: 'all', label: 'Tous', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'text', label: 'Texte', icon: <Type className="w-4 h-4" /> },
    { id: 'media', label: 'Média', icon: <Image className="w-4 h-4" /> },
    { id: 'charts', label: 'Graphiques', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'data', label: 'Données', icon: <Table className="w-4 h-4" /> },
    { id: 'layout', label: 'Mise en page', icon: <Layout className="w-4 h-4" /> },
  ];

  const toggleFavorite = (blockId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(blockId)) {
        newFavorites.delete(blockId);
      } else {
        newFavorites.add(blockId);
      }
      return newFavorites;
    });
  };

  const filteredBlocks = defaultBlocks.filter((block) => {
    const matchesCategory = activeTab === 'all' || block.category === activeTab;
    const matchesSearch =
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (collapsed) {
    return (
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 64 }}
        className="h-full bg-[#0d1a2d] border-l border-[#1e3a5f] flex flex-col items-center py-4"
      >
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
        <div className="mt-4 space-y-2">
          {tabs.slice(0, 4).map((tab) => (
            <Tooltip key={tab.id} content={tab.label} position="left">
              <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                {tab.icon}
              </button>
            </Tooltip>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className="h-full bg-[#0d1a2d] border-l border-[#1e3a5f] flex flex-col"
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-[#1e3a5f]">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-[#e91e63]" />
          <span className="font-medium text-white">Bibliothèque</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-[#1e3a5f]">
        <Input
          placeholder="Rechercher un bloc..."
          leftIcon={<Search className="w-4 h-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as BlockCategory)}
          variant="buttons"
          size="sm"
        />
      </div>

      {/* Blocks Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredBlocks.map((block, index) => (
              <motion.div
                key={block.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
                draggable
                onDragStart={() => onBlockDragStart?.(block)}
                onClick={() => onBlockSelect?.(block)}
                className="group relative bg-[#111d2e] rounded-xl p-4 cursor-grab active:cursor-grabbing hover:bg-[#1e3a5f] transition-colors border border-transparent hover:border-[#3a5a7f]"
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(block.id);
                  }}
                  className={`
                    absolute top-2 right-2 p-1 rounded transition-all
                    ${
                      favorites.has(block.id)
                        ? 'text-[#e91e63] opacity-100'
                        : 'text-gray-500 opacity-0 group-hover:opacity-100 hover:text-[#e91e63]'
                    }
                  `}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${favorites.has(block.id) ? 'fill-current' : ''}`}
                  />
                </button>

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-[#0d1a2d] flex items-center justify-center text-[#e91e63]">
                    {block.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{block.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{block.description}</p>
                  </div>
                </div>

                {/* Drag Indicator */}
                <div className="absolute inset-0 rounded-xl border-2 border-dashed border-[#e91e63]/50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredBlocks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Search className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">Aucun bloc trouvé</p>
            <p className="text-xs mt-1">Essayez une autre recherche</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#1e3a5f]">
        <p className="text-xs text-gray-500 text-center">
          Glissez-déposez les blocs sur votre diapositive
        </p>
      </div>
    </motion.div>
  );
};

export default BlockLibrary;
