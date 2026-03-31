import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import { SignInForm } from './components/SignInForm';
import { Toaster } from 'sonner';
import { useState, useEffect, lazy, Suspense } from 'react';
import { Id } from '../convex/_generated/dataModel';
import { PitchForgeLogoFull } from './components/Logo';
import { useAnalyticsStore } from './store/analytics';
import { LoadingScreen } from './components/ui/LoadingSkeleton';
import { api } from '../convex/_generated/api';

const Dashboard = lazy(() =>
  import('./components/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const ProjectEditor = lazy(() =>
  import('./components/ProjectEditor').then((m) => ({ default: m.ProjectEditor }))
);

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState<Id<'projects'> | null>(null);
  const user = useQuery(api.auth.loggedInUser);

  // Track page views on mount
  useEffect(() => {
    const { trackEvent } = useAnalyticsStore.getState();
    trackEvent('page_view', { path: window.location.pathname });
  }, []);

  // Track signup when user signs in for first time
  useEffect(() => {
    if (user && !localStorage.getItem('analytics_initialized')) {
      const { trackEvent } = useAnalyticsStore.getState();
      trackEvent('signup', { userId: user._id });
      localStorage.setItem('analytics_initialized', 'true');
    }
  }, [user]);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f7f8fa]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Authenticated>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <LoadingScreen />
            </div>
          }
        >
          {activeProjectId ? (
            <ProjectEditor projectId={activeProjectId} onBack={() => setActiveProjectId(null)} />
          ) : (
            <Dashboard onOpenProject={setActiveProjectId} />
          )}
        </Suspense>
      </Authenticated>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
}

function LandingPage() {
  const [tab, setTab] = useState<'connexion' | 'inscription'>('connexion');

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg, #0f2035 0%, #1a3a5c 50%, #1e4a6e 100%)' }}
    >
      <header className="h-16 flex items-center justify-between px-8 border-b border-white/10">
        <PitchForgeLogoFull height={34} className="[&_span]:text-white" />
        <div className="hidden sm:flex items-center gap-5 text-sm text-white/60">
          <span className="flex items-center gap-1.5">
            <span className="text-[#c9a84c]">✦</span> IA intégrée
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#c9a84c]">✦</span> Temps réel
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#c9a84c]">✦</span> Collaboratif
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shadow-2xl">
                <svg width="36" height="36" viewBox="0 0 200 200" fill="none">
                  <path
                    d="M55 155 L55 45"
                    stroke="#c9a84c"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  <path
                    d="M55 45 L110 45 Q145 45 145 80 Q145 115 110 115 L55 115"
                    stroke="#c9a84c"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M120 140 L155 105"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                  <path
                    d="M140 105 L155 105 L155 120"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">PitchForge</h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Pitch decks M&A professionnels
              <br />
              propulsés par l'intelligence artificielle
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['Cession', 'LBO', 'Acquisition', 'Levée de fonds', 'Fusion'].map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-white/70 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setTab('connexion')}
                className={`flex-1 py-3.5 text-sm font-semibold transition-all ${tab === 'connexion' ? 'text-[#1a3a5c] border-b-2 border-[#1a3a5c] bg-[#1a3a5c]/3' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Connexion
              </button>
              <button
                onClick={() => setTab('inscription')}
                className={`flex-1 py-3.5 text-sm font-semibold transition-all ${tab === 'inscription' ? 'text-[#1a3a5c] border-b-2 border-[#1a3a5c] bg-[#1a3a5c]/3' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Inscription
              </button>
            </div>
            <div className="p-6">
              <div className="french-auth-wrapper">
                <SignInForm />
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-white/30 mt-5">
            Données chiffrées · Confidentiel · © 2025 PitchForge
          </p>
        </div>
      </main>
    </div>
  );
}
