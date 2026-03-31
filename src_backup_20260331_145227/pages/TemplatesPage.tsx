/**
 * Page de la bibliothèque de templates
 * Affiche tous les templates disponibles avec catégories
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Star,
  Clock,
  FileText,
  LayoutTemplate,
  TrendingUp,
  Building2,
  PieChart,
  Users,
  Briefcase,
  MoreHorizontal,
  Check,
  Heart,
} from 'lucide-react';
import useStore from '@store/index';
import type { Template, TemplateCategory } from '@types/index';

/**
 * Catégories de templates avec icônes
 */
const CATEGORIES: { id: TemplateCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'Tous', icon: LayoutTemplate },
  { id: 'pitch_deck', label: 'Pitch Deck', icon: TrendingUp },
  { id: 'financial', label: 'Financier', icon: PieChart },
  { id: 'ma', label: 'M&A', icon: Building2 },
  { id: 'reporting', label: 'Reporting', icon: FileText },
  { id: 'internal', label: 'Interne', icon: Users },
  { id: 'custom', label: 'Personnalisé', icon: Briefcase },
];

/**
 * Données de démonstration des templates
 */
const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Pitch Deck Investisseurs',
    description: 'Template professionnel pour les levées de fonds',
    category: 'pitch_deck',
    slides: [],
    variables: {},
    settings: {
      theme: 'alecia',
      aspectRatio: '16:9',
      defaultFont: 'Inter',
      showSlideNumbers: true,
      showFooter: true,
      footerText: 'Confidentiel',
    },
    isDefault: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Analyse M&A',
    description: 'Présentation complète pour les fusions-acquisitions',
    category: 'ma',
    slides: [],
    variables: {},
    settings: {
      theme: 'alecia',
      aspectRatio: '16:9',
      defaultFont: 'Inter',
      showSlideNumbers: true,
      showFooter: true,
    },
    isDefault: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Rapport Financier Trimestriel',
    description: 'Template pour les rapports financiers et KPIs',
    category: 'financial',
    slides: [],
    variables: {},
    settings: {
      theme: 'alecia',
      aspectRatio: '16:9',
      defaultFont: 'Inter',
      showSlideNumbers: true,
      showFooter: true,
    },
    isDefault: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Réunion d\'équipe',
    description: 'Template simple pour les réunions internes',
    category: 'internal',
    slides: [],
    variables: {},
    settings: {
      theme: 'alecia',
      aspectRatio: '16:9',
      defaultFont: 'Inter',
      showSlideNumbers: false,
      showFooter: false,
    },
    isDefault: false,
    createdBy: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Due Diligence',
    description: 'Structure complète pour les dossiers de due diligence',
    category: 'ma',
    slides: [],
    variables: {},
    settings: {
      theme: 'alecia',
      aspectRatio: '16:9',
      defaultFont: 'Inter',
      showSlideNumbers: true,
      showFooter: true,
      footerText: 'Strictement confidentiel',
    },
    isDefault: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Business Plan',
    description: 'Template pour présenter un business plan complet',
    category: 'pitch_deck',
    slides: [],
    variables: {},
    settings: {
      theme: 'alecia',
      aspectRatio: '16:9',
      defaultFont: 'Inter',
      showSlideNumbers: true,
      showFooter: true,
    },
    isDefault: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Carte de template
 */
const TemplateCard: React.FC<{
  template: Template;
  onUse: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}> = ({ template, onUse, isFavorite, onToggleFavorite }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-dark overflow-hidden group"
    >
      {/* Aperçu */}
      <div className="aspect-video bg-alecia-navy relative overflow-hidden">
        {/* Filigrane */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl font-bold text-alecia-navy-light/20">&</span>
        </div>

        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-alecia-pink/0 group-hover:bg-alecia-pink/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={onUse}
            className="px-6 py-3 bg-alecia-pink text-white rounded-lg font-medium shadow-alecia-pink hover:bg-alecia-pink-dark transition-colors"
          >
            Utiliser ce template
          </button>
        </div>

        {/* Badge favori */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
            isFavorite
              ? 'bg-alecia-pink text-white'
              : 'bg-alecia-navy/80 text-alecia-gray-400 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Badge par défaut */}
        {template.isDefault && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-alecia-pink/80 text-white text-xs font-medium rounded">
              Officiel
            </span>
          </div>
        )}
      </div>

      {/* Informations */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-white font-semibold">{template.name}</h3>
            <p className="text-alecia-gray-400 text-sm mt-1">
              {template.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4 text-alecia-gray-500 text-xs">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {template.slides.length || 12} slides
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {template.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Page des templates
 */
const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { createPresentation } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Filtrer les templates
  const filteredTemplates = MOCK_TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || favorites.includes(template.id);
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const handleUseTemplate = (template: Template) => {
    const newPresentation = createPresentation(template.name, template.id);
    navigate(`/editor/${newPresentation.id}`);
  };

  const toggleFavorite = (templateId: string) => {
    setFavorites((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId]
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Bibliothèque de templates</h1>
          <p className="text-alecia-gray-400 mt-1">
            Choisissez un template pour démarrer votre présentation
          </p>
        </div>
        <button
          onClick={() => navigate('/presentations')}
          className="btn-secondary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Présentation vierge
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
            placeholder="Rechercher un template..."
            className="w-full pl-12 pr-4 py-3 bg-alecia-navy-light border border-alecia-navy-lighter/50 rounded-lg text-white placeholder:text-alecia-gray-500 focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none"
          />
        </div>

        {/* Filtre favoris */}
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
            showFavoritesOnly
              ? 'bg-alecia-pink/20 border-alecia-pink text-alecia-pink'
              : 'bg-alecia-navy-light border-alecia-navy-lighter/50 text-alecia-gray-300 hover:text-white'
          }`}
        >
          <Star className={`w-5 h-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          Favoris
        </button>
      </div>

      {/* Catégories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isSelected
                  ? 'bg-alecia-pink text-white'
                  : 'bg-alecia-navy-light text-alecia-gray-300 hover:text-white hover:bg-alecia-navy-lighter'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Résultats */}
      {filteredTemplates.length === 0 ? (
        <div className="card-dark p-12 text-center">
          <div className="w-16 h-16 bg-alecia-navy rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutTemplate className="w-8 h-8 text-alecia-gray-500" />
          </div>
          <h3 className="text-white font-semibold mb-2">
            Aucun template trouvé
          </h3>
          <p className="text-alecia-gray-400">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUse={() => handleUseTemplate(template)}
              isFavorite={favorites.includes(template.id)}
              onToggleFavorite={() => toggleFavorite(template.id)}
            />
          ))}
        </div>
      )}

      {/* Section templates personnalisés */}
      <div className="pt-8 border-t border-alecia-navy-lighter/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Mes templates personnalisés</h2>
            <p className="text-alecia-gray-400 text-sm mt-1">
              Templates que vous avez créés à partir de vos présentations
            </p>
          </div>
        </div>

        <div className="card-dark p-8 text-center">
          <div className="w-16 h-16 bg-alecia-navy rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-alecia-gray-500" />
          </div>
          <h3 className="text-white font-semibold mb-2">
            Aucun template personnalisé
          </h3>
          <p className="text-alecia-gray-400 mb-4">
            Sauvegardez une présentation comme template pour la réutiliser
          </p>
          <button
            onClick={() => navigate('/presentations')}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Créer un template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
