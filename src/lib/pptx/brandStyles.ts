/**
 * Alecia Brand Styles
 * Constantes de style pour la marque Alecia
 */

// Couleurs de la marque Alecia
export const ALECIA_COLORS = {
  // Couleur principale - Bleu marine foncé
  primary: {
    dark: '#0a1628',
    main: '#1e3a5f',
    light: '#2d4a6f',
  },
  // Couleur d'accent - Rose
  accent: {
    main: '#e91e63',
    light: '#f06292',
    dark: '#c2185b',
  },
  // Couleurs neutres
  neutral: {
    white: '#ffffff',
    offWhite: '#f5f5f5',
    lightGray: '#e0e0e0',
    gray: '#9e9e9e',
    darkGray: '#616161',
  },
  // Couleurs de texte
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
    muted: '#808080',
  },
  // Couleurs de fond
  background: {
    light: '#f5f5f5',
    dark: '#0a1628',
  },
} as const;

// Typographie
export const ALECIA_FONTS = {
  // Polices principales
  primary: 'Arial',
  secondary: 'Calibri',
  fallback: 'Helvetica, sans-serif',
  // Tailles de police
  sizes: {
    title: 44,
    subtitle: 28,
    heading1: 36,
    heading2: 28,
    heading3: 24,
    body: 18,
    small: 14,
    caption: 12,
  },
} as const;

// Espacements
export const ALECIA_SPACING = {
  // Marges de slide
  slide: {
    top: 0.5,
    bottom: 0.5,
    left: 0.75,
    right: 0.75,
  },
  // Espacements entre éléments
  element: {
    xs: 0.1,
    sm: 0.2,
    md: 0.3,
    lg: 0.5,
    xl: 0.75,
  },
  // Interligne
  lineHeight: {
    tight: 1.1,
    normal: 1.3,
    relaxed: 1.5,
    loose: 1.8,
  },
} as const;

// Dimensions des slides
export const SLIDE_DIMENSIONS = {
  width: 10,
  height: 5.625, // Format 16:9
  // Zones de contenu
  content: {
    titleTop: 0.8,
    bodyTop: 1.5,
    footerBottom: 5.2,
  },
} as const;

// Configuration du filigrane
export const WATERMARK_CONFIG = {
  text: '&',
  fontSize: 180,
  color: 'FFFFFF',
  opacity: 10, // Pourcentage
  x: 5,
  y: 2.8,
} as const;

// Configuration du logo
export const LOGO_CONFIG = {
  path: '/assets/logo-alecia.png',
  width: 1.5,
  height: 0.5,
  x: 0.5,
  y: 0.2,
} as const;

// Configuration du pied de page
export const FOOTER_CONFIG = {
  height: 0.4,
  fontSize: 10,
  color: ALECIA_COLORS.text.secondary,
} as const;

// Styles de bordures
export const BORDER_STYLES = {
  accent: {
    color: ALECIA_COLORS.accent.main,
    width: 2,
    type: 'solid' as const,
  },
  subtle: {
    color: ALECIA_COLORS.neutral.darkGray,
    width: 1,
    type: 'solid' as const,
  },
} as const;

// Styles de tableaux
export const TABLE_STYLES = {
  header: {
    fill: ALECIA_COLORS.accent.main,
    color: ALECIA_COLORS.neutral.white,
    bold: true,
  },
  row: {
    fill: ALECIA_COLORS.primary.main,
    color: ALECIA_COLORS.text.primary,
    alternateFill: ALECIA_COLORS.primary.light,
  },
  border: {
    color: ALECIA_COLORS.neutral.darkGray,
    width: 1,
  },
} as const;

// Styles de graphiques
export const CHART_STYLES = {
  // Palette de couleurs pour les graphiques
  colors: [
    '#e91e63', // Rose accent
    '#1e3a5f', // Bleu marine
    '#f06292', // Rose clair
    '#2d4a6f', // Bleu clair
    '#c2185b', // Rose foncé
    '#0a1628', // Bleu très foncé
    '#ff80ab', // Rose pastel
    '#4a6f8f', // Bleu gris
  ],
  // Configuration des axes
  axis: {
    color: ALECIA_COLORS.text.secondary,
    fontSize: 10,
  },
  // Configuration de la légende
  legend: {
    color: ALECIA_COLORS.text.primary,
    fontSize: 11,
  },
  // Configuration des titres
  title: {
    color: ALECIA_COLORS.text.primary,
    fontSize: 14,
    bold: true,
  },
} as const;

// Styles de puces (bullet points)
export const BULLET_STYLES = {
  types: {
    bullet: { type: 'bullet', code: '2022' }, // •
    dash: { type: 'dash', code: '2013' }, // –
    arrow: { type: 'arrow', code: '2192' }, // →
    square: { type: 'square', code: '25A0' }, // ■
  },
  indent: 0.3,
  color: ALECIA_COLORS.accent.main,
} as const;

// Configuration des cartes d'équipe
export const TEAM_CARD_CONFIG = {
  photo: {
    width: 1.2,
    height: 1.5,
    borderRadius: 0,
  },
  name: {
    fontSize: 16,
    fontFace: ALECIA_FONTS.primary,
    bold: true,
    color: ALECIA_COLORS.text.primary,
  },
  role: {
    fontSize: 12,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.accent.main,
  },
  description: {
    fontSize: 10,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.secondary,
  },
} as const;

// Configuration des logos clients
export const CLIENT_LOGO_CONFIG = {
  maxWidth: 1.5,
  maxHeight: 0.8,
  spacing: 0.5,
  rows: 3,
  columns: 4,
} as const;

// Animation par défaut (si supportée)
export const ANIMATION_DEFAULTS = {
  transition: 'fade',
  duration: 0.5,
} as const;

// Types de slides supportés
export const SLIDE_TYPES = [
  'title',
  'content',
  'twoColumn',
  'image',
  'chart',
  'table',
  'team',
  'clients',
  'sectionDivider',
  'closing',
] as const;

export type SlideType = typeof SLIDE_TYPES[number];

// Interface pour les variables de substitution
export interface TemplateVariables {
  [key: string]: string | number | boolean;
}

// Interface pour les options de génération
export interface GenerationOptions {
  includeWatermark?: boolean;
  includeLogo?: boolean;
  includeFooter?: boolean;
  includeDate?: boolean;
  dateFormat?: string;
  language?: 'fr' | 'en';
}

// Valeurs par défaut pour les options
export const DEFAULT_GENERATION_OPTIONS: GenerationOptions = {
  includeWatermark: true,
  includeLogo: true,
  includeFooter: true,
  includeDate: true,
  dateFormat: 'DD/MM/YYYY',
  language: 'fr',
};
