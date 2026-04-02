import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Project, Slide, Comment, Variable, ChatMessage, AISettings } from '@/types';

// ============================================
// Type Definitions
// ============================================

interface HistoryState {
  projects: Project[];
  slides: Record<string, Slide[]>;
  currentProject: Project | null;
  activeSlideId: string | null;
}

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  userTag: string | null;
  hasMasterAccess: boolean;
  masterPin: string | null;

  // Project state
  currentProject: Project | null;
  projects: Project[];
  projectsLoading: boolean;

  // Slides state
  slides: Slide[];
  activeSlideId: string | null;
  slidesLoading: boolean;

  // UI state
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
  variablesPanelOpen: boolean;
  commentsPanelOpen: boolean;
  exportModalOpen: boolean;
  importModalOpen: boolean;
  templateModalOpen: boolean;
  newProjectWizardOpen: boolean;

  // Undo/Redo history
  history: HistoryState[];
  historyIndex: number;
  maxHistorySize: number;

  // Comments
  comments: Comment[];
  commentsLoading: boolean;

  // Variables
  variables: Variable[];
  variablesLoading: boolean;

  // Chat
  chatMessages: ChatMessage[];
  chatLoading: boolean;

  // AI Settings
  aiSettings: AISettings | null;

  // Toast notifications
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
  }>;
}

// ============================================
// Actions Type Definition
// ============================================

interface AppActions {
  // Auth actions
  authenticate: (pin: string, userTag?: string) => Promise<boolean>;
  authenticateMaster: (pin: string) => Promise<boolean>;
  logout: () => void;

  // Project actions
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  setProjectsLoading: (loading: boolean) => void;

  // Slides actions
  setSlides: (slides: Slide[]) => void;
  addSlide: (slide: Slide) => void;
  updateSlide: (slide: Slide) => void;
  deleteSlide: (slideId: string) => void;
  reorderSlides: (slides: Slide[]) => void;
  setActiveSlide: (slideId: string | null) => void;
  setSlidesLoading: (loading: boolean) => void;

  // UI actions
  toggleSidebar: () => void;
  toggleAiPanel: () => void;
  toggleVariablesPanel: () => void;
  toggleCommentsPanel: () => void;
  setExportModalOpen: (open: boolean) => void;
  setImportModalOpen: (open: boolean) => void;
  setTemplateModalOpen: (open: boolean) => void;
  setNewProjectWizardOpen: (open: boolean) => void;

  // Undo/Redo actions
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Comments actions
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  updateComment: (comment: Comment) => void;
  deleteComment: (commentId: string) => void;
  resolveComment: (commentId: string) => void;
  setCommentsLoading: (loading: boolean) => void;

  // Variables actions
  setVariables: (variables: Variable[]) => void;
  addVariable: (variable: Variable) => void;
  updateVariable: (variable: Variable) => void;
  deleteVariable: (variableId: string) => void;
  setVariablesLoading: (loading: boolean) => void;

  // Chat actions
  setChatMessages: (messages: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;
  setChatLoading: (loading: boolean) => void;

  // AI Settings actions
  setAiSettings: (settings: AISettings | null) => void;

  // Toast actions
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  removeToast: (id: string) => void;
}

// ============================================
// Initial State
// ============================================

const initialState: AppState = {
  // Auth
  isAuthenticated: false,
  userTag: null,
  hasMasterAccess: false,
  masterPin: null,

  // Projects
  currentProject: null,
  projects: [],
  projectsLoading: false,

  // Slides
  slides: [],
  activeSlideId: null,
  slidesLoading: false,

  // UI
  sidebarOpen: true,
  aiPanelOpen: false,
  variablesPanelOpen: false,
  commentsPanelOpen: false,
  exportModalOpen: false,
  importModalOpen: false,
  templateModalOpen: false,
  newProjectWizardOpen: false,

  // History
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,

  // Comments
  comments: [],
  commentsLoading: false,

  // Variables
  variables: [],
  variablesLoading: false,

  // Chat
  chatMessages: [],
  chatLoading: false,

  // AI Settings
  aiSettings: null,

  // Toasts
  toasts: [],
};

// ============================================
// Store Creation
// ============================================

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ============================================
      // Auth Actions
      // ============================================

      authenticate: async (pin: string, userTag?: string) => {
        try {
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin, userTag }),
          });

          if (response.ok) {
            const data = await response.json();
            set({
              isAuthenticated: true,
              userTag: userTag || data.userTag || null,
              hasMasterAccess: data.hasMasterAccess || false,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      authenticateMaster: async (pin: string) => {
        try {
          const response = await fetch('/api/auth/master', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin }),
          });

          if (response.ok) {
            const data = await response.json();
            set({
              isAuthenticated: true,
              hasMasterAccess: true,
              masterPin: pin,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          userTag: null,
          hasMasterAccess: false,
          masterPin: null,
          currentProject: null,
          slides: [],
          activeSlideId: null,
          history: [],
          historyIndex: -1,
        });
      },

      // ============================================
      // Project Actions
      // ============================================

      setCurrentProject: (project) => {
        set({ currentProject: project });
        // Reset slides when changing project
        if (!project) {
          set({ slides: [], activeSlideId: null });
        }
      },

      setProjects: (projects) => set({ projects }),

      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),

      updateProject: (project) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === project.id ? project : p
          ),
          currentProject:
            state.currentProject?.id === project.id
              ? project
              : state.currentProject,
        })),

      deleteProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
          currentProject:
            state.currentProject?.id === projectId
              ? null
              : state.currentProject,
        })),

      setProjectsLoading: (loading) => set({ projectsLoading: loading }),

      // ============================================
      // Slides Actions
      // ============================================

      setSlides: (slides) => set({ slides }),

      addSlide: (slide) => {
        get().pushHistory();
        set((state) => ({
          slides: [...state.slides, slide],
        }));
      },

      updateSlide: (slide) => {
        get().pushHistory();
        set((state) => ({
          slides: state.slides.map((s) => (s.id === slide.id ? slide : s)),
        }));
      },

      deleteSlide: (slideId) => {
        get().pushHistory();
        set((state) => ({
          slides: state.slides.filter((s) => s.id !== slideId),
          activeSlideId:
            state.activeSlideId === slideId
              ? state.slides[0]?.id || null
              : state.activeSlideId,
        }));
      },

      reorderSlides: (slides) => {
        get().pushHistory();
        set({ slides });
      },

      setActiveSlide: (slideId) => set({ activeSlideId: slideId }),

      setSlidesLoading: (loading) => set({ slidesLoading: loading }),

      // ============================================
      // UI Actions
      // ============================================

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      toggleAiPanel: () =>
        set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),

      toggleVariablesPanel: () =>
        set((state) => ({ variablesPanelOpen: !state.variablesPanelOpen })),

      toggleCommentsPanel: () =>
        set((state) => ({ commentsPanelOpen: !state.commentsPanelOpen })),

      setExportModalOpen: (open) => set({ exportModalOpen: open }),

      setImportModalOpen: (open) => set({ importModalOpen: open }),

      setTemplateModalOpen: (open) => set({ templateModalOpen: open }),

      setNewProjectWizardOpen: (open) => set({ newProjectWizardOpen: open }),

      // ============================================
      // Undo/Redo Actions
      // ============================================

      pushHistory: () => {
        const state = get();
        const historyState: HistoryState = {
          projects: state.projects,
          slides: { [state.currentProject?.id || '']: state.slides },
          currentProject: state.currentProject,
          activeSlideId: state.activeSlideId,
        };

        set((state) => {
          // Remove any redo states
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(historyState);

          // Limit history size
          if (newHistory.length > state.maxHistorySize) {
            newHistory.shift();
          }

          return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex <= 0) return;

        const prevState = history[historyIndex - 1];
        set({
          projects: prevState.projects,
          slides: prevState.slides[get().currentProject?.id || ''] || [],
          currentProject: prevState.currentProject,
          activeSlideId: prevState.activeSlideId,
          historyIndex: historyIndex - 1,
        });
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex >= history.length - 1) return;

        const nextState = history[historyIndex + 1];
        set({
          projects: nextState.projects,
          slides: nextState.slides[get().currentProject?.id || ''] || [],
          currentProject: nextState.currentProject,
          activeSlideId: nextState.activeSlideId,
          historyIndex: historyIndex + 1,
        });
      },

      canUndo: () => get().historyIndex > 0,

      canRedo: () => {
        const { history, historyIndex } = get();
        return historyIndex < history.length - 1;
      },

      // ============================================
      // Comments Actions
      // ============================================

      setComments: (comments) => set({ comments }),

      addComment: (comment) =>
        set((state) => ({
          comments: [...state.comments, comment],
        })),

      updateComment: (comment) =>
        set((state) => ({
          comments: state.comments.map((c) =>
            c.id === comment.id ? comment : c
          ),
        })),

      deleteComment: (commentId) =>
        set((state) => ({
          comments: state.comments.filter((c) => c.id !== commentId),
        })),

      resolveComment: (commentId) =>
        set((state) => ({
          comments: state.comments.map((c) =>
            c.id === commentId ? { ...c, resolved: true } : c
          ),
        })),

      setCommentsLoading: (loading) => set({ commentsLoading: loading }),

      // ============================================
      // Variables Actions
      // ============================================

      setVariables: (variables) => set({ variables }),

      addVariable: (variable) =>
        set((state) => ({
          variables: [...state.variables, variable],
        })),

      updateVariable: (variable) =>
        set((state) => ({
          variables: state.variables.map((v) =>
            v.id === variable.id ? variable : v
          ),
        })),

      deleteVariable: (variableId) =>
        set((state) => ({
          variables: state.variables.filter((v) => v.id !== variableId),
        })),

      setVariablesLoading: (loading) => set({ variablesLoading: loading }),

      // ============================================
      // Chat Actions
      // ============================================

      setChatMessages: (messages) => set({ chatMessages: messages }),

      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),

      clearChatMessages: () => set({ chatMessages: [] }),

      setChatLoading: (loading) => set({ chatLoading: loading }),

      // ============================================
      // AI Settings Actions
      // ============================================

      setAiSettings: (settings) => set({ aiSettings: settings }),

      // ============================================
      // Toast Actions
      // ============================================

      addToast: (type, message) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        set((state) => ({
          toasts: [...state.toasts, { id, type, message }],
        }));

        // Auto-remove after 5 seconds
        setTimeout(() => {
          get().removeToast(id);
        }, 5000);
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'alecia-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist auth and UI preferences
        isAuthenticated: state.isAuthenticated,
        userTag: state.userTag,
        hasMasterAccess: state.hasMasterAccess,
        masterPin: state.masterPin,
        sidebarOpen: state.sidebarOpen,
        variables: state.variables,
        aiSettings: state.aiSettings,
      }),
    }
  )
);

// ============================================
// Selectors
// ============================================

export const selectIsAuthenticated = (state: AppState) => state.isAuthenticated;
export const selectCurrentProject = (state: AppState) => state.currentProject;
export const selectActiveSlide = (state: AppState) =>
  state.slides.find((s) => s.id === state.activeSlideId);
export const selectUnresolvedComments = (state: AppState) =>
  state.comments.filter((c) => !c.resolved);
export const selectCanUndo = (state: AppState) => state.historyIndex > 0;
export const selectCanRedo = (state: AppState) =>
  state.historyIndex < state.history.length - 1;

// ============================================
// Hooks
// ============================================

export const useAuth = () => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const userTag = useAppStore((state) => state.userTag);
  const hasMasterAccess = useAppStore((state) => state.hasMasterAccess);
  const logout = useAppStore((state) => state.logout);
  const authenticate = useAppStore((state) => state.authenticate);
  const authenticateMaster = useAppStore((state) => state.authenticateMaster);

  return {
    isAuthenticated,
    userTag,
    hasMasterAccess,
    logout,
    authenticate,
    authenticateMaster,
  };
};

export const useProjects = () => {
  const projects = useAppStore((state) => state.projects);
  const currentProject = useAppStore((state) => state.currentProject);
  const projectsLoading = useAppStore((state) => state.projectsLoading);
  const setProjects = useAppStore((state) => state.setProjects);
  const setCurrentProject = useAppStore((state) => state.setCurrentProject);
  const addProject = useAppStore((state) => state.addProject);
  const updateProject = useAppStore((state) => state.updateProject);
  const deleteProject = useAppStore((state) => state.deleteProject);
  const setProjectsLoading = useAppStore((state) => state.setProjectsLoading);

  return {
    projects,
    currentProject,
    projectsLoading,
    setProjects,
    setCurrentProject,
    addProject,
    updateProject,
    deleteProject,
    setProjectsLoading,
  };
};

export const useSlides = () => {
  const slides = useAppStore((state) => state.slides);
  const activeSlideId = useAppStore((state) => state.activeSlideId);
  const slidesLoading = useAppStore((state) => state.slidesLoading);
  const setSlides = useAppStore((state) => state.setSlides);
  const addSlide = useAppStore((state) => state.addSlide);
  const updateSlide = useAppStore((state) => state.updateSlide);
  const deleteSlide = useAppStore((state) => state.deleteSlide);
  const reorderSlides = useAppStore((state) => state.reorderSlides);
  const setActiveSlide = useAppStore((state) => state.setActiveSlide);
  const setSlidesLoading = useAppStore((state) => state.setSlidesLoading);

  return {
    slides,
    activeSlideId,
    slidesLoading,
    setSlides,
    addSlide,
    updateSlide,
    deleteSlide,
    reorderSlides,
    setActiveSlide,
    setSlidesLoading,
  };
};

export const useUI = () => {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const aiPanelOpen = useAppStore((state) => state.aiPanelOpen);
  const variablesPanelOpen = useAppStore((state) => state.variablesPanelOpen);
  const commentsPanelOpen = useAppStore((state) => state.commentsPanelOpen);
  const exportModalOpen = useAppStore((state) => state.exportModalOpen);
  const importModalOpen = useAppStore((state) => state.importModalOpen);
  const templateModalOpen = useAppStore((state) => state.templateModalOpen);
  const newProjectWizardOpen = useAppStore((state) => state.newProjectWizardOpen);
  const toasts = useAppStore((state) => state.toasts);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const toggleAiPanel = useAppStore((state) => state.toggleAiPanel);
  const toggleVariablesPanel = useAppStore((state) => state.toggleVariablesPanel);
  const toggleCommentsPanel = useAppStore((state) => state.toggleCommentsPanel);
  const setExportModalOpen = useAppStore((state) => state.setExportModalOpen);
  const setImportModalOpen = useAppStore((state) => state.setImportModalOpen);
  const setTemplateModalOpen = useAppStore((state) => state.setTemplateModalOpen);
  const setNewProjectWizardOpen = useAppStore((state) => state.setNewProjectWizardOpen);
  const addToast = useAppStore((state) => state.addToast);
  const removeToast = useAppStore((state) => state.removeToast);

  return {
    sidebarOpen,
    aiPanelOpen,
    variablesPanelOpen,
    commentsPanelOpen,
    exportModalOpen,
    importModalOpen,
    templateModalOpen,
    newProjectWizardOpen,
    toasts,
    toggleSidebar,
    toggleAiPanel,
    toggleVariablesPanel,
    toggleCommentsPanel,
    setExportModalOpen,
    setImportModalOpen,
    setTemplateModalOpen,
    setNewProjectWizardOpen,
    addToast,
    removeToast,
  };
};

export const useHistory = () => {
  const undo = useAppStore((state) => state.undo);
  const redo = useAppStore((state) => state.redo);
  const canUndo = useAppStore((state) => state.canUndo);
  const canRedo = useAppStore((state) => state.canRedo);
  const pushHistory = useAppStore((state) => state.pushHistory);

  return { undo, redo, canUndo, canRedo, pushHistory };
};
