/**
 * Liste de slides réordonnables
 * Alecia Presentations - Conseil financier français
 * 
 * Permet de réorganiser les slides par glisser-déposer
 */

import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay as DndKitDragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DraggableSlide } from './DraggableSlide';
import { DragOverlay } from './DragOverlay';
import type { SlideData } from './types';

interface SortableSlideListProps {
  slides: SlideData[];
  selectedSlideId?: string | null;
  onSlideReorder: (slides: SlideData[]) => void;
  onSlideSelect: (slideId: string) => void;
  onSlideDelete?: (slideId: string) => void;
  onSlideDuplicate?: (slideId: string) => void;
  onSlideAdd?: () => void;
  className?: string;
  emptyMessage?: string;
}

export const SortableSlideList: React.FC<SortableSlideListProps> = ({
  slides,
  selectedSlideId,
  onSlideReorder,
  onSlideSelect,
  onSlideDelete,
  onSlideDuplicate,
  onSlideAdd,
  className = '',
  emptyMessage = 'Aucune slide',
}) => {
  const [items, setItems] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState<SlideData | null>(null);

  // Synchroniser les items avec les slides
  useEffect(() => {
    const slideIds = slides.map((slide) => slide.id);
    setItems(slideIds);
  }, [slides]);

  // Configuration des capteurs
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    const slide = slides.find((s) => s.id === active.id);
    if (slide) {
      setActiveSlide(slide);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Mettre à jour l'ordre des slides
      const reorderedSlides = newItems
        .map((id, index) => {
          const slide = slides.find((s) => s.id === id);
          return slide ? { ...slide, order: index } : null;
        })
        .filter((s): s is SlideData => s !== null);

      onSlideReorder(reorderedSlides);
    }

    setActiveId(null);
    setActiveSlide(null);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <div className={`alecia-slide-list ${className}`}>
      {/* En-tête */}
      <div className="slide-list-header">
        <h3 className="list-title">Slides</h3>
        <span className="slide-count">{slides.length}</span>
        {onSlideAdd && (
          <button
            className="add-slide-btn"
            onClick={onSlideAdd}
            title="Ajouter une nouvelle slide"
          >
            <span className="btn-icon">+</span>
            <span className="btn-text">Nouvelle</span>
          </button>
        )}
      </div>

      {/* Liste des slides */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          <div className="slides-container">
            {slides.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📑</span>
                <p className="empty-text">{emptyMessage}</p>
                {onSlideAdd && (
                  <button className="empty-add-btn" onClick={onSlideAdd}>
                    Créer une slide
                  </button>
                )}
              </div>
            ) : (
              slides
                .sort((a, b) => items.indexOf(a.id) - items.indexOf(b.id))
                .map((slide) => (
                  <DraggableSlide
                    key={slide.id}
                    slide={slide}
                    isSelected={slide.id === selectedSlideId}
                    onSelect={onSlideSelect}
                    onDelete={onSlideDelete}
                    onDuplicate={onSlideDuplicate}
                  />
                ))
            )}
          </div>
        </SortableContext>

        {/* Overlay de drag */}
        <DndKitDragOverlay dropAnimation={dropAnimation}>
          {activeId && activeSlide ? (
            <div
              style={{
                transform: 'rotate(3deg) scale(1.05)',
                cursor: 'grabbing',
              }}
            >
              <DraggableSlide
                slide={activeSlide}
                isSelected={false}
                showActions={false}
              />
            </div>
          ) : null}
        </DndKitDragOverlay>
      </DndContext>

      {/* Pied de liste */}
      {slides.length > 0 && (
        <div className="slide-list-footer">
          <p className="footer-hint">
            Glissez les slides pour réorganiser
          </p>
        </div>
      )}

      <style jsx>{`
        .alecia-slide-list {
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: #f8f9fa;
          border-right: 1px solid #e0e0e0;
        }

        .slide-list-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid #e0e0e0;
          background-color: #ffffff;
        }

        .list-title {
          font-size: 16px;
          font-weight: 600;
          color: #0a1628;
          margin: 0;
        }

        .slide-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          padding: 0 8px;
          background-color: #e91e63;
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          border-radius: 12px;
        }

        .add-slide-btn {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background-color: #e91e63;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-slide-btn:hover {
          background-color: #c2185b;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(233, 30, 99, 0.3);
        }

        .btn-icon {
          font-size: 16px;
          font-weight: 300;
        }

        .slides-container {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          text-align: center;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-text {
          font-size: 14px;
          color: #666666;
          margin: 0 0 16px 0;
        }

        .empty-add-btn {
          padding: 10px 20px;
          background-color: #e91e63;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .empty-add-btn:hover {
          background-color: #c2185b;
        }

        .slide-list-footer {
          padding: 12px 16px;
          border-top: 1px solid #e0e0e0;
          background-color: #ffffff;
        }

        .footer-hint {
          margin: 0;
          font-size: 11px;
          color: #999999;
          text-align: center;
        }

        /* Scrollbar personnalisée */
        .slides-container::-webkit-scrollbar {
          width: 6px;
        }

        .slides-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .slides-container::-webkit-scrollbar-thumb {
          background-color: #cccccc;
          border-radius: 3px;
        }

        .slides-container::-webkit-scrollbar-thumb:hover {
          background-color: #999999;
        }
      `}</style>
    </div>
  );
};

export default SortableSlideList;
