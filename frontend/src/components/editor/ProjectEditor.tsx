import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, X, Blocks, Sparkles, Variable, Plus } from 'lucide-react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SlideList } from './SlideList';
import { SlideCanvas } from './SlideCanvas';
import { Toolbar } from './Toolbar';
import { useSlides, useProjects, useUI, useAppStore } from '@/store/useAppStore';
import { BlockLibraryContent } from '@/components/dnd/BlockLibrary';
import { CanvasDropZone } from '@/components/dnd/SidebarWithBlockLibrary';
import { AIChatPanel } from '@/components/ai/AIChatPanel';
import type { Slide, BlockType } from '@/types';

export function ProjectEditor() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const {
    slides,
    activeSlideId,
    setActiveSlide,
    updateSlide,
    addSlide,
  } = useSlides();

  const {
    currentProject,
    setCurrentProject,
    projects,
  } = useProjects();

  const {
    sidebarOpen,
    toggleSidebar,
    aiPanelOpen,
    toggleAIPanel,
    variablesPanelOpen,
    toggleVariablesPanel,
  } = useUI();

  const [blockLibraryOpen, setBlockLibraryOpen] = useState(false);
  const [slidePanelOpen, setSlidePanelOpen] = useState(true);
  const [isDraggingBlock, setIsDraggingBlock] = useState(false);

  useEffect(() => {
    if (!projectId) {
      navigate('/');
      return;
    }

    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
    } else {
      navigate('/');
    }
  }, [projectId, projects, setCurrentProject, navigate]);

  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

  useEffect(() => {
    if (activeSlideId && slides.length > 0) {
      const slide = slides.find((s) => s.id === activeSlideId);
      setSelectedSlide(slide || null);
    } else {
      setSelectedSlide(null);
    }
  }, [activeSlideId, slides]);

  const handleSelectSlide = useCallback((slideId: string) => {
    setActiveSlide(slideId);
  }, [setActiveSlide]);

  const handleContentChange = useCallback((content: Record<string, unknown>) => {
    if (!activeSlideId) return;
    updateSlide(activeSlideId, { content });
  }, [activeSlideId, updateSlide]);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Handler pour ajouter un bloc (clic ou drop)
  const handleAddBlock = useCallback((blockType: BlockType) => {
    if (!currentProject) return;

    const newSlide = addSlide(
      blockType,
      `Nouveau ${blockType}`,
      getDefaultContent(blockType)
    );

    if (newSlide) {
      setActiveSlide(newSlide.id);
      setBlockLibraryOpen(false);
    }
  }, [addSlide, setActiveSlide, currentProject]);

  // Handler pour le drag end du DnD
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    // Vérifie si c'est un bloc de la bibliothèque
    if (active.data.current?.type === 'block') {
      const blockType = active.data.current.blockType as BlockType;

      // Si dropped sur le canvas ou juste released
      if (over?.id === 'canvas-drop-zone' || over === null) {
        handleAddBlock(blockType);
      }
    }

    setIsDraggingBlock(false);
  }, [handleAddBlock]);

  // Handler pour le drag start
  const handleDragStart = useCallback(() => {
    setIsDraggingBlock(true);
  }, []);

  if (!currentProject) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-alecia-off-white overflow-hidden">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-alecia-navy mx-auto mb-4" />
          <p className="text-alecia-silver">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen w-screen flex flex-col bg-alecia-off-white overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-alecia-silver/20 flex items-center justify-between px-4 flex-shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors"
              title="Retour a la galerie"
            >
              <ArrowLeft className="w-5 h-5 text-alecia-navy" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-alecia-navy">
                {currentProject.name}
              </h1>
              <p className="text-sm text-alecia-silver">
                {currentProject.targetCompany && (
                  <>
                    {currentProject.targetCompany}
                    {currentProject.targetSector && ` - ${currentProject.targetSector}`}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Slide Panel */}
            <button
              onClick={() => setSlidePanelOpen(!slidePanelOpen)}
              className={`p-2 rounded-lg transition-colors ${
                slidePanelOpen
                  ? 'bg-alecia-navy text-white'
                  : 'hover:bg-alecia-silver/10 text-alecia-navy'
              }`}
              title={slidePanelOpen ? 'Masquer les slides' : 'Afficher les slides'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </button>

            {/* Toggle Block Library */}
            <button
              onClick={() => setBlockLibraryOpen(!blockLibraryOpen)}
              className={`p-2 rounded-lg transition-colors ${
                blockLibraryOpen
                  ? 'bg-alecia-red text-white'
                  : 'hover:bg-alecia-silver/10 text-alecia-navy'
              }`}
              title={blockLibraryOpen ? 'Masquer la bibliotheque' : 'Afficher la bibliotheque de blocs'}
            >
              <Blocks className="w-5 h-5" />
            </button>

            {/* Toggle AI Panel */}
            <button
              onClick={toggleAIPanel}
              className={`p-2 rounded-lg transition-colors ${
                aiPanelOpen
                  ? 'bg-alecia-navy text-white'
                  : 'hover:bg-alecia-silver/10 text-alecia-navy'
              }`}
              title={aiPanelOpen ? 'Masquer le chat IA' : 'Afficher le chat IA'}
            >
              <Sparkles className="w-5 h-5" />
            </button>

            {/* Toggle Variables Panel */}
            <button
              onClick={toggleVariablesPanel}
              className={`p-2 rounded-lg transition-colors ${
                variablesPanelOpen
                  ? 'bg-alecia-navy text-white'
                  : 'hover:bg-alecia-silver/10 text-alecia-navy'
              }`}
              title={variablesPanelOpen ? 'Masquer les variables' : 'Afficher les variables'}
            >
              <Variable className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-alecia-silver/30 mx-2" />

            <Toolbar onShare={() => {}} />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Slide List Sidebar */}
          <div
            className={`h-full bg-white border-r border-alecia-silver/20 flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 ${
              slidePanelOpen ? 'w-64' : 'w-0 overflow-hidden'
            }`}
          >
            <SlideList
              slides={slides}
              activeSlideId={activeSlideId}
              onSelectSlide={handleSelectSlide}
            />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedSlide ? (
              <CanvasDropZone
                id="canvas-drop-zone"
                className="flex-1"
                onDrop={(blockType) => handleAddBlock(blockType)}
              >
                <SlideCanvas
                  slide={selectedSlide}
                  isEditing={true}
                  onContentChange={handleContentChange}
                />
              </CanvasDropZone>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Blocks className="w-16 h-16 mx-auto text-alecia-silver/30 mb-4" />
                  <p className="text-alecia-silver text-lg">
                    Selectionnez une slide ou ajoutez-en une depuis la bibliotheque
                  </p>
                  <button
                    onClick={() => setBlockLibraryOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-alecia-red text-white rounded-lg hover:bg-alecia-red/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une slide
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Block Library Panel - Slide from right */}
          <div
            className={`absolute top-0 right-0 h-full bg-white border-l border-alecia-silver/20 shadow-xl transition-transform duration-300 ease-in-out z-40 ${
              blockLibraryOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ width: '340px' }}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-alecia-silver/20">
                <div className="flex items-center gap-2">
                  <Blocks className="w-5 h-5 text-alecia-red" />
                  <h3 className="font-semibold text-alecia-navy">Bibliotheque de Blocs</h3>
                </div>
                <button
                  onClick={() => setBlockLibraryOpen(false)}
                  className="p-1 hover:bg-alecia-silver/10 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-alecia-silver" />
                </button>
              </div>

              {/* Instructions */}
              <div className="px-4 py-2 bg-alecia-navy/5 border-b border-alecia-silver/10">
                <p className="text-xs text-alecia-silver">
                  Glissez un bloc vers le canvas ou cliquez dessus pour l'ajouter
                </p>
              </div>

              {/* Block Library Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <BlockLibraryContent onAddBlock={handleAddBlock} />
              </div>

              {/* Footer hint */}
              <div className="px-4 py-3 border-t border-alecia-silver/20 bg-alecia-silver/5">
                <p className="text-xs text-alecia-silver text-center">
                  26 blocs disponibles
                </p>
              </div>
            </div>
          </div>

          {/* AI Panel - Slide from right */}
          <div
            className={`absolute top-0 right-0 h-full bg-white border-l border-alecia-silver/20 shadow-xl transition-transform duration-300 ease-in-out z-40 ${
              aiPanelOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ width: '380px' }}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-alecia-silver/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-alecia-red" />
                  <h3 className="font-semibold text-alecia-navy">Chat IA</h3>
                </div>
                <button
                  onClick={toggleAIPanel}
                  className="p-1 hover:bg-alecia-silver/10 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-alecia-silver" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                {projectId && (
                  <AIChatPanel
                    projectId={projectId}
                    onClose={toggleAIPanel}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Variables Panel - Slide from right */}
          <div
            className={`absolute top-0 right-0 h-full bg-white border-l border-alecia-silver/20 shadow-xl transition-transform duration-300 ease-in-out z-40 ${
              variablesPanelOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ width: '360px' }}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-alecia-silver/20">
                <div className="flex items-center gap-2">
                  <Variable className="w-5 h-5 text-alecia-red" />
                  <h3 className="font-semibold text-alecia-navy">Variables</h3>
                </div>
                <button
                  onClick={toggleVariablesPanel}
                  className="p-1 hover:bg-alecia-silver/10 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-alecia-silver" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <VariablesPanelContent />
              </div>
            </div>
          </div>

          {/* Overlay for panels */}
          {(aiPanelOpen || variablesPanelOpen || blockLibraryOpen) && (
            <div
              className="absolute inset-0 bg-black/20 z-30"
              onClick={() => {
                if (aiPanelOpen) toggleAIPanel();
                if (variablesPanelOpen) toggleVariablesPanel();
                if (blockLibraryOpen) setBlockLibraryOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </DndContext>
  );
}

// Variables Panel Content Component
function VariablesPanelContent() {
  const { variables } = useAppStore();

  return (
    <div className="space-y-4">
      <p className="text-sm text-alecia-silver">
        Definissez des variables pour personaliser vos presentations.
      </p>
      <div className="space-y-3">
        {variables.map((variable) => (
          <div key={variable.id} className="space-y-1">
            <label className="text-sm font-medium text-alecia-navy">
              {variable.name}
            </label>
            <p className="text-xs text-alecia-silver">{variable.description}</p>
            <input
              type={variable.type === 'currency' ? 'number' : 'text'}
              placeholder={`Valeur pour ${variable.name}`}
              className="w-full p-2 rounded-lg border border-alecia-silver/20 text-sm focus:outline-none focus:border-alecia-red"
            />
          </div>
        ))}
      </div>
      <button className="w-full alecia-btn-secondary mt-4">
        Ajouter une variable
      </button>
    </div>
  );
}

// Helper pour le contenu par défaut des blocs
function getDefaultContent(blockType: BlockType): Record<string, unknown> {
  const defaults: Record<BlockType, Record<string, unknown>> = {
    Titre: { text: 'Nouveau titre' },
    'Sous-titre': { text: 'Sous-titre', subtitle: 'Description' },
    Paragraphe: { text: 'Nouveau paragraphe' },
    Liste: { items: [{ id: '1', text: 'Point 1', level: 0 }, { id: '2', text: 'Point 2', level: 0 }] },
    Citation: { text: 'Citation', subtitle: 'Auteur' },
    KPI_Card: { kpis: [{ id: '1', label: 'Indicateur', value: '0', unit: '' }] },
    Chart_Block: { chartData: { type: 'bar', labels: ['A', 'B'], datasets: [{ label: 'Serie 1', data: [10, 20] }] } },
    Table_Block: { tableData: { headers: ['Colonne 1', 'Colonne 2'], rows: [{ cells: ['Donnee 1', 'Donnee 2'] }] } },
    Timeline_Block: { timeline: [{ id: '1', phase: 'Phase 1', title: 'Titre', description: 'Description' }] },
    Company_Overview: { targetCompany: '' },
    Deal_Rationale: { text: 'Rationnel du deal' },
    SWOT: { swot: { strengths: ['Force 1'], weaknesses: ['Faiblesse 1'], opportunities: ['Opportunite 1'], threats: ['Menace 1'] } },
    Key_Metrics: { kpis: [{ id: '1', label: 'Metrique', value: '0' }] },
    Process_Timeline: { timeline: [] },
    Team_Grid: { advisors: [{ name: 'Nom', role: 'Role' }] },
    Team_Row: { advisors: [{ name: 'Nom', role: 'Role' }] },
    Advisor_List: { advisors: [{ name: 'Nom', role: 'Role', firm: 'Cabinet' }] },
    Image: { imageUrl: '', caption: '' },
    Logo_Grid: { logos: [] },
    Icon_Text: { icon: 'star', text: 'Texte' },
    TwoColumn: { leftText: 'Colonne gauche', rightText: 'Colonne droite' },
    Two_Column: { leftText: 'Colonne gauche', rightText: 'Colonne droite' },
    Section_Navigator: { sections: [] },
    SectionNavigator: { sections: [] },
    SectionDivider: { title: 'Nouvelle section' },
    Section_Divider: { title: 'Nouvelle section' },
    Cover: { subtitle: '', targetCompany: '' },
    Couverture: { subtitle: '', targetCompany: '' },
    Disclaimer: { text: 'Ce document est strictement confidentiel.' },
    Disclaimer_Block: { text: 'Ce document est strictement confidentiel.' },
    Trackrecord_Block: { deals: [] },
    CSR_Block: { text: '' },
    Contact_Block: { name: '', email: '', phone: '' },
  };

  return defaults[blockType] || {};
}
