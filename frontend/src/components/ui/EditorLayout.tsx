import { Outlet } from 'react-router-dom';

export function EditorLayout() {
  return (
    <div className="h-screen flex flex-col bg-alecia-off-white">
      {/* Editor Toolbar */}
      <header className="h-14 bg-alecia-navy text-white flex items-center px-4 shadow-md">
        <div className="flex items-center gap-4">
          <a href="/" className="text-alecia-silver hover:text-white transition-colors">
            ← Retour
          </a>
          <div className="h-6 w-px bg-alecia-silver/30" />
          <span className="font-medium">Éditeur</span>
        </div>
      </header>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
