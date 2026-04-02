import { Outlet } from 'react-router-dom';
import { AleciaLogo } from './AleciaLogo';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-alecia-off-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-alecia-navy text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <AleciaLogo className="h-8 w-auto" />
              <span className="text-xl font-semibold">Alecia</span>
            </div>
            <nav className="flex items-center gap-4">
              <a href="/" className="text-sm font-medium hover:text-alecia-silver transition-colors">
                Galerie
              </a>
              <a href="/templates" className="text-sm font-medium hover:text-alecia-silver transition-colors">
                Modèles
              </a>
              <a href="/help" className="text-sm font-medium hover:text-alecia-silver transition-colors">
                Aide
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
