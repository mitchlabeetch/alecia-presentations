import { Outlet, Link, useLocation } from 'react-router-dom';
import { AleciaLogo } from './AleciaLogo';

export function MainLayout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-alecia-off-white">
      <header className="sticky top-0 z-50 bg-alecia-navy text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <AleciaLogo className="h-8 w-auto" />
              <span className="text-xl font-semibold">Alecia</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-white' : 'text-alecia-silver hover:text-white'
                }`}
              >
                Galerie
              </Link>
              <Link
                to="/templates"
                className={`text-sm font-medium transition-colors ${
                  isActive('/templates') ? 'text-white' : 'text-alecia-silver hover:text-white'
                }`}
              >
                Modèles
              </Link>
              <Link
                to="/help"
                className={`text-sm font-medium transition-colors ${
                  isActive('/help') ? 'text-white' : 'text-alecia-silver hover:text-white'
                }`}
              >
                Aide
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
