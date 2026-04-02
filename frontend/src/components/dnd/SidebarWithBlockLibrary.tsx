import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Blocks, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { BlockLibraryContent } from './BlockLibrary';
import type { BlockType } from '@/types';

interface SidebarWithBlockLibraryProps {
  onAddBlock?: (type: BlockType) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function SidebarWithBlockLibrary({
  onAddBlock,
  isOpen = true,
  onToggle,
}: SidebarWithBlockLibraryProps) {
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddBlock = (type: BlockType) => {
    onAddBlock?.(type);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-alecia-silver/20">
      {/* Header */}
      <div className="p-4 border-b border-alecia-silver/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Blocks className="w-5 h-5 text-alecia-navy" />
            <h3 className="font-semibold text-alecia-navy">Bibliothèque</h3>
          </div>
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 hover:bg-alecia-silver/10 rounded"
            >
              <ChevronDown className="w-4 h-4 text-alecia-silver" />
            </button>
          )}
        </div>
        <p className="text-xs text-alecia-silver mt-1">
          Glissez ou cliquez pour ajouter
        </p>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-alecia-silver/20">
        <input
          type="text"
          placeholder="Rechercher un bloc..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-alecia-silver/5 border border-alecia-silver/20 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-alecia-navy/20 focus:border-alecia-navy
            placeholder:text-alecia-silver"
        />
      </div>

      {/* Block Library */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        <BlockLibraryContent onAddBlock={handleAddBlock} />
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-alecia-silver/20 bg-alecia-silver/5">
        <p className="text-xs text-alecia-silver text-center">
          {isLibraryExpanded ? '24 blocs disponibles' : 'Cliquez pour développer'}
        </p>
      </div>
    </div>
  );
}

// Drop zone pour le canvas
interface CanvasDropZoneProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  onDrop?: (blockType: BlockType) => void;
}

export function CanvasDropZone({
  id = 'canvas-drop-zone',
  children,
  className = '',
  onDrop,
}: CanvasDropZoneProps) {
  const { setNodeRef, isOver, active } = useDroppable({
    id,
    data: { type: 'canvas' },
  });

  // Vérifie si on survole avec un bloc
  const isDraggingBlock = active?.data?.current?.type === 'block';

  return (
    <div
      ref={setNodeRef}
      className={`
        relative transition-all duration-200
        ${isOver && isDraggingBlock ? 'ring-2 ring-alecia-red ring-offset-2' : ''}
        ${className}
      `}
    >
      {/* Overlay de drop */}
      {isOver && isDraggingBlock && (
        <div className="absolute inset-0 bg-alecia-red/10 rounded-lg z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-alecia-red text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Déposer pour ajouter</span>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

// Export par défaut avec le container complet
export { BlockLibraryContent as BlockLibrary };
