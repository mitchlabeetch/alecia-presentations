/**
 * Dashboard - Liste des présentations
 * Interface moderne avec tous les outils
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  MoreVertical, 
  Trash2, 
  Copy, 
  Download,
  LogOut,
  Search,
  Grid,
  List,
  Clock,
  Users,
  Folder,
  Settings,
  ChevronRight,
  Presentation,
  Sparkles,
  Layout
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

// API URL from App
const API_URL = '/api';

interface Presentation {
  id: string;
  title: string;
  description: string;
  status: string;
  updated_at: string;
  created_at: string;
  creatorName: string;
  slide_count?: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuthStore();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      const response = await fetch(`${API_URL}/presentations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Add slide count for each presentation
        const withCounts = await Promise.all(
          data.map(async (p: Presentation) => {
            try {
              const detailRes = await fetch(`${API_URL}/presentations/${p.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (detailRes.ok) {
                const detail = await detailRes.json();
                return { ...p, slide_count: detail.slides?.length || 0 };
              }
            } catch (e) {
              console.error('Error loading presentation details:', e);
            }
            return p;
          })
        );
        setPresentations(withCounts);
      }
    } catch (error) {
      console.error('Failed to load presentations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPresentation = async () => {
    if (!newTitle.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/presentations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
      });
      
      if (response.ok) {
        const data = await response.json();
        navigate(`/editor/${data.id}`);
      }
    } catch (error) {
      console.error('Failed to create presentation:', error);
    }
  };

  const deletePresentation = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette présentation ?')) return;
    
    try {
      const response = await fetch(`${API_URL}/presentations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setPresentations(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete presentation:', error);
    }
  };

  const duplicatePresentation = async (pres: Presentation) => {
    try {
      const response = await fetch(`${API_URL}/presentations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          title: `${pres.title} (copie)`,
          description: pres.description 
        })
      });
      
      if (response.ok) {
        loadPresentations();
      }
    } catch (error) {
      console.error('Failed to duplicate presentation:', error);
    }
  };

  const filteredPresentations = presentations.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-alecia-navy flex flex-col">
      {/* Header */}
      <header className="bg-alecia-navy-light/80 backdrop-blur-md border-b border-alecia-navy-lighter/30 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-alecia-pink to-alecia-pink-dark flex items-center justify-center">
                <span className="text-xl font-black text-white">a</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">alecia</h1>
                <p className="text-xs text-alecia-gray-500">Présentations</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-alecia-navy rounded-xl border border-alecia-navy-lighter/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-alecia-pink to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-alecia-gray-500 text-xs capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2.5 hover:bg-alecia-navy-lighter rounded-xl transition-colors text-alecia-gray-400 hover:text-white"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Stats & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Mes Présentations</h2>
            <p className="text-alecia-gray-500">
              {presentations.length} présentation{presentations.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-alecia-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2.5 bg-alecia-navy-light rounded-xl border border-alecia-navy-lighter/30 text-white placeholder:text-alecia-gray-500 focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none w-64"
              />
            </div>
            
            <div className="flex items-center gap-1 bg-alecia-navy-light rounded-xl p-1 border border-alecia-navy-lighter/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-alecia-navy-lighter text-white' : 'text-alecia-gray-400 hover:text-white'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-alecia-navy-lighter text-white' : 'text-alecia-gray-400 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-alecia-pink to-alecia-pink-dark text-white rounded-xl hover:shadow-lg hover:shadow-alecia-pink/30 transition-all flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Nouvelle présentation</span>
              <span className="sm:hidden">Nouveau</span>
            </button>
          </div>
        </div>

        {/* Presentations */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-3 border-alecia-pink border-t-transparent rounded-full animate-spin" />
              <p className="text-alecia-gray-500">Chargement...</p>
            </div>
          </div>
        ) : filteredPresentations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-3xl bg-alecia-navy-light flex items-center justify-center mx-auto mb-6">
              <Presentation className="w-12 h-12 text-alecia-navy-lighter" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'Aucune présentation trouvée' : 'Aucune présentation'}
            </h3>
            <p className="text-alecia-gray-500 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? 'Essayez une autre recherche' 
                : 'Créez votre première présentation pour commencer à utiliser Alecia'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-alecia-pink text-white rounded-xl hover:bg-alecia-pink-dark transition-colors inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Créer ma première présentation
              </button>
            )}
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredPresentations.map((presentation, index) => (
                <motion.div
                  key={presentation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-alecia-navy-light rounded-2xl border border-alecia-navy-lighter/30 overflow-hidden hover:border-alecia-pink/50 transition-all cursor-pointer relative"
                  onClick={() => navigate(`/editor/${presentation.id}`)}
                >
                  {/* Preview */}
                  <div className="aspect-[16/10] bg-gradient-to-br from-alecia-navy to-alecia-navy-light p-6 flex items-center justify-center relative overflow-hidden">
                    {/* Watermark */}
                    <span className="absolute text-[8rem] font-black text-alecia-navy-light/30 leading-none">
                      &
                    </span>
                    
                    <div className="relative z-10 text-center">
                      <Layout className="w-12 h-12 text-alecia-pink mx-auto mb-2" />
                      <span className="text-sm text-alecia-gray-500">{presentation.slide_count || 0} slides</span>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-alecia-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="px-6 py-2.5 bg-alecia-pink text-white rounded-xl font-medium hover:bg-alecia-pink-dark transition-colors flex items-center gap-2">
                        Ouvrir
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-white truncate mb-1">{presentation.title}</h3>
                    <p className="text-sm text-alecia-gray-500 truncate mb-4">
                      {presentation.description || 'Sans description'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-alecia-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(presentation.updated_at)}
                      </div>
                      
                      {/* Actions menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(menuOpen === presentation.id ? null : presentation.id);
                          }}
                          className="p-2 hover:bg-alecia-navy-lighter rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        <AnimatePresence>
                          {menuOpen === presentation.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 bottom-full mb-2 w-48 bg-alecia-navy rounded-xl border border-alecia-navy-lighter/50 shadow-xl z-50 py-1"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicatePresentation(presentation);
                                  setMenuOpen(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-alecia-navy-lighter flex items-center gap-2"
                              >
                                <Copy className="w-4 h-4" />
                                Dupliquer
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deletePresentation(presentation.id);
                                  setMenuOpen(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-red-500/20 text-red-400 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            <AnimatePresence>
              {filteredPresentations.map((presentation, index) => (
                <motion.div
                  key={presentation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-4 p-4 bg-alecia-navy-light rounded-xl border border-alecia-navy-lighter/30 hover:border-alecia-pink/50 transition-all cursor-pointer group"
                  onClick={() => navigate(`/editor/${presentation.id}`)}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-alecia-navy to-alecia-navy-light flex items-center justify-center">
                    <Layout className="w-6 h-6 text-alecia-pink" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{presentation.title}</h3>
                    <p className="text-sm text-alecia-gray-500 truncate">
                      {presentation.description || 'Sans description'}
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-6 text-sm text-alecia-gray-500">
                    <span className="flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      {presentation.slide_count || 0} slides
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatDate(presentation.updated_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicatePresentation(presentation);
                      }}
                      className="p-2 hover:bg-alecia-navy-lighter rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePresentation(presentation.id);
                      }}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-alecia-navy-light rounded-2xl border border-alecia-navy-lighter/50 p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-alecia-pink/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-alecia-pink" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Nouvelle présentation</h2>
                  <p className="text-sm text-alecia-gray-500">Donnez un nom à votre projet</p>
                </div>
              </div>
              
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Pitch TechCorp"
                className="w-full px-4 py-3 bg-alecia-navy rounded-xl border border-alecia-navy-lighter/50 text-white placeholder:text-alecia-gray-600 focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none mb-6"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && createPresentation()}
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewTitle('');
                  }}
                  className="flex-1 px-4 py-3 border border-alecia-navy-lighter/50 rounded-xl text-alecia-gray-400 hover:text-white hover:bg-alecia-navy-lighter transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={createPresentation}
                  disabled={!newTitle.trim()}
                  className="flex-1 px-4 py-3 bg-alecia-pink text-white rounded-xl hover:bg-alecia-pink-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Créer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Click outside to close menu */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setMenuOpen(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
