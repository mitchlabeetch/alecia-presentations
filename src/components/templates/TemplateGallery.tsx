import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Heart, 
  Plus, 
  LayoutGrid, 
  List,
  X,
  Sparkles,
  FolderOpen
} from 'lucide-react';
import { 
  useTemplates, 
  Template, 
  TemplateCategory 
} from './useTemplates';
import TemplateCard from './TemplateCard';
import TemplateCategories from './TemplateCategories';
import TemplatePreview from './TemplatePreview';
import SaveTemplateModal from './SaveTemplateModal';

// Type pour les vues
 type ViewMode = 'grid' | 'list';

interface TemplateGalleryProps {
  onApplyTemplate: (template: Template, variableValues?: Record<string, string>) => void;
  onSaveAsTemplate?: (slides: any[]) => void;
  currentSlides?: any[];
  showSaveButton?: boolean;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onApplyTemplate,
  currentSlides = [],
  showSaveButton = true
}) => {
  const {
    templates,
    filteredTemplates,
    filters,
    categoryCounts,
    addTemplate,
    toggleFavorite,
    deleteTemplate,
    duplicateTemplate,
    setSearch,
    setCategory,
    toggleFavoritesOnly,
    toggleCustomOnly,
    resetFilters
  } = useTemplates();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Ouvrir l'aperçu
  const handlePreview = useCallback((template: Template) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  }, []);

  // Fermer l'aperçu
  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setTimeout(() => setPreviewTemplate(null), 200);
  }, []);

  // Appliquer un template
  const handleApply = useCallback((template: Template, variableValues?: Record<string, string>) => {
    onApplyTemplate(template, variableValues);
    handleClosePreview();
  }, [onApplyTemplate, handleClosePreview]);

  // Sauvegarder un nouveau template
  const handleSaveTemplate = useCallback((templateData: {
    name: string;
    description: string;
    category: TemplateCategory;
    slides: any[];
    defaultVariables: any[];
  }) => {
    addTemplate({
      ...templateData,
      thumbnail: undefined,
      isFavorite: false,
      isCustom: true,
      author: 'Utilisateur'
    });
  }, [addTemplate]);

  // Compter les templates personnalisés
  const customTemplatesCount = templates.filter(t => t.isCustom).length;

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = filters.search || filters.favoritesOnly || filters.customOnly;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4">
            {/* Titre */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0a1628] to-[#1a2642] rounded-xl flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0a1628]">
                  Modèles de présentation
                </h1>
                <p className="text-sm text-gray-500">
                  {filteredTemplates.length} modèle{filteredTemplates.length !== 1 ? 's' : ''} disponible{filteredTemplates.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un modèle..."
                  className="w-full lg:w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e91e63]/20 focus:border-[#e91e63] transition-all"
                />
                {filters.search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Bouton filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                  ${showFilters || hasActiveFilters
                    ? 'border-[#e91e63] bg-[#e91e63]/5 text-[#e91e63]'
                    : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtres</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-[#e91e63] rounded-full" />
                )}
              </button>

              {/* Toggle vue */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`
                    p-2 transition-colors
                    ${viewMode === 'grid'
                      ? 'bg-[#0a1628] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                    }
                  `}
                  title="Vue grille"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`
                    p-2 transition-colors
                    ${viewMode === 'list'
                      ? 'bg-[#0a1628] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                    }
                  `}
                  title="Vue liste"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Bouton sauvegarder */}
              {showSaveButton && currentSlides.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSaveModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#e91e63] text-white rounded-lg font-medium hover:bg-[#d81b60] transition-colors shadow-md shadow-[#e91e63]/20"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Enregistrer</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Catégories */}
          <div className="pb-4">
            <TemplateCategories
              selectedCategory={filters.category}
              onSelectCategory={setCategory}
              categoryCounts={categoryCounts}
              showCustomTab={true}
              customCount={customTemplatesCount}
            />
          </div>

          {/* Filtres avancés */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-gray-100"
              >
                <div className="py-4 flex flex-wrap items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">Filtres rapides:</span>
                  
                  <button
                    onClick={toggleFavoritesOnly}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all
                      ${filters.favoritesOnly
                        ? 'bg-[#e91e63] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    <Heart className={`w-4 h-4 ${filters.favoritesOnly ? 'fill-current' : ''}`} />
                    Mes favoris
                  </button>

                  <button
                    onClick={toggleCustomOnly}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all
                      ${filters.customOnly
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    <Sparkles className="w-4 h-4" />
                    Mes modèles
                  </button>

                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Réinitialiser
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredTemplates.length === 0 ? (
          /* État vide */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FolderOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[#0a1628] mb-2">
              Aucun modèle trouvé
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              {filters.search
                ? `Aucun modèle ne correspond à "${filters.search}"`
                : filters.favoritesOnly
                ? "Vous n'avez pas encore de modèles favoris"
                : filters.customOnly
                ? "Vous n'avez pas encore créé de modèles personnalisés"
                : "Aucun modèle disponible dans cette catégorie"
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 text-[#e91e63] hover:bg-[#e91e63]/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Réinitialiser les filtres
              </button>
            )}
          </motion.div>
        ) : (
          /* Grille/Liste de templates */
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TemplateCard
                      template={template}
                      onPreview={handlePreview}
                      onApply={handleApply}
                      onToggleFavorite={toggleFavorite}
                      onDuplicate={duplicateTemplate}
                      onDelete={template.isCustom ? deleteTemplate : undefined}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:border-[#e91e63]/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Miniature */}
                      <div 
                        onClick={() => handlePreview(template)}
                        className="w-20 h-14 bg-gradient-to-br from-[#0a1628] to-[#1a2642] rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                      >
                        <span className="text-xl">{template.category && {
                          'pitch-deck': '📊',
                          'levee-fonds': '💰',
                          'cession': '🏢',
                          'acquisition': '🤝',
                          'financements-structures': '🏗️',
                          'rapport': '📄',
                          'equipe': '👥',
                          'references': '⭐',
                          'custom': '💾',
                          'cession_vente': '🏢',
                          'acquisition_achats': '🤝',
                          'lbo_levee_fonds': '💰',
                          'fusion_partenariat': '🔗',
                          'ipo': '📈',
                        }[template.category]}</span>
                      </div>

                      {/* Informations */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[#0a1628] truncate">
                            {template.name}
                          </h3>
                          {template.isFavorite && (
                            <Heart className="w-4 h-4 text-[#e91e63] fill-current flex-shrink-0" />
                          )}
                          {template.isCustom && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full flex-shrink-0">
                              Personnalisé
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                          <span>{template.slides.length} slides</span>
                          <span>{new Intl.DateTimeFormat('fr-FR').format(template.updatedAt)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(template.id)}
                          className={`
                            p-2 rounded-lg transition-colors
                            ${template.isFavorite
                              ? 'text-[#e91e63] bg-[#e91e63]/10'
                              : 'text-gray-400 hover:text-[#e91e63] hover:bg-gray-100'
                            }
                          `}
                        >
                          <Heart className={`w-5 h-5 ${template.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => handlePreview(template)}
                          className="px-4 py-2 text-sm text-gray-600 hover:text-[#0a1628] hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Aperçu
                        </button>
                        <button
                          onClick={() => handleApply(template)}
                          className="px-4 py-2 text-sm bg-[#0a1628] text-white rounded-lg hover:bg-[#1a2642] transition-colors"
                        >
                          Appliquer
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Modal d'aperçu */}
      <TemplatePreview
        template={previewTemplate}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        onApply={handleApply}
        onToggleFavorite={toggleFavorite}
      />

      {/* Modal de sauvegarde */}
      <SaveTemplateModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveTemplate}
        slides={currentSlides}
        existingTemplateNames={templates.filter(t => t.isCustom).map(t => t.name)}
      />
    </div>
  );
};

export default TemplateGallery;
