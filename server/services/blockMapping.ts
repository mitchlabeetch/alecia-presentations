/**
 * Alecia Presentation Builder - Block Mapping Service
 * Service pour mapper la sortie Docling vers les blocs Alecia
 */

import type { SlideType, SlideContent } from '../types/index.js';
import type { DoclingSlide, DoclingSlideContent } from './docling.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Résumé du mapping Docling -> Alecia
 */
export interface MappedSlide {
  orderIndex: number;
  type: SlideType;
  title: string;
  content: SlideContent;
  notes?: string;
}

/**
 * Configuration du mapping de type
 */
interface TypeMappingRule {
  doclingType: string;
  aleciaType: SlideType;
  priority: number;
}

/**
 * Motifs de texte pour l'inférence de type
 */
interface TextPattern {
  patterns: RegExp[];
  aleciaType: SlideType;
  priority: number;
}

// ============================================================================
// Règles de mapping
// ============================================================================

/**
 * Règles de mapping basées sur le type Docling
 */
const TYPE_MAPPING_RULES: TypeMappingRule[] = [
  // Slides de couverture
  { doclingType: 'title', aleciaType: 'Cover', priority: 10 },
  { doclingType: 'title_slide', aleciaType: 'Cover', priority: 10 },
  { doclingType: 'cover', aleciaType: 'Cover', priority: 10 },

  // Slides de navigation
  { doclingType: 'toc', aleciaType: 'Section_Navigator', priority: 10 },
  { doclingType: 'table_of_contents', aleciaType: 'Section_Navigator', priority: 10 },
  { doclingType: 'summary', aleciaType: 'Section_Navigator', priority: 10 },

  // Slides de contenu spécialisé
  { doclingType: 'swot', aleciaType: 'SWOT', priority: 10 },
  { doclingType: 'table', aleciaType: 'Table_Block', priority: 10 },
  { doclingType: 'chart', aleciaType: 'Chart_Block', priority: 10 },
  { doclingType: 'timeline', aleciaType: 'Process_Timeline', priority: 10 },
  { doclingType: 'team', aleciaType: 'Team_Members', priority: 10 },
  { doclingType: 'quote', aleciaType: 'Quote_Block', priority: 10 },
  { doclingType: 'image', aleciaType: 'Image_Block', priority: 10 },
];

/**
 * Motifs de texte pour inférer le type de slide
 */
const TEXT_PATTERNS: TextPattern[] = [
  // Couvrerture
  {
    patterns: [/couverture/i, /cover\s*page/i, /page\s*de\s*titre/i, /title\s*slide/i],
    aleciaType: 'Cover',
    priority: 9,
  },

  // Sommaire / Navigation
  {
    patterns: [/sommaire/i, /summary/i, /table\s*of\s*contents/i, /agenda/i, /plan/i, /table des matières/i],
    aleciaType: 'Section_Navigator',
    priority: 9,
  },

  // SWOT
  {
    patterns: [/swot/i, /forces.*faiblesses/i, / strengths.*weaknesses/i],
    aleciaType: 'SWOT',
    priority: 9,
  },

  // KPI
  {
    patterns: [/kpi/i, /indicateur/i, /métrique/i, /metric/i, /key\s*performance/i],
    aleciaType: 'KPI_Card',
    priority: 8,
  },

  // Tableau
  {
    patterns: [/tableau/i, /table/i, /comparaison/i, /comparison/i],
    aleciaType: 'Table_Block',
    priority: 8,
  },

  // Graphique
  {
    patterns: [/graphique/i, /chart/i, /graph/i, /diagram/i, /camembert/i, /barre/i],
    aleciaType: 'Chart_Block',
    priority: 8,
  },

  // Timeline
  {
    patterns: [/timeline/i, /chronolog/i, /jalon/i, /milestone/i, /évolution/i, /historique/i],
    aleciaType: 'Process_Timeline',
    priority: 8,
  },

  // Citation
  {
    patterns: [/citation/i, /quote/i, /témoignage/i, /testimonial/i],
    aleciaType: 'Quote_Block',
    priority: 8,
  },

  // Équipe
  {
    patterns: [/équipe/i, /team/i, /membre/i, /member/i, /organigramme/i],
    aleciaType: 'Team_Members',
    priority: 8,
  },

  // Entreprise
  {
    patterns: [/entreprise/i, /société/i, /company/i, /société.*présentation/i],
    aleciaType: 'Company_Overview',
    priority: 7,
  },

  // Track Record
  {
    patterns: [/track\s*record/i, /référence/i, /références/i, /portfolio/i],
    aleciaType: 'Trackrecord_Block',
    priority: 7,
  },

  // Deal Rationale
  {
    patterns: [/rationale/i, /justification/i, /rational.*deal/i],
    aleciaType: 'Deal_Rationale',
    priority: 7,
  },

  // Contact
  {
    patterns: [/contact/i, /à\s*propos/i, /about/i, /nous\s*contacter/i],
    aleciaType: 'Contact_Block',
    priority: 6,
  },

  // Section Divider
  {
    patterns: [/section/i, /chapitre/i, /chapter/i, /^section\s*\d/i],
    aleciaType: 'Section_Divider',
    priority: 5,
  },
];

// ============================================================================
// Fonctions de mapping
// ============================================================================

/**
 * Map le type Docling vers un type Alecia
 */
function mapDoclingType(doclingType: string): SlideType | null {
  const rule = TYPE_MAPPING_RULES.find(
    (r) => r.doclingType.toLowerCase() === doclingType.toLowerCase()
  );
  return rule?.aleciaType ?? null;
}

/**
 * Inférer le type Alecia basé sur le texte du titre et du contenu
 */
function inferTypeFromText(title: string, content: string): SlideType {
  const text = `${title} ${content}`.toLowerCase();

  // Chercher le pattern avec la plus haute priorité
  let bestMatch: SlideType = 'Text_Block';
  let highestPriority = 0;

  for (const pattern of TEXT_PATTERNS) {
    for (const regex of pattern.patterns) {
      if (regex.test(text)) {
        if (pattern.priority > highestPriority) {
          highestPriority = pattern.priority;
          bestMatch = pattern.aleciaType;
        }
        break;
      }
    }
  }

  return bestMatch;
}

/**
 * Détermine si le contenu semble être une liste
 */
function isListContent(content: DoclingSlideContent): boolean {
  // Items explicites
  if (content.items && content.items.length > 0) return true;

  // Sections
  if (content.sections && content.sections.length > 0) return true;

  // KPI cards
  if (content.kpis && content.kpis.length > 0) return true;

  // Team
  if (content.team && content.team.length > 0) return true;

  // Timeline
  if (content.timeline && content.timeline.length > 0) return true;

  // Text avec bullet points
  if (content.text) {
    const bulletPatterns = [/^[\-\*•]\s/m, /^\d+\.\s/m, /^•\s/m];
    return bulletPatterns.some((p) => p.test(content.text!));
  }

  return false;
}

/**
 * Map le contenu Docling vers le contenu Alecia
 */
function mapContent(doclingContent: DoclingSlideContent): SlideContent {
  const content: SlideContent = {};

  // Texte principal
  if (doclingContent.text) {
    content.text = doclingContent.text;
  }

  // Sous-titre
  if (doclingContent.subtitle) {
    content.subtitle = doclingContent.subtitle;
  }

  // Items / Listes
  if (doclingContent.items && doclingContent.items.length > 0) {
    content.items = doclingContent.items;
  }

  // Sections (pour navigation)
  if (doclingContent.sections && doclingContent.sections.length > 0) {
    content.sections = doclingContent.sections;
  }

  // Citation
  if (doclingContent.quote) {
    content.quote = doclingContent.quote;
    content.author = doclingContent.author;
  }

  // KPIs
  if (doclingContent.kpis && doclingContent.kpis.length > 0) {
    content.kpis = doclingContent.kpis;
  }

  // Timeline
  if (doclingContent.timeline && doclingContent.timeline.length > 0) {
    content.timeline = doclingContent.timeline;
  }

  // Team
  if (doclingContent.team && doclingContent.team.length > 0) {
    content.team = doclingContent.team;
  }

  // Tableau
  if (doclingContent.table_data) {
    content.table_data = doclingContent.table_data;
  }

  // Graphique
  if (doclingContent.chart_type || doclingContent.chart_data) {
    content.chart_type = doclingContent.chart_type;
    content.chart_data = doclingContent.chart_data;
  }

  // Image
  if (doclingContent.image_url) {
    content.image_url = doclingContent.image_url;
  }

  // Métadonnées additionnelles
  if (doclingContent.metadata) {
    content.metadata = doclingContent.metadata;
  }

  return content;
}

/**
 * Map une slide Docling vers une slide Alecia
 */
export function mapDoclingSlide(doclingSlide: DoclingSlide): MappedSlide {
  // Déterminer le type
  let slideType: SlideType;

  // Essayer le mapping direct
  const directType = mapDoclingType(doclingSlide.type);
  if (directType) {
    slideType = directType;
  } else {
    // Inférer depuis le texte
    slideType = inferTypeFromText(
      doclingSlide.title,
      doclingContentToString(doclingSlide.content)
    );
  }

  // Map le contenu
  const content = mapContent(doclingSlide.content);

  return {
    orderIndex: doclingSlide.order_index,
    type: slideType,
    title: doclingSlide.title || `Slide ${doclingSlide.order_index + 1}`,
    content,
    notes: doclingSlide.notes,
  };
}

/**
 * Convertit le contenu Docling en chaîne pour l'analyse
 */
function doclingContentToString(content: DoclingSlideContent): string {
  const parts: string[] = [];

  if (content.text) parts.push(content.text);
  if (content.subtitle) parts.push(content.subtitle);
  if (content.items) parts.push(...content.items);
  if (content.sections) parts.push(...content.sections);
  if (content.quote) parts.push(content.quote);
  if (content.author) parts.push(content.author);
  if (content.kpis) {
    parts.push(...content.kpis.map((k) => `${k.label} ${k.value}`));
  }
  if (content.timeline) {
    parts.push(...content.timeline.map((t) => `${t.date} ${t.title}`));
  }
  if (content.team) {
    parts.push(...content.team.map((m) => `${m.name} ${m.role}`));
  }

  return parts.join(' ');
}

/**
 * Map plusieurs slides Docling vers des slides Alecia
 */
export function mapDoclingSlides(doclingSlides: DoclingSlide[]): MappedSlide[] {
  return doclingSlides.map(mapDoclingSlide);
}

/**
 * Map la sortie complète de conversion
 */
export function mapDoclingToBlocks(
  doclingSlides: DoclingSlide[]
): MappedSlide[] {
  return mapDoclingSlides(doclingSlides);
}

// ============================================================================
// Fallback pour conversion échouée
// ============================================================================

/**
 * Génère des slides de fallback en cas d'échec de conversion
 */
export function generateFallbackSlides(
  fileName: string,
  _fileType: string
): MappedSlide[] {
  const baseName = fileName.replace(/\.[^/.]+$/, '');

  return [
    {
      orderIndex: 0,
      type: 'Cover',
      title: baseName,
      content: {
        text: 'Importé depuis ' + fileName,
        subtitle: 'Contenu à compléter',
      },
    },
    {
      orderIndex: 1,
      type: 'Section_Navigator',
      title: 'Sommaire',
      content: {
        sections: ['Section 1', 'Section 2', 'Section 3'],
      },
    },
    {
      orderIndex: 2,
      type: 'Text_Block',
      title: 'Contenu principal',
      content: {
        text: [
          'Premier point clé',
          'Deuxième point clé',
          'Troisième point clé',
        ].join('\n'),
      },
    },
    {
      orderIndex: 3,
      type: 'Contact_Block',
      title: 'Contact',
      content: {
        name: 'Équipe Alecia',
        company: 'Alecia',
        email: 'contact@alecia.fr',
      },
      notes: 'Contactez Alecia pour plus dinformations.',
    },
  ];
}

// ============================================================================
// Exports
// ============================================================================

export default {
  mapDoclingSlide,
  mapDoclingSlides,
  mapDoclingToBlocks,
  generateFallbackSlides,
};
