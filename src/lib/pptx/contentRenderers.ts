/**
 * Content Renderers
 * Fonctions de rendu pour différents types de contenu
 */

import PptxGenJS from 'pptxgenjs';
import {
  ALECIA_COLORS,
  ALECIA_FONTS,
  WATERMARK_CONFIG,
  TEAM_CARD_CONFIG,
  CLIENT_LOGO_CONFIG,
} from './brandStyles';

// Types de contenu
export interface BulletPoint {
  text: string;
  level?: number;
  style?: 'bullet' | 'dash' | 'arrow' | 'square' | 'number';
}

export interface TeamMember {
  name: string;
  role: string;
  photo?: string;
  description?: string;
}

export interface ClientLogo {
  name: string;
  imagePath: string;
}

export interface ContactInfo {
  company?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

/**
 * Rend un filigrane & sur une slide
 */
export function renderWatermark(
  slide: PptxGenJS.Slide,
  x: number = WATERMARK_CONFIG.x,
  y: number = WATERMARK_CONFIG.y,
  opacity: number = WATERMARK_CONFIG.opacity
): void {
  slide.addText(WATERMARK_CONFIG.text, {
    x,
    y,
    w: 2,
    h: 2,
    fontSize: WATERMARK_CONFIG.fontSize,
    color: WATERMARK_CONFIG.color,
    transparency: opacity,
    align: 'center',
    fontFace: ALECIA_FONTS.primary,
  });
}

/**
 * Rend une ligne d'accent
 */
export function renderAccentLine(
  slide: PptxGenJS.Slide,
  x: number,
  y: number,
  width: number,
  height: number = 0.02
): void {
  slide.addShape('rect', {
    x,
    y,
    w: width,
    h: height,
    fill: { color: ALECIA_COLORS.accent.main },
  });
}

/**
 * Rend un titre
 */
export function renderTitle(
  slide: PptxGenJS.Slide,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options: Record<string, unknown> = {}
): void {
  slide.addText(text, {
    x,
    y,
    w: width,
    h: height,
    fontSize: ALECIA_FONTS.sizes.heading1,
    fontFace: ALECIA_FONTS.primary,
    color: ALECIA_COLORS.text.primary,
    bold: true,
    align: 'left',
    ...options,
  });
}

/**
 * Rend une liste à puces
 */
export function renderBulletList(
  slide: PptxGenJS.Slide,
  items: BulletPoint[],
  x: number,
  y: number,
  width: number,
  height: number,
  options: Record<string, unknown> = {}
): void {
  const textItems = items.map((item) => {
    const bulletChar = getBulletChar(item.style || 'bullet');

    return {
      text: `${' '.repeat(item.level || 0)}${bulletChar} ${item.text}`,
      options: {
        indentLevel: item.level || 0,
        paraSpaceAfter: 8,
      },
    };
  });

  slide.addText(textItems, {
    x,
    y,
    w: width,
    h: height,
    fontSize: ALECIA_FONTS.sizes.body,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.primary,
    align: 'left',
    valign: 'top',
    bullet: true,
    ...options,
  });
}

/**
 * Rend un paragraphe de texte
 */
export function renderParagraph(
  slide: PptxGenJS.Slide,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options: Record<string, unknown> = {}
): void {
  slide.addText(text, {
    x,
    y,
    w: width,
    h: height,
    fontSize: ALECIA_FONTS.sizes.body,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.primary,
    align: 'left',
    valign: 'top',
    ...options,
  });
}

/**
 * Rend plusieurs paragraphes
 */
export function renderParagraphs(
  slide: PptxGenJS.Slide,
  paragraphs: string[],
  x: number,
  y: number,
  width: number,
  height: number,
  options: Record<string, unknown> = {}
): void {
  const textItems = paragraphs.map((para) => ({
    text: para,
    options: {
      paraSpaceAfter: 12,
    },
  }));

  slide.addText(textItems, {
    x,
    y,
    w: width,
    h: height,
    fontSize: ALECIA_FONTS.sizes.body,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.primary,
    align: 'left',
    valign: 'top',
    ...options,
  });
}

/**
 * Rend une image
 */
export function renderImage(
  slide: PptxGenJS.Slide,
  imagePath: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options: Record<string, unknown> = {}
): void {
  slide.addImage({
    path: imagePath,
    x,
    y,
    w: width,
    h: height,
    sizing: { type: 'contain', w: width, h: height },
    ...options,
  });
}

/**
 * Rend une carte de membre d'équipe
 */
export function renderTeamMemberCard(
  slide: PptxGenJS.Slide,
  member: TeamMember,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const photoConfig = TEAM_CARD_CONFIG.photo;
  const photoX = x + 0.1;
  const photoY = y + 0.1;

  // Photo
  if (member.photo) {
    slide.addImage({
      path: member.photo,
      x: photoX,
      y: photoY,
      w: photoConfig.width,
      h: photoConfig.height,
      sizing: { type: 'contain', w: photoConfig.width, h: photoConfig.height },
    });
  } else {
    // Placeholder pour la photo
    slide.addShape('rect', {
      x: photoX,
      y: photoY,
      w: photoConfig.width,
      h: photoConfig.height,
      fill: { color: ALECIA_COLORS.primary.main },
      line: { color: ALECIA_COLORS.neutral.darkGray, width: 1 },
    });
  }

  // Nom
  const textX = photoX + photoConfig.width + 0.15;
  slide.addText(member.name, {
    x: textX,
    y: photoY,
    w: width - photoConfig.width - 0.3,
    h: 0.3,
    fontSize: TEAM_CARD_CONFIG.name.fontSize,
    fontFace: TEAM_CARD_CONFIG.name.fontFace,
    color: TEAM_CARD_CONFIG.name.color,
    bold: TEAM_CARD_CONFIG.name.bold,
    align: 'left',
  });

  // Rôle
  slide.addText(member.role, {
    x: textX,
    y: photoY + 0.3,
    w: width - photoConfig.width - 0.3,
    h: 0.25,
    fontSize: TEAM_CARD_CONFIG.role.fontSize,
    fontFace: TEAM_CARD_CONFIG.role.fontFace,
    color: TEAM_CARD_CONFIG.role.color,
    align: 'left',
  });

  // Description (si fournie)
  if (member.description) {
    slide.addText(member.description, {
      x: textX,
      y: photoY + 0.6,
      w: width - photoConfig.width - 0.3,
      h: height - 0.8,
      fontSize: TEAM_CARD_CONFIG.description.fontSize,
      fontFace: TEAM_CARD_CONFIG.description.fontFace,
      color: TEAM_CARD_CONFIG.description.color,
      align: 'left',
      valign: 'top',
    });
  }
}

/**
 * Rend une grille de membres d'équipe
 */
export function renderTeamGrid(
  slide: PptxGenJS.Slide,
  members: TeamMember[],
  startX: number,
  startY: number,
  cardWidth: number,
  cardHeight: number,
  columns: number,
  spacing: number
): void {
  members.forEach((member, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);

    const x = startX + col * (cardWidth + spacing);
    const y = startY + row * (cardHeight + spacing);

    renderTeamMemberCard(slide, member, x, y, cardWidth, cardHeight);
  });
}

/**
 * Rend un logo client
 */
export function renderClientLogo(
  slide: PptxGenJS.Slide,
  logo: ClientLogo,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number
): void {
  slide.addImage({
    path: logo.imagePath,
    x,
    y,
    w: maxWidth,
    h: maxHeight,
    sizing: { type: 'contain', w: maxWidth, h: maxHeight },
  });
}

/**
 * Rend une grille de logos clients
 */
export function renderClientLogoGrid(
  slide: PptxGenJS.Slide,
  logos: ClientLogo[],
  startX: number,
  startY: number,
  cellWidth: number,
  cellHeight: number,
  columns: number,
  spacing: number
): void {
  logos.forEach((logo, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);

    const x = startX + col * (cellWidth + spacing) + (cellWidth - CLIENT_LOGO_CONFIG.maxWidth) / 2;
    const y =
      startY + row * (cellHeight + spacing) + (cellHeight - CLIENT_LOGO_CONFIG.maxHeight) / 2;

    renderClientLogo(slide, logo, x, y, CLIENT_LOGO_CONFIG.maxWidth, CLIENT_LOGO_CONFIG.maxHeight);
  });
}

/**
 * Rend les informations de contact
 */
export function renderContactInfo(
  slide: PptxGenJS.Slide,
  contact: ContactInfo,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const lines: string[] = [];

  if (contact.company) lines.push(contact.company);
  if (contact.address) lines.push(contact.address);
  if (contact.phone) lines.push(`Tél: ${contact.phone}`);
  if (contact.email) lines.push(`Email: ${contact.email}`);
  if (contact.website) lines.push(contact.website);

  const textItems = lines.map((line, index) => ({
    text: line,
    options: {
      paraSpaceAfter: index < lines.length - 1 ? 8 : 0,
    },
  }));

  slide.addText(textItems, {
    x,
    y,
    w: width,
    h: height,
    fontSize: ALECIA_FONTS.sizes.body,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.secondary,
    align: 'center',
    valign: 'top',
  });
}

/**
 * Rend le pied de page standard
 */
export function renderFooter(
  slide: PptxGenJS.Slide,
  pageNumber: number,
  showDate: boolean = true,
  date: string = ''
): void {
  // Texte Alecia
  slide.addText('Alecia - Conseil en gestion de patrimoine', {
    x: 3.5,
    y: 5.2,
    w: 3,
    h: 0.3,
    fontSize: 10,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.muted,
    align: 'center',
  });

  // Numéro de page
  slide.addText(String(pageNumber), {
    x: 9,
    y: 5.2,
    w: 0.5,
    h: 0.3,
    fontSize: 10,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.muted,
    align: 'right',
  });

  // Date
  if (showDate && date) {
    slide.addText(date, {
      x: 0.5,
      y: 5.2,
      w: 2,
      h: 0.3,
      fontSize: 10,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.text.muted,
      align: 'left',
    });
  }
}

/**
 * Rend un en-tête de slide
 */
export function renderHeader(
  slide: PptxGenJS.Slide,
  title: string,
  showAccentLine: boolean = true
): void {
  // Titre
  renderTitle(slide, title, 0.5, 0.5, 9, 0.6);

  // Ligne d'accent
  if (showAccentLine) {
    renderAccentLine(slide, 0.5, 1.15, 9, 0.02);
  }
}

/**
 * Obtient le caractère de puce selon le style
 */
function getBulletChar(style: string): string {
  switch (style) {
    case 'dash':
      return '–';
    case 'arrow':
      return '→';
    case 'square':
      return '■';
    case 'number':
      return '';
    case 'bullet':
    default:
      return '•';
  }
}

/**
 * Rend un bloc de citation
 */
export function renderQuote(
  slide: PptxGenJS.Slide,
  quote: string,
  author: string,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Guillemet ouvrant
  slide.addText('"', {
    x: x - 0.3,
    y: y - 0.2,
    w: 0.5,
    h: 0.5,
    fontSize: 48,
    fontFace: ALECIA_FONTS.primary,
    color: ALECIA_COLORS.accent.main,
    align: 'left',
  });

  // Citation
  slide.addText(quote, {
    x,
    y,
    w: width,
    h: height - 0.5,
    fontSize: ALECIA_FONTS.sizes.heading2,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.primary,
    align: 'left',
    valign: 'top',
    italic: true,
  });

  // Auteur
  slide.addText(`— ${author}`, {
    x,
    y: y + height - 0.4,
    w: width,
    h: 0.4,
    fontSize: ALECIA_FONTS.sizes.body,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.secondary,
    align: 'right',
  });
}

/**
 * Rend une statistique en évidence
 */
export function renderStatistic(
  slide: PptxGenJS.Slide,
  value: string,
  label: string,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Valeur
  slide.addText(value, {
    x,
    y,
    w: width,
    h: height * 0.6,
    fontSize: 48,
    fontFace: ALECIA_FONTS.primary,
    color: ALECIA_COLORS.accent.main,
    bold: true,
    align: 'center',
    valign: 'bottom',
  });

  // Label
  slide.addText(label, {
    x,
    y: y + height * 0.6,
    w: width,
    h: height * 0.4,
    fontSize: ALECIA_FONTS.sizes.body,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.secondary,
    align: 'center',
    valign: 'top',
  });
}

/**
 * Rend une grille de statistiques
 */
export function renderStatisticsGrid(
  slide: PptxGenJS.Slide,
  statistics: { value: string; label: string }[],
  startX: number,
  startY: number,
  itemWidth: number,
  itemHeight: number,
  columns: number,
  spacing: number
): void {
  statistics.forEach((stat, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);

    const x = startX + col * (itemWidth + spacing);
    const y = startY + row * (itemHeight + spacing);

    renderStatistic(slide, stat.value, stat.label, x, y, itemWidth, itemHeight);
  });
}

/**
 * Rend une barre de progression
 */
export function renderProgressBar(
  slide: PptxGenJS.Slide,
  label: string,
  percentage: number,
  x: number,
  y: number,
  width: number,
  height: number = 0.2
): void {
  // Label
  slide.addText(label, {
    x,
    y: y - 0.3,
    w: width,
    h: 0.25,
    fontSize: ALECIA_FONTS.sizes.small,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.secondary,
    align: 'left',
  });

  // Barre de fond
  slide.addShape('rect', {
    x,
    y,
    w: width,
    h: height,
    fill: { color: ALECIA_COLORS.primary.main },
    line: { color: ALECIA_COLORS.neutral.darkGray, width: 0.5 },
  });

  // Barre de progression
  slide.addShape('rect', {
    x,
    y,
    w: width * (percentage / 100),
    h: height,
    fill: { color: ALECIA_COLORS.accent.main },
  });

  // Pourcentage
  slide.addText(`${percentage}%`, {
    x: x + width - 0.5,
    y: y - 0.3,
    w: 0.5,
    h: 0.25,
    fontSize: ALECIA_FONTS.sizes.small,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.accent.main,
    align: 'right',
  });
}

/**
 * Rend un encadré d'information
 */
export function renderInfoBox(
  slide: PptxGenJS.Slide,
  title: string,
  content: string,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Fond
  slide.addShape('rect', {
    x,
    y,
    w: width,
    h: height,
    fill: { color: ALECIA_COLORS.primary.main },
    line: { color: ALECIA_COLORS.accent.main, width: 2 },
  });

  // Titre
  slide.addText(title, {
    x: x + 0.15,
    y: y + 0.1,
    w: width - 0.3,
    h: 0.35,
    fontSize: ALECIA_FONTS.sizes.heading3,
    fontFace: ALECIA_FONTS.primary,
    color: ALECIA_COLORS.accent.main,
    bold: true,
    align: 'left',
  });

  // Contenu
  slide.addText(content, {
    x: x + 0.15,
    y: y + 0.5,
    w: width - 0.3,
    h: height - 0.65,
    fontSize: ALECIA_FONTS.sizes.body,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.primary,
    align: 'left',
    valign: 'top',
  });
}

/**
 * Rend une étape de processus
 */
export function renderProcessStep(
  slide: PptxGenJS.Slide,
  stepNumber: number,
  title: string,
  description: string,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Cercle avec numéro
  slide.addShape('ellipse', {
    x: x,
    y: y,
    w: 0.5,
    h: 0.5,
    fill: { color: ALECIA_COLORS.accent.main },
  });

  slide.addText(String(stepNumber), {
    x,
    y: y + 0.05,
    w: 0.5,
    h: 0.4,
    fontSize: 20,
    fontFace: ALECIA_FONTS.primary,
    color: ALECIA_COLORS.neutral.white,
    bold: true,
    align: 'center',
  });

  // Titre
  slide.addText(title, {
    x: x + 0.6,
    y,
    w: width - 0.6,
    h: 0.3,
    fontSize: ALECIA_FONTS.sizes.heading3,
    fontFace: ALECIA_FONTS.primary,
    color: ALECIA_COLORS.text.primary,
    bold: true,
    align: 'left',
  });

  // Description
  slide.addText(description, {
    x: x + 0.6,
    y: y + 0.35,
    w: width - 0.6,
    h: height - 0.4,
    fontSize: ALECIA_FONTS.sizes.small,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.secondary,
    align: 'left',
    valign: 'top',
  });
}

/**
 * Rend une chronologie
 */
export function renderTimeline(
  slide: PptxGenJS.Slide,
  events: { year: string; title: string; description: string }[],
  startX: number,
  startY: number,
  width: number,
  height: number
): void {
  const itemWidth = width / events.length;

  // Ligne horizontale
  slide.addShape('rect', {
    x: startX,
    y: startY + 0.3,
    w: width,
    h: 0.03,
    fill: { color: ALECIA_COLORS.accent.main },
  });

  events.forEach((event, index) => {
    const x = startX + index * itemWidth;

    // Point sur la ligne
    slide.addShape('ellipse', {
      x: x + itemWidth / 2 - 0.1,
      y: startY + 0.2,
      w: 0.2,
      h: 0.2,
      fill: { color: ALECIA_COLORS.accent.main },
    });

    // Année
    slide.addText(event.year, {
      x,
      y: startY,
      w: itemWidth,
      h: 0.25,
      fontSize: ALECIA_FONTS.sizes.small,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.accent.main,
      bold: true,
      align: 'center',
    });

    // Titre
    slide.addText(event.title, {
      x,
      y: startY + 0.5,
      w: itemWidth,
      h: 0.3,
      fontSize: ALECIA_FONTS.sizes.body,
      fontFace: ALECIA_FONTS.primary,
      color: ALECIA_COLORS.text.primary,
      bold: true,
      align: 'center',
    });

    // Description
    slide.addText(event.description, {
      x: x + 0.1,
      y: startY + 0.85,
      w: itemWidth - 0.2,
      h: height - 1,
      fontSize: ALECIA_FONTS.sizes.small,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.text.secondary,
      align: 'center',
      valign: 'top',
    });
  });
}
