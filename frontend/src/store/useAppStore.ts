import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, Slide, Variable, VariablePreset, ChatMessage } from '@/types';

interface AppState {
  isAuthenticated: boolean;
  userTag: string | null;
  hasMasterAccess: boolean;
  currentProject: Project | null;
  projects: Project[];
  slides: Slide[];
  activeSlideId: string | null;
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
  variablesPanelOpen: boolean;
  variables: Variable[];
  variablePresets: VariablePreset[];
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  // Chat state
  chatMessages: Record<string, ChatMessage[]>;
}

interface AppActions {
  authenticate: (pin: string, userTag?: string) => boolean;
  authenticateMaster: (pin: string) => boolean;
  logout: () => void;
  setCurrentProject: (project: Project | null) => void;
  createProject: (name: string, userTag?: string) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addSlide: (type: string, title?: string, content?: Record<string, unknown>) => Slide;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
  deleteSlide: (id: string) => void;
  reorderSlides: (activeId: string, overId: string) => void;
  setActiveSlide: (id: string | null) => void;
  toggleSidebar: () => void;
  toggleAIPanel: () => void;
  toggleVariablesPanel: () => void;
  setToast: (toast: { message: string; type: 'success' | 'error' | 'info' } | null) => void;
  // Variable actions
  addVariable: (variable: Omit<Variable, 'id'>) => void;
  updateVariable: (id: string, updates: Partial<Variable>) => void;
  deleteVariable: (id: string) => void;
  setVariablePreset: (preset: VariablePreset | null) => void;
  variablePresets: VariablePreset[];
  // Chat actions
  addChatMessage: (projectId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  clearChatMessages: (projectId: string) => void;
}

const GALLERY_PIN = '1234';
const MASTER_PIN = 'master123';

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 'cover-1',
    projectId: '',
    orderIndex: 0,
    type: 'Couverture',
    title: 'Nouveau Projet',
    content: { subtitle: 'Société cible | Secteur', targetCompany: '' },
    notes: null,
  },
  {
    id: 'agenda-1',
    projectId: '',
    orderIndex: 1,
    type: 'SectionNavigator',
    title: 'Ordre du jour',
    content: { sections: [
      { id: 's1', title: 'Contexte', page: 2 },
      { id: 's2', title: 'Transaction', page: 3 },
      { id: 's3', title: 'Valorisation', page: 4 },
      { id: 's4', title: 'Conclusion', page: 5 },
    ]},
    notes: null,
  },
  {
    id: 'context-1',
    projectId: '',
    orderIndex: 2,
    type: 'Titre',
    title: 'Contexte de la transaction',
    content: { text: 'Description du contexte M&A...' },
    notes: null,
  },
  {
    id: 'kpi-1',
    projectId: '',
    orderIndex: 3,
    type: 'KPI_Card',
    title: 'Indicateurs clés',
    content: { kpis: [
      { id: 'kpi1', label: 'CA', value: '0 M€', change: 0 },
      { id: 'kpi2', label: 'EBITDA', value: '0 M€', change: 0 },
      { id: 'kpi3', label: 'Multiple', value: 'x0.0', change: 0 },
    ]},
    notes: null,
  },
  {
    id: 'swot-1',
    projectId: '',
    orderIndex: 4,
    type: 'SWOT',
    title: 'Analyse SWOT',
    content: { swot: {
      strengths: ['Force 1', 'Force 2'],
      weaknesses: ['Faiblesse 1'],
      opportunities: ['Opportunité 1'],
      threats: ['Menace 1'],
    }},
    notes: null,
  },
  {
    id: 'team-1',
    projectId: '',
    orderIndex: 5,
    type: 'Team_Grid',
    title: 'Équipe projet',
    content: { advisors: [
      { name: 'Nom du conseiller', role: 'Associé', firm: 'alecia' },
    ]},
    notes: null,
  },
  {
    id: 'contact-1',
    projectId: '',
    orderIndex: 6,
    type: 'Contact_Block',
    title: 'Contact',
    content: { name: 'Nom', email: 'email@alecia.fr', phone: '+33 1 XX XX XX XX', company: { name: 'Alecia', sector: 'Conseil M&A' } },
    notes: null,
  },
];

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userTag: null,
      hasMasterAccess: false,
      currentProject: null,
      projects: [],
      slides: [],
      activeSlideId: null,
      sidebarOpen: true,
      aiPanelOpen: false,
      variablesPanelOpen: false,
      variables: [
        { id: 'v1', name: 'client_name', value: '', type: 'text', description: 'Nom du client' },
        { id: 'v2', name: 'client_sector', value: '', type: 'text', description: 'Secteur' },
        { id: 'v3', name: 'deal_amount', value: '', type: 'currency', description: 'Montant' },
        { id: 'v4', name: 'ebitda', value: '', type: 'currency', description: 'EBITDA' },
        { id: 'v5', name: 'ebitda_multiple', value: '', type: 'number', description: 'Multiple EBITDA' },
        { id: 'v6', name: 'advisor_name', value: '', type: 'text', description: 'Nom du conseiller' },
        { id: 'v7', name: 'target_company', value: '', type: 'text', description: 'Entreprise cible' },
        { id: 'v8', name: 'date', value: '', type: 'date', description: 'Date' },
        { id: 'v9', name: 'confidentiality_level', value: 'Strictement confidentiel', type: 'text', description: 'Niveau de confidentialité' },
      ],
      variablePresets: [],
      toast: null,
      chatMessages: {},

      authenticate: (pin, userTag) => {
        if (pin === GALLERY_PIN || pin === MASTER_PIN) {
          set({ isAuthenticated: true, userTag: userTag || null, hasMasterAccess: pin === MASTER_PIN });
          return true;
        }
        return false;
      },

      authenticateMaster: (pin) => {
        if (pin === MASTER_PIN) {
          set({ hasMasterAccess: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, userTag: null, hasMasterAccess: false, currentProject: null, slides: [] });
      },

      setCurrentProject: (project) => {
        if (project) {
          const projectSlides = project.slides || DEFAULT_SLIDES.map((s, i) => ({
            ...s,
            id: `${project.id}-slide-${i}`,
            projectId: project.id,
          }));
          set({ currentProject: project, slides: projectSlides, activeSlideId: projectSlides[0]?.id || null });
        } else {
          set({ currentProject: null, slides: [], activeSlideId: null });
        }
      },

      createProject: (name, userTag) => {
        const id = `project-${Date.now()}`;
        const now = new Date().toISOString();
        const project: Project = {
          id,
          name,
          userTag: userTag || get().userTag || 'Anonyme',
          targetCompany: '',
          targetSector: '',
          dealType: 'custom',
          theme: { primaryColor: '#061a40', accentColor: '#b80c09', fontFamily: 'Bierstadt', logoPath: null },
          createdAt: now,
          updatedAt: now,
          slides: DEFAULT_SLIDES.map((s, i) => ({ ...s, id: `${id}-slide-${i}`, projectId: id, orderIndex: i })),
        };
        
        const slides = project.slides;
        set((state) => ({
          projects: [...state.projects, project],
          currentProject: project,
          slides,
          activeSlideId: slides[0]?.id || null,
        }));
        
        return project;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
          currentProject: state.currentProject?.id === id
            ? { ...state.currentProject, ...updates, updatedAt: new Date().toISOString() }
            : state.currentProject,
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
          slides: state.currentProject?.id === id ? [] : state.slides,
        }));
      },

      addSlide: (type, title, content) => {
        const project = get().currentProject;
        if (!project) return null as unknown as Slide;
        
        const newSlide: Slide = {
          id: `slide-${Date.now()}`,
          projectId: project.id,
          orderIndex: get().slides.length,
          type: type as Slide['type'],
          title: title || `Nouvelle diapositive`,
          content: content || {},
          notes: null,
        };
        
        set((state) => ({
          slides: [...state.slides, newSlide],
        }));
        
        return newSlide;
      },

      updateSlide: (id, updates) => {
        set((state) => ({
          slides: state.slides.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },

      deleteSlide: (id) => {
        set((state) => ({
          slides: state.slides.filter((s) => s.id !== id),
          activeSlideId: state.activeSlideId === id ? state.slides[0]?.id : state.activeSlideId,
        }));
      },

      reorderSlides: (activeId, overId) => {
        set((state) => {
          const oldIndex = state.slides.findIndex((s) => s.id === activeId);
          const newIndex = state.slides.findIndex((s) => s.id === overId);
          if (oldIndex === -1 || newIndex === -1) return state;
          
          const newSlides = [...state.slides];
          const [removed] = newSlides.splice(oldIndex, 1);
          newSlides.splice(newIndex, 0, removed);
          
          return { slides: newSlides.map((s, i) => ({ ...s, orderIndex: i })) };
        });
      },

      setActiveSlide: (id) => set({ activeSlideId: id }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleAIPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
      toggleVariablesPanel: () => set((state) => ({ variablesPanelOpen: !state.variablesPanelOpen })),
      setToast: (toast) => set({ toast }),
      // Variable actions
      addVariable: (variable) => {
        const newVariable: Variable = {
          ...variable,
          id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        set((state) => ({ variables: [...state.variables, newVariable] }));
      },
      updateVariable: (id, updates) => {
        set((state) => ({
          variables: state.variables.map((v) =>
            v.id === id ? { ...v, ...updates } : v
          ),
        }));
      },
      deleteVariable: (id) => {
        set((state) => ({
          variables: state.variables.filter((v) => v.id !== id),
        }));
      },
      setVariablePreset: (preset) => {
        if (!preset) {
          set({ variablePresets: [] });
          return;
        }
        set((state) => {
          const exists = state.variablePresets.some((p) => p.id === preset.id);
          if (exists) {
            return {
              variablePresets: state.variablePresets.map((p) =>
                p.id === preset.id ? preset : p
              ),
            };
          }
          return { variablePresets: [...state.variablePresets, preset] };
        });
      },
      // Chat actions
      addChatMessage: (projectId, message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
        };
        set((state) => ({
          chatMessages: {
            ...state.chatMessages,
            [projectId]: [...(state.chatMessages[projectId] || []), newMessage],
          },
        }));
      },
      clearChatMessages: (projectId) => {
        set((state) => ({
          chatMessages: {
            ...state.chatMessages,
            [projectId]: [],
          },
        }));
      },
    }),
    {
      name: 'alecia-storage',
      partialize: (state) => ({
        projects: state.projects,
        userTag: state.userTag,
        variables: state.variables,
        variablePresets: state.variablePresets,
      }),
    }
  )
);

export const useSlides = () => {
  const slides = useAppStore((state) => state.slides);
  const activeSlideId = useAppStore((state) => state.activeSlideId);
  const addSlide = useAppStore((state) => state.addSlide);
  const updateSlide = useAppStore((state) => state.updateSlide);
  const deleteSlide = useAppStore((state) => state.deleteSlide);
  const reorderSlides = useAppStore((state) => state.reorderSlides);
  const setActiveSlide = useAppStore((state) => state.setActiveSlide);
  return { slides, activeSlideId, addSlide, updateSlide, deleteSlide, reorderSlides, setActiveSlide };
};

export const useProjects = () => {
  const projects = useAppStore((state) => state.projects);
  const currentProject = useAppStore((state) => state.currentProject);
  const setCurrentProject = useAppStore((state) => state.setCurrentProject);
  const createProject = useAppStore((state) => state.createProject);
  const updateProject = useAppStore((state) => state.updateProject);
  const deleteProject = useAppStore((state) => state.deleteProject);
  return { projects, currentProject, setCurrentProject, createProject, updateProject, deleteProject };
};

export const useUI = () => useAppStore((state) => ({
  sidebarOpen: state.sidebarOpen,
  aiPanelOpen: state.aiPanelOpen,
  variablesPanelOpen: state.variablesPanelOpen,
  toast: state.toast,
  toggleSidebar: state.toggleSidebar,
  toggleAIPanel: state.toggleAIPanel,
  toggleVariablesPanel: state.toggleVariablesPanel,
  setToast: state.setToast,
}));

export const useHistory = () => {
  const slides = useAppStore((state) => state.slides);
  return { slides };
};

export const useVariables = () => {
  const variables = useAppStore((state) => state.variables);
  const variablePresets = useAppStore((state) => state.variablePresets);
  const addVariable = useAppStore((state) => state.addVariable);
  const updateVariable = useAppStore((state) => state.updateVariable);
  const deleteVariable = useAppStore((state) => state.deleteVariable);
  const setVariablePreset = useAppStore((state) => state.setVariablePreset);
  return {
    variables,
    variablePresets,
    addVariable,
    updateVariable,
    deleteVariable,
    setVariablePreset,
  };
};
