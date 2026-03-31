/**
 * Zone de dépôt pour le canvas des slides
 * Alecia Presentations - Conseil financier français
 *
 * Zone où les blocs de contenu peuvent être déposés
 */

import React, { useState, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { BlockType, BlockData, SlideData } from './types';

interface DroppableCanvasProps {
  slide: SlideData;
  onBlockAdd?: (block: BlockData, position: { x: number; y: number }) => void;
  onBlockMove?: (blockId: string, position: { x: number; y: number }) => void;
  onBlockSelect?: (blockId: string) => void;
  onBlockDelete?: (blockId: string) => void;
  onBlockUpdate?: (blockId: string, updates: Partial<BlockData>) => void;
  selectedBlockId?: string | null;
  className?: string;
  showGrid?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  readOnly?: boolean;
}

// Couleurs pour les différents types de blocs
const blockColors: Record<BlockType, string> = {
  // Text Blocks
  Titre: '#c9a84c',
  'Sous-titre': '#9c27b0',
  Paragraphe: '#2196f3',
  Liste: '#607d8b',
  Citation: '#795548',
  // Financial Blocks
  KPI_Card: '#4caf50',
  Chart_Block: '#ff9800',
  Table_Block: '#00bcd4',
  Timeline_Block: '#009688',
  // M&A Content Blocks
  Company_Overview: '#3f51b5',
  Deal_Rationale: '#c9a84c',
  SWOT: '#9c27b0',
  Key_Metrics: '#00bcd4',
  Process_Timeline: '#009688',
  // Team Blocks
  Team_Grid: '#ff5722',
  Team_Row: '#ff9800',
  Advisor_List: '#795548',
  // Visual Blocks
  Image: '#4caf50',
  Logo_Grid: '#8bc34a',
  Icon_Text: '#607d8b',
  // Layout Blocks
  Two_Column: '#795548',
  Three_Column: '#9e9e9e',
  Grid: '#607d8b',
};

// Icônes pour les différents types de blocs
const blockIcons: Record<BlockType, string> = {
  // Text Blocks
  Titre: 'T',
  'Sous-titre': 'S',
  Paragraphe: 'P',
  Liste: 'L',
  Citation: 'C',
  // Financial Blocks
  KPI_Card: 'K',
  Chart_Block: 'G',
  Table_Block: 'Tb',
  Timeline_Block: 'Ti',
  // M&A Content Blocks
  Company_Overview: 'Co',
  Deal_Rationale: 'D',
  SWOT: 'SW',
  Key_Metrics: 'M',
  Process_Timeline: 'PT',
  // Team Blocks
  Team_Grid: 'TG',
  Team_Row: 'TR',
  Advisor_List: 'A',
  // Visual Blocks
  Image: 'I',
  Logo_Grid: 'LG',
  Icon_Text: 'IT',
  // Layout Blocks
  Two_Column: '2C',
  Three_Column: '3C',
  Grid: 'G',
};

export const DroppableCanvas: React.FC<DroppableCanvasProps> = ({
  slide,
  onBlockAdd,
  onBlockMove: _onBlockMove,
  onBlockSelect,
  onBlockDelete,
  onBlockUpdate,
  selectedBlockId,
  className = '',
  showGrid = true,
  snapToGrid = false,
  gridSize = 20,
  readOnly = false,
}) => {
  const [isOver, setIsOver] = useState(false);
  const [dragOverType, setDragOverType] = useState<BlockType | null>(null);

  const { setNodeRef } = useDroppable({
    id: `canvas-${slide.id}`,
    data: {
      accepts: ['BLOCK', 'IMAGE'],
      slideId: slide.id,
    },
    disabled: readOnly,
  });

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (readOnly) return;

      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      // Snap to grid si activé
      if (snapToGrid) {
        x = Math.round(x / gridSize) * gridSize;
        y = Math.round(y / gridSize) * gridSize;
      }

      // Vérifier si c'est un bloc de la bibliothèque
      const blockType = event.dataTransfer.getData('blockType') as BlockType;
      if (blockType) {
        const newBlock = createDefaultBlock(blockType, { x, y });
        if (onBlockAdd) {
          onBlockAdd(newBlock, { x, y });
        }
      }

      // Vérifier si c'est une image
      const imageUrl = event.dataTransfer.getData('imageUrl');
      if (imageUrl) {
        const newBlock = createDefaultBlock('Image', { x, y });
        newBlock.content = imageUrl;
        if (onBlockAdd) {
          onBlockAdd(newBlock, { x, y });
        }
      }

      setIsOver(false);
      setDragOverType(null);
    },
    [readOnly, snapToGrid, gridSize, onBlockAdd]
  );

  // @ts-ignore - declared but handleDragLeave was removed
  const handleDragLeave = useCallback(() => {
    setIsOver(false);
    setDragOverType(null);
  }, []);

  const handleDragOverNative = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!readOnly) {
        setIsOver(true);
      }
    },
    [readOnly]
  );

  const handleDragLeaveNative = useCallback(() => {
    setIsOver(false);
  }, []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Désélectionner si on clique sur le canvas vide
      if (e.target === e.currentTarget && onBlockSelect) {
        onBlockSelect('');
      }
    },
    [onBlockSelect]
  );

  return (
    <div
      ref={setNodeRef}
      className={`alecia-canvas ${isOver ? 'drag-over' : ''} ${readOnly ? 'read-only' : ''} ${className}`}
      onDragOver={handleDragOverNative}
      onDragLeave={handleDragLeaveNative}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
    >
      {/* Grille de fond */}
      {showGrid && (
        <div
          className="canvas-grid"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e0e0e0 1px, transparent 1px),
              linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />
      )}

      {/* Zone de slide */}
      <div className="slide-area">
        {/* En-tête de la slide */}
        <div className="slide-header">
          <h2 className="slide-title">{slide.title}</h2>
          <span className="slide-order">Slide {slide.order + 1}</span>
        </div>

        {/* Contenu de la slide */}
        <div className="slide-content">
          {slide.content && slide.content.length > 0 ? (
            slide.content.map((block) => (
              <CanvasBlock
                key={block.id}
                block={block}
                isSelected={block.id === selectedBlockId}
                onSelect={onBlockSelect}
                onDelete={onBlockDelete}
                onUpdate={onBlockUpdate}
                snapToGrid={snapToGrid}
                gridSize={gridSize}
                readOnly={readOnly}
              />
            ))
          ) : (
            <EmptyState isOver={isOver} dragOverType={dragOverType} />
          )}
        </div>

        {/* Overlay de dépôt */}
        {isOver && (
          <div className="drop-overlay">
            <div className="drop-indicator">
              <span className="drop-icon">⬇️</span>
              <span className="drop-text">
                {dragOverType ? `Déposer le bloc ${dragOverType.toLowerCase()} ici` : 'Déposer ici'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Informations de la slide */}
      <div className="canvas-info">
        <span className="info-item">
          {slide.content?.length || 0} bloc{slide.content?.length !== 1 ? 's' : ''}
        </span>
        <span className="info-separator">•</span>
        <span className="info-item">{snapToGrid ? `Grille ${gridSize}px` : 'Position libre'}</span>
      </div>

      <style jsx>{`
        .alecia-canvas {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: #f0f0f0;
          overflow: hidden;
        }

        .alecia-canvas.drag-over {
          background-color: rgba(233, 30, 99, 0.05);
        }

        .alecia-canvas.read-only {
          pointer-events: none;
        }

        .canvas-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.5;
        }

        .slide-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin: 24px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .slide-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: linear-gradient(135deg, #0a1628 0%, #1a3a5c 100%);
          color: #ffffff;
        }

        .slide-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .slide-order {
          font-size: 12px;
          opacity: 0.7;
          padding: 4px 12px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .slide-content {
          flex: 1;
          position: relative;
          padding: 24px;
          overflow: auto;
        }

        .drop-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(233, 30, 99, 0.1);
          border: 3px dashed #e91e63;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          animation: pulse 1s ease infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        .drop-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px 48px;
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .drop-icon {
          font-size: 32px;
        }

        .drop-text {
          font-size: 14px;
          font-weight: 600;
          color: #e91e63;
        }

        .canvas-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 12px;
          background-color: #ffffff;
          border-top: 1px solid #e0e0e0;
        }

        .info-item {
          font-size: 11px;
          color: #666666;
        }

        .info-separator {
          color: #cccccc;
        }
      `}</style>
    </div>
  );
};

// État vide du canvas
interface EmptyStateProps {
  isOver: boolean;
  dragOverType: BlockType | null;
}

const EmptyState: React.FC<EmptyStateProps> = ({ isOver, dragOverType: _dragOverType }) => {
  return (
    <div className={`empty-state ${isOver ? 'drag-over' : ''}`}>
      <div className="empty-content">
        <span className="empty-icon">📋</span>
        <h4 className="empty-title">Slide vide</h4>
        <p className="empty-description">Glissez des blocs depuis la bibliothèque pour commencer</p>
        <div className="empty-hints">
          <span className="hint">🖱️ Glisser-déposer des blocs</span>
          <span className="hint">📷 Importer des images</span>
          <span className="hint">📊 Ajouter des graphiques</span>
        </div>
      </div>

      <style jsx>{`
        .empty-state {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
        }

        .empty-state.drag-over {
          background-color: rgba(233, 30, 99, 0.05);
        }

        .empty-content {
          text-align: center;
          max-width: 400px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          display: block;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #0a1628;
          margin: 0 0 8px 0;
        }

        .empty-description {
          font-size: 14px;
          color: #666666;
          margin: 0 0 24px 0;
        }

        .empty-hints {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }

        .hint {
          padding: 6px 12px;
          background-color: #f5f5f5;
          border-radius: 16px;
          font-size: 12px;
          color: #666666;
        }
      `}</style>
    </div>
  );
};

// Bloc sur le canvas
interface CanvasBlockProps {
  block: BlockData;
  isSelected?: boolean;
  onSelect?: (blockId: string) => void;
  onDelete?: (blockId: string) => void;
  onUpdate?: (blockId: string, updates: Partial<BlockData>) => void;
  snapToGrid?: boolean;
  gridSize?: number;
  readOnly?: boolean;
}

const CanvasBlock: React.FC<CanvasBlockProps> = ({
  block,
  isSelected = false,
  onSelect,
  onDelete,
  onUpdate,
  snapToGrid = false,
  gridSize = 20,
  readOnly = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (readOnly) return;

    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - block.position.x, y: e.clientY - block.position.y });

    if (onSelect) {
      onSelect(block.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart || readOnly) return;

    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;

    if (snapToGrid) {
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }

    if (onUpdate) {
      onUpdate(block.id, {
        position: { x: Math.max(0, newX), y: Math.max(0, newY) },
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(block.id);
    }
  };

  const color = blockColors[block.type];
  const icon = blockIcons[block.type];

  return (
    <div
      className={`canvas-block ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'absolute',
        left: block.position.x,
        top: block.position.y,
        width: block.size.width,
        minHeight: block.size.height,
        cursor: readOnly ? 'default' : 'move',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="block-wrapper">
        <div className="block-header" style={{ backgroundColor: color }}>
          <span className="block-icon">{icon}</span>
          <span className="block-type">{block.type}</span>
          {isSelected && !readOnly && (
            <button className="delete-btn" onClick={handleDelete} title="Supprimer">
              ✕
            </button>
          )}
        </div>
        <div className="block-body">{renderBlockContent(block)}</div>
      </div>

      <style jsx>{`
        .canvas-block {
          z-index: ${isSelected ? 100 : 1};
        }

        .canvas-block.selected {
          z-index: 100;
        }

        .canvas-block.dragging {
          opacity: 0.8;
        }

        .block-wrapper {
          background-color: #ffffff;
          border: 2px solid transparent;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .canvas-block:hover .block-wrapper {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .canvas-block.selected .block-wrapper {
          border-color: #e91e63;
          box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.2);
        }

        .block-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 500;
        }

        .block-icon {
          font-size: 14px;
        }

        .block-type {
          flex: 1;
        }

        .delete-btn {
          width: 20px;
          height: 20px;
          border: none;
          background-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        .delete-btn:hover {
          background-color: rgba(255, 255, 255, 0.4);
        }

        .block-body {
          padding: 16px;
        }
      `}</style>
    </div>
  );
};

// Fonction utilitaire pour créer un bloc par défaut
function createDefaultBlock(type: BlockType, position: { x: number; y: number }): BlockData {
  const defaultSizes: Record<BlockType, { width: number; height: number }> = {
    // Text Blocks
    Titre: { width: 400, height: 60 },
    'Sous-titre': { width: 350, height: 50 },
    Paragraphe: { width: 400, height: 150 },
    Liste: { width: 350, height: 150 },
    Citation: { width: 400, height: 100 },
    // Financial Blocks
    KPI_Card: { width: 200, height: 120 },
    Chart_Block: { width: 400, height: 250 },
    Table_Block: { width: 500, height: 200 },
    Timeline_Block: { width: 500, height: 180 },
    // M&A Content Blocks
    Company_Overview: { width: 400, height: 200 },
    Deal_Rationale: { width: 450, height: 220 },
    SWOT: { width: 500, height: 300 },
    Key_Metrics: { width: 450, height: 200 },
    Process_Timeline: { width: 500, height: 180 },
    // Team Blocks
    Team_Grid: { width: 450, height: 200 },
    Team_Row: { width: 500, height: 100 },
    Advisor_List: { width: 400, height: 180 },
    // Visual Blocks
    Image: { width: 300, height: 200 },
    Logo_Grid: { width: 400, height: 150 },
    Icon_Text: { width: 300, height: 80 },
    // Layout Blocks
    Two_Column: { width: 600, height: 200 },
    Three_Column: { width: 700, height: 200 },
    Grid: { width: 500, height: 250 },
  };

  const defaultContents: Record<BlockType, string> = {
    // Text Blocks
    Titre: 'Nouveau titre',
    'Sous-titre': 'Nouveau sous-titre',
    Paragraphe: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    Liste: '• Premier élément\n• Deuxième élément\n• Troisième élément',
    Citation: '"Une citation inspirante" - Auteur',
    // Financial Blocks
    KPI_Card: '1.2M EUR',
    Chart_Block: '',
    Table_Block: '',
    Timeline_Block: '',
    // M&A Content Blocks
    Company_Overview: '',
    Deal_Rationale: '',
    SWOT: '',
    Key_Metrics: '',
    Process_Timeline: '',
    // Team Blocks
    Team_Grid: '',
    Team_Row: '',
    Advisor_List: '',
    // Visual Blocks
    Image: '',
    Logo_Grid: '',
    Icon_Text: '',
    // Layout Blocks
    Two_Column: '',
    Three_Column: '',
    Grid: '',
  };

  return {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    content: defaultContents[type] || '',
    position,
    size: defaultSizes[type] || { width: 200, height: 100 },
  };
}

// Fonction pour rendre le contenu du bloc
function renderBlockContent(block: BlockData): React.ReactNode {
  switch (block.type) {
    case 'Titre':
      return (
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0a1628', margin: 0 }}>
          {block.content || 'Nouveau titre'}
        </h2>
      );
    case 'Sous-titre':
      return (
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#333333', margin: 0 }}>
          {block.content || 'Nouveau sous-titre'}
        </h3>
      );
    case 'Paragraphe':
      return (
        <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#444444', margin: 0 }}>
          {block.content || 'Lorem ipsum dolor sit amet...'}
        </p>
      );
    case 'Image':
      return block.content ? (
        <img
          src={block.content}
          alt="Contenu"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '150px',
            backgroundColor: '#f0f0f0',
            border: '2px dashed #cccccc',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999999',
            fontSize: '14px',
          }}
        >
          🖼️ Image
        </div>
      );
    case 'Chart_Block':
      return (
        <div
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '32px' }}>📊</span>
          <span style={{ color: '#666666', fontSize: '12px' }}>Graphique</span>
        </div>
      );
    case 'Table_Block':
      return (
        <div
          style={{
            width: '100%',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0a1628', color: '#ffffff' }}>
                <th style={{ padding: '8px', fontSize: '12px' }}>Colonne 1</th>
                <th style={{ padding: '8px', fontSize: '12px' }}>Colonne 2</th>
                <th style={{ padding: '8px', fontSize: '12px' }}>Colonne 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', fontSize: '12px', borderBottom: '1px solid #e0e0e0' }}>
                  Donnée 1
                </td>
                <td style={{ padding: '8px', fontSize: '12px', borderBottom: '1px solid #e0e0e0' }}>
                  Donnée 2
                </td>
                <td style={{ padding: '8px', fontSize: '12px', borderBottom: '1px solid #e0e0e0' }}>
                  Donnée 3
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontSize: '12px' }}>Donnée 4</td>
                <td style={{ padding: '8px', fontSize: '12px' }}>Donnée 5</td>
                <td style={{ padding: '8px', fontSize: '12px' }}>Donnée 6</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    case 'Two_Column':
      return (
        <div style={{ display: 'flex', gap: '16px' }}>
          <div
            style={{ flex: 1, padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}
          >
            <p style={{ margin: 0, fontSize: '13px', color: '#666666' }}>Colonne gauche</p>
          </div>
          <div
            style={{ flex: 1, padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}
          >
            <p style={{ margin: 0, fontSize: '13px', color: '#666666' }}>Colonne droite</p>
          </div>
        </div>
      );
    case 'Liste':
      const items = block.content.split('\n').filter((item) => item.trim());
      return (
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {items.length > 0 ? (
            items.map((item, index) => (
              <li key={index} style={{ fontSize: '14px', color: '#444444', marginBottom: '4px' }}>
                {item.replace(/^•\s*/, '')}
              </li>
            ))
          ) : (
            <>
              <li style={{ fontSize: '14px', color: '#444444', marginBottom: '4px' }}>Élément 1</li>
              <li style={{ fontSize: '14px', color: '#444444', marginBottom: '4px' }}>Élément 2</li>
              <li style={{ fontSize: '14px', color: '#444444' }}>Élément 3</li>
            </>
          )}
        </ul>
      );
    case 'Citation':
      return (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderLeft: '4px solid #795548',
            borderRadius: '4px',
          }}
        >
          <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#444444', margin: 0 }}>
            {block.content || '"Une citation inspirante" - Auteur'}
          </p>
        </div>
      );
    case 'KPI_Card':
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
          }}
        >
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#4caf50' }}>
            {block.content || '1.2M'}
          </span>
          <span style={{ fontSize: '12px', color: '#666666', marginTop: '4px' }}>KPI</span>
        </div>
      );
    case 'Chart_Block':
      return (
        <div
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '40px' }}>📊</span>
          <span style={{ fontSize: '12px', color: '#666666' }}>Graphique</span>
        </div>
      );
    case 'Table_Block':
      return (
        <div
          style={{
            width: '100%',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0a1628', color: '#ffffff' }}>
                <th style={{ padding: '8px', fontSize: '12px' }}>Col 1</th>
                <th style={{ padding: '8px', fontSize: '12px' }}>Col 2</th>
                <th style={{ padding: '8px', fontSize: '12px' }}>Col 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', fontSize: '12px', borderBottom: '1px solid #e0e0e0' }}>
                  Val 1
                </td>
                <td style={{ padding: '8px', fontSize: '12px', borderBottom: '1px solid #e0e0e0' }}>
                  Val 2
                </td>
                <td style={{ padding: '8px', fontSize: '12px', borderBottom: '1px solid #e0e0e0' }}>
                  Val 3
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontSize: '12px' }}>Val 4</td>
                <td style={{ padding: '8px', fontSize: '12px' }}>Val 5</td>
                <td style={{ padding: '8px', fontSize: '12px' }}>Val 6</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    case 'Timeline_Block':
      return (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 0' }}>
          <div
            style={{
              minWidth: '100px',
              padding: '12px',
              backgroundColor: '#009688',
              color: '#fff',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 600 }}>Jan</div>
            <div style={{ fontSize: '10px' }}>Phase 1</div>
          </div>
          <div
            style={{
              minWidth: '100px',
              padding: '12px',
              backgroundColor: '#00bcd4',
              color: '#fff',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 600 }}>Mar</div>
            <div style={{ fontSize: '10px' }}>Phase 2</div>
          </div>
          <div
            style={{
              minWidth: '100px',
              padding: '12px',
              backgroundColor: '#80deea',
              color: '#333',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 600 }}>Jun</div>
            <div style={{ fontSize: '10px' }}>Phase 3</div>
          </div>
        </div>
      );
    case 'Company_Overview':
      return (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#3f51b5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '24px',
            }}
          >
            🏢
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0a1628' }}>Entreprise</div>
            <div style={{ fontSize: '12px', color: '#666666' }}>Description de l'entreprise</div>
          </div>
        </div>
      );
    case 'Deal_Rationale':
      return (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#fff3f5',
            borderRadius: '8px',
            borderLeft: '4px solid #e91e63',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#e91e63', marginBottom: '8px' }}>
            💡 Rational du Deal
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#444444' }}>
            <li>Synergie stratégique</li>
            <li>Creation de valeur</li>
            <li>Positionnement marche</li>
          </ul>
        </div>
      );
    case 'SWOT':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ padding: '12px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <div
              style={{ fontSize: '11px', fontWeight: 600, color: '#4caf50', marginBottom: '4px' }}
            >
              FORCES
            </div>
            <div style={{ fontSize: '11px', color: '#333' }}>Point fort 1</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
            <div
              style={{ fontSize: '11px', fontWeight: 600, color: '#f44336', marginBottom: '4px' }}
            >
              FAIBLESSES
            </div>
            <div style={{ fontSize: '11px', color: '#333' }}>Point faible 1</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
            <div
              style={{ fontSize: '11px', fontWeight: 600, color: '#2196f3', marginBottom: '4px' }}
            >
              OPPORTUNITES
            </div>
            <div style={{ fontSize: '11px', color: '#333' }}>Opportunite 1</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#fff8e1', borderRadius: '8px' }}>
            <div
              style={{ fontSize: '11px', fontWeight: 600, color: '#ff9800', marginBottom: '4px' }}
            >
              MENACES
            </div>
            <div style={{ fontSize: '11px', color: '#333' }}>Menace 1</div>
          </div>
        </div>
      );
    case 'Key_Metrics':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div
            style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#00bcd4' }}>42%</div>
            <div style={{ fontSize: '10px', color: '#666' }}>Marge</div>
          </div>
          <div
            style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#4caf50' }}>2.1x</div>
            <div style={{ fontSize: '10px', color: '#666' }}>EV/EBITDA</div>
          </div>
          <div
            style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#ff9800' }}>15%</div>
            <div style={{ fontSize: '10px', color: '#666' }}>Croissance</div>
          </div>
        </div>
      );
    case 'Process_Timeline':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#4caf50',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '12px',
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: '12px', color: '#333' }}>Due Diligence</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#ff9800',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '12px',
              }}
            >
              2
            </div>
            <div style={{ fontSize: '12px', color: '#333' }}>Negociation</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#e0e0e0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '12px',
              }}
            >
              3
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Closing</div>
          </div>
        </div>
      );
    case 'Team_Grid':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#ff5722',
                borderRadius: '50%',
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              👤
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>Membre 1</div>
            <div style={{ fontSize: '10px', color: '#666' }}>Role</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#ff9800',
                borderRadius: '50%',
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              👤
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>Membre 2</div>
            <div style={{ fontSize: '10px', color: '#666' }}>Role</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#795548',
                borderRadius: '50%',
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              👤
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>Membre 3</div>
            <div style={{ fontSize: '10px', color: '#666' }}>Role</div>
          </div>
        </div>
      );
    case 'Team_Row':
      return (
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
          <div style={{ minWidth: '80px', textAlign: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#ff5722',
                borderRadius: '50%',
                margin: '0 auto 4px',
              }}
            ></div>
            <div style={{ fontSize: '11px', color: '#333' }}>Nom 1</div>
          </div>
          <div style={{ minWidth: '80px', textAlign: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#ff9800',
                borderRadius: '50%',
                margin: '0 auto 4px',
              }}
            ></div>
            <div style={{ fontSize: '11px', color: '#333' }}>Nom 2</div>
          </div>
          <div style={{ minWidth: '80px', textAlign: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#795548',
                borderRadius: '50%',
                margin: '0 auto 4px',
              }}
            ></div>
            <div style={{ fontSize: '11px', color: '#333' }}>Nom 3</div>
          </div>
        </div>
      );
    case 'Advisor_List':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#333' }}>Conseil 1</span>
            <span style={{ fontSize: '11px', color: '#666' }}>Role</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#333' }}>Conseil 2</span>
            <span style={{ fontSize: '11px', color: '#666' }}>Role</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#333' }}>Conseil 3</span>
            <span style={{ fontSize: '11px', color: '#666' }}>Role</span>
          </div>
        </div>
      );
    case 'Logo_Grid':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              margin: '0 auto',
            }}
          ></div>
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              margin: '0 auto',
            }}
          ></div>
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              margin: '0 auto',
            }}
          ></div>
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              margin: '0 auto',
            }}
          ></div>
        </div>
      );
    case 'Icon_Text':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#607d8b',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '20px',
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>Titre</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Description</div>
          </div>
        </div>
      );
    case 'Two_Column':
      return (
        <div style={{ display: 'flex', gap: '16px' }}>
          <div
            style={{ flex: 1, padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}
          >
            <p style={{ margin: 0, fontSize: '13px', color: '#666666' }}>Colonne gauche</p>
          </div>
          <div
            style={{ flex: 1, padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}
          >
            <p style={{ margin: 0, fontSize: '13px', color: '#666666' }}>Colonne droite</p>
          </div>
        </div>
      );
    case 'Three_Column':
      return (
        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Col 1</p>
          </div>
          <div
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Col 2</p>
          </div>
          <div
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Col 3</p>
          </div>
        </div>
      );
    case 'Grid':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div
            style={{
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '12px', color: '#666' }}>Cell 1</span>
          </div>
          <div
            style={{
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '12px', color: '#666' }}>Cell 2</span>
          </div>
          <div
            style={{
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '12px', color: '#666' }}>Cell 3</span>
          </div>
          <div
            style={{
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '12px', color: '#666' }}>Cell 4</span>
          </div>
        </div>
      );
    default:
      return <div>{(block as BlockData & { content: string }).content || 'Block'}</div>;
  }
}

export default DroppableCanvas;
