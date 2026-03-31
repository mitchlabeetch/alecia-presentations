/**
 * Slide Layouts
 * Configurations de mise en page pour les différents types de slides
 */

import { ALECIA_COLORS, ALECIA_FONTS } from './brandStyles';

// Types de positionnement
export type Position = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type TextOptions = {
  fontSize?: number;
  fontFace?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
};

// Layout de slide de titre
export const TITLE_SLIDE_LAYOUT = {
  background: {
    color: ALECIA_COLORS.primary.dark,
  },
  title: {
    x: 0.5,
    y: 2,
    w: 9,
    h: 1.2,
    options: {
      fontSize: ALECIA_FONTS.sizes.title,
      fontFace: ALECIA_FONTS.primary,
      color: ALECIA_COLORS.text.primary,
      bold: true,
      align: 'center' as const,
    },
  },
  subtitle: {
    x: 1,
    y: 3.3,
    w: 8,
    h: 0.8,
    options: {
      fontSize: ALECIA_FONTS.sizes.subtitle,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.text.secondary,
      align: 'center' as const,
    },
  },
  date: {
    x: 4,
    y: 4.8,
    w: 2,
    h: 0.3,
    options: {
      fontSize: ALECIA_FONTS.sizes.small,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.text.muted,
      align: 'center' as const,
    },
  },
  logo: {
    x: 4.25,
    y: 0.5,
    w: 1.5,
    h: 0.6,
  },
} as const;

// Layout de slide de contenu
export const CONTENT_SLIDE_LAYOUT = {
  background: {
    color: ALECIA_COLORS.primary.dark,
  },
  header: {
    height: 1.2,
    accentLine: {
      x: 0.5,
      y: 1.15,
      w: 9,
      h: 0.02,
      color: ALECIA_COLORS.accent.main,
    },
  },
  title: {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    options: {
      fontSize: ALECIA_FONTS.sizes.heading1,
      fontFace: ALECIA_FONTS.primary,
      color: ALECIA_COLORS.text.primary,
      bold: true,
      align: 'left' as const,
    },
  },
  content: {
    x: 0.5,
    y: 1.4,
    w: 9,
    h: 3.6,
    options: {
      fontSize: ALECIA_FONTS.sizes.body,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.text.primary,
      align: 'left' as const,
    },
  },
  footer: {
    height: 0.4,
    y: 5.2,
    text: {
      x: 3.5,
      y: 5.2,
      w: 3,
      h: 0.3,
      text: 'Alecia - Conseil en gestion de patrimoine',
      options: {
        fontSize: 10,
        fontFace: ALECIA_FONTS.secondary,
        color: ALECIA_COLORS.text.muted,
        align: 'center' as const,
      },
    },
    pageNumber: {
      x: 9,
      y: 5.2,
      w: 0.5,
      h: 0.3,
      options: {
        fontSize: 10,
        fontFace: ALECIA_FONTS.secondary,
        color: ALECIA_COLORS.text.muted,
        align: 'right' as const,
      },
    },
    date: {
      x: 0.5,
      y: 5.2,
      w: 2,
      h: 0.3,
      options: {
        fontSize: 10,
        fontFace: ALECIA_FONTS.secondary,
        color: ALECIA_COLORS.text.muted,
        align: 'left' as const,
      },
    },
  },
} as const;

// Layout de slide à deux colonnes
export const TWO_COLUMN_SLIDE_LAYOUT = {
  background: {
    color: ALECIA_COLORS.primary.dark,
  },
  header: {
    height: 1.2,
    accentLine: {
      x: 0.5,
      y: 1.15,
      w: 9,
      h: 0.02,
      color: ALECIA_COLORS.accent.main,
    },
  },
  title: {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    options: {
      fontSize: ALECIA_FONTS.sizes.heading1,
      fontFace: ALECIA_FONTS.primary,
      color: ALECIA_COLORS.text.primary,
      bold: true,
      align: 'left' as const,
    },
  },
  leftColumn: {
    x: 0.5,
    y: 1.4,
    w: 4.3,
    h: 3.6,
    options: {
      fontSize: ALECIA_FONTS.sizes.body,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.text.primary,
      align: 'left' as const,
    },
  },
  rightColumn: {
    x: 5.2,
    y: 1.4,
    w: 4.3,
    h: 3.6,
    options: {
      fontSize: ALECIA_FONTS.sizes.body,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.text.primary,
      align: 'left' as const,
    },
  },
  divider: {
    x: 4.95,
    y: 1.4,
    w: 0.01,
    h: 3.6,
    color: ALECIA_COLORS.neutral.darkGray,
  },
  footer: CONTENT_SLIDE_LAYOUT.footer,
} as const;

// Layout de slide avec image
export const IMAGE_SLIDE_LAYOUT = {
  background: {
    color: ALECIA_COLORS.primary.dark,
  },
  title: {
    x: 0.5,
    y: 0.4,
    w: 9,
    h: 0.5,
    options: {
      fontSize: ALECIA_FONTS.sizes.heading1,
      fontFace: ALECIA_FONTS.primary,
      color: ALECIA_COLORS.text.primary,
      bold: true,
      align: 'left' as const,
    },
  },
  image: {
    fullImage: {
      x: 0.5,
      y: 1.1,
      w: 9,
      h: 4,
    },
    leftImage: {
      x: 0.5,
      y: 1.1,
      w: 4.5,
      h: 4,
    },
    rightImage: {
      x: 5,
      y: 1.1,
      w: 4.5,
      h: 4,
    },
  },
  text: {
    x: 5.2,
    y: 1.1,
    w: 4.3,
    h: 4,
    options: {
      fontSize: ALECIA_FONTS.sizes.body,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.text.primary,
      align: 'left' as const,
    },
  },
  footer: CONTENT_SLIDE_LAYOUT.footer,
} as const;

// Layout de slide de graphique
export const CHART_SLIDE_LAYOUT = {
  background: {
    color: ALECIA_COLORS.primary.dark,
  },
  header: {
    height: 1.2,
    accentLine: {
      x: 0.5,
      y: 1.15,
      w: 9,
      h: 0.02,
      color: ALECIA_COLORS.accent.main,
    },
  },
  title: {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    options: {
      fontSize: ALECIA_FONTS.sizes.heading1,
      fontFace: ALECIA_FONTS.primary,
      color: ALECIA_COLORS.text.primary,
      bold: true,
      align: 'left' as const,
    },
  },
  chart: {
    x: 0.5,
    y: 1.4,
    w: 9,
    h: 3.6,
  },
  footer: CONTENT_SLIDE_LAYOUT.footer,
} as const;

// Layout de slide de tableau
export const TABLE_SLIDE_LAYOUT = {
  background: {
    color: ALECIA_COLORS.primary.dark,
  },
  header: {
    height: 1.2,
    accentLine: {
      x: 0.5,
      y: 1.15,
      w: 9,
      h: 0.02,
      color: ALECIA_COLORS.accent.main,
    },
  },
  title: {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    options: {
      fontSize: ALECIA_FONTS.sizes.heading1,
      fontFace: ALECIA_FONTS.primary,
      color: ALECIA_COLORS.text.primary,
      bold: true,
      align: 'left' as const,
    },
  },
  table: {
    x: 0.5,
    y: 1.4,
    w: 9,
    h: 3.6,
  },
  footer: CONTENT_SLIDE_LAYOUT.footer,
} as const;

// Layout de slide d'équipe
export const TEAM_SLIDE_LAYOUT = {
  background: {
    color: ALECIA_COLORS.primary.dark,
  },
  header: {
    height: 1.2,
    accentLine: {
      x: 0.5,
      y: 1.15,
      w: 9,
      h: 0.02,
      color: ALECIA_COLORS.accent.main,
    },
  },
  title: {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    options: {
      fontSize: ALECIA_FONTS.sizes.heading1,
      fontFace: ALECIA_FONTS.primary,
      color: ALECIA_COLORS.text.primary,
      bold: true,
      align: 'left' as const,
    },
  },
  teamGrid: {
    x: 0.5,
    y: 1.4,
    w: 9,
    h: 3.6,
    // Configuration pour 3-4 membres par ligne
    columns: 3,
    rows: 2,
    cardWidth: 2.8,
    cardHeight: 1.7,
    spacing: 0.3,
  },
  memberCard: {
    photo: {
      width: 0.9,
      height: 1.1,
    },
    name: {
      fontSize: 14,
      fontFace: ALECIA_FONTS.primary,
      color: ALECIA_COLORS.text.primary,
      bold: true,
    },
    role: {
      fontSize: 11,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.accent.main,
    },
    description: {
      fontSize: 9,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.text.secondary,
    },
  },
  footer: CONTENT_SLIDE_LAYOUT.footer,
} as const;

// Layout de slide de logos clients
export const CLIENTS_SLIDE_LAYOUT = {
  background: {
    color: ALECIA_COLORS.primary.dark,
  },
  header: {
    height: 1.2,
    accentLine: {
      x: 0.5,
      y: 1.15,
      w: 9,
      h: 0.02,
      color: ALECIA_COLORS.accent.main,
    },
  },
  title: {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    options: {
      fontSize: ALECIA_FONTS.sizes.heading1,
      fontFace: ALECIA_FONTS.primary,
      color: ALECIA_COLORS.text.primary,
      bold: true,
      align: 'left' as const,
    },
  },
  logoGrid: {
    x: 0.5,
    y: 1.4,
    w: 9,
    h: 3.6,
    columns: 4,
    rows: 3,
    cellWidth: 2.1,
    cellHeight: 1.1,
    spacing: 0.2,
    logoMaxWidth: 1.8,
    logoMaxHeight: 0.8,
  },
  footer: CONTENT_SLIDE_LAYOUT.footer,
} as const;

// Layout de slide séparateur de section
export const SECTION_DIVIDER_LAYOUT = {
  background: {
    color: ALECIA_COLORS.primary.dark,
  },
  title: {
    x: 1,
    y: 2,
    w: 8,
    h: 0.8,
    options: {
      fontSize: 48,
      fontFace: ALECIA_FONTS.primary,
      color: ALECIA_COLORS.text.primary,
      bold: true,
      align: 'center' as const,
    },
  },
  subtitle: {
    x: 1,
    y: 3,
    w: 8,
    h: 0.5,
    options: {
      fontSize: ALECIA_FONTS.sizes.subtitle,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.text.secondary,
      align: 'center' as const,
    },
  },
  accentLine: {
    x: 2,
    y: 2.9,
    w: 6,
    h: 0.04,
    color: ALECIA_COLORS.accent.main,
  },
  footer: {
    pageNumber: {
      x: 9,
      y: 5.2,
      w: 0.5,
      h: 0.3,
      options: {
        fontSize: 10,
        fontFace: ALECIA_FONTS.secondary,
        color: ALECIA_COLORS.text.muted,
        align: 'right' as const,
      },
    },
  },
} as const;

// Layout de slide de fermeture
export const CLOSING_SLIDE_LAYOUT = {
  background: {
    color: ALECIA_COLORS.primary.dark,
  },
  thankYou: {
    x: 1,
    y: 1.5,
    w: 8,
    h: 0.8,
    options: {
      fontSize: 52,
      fontFace: ALECIA_FONTS.primary,
      color: ALECIA_COLORS.text.primary,
      bold: true,
      align: 'center' as const,
    },
  },
  accentLine: {
    x: 2,
    y: 2.4,
    w: 6,
    h: 0.03,
    color: ALECIA_COLORS.accent.main,
  },
  contact: {
    x: 2,
    y: 2.7,
    w: 6,
    h: 2,
    options: {
      fontSize: ALECIA_FONTS.sizes.body,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.text.secondary,
      align: 'center' as const,
    },
  },
  logo: {
    x: 4.25,
    y: 4.8,
    w: 1.5,
    h: 0.5,
  },
} as const;

// Export de tous les layouts
export const ALL_LAYOUTS = {
  title: TITLE_SLIDE_LAYOUT,
  content: CONTENT_SLIDE_LAYOUT,
  twoColumn: TWO_COLUMN_SLIDE_LAYOUT,
  image: IMAGE_SLIDE_LAYOUT,
  chart: CHART_SLIDE_LAYOUT,
  table: TABLE_SLIDE_LAYOUT,
  team: TEAM_SLIDE_LAYOUT,
  clients: CLIENTS_SLIDE_LAYOUT,
  sectionDivider: SECTION_DIVIDER_LAYOUT,
  closing: CLOSING_SLIDE_LAYOUT,
} as const;

// Type pour les layouts
export type SlideLayoutType = keyof typeof ALL_LAYOUTS;

/**
 * Récupère un layout par son type
 */
export function getLayout(type: SlideLayoutType) {
  return ALL_LAYOUTS[type];
}

/**
 * Calcule les positions pour une grille
 */
export function calculateGridPositions(
  startX: number,
  startY: number,
  cellWidth: number,
  cellHeight: number,
  spacing: number,
  columns: number,
  rows: number
): Position[] {
  const positions: Position[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      positions.push({
        x: startX + col * (cellWidth + spacing),
        y: startY + row * (cellHeight + spacing),
        w: cellWidth,
        h: cellHeight,
      });
    }
  }

  return positions;
}

/**
 * Calcule les positions pour les cartes d'équipe
 */
export function calculateTeamCardPositions(memberCount: number): Position[] {
  const layout = TEAM_SLIDE_LAYOUT.teamGrid;
  const maxPerRow = layout.columns;
  const rows = Math.ceil(memberCount / maxPerRow);

  return calculateGridPositions(
    layout.x,
    layout.y,
    layout.cardWidth,
    layout.cardHeight,
    layout.spacing,
    Math.min(memberCount, maxPerRow),
    Math.min(rows, layout.rows)
  );
}

/**
 * Calcule les positions pour les logos clients
 */
export function calculateClientLogoPositions(logoCount: number): Position[] {
  const layout = CLIENTS_SLIDE_LAYOUT.logoGrid;
  const maxLogos = layout.columns * layout.rows;
  const actualCount = Math.min(logoCount, maxLogos);

  return calculateGridPositions(
    layout.x,
    layout.y,
    layout.cellWidth,
    layout.cellHeight,
    layout.spacing,
    layout.columns,
    Math.ceil(actualCount / layout.columns)
  );
}
