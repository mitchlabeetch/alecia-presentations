import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { SlideList } from './SlideList';
import { SlideCanvas } from './SlideCanvas';
import { Toolbar } from './Toolbar';
import { useSlides, useProjects, useUI, useAppStore } from '@/store/useAppStore';
import type { Slide } from '@/types';

export function ProjectEditor() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const {
    slides,
    activeSlideId,
    setActiveSlide,
    updateSlide,
  } = useSlides();

  const {
    currentProject,
    setCurrentProject,
    projects,
    updateProject,
  } = useProjects();

  const {
    aiPanelOpen,
    variablesPanelOpen,
  } = useUI();

  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

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

  if (!currentProject) {
    return (
      <div className="h-screen flex items-center justify-center bg-alecia-off-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-alecia-navy mx-auto mb-4" />
          <p className="text-alecia-silver">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-alecia-off-white">
      <div className="bg-white border-b border-alecia-silver/20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors"
            title="Retour à la galerie"
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
        <Toolbar onShare={() => {}} />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r border-alecia-silver/20 flex flex-col">
          <SlideList
            slides={slides}
            activeSlideId={activeSlideId}
            onSelectSlide={handleSelectSlide}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedSlide ? (
            <SlideCanvas
              slide={selectedSlide}
              isEditing={true}
              onContentChange={handleContentChange}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-alecia-silver">
                  Sélectionnez une slide pour commencer
                </p>
              </div>
            </div>
          )}
        </div>

        {aiPanelOpen && (
          <div className="w-80 bg-white border-l border-alecia-silver/20">
            <div className="p-4 border-b border-alecia-silver/20">
              <h3 className="font-semibold text-alecia-navy">Chat IA</h3>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <p className="text-sm text-alecia-silver">
                Panel de chat IA - À implémenter
              </p>
            </div>
          </div>
        )}

        {variablesPanelOpen && (
          <div className="w-80 bg-white border-l border-alecia-silver/20">
            <div className="p-4 border-b border-alecia-silver/20">
              <h3 className="font-semibold text-alecia-navy">Variables</h3>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <p className="text-sm text-alecia-silver">
                Panel de variables - À implémenter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
