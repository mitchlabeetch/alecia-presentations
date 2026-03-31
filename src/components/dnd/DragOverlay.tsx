/**
 * Composant de superposition visuelle pendant le drag-and-drop
 * Alecia Presentations - Conseil financier français
 *
 * Affiche un aperçu fantôme de l'élément en cours de déplacement
 */

import React from 'react';
import { DragOverlay as DndKitDragOverlay, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { DragType, BlockType, SlideData, BlockData } from './types';

interface DragOverlayProps {
  activeId: string | null;
  activeType: DragType | null;
  // Données optionnelles pour l'aperçu
  slideData?: SlideData;
  blockType?: BlockType;
  blockData?: BlockData;
  templateName?: string;
  imageUrl?: string;
  // Style personnalisé
  className?: string;
}

// Icônes pour les différents types de blocs
const blockIcons: Record<BlockType, string> = {
  Titre: 'T',
  'Sous-titre': 'S',
  Paragraphe: '¶',
  Image: '🖼️',
  Chart_Block: '📊',
  Table_Block: '▦',
  Two_Column: '▌▐',
  Liste: '☰',
};

// Couleurs pour les différents types de blocs
const blockColors: Record<BlockType, string> = {
  Titre: '#e91e63',
  'Sous-titre': '#9c27b0',
  Paragraphe: '#2196f3',
  Image: '#4caf50',
  Chart_Block: '#ff9800',
  Table_Block: '#00bcd4',
  Two_Column: '#795548',
  Liste: '#607d8b',
};

export const DragOverlay: React.FC<DragOverlayProps> = ({
  activeId,
  activeType,
  slideData,
  blockType,
  blockData,
  templateName,
  imageUrl,
  className = '',
}) => {
  if (!activeId || !activeType) {
    return null;
  }

  return (
    <DndKitDragOverlay
      dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}
      className={`alecia-drag-overlay ${className}`}
    >
      <DragOverlayContent
        activeType={activeType}
        slideData={slideData}
        blockType={blockType}
        blockData={blockData}
        templateName={templateName}
        imageUrl={imageUrl}
      />
    </DndKitDragOverlay>
  );
};

interface DragOverlayContentProps {
  activeType: DragType;
  slideData?: SlideData;
  blockType?: BlockType;
  blockData?: BlockData;
  templateName?: string;
  imageUrl?: string;
}

const DragOverlayContent: React.FC<DragOverlayContentProps> = ({
  activeType,
  slideData,
  blockType,
  blockData,
  templateName,
  imageUrl,
}) => {
  switch (activeType) {
    case 'SLIDE':
      return <SlideOverlay slideData={slideData} />;
    case 'BLOCK':
      return <BlockOverlay blockType={blockType} blockData={blockData} />;
    case 'TEMPLATE':
      return <TemplateOverlay templateName={templateName} />;
    case 'IMAGE':
      return <ImageOverlay imageUrl={imageUrl} />;
    default:
      return null;
  }
};

// Aperçu d'une slide
interface SlideOverlayProps {
  slideData?: SlideData;
}

const SlideOverlay: React.FC<SlideOverlayProps> = ({ slideData }) => {
  return (
    <div
      style={{
        width: '200px',
        height: '120px',
        backgroundColor: '#ffffff',
        border: '2px solid #e91e63',
        borderRadius: '8px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        cursor: 'grabbing',
        transform: 'rotate(3deg) scale(1.05)',
        transition: 'transform 0.15s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '60px',
          backgroundColor: '#0a1628',
          borderRadius: '4px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#ffffff', fontSize: '10px' }}>Slide</span>
      </div>
      <span
        style={{
          fontSize: '12px',
          color: '#0a1628',
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {slideData?.title || 'Déplacer la slide'}
      </span>
    </div>
  );
};

// Aperçu d'un bloc
interface BlockOverlayProps {
  blockType?: BlockType;
  blockData?: BlockData;
}

const BlockOverlay: React.FC<BlockOverlayProps> = ({ blockType, blockData }) => {
  if (!blockType) return null;

  const color = blockColors[blockType];
  const icon = blockIcons[blockType];

  return (
    <div
      style={{
        width: '280px',
        minHeight: '80px',
        backgroundColor: '#ffffff',
        border: `2px solid ${color}`,
        borderRadius: '8px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        gap: '16px',
        cursor: 'grabbing',
        transform: 'scale(1.02)',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          backgroundColor: color,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: '#ffffff',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#0a1628',
            marginBottom: '4px',
          }}
        >
          {blockType}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#666666',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {blockData?.content || `Bloc ${blockType.toLowerCase()}`}
        </div>
      </div>
    </div>
  );
};

// Aperçu d'un template
interface TemplateOverlayProps {
  templateName?: string;
}

const TemplateOverlay: React.FC<TemplateOverlayProps> = ({ templateName }) => {
  return (
    <div
      style={{
        width: '240px',
        height: '160px',
        backgroundColor: '#ffffff',
        border: '2px solid #e91e63',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        cursor: 'grabbing',
        transform: 'scale(1.05)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100px',
          background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 100%)',
          borderRadius: '8px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '32px' }}>📑</span>
      </div>
      <span
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#0a1628',
          textAlign: 'center',
        }}
      >
        {templateName || 'Nouveau template'}
      </span>
    </div>
  );
};

// Aperçu d'une image
interface ImageOverlayProps {
  imageUrl?: string;
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({ imageUrl }) => {
  return (
    <div
      style={{
        width: '200px',
        height: '150px',
        backgroundColor: '#ffffff',
        border: '2px dashed #e91e63',
        borderRadius: '8px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        cursor: 'grabbing',
        transform: 'scale(1.05)',
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Aperçu"
          style={{
            maxWidth: '100%',
            maxHeight: '100px',
            objectFit: 'contain',
            borderRadius: '4px',
          }}
        />
      ) : (
        <>
          <span style={{ fontSize: '32px', marginBottom: '8px' }}>🖼️</span>
          <span
            style={{
              fontSize: '12px',
              color: '#666666',
              textAlign: 'center',
            }}
          >
            Image à insérer
          </span>
        </>
      )}
    </div>
  );
};

// Hook pour créer un élément de superposition personnalisé
export function useDragOverlay() {
  const [overlayData, setOverlayData] = React.useState<{
    type: DragType | null;
    data: unknown;
  }>({ type: null, data: null });

  const setOverlay = React.useCallback((type: DragType, data: unknown) => {
    setOverlayData({ type, data });
  }, []);

  const clearOverlay = React.useCallback(() => {
    setOverlayData({ type: null, data: null });
  }, []);

  return {
    overlayData,
    setOverlay,
    clearOverlay,
  };
}

export default DragOverlay;
