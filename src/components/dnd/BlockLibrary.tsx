/**
 * Bibliothèque de blocs de contenu
 * Alecia Presentations - Conseil financier français
 * Contient tous les types de blocs disponibles pour glisser-déposer
 */

import React, { useState } from 'react';
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  MouseSensor,
} from '@dnd-kit/core';
import { DraggableBlock } from './DraggableBlock';
import type { BlockType, BlockLibraryItem } from './types';

interface BlockLibraryProps {
  onBlockSelect?: (type: BlockType) => void;
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const blockLibraryItems: BlockLibraryItem[] = [
  // Text Blocks (5)
  {
    type: 'Titre',
    icon: 'T',
    label: 'Titre',
    description: 'Titre principal',
    defaultContent: 'Nouveau titre',
    category: 'text',
  },
  {
    type: 'Sous-titre',
    icon: 'S',
    label: 'Sous-titre',
    description: 'Sous-titre secondaire',
    defaultContent: 'Nouveau sous-titre',
    category: 'text',
  },
  {
    type: 'Paragraphe',
    icon: 'P',
    label: 'Paragraphe',
    description: 'Bloc de texte',
    defaultContent: 'Lorem ipsum dolor sit amet...',
    category: 'text',
  },
  {
    type: 'Liste',
    icon: 'L',
    label: 'Liste',
    description: 'Liste a puces',
    defaultContent: '* Element 1\n* Element 2\n* Element 3',
    category: 'text',
  },
  {
    type: 'Citation',
    icon: 'C',
    label: 'Citation',
    description: 'Citation ou temoignage',
    defaultContent: '"Une citation inspirante" - Auteur',
    category: 'text',
  },
  // Financial Blocks (4)
  {
    type: 'KPI_Card',
    icon: 'K',
    label: 'KPI Card',
    description: 'Indicateur cle de performance',
    defaultContent: '1.2M EUR',
    category: 'financial',
  },
  {
    type: 'Chart_Block',
    icon: 'G',
    label: 'Graphique',
    description: 'Barres, lignes, camembert, waterfall',
    defaultContent: '',
    category: 'financial',
  },
  {
    type: 'Table_Block',
    icon: 'Tb',
    label: 'Tableau',
    description: 'Tableau de donnees financier',
    defaultContent: '',
    category: 'financial',
  },
  {
    type: 'Timeline_Block',
    icon: 'Ti',
    label: 'Timeline',
    description: 'Chronologie transaction',
    defaultContent: '',
    category: 'financial',
  },
  // M&A Content Blocks (5)
  {
    type: 'Company_Overview',
    icon: 'Co',
    label: 'Entreprise',
    description: 'Logo + nom + description',
    defaultContent: '',
    category: 'ma_content',
  },
  {
    type: 'Deal_Rationale',
    icon: 'D',
    label: 'Rational',
    description: 'Justification strategique',
    defaultContent: '',
    category: 'ma_content',
  },
  {
    type: 'SWOT',
    icon: 'SW',
    label: 'SWOT',
    description: 'Analyse forces/faiblesses',
    defaultContent: '',
    category: 'ma_content',
  },
  {
    type: 'Key_Metrics',
    icon: 'M',
    label: 'Metriques',
    description: 'Tableau de bord metriques',
    defaultContent: '',
    category: 'ma_content',
  },
  {
    type: 'Process_Timeline',
    icon: 'PT',
    label: 'Processus',
    description: 'Etapes du deal',
    defaultContent: '',
    category: 'ma_content',
  },
  // Team Blocks (3)
  {
    type: 'Team_Grid',
    icon: 'TG',
    label: 'Equipe',
    description: 'Grille photos + noms',
    defaultContent: '',
    category: 'team',
  },
  {
    type: 'Team_Row',
    icon: 'TR',
    label: 'Equipe ligne',
    description: 'Liste horizontale',
    defaultContent: '',
    category: 'team',
  },
  {
    type: 'Advisor_List',
    icon: 'A',
    label: 'Advisors',
    description: 'Liste des conseils',
    defaultContent: '',
    category: 'team',
  },
  // Visual Blocks (3)
  {
    type: 'Image',
    icon: 'I',
    label: 'Image',
    description: 'Image ou photo',
    defaultContent: '',
    category: 'visual',
  },
  {
    type: 'Logo_Grid',
    icon: 'LG',
    label: 'Logos',
    description: 'Grille de logos',
    defaultContent: '',
    category: 'visual',
  },
  {
    type: 'Icon_Text',
    icon: 'IT',
    label: 'Icone + Texte',
    description: 'Combinaison icone texte',
    defaultContent: '',
    category: 'visual',
  },
  // Layout Blocks (3)
  {
    type: 'Two_Column',
    icon: '2C',
    label: 'Deux colonnes',
    description: 'Mise en page deux colonnes',
    defaultContent: '',
    category: 'layout',
  },
  {
    type: 'Three_Column',
    icon: '3C',
    label: 'Trois colonnes',
    description: 'Mise en page trois colonnes',
    defaultContent: '',
    category: 'layout',
  },
  {
    type: 'Grid',
    icon: 'G',
    label: 'Grille',
    description: 'Grille personnalisable',
    defaultContent: '',
    category: 'layout',
  },
];

const blockCategories = [
  { id: 'all', label: 'Tous' },
  { id: 'text', label: 'Texte' },
  { id: 'financial', label: 'Finance' },
  { id: 'ma_content', label: 'M&A' },
  { id: 'team', label: 'Equipe' },
  { id: 'visual', label: 'Visuel' },
  { id: 'layout', label: 'Layout' },
];

const blockColors: Record<BlockType, string> = {
  Titre: '#e91e63',
  'Sous-titre': '#9c27b0',
  Paragraphe: '#2196f3',
  Liste: '#607d8b',
  Citation: '#795548',
  KPI_Card: '#4caf50',
  Chart_Block: '#ff9800',
  Table_Block: '#00bcd4',
  Timeline_Block: '#009688',
  Company_Overview: '#3f51b5',
  Deal_Rationale: '#e91e63',
  SWOT: '#9c27b0',
  Key_Metrics: '#00bcd4',
  Process_Timeline: '#009688',
  Team_Grid: '#ff5722',
  Team_Row: '#ff9800',
  Advisor_List: '#795548',
  Image: '#4caf50',
  Logo_Grid: '#8bc34a',
  Icon_Text: '#607d8b',
  Two_Column: '#795548',
  Three_Column: '#9e9e9e',
  Grid: '#607d8b',
};

export const BlockLibrary: React.FC<BlockLibraryProps> = ({
  onBlockSelect,
  className = '',
  collapsed = false,
  onToggleCollapse,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDragType, setActiveDragType] = useState<BlockType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const blockType = event.active.data.current?.blockType as BlockType;
    setActiveDragType(blockType);
  };
  const handleDragEnd = () => setActiveDragType(null);
  const handleBlockClick = (type: BlockType) => {
    if (onBlockSelect) onBlockSelect(type);
  };

  const filteredBlocks = blockLibraryItems.filter((block) => {
    const matchesCategory = activeCategory === 'all' || block.category === activeCategory;
    const matchesSearch =
      block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (collapsed) {
    return (
      <div className={`alecia-block-library collapsed ${className}`}>
        <button className="expand-btn" onClick={onToggleCollapse} title="Ouvrir">
          <span className="expand-icon">▶</span>
          <span className="expand-label">Blocs</span>
        </button>
        <style jsx>{`
          .alecia-block-library.collapsed {
            width: 48px;
            background: #0d1a2d;
            border-left: 1px solid #1e3a5f;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px 0;
          }
          .expand-btn {
            writing-mode: vertical-rl;
            transform: rotate(180deg);
            padding: 16px 8px;
            background: #c9a84c;
            color: #0a1628;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
          }
          .expand-btn:hover {
            background: #b8973d;
          }
        `}</style>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={`alecia-block-library ${className}`}>
        <div className="library-header">
          <div className="header-title">
            <h3>Bibliotheque</h3>
            <button className="collapse-btn" onClick={onToggleCollapse}>
              ◀
            </button>
          </div>
          <p className="header-subtitle">21 blocs disponibles</p>
        </div>
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>
        <div className="category-tabs">
          {blockCategories.map((cat) => (
            <button
              key={cat.id}
              className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="blocks-container">
          {filteredBlocks.length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <p>Aucun bloc trouve</p>
            </div>
          ) : (
            <div className="blocks-grid">
              {filteredBlocks.map((block) => (
                <DraggableBlock
                  key={block.type}
                  type={block.type}
                  label={block.label}
                  description={block.description}
                  icon={block.icon}
                  color={blockColors[block.type]}
                  defaultContent={block.defaultContent}
                  onClick={() => handleBlockClick(block.type)}
                  size="medium"
                />
              ))}
            </div>
          )}
        </div>
        <div className="library-footer">
          <p className="footer-hint">Astuce : Cliquez pour ajouter</p>
        </div>
        <DragOverlay>
          {activeDragType && (
            <div style={{ transform: 'scale(1.05) rotate(2deg)', cursor: 'grabbing' }}>
              {(() => {
                const block = blockLibraryItems.find((b) => b.type === activeDragType);
                if (!block) return null;
                return (
                  <DraggableBlock
                    type={block.type}
                    label={block.label}
                    description={block.description}
                    icon={block.icon}
                    color={blockColors[block.type]}
                    size="medium"
                  />
                );
              })()}
            </div>
          )}
        </DragOverlay>
        <style jsx>{`
          .alecia-block-library {
            display: flex;
            flex-direction: column;
            width: 320px;
            height: 100%;
            background: #0d1a2d;
            border-left: 1px solid #1e3a5f;
          }
          .library-header {
            padding: 16px;
            background: #0a1628;
            border-bottom: 1px solid #1e3a5f;
          }
          .header-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;
          }
          .header-title h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #fff;
          }
          .collapse-btn {
            width: 24px;
            height: 24px;
            border: none;
            background: transparent;
            color: #666;
            cursor: pointer;
            border-radius: 4px;
            font-size: 12px;
          }
          .collapse-btn:hover {
            background: #f0f0f0;
            color: #c9a84c;
          }
          .header-subtitle {
            margin: 0;
            font-size: 12px;
            color: #999;
          }
          .search-container {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: #0a1628;
            border-bottom: 1px solid #1e3a5f;
          }
          .search-icon {
            font-size: 14px;
            color: #999;
          }
          .search-input {
            flex: 1;
            border: none;
            outline: none;
            font-size: 13px;
            color: #fff;
            background: transparent;
          }
          .search-input::placeholder {
            color: #999;
          }
          .clear-search {
            width: 20px;
            height: 20px;
            border: none;
            background: #1e3a5f;
            color: #999;
            border-radius: 50%;
            cursor: pointer;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .clear-search:hover {
            background: #c9a84c;
            color: #0a1628;
          }
          .category-tabs {
            display: flex;
            gap: 6px;
            padding: 10px 12px;
            background: #0a1628;
            border-bottom: 1px solid #1e3a5f;
            overflow-x: auto;
            flex-wrap: wrap;
          }
          .category-tab {
            padding: 5px 10px;
            background: #1e3a5f;
            border: none;
            border-radius: 14px;
            font-size: 11px;
            font-weight: 500;
            color: #999;
            cursor: pointer;
            white-space: nowrap;
          }
          .category-tab:hover {
            background: #2a4a73;
          }
          .category-tab.active {
            background: #c9a84c;
            color: #0a1628;
          }
          .blocks-container {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
          }
          .blocks-grid {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .no-results {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 24px;
            text-align: center;
          }
          .no-results-icon {
            font-size: 32px;
            margin-bottom: 12px;
            opacity: 0.5;
          }
          .no-results p {
            margin: 0;
            font-size: 14px;
            color: #999;
          }
          .library-footer {
            padding: 12px 16px;
            background: #0a1628;
            border-top: 1px solid #1e3a5f;
          }
          .footer-hint {
            margin: 0;
            font-size: 11px;
            color: #999;
            text-align: center;
          }
          .blocks-container::-webkit-scrollbar {
            width: 6px;
          }
          .blocks-container::-webkit-scrollbar-track {
            background: transparent;
          }
          .blocks-container::-webkit-scrollbar-thumb {
            background: #1e3a5f;
            border-radius: 3px;
          }
        `}</style>
      </div>
    </DndContext>
  );
};

export default BlockLibrary;
