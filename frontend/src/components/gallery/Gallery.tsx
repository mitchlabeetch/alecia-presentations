import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Clock,
  Search,
  Grid,
  List,
  TrendingUp,
  Briefcase,
  Sparkles,
  X,
  Copy,
  Trash2,
  ExternalLink,
  Building2,
} from 'lucide-react';
import type { Project } from '@/types';
import { useAppStore } from '@/store/useAppStore';

type ViewMode = 'grid' | 'list';

export function Gallery() {
  const navigate = useNavigate();
  const projects = useAppStore((state) => state.projects);
  const setCurrentProject = useAppStore((state) => state.setCurrentProject);
  const createProject = useAppStore((state) => state.createProject);
  const deleteProject = useAppStore((state) => state.deleteProject);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectTag, setNewProjectTag] = useState('');

  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [projects, searchQuery]);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const project = createProject(newProjectName, newProjectTag || undefined);
    setNewProjectName('');
    setNewProjectTag('');
    setShowNewProject(false);
    navigate(`/editor/${project.id}`);
  };

  const handleOpenProject = (project: Project) => {
    setCurrentProject(project);
    navigate(`/editor/${project.id}`);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Supprimer ce projet ?')) {
      deleteProject(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-alecia-navy via-0a2a68 to-alecia-navy">
      <div className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mes présentations</h1>
            <p className="text-alecia-silver">
              {projects.length} projet(s)
            </p>
          </div>
          <button
            onClick={() => setShowNewProject(true)}
            className="alecia-btn-primary"
          >
            <Plus className="w-5 h-5" />
            Nouveau projet
          </button>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-alecia-silver" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="alecia-input pl-10 w-full"
            />
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="alecia-btn-ghost"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
          </button>
        </div>

        {showNewProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-alecia-navy mb-4">Nouveau projet</h2>
              <input
                type="text"
                placeholder="Nom du projet"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="alecia-input w-full mb-4"
                autoFocus
              />
              <input
                type="text"
                placeholder="Votre nom (optionnel)"
                value={newProjectTag}
                onChange={(e) => setNewProjectTag(e.target.value)}
                className="alecia-input w-full mb-4"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowNewProject(false)} className="alecia-btn-secondary flex-1">
                  Annuler
                </button>
                <button onClick={handleCreateProject} className="alecia-btn-primary flex-1">
                  Créer
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-alecia-silver/30 mx-auto mb-4" />
            <p className="text-alecia-silver/50 text-lg">
              {searchQuery ? 'Aucun projet trouvé' : 'Aucun projet pour le moment'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowNewProject(true)}
                className="alecia-btn-primary mt-4"
              >
                Créer mon premier projet
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleOpenProject(project)}
                className={`
                  bg-white rounded-xl p-6 cursor-pointer
                  hover:shadow-modal transition-all
                  ${viewMode === 'list' ? 'flex items-center gap-4' : ''}
                `}
              >
                <div className={viewMode === 'list' ? 'flex-1' : 'mb-4'}>
                  <h3 className="font-semibold text-alecia-navy mb-2">{project.name}</h3>
                  <div className="text-sm text-alecia-silver space-y-1">
                    <p>{project.dealType || 'Personnalisé'}</p>
                    <p className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(project.updatedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className={viewMode === 'list' ? 'flex gap-2' : 'flex gap-2 mt-4'}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
                    className="p-2 hover:bg-alecia-red/10 rounded-lg text-alecia-red"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
