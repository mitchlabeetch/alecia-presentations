import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Briefcase, TrendingUp, Building2, Search } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { Template } from '@/types';

const CATEGORIES = [
  { id: 'cession_vente', label: 'Cession', icon: Briefcase },
  { id: 'lbo_levee_fonds', label: 'Levée de fonds', icon: TrendingUp },
  { id: 'acquisition_achats', label: 'Acquisition', icon: Building2 },
  { id: 'custom', label: 'Tous', icon: Sparkles },
];

const TEMPLATES: Template[] = [
  {
    id: 'tpl-cession-1',
    name: 'Pitch Cession Standard',
    description: 'Modèle complet pour une présentation de cession d\'entreprise',
    category: 'cession_vente',
    slides: [],
    isCustom: false,
    thumbnailPath: null,
    createdAt: Date.now(),
  },
  {
    id: 'tpl-lbo-1',
    name: 'Deck Levée de Fonds',
    description: 'Structure optimisée pour levées de capitaux',
    category: 'lbo_levee_fonds',
    slides: [],
    isCustom: false,
    thumbnailPath: null,
    createdAt: Date.now(),
  },
  {
    id: 'tpl-acquisition-1',
    name: 'Présentation Acquisition',
    description: 'Modèle pour analyser et présenter une acquisition',
    category: 'acquisition_achats',
    slides: [],
    isCustom: false,
    thumbnailPath: null,
    createdAt: Date.now(),
  },
  {
    id: 'tpl-mandat-1',
    name: 'Mandat de Conseil',
    description: 'Modèle pour mandate de conseil M&A',
    category: 'cession_vente',
    slides: [],
    isCustom: false,
    thumbnailPath: null,
    createdAt: Date.now(),
  },
];

export function Templates() {
  const navigate = useNavigate();
  const createProject = useAppStore((state) => state.createProject);
  const [selectedCategory, setSelectedCategory] = useState<string>('custom');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesCategory = selectedCategory === 'custom' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template: Template) => {
    const project = createProject(template.name);
    navigate(`/editor/${project.id}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-alecia-navy" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-alecia-navy">Modèles de présentation</h1>
          <p className="text-alecia-silver mt-1">
            Démarrez rapidement avec nos modèles prédéfinis
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-2">
          <h3 className="font-semibold text-alecia-navy mb-4">Catégories</h3>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-alecia-navy text-white'
                    : 'hover:bg-alecia-silver/10 text-alecia-navy'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-alecia-silver" />
              <input
                type="text"
                placeholder="Rechercher un modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="alecia-input pl-10 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-modal transition-all border border-alecia-silver/10"
              >
                <div className="bg-alecia-silver/5 rounded-lg h-32 mb-4 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-alecia-silver/30" />
                </div>
                <h3 className="font-semibold text-alecia-navy mb-2">{template.name}</h3>
                <p className="text-sm text-alecia-silver mb-4">{template.description}</p>
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="alecia-btn-primary w-full"
                >
                  Utiliser ce modèle
                </button>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-alecia-silver/30 mx-auto mb-4" />
              <p className="text-alecia-silver">Aucun modèle trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
