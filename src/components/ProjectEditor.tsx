import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { SlideEditor } from './SlideEditor';
import { SlidePreview } from './SlidePreview';
import { AIChatPanel } from './AIChatPanel';
import { ProjectSettings } from './ProjectSettings';
import { SearchPanel } from './SearchPanel';
import { UploadPanel } from './UploadPanel';
import { TemplateGallery } from './TemplateGallery';
import { PresentationMode } from './PresentationMode';
import { ExportButton } from './ExportButton';
import { SaveTemplateModal } from './SaveTemplateModal';
import { SlideElementLibrary } from './SlideElementLibrary';
import { PitchForgeLogo } from './Logo';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useUndoRedo } from '../hooks/useUndoRedo';
import usePresence from '@convex-dev/presence/react';
import FacePile from '@convex-dev/presence/facepile';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAnalyticsStore } from '../store/analytics';

interface Props {
  projectId: Id<'projects'>;
  onBack: () => void;
}

type Panel = 'chat' | 'elements' | 'search' | 'uploads' | 'settings' | null;

function SortableSlide({
  slide,
  idx,
  isActive,
  theme,
  onClick,
  commentCount,
}: {
  slide: { _id: Id<'slides'>; title: string; type: string; content: string };
  idx: number;
  isActive: boolean;
  theme: { primaryColor: string; accentColor: string; fontFamily: string };
  onClick: () => void;
  commentCount?: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slide._id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border-2 cursor-pointer transition-all group relative ${
        isActive
          ? 'border-[#1a3a5c] shadow-md'
          : 'border-transparent hover:border-gray-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-1 p-1.5">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="mt-1.5 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 flex-shrink-0 select-none px-0.5"
          style={{ fontSize: '11px', lineHeight: 1 }}
          onClick={(e) => e.stopPropagation()}
          title="Glisser pour réordonner"
        >
          ⠿
        </div>
        <div className="flex-1 min-w-0" onClick={onClick}>
          {/* Thumbnail */}
          <div className="w-full aspect-video rounded-md overflow-hidden relative bg-gray-50 shadow-sm">
            <div
              style={{
                transform: 'scale(0.28)',
                transformOrigin: 'top left',
                width: '357%',
                height: '357%',
                pointerEvents: 'none',
              }}
            >
              <SlidePreview slide={slide} theme={theme} compact={false} />
            </div>
            {isActive && (
              <div className="absolute inset-0 ring-2 ring-[#1a3a5c] ring-inset rounded-md" />
            )}
            {commentCount !== undefined && commentCount > 0 && (
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-white text-[8px] font-bold flex items-center justify-center shadow">
                {commentCount}
              </div>
            )}
          </div>
          {/* Slide number + title */}
          <div className="flex items-center gap-1 mt-1 px-0.5">
            <span className="text-[9px] font-bold text-gray-300 tabular-nums flex-shrink-0">
              {idx + 1}
            </span>
            <p className="text-[10px] text-gray-500 truncate leading-tight flex-1">{slide.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const PANEL_BUTTONS: Array<{ id: Panel; label: string; icon: string }> = [
  { id: 'chat', label: 'IA', icon: '✨' },
  { id: 'elements', label: 'Éléments', icon: '🧩' },
  { id: 'search', label: 'Recherche', icon: '🔍' },
  { id: 'uploads', label: 'Fichiers', icon: '📎' },
  { id: 'settings', label: 'Réglages', icon: '⚙️' },
];

export function ProjectEditor({ projectId, onBack }: Props) {
  const project = useQuery(api.projects.get, { projectId });
  const slides = useQuery(api.slides.list, { projectId }) ?? [];
  const userId = useQuery(api.presence.getUserId);
  const allComments = useQuery(api.comments.listByProject, { projectId }) ?? [];
  const bulkInsert = useMutation(api.slides.bulkInsert);
  const upsertSlide = useMutation(api.slides.upsert);
  const reorderSlides = useMutation(api.slides.reorder);
  const duplicateSlide = useMutation(api.slides.duplicate);
  const removeSlide = useMutation(api.slides.remove);
  const generateDeck = useMutation(api.chat.generateDeck);

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [activePanel, setActivePanel] = useState<Panel>('chat');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [generatingDeck, setGeneratingDeck] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      modifiers: ['meta'],
      description: 'Save project',
      action: () => {
        toast.success('Projet enregistré');
      },
    },
    {
      key: 'z',
      modifiers: ['meta'],
      description: 'Undo',
      action: undo,
    },
    {
      key: 'z',
      modifiers: ['meta', 'shift'],
      description: 'Redo',
      action: redo,
    },
    {
      key: 'd',
      modifiers: ['meta'],
      description: 'Duplicate slide',
      action: async () => {
        const selectedSlideId = slides[activeSlideIdx]?._id;
        if (selectedSlideId) {
          await duplicateSlide({ slideId: selectedSlideId });
          toast.success('Diapositive dupliquée');
        }
      },
    },
    {
      key: 'delete',
      description: 'Delete slide',
      action: async () => {
        const selectedSlideId = slides[activeSlideIdx]?._id;
        if (selectedSlideId && confirm('Supprimer cette diapositive ?')) {
          await removeSlide({ slideId: selectedSlideId });
          toast.success('Diapositive supprimée');
        }
      },
    },
    {
      key: 'arrowup',
      description: 'Previous slide',
      action: () => {
        setActiveSlideIdx(Math.max(0, activeSlideIdx - 1));
      },
    },
    {
      key: 'arrowdown',
      description: 'Next slide',
      action: () => {
        setActiveSlideIdx(Math.min(slides.length - 1, activeSlideIdx + 1));
      },
    },
    {
      key: 'p',
      modifiers: ['meta'],
      description: 'Toggle presentation mode',
      action: () => {
        setShowPresentation(true);
      },
    },
    {
      key: 'escape',
      description: 'Close / Exit',
      action: () => {
        setShowPresentation(false);
        setActivePanel(null);
      },
    },
    {
      key: 'c',
      modifiers: ['meta'],
      description: 'Toggle comments panel',
      action: () => {
        setActivePanel(activePanel === 'chat' ? null : 'chat');
      },
    },
  ]);

  // Track project opened
  useEffect(() => {
    useAnalyticsStore.getState().trackEvent('project_opened', {
      projectId,
      slideCount: slides.length,
    });
  }, [projectId]);

  const presenceState = usePresence(api.presence, `project-${projectId}`, userId ?? '', 10000);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const activeSlide = slides[activeSlideIdx] ?? null;
  const theme = project?.theme ?? {
    primaryColor: '#1a3a5c',
    accentColor: '#c9a84c',
    fontFamily: 'Inter',
  };

  const commentsBySlide: Record<string, number> = {};
  for (const c of allComments) {
    if (!c.resolved) {
      commentsBySlide[c.slideId] = (commentsBySlide[c.slideId] ?? 0) + 1;
    }
  }
  const totalOpenComments = Object.values(commentsBySlide).reduce((a, b) => a + b, 0);

  async function addSlide() {
    await upsertSlide({
      projectId,
      order: slides.length,
      type: 'custom',
      title: 'Nouvelle diapositive',
      content: 'Contenu de la diapositive',
    });
    setActiveSlideIdx(slides.length);
    toast.success('Diapositive ajoutée');
    useAnalyticsStore.getState().trackEvent('slide_created', { projectId });
  }

  async function handleTemplateSelect(
    _: Id<'templates'> | null,
    builtinSlides?: Array<{ type: string; title: string; content: string }>
  ) {
    if (builtinSlides) {
      await bulkInsert({
        projectId,
        slides: builtinSlides.map((s, i) => ({ ...s, order: slides.length + i })),
      });
      toast.success('Modèle appliqué');
    }
    setShowTemplates(false);
  }

  async function handleGenerateDeck() {
    if (!project) return;
    setGeneratingDeck(true);
    setActivePanel('chat');
    useAnalyticsStore.getState().trackEvent('ai_chat', { projectId });
    try {
      const ctx = `Projet: ${project.name}, Cible: ${project.targetCompany ?? 'N/A'}, Type: ${project.dealType ?? 'N/A'}, Secteur: ${project.targetSector ?? 'N/A'}`;
      await generateDeck({ projectId, projectContext: ctx });
      toast.success('Génération en cours...');
    } catch {
      toast.error('Erreur lors de la génération');
    } finally {
      setGeneratingDeck(false);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = slides.findIndex((s) => s._id === active.id);
    const newIdx = slides.findIndex((s) => s._id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const newOrder = [...slides];
    const [moved] = newOrder.splice(oldIdx, 1);
    newOrder.splice(newIdx, 0, moved);
    reorderSlides({ projectId, slideIds: newOrder.map((s) => s._id) });
    setActiveSlideIdx(newIdx);
  }

  return (
    <div className="h-screen flex flex-col bg-[#f7f8fa] overflow-hidden">
      {/* ── Top bar ── */}
      <header className="h-12 flex items-center justify-between px-3 bg-white border-b border-gray-100 flex-shrink-0 shadow-sm z-20">
        {/* Left: back + project info */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-gray-500 hover:text-[#1a3a5c] hover:bg-[#1a3a5c]/5 transition-all text-xs font-medium flex-shrink-0"
            title="Retour au tableau de bord"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:block">Retour</span>
          </button>
          <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
          <PitchForgeLogo size={24} className="flex-shrink-0" />
          <div className="min-w-0 flex items-center gap-2">
            <span className="font-bold text-[#1a3a5c] text-sm truncate max-w-[160px] sm:max-w-[240px]">
              {project?.name ?? 'Chargement...'}
            </span>
            {project?.targetCompany && (
              <span className="text-xs text-gray-400 truncate hidden md:block max-w-[120px]">
                · {project.targetCompany}
              </span>
            )}
            {project?.dealType && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 hidden lg:block"
                style={{ background: `${theme.accentColor}22`, color: theme.accentColor }}
              >
                {project.dealType}
              </span>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Presence */}
          {userId && presenceState && (
            <div className="mr-1">
              <FacePile presenceState={presenceState} />
            </div>
          )}

          {/* Open comments badge */}
          {totalOpenComments > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
              <span>💬</span>
              <span>{totalOpenComments}</span>
            </div>
          )}

          {/* Export */}
          {project && slides.length > 0 && (
            <ExportButton
              slides={slides}
              theme={theme}
              projectName={project.name}
              onExport={(format, slideCount) => {
                useAnalyticsStore.getState().trackEvent('export', { format, slideCount });
              }}
            />
          )}

          {/* Save as template */}
          <button
            onClick={() => setShowSaveTemplate(true)}
            disabled={slides.length === 0}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40"
            title="Sauvegarder comme modèle"
          >
            <span>💾</span>
            <span className="hidden lg:block">Modèle</span>
          </button>

          {/* Templates */}
          <button
            onClick={() => setShowTemplates(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
            title="Galerie de modèles"
          >
            <span>📋</span>
            <span className="hidden lg:block">Modèles</span>
          </button>

          {/* Keyboard shortcuts help */}
          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
            title="Raccourcis clavier (?)"
          >
            <span>⌨️</span>
            <span className="hidden sm:block">Aide</span>
          </button>

          {/* Present */}
          <button
            onClick={() => setShowPresentation(true)}
            disabled={slides.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40"
            title="Mode présentation (plein écran)"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="hidden sm:block">Présenter</span>
          </button>

          {/* Add slide */}
          <button
            onClick={addSlide}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all hover:opacity-90 shadow-sm"
            style={{ background: theme.primaryColor }}
          >
            <span className="text-base leading-none">+</span>
            <span className="hidden sm:block">Diapo</span>
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Slide rail (left) ── */}
        <div className="w-[148px] bg-white border-r border-gray-100 flex flex-col overflow-hidden flex-shrink-0">
          <div className="px-2.5 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {slides.length} diapo{slides.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={addSlide}
              className="w-5 h-5 rounded-md text-white text-xs flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
              style={{ background: theme.primaryColor }}
              title="Ajouter une diapositive"
            >
              +
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={slides.map((s) => s._id)}
                strategy={verticalListSortingStrategy}
              >
                {slides.map((slide, idx) => (
                  <SortableSlide
                    key={slide._id}
                    slide={slide}
                    idx={idx}
                    isActive={activeSlideIdx === idx}
                    theme={theme}
                    onClick={() => setActiveSlideIdx(idx)}
                    commentCount={commentsBySlide[slide._id]}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {slides.length === 0 && (
              <div className="text-center py-10 px-2">
                <p className="text-[10px] text-gray-400 leading-relaxed">Aucune diapositive</p>
                <button
                  onClick={addSlide}
                  className="mt-2 text-[10px] font-semibold hover:underline"
                  style={{ color: theme.primaryColor }}
                >
                  + Ajouter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Main editor ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {activeSlide ? (
            <SlideEditor
              slide={activeSlide}
              project={project}
              onPrev={() => setActiveSlideIdx(Math.max(0, activeSlideIdx - 1))}
              onNext={() => setActiveSlideIdx(Math.min(slides.length - 1, activeSlideIdx + 1))}
              hasPrev={activeSlideIdx > 0}
              hasNext={activeSlideIdx < slides.length - 1}
              slideIndex={activeSlideIdx}
              totalSlides={slides.length}
              onDuplicated={setActiveSlideIdx}
              onDuplicate={async () => {
                const selectedSlideId = slides[activeSlideIdx]?._id;
                if (selectedSlideId) {
                  await duplicateSlide({ slideId: selectedSlideId });
                  toast.success('Diapositive dupliquée');
                }
              }}
              onDelete={async () => {
                const selectedSlideId = slides[activeSlideIdx]?._id;
                if (selectedSlideId && confirm('Supprimer cette diapositive ?')) {
                  await removeSlide({ slideId: selectedSlideId });
                  toast.success('Diapositive supprimée');
                }
              }}
            />
          ) : (
            <EmptyState
              theme={theme}
              onGenerate={handleGenerateDeck}
              onTemplates={() => setShowTemplates(true)}
              onElements={() => setActivePanel('elements')}
              onAdd={addSlide}
              generating={generatingDeck}
            />
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="w-[300px] bg-white border-l border-gray-100 flex flex-col flex-shrink-0">
          {/* Panel tab bar */}
          <div className="flex border-b border-gray-100 flex-shrink-0">
            {PANEL_BUTTONS.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActivePanel(activePanel === btn.id ? null : btn.id)}
                className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 transition-all relative min-w-0 ${
                  activePanel === btn.id
                    ? 'text-[#1a3a5c] bg-[#1a3a5c]/5'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                title={btn.label}
              >
                {activePanel === btn.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a3a5c] rounded-t" />
                )}
                <span className="text-sm leading-none">{btn.icon}</span>
                <span className="text-[9px] font-semibold leading-tight">
                  {btn.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            {activePanel === 'chat' && (
              <AIChatPanel projectId={projectId} project={project} slides={slides} />
            )}
            {activePanel === 'elements' && (
              <SlideElementLibrary
                projectId={projectId}
                currentSlideCount={slides.length}
                theme={theme}
                onInserted={() => setActiveSlideIdx(slides.length)}
              />
            )}
            {activePanel === 'search' && (
              <SearchPanel
                projectId={projectId}
                onSelectSlide={setActiveSlideIdx}
                slides={slides}
              />
            )}
            {activePanel === 'uploads' && <UploadPanel projectId={projectId} />}
            {activePanel === 'settings' && (
              <ProjectSettings projectId={projectId} project={project} />
            )}
            {activePanel === null && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center px-6">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg">👈</span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Sélectionnez un panneau</p>
                  <p className="text-[10px] text-gray-300 mt-1">
                    IA, éléments, recherche, fichiers ou réglages
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showTemplates && (
        <TemplateGallery onClose={() => setShowTemplates(false)} onSelect={handleTemplateSelect} />
      )}
      {showPresentation && (
        <PresentationMode
          slides={slides}
          theme={theme}
          initialIndex={activeSlideIdx}
          onClose={() => setShowPresentation(false)}
        />
      )}
      {showSaveTemplate && (
        <SaveTemplateModal slides={slides} onClose={() => setShowSaveTemplate(false)} />
      )}
      {showHelp && <KeyboardShortcutsHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />}
    </div>
  );
}

function EmptyState({
  theme,
  onGenerate,
  onTemplates,
  onElements,
  onAdd,
  generating,
}: {
  theme: { primaryColor: string; accentColor: string };
  onGenerate: () => void;
  onTemplates: () => void;
  onElements: () => void;
  onAdd: () => void;
  generating: boolean;
}) {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
      <div className="text-center max-w-sm px-6 animate-fade-in">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm"
          style={{ background: `${theme.primaryColor}15` }}
        >
          <span className="text-3xl">✨</span>
        </div>
        <h3 className="text-lg font-bold mb-2 text-[#1a3a5c]">Commencez votre pitch deck</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Laissez l'IA générer un deck complet, choisissez un modèle, ou créez manuellement.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onGenerate}
            disabled={generating}
            className="px-5 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            style={{ background: theme.primaryColor }}
          >
            {generating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{' '}
                Génération...
              </>
            ) : (
              <>✨ Générer avec l'IA</>
            )}
          </button>
          <button
            onClick={onTemplates}
            className="px-5 py-3 rounded-xl border-2 text-sm font-semibold hover:opacity-80 transition-all"
            style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
          >
            📋 Choisir un modèle
          </button>
          <div className="flex gap-2">
            <button
              onClick={onElements}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              🧩 Éléments
            </button>
            <button
              onClick={onAdd}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              + Manuel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
