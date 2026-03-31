/**
 * Slide Masters
 * Définitions des masters de slides pour Alecia Presentations
 */

import PptxGenJS from 'pptxgenjs';
import {
  ALECIA_COLORS,
  ALECIA_FONTS,
  SLIDE_DIMENSIONS,
  WATERMARK_CONFIG,
  LOGO_CONFIG,
  FOOTER_CONFIG,
} from './brandStyles';

/**
 * Crée le master de slide de titre
 */
export function createTitleSlideMaster(pptx: PptxGenJS): PptxGenJS.SlideMaster {
  return {
    title: 'Title Slide',
    background: { color: ALECIA_COLORS.primary.dark },
    objects: [
      // Logo Alecia
      {
        rect: {
          x: LOGO_CONFIG.x,
          y: LOGO_CONFIG.y,
          w: LOGO_CONFIG.width,
          h: LOGO_CONFIG.height,
          fill: { color: 'transparent' },
        },
      },
      // Filigrane &
      {
        text: {
          text: WATERMARK_CONFIG.text,
          options: {
            x: WATERMARK_CONFIG.x,
            y: WATERMARK_CONFIG.y,
            w: 2,
            h: 2,
            fontSize: WATERMARK_CONFIG.fontSize,
            color: WATERMARK_CONFIG.color,
            transparency: WATERMARK_CONFIG.opacity,
            align: 'center',
            fontFace: ALECIA_FONTS.primary,
          },
        },
      },
      // Zone de titre
      {
        placeholder: {
          options: {
            name: 'title',
            type: 'title',
            x: 1,
            y: 2,
            w: 8,
            h: 1.5,
            align: 'center',
            fontSize: ALECIA_FONTS.sizes.title,
            fontFace: ALECIA_FONTS.primary,
            color: ALECIA_COLORS.text.primary,
            bold: true,
          },
          text: 'Titre de la présentation',
        },
      },
      // Zone de sous-titre
      {
        placeholder: {
          options: {
            name: 'subtitle',
            type: 'body',
            x: 1,
            y: 3.5,
            w: 8,
            h: 0.8,
            align: 'center',
            fontSize: ALECIA_FONTS.sizes.subtitle,
            fontFace: ALECIA_FONTS.secondary,
            color: ALECIA_COLORS.text.secondary,
          },
          text: 'Sous-titre',
        },
      },
      // Date
      {
        placeholder: {
          options: {
            name: 'date',
            type: 'dt',
            x: 4,
            y: 5,
            w: 2,
            h: 0.3,
            align: 'center',
            fontSize: FOOTER_CONFIG.fontSize,
            fontFace: ALECIA_FONTS.secondary,
            color: FOOTER_CONFIG.color,
          },
          text: 'Date',
        },
      },
    ],
  };
}

/**
 * Crée le master de slide de contenu standard
 */
export function createContentSlideMaster(pptx: PptxGenJS): PptxGenJS.SlideMaster {
  return {
    title: 'Content Slide',
    background: { color: ALECIA_COLORS.primary.dark },
    objects: [
      // Logo Alecia (coin supérieur gauche)
      {
        rect: {
          x: 0.3,
          y: 0.2,
          w: 1.2,
          h: 0.4,
          fill: { color: 'transparent' },
        },
      },
      // Filigrane &
      {
        text: {
          text: WATERMARK_CONFIG.text,
          options: {
            x: 4,
            y: 2,
            w: 2,
            h: 2,
            fontSize: WATERMARK_CONFIG.fontSize,
            color: WATERMARK_CONFIG.color,
            transparency: WATERMARK_CONFIG.opacity,
            align: 'center',
            fontFace: ALECIA_FONTS.primary,
          },
        },
      },
      // Ligne de séparation accent
      {
        rect: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.02,
          fill: { color: ALECIA_COLORS.accent.main },
        },
      },
      // Zone de titre
      {
        placeholder: {
          options: {
            name: 'title',
            type: 'title',
            x: 0.5,
            y: 0.6,
            w: 9,
            h: 0.5,
            align: 'left',
            fontSize: ALECIA_FONTS.sizes.heading1,
            fontFace: ALECIA_FONTS.primary,
            color: ALECIA_COLORS.text.primary,
            bold: true,
          },
          text: 'Titre',
        },
      },
      // Zone de contenu
      {
        placeholder: {
          options: {
            name: 'content',
            type: 'body',
            x: 0.5,
            y: 1.4,
            w: 9,
            h: 3.8,
            align: 'left',
            fontSize: ALECIA_FONTS.sizes.body,
            fontFace: ALECIA_FONTS.secondary,
            color: ALECIA_COLORS.text.primary,
            bullet: true,
            bulletType: 'number',
          },
          text: 'Contenu',
        },
      },
      // Pied de page - Numéro de page
      {
        placeholder: {
          options: {
            name: 'slideNumber',
            type: 'sldNum',
            x: 9,
            y: 5.2,
            w: 0.5,
            h: 0.3,
            align: 'right',
            fontSize: FOOTER_CONFIG.fontSize,
            fontFace: ALECIA_FONTS.secondary,
            color: FOOTER_CONFIG.color,
          },
          text: '##',
        },
      },
      // Pied de page - Date
      {
        placeholder: {
          options: {
            name: 'date',
            type: 'dt',
            x: 0.5,
            y: 5.2,
            w: 2,
            h: 0.3,
            align: 'left',
            fontSize: FOOTER_CONFIG.fontSize,
            fontFace: ALECIA_FONTS.secondary,
            color: FOOTER_CONFIG.color,
          },
          text: 'Date',
        },
      },
      // Pied de page - Texte Alecia
      {
        text: {
          text: 'Alecia - Conseil en gestion de patrimoine',
          options: {
            x: 3.5,
            y: 5.2,
            w: 3,
            h: 0.3,
            align: 'center',
            fontSize: FOOTER_CONFIG.fontSize,
            fontFace: ALECIA_FONTS.secondary,
            color: FOOTER_CONFIG.color,
          },
        },
      },
    ],
  };
}

/**
 * Crée le master de slide à deux colonnes
 */
export function createTwoColumnSlideMaster(pptx: PptxGenJS): PptxGenJS.SlideMaster {
  return {
    title: 'Two Column Slide',
    background: { color: ALECIA_COLORS.primary.dark },
    objects: [
      // Filigrane &
      {
        text: {
          text: WATERMARK_CONFIG.text,
          options: {
            x: 4,
            y: 2,
            w: 2,
            h: 2,
            fontSize: WATERMARK_CONFIG.fontSize,
            color: WATERMARK_CONFIG.color,
            transparency: WATERMARK_CONFIG.opacity,
            align: 'center',
            fontFace: ALECIA_FONTS.primary,
          },
        },
      },
      // Ligne de séparation accent
      {
        rect: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.02,
          fill: { color: ALECIA_COLORS.accent.main },
        },
      },
      // Zone de titre
      {
        placeholder: {
          options: {
            name: 'title',
            type: 'title',
            x: 0.5,
            y: 0.6,
            w: 9,
            h: 0.5,
            align: 'left',
            fontSize: ALECIA_FONTS.sizes.heading1,
            fontFace: ALECIA_FONTS.primary,
            color: ALECIA_COLORS.text.primary,
            bold: true,
          },
          text: 'Titre',
        },
      },
      // Colonne gauche
      {
        placeholder: {
          options: {
            name: 'leftColumn',
            type: 'body',
            x: 0.5,
            y: 1.4,
            w: 4.3,
            h: 3.8,
            align: 'left',
            fontSize: ALECIA_FONTS.sizes.body,
            fontFace: ALECIA_FONTS.secondary,
            color: ALECIA_COLORS.text.primary,
            bullet: true,
          },
          text: 'Colonne gauche',
        },
      },
      // Colonne droite
      {
        placeholder: {
          options: {
            name: 'rightColumn',
            type: 'body',
            x: 5.2,
            y: 1.4,
            w: 4.3,
            h: 3.8,
            align: 'left',
            fontSize: ALECIA_FONTS.sizes.body,
            fontFace: ALECIA_FONTS.secondary,
            color: ALECIA_COLORS.text.primary,
            bullet: true,
          },
          text: 'Colonne droite',
        },
      },
      // Ligne de séparation verticale
      {
        rect: {
          x: 4.95,
          y: 1.4,
          w: 0.01,
          h: 3.8,
          fill: { color: ALECIA_COLORS.neutral.darkGray },
        },
      },
      // Pied de page
      {
        placeholder: {
          options: {
            name: 'slideNumber',
            type: 'sldNum',
            x: 9,
            y: 5.2,
            w: 0.5,
            h: 0.3,
            align: 'right',
            fontSize: FOOTER_CONFIG.fontSize,
            fontFace: ALECIA_FONTS.secondary,
            color: FOOTER_CONFIG.color,
          },
          text: '##',
        },
      },
    ],
  };
}

/**
 * Crée le master de slide avec image
 */
export function createImageSlideMaster(pptx: PptxGenJS): PptxGenJS.SlideMaster {
  return {
    title: 'Image Slide',
    background: { color: ALECIA_COLORS.primary.dark },
    objects: [
      // Filigrane &
      {
        text: {
          text: WATERMARK_CONFIG.text,
          options: {
            x: 4,
            y: 2,
            w: 2,
            h: 2,
            fontSize: WATERMARK_CONFIG.fontSize,
            color: WATERMARK_CONFIG.color,
            transparency: WATERMARK_CONFIG.opacity,
            align: 'center',
            fontFace: ALECIA_FONTS.primary,
          },
        },
      },
      // Zone de titre
      {
        placeholder: {
          options: {
            name: 'title',
            type: 'title',
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.5,
            align: 'left',
            fontSize: ALECIA_FONTS.sizes.heading1,
            fontFace: ALECIA_FONTS.primary,
            color: ALECIA_COLORS.text.primary,
            bold: true,
          },
          text: 'Titre',
        },
      },
      // Zone d'image
      {
        placeholder: {
          options: {
            name: 'image',
            type: 'pic',
            x: 0.5,
            y: 1.2,
            w: 4.5,
            h: 4,
          },
          text: '',
        },
      },
      // Zone de texte
      {
        placeholder: {
          options: {
            name: 'text',
            type: 'body',
            x: 5.2,
            y: 1.2,
            w: 4.3,
            h: 4,
            align: 'left',
            fontSize: ALECIA_FONTS.sizes.body,
            fontFace: ALECIA_FONTS.secondary,
            color: ALECIA_COLORS.text.primary,
          },
          text: 'Description',
        },
      },
      // Pied de page
      {
        placeholder: {
          options: {
            name: 'slideNumber',
            type: 'sldNum',
            x: 9,
            y: 5.2,
            w: 0.5,
            h: 0.3,
            align: 'right',
            fontSize: FOOTER_CONFIG.fontSize,
            fontFace: ALECIA_FONTS.secondary,
            color: FOOTER_CONFIG.color,
          },
          text: '##',
        },
      },
    ],
  };
}

/**
 * Crée le master de slide de graphique
 */
export function createChartSlideMaster(pptx: PptxGenJS): PptxGenJS.SlideMaster {
  return {
    title: 'Chart Slide',
    background: { color: ALECIA_COLORS.primary.dark },
    objects: [
      // Filigrane &
      {
        text: {
          text: WATERMARK_CONFIG.text,
          options: {
            x: 4,
            y: 2,
            w: 2,
            h: 2,
            fontSize: WATERMARK_CONFIG.fontSize,
            color: WATERMARK_CONFIG.color,
            transparency: WATERMARK_CONFIG.opacity,
            align: 'center',
            fontFace: ALECIA_FONTS.primary,
          },
        },
      },
      // Ligne de séparation accent
      {
        rect: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.02,
          fill: { color: ALECIA_COLORS.accent.main },
        },
      },
      // Zone de titre
      {
        placeholder: {
          options: {
            name: 'title',
            type: 'title',
            x: 0.5,
            y: 0.6,
            w: 9,
            h: 0.5,
            align: 'left',
            fontSize: ALECIA_FONTS.sizes.heading1,
            fontFace: ALECIA_FONTS.primary,
            color: ALECIA_COLORS.text.primary,
            bold: true,
          },
          text: 'Titre du graphique',
        },
      },
      // Zone de graphique
      {
        placeholder: {
          options: {
            name: 'chart',
            type: 'chart',
            x: 0.5,
            y: 1.4,
            w: 9,
            h: 3.8,
          },
          text: '',
        },
      },
      // Pied de page
      {
        placeholder: {
          options: {
            name: 'slideNumber',
            type: 'sldNum',
            x: 9,
            y: 5.2,
            w: 0.5,
            h: 0.3,
            align: 'right',
            fontSize: FOOTER_CONFIG.fontSize,
            fontFace: ALECIA_FONTS.secondary,
            color: FOOTER_CONFIG.color,
          },
          text: '##',
        },
      },
    ],
  };
}

/**
 * Crée le master de slide de tableau
 */
export function createTableSlideMaster(pptx: PptxGenJS): PptxGenJS.SlideMaster {
  return {
    title: 'Table Slide',
    background: { color: ALECIA_COLORS.primary.dark },
    objects: [
      // Filigrane &
      {
        text: {
          text: WATERMARK_CONFIG.text,
          options: {
            x: 4,
            y: 2,
            w: 2,
            h: 2,
            fontSize: WATERMARK_CONFIG.fontSize,
            color: WATERMARK_CONFIG.color,
            transparency: WATERMARK_CONFIG.opacity,
            align: 'center',
            fontFace: ALECIA_FONTS.primary,
          },
        },
      },
      // Ligne de séparation accent
      {
        rect: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.02,
          fill: { color: ALECIA_COLORS.accent.main },
        },
      },
      // Zone de titre
      {
        placeholder: {
          options: {
            name: 'title',
            type: 'title',
            x: 0.5,
            y: 0.6,
            w: 9,
            h: 0.5,
            align: 'left',
            fontSize: ALECIA_FONTS.sizes.heading1,
            fontFace: ALECIA_FONTS.primary,
            color: ALECIA_COLORS.text.primary,
            bold: true,
          },
          text: 'Titre du tableau',
        },
      },
      // Zone de tableau
      {
        placeholder: {
          options: {
            name: 'table',
            type: 'tbl',
            x: 0.5,
            y: 1.4,
            w: 9,
            h: 3.8,
          },
          text: '',
        },
      },
      // Pied de page
      {
        placeholder: {
          options: {
            name: 'slideNumber',
            type: 'sldNum',
            x: 9,
            y: 5.2,
            w: 0.5,
            h: 0.3,
            align: 'right',
            fontSize: FOOTER_CONFIG.fontSize,
            fontFace: ALECIA_FONTS.secondary,
            color: FOOTER_CONFIG.color,
          },
          text: '##',
        },
      },
    ],
  };
}

/**
 * Crée le master de slide d'équipe
 */
export function createTeamSlideMaster(pptx: PptxGenJS): PptxGenJS.SlideMaster {
  return {
    title: 'Team Slide',
    background: { color: ALECIA_COLORS.primary.dark },
    objects: [
      // Filigrane &
      {
        text: {
          text: WATERMARK_CONFIG.text,
          options: {
            x: 4,
            y: 2,
            w: 2,
            h: 2,
            fontSize: WATERMARK_CONFIG.fontSize,
            color: WATERMARK_CONFIG.color,
            transparency: WATERMARK_CONFIG.opacity,
            align: 'center',
            fontFace: ALECIA_FONTS.primary,
          },
        },
      },
      // Ligne de séparation accent
      {
        rect: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.02,
          fill: { color: ALECIA_COLORS.accent.main },
        },
      },
      // Zone de titre
      {
        placeholder: {
          options: {
            name: 'title',
            type: 'title',
            x: 0.5,
            y: 0.6,
            w: 9,
            h: 0.5,
            align: 'left',
            fontSize: ALECIA_FONTS.sizes.heading1,
            fontFace: ALECIA_FONTS.primary,
            color: ALECIA_COLORS.text.primary,
            bold: true,
          },
          text: 'Notre équipe',
        },
      },
      // Zone de contenu équipe
      {
        placeholder: {
          options: {
            name: 'teamContent',
            type: 'body',
            x: 0.5,
            y: 1.4,
            w: 9,
            h: 3.8,
          },
          text: '',
        },
      },
      // Pied de page
      {
        placeholder: {
          options: {
            name: 'slideNumber',
            type: 'sldNum',
            x: 9,
            y: 5.2,
            w: 0.5,
            h: 0.3,
            align: 'right',
            fontSize: FOOTER_CONFIG.fontSize,
            fontFace: ALECIA_FONTS.secondary,
            color: FOOTER_CONFIG.color,
          },
          text: '##',
        },
      },
    ],
  };
}

/**
 * Crée le master de slide de logos clients
 */
export function createClientsSlideMaster(pptx: PptxGenJS): PptxGenJS.SlideMaster {
  return {
    title: 'Clients Slide',
    background: { color: ALECIA_COLORS.primary.dark },
    objects: [
      // Filigrane &
      {
        text: {
          text: WATERMARK_CONFIG.text,
          options: {
            x: 4,
            y: 2,
            w: 2,
            h: 2,
            fontSize: WATERMARK_CONFIG.fontSize,
            color: WATERMARK_CONFIG.color,
            transparency: WATERMARK_CONFIG.opacity,
            align: 'center',
            fontFace: ALECIA_FONTS.primary,
          },
        },
      },
      // Ligne de séparation accent
      {
        rect: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.02,
          fill: { color: ALECIA_COLORS.accent.main },
        },
      },
      // Zone de titre
      {
        placeholder: {
          options: {
            name: 'title',
            type: 'title',
            x: 0.5,
            y: 0.6,
            w: 9,
            h: 0.5,
            align: 'left',
            fontSize: ALECIA_FONTS.sizes.heading1,
            fontFace: ALECIA_FONTS.primary,
            color: ALECIA_COLORS.text.primary,
            bold: true,
          },
          text: 'Nos clients',
        },
      },
      // Zone de logos
      {
        placeholder: {
          options: {
            name: 'logos',
            type: 'body',
            x: 0.5,
            y: 1.4,
            w: 9,
            h: 3.8,
          },
          text: '',
        },
      },
      // Pied de page
      {
        placeholder: {
          options: {
            name: 'slideNumber',
            type: 'sldNum',
            x: 9,
            y: 5.2,
            w: 0.5,
            h: 0.3,
            align: 'right',
            fontSize: FOOTER_CONFIG.fontSize,
            fontFace: ALECIA_FONTS.secondary,
            color: FOOTER_CONFIG.color,
          },
          text: '##',
        },
      },
    ],
  };
}

/**
 * Crée le master de slide séparateur de section
 */
export function createSectionDividerMaster(pptx: PptxGenJS): PptxGenJS.SlideMaster {
  return {
    title: 'Section Divider',
    background: { color: ALECIA_COLORS.primary.dark },
    objects: [
      // Filigrane & (plus grand)
      {
        text: {
          text: WATERMARK_CONFIG.text,
          options: {
            x: 3.5,
            y: 1.5,
            w: 3,
            h: 3,
            fontSize: 250,
            color: WATERMARK_CONFIG.color,
            transparency: 15,
            align: 'center',
            fontFace: ALECIA_FONTS.primary,
          },
        },
      },
      // Ligne accent horizontale
      {
        rect: {
          x: 2,
          y: 2.8,
          w: 6,
          h: 0.05,
          fill: { color: ALECIA_COLORS.accent.main },
        },
      },
      // Zone de titre principal
      {
        placeholder: {
          options: {
            name: 'title',
            type: 'title',
            x: 1,
            y: 2,
            w: 8,
            h: 0.7,
            align: 'center',
            fontSize: 48,
            fontFace: ALECIA_FONTS.primary,
            color: ALECIA_COLORS.text.primary,
            bold: true,
          },
          text: 'Section',
        },
      },
      // Zone de sous-titre
      {
        placeholder: {
          options: {
            name: 'subtitle',
            type: 'body',
            x: 1,
            y: 3,
            w: 8,
            h: 0.5,
            align: 'center',
            fontSize: ALECIA_FONTS.sizes.subtitle,
            fontFace: ALECIA_FONTS.secondary,
            color: ALECIA_COLORS.text.secondary,
          },
          text: 'Description',
        },
      },
      // Pied de page
      {
        placeholder: {
          options: {
            name: 'slideNumber',
            type: 'sldNum',
            x: 9,
            y: 5.2,
            w: 0.5,
            h: 0.3,
            align: 'right',
            fontSize: FOOTER_CONFIG.fontSize,
            fontFace: ALECIA_FONTS.secondary,
            color: FOOTER_CONFIG.color,
          },
          text: '##',
        },
      },
    ],
  };
}

/**
 * Crée le master de slide de fermeture
 */
export function createClosingSlideMaster(pptx: PptxGenJS): PptxGenJS.SlideMaster {
  return {
    title: 'Closing Slide',
    background: { color: ALECIA_COLORS.primary.dark },
    objects: [
      // Filigrane &
      {
        text: {
          text: WATERMARK_CONFIG.text,
          options: {
            x: 4,
            y: 2,
            w: 2,
            h: 2,
            fontSize: WATERMARK_CONFIG.fontSize,
            color: WATERMARK_CONFIG.color,
            transparency: WATERMARK_CONFIG.opacity,
            align: 'center',
            fontFace: ALECIA_FONTS.primary,
          },
        },
      },
      // Ligne accent
      {
        rect: {
          x: 2,
          y: 2.5,
          w: 6,
          h: 0.03,
          fill: { color: ALECIA_COLORS.accent.main },
        },
      },
      // Zone de remerciement
      {
        placeholder: {
          options: {
            name: 'thankYou',
            type: 'title',
            x: 1,
            y: 1.5,
            w: 8,
            h: 0.8,
            align: 'center',
            fontSize: 52,
            fontFace: ALECIA_FONTS.primary,
            color: ALECIA_COLORS.text.primary,
            bold: true,
          },
          text: 'Merci',
        },
      },
      // Zone de contact
      {
        placeholder: {
          options: {
            name: 'contact',
            type: 'body',
            x: 2,
            y: 2.8,
            w: 6,
            h: 2,
            align: 'center',
            fontSize: ALECIA_FONTS.sizes.body,
            fontFace: ALECIA_FONTS.secondary,
            color: ALECIA_COLORS.text.secondary,
          },
          text: 'Contact',
        },
      },
      // Logo (centré en bas)
      {
        rect: {
          x: 4.25,
          y: 4.8,
          w: 1.5,
          h: 0.5,
          fill: { color: 'transparent' },
        },
      },
    ],
  };
}

/**
 * Enregistre tous les masters dans l'instance PptxGenJS
 */
export function registerAllSlideMasters(pptx: PptxGenJS): void {
  pptx.defineSlideMaster(createTitleSlideMaster(pptx));
  pptx.defineSlideMaster(createContentSlideMaster(pptx));
  pptx.defineSlideMaster(createTwoColumnSlideMaster(pptx));
  pptx.defineSlideMaster(createImageSlideMaster(pptx));
  pptx.defineSlideMaster(createChartSlideMaster(pptx));
  pptx.defineSlideMaster(createTableSlideMaster(pptx));
  pptx.defineSlideMaster(createTeamSlideMaster(pptx));
  pptx.defineSlideMaster(createClientsSlideMaster(pptx));
  pptx.defineSlideMaster(createSectionDividerMaster(pptx));
  pptx.defineSlideMaster(createClosingSlideMaster(pptx));
}

/**
 * Liste des noms de masters disponibles
 */
export const SLIDE_MASTER_NAMES = {
  title: 'Title Slide',
  content: 'Content Slide',
  twoColumn: 'Two Column Slide',
  image: 'Image Slide',
  chart: 'Chart Slide',
  table: 'Table Slide',
  team: 'Team Slide',
  clients: 'Clients Slide',
  sectionDivider: 'Section Divider',
  closing: 'Closing Slide',
} as const;
