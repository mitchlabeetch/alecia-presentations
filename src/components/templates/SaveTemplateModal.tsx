import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  FolderOpen, 
  FileText, 
  Tag,
  AlertCircle,
  Check,
  Loader2
} from 'lucide-react';
import { TemplateCategory, categoryLabels, categoryIcons, TemplateVariable } from './useTemplates';

interface Slide {
  id: string;
  type: string;
  title?: string;
  content?: string;
  layout: string;
}

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: {
    name: string;
    description: string;
    category: TemplateCategory;
    slides: Slide[];
    defaultVariables: TemplateVariable[];
  }) => void;
  slides: Slide[];
  existingTemplateNames?: string[];
}

const categories: TemplateCategory[] = [
  'pitch-deck',
  'levee-fonds',
  'cession',
  'acquisition',
  'financements-structures',
  'rapport',
  'equipe',
  'references'
];

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  slides,
  existingTemplateNames = []
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('pitch-deck');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Extraire les variables potentielles des slides
  const extractVariables = useCallback((): TemplateVariable[] => {
    const variableMap = new Map<string, { defaultValue: string; occurrences: number }>();
    const variableRegex = /\{\{(\w+)\}\}/g;

    slides.forEach(slide => {
      const content = `${slide.title || ''} ${slide.content || ''}`;
      let match;
      while ((match = variableRegex.exec(content)) !== null) {
        const key = match[1];
        if (!variableMap.has(key)) {
          variableMap.set(key, { defaultValue: match[0], occurrences: 0 });
        }
        variableMap.get(key)!.occurrences++;
      }
    });

    return Array.from(variableMap.entries()).map(([key]) => ({
      key,
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      defaultValue: '',
      type: 'text' as const
    }));
  }, [slides]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom du modèle est requis';
    } else if (name.length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    } else if (name.length > 50) {
      newErrors.name = 'Le nom ne doit pas dépasser 50 caractères';
    } else if (existingTemplateNames.includes(name.trim())) {
      newErrors.name = 'Un modèle avec ce nom existe déjà';
    }

    if (!description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    } else if (description.length > 200) {
      newErrors.description = 'La description ne doit pas dépasser 200 caractères';
    }

    if (slides.length === 0) {
      newErrors.slides = 'La présentation doit contenir au moins un slide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Simuler un délai de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 800));

    const variables = extractVariables();

    onSave({
      name: name.trim(),
      description: description.trim(),
      category,
      slides,
      defaultVariables: variables
    });

    setIsSubmitting(false);
    setShowSuccess(true);

    // Réinitialiser et fermer après le succès
    setTimeout(() => {
      setShowSuccess(false);
      setName('');
      setDescription('');
      setCategory('pitch-deck');
      setErrors({});
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName('');
      setDescription('');
      setCategory('pitch-deck');
      setErrors({});
      onClose();
    }
  };

  const detectedVariables = extractVariables();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e91e63]/10 rounded-full flex items-center justify-center">
                  <Save className="w-5 h-5 text-[#e91e63]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#0a1628]">
                    Enregistrer comme modèle
                  </h2>
                  <p className="text-sm text-gray-500">
                    Sauvegardez cette présentation pour la réutiliser
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success State */}
            {showSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                >
                  <Check className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[#0a1628] mb-2">
                  Modèle enregistré !
                </h3>
                <p className="text-gray-500 text-center">
                  Votre modèle "{name}" a été sauvegardé avec succès.
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Nom du modèle */}
                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Nom du modèle <span className="text-[#e91e63]">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) {
                            setErrors(prev => ({ ...prev, name: '' }));
                          }
                        }}
                        placeholder="Ex: Pitch Deck Startup Tech"
                        className={`
                          w-full pl-10 pr-4 py-2.5 border rounded-lg transition-all
                          ${errors.name
                            ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                            : 'border-gray-300 focus:ring-2 focus:ring-[#e91e63]/20 focus:border-[#e91e63]'
                          }
                        `}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Description <span className="text-[#e91e63]">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) {
                          setErrors(prev => ({ ...prev, description: '' }));
                        }
                      }}
                      placeholder="Décrivez ce modèle et son utilisation prévue..."
                      rows={3}
                      className={`
                        w-full px-4 py-2.5 border rounded-lg transition-all resize-none
                        ${errors.description
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                          : 'border-gray-300 focus:ring-2 focus:ring-[#e91e63]/20 focus:border-[#e91e63]'
                        }
                      `}
                      disabled={isSubmitting}
                    />
                    <div className="flex items-center justify-between mt-1.5">
                      {errors.description ? (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.description}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span className={`text-xs ${description.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                        {description.length}/200
                      </span>
                    </div>
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Catégorie <span className="text-[#e91e63]">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`
                            flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all
                            ${category === cat
                              ? 'border-[#e91e63] bg-[#e91e63]/5 text-[#0a1628]'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                            }
                          `}
                          disabled={isSubmitting}
                        >
                          <span className="text-lg">{categoryIcons[cat]}</span>
                          <span className="text-sm font-medium truncate">
                            {categoryLabels[cat]}
                          </span>
                          {category === cat && (
                            <Check className="w-4 h-4 text-[#e91e63] ml-auto flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Résumé des slides */}
                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Contenu de la présentation
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <FolderOpen className="w-4 h-4" />
                        <span>{slides.length} slide{slides.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {slides.map((slide, index) => (
                          <div
                            key={slide.id}
                            className="flex items-center gap-2 text-sm text-gray-500"
                          >
                            <span className="w-5 h-5 bg-gray-200 rounded text-xs flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="truncate">
                              {slide.title || `Slide ${index + 1}`}
                            </span>
                          </div>
                        ))}
                      </div>
                      {errors.slides && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.slides}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Variables détectées */}
                  {detectedVariables.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">
                        Variables détectées
                      </label>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                          <Tag className="w-4 h-4" />
                          <span>{detectedVariables.length} variable{detectedVariables.length > 1 ? 's' : ''} trouvée{detectedVariables.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {detectedVariables.map((variable) => (
                            <span
                              key={variable.key}
                              className="px-2 py-1 bg-white text-blue-700 text-xs rounded border border-blue-200 font-mono"
                            >
                              {'{{' + variable.key + '}}'}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-blue-500 mt-2">
                          Ces variables seront remplaçables lors de l'utilisation du modèle.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#e91e63] text-white rounded-lg font-medium hover:bg-[#d81b60] transition-colors shadow-md shadow-[#e91e63]/20 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Enregistrer le modèle
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SaveTemplateModal;
