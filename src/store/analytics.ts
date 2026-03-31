import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AnalyticsEvent {
  id: string;
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId: string;
  sent?: boolean;
}

export interface UsageMetrics {
  dau: number;
  wau: number;
  mau: number;
  projectsCreated: number;
  projectsExported: number;
  projectsShared: number;
  aiGenerations: number;
  aiTokensUsed: number;
  signupsToFirstProject: number;
  projectsToFirstExport: number;
  lastUpdated: number;
}

export interface FunnelStep {
  name: string;
  count: number;
  dropoff: number;
}

interface AnalyticsState {
  sessionId: string;
  sessionStart: number;
  eventQueue: AnalyticsEvent[];
  metrics: UsageMetrics;
  trackEvent: (name: string, properties?: Record<string, unknown>) => void;
  trackPageView: (path: string) => void;
  trackSignup: (userId: string) => void;
  trackProjectCreated: (projectId: string) => void;
  trackProjectExported: (projectId: string, format: string) => void;
  trackAISGeneration: (tokensUsed: number) => void;
  flushEvents: () => void;
  getMetrics: () => Promise<UsageMetrics>;
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      sessionId: generateSessionId(),
      sessionStart: Date.now(),
      eventQueue: [],
      metrics: {
        dau: 0,
        wau: 0,
        mau: 0,
        projectsCreated: 0,
        projectsExported: 0,
        projectsShared: 0,
        aiGenerations: 0,
        aiTokensUsed: 0,
        signupsToFirstProject: 0,
        projectsToFirstExport: 0,
        lastUpdated: Date.now(),
      },

      trackEvent: (name, properties) => {
        const event: AnalyticsEvent = {
          id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name,
          properties,
          timestamp: Date.now(),
          sessionId: get().sessionId,
        };

        set((state) => ({
          eventQueue: [...state.eventQueue, event],
        }));

        if (get().eventQueue.length >= 10) {
          get().flushEvents();
        }
      },

      trackPageView: (path) => {
        get().trackEvent('page_view', { path });
      },

      trackSignup: (userId) => {
        get().trackEvent('user_signup', { userId });
      },

      trackProjectCreated: (projectId) => {
        get().trackEvent('project_created', { projectId });
        set((state) => ({
          metrics: {
            ...state.metrics,
            projectsCreated: state.metrics.projectsCreated + 1,
          },
        }));
      },

      trackProjectExported: (projectId, format) => {
        get().trackEvent('project_exported', { projectId, format });
        set((state) => ({
          metrics: {
            ...state.metrics,
            projectsExported: state.metrics.projectsExported + 1,
          },
        }));
      },

      trackAISGeneration: (tokensUsed) => {
        get().trackEvent('ai_generation', { tokensUsed });
        set((state) => ({
          metrics: {
            ...state.metrics,
            aiGenerations: state.metrics.aiGenerations + 1,
            aiTokensUsed: state.metrics.aiTokensUsed + tokensUsed,
          },
        }));
      },

      flushEvents: async () => {
        const unsentEvents = get().eventQueue.filter((e) => !e.sent);
        if (unsentEvents.length === 0) return;

        // If no real endpoint, just log and mark as sent
        if (!import.meta.env.VITE_ANALYTICS_ENDPOINT) {
          console.log('[Analytics]', unsentEvents.length, 'events would be sent');
          set({
            eventQueue: get().eventQueue.map((e) => ({ ...e, sent: true })),
          });
          return;
        }

        const events = get().eventQueue;
        set({ eventQueue: [] });

        try {
          console.log('[Analytics] Flushing events:', events.length);
        } catch (error) {
          console.error('[Analytics] Failed to flush events:', error);
          set((state) => ({
            eventQueue: [...events, ...state.eventQueue],
          }));
        }
      },

      getMetrics: async () => {
        return get().metrics;
      },
    }),
    {
      name: 'pitchforge-analytics',
      partialize: (state) => ({
        metrics: state.metrics,
        sessionId: state.sessionId,
      }),
    }
  )
);

export function useTrackEvent() {
  const trackEvent = useAnalyticsStore((s) => s.trackEvent);
  const trackPageView = useAnalyticsStore((s) => s.trackPageView);
  const trackSignup = useAnalyticsStore((s) => s.trackSignup);
  const trackProjectCreated = useAnalyticsStore((s) => s.trackProjectCreated);
  const trackProjectExported = useAnalyticsStore((s) => s.trackProjectExported);
  const trackAISGeneration = useAnalyticsStore((s) => s.trackAISGeneration);

  return {
    trackEvent,
    trackPageView,
    trackSignup,
    trackProjectCreated,
    trackProjectExported,
    trackAISGeneration,
  };
}

export default useAnalyticsStore;
