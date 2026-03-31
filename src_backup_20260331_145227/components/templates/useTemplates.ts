import { useState, useCallback, useMemo } from 'react';

// Types pour le système de templates
export type TemplateCategory = 
  | 'pitch-deck' 
  | 'levee-fonds' 
  | 'cession' 
  | 'acquisition' 
  | 'financements-structures' 
  | 'rapport' 
  | 'equipe' 
  | 'references'
  | 'custom';

export interface TemplateVariable {
  key: string;
  label: string;
  defaultValue: string;
  type: 'text' | 'number' | 'date' | 'image';
}

export interface SlideContent {
  id: string;
  type: 'title' | 'content' | 'split' | 'image' | 'chart' | 'table' | 'team' | 'references';
  title?: string;
  subtitle?: string;
  content?: string;
  layout: 'full' | 'split-left' | 'split-right' | 'centered';
  background?: string;
  variables?: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail?: string;
  slides: SlideContent[];
  defaultVariables: TemplateVariable[];
  isFavorite: boolean;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
  author?: string;
}

export interface TemplateFilters {
  search: string;
  category: TemplateCategory | 'all';
  favoritesOnly: boolean;
  customOnly: boolean;
}

// Templates prédéfinis Alecia
export const defaultTemplates: Template[] = [
  {
    id: 'pitch-deck-classic',
    name: 'Pitch Deck Classique',
    description: 'Template professionnel pour présentations client avec slides de titre, problème, solution, marché et appel à l\'action.',
    category: 'pitch-deck',
    thumbnail: '/templates/pitch-deck-thumb.jpg',
    isFavorite: false,
    isCustom: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        layout: 'centered',
        title: '{{companyName}}',
        subtitle: '{{tagline}}',
        variables: ['companyName', 'tagline']
      },
      {
        id: 'slide-2',
        type: 'content',
        layout: 'full',
        title: 'Le Problème',
        content: '{{problemDescription}}',
        variables: ['problemDescription']
      },
      {
        id: 'slide-3',
        type: 'content',
        layout: 'full',
        title: 'Notre Solution',
        content: '{{solutionDescription}}',
        variables: ['solutionDescription']
      },
      {
        id: 'slide-4',
        type: 'chart',
        layout: 'split-right',
        title: 'Marché Adressable',
        content: '{{marketData}}',
        variables: ['marketData']
      },
      {
        id: 'slide-5',
        type: 'content',
        layout: 'centered',
        title: 'Contactez-nous',
        content: '{{contactInfo}}',
        variables: ['contactInfo']
      }
    ],
    defaultVariables: [
      { key: 'companyName', label: 'Nom de l\'entreprise', defaultValue: 'Votre Société', type: 'text' },
      { key: 'tagline', label: 'Slogan', defaultValue: 'Votre proposition de valeur', type: 'text' },
      { key: 'problemDescription', label: 'Description du problème', defaultValue: 'Décrivez le problème que vous résolvez...', type: 'text' },
      { key: 'solutionDescription', label: 'Description de la solution', defaultValue: 'Expliquez votre solution innovante...', type: 'text' },
      { key: 'marketData', label: 'Données de marché', defaultValue: 'TAM, SAM, SOM...', type: 'text' },
      { key: 'contactInfo', label: 'Informations de contact', defaultValue: 'contact@entreprise.com', type: 'text' }
    ]
  },
  {
    id: 'levee-fonds-pro',
    name: 'Levée de Fonds Pro',
    description: 'Template complet pour levée de fonds incluant business model, traction, équipe et projections financières.',
    category: 'levee-fonds',
    thumbnail: '/templates/levee-fonds-thumb.jpg',
    isFavorite: false,
    isCustom: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        layout: 'centered',
        title: '{{companyName}}',
        subtitle: 'Levée de fonds - {{fundingRound}}',
        variables: ['companyName', 'fundingRound']
      },
      {
        id: 'slide-2',
        type: 'content',
        layout: 'full',
        title: 'Vision & Mission',
        content: '{{visionMission}}',
        variables: ['visionMission']
      },
      {
        id: 'slide-3',
        type: 'chart',
        layout: 'split-left',
        title: 'Traction & Croissance',
        content: '{{tractionMetrics}}',
        variables: ['tractionMetrics']
      },
      {
        id: 'slide-4',
        type: 'table',
        layout: 'full',
        title: 'Business Model',
        content: '{{businessModel}}',
        variables: ['businessModel']
      },
      {
        id: 'slide-5',
        type: 'team',
        layout: 'full',
        title: 'Notre Équipe',
        content: '{{teamMembers}}',
        variables: ['teamMembers']
      },
      {
        id: 'slide-6',
        type: 'chart',
        layout: 'split-right',
        title: 'Projections Financières',
        content: '{{financialProjections}}',
        variables: ['financialProjections']
      },
      {
        id: 'slide-7',
        type: 'content',
        layout: 'full',
        title: 'Utilisation des Fonds',
        content: '{{fundUsage}}',
        variables: ['fundUsage']
      }
    ],
    defaultVariables: [
      { key: 'companyName', label: 'Nom de l\'entreprise', defaultValue: 'Startup XYZ', type: 'text' },
      { key: 'fundingRound', label: 'Tour de financement', defaultValue: 'Série A', type: 'text' },
      { key: 'visionMission', label: 'Vision et Mission', defaultValue: 'Notre vision est de...', type: 'text' },
      { key: 'tractionMetrics', label: 'Métriques de traction', defaultValue: 'Revenus, utilisateurs, croissance...', type: 'text' },
      { key: 'businessModel', label: 'Business Model', defaultValue: 'Description du modèle économique...', type: 'text' },
      { key: 'teamMembers', label: 'Membres de l\'équipe', defaultValue: 'Présentation des fondateurs...', type: 'text' },
      { key: 'financialProjections', label: 'Projections financières', defaultValue: 'Revenus sur 5 ans...', type: 'text' },
      { key: 'fundUsage', label: 'Utilisation des fonds', defaultValue: 'Répartition du budget...', type: 'text' }
    ]
  },
  {
    id: 'cession-entreprise',
    name: 'Cession d\'Entreprise',
    description: 'Template structuré pour la présentation d\'une cession d\'entreprise avec valorisation et due diligence.',
    category: 'cession',
    thumbnail: '/templates/cession-thumb.jpg',
    isFavorite: false,
    isCustom: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        layout: 'centered',
        title: 'Opportunité de Cession',
        subtitle: '{{companyName}}',
        variables: ['companyName']
      },
      {
        id: 'slide-2',
        type: 'content',
        layout: 'full',
        title: 'Présentation de la Société',
        content: '{{companyOverview}}',
        variables: ['companyOverview']
      },
      {
        id: 'slide-3',
        type: 'chart',
        layout: 'split-right',
        title: 'Historique Financier',
        content: '{{financialHistory}}',
        variables: ['financialHistory']
      },
      {
        id: 'slide-4',
        type: 'table',
        layout: 'full',
        title: 'Valorisation',
        content: '{{valuationDetails}}',
        variables: ['valuationDetails']
      },
      {
        id: 'slide-5',
        type: 'content',
        layout: 'split-left',
        title: 'Points Forts',
        content: '{{keyStrengths}}',
        variables: ['keyStrengths']
      },
      {
        id: 'slide-6',
        type: 'content',
        layout: 'full',
        title: 'Processus de Cession',
        content: '{{saleProcess}}',
        variables: ['saleProcess']
      }
    ],
    defaultVariables: [
      { key: 'companyName', label: 'Nom de l\'entreprise', defaultValue: 'Société ABC', type: 'text' },
      { key: 'companyOverview', label: 'Présentation de la société', defaultValue: 'Historique, activité, positionnement...', type: 'text' },
      { key: 'financialHistory', label: 'Historique financier', defaultValue: 'CA, EBITDA, résultats sur 3 ans...', type: 'text' },
      { key: 'valuationDetails', label: 'Détails de valorisation', defaultValue: 'Méthodes et résultats...', type: 'text' },
      { key: 'keyStrengths', label: 'Points forts', defaultValue: 'Atouts stratégiques...', type: 'text' },
      { key: 'saleProcess', label: 'Processus de cession', defaultValue: 'Calendrier et étapes...', type: 'text' }
    ]
  },
  {
    id: 'acquisition-strategique',
    name: 'Acquisition Stratégique',
    description: 'Template pour présenter une opportunité d\'acquisition avec analyse stratégique et synergies.',
    category: 'acquisition',
    thumbnail: '/templates/acquisition-thumb.jpg',
    isFavorite: false,
    isCustom: false,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        layout: 'centered',
        title: 'Projet d\'Acquisition',
        subtitle: '{{targetCompany}}',
        variables: ['targetCompany']
      },
      {
        id: 'slide-2',
        type: 'content',
        layout: 'full',
        title: 'Profil de la Cible',
        content: '{{targetProfile}}',
        variables: ['targetProfile']
      },
      {
        id: 'slide-3',
        type: 'content',
        layout: 'split-left',
        title: 'Rationale Stratégique',
        content: '{{strategicRationale}}',
        variables: ['strategicRationale']
      },
      {
        id: 'slide-4',
        type: 'chart',
        layout: 'split-right',
        title: 'Synergies Attendues',
        content: '{{synergies}}',
        variables: ['synergies']
      },
      {
        id: 'slide-5',
        type: 'table',
        layout: 'full',
        title: 'Structure de l\'Opération',
        content: '{{dealStructure}}',
        variables: ['dealStructure']
      },
      {
        id: 'slide-6',
        type: 'content',
        layout: 'full',
        title: 'Plan d\'Intégration',
        content: '{{integrationPlan}}',
        variables: ['integrationPlan']
      }
    ],
    defaultVariables: [
      { key: 'targetCompany', label: 'Société cible', defaultValue: 'Cible XYZ', type: 'text' },
      { key: 'targetProfile', label: 'Profil de la cible', defaultValue: 'Description de l\'entreprise cible...', type: 'text' },
      { key: 'strategicRationale', label: 'Rationale stratégique', defaultValue: 'Pourquoi cette acquisition ?', type: 'text' },
      { key: 'synergies', label: 'Synergies', defaultValue: 'Synergies opérationnelles et financières...', type: 'text' },
      { key: 'dealStructure', label: 'Structure de l\'opération', defaultValue: 'Prix, modalités, financement...', type: 'text' },
      { key: 'integrationPlan', label: 'Plan d\'intégration', defaultValue: 'Étapes et calendrier...', type: 'text' }
    ]
  },
  {
    id: 'financements-structures',
    name: 'Financements Structurés',
    description: 'Template pour présentations de financements complexes : LBO, project finance, dette structurée.',
    category: 'financements-structures',
    thumbnail: '/templates/financements-thumb.jpg',
    isFavorite: false,
    isCustom: false,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        layout: 'centered',
        title: 'Financement Structuré',
        subtitle: '{{projectName}}',
        variables: ['projectName']
      },
      {
        id: 'slide-2',
        type: 'content',
        layout: 'full',
        title: 'Structure du Financement',
        content: '{{financingStructure}}',
        variables: ['financingStructure']
      },
      {
        id: 'slide-3',
        type: 'table',
        layout: 'full',
        title: 'Tableau de Financement',
        content: '{{financingTable}}',
        variables: ['financingTable']
      },
      {
        id: 'slide-4',
        type: 'chart',
        layout: 'split-right',
        title: 'Cash Flows Projetés',
        content: '{{projectedCashflows}}',
        variables: ['projectedCashflows']
      },
      {
        id: 'slide-5',
        type: 'content',
        layout: 'split-left',
        title: 'Sécurisations',
        content: '{{securityPackage}}',
        variables: ['securityPackage']
      },
      {
        id: 'slide-6',
        type: 'content',
        layout: 'full',
        title: 'Analyse de Risque',
        content: '{{riskAnalysis}}',
        variables: ['riskAnalysis']
      }
    ],
    defaultVariables: [
      { key: 'projectName', label: 'Nom du projet', defaultValue: 'Projet Alpha', type: 'text' },
      { key: 'financingStructure', label: 'Structure du financement', defaultValue: 'Détails de la structure...', type: 'text' },
      { key: 'financingTable', label: 'Tableau de financement', defaultValue: 'Sources et emplois...', type: 'text' },
      { key: 'projectedCashflows', label: 'Cash flows projetés', defaultValue: 'Prévisions de remboursement...', type: 'text' },
      { key: 'securityPackage', label: 'Sécurisations', defaultValue: 'Gages et garanties...', type: 'text' },
      { key: 'riskAnalysis', label: 'Analyse de risque', defaultValue: 'Risques et mitigations...', type: 'text' }
    ]
  },
  {
    id: 'rapport-standard',
    name: 'Rapport Standard',
    description: 'Template polyvalent pour rapports financiers, analyses de marché et notes de synthèse.',
    category: 'rapport',
    thumbnail: '/templates/rapport-thumb.jpg',
    isFavorite: false,
    isCustom: false,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        layout: 'centered',
        title: '{{reportTitle}}',
        subtitle: '{{reportSubtitle}}',
        variables: ['reportTitle', 'reportSubtitle']
      },
      {
        id: 'slide-2',
        type: 'content',
        layout: 'full',
        title: 'Executive Summary',
        content: '{{executiveSummary}}',
        variables: ['executiveSummary']
      },
      {
        id: 'slide-3',
        type: 'content',
        layout: 'full',
        title: 'Contexte et Objectifs',
        content: '{{contextObjectives}}',
        variables: ['contextObjectives']
      },
      {
        id: 'slide-4',
        type: 'chart',
        layout: 'split-left',
        title: 'Analyse et Données',
        content: '{{analysisData}}',
        variables: ['analysisData']
      },
      {
        id: 'slide-5',
        type: 'content',
        layout: 'full',
        title: 'Recommandations',
        content: '{{recommendations}}',
        variables: ['recommendations']
      },
      {
        id: 'slide-6',
        type: 'content',
        layout: 'full',
        title: 'Conclusion',
        content: '{{conclusion}}',
        variables: ['conclusion']
      }
    ],
    defaultVariables: [
      { key: 'reportTitle', label: 'Titre du rapport', defaultValue: 'Rapport d\'Analyse', type: 'text' },
      { key: 'reportSubtitle', label: 'Sous-titre', defaultValue: 'Période d\'analyse', type: 'text' },
      { key: 'executiveSummary', label: 'Executive Summary', defaultValue: 'Synthèse des points clés...', type: 'text' },
      { key: 'contextObjectives', label: 'Contexte et objectifs', defaultValue: 'Cadre de l\'étude...', type: 'text' },
      { key: 'analysisData', label: 'Analyse et données', defaultValue: 'Résultats de l\'analyse...', type: 'text' },
      { key: 'recommendations', label: 'Recommandations', defaultValue: 'Actions recommandées...', type: 'text' },
      { key: 'conclusion', label: 'Conclusion', defaultValue: 'Conclusion générale...', type: 'text' }
    ]
  },
  {
    id: 'equipe-corporate',
    name: 'Présentation Équipe',
    description: 'Template pour présenter l\'équipe dirigeante, les experts et les collaborateurs clés.',
    category: 'equipe',
    thumbnail: '/templates/equipe-thumb.jpg',
    isFavorite: false,
    isCustom: false,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        layout: 'centered',
        title: 'Notre Équipe',
        subtitle: '{{companyName}}',
        variables: ['companyName']
      },
      {
        id: 'slide-2',
        type: 'team',
        layout: 'full',
        title: 'Direction Générale',
        content: '{{leadershipTeam}}',
        variables: ['leadershipTeam']
      },
      {
        id: 'slide-3',
        type: 'team',
        layout: 'full',
        title: 'Équipe Commerciale',
        content: '{{salesTeam}}',
        variables: ['salesTeam']
      },
      {
        id: 'slide-4',
        type: 'content',
        layout: 'split-right',
        title: 'Notre Culture',
        content: '{{companyCulture}}',
        variables: ['companyCulture']
      },
      {
        id: 'slide-5',
        type: 'content',
        layout: 'full',
        title: 'Nous Rejoindre',
        content: '{{joinUs}}',
        variables: ['joinUs']
      }
    ],
    defaultVariables: [
      { key: 'companyName', label: 'Nom de l\'entreprise', defaultValue: 'Notre Entreprise', type: 'text' },
      { key: 'leadershipTeam', label: 'Équipe de direction', defaultValue: 'Présentation des dirigeants...', type: 'text' },
      { key: 'salesTeam', label: 'Équipe commerciale', defaultValue: 'Présentation commerciale...', type: 'text' },
      { key: 'companyCulture', label: 'Culture d\'entreprise', defaultValue: 'Nos valeurs et notre culture...', type: 'text' },
      { key: 'joinUs', label: 'Nous rejoindre', defaultValue: 'Opportunités de carrière...', type: 'text' }
    ]
  },
  {
    id: 'references-clients',
    name: 'Références Clients',
    description: 'Template pour présenter le portefeuille clients, les études de cas et les témoignages.',
    category: 'references',
    thumbnail: '/templates/references-thumb.jpg',
    isFavorite: false,
    isCustom: false,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        layout: 'centered',
        title: 'Nos Références',
        subtitle: 'Clients et Partenaires',
        variables: []
      },
      {
        id: 'slide-2',
        type: 'references',
        layout: 'full',
        title: 'Portefeuille Clients',
        content: '{{clientPortfolio}}',
        variables: ['clientPortfolio']
      },
      {
        id: 'slide-3',
        type: 'content',
        layout: 'split-left',
        title: 'Étude de Cas 1',
        content: '{{caseStudy1}}',
        variables: ['caseStudy1']
      },
      {
        id: 'slide-4',
        type: 'content',
        layout: 'split-right',
        title: 'Étude de Cas 2',
        content: '{{caseStudy2}}',
        variables: ['caseStudy2']
      },
      {
        id: 'slide-5',
        type: 'content',
        layout: 'full',
        title: 'Témoignages',
        content: '{{testimonials}}',
        variables: ['testimonials']
      }
    ],
    defaultVariables: [
      { key: 'clientPortfolio', label: 'Portefeuille clients', defaultValue: 'Liste des clients...', type: 'text' },
      { key: 'caseStudy1', label: 'Étude de cas 1', defaultValue: 'Premier cas client...', type: 'text' },
      { key: 'caseStudy2', label: 'Étude de cas 2', defaultValue: 'Deuxième cas client...', type: 'text' },
      { key: 'testimonials', label: 'Témoignages', defaultValue: 'Avis clients...', type: 'text' }
    ]
  }
];

// Labels des catégories en français
export const categoryLabels: Record<TemplateCategory | 'all', string> = {
  'all': 'Toutes les catégories',
  'pitch-deck': 'Pitch Deck',
  'levee-fonds': 'Levée de Fonds',
  'cession': 'Cession',
  'acquisition': 'Acquisition',
  'financements-structures': 'Financements Structurés',
  'rapport': 'Rapport',
  'equipe': 'Équipe',
  'references': 'Références',
  'custom': 'Mes Modèles'
};

// Icônes des catégories
export const categoryIcons: Record<TemplateCategory, string> = {
  'pitch-deck': '📊',
  'levee-fonds': '💰',
  'cession': '🏢',
  'acquisition': '🤝',
  'financements-structures': '🏗️',
  'rapport': '📄',
  'equipe': '👥',
  'references': '⭐',
  'custom': '💾'
};

// Hook personnalisé pour la gestion des templates
export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>(() => {
    // Charger depuis localStorage si disponible
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('alecia-templates');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((t: Template) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt)
          }));
        } catch {
          return defaultTemplates;
        }
      }
    }
    return defaultTemplates;
  });

  const [filters, setFilters] = useState<TemplateFilters>({
    search: '',
    category: 'all',
    favoritesOnly: false,
    customOnly: false
  });

  // Sauvegarder dans localStorage
  const saveToStorage = useCallback((newTemplates: Template[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alecia-templates', JSON.stringify(newTemplates));
    }
  }, []);

  // Filtrer les templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Filtre par catégorie
      if (filters.category !== 'all' && template.category !== filters.category) {
        return false;
      }

      // Filtre favoris
      if (filters.favoritesOnly && !template.isFavorite) {
        return false;
      }

      // Filtre modèles personnalisés
      if (filters.customOnly && !template.isCustom) {
        return false;
      }

      return true;
    });
  }, [templates, filters]);

  // Grouper par catégorie
  const templatesByCategory = useMemo(() => {
    const grouped: Record<string, Template[]> = {};
    filteredTemplates.forEach(template => {
      const cat = template.category;
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(template);
    });
    return grouped;
  }, [filteredTemplates]);

  // Compter par catégorie
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    templates.forEach(template => {
      counts[template.category] = (counts[template.category] || 0) + 1;
    });
    return counts;
  }, [templates]);

  // Actions
  const addTemplate = useCallback((template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: Template = {
      ...template,
      id: `custom-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const newTemplates = [...templates, newTemplate];
    setTemplates(newTemplates);
    saveToStorage(newTemplates);
    return newTemplate;
  }, [templates, saveToStorage]);

  const updateTemplate = useCallback((id: string, updates: Partial<Template>) => {
    const newTemplates = templates.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
    );
    setTemplates(newTemplates);
    saveToStorage(newTemplates);
  }, [templates, saveToStorage]);

  const deleteTemplate = useCallback((id: string) => {
    const newTemplates = templates.filter(t => t.id !== id);
    setTemplates(newTemplates);
    saveToStorage(newTemplates);
  }, [templates, saveToStorage]);

  const toggleFavorite = useCallback((id: string) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      updateTemplate(id, { isFavorite: !template.isFavorite });
    }
  }, [templates, updateTemplate]);

  const duplicateTemplate = useCallback((id: string) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      const { id: _, name, ...rest } = template;
      addTemplate({
        ...rest,
        name: `${name} (Copie)`,
        isCustom: true
      });
    }
  }, [templates, addTemplate]);

  const applyTemplate = useCallback((template: Template, variableValues?: Record<string, string>) => {
    // Remplacer les variables dans les slides
    const processedSlides = template.slides.map(slide => {
      let processedSlide = { ...slide };
      
      if (variableValues) {
        Object.entries(variableValues).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`;
          if (processedSlide.title) {
            processedSlide.title = processedSlide.title.replace(placeholder, value);
          }
          if (processedSlide.subtitle) {
            processedSlide.subtitle = processedSlide.subtitle.replace(placeholder, value);
          }
          if (processedSlide.content) {
            processedSlide.content = processedSlide.content.replace(placeholder, value);
          }
        });
      }
      
      return processedSlide;
    });

    return {
      ...template,
      slides: processedSlides
    };
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const setCategory = useCallback((category: TemplateCategory | 'all') => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  const toggleFavoritesOnly = useCallback(() => {
    setFilters(prev => ({ ...prev, favoritesOnly: !prev.favoritesOnly }));
  }, []);

  const toggleCustomOnly = useCallback(() => {
    setFilters(prev => ({ ...prev, customOnly: !prev.customOnly }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'all',
      favoritesOnly: false,
      customOnly: false
    });
  }, []);

  return {
    // État
    templates,
    filteredTemplates,
    filters,
    templatesByCategory,
    categoryCounts,
    
    // Actions
    addTemplate,
    updateTemplate,
    deleteTemplate,
    toggleFavorite,
    duplicateTemplate,
    applyTemplate,
    
    // Filtres
    setSearch,
    setCategory,
    toggleFavoritesOnly,
    toggleCustomOnly,
    resetFilters
  };
}

export default useTemplates;
