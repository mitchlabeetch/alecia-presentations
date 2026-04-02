import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Copy, Trash2, MoreVertical } from 'lucide-react';
import type { Slide } from '@/types';
import { useState } from 'react';

interface SortableSlideItemProps {
  slide: Slide;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SortableSlideItem({ slide, isActive, onSelect, onDuplicate, onDelete }: SortableSlideItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate?.(slide.id);
    setShowMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(slide.id);
    setShowMenu(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group flex items-center gap-2 p-2 rounded-lg cursor-pointer
        transition-all duration-200
        ${isActive ? 'bg-alecia-navy/10 ring-2 ring-alecia-navy' : 'hover:bg-alecia-silver/10'}
        ${isDragging ? 'shadow-lg z-50' : ''}
      `}
      onClick={() => onSelect(slide.id)}
    >
      <button
        className="flex-shrink-0 p-1 rounded hover:bg-alecia-silver/20 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Glisser pour réorganiser"
      >
        <GripVertical className="w-4 h-4 text-alecia-silver" />
      </button>

      <div
        className="flex-shrink-0 w-16 h-9 bg-white rounded border border-alecia-silver/20 shadow-sm overflow-hidden"
      >
        <div className="w-full h-full flex items-center justify-center bg-alecia-navy text-white text-xs font-bold">
          {slide.orderIndex + 1}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-alecia-navy truncate">
          {slide.title || `Diapositive ${slide.orderIndex + 1}`}
        </p>
        <p className="text-xs text-alecia-silver">
          {slide.type}
        </p>
      </div>

      <div className="relative">
        <button
          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-alecia-silver/20 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          aria-label="Menu"
        >
          <MoreVertical className="w-4 h-4 text-alecia-silver" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-alecia-silver/20 py-1 z-50">
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-alecia-silver/10 flex items-center gap-2"
              onClick={handleDuplicate}
            >
              <Copy className="w-4 h-4" />
              Dupliquer
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-alecia-silver/10 flex items-center gap-2 text-alecia-red"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface SortableSlideListProps {
  slides: Slide[];
  activeSlideId: string | null;
  onSelectSlide: (id: string) => void;
  onReorder?: (activeId: string, overId: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SortableSlideList({
  slides,
  activeSlideId,
  onSelectSlide,
  onReorder,
  onDuplicate,
  onDelete,
}: SortableSlideListProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
      {slides.map((slide) => (
        <SortableSlideItem
          key={slide.id}
          slide={slide}
          isActive={slide.id === activeSlideId}
          onSelect={onSelectSlide}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
      
      {slides.length === 0 && (
        <div className="text-center py-8 text-alecia-silver text-sm">
          Aucune diapositive
        </div>
      )}
    </div>
  );
}
