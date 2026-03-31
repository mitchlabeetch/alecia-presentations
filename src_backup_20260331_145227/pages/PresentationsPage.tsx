/**
 * Page de liste des présentations
 * Affiche toutes les présentations avec options de filtrage et tri
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Edit3,
  Copy,
  Download,
  Trash2,
  Clock,
  FileText,
  Folder,
  Star,
  Check,
  X,
} from 'lucide-react';
import useStore from '@store/index';
import { formatDate, formatRelativeTime, generateId } from '@lib/utils';
import type { Presentation, PresentationStatus } from '@types/index';

/**
 * Badge de statut
 */
const StatusBadge: React.FC<{ status: PresentationStatus }> = ({ status }) => {
  const styles: Record<PresentationStatus, string> = {
    draft: 'bg-alecia-gray-500/20 text-alecia-gray-400',
    in_review: 'bg-yellow-500/20 text-yellow-400',
    approved: 'bg-green-500/20 text-green-400',
    archived: 'bg-alecia-navy-lighter/50 text-alecia-gray-500',
  };

  const labels: Record<PresentationStatus, string> = {
    draft: 'Brouillon',
    in_review: 'En révision',
    approved: 'Approuvé',
    archived: 'Archivé',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

/**
 * Carte de présentation (vue grille)
 */
const PresentationGridCard: React.FC<{
  presentation: Presentation;
  onClick: () => void;
  onAction: (action: string) => void;
}> = ({ presentation, onClick, onAction }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="card-dark overflow-hidden group cursor-pointer"
    >
      {/* Aperçu */}
      <div
        className="aspect-video bg-alecia-navy relative overflow-hidden"
        onClick={onClick}
      >
        {/* Filigrane */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl font-bold text-alecia-navy-light/20">&</span>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-alecia-pink/0 group-hover:bg-alecia-pink/10 transition-colors" />

        {/* Statut */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={presentation.status} />
        </div>

        {/* Menu */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 rounded-lg bg-alecia-navy/80 text-alecia-gray-300 hover:text-white"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-1 w-48 bg-alecia-navy-light rounded-lg border border-alecia-navy-lighter/30 shadow-alecia z-20"
              >
                {[
                  { icon: Edit3, label: 'Modifier', action: 'edit' },
                  { icon: Copy, label: 'Dupliquer', action: 'duplicate' },
                  { icon: Download, label: 'Télécharger', action: 'download' },
                  { icon: Trash2, label: 'Supprimer', action: 'delete', danger: true },
                ].map((item) => (
                  <button
                    key={item.action}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction(item.action);
                      setShowMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-alecia-navy transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      item.danger ? 'text-red-400 hover:text-red-300' : 'text-alecia-gray-300 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Informations */}
      <div className="p-4">
        <h3 className="text-white font-semibold truncate" title={presentation.title}>
          {presentation.title}
        </h3>
        {presentation.description && (
          <p className="text-alecia-gray-400 text-sm mt-1 truncate">
            {presentation.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-alecia-gray-500 text-xs">
            <FileText className="w-3 h-3" />
            <span>{presentation.slides.length} slides</span>
          </div>
          <div className="flex items-center gap-2 text-alecia-gray-500 text-xs">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(presentation.updatedAt)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Ligne de présentation (vue liste)
 */
const PresentationListRow: React.FC<{
  presentation: Presentation;
  onClick: () => void;
  onAction: (action: string) => void;
}> = ({ presentation, onClick, onAction }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-alecia-navy-lighter/30 hover:bg-alecia-navy-light/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-alecia-navy rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-alecia-gray-400" />
          </div>
          <div>
            <p className="text-white font-medium">{presentation.title}</p>
            {presentation.description && (
              <p className="text-alecia-gray-400 text-sm">{presentation.description}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={presentation.status} />
      </td>
      <td className="px-4 py-4 text-alecia-gray-400 text-sm">
        {presentation.slides.length} slides
      </td>
      <td className="px-4 py-4 text-alecia-gray-400 text-sm">
        {formatDate(presentation.updatedAt)}
      </td>
      <td className="px-4 py-4">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 rounded-lg hover:bg-alecia-navy text-alecia-gray-400 hover:text-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-alecia-navy-light rounded-lg border border-alecia-navy-lighter/30 shadow-alecia z-20">
              {[
                { label: 'Modifier', action: 'edit' },
                { label: 'Dupliquer', action: 'duplicate' },
                { label: 'Télécharger', action: 'download' },
                { label: 'Supprimer', action: 'delete', danger: true },
              ].map((item) => (
                <button
                  key={item.action}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(item.action);
                    setShowMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-alecia-navy transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    item.danger ? 'text-red-400' : 'text-alecia-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

/**
 * Page des présentations
 */
const PresentationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { presentations, createPresentation, deletePresentation } = useStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PresentationStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrer les présentations
  const filteredPresentations = presentations.filter((presentation) => {
    const matchesSearch = presentation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      presentation.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || presentation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePresentation = () => {
    const newPresentation = createPresentation('Nouvelle présentation');
    navigate(`/editor/${newPresentation.id}`);
  };

  const handleAction = (presentation: Presentation, action: string) => {
    switch (action) {
      case 'edit':
        navigate(`/editor/${presentation.id}`);
        break;
      case 'duplicate':
        const duplicated = createPresentation(`${presentation.title} (copie)`);
        navigate(`/editor/${duplicated.id}`);
        break;
      case 'delete':
        if (confirm('Êtes-vous sûr de vouloir supprimer cette présentation ?')) {
          deletePresentation(presentation.id);
        }
        break;
      case 'download':
        // Implémenter le téléchargement
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mes présentations</h1>
          <p className="text-alecia-gray-400 mt-1">
            Gérez et organisez vos présentations
          </p>
        </div>
        <button
          onClick={handleCreatePresentation}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouvelle présentation
        </button>
      </div>

      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Recherche */}
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-alecia-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une présentation..."
            className="w-full pl-12 pr-4 py-3 bg-alecia-navy-light border border-alecia-navy-lighter/50 rounded-lg text-white placeholder:text-alecia-gray-500 focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none"
          />
        </div>

        {/* Filtres */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
            showFilters
              ? 'bg-alecia-pink/20 border-alecia-pink text-alecia-pink'
              : 'bg-alecia-navy-light border-alecia-navy-lighter/50 text-alecia-gray-300 hover:text-white'
          }`}
        >
          <Filter className="w-5 h-5" />
          Filtres
        </button>

        {/* Mode de vue */}
        <div className="flex bg-alecia-navy-light rounded-lg p-1 border border-alecia-navy-lighter/50">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-alecia-pink text-white'
                : 'text-alecia-gray-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-alecia-pink text-white'
                : 'text-alecia-gray-400 hover:text-white'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filtres avancés */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-alecia-navy-light rounded-lg p-4 border border-alecia-navy-lighter/30">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-alecia-gray-400 text-sm mb-2 block">Statut</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as PresentationStatus | 'all')}
                    className="px-4 py-2 bg-alecia-navy border border-alecia-navy-lighter/50 rounded-lg text-white focus:border-alecia-pink focus:outline-none"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="draft">Brouillon</option>
                    <option value="in_review">En révision</option>
                    <option value="approved">Approuvé</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des présentations */}
      {filteredPresentations.length === 0 ? (
        <div className="card-dark p-12 text-center">
          <div className="w-16 h-16 bg-alecia-navy rounded-full flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-alecia-gray-500" />
          </div>
          <h3 className="text-white font-semibold mb-2">
            Aucune présentation trouvée
          </h3>
          <p className="text-alecia-gray-400 mb-4">
            {searchQuery
              ? 'Aucun résultat pour votre recherche'
              : 'Commencez par créer votre première présentation'}
          </p>
          <button
            onClick={handleCreatePresentation}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Créer une présentation
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPresentations.map((presentation) => (
              <PresentationGridCard
                key={presentation.id}
                presentation={presentation}
                onClick={() => navigate(`/editor/${presentation.id}`)}
                onAction={(action) => handleAction(presentation, action)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="card-dark overflow-hidden">
          <table className="w-full">
            <thead className="bg-alecia-navy border-b border-alecia-navy-lighter/30">
              <tr>
                <th className="px-4 py-3 text-left text-alecia-gray-400 font-medium text-sm">Présentation</th>
                <th className="px-4 py-3 text-left text-alecia-gray-400 font-medium text-sm">Statut</th>
                <th className="px-4 py-3 text-left text-alecia-gray-400 font-medium text-sm">Slides</th>
                <th className="px-4 py-3 text-left text-alecia-gray-400 font-medium text-sm">Modifié</th>
                <th className="px-4 py-3 text-left text-alecia-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredPresentations.map((presentation) => (
                  <PresentationListRow
                    key={presentation.id}
                    presentation={presentation}
                    onClick={() => navigate(`/editor/${presentation.id}`)}
                    onAction={(action) => handleAction(presentation, action)}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PresentationsPage;
