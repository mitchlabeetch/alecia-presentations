import { Routes, Route } from 'react-router-dom';
import { DndContext, DragOverlay } from '@dnd-kit/core';

// Layouts
import { MainLayout } from './components/ui/MainLayout';
import { EditorLayout } from './components/ui/EditorLayout';

// Pages
import { Gallery } from './components/gallery/Gallery';
import { Templates } from './components/gallery/Templates';
import { Help } from './components/ui/Help';
import { ProjectEditor } from './components/editor/ProjectEditor';
import { PresentationMode } from './components/editor/PresentationMode';
import { PINScreen } from './components/auth/PINScreen';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useDragAndDrop } from './hooks/useDragAndDrop';

function App() {
  const { isAuthenticated, authenticate } = useAuth();
  const { sensors, handleDragStart, handleDragEnd, activeId } = useDragAndDrop();

  if (!isAuthenticated) {
    return <PINScreen onAuthenticate={authenticate} />;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Gallery />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/help" element={<Help />} />
        </Route>

        <Route element={<EditorLayout />}>
          <Route path="/editor/:projectId" element={<ProjectEditor />} />
        </Route>

        <Route path="/present/:projectId" element={<PresentationMode />} />
      </Routes>

      <DragOverlay>
        {activeId ? <div className="opacity-50">Dragging {activeId}</div> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
