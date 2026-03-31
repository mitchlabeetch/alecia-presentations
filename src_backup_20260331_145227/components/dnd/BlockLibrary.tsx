/**
 * Bibliothèque de blocs de contenu
 * Alecia Presentations - Conseil financier français
 * 
 * Contient tous les types de blocs disponibles pour glisser-déposer
 * sur le canvas des slides
 */

import React, { useState } from 'react';
import { DndContext, DragStartEvent, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor, MouseSensor } from '@dnd-kit/core';
import { DraggableBlock } from './DraggableBlock';
import type { BlockType, BlockLibraryItem } from './types';

interface BlockLibraryProps {
  onBlockSelect?: (type: BlockType) => void;
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// Définition de tous les blocs disponibles
const blockLibraryItems: BlockLibraryItem[] = [
  {
    type: 'Titre',
    icon: 'T',
    label: 'Titre',
    description: 'Titre principal de la slide',
    defaultContent: 'Nouveau titre',
  },
  {
    type: 'Sous-titre',
    icon: 'S',
    label: 'Sous-titre',
    description: 'Sous-titre secondaire',
    defaultContent: 'Nouveau sous-titre',
  },
  {
    type: 'Paragraphe',
    icon: '¶',
    label: 'Paragraphe',
    description: 'Bloc de texte',
    defaultContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    type: 'Image',
    icon: '🖼️',
    label: 'Image',
    description: 'Image ou logo',
    defaultContent: '',
  },
  {
    type: 'Graphique',
    icon: '📊',
    label: 'Graphique',
    description: 'Graphique et visualisation',
    defaultContent: '',
  },
  {
    type: 'Tableau',
    icon: '▦',
    label: 'Tableau',
    description: 'Tableau de données',
    defaultContent: '',
  },
  {
    type: 'Deux colonnes',
    icon: '▌▐',
    label: 'Deux colonnes',
    description: 'Mise en page deux colonnes',
    defaultContent: '',
  },
  {
    type: 'Liste',
    icon: '☰',
    label: 'Liste',
    description: 'Liste à puces',
    defaultContent: '• Premier élément\n• Deuxième élément\n• Troisième élément',
  },
];

// Catégories de blocs
const blockCategories = [
  {
    id: 'text',
    label: 'Texte',
    blocks: ['Titre', 'Sous-titre', 'Paragraphe', 'Liste'] as BlockType[],
  },
  {
    id: 'media',
    label: 'Médias',
    blocks: ['Image', 'Graphique', 'Tableau'] as BlockType[],
  },
  {
    id: 'layout',
    label: 'Mise en page',
    blocks: ['Deux colonnes'] as BlockType[],
  },
];

// Couleurs pour chaque type de bloc
const blockColors: Record<BlockType, string> = {
  'Titre': '#e91e63',
  'Sous-titre': '#9c27b0',
  'Paragraphe': '#2196f3',
  'Image': '#4caf50',
  'Graphique': '#ff9800',
  'Tableau': '#00bcd4',
  'Deux colonnes': '#795548',
  'Liste': '#607d8b',
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

  // Configuration des capteurs pour le drag
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const blockType = event.active.data.current?.blockType as BlockType;
    setActiveDragType(blockType);
  };

  const handleDragEnd = () => {
    setActiveDragType(null);
  };

  const handleBlockClick = (type: BlockType) => {
    if (onBlockSelect) {
      onBlockSelect(type);
    }
  };

  // Filtrer les blocs
  const filteredBlocks = blockLibraryItems.filter((block) => {
    const matchesCategory = activeCategory === 'all' || 
      blockCategories.find(cat => cat.id === activeCategory)?.blocks.includes(block.type);
    const matchesSearch = block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (collapsed) {
    return (
      <div className={`alecia-block-library collapsed ${className}`}>
        <button
          className="expand-btn"
          onClick={onToggleCollapse}
          title="Ouvrir la bibliothèque de blocs"
        >
          <span className="expand-icon">▶</span>
          <span className="expand-label">Blocs</span>
        </button>

        <style jsx>{`
          .alecia-block-library.collapsed {
            width: 48px;
            background-color: #f8f9fa;
            border-left: 1px solid #e0e0e0;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px 0;
          }

          .expand-btn {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            transform: rotate(180deg);
            padding: 16px 8px;
            background-color: #e91e63;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
          }

          .expand-btn:hover {
            background-color: #c2185b;
          }

          .expand-icon {
            transform: rotate(90deg);
          }
        `}</style>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`alecia-block-library ${className}`}>
        {/* En-tête */}
        <div className="library-header">
          <div className="header-title">
            <h3>Bibliothèque</h3>
            <button
              className="collapse-btn"
              onClick={onToggleCollapse}
              title="Réduire"
            >
              ◀
            </button>
          </div>
          <p className="header-subtitle">Glissez les blocs sur votre slide</p>
        </div>

        {/* Barre de recherche */}
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un bloc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => setSearchQuery('')}
              title="Effacer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtres par catégorie */}
        <div className="category-tabs">
          <button
            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            Tous
          </button>
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

        {/* Liste des blocs */}
        <div className="blocks-container">
          {filteredBlocks.length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <p>Aucun bloc trouvé</p>
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

        {/* Pied de page */}
        <div className="library-footer">
          <p className="footer-hint">
            💡 Astuce : Cliquez pour ajouter directement
          </p>
        </div>

        {/* Overlay de drag */}
        <DragOverlay>
          {activeDragType && (
            <div
              style={{
                transform: 'scale(1.05) rotate(2deg)',
                cursor: 'grabbing',
              }}
            >
              {(() => {
                const block = blockLibraryItems.find(b => b.type === activeDragType);
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
            background-color: #f8f9fa;
            border-left: 1px solid #e0e0e0;
          }

          .library-header {
            padding: 16px;
            background-color: #ffffff;
            border-bottom: 1px solid #e0e0e0;
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
            color: #0a1628;
          }

          .collapse-btn {
            width: 24px;
            height: 24px;
            border: none;
            background-color: transparent;
            color: #666666;
            cursor: pointer;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            transition: all 0.2s ease;
          }

          .collapse-btn:hover {
            background-color: #f0f0f0;
            color: #e91e63;
          }

          .header-subtitle {
            margin: 0;
            font-size: 12px;
            color: #666666;
          }

          .search-container {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background-color: #ffffff;
            border-bottom: 1px solid #e0e0e0;
          }

          .search-icon {
            font-size: 14px;
            color: #999999;
          }

          .search-input {
            flex: 1;
            border: none;
            outline: none;
            font-size: 13px;
            color: #0a1628;
          }

          .search-input::placeholder {
            color: #999999;
          }

          .clear-search {
            width: 20px;
            height: 20px;
            border: none;
            background-color: #f0f0f0;
            color: #666666;
            border-radius: 50%;
            cursor: pointer;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .clear-search:hover {
            background-color: #e91e63;
            color: #ffffff;
          }

          .category-tabs {
            display: flex;
            gap: 8px;
            padding: 12px 16px;
            background-color: #ffffff;
            border-bottom: 1px solid #e0e0e0;
            overflow-x: auto;
          }

          .category-tab {
            padding: 6px 12px;
            background-color: #f0f0f0;
            border: none;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            color: #666666;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s ease;
          }

          .category-tab:hover {
            background-color: #e0e0e0;
          }

          .category-tab.active {
            background-color: #e91e63;
            color: #ffffff;
          }

          .blocks-container {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
          }

          .blocks-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
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
            color: #666666;
          }

          .library-footer {
            padding: 12px 16px;
            background-color: #ffffff;
            border-top: 1px solid #e0e0e0;
          }

          .footer-hint {
            margin: 0;
            font-size: 11px;
            color: #999999;
            text-align: center;
          }

          /* Scrollbar personnalisée */
          .blocks-container::-webkit-scrollbar,
          .category-tabs::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          .blocks-container::-webkit-scrollbar-track,
          .category-tabs::-webkit-scrollbar-track {
            background: transparent;
          }

          .blocks-container::-webkit-scrollbar-thumb,
          .category-tabs::-webkit-scrollbar-thumb {
            background-color: #cccccc;
            border-radius: 3px;
          }

          .blocks-container::-webkit-scrollbar-thumb:hover,
          .category-tabs::-webkit-scrollbar-thumb:hover {
            background-color: #999999;
          }
        `}</style>
      </div>
    </DndContext>
  );
};

export default BlockLibrary;
