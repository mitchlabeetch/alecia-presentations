import { useState, useCallback } from 'react';
import { Check, Layers } from 'lucide-react';
import type { Template } from '@/types';

interface TemplateSelectorProps {
  category?: string;
  selectedTemplateId: string | null;
  onSelectTemplate: (template: Template | null) => void;
}

const STATIC_TEMPLATES: Template[] = [
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
  {
    id: 'tpl-strategie-1',
    name: 'Note de Stratégie',
    description: 'Analyse stratégique et plan d\'action',
    category: 'custom',
    slides: [],
    isCustom: false,
    thumbnailPath: null,
    createdAt: Date.now(),
  },
  {
    id: 'tpl-comite-1',
    name: 'Note au Comité',
    description: 'Présentation pour comité d\'investissement',
    category: 'lbo_levee_fonds',
    slides: [],
    isCustom: false,
    thumbnailPath: null,
    createdAt: Date.now(),
  },
];

export function TemplateSelector({
  category,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const templates = category && category !== 'custom'
    ? STATIC_TEMPLATES.filter(t => t.category === category)
    : STATIC_TEMPLATES;

  const [hoveredTemplate, setHoveredTemplate] = useState<Template | null>(null);

  const handleSelect = useCallback(
    (template: Template) => {
      if (selectedTemplateId === template.id) {
        onSelectTemplate(null);
      } else {
        onSelectTemplate(template);
      }
    },
    [selectedTemplateId, onSelectTemplate]
  );

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <Layers className="w-12 h-12 mx-auto text-alecia-silver/50" />
        <p className="mt-4 text-alecia-silver">
          Aucun modèle disponible pour cette catégorie
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          const isHovered = hoveredTemplate?.id === template.id;

          return (
            <button
              key={template.id}
              onClick={() => handleSelect(template)}
              onMouseEnter={() => setHoveredTemplate(template)}
              onMouseLeave={() => setHoveredTemplate(null)}
              className={`relative rounded-xl overflow-hidden transition-all text-left ${
                isSelected
                  ? 'ring-2 ring-alecia-red ring-offset-2'
                  : 'hover:shadow-lg'
              }`}
            >
              <div className="aspect-video bg-gradient-to-br from-alecia-navy to-[#0a2a68] relative">
                {template.thumbnailPath ? (
                  <img
                    src={template.thumbnailPath}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl font-bold text-white/20">
                      {template.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-alecia-red rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {isHovered && !isSelected && (
                  <div className="absolute inset-0 bg-alecia-navy/60 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {template.slides.length} slide{template.slides.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-white">
                <h4 className="font-medium text-alecia-navy text-sm truncate">
                  {template.name}
                </h4>
                <p className="mt-1 text-xs text-alecia-silver line-clamp-2">
                  {template.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {hoveredTemplate && (
        <div className="bg-alecia-silver/5 rounded-xl p-4">
          <h4 className="font-medium text-alecia-navy">
            {hoveredTemplate.name}
          </h4>
          <p className="mt-1 text-sm text-alecia-silver">
            {hoveredTemplate.description}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-alecia-silver">
            <span>{hoveredTemplate.slides.length} slides</span>
            <span>
              Créé le{' '}
              {new Date(hoveredTemplate.createdAt).toLocaleDateString('fr-FR')}
            </span>
            {hoveredTemplate.isCustom && (
              <span className="px-2 py-0.5 bg-alecia-navy/10 rounded text-alecia-navy">
                Personnalisé
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
