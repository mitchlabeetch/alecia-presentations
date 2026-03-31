/**
 * Composant de bloc de contenu déplaçable
 * Alecia Presentations - Conseil financier français
 * 
 * Représente un bloc de contenu qui peut être glissé depuis la bibliothèque
 * vers le canvas de la slide
 */

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { BlockType, BlockData } from './types';

interface DraggableBlockProps {
  type: BlockType;
  label: string;
  description?: string;
  icon: string;
  color?: string;
  defaultContent?: string;
  blockData?: Partial<BlockData>;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

// Couleurs par défaut pour chaque type de bloc
const defaultColors: Record<BlockType, string> = {
  'Titre': '#e91e63',
  'Sous-titre': '#9c27b0',
  'Paragraphe': '#2196f3',
  'Image': '#4caf50',
  'Graphique': '#ff9800',
  'Tableau': '#00bcd4',
  'Deux colonnes': '#795548',
  'Liste': '#607d8b',
};

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  type,
  label,
  description,
  icon,
  color,
  defaultContent,
  blockData,
  disabled = false,
  className = '',
  onClick,
  size = 'medium',
}) => {
  const blockColor = color || defaultColors[type];

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `block-${type}-${Date.now()}`,
    data: {
      type: 'BLOCK',
      blockType: type,
      label,
      defaultContent,
      blockData,
    },
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!disabled && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const sizeStyles = {
    small: {
      padding: '8px 12px',
      iconSize: 24,
      fontSize: 12,
    },
    medium: {
      padding: '12px 16px',
      iconSize: 32,
      fontSize: 14,
    },
    large: {
      padding: '16px 20px',
      iconSize: 40,
      fontSize: 16,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`alecia-draggable-block ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onClick={handleClick}
      title={`Glissez pour ajouter un ${label.toLowerCase()}`}
    >
      <div className="block-content">
        <div
          className="block-icon"
          style={{
            backgroundColor: blockColor,
            width: currentSize.iconSize,
            height: currentSize.iconSize,
          }}
        >
          <span className="icon-text">{icon}</span>
        </div>
        <div className="block-info">
          <span
            className="block-label"
            style={{ fontSize: currentSize.fontSize }}
          >
            {label}
          </span>
          {description && (
            <span className="block-description">{description}</span>
          )}
        </div>
      </div>

      {/* Indicateur de drag */}
      {isDragging && (
        <div className="drag-indicator">
          <span>Déposer sur la slide</span>
        </div>
      )}

      <style jsx>{`
        .alecia-draggable-block {
          position: relative;
          background-color: #ffffff;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          padding: ${currentSize.padding};
          transition: all 0.2s ease;
          user-select: none;
        }

        .alecia-draggable-block:hover:not(.disabled) {
          border-color: ${blockColor};
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .alecia-draggable-block.dragging {
          z-index: 1000;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .alecia-draggable-block.disabled {
          opacity: 0.5;
          background-color: #f5f5f5;
        }

        .block-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .block-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .alecia-draggable-block:hover .block-icon {
          transform: scale(1.05);
        }

        .icon-text {
          font-size: ${size === 'small' ? '14px' : size === 'large' ? '22px' : '18px'};
          color: #ffffff;
        }

        .block-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }

        .block-label {
          font-weight: 600;
          color: #0a1628;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .block-description {
          font-size: 11px;
          color: #666666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .drag-indicator {
          position: absolute;
          inset: 0;
          background-color: rgba(233, 30, 99, 0.9);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 1s ease infinite;
        }

        .drag-indicator span {
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          padding: 8px 16px;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 20px;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.9;
          }
          50% {
            opacity: 1;
          }
        }

        /* Variantes de taille */
        .alecia-draggable-block.small {
          padding: 8px 12px;
        }

        .alecia-draggable-block.small .block-icon {
          width: 28px;
          height: 28px;
        }

        .alecia-draggable-block.small .icon-text {
          font-size: 14px;
        }

        .alecia-draggable-block.small .block-label {
          font-size: 12px;
        }

        .alecia-draggable-block.large {
          padding: 16px 20px;
        }

        .alecia-draggable-block.large .block-icon {
          width: 48px;
          height: 48px;
        }

        .alecia-draggable-block.large .icon-text {
          font-size: 24px;
        }

        .alecia-draggable-block.large .block-label {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

// Composant pour un bloc déjà placé sur le canvas (éditable)
interface CanvasBlockProps {
  block: BlockData;
  isSelected?: boolean;
  onSelect?: (blockId: string) => void;
  onDelete?: (blockId: string) => void;
  onUpdate?: (blockId: string, updates: Partial<BlockData>) => void;
  className?: string;
}

export const CanvasBlock: React.FC<CanvasBlockProps> = ({
  block,
  isSelected = false,
  onSelect,
  onDelete,
  onUpdate,
  className = '',
}) => {
  const blockColor = defaultColors[block.type];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(block.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(block.id);
    }
  };

  return (
    <div
      className={`alecia-canvas-block ${isSelected ? 'selected' : ''} ${className}`}
      style={{
        position: 'absolute',
        left: block.position.x,
        top: block.position.y,
        width: block.size.width,
        minHeight: block.size.height,
      }}
      onClick={handleClick}
    >
      <div className="block-wrapper">
        {/* En-tête du bloc */}
        <div className="block-header" style={{ backgroundColor: blockColor }}>
          <span className="block-type-icon">{getBlockIcon(block.type)}</span>
          <span className="block-type-label">{block.type}</span>
          {isSelected && (
            <button className="delete-btn" onClick={handleDelete} title="Supprimer">
              ✕
            </button>
          )}
        </div>

        {/* Contenu du bloc */}
        <div className="block-body">
          {renderBlockContent(block)}
        </div>

        {/* Poignées de redimensionnement */}
        {isSelected && (
          <>
            <div className="resize-handle resize-nw" />
            <div className="resize-handle resize-ne" />
            <div className="resize-handle resize-sw" />
            <div className="resize-handle resize-se" />
          </>
        )}
      </div>

      <style jsx>{`
        .alecia-canvas-block {
          cursor: move;
        }

        .block-wrapper {
          background-color: #ffffff;
          border: 2px solid transparent;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .alecia-canvas-block:hover .block-wrapper {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .alecia-canvas-block.selected .block-wrapper {
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

        .block-type-icon {
          font-size: 14px;
        }

        .block-type-label {
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
          min-height: 60px;
        }

        .resize-handle {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #e91e63;
          border: 2px solid #ffffff;
          border-radius: 50%;
        }

        .resize-nw {
          top: -5px;
          left: -5px;
          cursor: nw-resize;
        }

        .resize-ne {
          top: -5px;
          right: -5px;
          cursor: ne-resize;
        }

        .resize-sw {
          bottom: -5px;
          left: -5px;
          cursor: sw-resize;
        }

        .resize-se {
          bottom: -5px;
          right: -5px;
          cursor: se-resize;
        }
      `}</style>
    </div>
  );
};

// Fonctions utilitaires
function getBlockIcon(type: BlockType): string {
  const icons: Record<BlockType, string> = {
    'Titre': 'T',
    'Sous-titre': 'S',
    'Paragraphe': '¶',
    'Image': '🖼️',
    'Graphique': '📊',
    'Tableau': '▦',
    'Deux colonnes': '▌▐',
    'Liste': '☰',
  };
  return icons[type];
}

function renderBlockContent(block: BlockData): React.ReactNode {
  switch (block.type) {
    case 'Titre':
      return (
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#0a1628',
            margin: 0,
          }}
        >
          {block.content || 'Nouveau titre'}
        </h2>
      );
    case 'Sous-titre':
      return (
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#333333',
            margin: 0,
          }}
        >
          {block.content || 'Nouveau sous-titre'}
        </h3>
      );
    case 'Paragraphe':
      return (
        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#444444',
            margin: 0,
          }}
        >
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
    case 'Graphique':
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
    case 'Tableau':
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
                <td style={{ padding: '8px', fontSize: '12px', borderBottom: '1px solid #e0e0e0' }}>Donnée 1</td>
                <td style={{ padding: '8px', fontSize: '12px', borderBottom: '1px solid #e0e0e0' }}>Donnée 2</td>
                <td style={{ padding: '8px', fontSize: '12px', borderBottom: '1px solid #e0e0e0' }}>Donnée 3</td>
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
    case 'Deux colonnes':
      return (
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#666666' }}>Colonne gauche</p>
          </div>
          <div style={{ flex: 1, padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#666666' }}>Colonne droite</p>
          </div>
        </div>
      );
    case 'Liste':
      const items = block.content.split('\n').filter(item => item.trim());
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
    default:
      return <div>{block.content}</div>;
  }
}

export default DraggableBlock;
