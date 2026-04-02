import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Folder,
  Clock,
  Lock,
  Users,
  Search,
  ChevronDown,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Building2,
  TrendingUp,
  Handshake,
  Sparkles,
  X,
  MoreHorizontal,
  Copy,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { api, handleApiError } from '@/lib/api';
import { useProjects, useUI } from '@/store/useAppStore';
import { ProjectPINDialog } from '@/components/auth/ProjectPINDialog';
import type { Project } from '@/types';

type SortOption = 'name' | 'createdAt' | 'updatedAt';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';
type DealTypeFilter = 'all' | 'cession_vente' | 'lbo_levee_fonds' | 'acquisition_achats' | 'custom';

const DEAL_TYPE_LABELS: Record<string, string> = {
  cession_vente: 'Cession',
  lbo_levee_fonds: 'Levée de fonds',
  acquisition_achats: 'Acquisition',
  custom: 'Personnalisé',
};

const DEAL_TYPE_ICONS: Record<string, React.ReactNode> = {
  cession_vente: <Handshake className="w-4 h-4" />,
  lbo_levee_fonds: <TrendingUp className="w-4 h-4" />,
  acquisition_achats: <Building2 className="w-4 h-4" />,
  custom: <Sparkles className="w-4 h-4" />,
};

export function Gallery() {
  const navigate = useNavigate();
  const { projects, setProjects, setProjectsLoading, projectsLoading } = useProjects();
  const { setNewProjectWizardOpen } = useUI();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [dealTypeFilter, setDealTypeFilter] = useState<DealTypeFilter>('all');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ project: Project; x: number; y: number } | null>(null);

  // Project PIN Dialog
  const [pinDialog, setPinDialog] = useState<{
    isOpen: boolean;
    project: Project | null;
  }>({
    isOpen: false,
    project: null,
  });

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        const response = await api.projects.list({ limit: 100 });
        if (response.data) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, [setProjects, setProjectsLoading]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.targetCompany.toLowerCase().includes(query) ||
          p.targetSector.toLowerCase().includes(query) ||
          p.userTag?.toLowerCase().includes(query)
      );
    }

    // Apply deal type filter
    if (dealTypeFilter !== 'all') {
      filtered = filtered.filter((p) => p.dealType === dealTypeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'fr');
          break;
        case 'createdAt':
          comparison = a.createdAt - b.createdAt;
          break;
        case 'updatedAt':
          comparison = a.updatedAt - b.updatedAt;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [projects, searchQuery, sortBy, sortOrder, dealTypeFilter]);

  // Handle project click
  const handleProjectClick = useCallback(
    (project: Project) => {
      if (project.pinHash) {
        setPinDialog({ isOpen: true, project });
      } else {
        navigate(`/editor/${project.id}`);
      }
    },
    [navigate]
  );

  // Handle PIN success
  const handlePinSuccess = useCallback(
    (project: Project) => {
      navigate(`/editor/${project.id}`);
    },
    [navigate]
  );

  // Handle duplicate project
  const handleDuplicate = useCallback(
    async (project: Project) => {
      const result = await handleApiError(
        api.projects.duplicate(project.id, `${project.name} (copie)`)
      );
      if (result.data) {
        setProjects([...projects, result.data]);
        setContextMenu(null);
      }
    },
    [projects, setProjects]
  );

  // Handle delete project
  const handleDelete = useCallback(
    async (project: Project) => {
      if (confirm(`Êtes-vous sûr de vouloir supprimer "${project.name}" ?`)) {
        const result = await handleApiError(api.projects.delete(project.id));
        if (!result.error) {
          setProjects(projects.filter((p) => p.id !== project.id));
        }
      }
      setContextMenu(null);
    },
    [projects, setProjects]
  );

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-alecia-silver/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-alecia-navy">
              Galerie de présentations
            </h1>
            <p className="mt-1 text-sm text-alecia-silver">
              {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} •{' '}
              {projects.length} au total
            </p>
          </div>
          <button
            onClick={() => setNewProjectWizardOpen(true)}
            className="alecia-btn-accent gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau projet
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mt-4 flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-alecia-silver" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="alecia-input pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-alecia-silver hover:text-alecia-navy"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Deal Type Filter */}
          <select
            value={dealTypeFilter}
            onChange={(e) => setDealTypeFilter(e.target.value as DealTypeFilter)}
            className="alecia-input w-auto"
          >
            <option value="all">Tous les types</option>
            <option value="cession_vente">Cession</option>
            <option value="lbo_levee_fonds">Levée de fonds</option>
            <option value="acquisition_achats">Acquisition</option>
            <option value="custom">Personnalisé</option>
          </select>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="alecia-btn-secondary gap-2"
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
              {sortBy === 'name' ? 'Nom' : sortBy === 'createdAt' ? 'Création' : 'Modification'}
              <ChevronDown className="w-4 h-4" />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-alecia-silver/20 py-2 min-w-[160px] z-10">
                <button
                  onClick={() => {
                    setSortBy('updatedAt');
                    setShowSortMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-alecia-silver/10 ${
                    sortBy === 'updatedAt' ? 'text-alecia-navy font-medium' : 'text-alecia-silver'
                  }`}
                >
                  Date de modification
                </button>
                <button
                  onClick={() => {
                    setSortBy('createdAt');
                    setShowSortMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-alecia-silver/10 ${
                    sortBy === 'createdAt' ? 'text-alecia-navy font-medium' : 'text-alecia-silver'
                  }`}
                >
                  Date de création
                </button>
                <button
                  onClick={() => {
                    setSortBy('name');
                    setShowSortMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-alecia-silver/10 ${
                    sortBy === 'name' ? 'text-alecia-navy font-medium' : 'text-alecia-silver'
                  }`}
                >
                  Nom du projet
                </button>
                <div className="border-t border-alecia-silver/20 my-2" />
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-alecia-silver/10 text-alecia-silver flex items-center gap-2"
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                  Ordre {sortOrder === 'asc' ? 'croissant' : 'décroissant'}
                </button>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-alecia-silver/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-alecia-navy shadow-sm'
                  : 'text-alecia-silver hover:text-alecia-navy'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-alecia-navy shadow-sm'
                  : 'text-alecia-silver hover:text-alecia-navy'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Loading State */}
        {projectsLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-alecia-silver animate-pulse">Chargement des projets...</div>
          </div>
        )}

        {/* Empty State */}
        {!projectsLoading && filteredProjects.length === 0 && projects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-card">
            <div className="w-20 h-20 mx-auto mb-6 bg-alecia-silver/20 rounded-full flex items-center justify-center">
              <Folder className="w-10 h-10 text-alecia-silver" />
            </div>
            <h3 className="text-xl font-semibold text-alecia-navy">
              Aucun projet
            </h3>
            <p className="mt-2 text-alecia-silver max-w-md mx-auto">
              Commencez par créer un nouveau projet ou importez une présentation existante
            </p>
            <button
              onClick={() => setNewProjectWizardOpen(true)}
              className="mt-6 alecia-btn-primary"
            >
              Créer une présentation
            </button>
          </div>
        )}

        {/* No Results State */}
        {!projectsLoading && filteredProjects.length === 0 && projects.length > 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-card">
            <Search className="w-12 h-12 mx-auto mb-4 text-alecia-silver" />
            <h3 className="text-lg font-semibold text-alecia-navy">
              Aucun résultat
            </h3>
            <p className="mt-2 text-alecia-silver max-w-md mx-auto">
              Aucun projet ne correspond à vos critères de recherche.
              <br />
              Essayez avec d'autres termes ou filtres.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDealTypeFilter('all');
              }}
              className="mt-4 alecia-btn-secondary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Grid View */}
        {!projectsLoading && filteredProjects.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCardGrid
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ project, x: e.clientX, y: e.clientY });
                }}
              />
            ))}
          </div>
        )}

        {/* List View */}
        {!projectsLoading && filteredProjects.length > 0 && viewMode === 'list' && (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-alecia-silver/5 border-b border-alecia-silver/20">
                  <th className="text-left px-4 py-3 text-sm font-medium text-alecia-navy">
                    Projet
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-alecia-navy">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-alecia-navy">
                    Entreprise cible
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-alecia-navy">
                    Auteur
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-alecia-navy">
                    Modifié
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <ProjectCardList
                    key={project.id}
                    project={project}
                    onClick={() => handleProjectClick(project)}
                    onDuplicate={() => handleDuplicate(project)}
                    onDelete={() => handleDelete(project)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-xl shadow-lg border border-alecia-silver/20 py-2 min-w-[180px] z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              handleProjectClick(contextMenu.project);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-alecia-silver/10 flex items-center gap-3"
          >
            <ExternalLink className="w-4 h-4 text-alecia-silver" />
            Ouvrir
          </button>
          <button
            onClick={() => handleDuplicate(contextMenu.project)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-alecia-silver/10 flex items-center gap-3"
          >
            <Copy className="w-4 h-4 text-alecia-silver" />
            Dupliquer
          </button>
          <div className="border-t border-alecia-silver/20 my-2" />
          <button
            onClick={() => handleDelete(contextMenu.project)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-alecia-red/10 text-alecia-red flex items-center gap-3"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      )}

      {/* PIN Dialog */}
      {pinDialog.project && (
        <ProjectPINDialog
          isOpen={pinDialog.isOpen}
          onClose={() => setPinDialog({ isOpen: false, project: null })}
          onSuccess={() => handlePinSuccess(pinDialog.project!)}
          projectName={pinDialog.project.name}
          projectId={pinDialog.project.id}
        />
      )}
    </div>
  );
}

// ============================================
// Project Card Components
// ============================================

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

function ProjectCardGrid({ project, onClick, onContextMenu }: ProjectCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="group bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-alecia-navy to-[#0a2a68] relative overflow-hidden">
        {project.theme.logoPath ? (
          <img
            src={project.theme.logoPath}
            alt=""
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl font-bold text-white/10">
              {project.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* PIN Badge */}
        {project.pinHash && (
          <div className="absolute top-2 right-2 bg-alecia-red text-white p-1.5 rounded-lg shadow-lg">
            <Lock className="w-4 h-4" />
          </div>
        )}

        {/* Deal Type Badge */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-alecia-navy px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
          {DEAL_TYPE_ICONS[project.dealType]}
          {DEAL_TYPE_LABELS[project.dealType]}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-alecia-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white font-medium">Ouvrir</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-alecia-navy truncate group-hover:text-alecia-red transition-colors">
          {project.name}
        </h3>

        <p className="mt-1 text-sm text-alecia-silver truncate">
          {project.targetCompany || 'Entreprise non spécifiée'}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-alecia-silver">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(project.updatedAt)}
          </span>
          {project.userTag && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {project.userTag}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCardList({
  project,
  onClick,
  onDuplicate,
  onDelete,
}: ProjectCardProps & {
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <tr
      onClick={onClick}
      className="border-b border-alecia-silver/10 hover:bg-alecia-silver/5 transition-colors cursor-pointer group"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-alecia-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-alecia-navy font-bold">
              {project.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-alecia-navy truncate group-hover:text-alecia-red transition-colors">
              {project.name}
            </p>
            <p className="text-xs text-alecia-silver truncate">
              {project.targetSector || 'Secteur non spécifié'}
            </p>
          </div>
          {project.pinHash && (
            <Lock className="w-4 h-4 text-alecia-red flex-shrink-0" />
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-alecia-silver/10 rounded-md text-xs text-alecia-navy">
          {DEAL_TYPE_ICONS[project.dealType]}
          {DEAL_TYPE_LABELS[project.dealType]}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-alecia-silver">
        {project.targetCompany || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-alecia-silver">
        {project.userTag || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-alecia-silver">
        {formatDate(project.updatedAt)}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Show context menu or actions
          }}
          className="p-1 hover:bg-alecia-silver/10 rounded"
        >
          <MoreHorizontal className="w-4 h-4 text-alecia-silver" />
        </button>
      </td>
    </tr>
  );
}
