import { useCallback, useState } from 'react';
import {
  Plus,
  GripVertical,
  Copy,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  LayoutTemplate,
} from 'lucide-react';
import { useSlides, useProjects } from '@/store/useAppStore';
import { api, handleApiError } from '@/lib/api';
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
  const [contextMenu, setContextMenu] = useState<{
    slideId: string;
    x: number;
    y: number;
  } | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  }, []);

  // Handle drag over
  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;

      const newSlides = [...slides];
      const [removed] = newSlides.splice(draggedIndex, 1);
      newSlides.splice(index, 0, removed);

      // Update order indices
      const updatedSlides = newSlides.map((slide, i) => ({
        ...slide,
        orderIndex: i,
      }));

      reorderSlides(updatedSlides);
      setDraggedIndex(index);
    },
    [draggedIndex, slides, reorderSlides]
  );

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);

    // Sync with server
    if (currentProject && slides.length > 0) {
      api.slides
        .reorder(currentProject.id, slides.map((s) => s.id))
        .catch(console.error);
    }
  }, [currentProject, slides]);

  // Handle add slide
  const handleAddSlide = useCallback(async () => {
    if (!currentProject) return;

    const newSlide: Partial<Slide> = {
      projectId: currentProject.id,
      orderIndex: slides.length,
      type: 'Titre' as BlockType,
      title: 'Nouvelle slide',
      content: {},
      notes: '',
      imagePath: null,
      data: null,
    };

    const result = await handleApiError(
      api.slides.create(currentProject.id, newSlide)
    );

    if (result.data) {
      addSlide(result.data);
    }
  }, [currentProject, slides.length, addSlide]);

  // Handle duplicate slide
  const handleDuplicateSlide = useCallback(
    async (slideId: string) => {
      if (!currentProject) return;

      const result = await handleApiError(
        api.slides.duplicate(currentProject.id, slideId)
      );

      if (result.data) {
        addSlide(result.data);
      }
      setContextMenu(null);
    },
    [currentProject, addSlide]
  );

  // Handle delete slide
  const handleDeleteSlide = useCallback(
    async (slideId: string) => {
      if (!currentProject) return;
      if (slides.length <= 1) {
        alert('Impossible de supprimer la dernière slide');
        return;
      }

      if (confirm('Êtes-vous sûr de vouloir supprimer cette slide ?')) {
        const result = await handleApiError(
          api.slides.delete(currentProject.id, slideId)
        );

        if (!result.error) {
          deleteSlide(slideId);
        }
      }
      setContextMenu(null);
    },
    [currentProject, slides.length, deleteSlide]
  );

  // Close context menu on outside click
  const handleContextMenuClick = useCallback(
    (e: React.MouseEvent, slideId: string) => {
      e.preventDefault();
      setContextMenu({ slideId, x: e.clientX, y: e.clientY });
    },
    []
  );

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
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

      {/* Slide List */}
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
                onContextMenu={(e) => handleContextMenuClick(e, slide.id)}
                className={`group relative flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                  isActive
                    ? 'bg-alecia-navy text-white'
                    : 'hover:bg-alecia-silver/10'
                } ${isDragging ? 'opacity-50' : ''}`}
              >
                {/* Drag Handle */}
                <div
                  className={`opacity-0 group-hover:opacity-100 cursor-grab ${
                    isActive ? 'opacity-100 text-white/50' : 'text-alecia-silver'
                  }`}
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Slide Number */}
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                    isActive
                      ? 'bg-alecia-red text-white'
                      : 'bg-alecia-silver/20 text-alecia-silver'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Slide Info */}
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

                {/* Type Icon */}
                <div
                  className={`flex-shrink-0 ${
                    isActive ? 'text-white/60' : 'text-alecia-silver'
                  }`}
                >
                  <LayoutTemplate className="w-4 h-4" />
                </div>
              </div>
            );
          })}

          {/* Empty State */}
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

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={closeContextMenu}
          />
          <div
            className="fixed bg-white rounded-xl shadow-lg border border-alecia-silver/20 py-2 min-w-[160px] z-50"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => {
                onSelectSlide(contextMenu.slideId);
                closeContextMenu();
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-alecia-silver/10 flex items-center gap-3"
            >
              <LayoutTemplate className="w-4 h-4 text-alecia-silver" />
              Sélectionner
            </button>
            <button
              onClick={() => handleDuplicateSlide(contextMenu.slideId)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-alecia-silver/10 flex items-center gap-3"
            >
              <Copy className="w-4 h-4 text-alecia-silver" />
              Dupliquer
            </button>
            <div className="border-t border-alecia-silver/20 my-2" />
            <button
              onClick={() => handleDeleteSlide(contextMenu.slideId)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-alecia-red/10 text-alecia-red flex items-center gap-3"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Helper function to get block type label
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
