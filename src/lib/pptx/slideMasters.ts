/**
 * Slide Masters
 * Définitions des masters de slides pour Alecia Presentations
 */

import { ALECIA_COLORS, ALECIA_FONTS } from './brandStyles';

/**
 * Type pour le master de slide
 */
export interface SlideMasterConfig {
  title: string;
  background: { color: string };
  objects: Record<string, unknown>[];
}

/**
 * Crée le master de slide de titre
 */
export function createTitleSlideMaster(): SlideMasterConfig {
  return {
    title: 'Title Slide',
    background: { color: ALECIA_COLORS.primary.dark },
    objects: [
      {
        text: 'Titre de la présentation',
        options: {
          x: 0.5,
          y: 1.8,
          w: 9,
          h: 1.5,
          fontSize: 44,
          color: '#FFFFFF',
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.primary,
        },
      },
      {
        text: 'Sous-titre de la présentation',
        options: {
          x: 0.5,
          y: 3.3,
          w: 9,
          h: 0.8,
          fontSize: 24,
          color: ALECIA_COLORS.accent.main,
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
        },
      },
      {
        text: 'CONFIDENTIEL',
        options: {
          x: 0.5,
          y: 5.2,
          w: 2,
          h: 0.3,
          fontSize: 10,
          color: ALECIA_COLORS.accent.main,
          transparency: 30,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
        },
      },
    ],
  };
}

/**
 * Crée le master de slide de contenu
 */
export function createContentSlideMaster(): SlideMasterConfig {
  return {
    title: 'Content Slide',
    background: { color: ALECIA_COLORS.primary.main },
    objects: [
      {
        rect: {
          x: 0,
          y: 0,
          w: 10,
          h: 1.2,
          fill: { color: ALECIA_COLORS.primary.dark },
        },
      },
      {
        text: 'Titre de la slide',
        options: {
          x: 0.5,
          y: 0.35,
          w: 9,
          h: 0.6,
          fontSize: 28,
          color: '#FFFFFF',
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.primary,
        },
      },
      {
        text: 'Point principal',
        options: {
          x: 0.7,
          y: 1.7,
          w: 8.6,
          h: 0.5,
          fontSize: 18,
          color: ALECIA_COLORS.text.primary,
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
          bullet: { type: 'bullet' },
          bold: true,
        },
      },
      {
        text: 'Sous-point 1',
        options: {
          x: 1,
          y: 2.3,
          w: 8,
          h: 0.4,
          fontSize: 14,
          color: ALECIA_COLORS.text.secondary,
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
          bullet: { type: 'bullet', indent: 1 },
        },
      },
      {
        text: 'Sous-point 2',
        options: {
          x: 1,
          y: 2.7,
          w: 8,
          h: 0.4,
          fontSize: 14,
          color: ALECIA_COLORS.text.secondary,
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
          bullet: { type: 'bullet', indent: 1 },
        },
      },
      {
        text: 'Point clé',
        options: {
          x: 0.7,
          y: 3.8,
          w: 8.6,
          h: 0.4,
          fontSize: 16,
          color: ALECIA_COLORS.accent.main,
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
          bold: true,
        },
      },
      {
        text: 'CONFIDENTIEL',
        options: {
          x: 0.5,
          y: 5.2,
          w: 2,
          h: 0.3,
          fontSize: 8,
          color: ALECIA_COLORS.accent.main,
          transparency: 30,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
        },
      },
    ],
  };
}

/**
 * Crée le master de slide deux colonnes
 */
export function createTwoColumnSlideMaster(): SlideMasterConfig {
  return {
    title: 'Two Column Slide',
    background: { color: ALECIA_COLORS.primary.main },
    objects: [
      {
        text: 'Titre - Deux colonnes',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 28,
          color: '#FFFFFF',
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.primary,
        },
      },
      {
        rect: {
          x: 0.5,
          y: 1.1,
          w: 2,
          h: 0.03,
          fill: { color: ALECIA_COLORS.accent.main },
        },
      },
      {
        text: 'Colonne gauche',
        options: {
          x: 0.5,
          y: 1.5,
          w: 4.2,
          h: 0.4,
          fontSize: 16,
          color: ALECIA_COLORS.accent.main,
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
          bold: true,
        },
      },
      {
        text: 'Contenu de la colonne gauche...',
        options: {
          x: 0.5,
          y: 2,
          w: 4.2,
          h: 2.5,
          fontSize: 14,
          color: ALECIA_COLORS.text.primary,
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
          bullet: { type: 'bullet' },
        },
      },
      {
        text: 'Colonne droite',
        options: {
          x: 5.3,
          y: 1.5,
          w: 4.2,
          h: 0.4,
          fontSize: 16,
          color: ALECIA_COLORS.accent.main,
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
          bold: true,
        },
      },
      {
        text: 'Contenu de la colonne droite...',
        options: {
          x: 5.3,
          y: 2,
          w: 4.2,
          h: 2.5,
          fontSize: 14,
          color: ALECIA_COLORS.text.primary,
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
          bullet: { type: 'bullet' },
        },
      },
      {
        text: 'Colonnes',
        options: {
          x: 0.5,
          y: 5.2,
          w: 2,
          h: 0.3,
          fontSize: 8,
          color: ALECIA_COLORS.accent.main,
          transparency: 30,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
        },
      },
    ],
  };
}

/**
 * Crée le master de slide image
 */
export function createImageSlideMaster(): SlideMasterConfig {
  return {
    title: 'Image Slide',
    background: { color: ALECIA_COLORS.primary.main },
    objects: [
      {
        text: 'Titre avec image',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 28,
          color: '#FFFFFF',
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.primary,
        },
      },
      {
        text: 'Image',
        options: {
          x: 0.5,
          y: 1.3,
          w: 6,
          h: 3.5,
          fontSize: 14,
          color: ALECIA_COLORS.text.secondary,
          transparency: 50,
          align: 'center',
          valign: 'middle',
          fontFace: ALECIA_FONTS.secondary,
          bold: true,
        },
      },
      {
        text: "Légende de l'image",
        options: {
          x: 0.5,
          y: 4.9,
          w: 6,
          h: 0.3,
          fontSize: 10,
          color: ALECIA_COLORS.text.secondary,
          transparency: 0,
          align: 'center',
          fontFace: ALECIA_FONTS.secondary,
          italic: true,
        },
      },
    ],
  };
}

/**
 * Crée le master de slide graphique
 */
export function createChartSlideMaster(): SlideMasterConfig {
  return {
    title: 'Chart Slide',
    background: { color: ALECIA_COLORS.primary.main },
    objects: [
      {
        text: 'Graphique',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 28,
          color: '#FFFFFF',
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.primary,
        },
      },
      {
        rect: {
          x: 0.5,
          y: 1.3,
          w: 6,
          h: 3.5,
          fill: { color: ALECIA_COLORS.background.light },
        },
      },
      {
        text: 'Légende du graphique',
        options: {
          x: 6.8,
          y: 1.3,
          w: 2.7,
          h: 3.5,
          fontSize: 12,
          color: ALECIA_COLORS.text.primary,
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
        },
      },
    ],
  };
}

/**
 * Crée le master de slide tableau
 */
export function createTableSlideMaster(): SlideMasterConfig {
  return {
    title: 'Table Slide',
    background: { color: ALECIA_COLORS.primary.main },
    objects: [
      {
        text: 'Tableau',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 28,
          color: '#FFFFFF',
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.primary,
        },
      },
      {
        rect: {
          x: 0.5,
          y: 1.3,
          w: 9,
          h: 3.5,
          fill: { color: ALECIA_COLORS.background.light },
        },
      },
    ],
  };
}

/**
 * Crée le master de slide équipe
 */
export function createTeamSlideMaster(): SlideMasterConfig {
  return {
    title: 'Team Slide',
    background: { color: ALECIA_COLORS.primary.main },
    objects: [
      {
        text: 'Équipe',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 28,
          color: '#FFFFFF',
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.primary,
        },
      },
      {
        text: 'Membre 1',
        options: {
          x: 0.5,
          y: 1.5,
          w: 2,
          h: 0.4,
          fontSize: 14,
          color: ALECIA_COLORS.accent.main,
          transparency: 0,
          align: 'center',
          fontFace: ALECIA_FONTS.secondary,
          bold: true,
        },
      },
      {
        text: 'CONFIDENTIEL',
        options: {
          x: 0.5,
          y: 5.2,
          w: 2,
          h: 0.3,
          fontSize: 8,
          color: ALECIA_COLORS.accent.main,
          transparency: 30,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
        },
      },
    ],
  };
}

/**
 * Crée le master de slide clients
 */
export function createClientsSlideMaster(): SlideMasterConfig {
  return {
    title: 'Clients Slide',
    background: { color: ALECIA_COLORS.primary.main },
    objects: [
      {
        text: 'Clients & Partenaires',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 28,
          color: '#FFFFFF',
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.primary,
        },
      },
      {
        text: 'Logos clients',
        options: {
          x: 0.5,
          y: 1.5,
          w: 9,
          h: 3,
          fontSize: 14,
          color: ALECIA_COLORS.text.secondary,
          transparency: 50,
          align: 'center',
          valign: 'middle',
          fontFace: ALECIA_FONTS.secondary,
          bold: true,
        },
      },
      {
        text: 'CONFIDENTIEL',
        options: {
          x: 0.5,
          y: 5.2,
          w: 2,
          h: 0.3,
          fontSize: 8,
          color: ALECIA_COLORS.accent.main,
          transparency: 30,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
        },
      },
    ],
  };
}

/**
 * Crée le master de slide séparateur de section
 */
export function createSectionDividerMaster(): SlideMasterConfig {
  return {
    title: 'Section Divider',
    background: { color: ALECIA_COLORS.accent.main },
    objects: [
      {
        text: 'SECTION',
        options: {
          x: 0.5,
          y: 1.8,
          w: 9,
          h: 0.6,
          fontSize: 18,
          color: ALECIA_COLORS.primary.dark,
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.primary,
          charSpacing: 4,
        },
      },
      {
        text: 'Titre de la section',
        options: {
          x: 0.5,
          y: 2.4,
          w: 9,
          h: 1.2,
          fontSize: 44,
          color: ALECIA_COLORS.primary.dark,
          transparency: 0,
          align: 'left',
          fontFace: ALECIA_FONTS.primary,
          bold: true,
        },
      },
      {
        text: 'Description de la section...',
        options: {
          x: 0.5,
          y: 3.6,
          w: 6,
          h: 0.6,
          fontSize: 16,
          color: ALECIA_COLORS.primary.dark,
          transparency: 20,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
        },
      },
    ],
  };
}

/**
 * Crée le master de slide de clôture
 */
export function createClosingSlideMaster(): SlideMasterConfig {
  return {
    title: 'Closing Slide',
    background: { color: ALECIA_COLORS.primary.dark },
    objects: [
      {
        text: 'Merci',
        options: {
          x: 0.5,
          y: 2.4,
          w: 9,
          h: 1,
          fontSize: 48,
          color: '#FFFFFF',
          transparency: 0,
          align: 'center',
          fontFace: ALECIA_FONTS.primary,
          bold: true,
        },
      },
      {
        text: "Pour plus d'informations, contactez-nous",
        options: {
          x: 0.5,
          y: 3.4,
          w: 9,
          h: 0.6,
          fontSize: 18,
          color: ALECIA_COLORS.accent.main,
          transparency: 0,
          align: 'center',
          fontFace: ALECIA_FONTS.secondary,
        },
      },
      {
        text: 'contact@alecia.fr',
        options: {
          x: 0.5,
          y: 4.2,
          w: 9,
          h: 0.4,
          fontSize: 14,
          color: '#FFFFFF',
          transparency: 30,
          align: 'center',
          fontFace: ALECIA_FONTS.secondary,
        },
      },
      {
        text: 'CONFIDENTIEL',
        options: {
          x: 0.5,
          y: 5.2,
          w: 2,
          h: 0.3,
          fontSize: 8,
          color: ALECIA_COLORS.accent.main,
          transparency: 30,
          align: 'left',
          fontFace: ALECIA_FONTS.secondary,
        },
      },
    ],
  };
}

/**
 * Enregistre tous les masters de slides
 */
export function registerAllSlideMasters(): Record<string, SlideMasterConfig> {
  return {
    [SLIDE_MASTER_NAMES.title]: createTitleSlideMaster(),
    [SLIDE_MASTER_NAMES.content]: createContentSlideMaster(),
    [SLIDE_MASTER_NAMES.twoColumn]: createTwoColumnSlideMaster(),
    [SLIDE_MASTER_NAMES.image]: createImageSlideMaster(),
    [SLIDE_MASTER_NAMES.chart]: createChartSlideMaster(),
    [SLIDE_MASTER_NAMES.table]: createTableSlideMaster(),
    [SLIDE_MASTER_NAMES.team]: createTeamSlideMaster(),
    [SLIDE_MASTER_NAMES.clients]: createClientsSlideMaster(),
    [SLIDE_MASTER_NAMES.sectionDivider]: createSectionDividerMaster(),
    [SLIDE_MASTER_NAMES.closing]: createClosingSlideMaster(),
  };
}

/**
 * Noms des masters de slides
 */
export const SLIDE_MASTER_NAMES = {
  title: 'title',
  content: 'content',
  twoColumn: 'twoColumn',
  image: 'image',
  chart: 'chart',
  table: 'table',
  team: 'team',
  clients: 'clients',
  sectionDivider: 'sectionDivider',
  closing: 'closing',
} as const;
