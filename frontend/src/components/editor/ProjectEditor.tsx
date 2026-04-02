import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Loader2 } from 'lucide-react';
import { SlideList } from './SlideList';
import { SlideCanvas } from './SlideCanvas';
import { Toolbar } from './Toolbar';
import { useSlides, useProjects, useUI } from '@/store/useAppStore';
import { api, handleApiError } from '@/lib/api';
import type { Slide } from '@/types';

export function ProjectEditor() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { slides, setSlides, activeSlideId, setActiveSlide, setSlidesLoading } = useSlides();
  const { currentProject, setCurrentProject } = useProjects();
  const { aiPanelOpen, variablesPanelOpen, commentsPanelOpen } = useUI();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

  // Fetch project and slides
  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;

      setIsLoading(true);

      try {
        // Fetch project
        const projectResponse = await handleApiError(
          api.projects.get(projectId)
        );

        if (projectResponse.data) {
          setCurrentProject(projectResponse.data);
        } else {
          navigate('/gallery');
          return;
        }

        // Fetch slides
        setSlidesLoading(true);
        const slidesResponse = await handleApiError(
          api.slides.list(projectId)
        );

        if (slidesResponse.data) {
          setSlides(slidesResponse.data);
          if (slidesResponse.data.length > 0) {
            setActiveSlide(slidesResponse.data[0].id);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        navigate('/gallery');
      } finally {
        setIsLoading(false);
        setSlidesLoading(false);
      }
    };

    fetchData();
  }, [projectId, navigate, setCurrentProject, setSlides, setActiveSlide, setSlidesLoading]);

  // Update selected slide when activeSlideId changes
  useEffect(() => {
    if (activeSlideId && slides.length > 0) {
      const slide = slides.find((s) => s.id === activeSlideId);
      setSelectedSlide(slide || null);
    } else {
      setSelectedSlide(null);
    }
  }, [activeSlideId, slides]);

  // Handle slide selection
  const handleSelectSlide = useCallback(
    (slideId: string) => {
      setActiveSlide(slideId);
    },
    [setActiveSlide]
  );

  // Handle content change
  const handleContentChange = useCallback(
    async (content: Record<string, unknown>) => {
      if (!currentProject || !activeSlideId) return;

      const result = await handleApiError(
        api.slides.update(currentProject.id, activeSlideId, { content })
      );

      if (result.data) {
        setSlides(
          slides.map((s) => (s.id === activeSlideId ? result.data! : s))
        );
      }
    },
    [currentProject, activeSlideId, slides, setSlides]
  );

  // Handle back to gallery
  const handleBack = useCallback(() => {
    navigate('/gallery');
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-alecia-off-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-alecia-navy mx-auto mb-4" />
          <p className="text-alecia-silver">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="h-screen flex items-center justify-center bg-alecia-off-white">
        <div className="text-center">
          <p className="text-alecia-silver">Projet introuvable</p>
          <button onClick={handleBack} className="mt-4 alecia-btn-primary">
            Retour à la galerie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-alecia-off-white">
      {/* Header */}
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

        {/* Toolbar */}
        <Toolbar onShare={() => {}} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Slide List Sidebar */}
        <div className="w-64 bg-white border-r border-alecia-silver/20 flex flex-col">
          <SlideList
            slides={slides}
            activeSlideId={activeSlideId}
            onSelectSlide={handleSelectSlide}
          />
        </div>

        {/* Canvas Area */}
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

        {/* Side Panels */}
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

        {commentsPanelOpen && (
          <div className="w-80 bg-white border-l border-alecia-silver/20">
            <div className="p-4 border-b border-alecia-silver/20">
              <h3 className="font-semibold text-alecia-navy">Commentaires</h3>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <p className="text-sm text-alecia-silver">
                Panel de commentaires - À implémenter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
