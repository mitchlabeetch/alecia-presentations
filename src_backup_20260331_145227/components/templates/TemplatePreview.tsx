import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  FileText, 
  Check,
  Info,
  Layout,
  Type,
  Image as ImageIcon
} from 'lucide-react';
import { Template, TemplateVariable, categoryLabels } from './useTemplates';

interface TemplatePreviewProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (template: Template, variableValues?: Record<string, string>) => void;
  onToggleFavorite: (id: string) => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  isOpen,
  onClose,
  onApply,
  onToggleFavorite
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [showVariables, setShowVariables] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'variables'>('preview');

  // Réinitialiser l'état quand le template change
  React.useEffect(() => {
    if (template) {
      setCurrentSlideIndex(0);
      // Initialiser les valeurs des variables avec les valeurs par défaut
      const initialValues: Record<string, string> = {};
      template.defaultVariables.forEach(v => {
        initialValues[v.key] = v.defaultValue;
      });
      setVariableValues(initialValues);
    }
  }, [template]);

  const handlePrevious = useCallback(() => {
    setCurrentSlideIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    if (template) {
      setCurrentSlideIndex(prev => Math.min(template.slides.length - 1, prev + 1));
    }
  }, [template]);

  const handleVariableChange = (key: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    if (template) {
      onApply(template, variableValues);
      onClose();
    }
  };

  // Remplacer les variables dans le contenu
  const processContent = (content?: string, title?: string, subtitle?: string) => {
    let processed = { content, title, subtitle };
    
    Object.entries(variableValues).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      if (processed.title) {
        processed = { ...processed, title: processed.title.replace(placeholder, value) };
      }
      if (processed.subtitle) {
        processed = { ...processed, subtitle: processed.subtitle.replace(placeholder, value) };
      }
      if (processed.content) {
        processed = { ...processed, content: processed.content.replace(placeholder, value) };
      }
    });
    
    return processed;
  };

  if (!template || !isOpen) return null;

  const currentSlide = template.slides[currentSlideIndex];
  const processedSlide = processContent(
    currentSlide.content,
    currentSlide.title,
    currentSlide.subtitle
  );

  const getSlideTypeIcon = (type: string) => {
    switch (type) {
      case 'title': return <Type className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'chart': return <Layout className="w-4 h-4" />;
      case 'table': return <Layout className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getSlideTypeLabel = (type: string) => {
    switch (type) {
      case 'title': return 'Titre';
      case 'content': return 'Contenu';
      case 'split': return 'Split';
      case 'image': return 'Image';
      case 'chart': return 'Graphique';
      case 'table': return 'Tableau';
      case 'team': return 'Équipe';
      case 'references': return 'Références';
      default: return type;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#0a1628]">{template.name}</h2>
                  <p className="text-sm text-gray-500">
                    {categoryLabels[template.category]} • {template.slides.length} slides
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFavorite(template.id)}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${template.isFavorite 
                      ? 'text-[#e91e63] bg-[#e91e63]/10' 
                      : 'text-gray-400 hover:text-[#e91e63] hover:bg-gray-100'
                    }
                  `}
                  title={template.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart className={`w-5 h-5 ${template.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setActiveTab('preview')}
                className={`
                  flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative
                  ${activeTab === 'preview'
                    ? 'text-[#0a1628]'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <Layout className="w-4 h-4" />
                Aperçu
                {activeTab === 'preview' && (
                  <motion.div
                    layoutId="previewTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e91e63]"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('variables')}
                className={`
                  flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative
                  ${activeTab === 'variables'
                    ? 'text-[#0a1628]'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <Type className="w-4 h-4" />
                Variables
                {template.defaultVariables.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                    {template.defaultVariables.length}
                  </span>
                )}
                {activeTab === 'variables' && (
                  <motion.div
                    layoutId="previewTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e91e63]"
                  />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex">
              {activeTab === 'preview' ? (
                <>
                  {/* Sidebar - Navigation des slides */}
                  <div className="w-64 border-r border-gray-100 bg-gray-50/50 overflow-y-auto hidden lg:block">
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Slides
                      </h3>
                      <div className="space-y-2">
                        {template.slides.map((slide, index) => (
                          <button
                            key={slide.id}
                            onClick={() => setCurrentSlideIndex(index)}
                            className={`
                              w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all
                              ${currentSlideIndex === index
                                ? 'bg-[#0a1628] text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                              }
                            `}
                          >
                            <span className={`
                              flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-medium
                              ${currentSlideIndex === index
                                ? 'bg-white/20'
                                : 'bg-gray-100'
                              }
                            `}>
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {slide.title || `Slide ${index + 1}`}
                              </p>
                              <p className={`
                                text-xs flex items-center gap-1
                                ${currentSlideIndex === index ? 'text-white/70' : 'text-gray-400'}
                              `}>
                                {getSlideTypeIcon(slide.type)}
                                {getSlideTypeLabel(slide.type)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Main - Aperçu du slide */}
                  <div className="flex-1 flex flex-col bg-gray-100">
                    {/* Barre de navigation */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrevious}
                          disabled={currentSlideIndex === 0}
                          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                          Slide {currentSlideIndex + 1} / {template.slides.length}
                        </span>
                        <button
                          onClick={handleNext}
                          disabled={currentSlideIndex === template.slides.length - 1}
                          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {getSlideTypeLabel(currentSlide.type)}
                        </span>
                      </div>
                    </div>

                    {/* Zone d'aperçu */}
                    <div className="flex-1 p-8 overflow-auto flex items-center justify-center">
                      <motion.div
                        key={currentSlideIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-4xl aspect-video bg-white rounded-lg shadow-xl overflow-hidden"
                        style={{
                          background: currentSlide.background || '#ffffff'
                        }}
                      >
                        {/* Slide Content Preview */}
                        <div className={`
                          absolute inset-0 p-12 flex flex-col
                          ${currentSlide.layout === 'centered' ? 'items-center justify-center text-center' : ''}
                          ${currentSlide.layout === 'split-left' ? 'pr-[45%]' : ''}
                          ${currentSlide.layout === 'split-right' ? 'pl-[45%]' : ''}
                        `}>
                          {processedSlide.title && (
                            <h3 className={`
                              text-3xl font-bold text-[#0a1628] mb-4
                              ${currentSlide.type === 'title' ? 'text-5xl' : ''}
                            `}>
                              {processedSlide.title}
                            </h3>
                          )}
                          {processedSlide.subtitle && (
                            <p className="text-xl text-[#e91e63] mb-6">
                              {processedSlide.subtitle}
                            </p>
                          )}
                          {processedSlide.content && (
                            <div className="text-gray-600 leading-relaxed">
                              {processedSlide.content}
                            </div>
                          )}

                          {/* Placeholder pour les éléments visuels */}
                          {!processedSlide.title && !processedSlide.subtitle && !processedSlide.content && (
                            <div className="flex flex-col items-center justify-center text-gray-300">
                              <FileText className="w-16 h-16 mb-4" />
                              <p>Contenu du slide</p>
                            </div>
                          )}
                        </div>

                        {/* Décoration visuelle selon le type */}
                        {currentSlide.layout === 'split-right' && (
                          <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-gradient-to-br from-[#0a1628] to-[#1a2642] flex items-center justify-center">
                            <div className="text-white/30 text-6xl">
                              {currentSlide.type === 'chart' && '📊'}
                              {currentSlide.type === 'image' && '🖼️'}
                              {currentSlide.type === 'team' && '👥'}
                              {currentSlide.type === 'references' && '⭐'}
                            </div>
                          </div>
                        )}
                        {currentSlide.layout === 'split-left' && (
                          <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-gradient-to-br from-[#0a1628] to-[#1a2642] flex items-center justify-center">
                            <div className="text-white/30 text-6xl">
                              {currentSlide.type === 'chart' && '📊'}
                              {currentSlide.type === 'image' && '🖼️'}
                              {currentSlide.type === 'team' && '👥'}
                              {currentSlide.type === 'references' && '⭐'}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </>
              ) : (
                /* Variables Tab */
                <div className="flex-1 overflow-y-auto p-6">
                  {template.defaultVariables.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <Info className="w-12 h-12 mb-4" />
                      <p className="text-lg font-medium">Aucune variable définie</p>
                      <p className="text-sm">Ce modèle ne contient pas de variables personnalisables.</p>
                    </div>
                  ) : (
                    <div className="max-w-2xl mx-auto">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-[#0a1628] mb-2">
                          Variables du modèle
                        </h3>
                        <p className="text-sm text-gray-500">
                          Personnalisez les valeurs par défaut des variables. Ces valeurs seront appliquées lors de l'utilisation du modèle.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {template.defaultVariables.map((variable) => (
                          <div
                            key={variable.key}
                            className="bg-white border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-medium text-[#0a1628]">
                                {variable.label}
                              </label>
                              <span className="text-xs text-gray-400 font-mono">
                                {'{{' + variable.key + '}}'}
                              </span>
                            </div>
                            <input
                              type={variable.type === 'number' ? 'number' : 'text'}
                              value={variableValues[variable.key] || ''}
                              onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e91e63] focus:border-transparent transition-all"
                              placeholder={variable.defaultValue}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              Type: {variable.type === 'text' && 'Texte'}
                              {variable.type === 'number' && 'Nombre'}
                              {variable.type === 'date' && 'Date'}
                              {variable.type === 'image' && 'Image'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="text-sm text-gray-500">
                {template.isCustom && template.author && (
                  <span>Créé par {template.author} • </span>
                )}
                Dernière mise à jour: {new Intl.DateTimeFormat('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }).format(template.updatedAt)}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#e91e63] text-white rounded-lg font-medium hover:bg-[#d81b60] transition-colors shadow-md shadow-[#e91e63]/20"
                >
                  <Check className="w-4 h-4" />
                  Appliquer ce modèle
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TemplatePreview;
