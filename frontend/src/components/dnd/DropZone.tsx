import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

interface DropZoneProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
  isOver?: boolean;
}

export function DropZone({ id, children, className = '', isOver }: DropZoneProps) {
  const { setNodeRef, isOver: localIsOver } = useDroppable({ id });

  const showIndicator = isOver || localIsOver;

  return (
    <div
      ref={setNodeRef}
      className={`
        relative transition-all duration-200
        ${showIndicator ? 'ring-2 ring-alecia-red ring-offset-2' : ''}
        ${className}
      `}
    >
      {showIndicator && (
        <div className="absolute inset-0 bg-alecia-red/5 rounded-lg pointer-events-none" />
      )}
      {children}
    </div>
  );
}

interface CanvasDropZoneProps {
  id: string;
  children?: React.ReactNode;
  onDrop?: (event: React.DragEvent) => void;
}

export function CanvasDropZone({ id, children, onDrop }: CanvasDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        relative w-full h-full bg-white rounded-lg overflow-hidden
        transition-all duration-200
        ${isOver ? 'ring-2 ring-alecia-red' : ''}
      `}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-alecia-red/10 z-10 pointer-events-none">
          <div className="bg-alecia-red text-white px-4 py-2 rounded-lg text-sm font-medium">
            Déposer ici
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
