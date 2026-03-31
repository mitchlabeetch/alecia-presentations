/**
 * Composant de slide déplaçable individuel
 * Alecia Presentations - Conseil financier français
 * 
 * Représente une miniature de slide qui peut être glissée pour réordonnancement
 */

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SlideData } from './types';

interface DraggableSlideProps {
  slide: SlideData;
  isSelected?: boolean;
  onSelect?: (slideId: string) => void;
  onDelete?: (slideId: string) => void;
  onDuplicate?: (slideId: string) => void;
  className?: string;
  showActions?: boolean;
}

export const DraggableSlide: React.FC<DraggableSlideProps> = ({
  slide,
  isSelected = false,
  onSelect,
  onDelete,
  onDuplicate,
  className = '',
  showActions = true,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: slide.id,
    data: {
      type: 'SLIDE',
      slide,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) {
      onSelect(slide.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(slide.id);
    }
    setShowContextMenu(false);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDuplicate) {
      onDuplicate(slide.id);
    }
    setShowContextMenu(false);
  };

  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`alecia-slide-item ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''} ${className}`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onMouseLeave={handleCloseContextMenu}
      >
        <div className="slide-container">
          {/* Numéro de slide */}
          <div className="slide-number">
            {slide.order + 1}
          </div>

          {/* Miniature de la slide */}
          <div className={`slide-thumbnail ${isSelected ? 'selected' : ''}`}>
            {slide.thumbnail ? (
              <img
                src={slide.thumbnail}
                alt={slide.title}
                className="thumbnail-image"
                draggable={false}
              />
            ) : (
              <div className="thumbnail-placeholder">
                <span className="placeholder-icon">📊</span>
                <span className="placeholder-text">{slide.title}</span>
              </div>
            )}

            {/* Indicateur de sélection */}
            {isSelected && (
              <div className="selection-indicator">
                <span>✓</span>
              </div>
            )}

            {/* Overlay pendant le drag */}
            {isDragging && (
              <div className="dragging-overlay">
                <span>Déplacement...</span>
              </div>
            )}
          </div>

          {/* Titre de la slide */}
          <div className="slide-title">
            <span className="title-text" title={slide.title}>
              {slide.title}
            </span>
          </div>

          {/* Actions rapides */}
          {showActions && !isDragging && (
            <div className="slide-actions">
              <button
                className="action-btn duplicate"
                onClick={handleDuplicate}
                title="Dupliquer la slide"
              >
                <span>📋</span>
              </button>
              <button
                className="action-btn delete"
                onClick={handleDelete}
                title="Supprimer la slide"
              >
                <span>🗑️</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Menu contextuel */}
      {showContextMenu && (
        <div
          className="context-menu"
          style={{
            position: 'fixed',
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            zIndex: 1000,
          }}
        >
          <div className="context-menu-item" onClick={handleDuplicate}>
            <span className="menu-icon">📋</span>
            <span className="menu-text">Dupliquer</span>
          </div>
          <div className="context-menu-item" onClick={handleDelete}>
            <span className="menu-icon">🗑️</span>
            <span className="menu-text">Supprimer</span>
          </div>
          <div className="context-menu-separator" />
          <div className="context-menu-item" onClick={() => setShowContextMenu(false)}>
            <span className="menu-icon">✕</span>
            <span className="menu-text">Annuler</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .alecia-slide-item {
          position: relative;
          cursor: grab;
          user-select: none;
          margin-bottom: 12px;
        }

        .alecia-slide-item:active {
          cursor: grabbing;
        }

        .alecia-slide-item.dragging {
          z-index: 100;
        }

        .slide-container {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .alecia-slide-item:hover .slide-container {
          background-color: rgba(233, 30, 99, 0.05);
        }

        .alecia-slide-item.selected .slide-container {
          background-color: rgba(233, 30, 99, 0.1);
        }

        .slide-number {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0a1628;
          color: #ffffff;
          font-size: 11px;
          font-weight: 600;
          border-radius: 4px;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .slide-thumbnail {
          position: relative;
          width: 160px;
          height: 90px;
          background-color: #ffffff;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .alecia-slide-item:hover .slide-thumbnail {
          border-color: #e91e63;
          box-shadow: 0 2px 8px rgba(233, 30, 99, 0.2);
        }

        .alecia-slide-item.selected .slide-thumbnail {
          border-color: #e91e63;
          box-shadow: 0 0 0 2px rgba(233, 30, 99, 0.3);
        }

        .thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a1628 0%, #1a3a5c 100%);
          gap: 4px;
        }

        .placeholder-icon {
          font-size: 24px;
        }

        .placeholder-text {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          max-width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .selection-indicator {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          background-color: #e91e63;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 12px;
        }

        .dragging-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(233, 30, 99, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 12px;
          font-weight: 500;
        }

        .slide-title {
          flex: 1;
          min-width: 0;
          padding-top: 4px;
        }

        .title-text {
          font-size: 12px;
          color: #0a1628;
          font-weight: 500;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .alecia-slide-item.selected .title-text {
          color: #e91e63;
          font-weight: 600;
        }

        .slide-actions {
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .alecia-slide-item:hover .slide-actions {
          opacity: 1;
        }

        .action-btn {
          width: 24px;
          height: 24px;
          border: none;
          background-color: #f5f5f5;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background-color: #e91e63;
          color: #ffffff;
        }

        .action-btn.duplicate:hover {
          background-color: #2196f3;
        }

        .action-btn.delete:hover {
          background-color: #f44336;
        }

        /* Menu contextuel */
        .context-menu {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          padding: 8px 0;
          min-width: 160px;
          animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .context-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .context-menu-item:hover {
          background-color: rgba(233, 30, 99, 0.1);
        }

        .menu-icon {
          font-size: 14px;
        }

        .menu-text {
          font-size: 13px;
          color: #0a1628;
        }

        .context-menu-separator {
          height: 1px;
          background-color: #e0e0e0;
          margin: 8px 0;
        }
      `}</style>
    </>
  );
};

export default DraggableSlide;
