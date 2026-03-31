/**
 * Store Zustand pour la gestion d'état globale de l'application
 * Organisé en slices pour une meilleure maintenabilité
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  Presentation,
  Slide,
  SlideType,
  PresentationVariables,
  PresentationSettings,
  Template,
  ChatMessage,
  ChatSession,
  Collaborator,
  EditorState,
  Notification,
  User,
  ContentBlock,
} from '@types/index';

// ============================================================================
// ÉTAT AUTHENTIFICATION
// ============================================================================

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

// ============================================================================
// ÉTAT PRÉSENTATION
// ============================================================================

interface PresentationState {
  // Données actuelles
  currentPresentation: Presentation | null;
  presentations: Presentation[];
  
  // Actions sur les présentations
  setCurrentPresentation: (presentation: Presentation | null) => void;
  createPresentation: (title: string, templateId?: string) => Presentation;
  updatePresentation: (updates: Partial<Presentation>) => void;
  deletePresentation: (id: string) => void;
  savePresentation: () => Promise<void>;
  loadPresentations: () => Promise<void>;
  
  // Actions sur les slides
  addSlide: (type: SlideType, index?: number) => Slide;
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  deleteSlide: (slideId: string) => void;
  duplicateSlide: (slideId: string) => Slide;
  reorderSlides: (slideIds: string[]) => void;
  moveSlide: (slideId: string, newIndex: number) => void;
  
  // Actions sur les blocs
  addBlock: (slideId: string, block: Omit<ContentBlock, 'id'>) => void;
  updateBlock: (slideId: string, blockId: string, updates: Partial<ContentBlock>) => void;
  deleteBlock: (slideId: string, blockId: string) => void;
  
  // Variables
  updateVariables: (variables: Partial<PresentationVariables>) => void;
  setVariable: (key: string, value: string) => void;
  
  // Paramètres
  updateSettings: (settings: Partial<PresentationSettings>) => void;
}

// ============================================================================
// ÉTAT TEMPLATES
// ============================================================================

interface TemplateState {
  templates: Template[];
  selectedTemplateId: string | null;
  isLoading: boolean;
  
  setTemplates: (templates: Template[]) => void;
  selectTemplate: (templateId: string | null) => void;
  saveAsTemplate: (presentation: Presentation, name: string, category: string) => Promise<void>;
  deleteTemplate: (templateId: string) => Promise<void>;
  loadTemplates: () => Promise<void>;
}

// ============================================================================
// ÉTAT CHAT IA
// ============================================================================

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isTyping: boolean;
  suggestions: string[];
  
  createSession: (presentationId: string) => ChatSession;
  setCurrentSession: (sessionId: string | null) => void;
  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<ChatMessage>) => void;
  clearSession: (sessionId: string) => void;
  setIsTyping: (isTyping: boolean) => void;
  setSuggestions: (suggestions: string[]) => void;
  generateSlidesFromChat: (sessionId: string) => Promise<Slide[]>;
}

// ============================================================================
// ÉTAT COLLABORATION
// ============================================================================

interface CollaborationState {
  collaborators: Collaborator[];
  isConnected: boolean;
  connectionError: string | null;
  
  setCollaborators: (collaborators: Collaborator[]) => void;
  addCollaborator: (collaborator: Collaborator) => void;
  removeCollaborator: (userId: string) => void;
  updateCollaborator: (userId: string, updates: Partial<Collaborator>) => void;
  setConnectionStatus: (isConnected: boolean) => void;
  setConnectionError: (error: string | null) => void;
}

// ============================================================================
// ÉTAT ÉDITEUR
// ============================================================================

interface EditorUIState {
  editorState: EditorState;
  notifications: Notification[];
  
  // Actions éditeur
  setSelectedSlide: (slideId: string | null) => void;
  setSelectedBlock: (blockId: string | null) => void;
  setZoom: (zoom: number) => void;
  togglePreviewMode: () => void;
  toggleFullscreen: () => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  setActiveTab: (tab: EditorState['activeTab']) => void;
  
  // Actions notifications
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// ============================================================================
// ÉTAT IMPORT/EXPORT
// ============================================================================

interface ImportExportState {
  isExporting: boolean;
  isImporting: boolean;
  exportProgress: number;
  importProgress: number;
  
  setExporting: (isExporting: boolean) => void;
  setImporting: (isImporting: boolean) => void;
  setExportProgress: (progress: number) => void;
  setImportProgress: (progress: number) => void;
}

// ============================================================================
// STORE COMBINÉ
// ============================================================================

type AppStore = AuthState & 
  PresentationState & 
  TemplateState & 
  ChatState & 
  CollaborationState & 
  EditorUIState & 
  ImportExportState;

// ID unique pour les notifications
const generateId = () => Math.random().toString(36).substring(2, 9);

// Date actuelle pour les timestamps
const now = () => new Date();

/**
 * Store principal de l'application
 * Utilise Zustand avec Immer pour les mutations immuables
 * et DevTools pour le debugging
 */
export const useStore = create<AppStore>()(
  devtools(
    immer((set, get) => ({
      // ======================================================================
      // AUTHENTIFICATION
      // ======================================================================
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Simulation d'appel API - à remplacer par l'appel réel
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockUser: User = {
            id: generateId(),
            email,
            firstName: 'Jean',
            lastName: 'Dupont',
            role: 'editor',
            createdAt: now(),
            updatedAt: now(),
          };
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      // ======================================================================
      // PRÉSENTATION
      // ======================================================================
      currentPresentation: null,
      presentations: [],
      
      setCurrentPresentation: (presentation) => {
        set({ currentPresentation: presentation });
      },
      
      createPresentation: (title, templateId) => {
        const newPresentation: Presentation = {
          id: generateId(),
          title,
          description: '',
          status: 'draft',
          createdBy: get().user?.id || '',
          createdAt: now(),
          updatedAt: now(),
          lastModifiedBy: get().user?.id || '',
          tags: [],
          slides: [{
            id: generateId(),
            type: 'title',
            title,
            content: { blocks: [] },
            layout: { template: 'default', padding: { top: 40, right: 40, bottom: 40, left: 40 } },
            order: 0,
            isHidden: false,
            createdAt: now(),
            updatedAt: now(),
          }],
          variables: {
            clientName: '',
            aleciaContactName: get().user ? `${get().user!.firstName} ${get().user!.lastName}` : '',
            aleciaContactEmail: get().user?.email || '',
            projectDate: now(),
            custom: {},
          },
          templateId,
          collaborators: [],
          settings: {
            theme: 'alecia',
            aspectRatio: '16:9',
            defaultFont: 'Inter',
            showSlideNumbers: true,
            showFooter: true,
            footerText: 'Alecia - Conseil en financement',
          },
        };
        
        set(state => {
          state.presentations.push(newPresentation);
          state.currentPresentation = newPresentation;
        });
        
        return newPresentation;
      },
      
      updatePresentation: (updates) => {
        set(state => {
          if (state.currentPresentation) {
            Object.assign(state.currentPresentation, updates, { updatedAt: now() });
          }
        });
      },
      
      deletePresentation: (id) => {
        set(state => {
          state.presentations = state.presentations.filter(p => p.id !== id);
          if (state.currentPresentation?.id === id) {
            state.currentPresentation = null;
          }
        });
      },
      
      savePresentation: async () => {
        const { currentPresentation } = get();
        if (!currentPresentation) return;
        
        // Simulation d'appel API - à remplacer par l'appel réel
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set(state => {
          const index = state.presentations.findIndex(p => p.id === currentPresentation.id);
          if (index !== -1) {
            state.presentations[index] = { ...currentPresentation, updatedAt: now() };
          }
        });
      },
      
      loadPresentations: async () => {
        // Simulation d'appel API - à remplacer par l'appel réel
        await new Promise(resolve => setTimeout(resolve, 500));
        // Les présentations seraient chargées depuis l'API
      },
      
      addSlide: (type, index) => {
        const { currentPresentation } = get();
        if (!currentPresentation) throw new Error('Aucune présentation active');
        
        const newSlide: Slide = {
          id: generateId(),
          type,
          content: { blocks: [] },
          layout: { template: 'default', padding: { top: 40, right: 40, bottom: 40, left: 40 } },
          order: index ?? currentPresentation.slides.length,
          isHidden: false,
          createdAt: now(),
          updatedAt: now(),
        };
        
        set(state => {
          if (state.currentPresentation) {
            const insertIndex = index ?? state.currentPresentation.slides.length;
            state.currentPresentation.slides.splice(insertIndex, 0, newSlide);
            // Réordonner les slides
            state.currentPresentation.slides.forEach((slide, i) => {
              slide.order = i;
            });
            state.currentPresentation.updatedAt = now();
          }
        });
        
        return newSlide;
      },
      
      updateSlide: (slideId, updates) => {
        set(state => {
          if (state.currentPresentation) {
            const slide = state.currentPresentation.slides.find(s => s.id === slideId);
            if (slide) {
              Object.assign(slide, updates, { updatedAt: now() });
              state.currentPresentation.updatedAt = now();
            }
          }
        });
      },
      
      deleteSlide: (slideId) => {
        set(state => {
          if (state.currentPresentation) {
            state.currentPresentation.slides = state.currentPresentation.slides.filter(s => s.id !== slideId);
            // Réordonner
            state.currentPresentation.slides.forEach((slide, i) => {
              slide.order = i;
            });
            state.currentPresentation.updatedAt = now();
          }
        });
      },
      
      duplicateSlide: (slideId) => {
        const { currentPresentation } = get();
        if (!currentPresentation) throw new Error('Aucune présentation active');
        
        const slideToDuplicate = currentPresentation.slides.find(s => s.id === slideId);
        if (!slideToDuplicate) throw new Error('Slide non trouvée');
        
        const duplicatedSlide: Slide = {
          ...slideToDuplicate,
          id: generateId(),
          order: slideToDuplicate.order + 1,
          createdAt: now(),
          updatedAt: now(),
        };
        
        set(state => {
          if (state.currentPresentation) {
            const index = state.currentPresentation.slides.findIndex(s => s.id === slideId);
            state.currentPresentation.slides.splice(index + 1, 0, duplicatedSlide);
            state.currentPresentation.slides.forEach((slide, i) => {
              slide.order = i;
            });
            state.currentPresentation.updatedAt = now();
          }
        });
        
        return duplicatedSlide;
      },
      
      reorderSlides: (slideIds) => {
        set(state => {
          if (state.currentPresentation) {
            const slides = state.currentPresentation.slides;
            const reorderedSlides = slideIds
              .map(id => slides.find(s => s.id === id))
              .filter((s): s is Slide => !!s);
            state.currentPresentation.slides = reorderedSlides.map((slide, i) => ({
              ...slide,
              order: i,
            }));
            state.currentPresentation.updatedAt = now();
          }
        });
      },
      
      moveSlide: (slideId, newIndex) => {
        set(state => {
          if (state.currentPresentation) {
            const slides = state.currentPresentation.slides;
            const currentIndex = slides.findIndex(s => s.id === slideId);
            if (currentIndex === -1) return;
            
            const [movedSlide] = slides.splice(currentIndex, 1);
            slides.splice(newIndex, 0, movedSlide);
            
            slides.forEach((slide, i) => {
              slide.order = i;
            });
            state.currentPresentation.updatedAt = now();
          }
        });
      },
      
      addBlock: (slideId, block) => {
        set(state => {
          if (state.currentPresentation) {
            const slide = state.currentPresentation.slides.find(s => s.id === slideId);
            if (slide) {
              const newBlock: ContentBlock = {
                ...block,
                id: generateId(),
              };
              slide.content.blocks.push(newBlock);
              slide.updatedAt = now();
              state.currentPresentation.updatedAt = now();
            }
          }
        });
      },
      
      updateBlock: (slideId, blockId, updates) => {
        set(state => {
          if (state.currentPresentation) {
            const slide = state.currentPresentation.slides.find(s => s.id === slideId);
            if (slide) {
              const block = slide.content.blocks.find(b => b.id === blockId);
              if (block) {
                Object.assign(block, updates);
                slide.updatedAt = now();
                state.currentPresentation.updatedAt = now();
              }
            }
          }
        });
      },
      
      deleteBlock: (slideId, blockId) => {
        set(state => {
          if (state.currentPresentation) {
            const slide = state.currentPresentation.slides.find(s => s.id === slideId);
            if (slide) {
              slide.content.blocks = slide.content.blocks.filter(b => b.id !== blockId);
              slide.updatedAt = now();
              state.currentPresentation.updatedAt = now();
            }
          }
        });
      },
      
      updateVariables: (variables) => {
        set(state => {
          if (state.currentPresentation) {
            Object.assign(state.currentPresentation.variables, variables);
            state.currentPresentation.updatedAt = now();
          }
        });
      },
      
      setVariable: (key, value) => {
        set(state => {
          if (state.currentPresentation) {
            if (key.startsWith('custom.')) {
              const customKey = key.replace('custom.', '');
              state.currentPresentation.variables.custom[customKey] = value;
            } else {
              (state.currentPresentation.variables as Record<string, unknown>)[key] = value;
            }
            state.currentPresentation.updatedAt = now();
          }
        });
      },
      
      updateSettings: (settings) => {
        set(state => {
          if (state.currentPresentation) {
            Object.assign(state.currentPresentation.settings, settings);
            state.currentPresentation.updatedAt = now();
          }
        });
      },

      // ======================================================================
      // TEMPLATES
      // ======================================================================
      templates: [],
      selectedTemplateId: null,
      isLoading: false,
      
      setTemplates: (templates) => {
        set({ templates });
      },
      
      selectTemplate: (templateId) => {
        set({ selectedTemplateId: templateId });
      },
      
      saveAsTemplate: async (presentation, name, category) => {
        const newTemplate: Template = {
          id: generateId(),
          name,
          description: presentation.description,
          category: category as Template['category'],
          slides: presentation.slides,
          variables: presentation.variables,
          settings: presentation.settings,
          isDefault: false,
          createdBy: get().user?.id || '',
          createdAt: now(),
          updatedAt: now(),
        };
        
        set(state => {
          state.templates.push(newTemplate);
        });
        
        // Appel API pour sauvegarder le template
        await new Promise(resolve => setTimeout(resolve, 500));
      },
      
      deleteTemplate: async (templateId) => {
        set(state => {
          state.templates = state.templates.filter(t => t.id !== templateId);
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
      },
      
      loadTemplates: async () => {
        set({ isLoading: true });
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ isLoading: false });
      },

      // ======================================================================
      // CHAT IA
      // ======================================================================
      sessions: [],
      currentSessionId: null,
      isTyping: false,
      suggestions: [],
      
      createSession: (presentationId) => {
        const newSession: ChatSession = {
          id: generateId(),
          presentationId,
          messages: [{
            id: generateId(),
            role: 'assistant',
            content: 'Bonjour ! Je suis votre assistant pour la création de présentations. Comment puis-je vous aider aujourd\'hui ?',
            timestamp: now(),
          }],
          createdAt: now(),
          updatedAt: now(),
        };
        
        set(state => {
          state.sessions.push(newSession);
          state.currentSessionId = newSession.id;
        });
        
        return newSession;
      },
      
      setCurrentSession: (sessionId) => {
        set({ currentSessionId: sessionId });
      },
      
      addMessage: (sessionId, message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: generateId(),
          timestamp: now(),
        };
        
        set(state => {
          const session = state.sessions.find(s => s.id === sessionId);
          if (session) {
            session.messages.push(newMessage);
            session.updatedAt = now();
          }
        });
      },
      
      updateMessage: (sessionId, messageId, updates) => {
        set(state => {
          const session = state.sessions.find(s => s.id === sessionId);
          if (session) {
            const message = session.messages.find(m => m.id === messageId);
            if (message) {
              Object.assign(message, updates);
            }
          }
        });
      },
      
      clearSession: (sessionId) => {
        set(state => {
          const session = state.sessions.find(s => s.id === sessionId);
          if (session) {
            session.messages = [];
            session.updatedAt = now();
          }
        });
      },
      
      setIsTyping: (isTyping) => {
        set({ isTyping });
      },
      
      setSuggestions: (suggestions) => {
        set({ suggestions });
      },
      
      generateSlidesFromChat: async (sessionId) => {
        const session = get().sessions.find(s => s.id === sessionId);
        if (!session) return [];
        
        set({ isTyping: true });
        
        // Simulation de génération IA
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const generatedSlides: Slide[] = [
          {
            id: generateId(),
            type: 'content',
            title: 'Slide générée automatiquement',
            content: { blocks: [] },
            layout: { template: 'default', padding: { top: 40, right: 40, bottom: 40, left: 40 } },
            order: 0,
            isHidden: false,
            createdAt: now(),
            updatedAt: now(),
          },
        ];
        
        set({ isTyping: false });
        
        return generatedSlides;
      },

      // ======================================================================
      // COLLABORATION
      // ======================================================================
      collaborators: [],
      isConnected: false,
      connectionError: null,
      
      setCollaborators: (collaborators) => {
        set({ collaborators });
      },
      
      addCollaborator: (collaborator) => {
        set(state => {
          const exists = state.collaborators.find(c => c.id === collaborator.id);
          if (!exists) {
            state.collaborators.push(collaborator);
          }
        });
      },
      
      removeCollaborator: (userId) => {
        set(state => {
          state.collaborators = state.collaborators.filter(c => c.id !== userId);
        });
      },
      
      updateCollaborator: (userId, updates) => {
        set(state => {
          const collaborator = state.collaborators.find(c => c.id === userId);
          if (collaborator) {
            Object.assign(collaborator, updates);
          }
        });
      },
      
      setConnectionStatus: (isConnected) => {
        set({ isConnected });
      },
      
      setConnectionError: (error) => {
        set({ connectionError: error });
      },

      // ======================================================================
      // ÉDITEUR UI
      // ======================================================================
      editorState: {
        selectedSlideId: null,
        selectedBlockId: null,
        zoom: 100,
        isPreviewMode: false,
        isFullscreen: false,
        showGrid: false,
        snapToGrid: true,
        gridSize: 20,
        sidebarOpen: true,
        rightPanelOpen: true,
        activeTab: 'slides',
      },
      notifications: [],
      
      setSelectedSlide: (slideId) => {
        set(state => {
          state.editorState.selectedSlideId = slideId;
          state.editorState.selectedBlockId = null;
        });
      },
      
      setSelectedBlock: (blockId) => {
        set(state => {
          state.editorState.selectedBlockId = blockId;
        });
      },
      
      setZoom: (zoom) => {
        set(state => {
          state.editorState.zoom = Math.max(25, Math.min(200, zoom));
        });
      },
      
      togglePreviewMode: () => {
        set(state => {
          state.editorState.isPreviewMode = !state.editorState.isPreviewMode;
        });
      },
      
      toggleFullscreen: () => {
        set(state => {
          state.editorState.isFullscreen = !state.editorState.isFullscreen;
        });
      },
      
      toggleGrid: () => {
        set(state => {
          state.editorState.showGrid = !state.editorState.showGrid;
        });
      },
      
      toggleSnapToGrid: () => {
        set(state => {
          state.editorState.snapToGrid = !state.editorState.snapToGrid;
        });
      },
      
      setGridSize: (size) => {
        set(state => {
          state.editorState.gridSize = size;
        });
      },
      
      toggleSidebar: () => {
        set(state => {
          state.editorState.sidebarOpen = !state.editorState.sidebarOpen;
        });
      },
      
      toggleRightPanel: () => {
        set(state => {
          state.editorState.rightPanelOpen = !state.editorState.rightPanelOpen;
        });
      },
      
      setActiveTab: (tab) => {
        set(state => {
          state.editorState.activeTab = tab;
        });
      },
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: generateId(),
        };
        
        set(state => {
          state.notifications.push(newNotification);
        });
        
        // Auto-suppression après la durée spécifiée
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(newNotification.id);
          }, notification.duration || 5000);
        }
      },
      
      removeNotification: (id) => {
        set(state => {
          state.notifications = state.notifications.filter(n => n.id !== id);
        });
      },
      
      clearNotifications: () => {
        set({ notifications: [] });
      },

      // ======================================================================
      // IMPORT/EXPORT
      // ======================================================================
      isExporting: false,
      isImporting: false,
      exportProgress: 0,
      importProgress: 0,
      
      setExporting: (isExporting) => {
        set({ isExporting, exportProgress: isExporting ? 0 : 100 });
      },
      
      setImporting: (isImporting) => {
        set({ isImporting, importProgress: isImporting ? 0 : 100 });
      },
      
      setExportProgress: (progress) => {
        set({ exportProgress: progress });
      },
      
      setImportProgress: (progress) => {
        set({ importProgress: progress });
      },
    })),
    {
      name: 'alecia-presentations-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        editorState: {
          zoom: state.editorState.zoom,
          showGrid: state.editorState.showGrid,
          snapToGrid: state.editorState.snapToGrid,
          gridSize: state.editorState.gridSize,
          sidebarOpen: state.editorState.sidebarOpen,
          rightPanelOpen: state.editorState.rightPanelOpen,
        },
      }),
    }
  )
);

// Sélecteurs optimisés pour éviter les re-renders inutiles
export const useCurrentPresentation = () => 
  useStore(state => state.currentPresentation);

export const useSelectedSlide = () => 
  useStore(state => {
    const presentation = state.currentPresentation;
    const selectedId = state.editorState.selectedSlideId;
    return presentation?.slides.find(s => s.id === selectedId) || null;
  });

export const useSlides = () => 
  useStore(state => state.currentPresentation?.slides || []);

export const useVariables = () => 
  useStore(state => state.currentPresentation?.variables);

export const useCollaborators = () => 
  useStore(state => state.collaborators);

export const useNotifications = () => 
  useStore(state => state.notifications);

export default useStore;
