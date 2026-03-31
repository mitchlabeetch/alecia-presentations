// Store stub - Alecia Presentations
// This file exports the Zustand store and hooks

import { create } from "zustand";
import type { Presentation, Slide, ChatSession, ChatMessage, User, PresentationVariables, SlideType } from "../types";

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  presentations: Presentation[];
  currentPresentation: Presentation | null;
  setCurrentPresentation: (presentation: Presentation | null) => void;
  createPresentation: (title: string) => Promise<Presentation>;
  deletePresentation: (id: string) => Promise<void>;
  slides: Slide[];
  selectedSlideId: string | null;
  setSelectedSlide: (id: string | null) => void;
  addSlide: (type: SlideType) => Slide;
  deleteSlide: (id: string) => void;
  duplicateSlide: (id: string) => void;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
  updateVariables: (variables: Partial<PresentationVariables>) => void;
  setVariable: (key: string, value: unknown) => void;
  editorState: {
    selectedSlideId: string | null;
    selectedBlockId: string | null;
    zoom: number;
    isPreviewMode: boolean;
    isFullscreen: boolean;
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
    sidebarOpen: boolean;
    rightPanelOpen: boolean;
    activeTab: "slides" | "templates" | "variables" | "chat";
  };
  setZoom: (zoom: number) => void;
  togglePreviewMode: () => void;
  toggleGrid: () => void;
  setActiveTab: (tab: "slides" | "templates" | "variables" | "chat") => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  createSession: (presentationId: string) => void;
  addMessage: (sessionId: string, message: Omit<ChatMessage, "id" | "timestamp">) => void;
  isTyping: boolean;
}

const useStore = create<StoreState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  login: async () => {},
  logout: () => set({ user: null }),
  isLoading: false,
  presentations: [],
  currentPresentation: null,
  setCurrentPresentation: (presentation) => set({ currentPresentation: presentation }),
  createPresentation: async (title) => ({ id: "", title, slides: [], variables: {} as PresentationVariables, status: "draft", createdBy: "", createdAt: new Date(), updatedAt: new Date(), lastModifiedBy: "", tags: [] } as Presentation),
  deletePresentation: async () => {},
  slides: [],
  selectedSlideId: null,
  setSelectedSlide: (id) => set({ selectedSlideId: id }),
  addSlide: (type) => ({ id: "new-slide", type, content: { blocks: [] }, layout: { template: "", padding: { top: 0, right: 0, bottom: 0, left: 0 } }, order: 0, isHidden: false, createdAt: new Date(), updatedAt: new Date() } as Slide),
  deleteSlide: () => {},
  duplicateSlide: () => {},
  updateSlide: () => {},
  updateVariables: () => {},
  setVariable: () => {},
  editorState: {
    selectedSlideId: null,
    selectedBlockId: null,
    zoom: 1,
    isPreviewMode: false,
    isFullscreen: false,
    showGrid: false,
    snapToGrid: true,
    gridSize: 20,
    sidebarOpen: true,
    rightPanelOpen: true,
    activeTab: "slides",
  },
  setZoom: () => {},
  togglePreviewMode: () => set((state) => ({ editorState: { ...state.editorState, isPreviewMode: !state.editorState.isPreviewMode } })),
  toggleGrid: () => set((state) => ({ editorState: { ...state.editorState, showGrid: !state.editorState.showGrid } })),
  setActiveTab: (tab) => set((state) => ({ editorState: { ...state.editorState, activeTab: tab } })),
  sessions: [],
  currentSessionId: null,
  createSession: (presentationId) => {
    const sessionId = "session-" + Date.now();
    const newSession: ChatSession = {
      id: sessionId,
      presentationId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ sessions: [...state.sessions, newSession], currentSessionId: newSession.id }));
  },
  addMessage: () => {},
  isTyping: false,
}));

export const useCurrentPresentation = () => useStore((state) => state.currentPresentation);
export const useSlides = () => useStore((state) => state.slides);
export const useSelectedSlide = () => useStore((state) => state.selectedSlideId);

export default useStore;
