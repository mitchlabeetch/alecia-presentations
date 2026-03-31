'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FilePlus, 
  Type, 
  Users, 
  TrendingUp, 
  PieChart, 
  Calendar,
  Lightbulb,
  Zap,
  ChevronRight
} from 'lucide-react';
import { SuggestionChip } from './useAIChat';

interface SuggestionChipsProps {
  suggestions: SuggestionChip[];
  onSuggestionClick: (suggestion: SuggestionChip) => void;
  title?: string;
  showAll?: boolean;
  maxVisible?: number;
  variant?: 'default' | 'compact' | 'horizontal';
}

// Mapping des icônes selon le contenu de la suggestion
const getSuggestionIcon = (action: string) => {
  const lowerAction = action.toLowerCase();
  
  if (lowerAction.includes('présentation') || lowerAction.includes('créer')) {
    return <FilePlus className="w-4 h-4" />;
  }
  if (lowerAction.includes('titre') || lowerAction.includes('type')) {
    return <Type className="w-4 h-4" />;
  }
  if (lowerAction.includes('équipe') || lowerAction.includes('team')) {
    return <Users className="w-4 h-4" />;
  }
  if (lowerAction.includes('levée') || lowerAction.includes('fonds') || lowerAction.includes('trending')) {
    return <TrendingUp className="w-4 h-4" />;
  }
  if (lowerAction.includes('financier') || lowerAction.includes('financière') || lowerAction.includes('pie')) {
    return <PieChart className="w-4 h-4" />;
  }
  if (lowerAction.includes('timeline') || lowerAction.includes('chronologie') || lowerAction.includes('calendar')) {
    return <Calendar className="w-4 h-4" />;
  }
  if (lowerAction.includes('modèle') || lowerAction.includes('template')) {
    return <Lightbulb className="w-4 h-4" />;
  }
  
  return <Zap className="w-4 h-4" />;
};

// Animation container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Animation des items
const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  onSuggestionClick,
  title = 'Suggestions rapides',
  showAll = false,
  maxVisible = 6,
  variant = 'default',
}) => {
  const visibleSuggestions = showAll ? suggestions : suggestions.slice(0, maxVisible);

  // Variante compacte (chips plus petits)
  if (variant === 'compact') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2"
      >
        {visibleSuggestions.map((suggestion) => (
          <motion.button
            key={suggestion.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(233, 30, 99, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-3 py-1.5 text-xs bg-[#1a2744]/60 border border-[#e91e63]/20 
                       rounded-full text-gray-300 hover:text-white hover:border-[#e91e63]/50
                       transition-all flex items-center gap-1.5"
          >
            <span className="text-[#e91e63]">{getSuggestionIcon(suggestion.action)}</span>
            {suggestion.label}
          </motion.button>
        ))}
      </motion.div>
    );
  }

  // Variante horizontale (scrollable)
  if (variant === 'horizontal') {
    return (
      <div className="relative">
        {title && (
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            {title}
          </h4>
        )}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#e91e63]/30 
                     scrollbar-track-transparent"
        >
          {visibleSuggestions.map((suggestion) => (
            <motion.button
              key={suggestion.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(233, 30, 99, 0.15)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestionClick(suggestion)}
              className="flex-shrink-0 px-4 py-2.5 bg-[#1a2744]/80 border border-[#e91e63]/20 
                         rounded-xl text-sm text-gray-200 hover:text-white hover:border-[#e91e63]/50
                         transition-all flex items-center gap-2 min-w-fit"
            >
              <span className="text-[#e91e63]">{getSuggestionIcon(suggestion.action)}</span>
              {suggestion.label}
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            </motion.button>
          ))}
        </motion.div>
        {/* Gradient de fade sur la droite */}
        <div className="absolute right-0 top-6 bottom-0 w-12 bg-gradient-to-l from-[#0a1628] to-transparent pointer-events-none" />
      </div>
    );
  }

  // Variante par défaut (grille)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a1628]/50 border border-[#e91e63]/10 rounded-2xl p-4"
    >
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-[#e91e63]" />
          <h4 className="text-sm font-medium text-gray-300">{title}</h4>
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 gap-2"
      >
        {visibleSuggestions.map((suggestion) => (
          <motion.button
            key={suggestion.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02, 
              backgroundColor: 'rgba(233, 30, 99, 0.15)',
              borderColor: 'rgba(233, 30, 99, 0.5)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSuggestionClick(suggestion)}
            className="p-3 bg-[#1a2744]/60 border border-[#e91e63]/20 rounded-xl
                       text-left transition-all group hover:shadow-lg hover:shadow-[#e91e63]/10"
          >
            <div className="flex items-start gap-2">
              <span className="text-[#e91e63] mt-0.5 group-hover:scale-110 transition-transform">
                {getSuggestionIcon(suggestion.action)}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-200 group-hover:text-white block truncate">
                  {suggestion.label}
                </span>
                <span className="text-xs text-gray-500 mt-0.5 block line-clamp-1">
                  {suggestion.action.slice(0, 40)}...
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Bouton "Voir plus" si pas tout affiché */}
      {!showAll && suggestions.length > maxVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="w-full mt-3 py-2 text-sm text-[#e91e63] hover:text-[#f06292] 
                     flex items-center justify-center gap-1 transition-colors"
        >
          Voir plus de suggestions
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
};

// Composant pour les suggestions contextuelles (apparaissent après un message)
export const ContextualSuggestions: React.FC<{
  suggestions: SuggestionChip[];
  onSuggestionClick: (suggestion: SuggestionChip) => void;
  context?: string;
}> = ({ suggestions, onSuggestionClick, context }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3"
    >
      {context && (
        <p className="text-xs text-gray-500 mb-2">{context}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-3 py-1.5 text-xs bg-[#e91e63]/10 border border-[#e91e63]/30 
                       rounded-full text-[#e91e63] hover:bg-[#e91e63]/20 
                       hover:border-[#e91e63] transition-all"
          >
            {suggestion.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Composant pour les suggestions de templates
export const TemplateSuggestions: React.FC<{
  templates: Array<{ id: string; name: string; description: string; category: string }>;
  onTemplateSelect: (templateId: string) => void;
}> = ({ templates, onTemplateSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-[#e91e63]" />
        Modèles recommandés
      </h4>
      <div className="grid gap-2">
        {templates.map((template, index) => (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(233, 30, 99, 0.1)' }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onTemplateSelect(template.id)}
            className="p-3 bg-[#1a2744]/60 border border-[#e91e63]/20 rounded-xl
                       text-left transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-sm text-gray-200 group-hover:text-white block">
                {template.name}
              </span>
              <span className="text-xs text-gray-500">{template.description}</span>
            </div>
            <span className="text-xs px-2 py-1 bg-[#e91e63]/10 text-[#e91e63] rounded-full">
              {template.category}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default SuggestionChips;
