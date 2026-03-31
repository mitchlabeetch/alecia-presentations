import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Copy, Trash2, Eye, FileText, MoreVertical } from 'lucide-react';
import { Template, TemplateCategory, categoryLabels, categoryIcons } from './useTemplates';

interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  onApply: (template: Template) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  isSelected?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onApply,
  onToggleFavorite,
  onDuplicate,
  onDelete,
  isSelected = false
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Fermer le menu au clic extérieur
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getSlideCountLabel = (count: number) => {
    if (count === 1) return '1 slide';
    return `${count} slides`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`
        relative bg-white rounded-xl overflow-hidden shadow-sm border-2
        ${isSelected 
          ? 'border-[#e91e63] shadow-lg shadow-[#e91e63]/10' 
          : 'border-gray-100 hover:border-[#e91e63]/30 hover:shadow-md'
        }
        transition-all duration-200
      `}
    >
      {/* Miniature du template */}
      <div 
        className="relative aspect-[4/3] bg-gradient-to-br from-[#0a1628] to-[#1a2642] overflow-hidden cursor-pointer group"
        onClick={() => onPreview(template)}
      >
        {/* Aperçu stylisé des slides */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full h-full">
            {/* Slide principale */}
            <div className="absolute inset-0 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 transform rotate-1 transition-transform group-hover:rotate-2" />
            
            {/* Slide secondaire */}
            <div className="absolute inset-2 bg-white/5 rounded-lg border border-white/10 transform -rotate-1 transition-transform group-hover:-rotate-2" />
            
            {/* Contenu central */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
              <span className="text-3xl mb-2">{categoryIcons[template.category]}</span>
              <FileText className="w-8 h-8 opacity-50" />
            </div>
          </div>
        </div>

        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-[#0a1628]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#0a1628] rounded-full font-medium text-sm"
          >
            <Eye className="w-4 h-4" />
            Aperçu
          </motion.button>
        </div>

        {/* Badge favori */}
        {template.isFavorite && (
          <div className="absolute top-2 left-2">
            <span className="flex items-center gap-1 px-2 py-1 bg-[#e91e63] text-white text-xs rounded-full">
              <Heart className="w-3 h-3 fill-current" />
              Favori
            </span>
          </div>
        )}

        {/* Badge personnalisé */}
        {template.isCustom && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
              Personnalisé
            </span>
          </div>
        )}

        {/* Badge catégorie */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
            {categoryLabels[template.category]}
          </span>
        </div>
      </div>

      {/* Informations du template */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#0a1628] truncate" title={template.name}>
              {template.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2" title={template.description}>
              {template.description}
            </p>
          </div>

          {/* Menu d'actions */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-gray-400 hover:text-[#0a1628] hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10"
              >
                {template.isCustom && onDuplicate && (
                  <button
                    onClick={() => {
                      onDuplicate(template.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Copy className="w-4 h-4" />
                    Dupliquer
                  </button>
                )}
                <button
                  onClick={() => {
                    onToggleFavorite(template.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Heart className={`w-4 h-4 ${template.isFavorite ? 'fill-[#e91e63] text-[#e91e63]' : ''}`} />
                  {template.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </button>
                {template.isCustom && onDelete && (
                  <button
                    onClick={() => {
                      onDelete(template.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Métadonnées */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {getSlideCountLabel(template.slides.length)}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate(template.updatedAt)}
          </span>
        </div>

        {/* Bouton d'application */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onApply(template)}
          className="w-full mt-3 py-2 px-4 bg-[#0a1628] text-white rounded-lg font-medium text-sm hover:bg-[#1a2642] transition-colors flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Appliquer ce modèle
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TemplateCard;
