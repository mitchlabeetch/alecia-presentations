import { useCallback, useState } from 'react';
import {
  Plus,
  GripVertical,
  Copy,
  Trash2,
  ChevronDown,
  LayoutTemplate,
} from 'lucide-react';
import { useSlides, useProjects, useAppStore } from '@/store/useAppStore';
import type { Slide, BlockType } from '@/types';

interface SlideListProps {
  slides: Slide[];
  activeSlideId: string | null;
  onSelectSlide: (slideId: string) => void;
}

export function SlideList({ slides, activeSlideId, onSelectSlide }: SlideListProps) {
  const { addSlide, deleteSlide, reorderSlides } = useSlides();
  const { currentProject } = useProjects();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;

      const newSlides = [...slides];
      const [removed] = newSlides.splice(draggedIndex, 1);
      newSlides.splice(index, 0, removed);

      const [activeSlide] = slides.filter((s) => s.id === activeSlideId);
      if (activeSlide) {
        const newActiveIndex = newSlides.findIndex((s) => s.id === activeSlide.id);
        if (newActiveIndex !== -1 && newActiveIndex !== index) {
          reorderSlides(newSlides[draggedIndex].id, newSlides[index].id);
        }
      }

      setDraggedIndex(index);
    },
    [draggedIndex, slides, activeSlideId, reorderSlides]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const handleAddSlide = useCallback(() => {
    const newSlide = addSlide('Titre', 'Nouvelle slide', {});
    if (newSlide) {
      onSelectSlide(newSlide.id);
    }
  }, [addSlide, onSelectSlide]);

  const handleDuplicateSlide = useCallback(
    (slideId: string) => {
      const slideToDuplicate = slides.find((s) => s.id === slideId);
      if (slideToDuplicate) {
        const newSlide = addSlide(
          slideToDuplicate.type,
          `${slideToDuplicate.title} (copie)`,
          slideToDuplicate.content
        );
        if (newSlide) {
          onSelectSlide(newSlide.id);
        }
      }
    },
    [slides, addSlide, onSelectSlide]
  );

  const handleDeleteSlide = useCallback(
    (slideId: string) => {
      if (slides.length <= 1) {
        alert('Impossible de supprimer la dernière slide');
        return;
      }

      if (confirm('Êtes-vous sûr de vouloir supprimer cette slide ?')) {
        deleteSlide(slideId);

        const remainingSlides = slides.filter((s) => s.id !== slideId);
        if (remainingSlides.length > 0 && activeSlideId === slideId) {
          onSelectSlide(remainingSlides[0].id);
        }
      }
    },
    [slides, activeSlideId, deleteSlide, onSelectSlide]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-alecia-silver/20">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-sm font-medium text-alecia-navy hover:text-alecia-red transition-colors"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
          />
          Slides
          <span className="text-alecia-silver">({slides.length})</span>
        </button>
        <button
          onClick={handleAddSlide}
          className="p-1.5 hover:bg-alecia-silver/10 rounded transition-colors"
          title="Ajouter une slide"
        >
          <Plus className="w-4 h-4 text-alecia-navy" />
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {slides.map((slide, index) => {
            const isActive = slide.id === activeSlideId;
            const isDragging = draggedIndex === index;

            return (
              <div
                key={slide.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelectSlide(slide.id)}
                className={`group relative flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                  isActive
                    ? 'bg-alecia-navy text-white'
                    : 'hover:bg-alecia-silver/10'
                } ${isDragging ? 'opacity-50' : ''}`}
              >
                <div
                  className={`opacity-0 group-hover:opacity-100 cursor-grab ${
                    isActive ? 'opacity-100 text-white/50' : 'text-alecia-silver'
                  }`}
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                <div
                  className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                    isActive
                      ? 'bg-alecia-red text-white'
                      : 'bg-alecia-silver/20 text-alecia-silver'
                  }`}
                >
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm truncate ${
                      isActive ? 'text-white' : 'text-alecia-navy'
                    }`}
                  >
                    {slide.title || 'Sans titre'}
                  </p>
                  <p
                    className={`text-xs truncate ${
                      isActive ? 'text-white/60' : 'text-alecia-silver'
                    }`}
                  >
                    {getBlockTypeLabel(slide.type)}
                  </p>
                </div>

                <div
                  className={`flex-shrink-0 flex items-center gap-1 ${
                    isActive ? 'text-white/60' : 'text-alecia-silver'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateSlide(slide.id);
                    }}
                    className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100"
                    title="Dupliquer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSlide(slide.id);
                    }}
                    className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className={isActive ? 'text-white/60' : 'text-alecia-silver'}>
                  <LayoutTemplate className="w-4 h-4" />
                </div>
              </div>
            );
          })}

          {slides.length === 0 && (
            <div className="text-center py-8">
              <LayoutTemplate className="w-8 h-8 mx-auto text-alecia-silver/50" />
              <p className="mt-2 text-sm text-alecia-silver">
                Aucune slide
              </p>
              <button
                onClick={handleAddSlide}
                className="mt-2 text-sm text-alecia-red hover:underline"
              >
                Ajouter une slide
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getBlockTypeLabel(type: BlockType): string {
  const labels: Partial<Record<BlockType, string>> = {
    Titre: 'Titre',
    'Sous-titre': 'Sous-titre',
    Paragraphe: 'Paragraphe',
    Liste: 'Liste',
    Citation: 'Citation',
    KPI_Card: 'KPI',
    Chart_Block: 'Graphique',
    Table_Block: 'Tableau',
    Timeline_Block: 'Chronologie',
    Company_Overview: 'Entreprise',
    Deal_Rationale: 'Justification',
    SWOT: 'SWOT',
    Key_Metrics: 'Métriques',
    Process_Timeline: 'Processus',
    Team_Grid: 'Équipe',
    Team_Row: 'Équipe',
    Advisor_List: 'Conseillers',
    Image: 'Image',
    Logo_Grid: 'Logos',
    Icon_Text: 'Icône',
    Two_Column: 'Deux colonnes',
    Section_Navigator: 'Navigation',
    Section_Divider: 'Séparateur',
    Cover: 'Couverture',
    Disclaimer: 'Avertissement',
    Trackrecord_Block: 'Trackrecord',
    CSR_Block: 'RSE',
  };

  return labels[type] || type;
}
