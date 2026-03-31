/**
 * PPTX Generator
 * Générateur principal de présentations PowerPoint pour Alecia
 */

import PptxGenJS from 'pptxgenjs';
import {
  ALECIA_COLORS,
  DEFAULT_GENERATION_OPTIONS,
  ALECIA_FONTS,
  SLIDE_DIMENSIONS,
  WATERMARK_CONFIG,
  type TemplateVariables,
  type GenerationOptions,
  type SlideType,
} from './brandStyles';
import { registerAllSlideMasters, SLIDE_MASTER_NAMES } from './slideMasters';
import { ALL_LAYOUTS } from './slideLayouts';
import {
  renderWatermark,
  renderAccentLine,
  renderTitle,
  renderBulletList,
  renderParagraph,
  renderParagraphs,
  renderImage,
  renderTeamGrid,
  renderClientLogoGrid,
  renderContactInfo,
  renderFooter,
  type BulletPoint,
  type TeamMember,
  type ClientLogo,
  type ContactInfo,
} from './contentRenderers';
import {
  generateBarChart,
  generateHorizontalBarChart,
  generateStackedBarChart,
  generateLineChart,
  generateAreaChart,
  generatePieChart,
  generateDoughnutChart,
  type BarChartData,
  type LineChartData,
  type PieChartData,
  type DoughnutChartData,
  type AreaChartData,
} from './chartGenerator';
import {
  generateTable,
  generateFinancialTable,
  generatePortfolioTable,
  generatePerformanceTable,
  generateFeeTable,
  generateContactTable,
  type TableData,
  type FinancialTableData,
} from './tableGenerator';

// Interfaces pour les slides
export interface TitleSlideData {
  type: 'title';
  title: string;
  subtitle?: string;
  date?: string;
  logo?: string;
}

export interface ContentSlideData {
  type: 'content';
  title: string;
  content: string | string[] | BulletPoint[];
  showWatermark?: boolean;
}

export interface TwoColumnSlideData {
  type: 'twoColumn';
  title: string;
  leftColumn: string | string[] | BulletPoint[];
  rightColumn: string | string[] | BulletPoint[];
}

export interface ImageSlideData {
  type: 'image';
  title?: string;
  imagePath: string;
  text?: string | string[];
  layout?: 'full' | 'left' | 'right';
}

export interface ChartSlideData {
  type: 'chart';
  title: string;
  chartType: 'bar' | 'horizontalBar' | 'stackedBar' | 'line' | 'area' | 'pie' | 'doughnut';
  data: BarChartData | LineChartData | PieChartData | DoughnutChartData | AreaChartData;
  options?: {
    showLegend?: boolean;
    showValue?: boolean;
    showPercent?: boolean;
  };
}

export interface TableSlideData {
  type: 'table';
  title: string;
  tableType:
    | 'standard'
    | 'financial'
    | 'comparison'
    | 'portfolio'
    | 'performance'
    | 'fee'
    | 'contact';
  data: TableData | FinancialTableData | any;
  options?: {
    colW?: number[];
    alignHeader?: 'left' | 'center' | 'right';
    alignCells?: 'left' | 'center' | 'right';
  };
}

export interface TeamSlideData {
  type: 'team';
  title: string;
  members: TeamMember[];
}

export interface ClientsSlideData {
  type: 'clients';
  title: string;
  logos: ClientLogo[];
}

export interface SectionDividerSlideData {
  type: 'sectionDivider';
  title: string;
  subtitle?: string;
}

export interface ClosingSlideData {
  type: 'closing';
  thankYouText?: string;
  contactInfo?: ContactInfo;
  logo?: string;
}

// Union type pour tous les types de slides
export type SlideData =
  | TitleSlideData
  | ContentSlideData
  | TwoColumnSlideData
  | ImageSlideData
  | ChartSlideData
  | TableSlideData
  | TeamSlideData
  | ClientsSlideData
  | SectionDividerSlideData
  | ClosingSlideData;

// Interface pour la présentation
export interface PresentationData {
  title: string;
  subject?: string;
  author?: string;
  company?: string;
  slides: SlideData[];
  variables?: TemplateVariables;
}

/**
 * Classe principale du générateur PPTX
 */
export class AleciaPptxGenerator {
  private pptx: PptxGenJS;
  private options: GenerationOptions;
  private currentSlideNumber: number = 0;
  private presentationDate: string;

  constructor(options: GenerationOptions = {}) {
    this.options = { ...DEFAULT_GENERATION_OPTIONS, ...options };
    this.pptx = new PptxGenJS();
    this.presentationDate = this.formatDate(new Date());

    this.initializePresentation();
  }

  /**
   * Initialise la présentation avec les paramètres de base
   */
  private initializePresentation(): void {
    // Configuration de la présentation
    this.pptx.layout = 'LAYOUT_16x9';
    this.pptx.author = 'Alecia';
    this.pptx.company = 'Alecia - Conseil en gestion de patrimoine';
    this.pptx.subject = 'Présentation Alecia';
    this.pptx.title = 'Présentation';

    // Enregistrer les masters de slides
    registerAllSlideMasters(this.pptx);
  }

  /**
   * Génère une présentation complète
   */
  public generatePresentation(data: PresentationData): PptxGenJS {
    // Mettre à jour les métadonnées
    this.pptx.title = data.title;
    if (data.subject) this.pptx.subject = data.subject;
    if (data.author) this.pptx.author = data.author;
    if (data.company) this.pptx.company = data.company;

    // Appliquer les variables de substitution
    const processedData = this.applyVariables(data, data.variables || {});

    // Générer chaque slide
    processedData.slides.forEach((slideData) => {
      this.generateSlide(slideData);
    });

    return this.pptx;
  }

  /**
   * Génère une slide selon son type
   */
  private generateSlide(slideData: SlideData): void {
    this.currentSlideNumber++;

    switch (slideData.type) {
      case 'title':
        this.generateTitleSlide(slideData);
        break;
      case 'content':
        this.generateContentSlide(slideData);
        break;
      case 'twoColumn':
        this.generateTwoColumnSlide(slideData);
        break;
      case 'image':
        this.generateImageSlide(slideData);
        break;
      case 'chart':
        this.generateChartSlide(slideData);
        break;
      case 'table':
        this.generateTableSlide(slideData);
        break;
      case 'team':
        this.generateTeamSlide(slideData);
        break;
      case 'clients':
        this.generateClientsSlide(slideData);
        break;
      case 'sectionDivider':
        this.generateSectionDividerSlide(slideData);
        break;
      case 'closing':
        this.generateClosingSlide(slideData);
        break;
      default:
        console.warn(`Type de slide non supporté: ${(slideData as any).type}`);
    }
  }

  /**
   * Génère une slide de titre
   */
  private generateTitleSlide(data: TitleSlideData): void {
    const slide = this.pptx.addSlide({ masterName: SLIDE_MASTER_NAMES.title });
    const layout = ALL_LAYOUTS.title;

    // Fond
    slide.background = { color: ALECIA_COLORS.primary.dark };

    // Filigrane
    if (this.options.includeWatermark) {
      renderWatermark(slide, 4, 1.8);
    }

    // Logo
    if (data.logo && this.options.includeLogo) {
      renderImage(slide, data.logo, layout.logo.x, layout.logo.y, layout.logo.w, layout.logo.h);
    }

    // Titre
    slide.addText(data.title, {
      x: layout.title.x,
      y: layout.title.y,
      w: layout.title.w,
      h: layout.title.h,
      ...layout.title.options,
    });

    // Sous-titre
    if (data.subtitle) {
      slide.addText(data.subtitle, {
        x: layout.subtitle.x,
        y: layout.subtitle.y,
        w: layout.subtitle.w,
        h: layout.subtitle.h,
        ...layout.subtitle.options,
      });
    }

    // Date
    if (this.options.includeDate) {
      const dateText = data.date || this.presentationDate;
      slide.addText(dateText, {
        x: layout.date.x,
        y: layout.date.y,
        w: layout.date.w,
        h: layout.date.h,
        ...layout.date.options,
      });
    }
  }

  /**
   * Génère une slide de contenu
   */
  private generateContentSlide(data: ContentSlideData): void {
    const slide = this.pptx.addSlide({ masterName: SLIDE_MASTER_NAMES.content });
    const layout = ALL_LAYOUTS.content;

    // Fond
    slide.background = { color: layout.background.color };

    // Filigrane
    if (data.showWatermark !== false && this.options.includeWatermark) {
      renderWatermark(slide, 4, 2);
    }

    // Ligne d'accent
    renderAccentLine(
      slide,
      layout.header.accentLine.x,
      layout.header.accentLine.y,
      layout.header.accentLine.w,
      layout.header.accentLine.h
    );

    // Titre
    renderTitle(slide, data.title, layout.title.x, layout.title.y, layout.title.w, layout.title.h);

    // Contenu
    if (Array.isArray(data.content)) {
      if (this.isBulletPointArray(data.content)) {
        renderBulletList(
          slide,
          data.content,
          layout.content.x,
          layout.content.y,
          layout.content.w,
          layout.content.h
        );
      } else {
        renderParagraphs(
          slide,
          data.content as string[],
          layout.content.x,
          layout.content.y,
          layout.content.w,
          layout.content.h
        );
      }
    } else {
      renderParagraph(
        slide,
        data.content,
        layout.content.x,
        layout.content.y,
        layout.content.w,
        layout.content.h
      );
    }

    // Pied de page
    if (this.options.includeFooter) {
      renderFooter(
        slide,
        this.currentSlideNumber,
        this.options.includeDate!,
        this.presentationDate
      );
    }
  }

  /**
   * Génère une slide à deux colonnes
   */
  private generateTwoColumnSlide(data: TwoColumnSlideData): void {
    const slide = this.pptx.addSlide({ masterName: SLIDE_MASTER_NAMES.twoColumn });
    const layout = ALL_LAYOUTS.twoColumn;

    // Fond
    slide.background = { color: layout.background.color };

    // Filigrane
    if (this.options.includeWatermark) {
      renderWatermark(slide, 4, 2);
    }

    // Ligne d'accent
    renderAccentLine(
      slide,
      layout.header.accentLine.x,
      layout.header.accentLine.y,
      layout.header.accentLine.w,
      layout.header.accentLine.h
    );

    // Ligne de séparation verticale
    slide.addShape('rect', {
      x: layout.divider.x,
      y: layout.divider.y,
      w: layout.divider.w,
      h: layout.divider.h,
      fill: { color: layout.divider.color },
    });

    // Titre
    renderTitle(slide, data.title, layout.title.x, layout.title.y, layout.title.w, layout.title.h);

    // Colonne gauche
    if (Array.isArray(data.leftColumn)) {
      if (this.isBulletPointArray(data.leftColumn)) {
        renderBulletList(
          slide,
          data.leftColumn,
          layout.leftColumn.x,
          layout.leftColumn.y,
          layout.leftColumn.w,
          layout.leftColumn.h
        );
      } else {
        renderParagraphs(
          slide,
          data.leftColumn as string[],
          layout.leftColumn.x,
          layout.leftColumn.y,
          layout.leftColumn.w,
          layout.leftColumn.h
        );
      }
    } else {
      renderParagraph(
        slide,
        data.leftColumn,
        layout.leftColumn.x,
        layout.leftColumn.y,
        layout.leftColumn.w,
        layout.leftColumn.h
      );
    }

    // Colonne droite
    if (Array.isArray(data.rightColumn)) {
      if (this.isBulletPointArray(data.rightColumn)) {
        renderBulletList(
          slide,
          data.rightColumn,
          layout.rightColumn.x,
          layout.rightColumn.y,
          layout.rightColumn.w,
          layout.rightColumn.h
        );
      } else {
        renderParagraphs(
          slide,
          data.rightColumn as string[],
          layout.rightColumn.x,
          layout.rightColumn.y,
          layout.rightColumn.w,
          layout.rightColumn.h
        );
      }
    } else {
      renderParagraph(
        slide,
        data.rightColumn,
        layout.rightColumn.x,
        layout.rightColumn.y,
        layout.rightColumn.w,
        layout.rightColumn.h
      );
    }

    // Pied de page
    if (this.options.includeFooter) {
      renderFooter(
        slide,
        this.currentSlideNumber,
        this.options.includeDate!,
        this.presentationDate
      );
    }
  }

  /**
   * Génère une slide avec image
   */
  private generateImageSlide(data: ImageSlideData): void {
    const slide = this.pptx.addSlide({ masterName: SLIDE_MASTER_NAMES.image });
    const layout = ALL_LAYOUTS.image;

    // Fond
    slide.background = { color: layout.background.color };

    // Filigrane
    if (this.options.includeWatermark) {
      renderWatermark(slide, 4, 2);
    }

    // Titre
    if (data.title) {
      renderTitle(
        slide,
        data.title,
        layout.title.x,
        layout.title.y,
        layout.title.w,
        layout.title.h
      );
    }

    // Image et texte selon le layout
    const imageLayout = data.layout || 'left';

    if (imageLayout === 'full') {
      renderImage(
        slide,
        data.imagePath,
        layout.image.fullImage.x,
        layout.image.fullImage.y,
        layout.image.fullImage.w,
        layout.image.fullImage.h
      );
    } else if (imageLayout === 'left') {
      renderImage(
        slide,
        data.imagePath,
        layout.image.leftImage.x,
        layout.image.leftImage.y,
        layout.image.leftImage.w,
        layout.image.leftImage.h
      );
      if (data.text) {
        if (Array.isArray(data.text)) {
          renderParagraphs(
            slide,
            data.text,
            layout.text.x,
            layout.text.y,
            layout.text.w,
            layout.text.h
          );
        } else {
          renderParagraph(
            slide,
            data.text,
            layout.text.x,
            layout.text.y,
            layout.text.w,
            layout.text.h
          );
        }
      }
    } else {
      // right layout
      renderImage(
        slide,
        data.imagePath,
        layout.image.rightImage.x,
        layout.image.rightImage.y,
        layout.image.rightImage.w,
        layout.image.rightImage.h
      );
      if (data.text) {
        const textX = layout.image.leftImage.x;
        if (Array.isArray(data.text)) {
          renderParagraphs(
            slide,
            data.text,
            textX,
            layout.text.y,
            layout.image.leftImage.w,
            layout.text.h
          );
        } else {
          renderParagraph(
            slide,
            data.text,
            textX,
            layout.text.y,
            layout.image.leftImage.w,
            layout.text.h
          );
        }
      }
    }

    // Pied de page
    if (this.options.includeFooter) {
      renderFooter(
        slide,
        this.currentSlideNumber,
        this.options.includeDate!,
        this.presentationDate
      );
    }
  }

  /**
   * Génère une slide de graphique
   */
  private generateChartSlide(data: ChartSlideData): void {
    const slide = this.pptx.addSlide({ masterName: SLIDE_MASTER_NAMES.chart });
    const layout = ALL_LAYOUTS.chart;

    // Fond
    slide.background = { color: layout.background.color };

    // Filigrane
    if (this.options.includeWatermark) {
      renderWatermark(slide, 4, 2);
    }

    // Ligne d'accent
    renderAccentLine(
      slide,
      layout.header.accentLine.x,
      layout.header.accentLine.y,
      layout.header.accentLine.w,
      layout.header.accentLine.h
    );

    // Titre
    renderTitle(slide, data.title, layout.title.x, layout.title.y, layout.title.w, layout.title.h);

    // Graphique selon le type
    const chartOptions = {
      title: '',
      showLegend: data.options?.showLegend ?? true,
      showValue: data.options?.showValue ?? false,
      showPercent: data.options?.showPercent ?? true,
    };

    switch (data.chartType) {
      case 'bar':
        generateBarChart(
          slide,
          data.data as BarChartData,
          layout.chart.x,
          layout.chart.y,
          layout.chart.w,
          layout.chart.h,
          chartOptions
        );
        break;
      case 'horizontalBar':
        generateHorizontalBarChart(
          slide,
          data.data as BarChartData,
          layout.chart.x,
          layout.chart.y,
          layout.chart.w,
          layout.chart.h,
          chartOptions
        );
        break;
      case 'stackedBar':
        generateStackedBarChart(
          slide,
          data.data as BarChartData,
          layout.chart.x,
          layout.chart.y,
          layout.chart.w,
          layout.chart.h,
          chartOptions
        );
        break;
      case 'line':
        generateLineChart(
          slide,
          data.data as LineChartData,
          layout.chart.x,
          layout.chart.y,
          layout.chart.w,
          layout.chart.h,
          chartOptions
        );
        break;
      case 'area':
        generateAreaChart(
          slide,
          data.data as AreaChartData,
          layout.chart.x,
          layout.chart.y,
          layout.chart.w,
          layout.chart.h,
          chartOptions
        );
        break;
      case 'pie':
        generatePieChart(
          slide,
          data.data as PieChartData,
          layout.chart.x,
          layout.chart.y,
          layout.chart.w,
          layout.chart.h,
          chartOptions
        );
        break;
      case 'doughnut':
        generateDoughnutChart(
          slide,
          data.data as DoughnutChartData,
          layout.chart.x,
          layout.chart.y,
          layout.chart.w,
          layout.chart.h,
          chartOptions
        );
        break;
    }

    // Pied de page
    if (this.options.includeFooter) {
      renderFooter(
        slide,
        this.currentSlideNumber,
        this.options.includeDate!,
        this.presentationDate
      );
    }
  }

  /**
   * Génère une slide de tableau
   */
  private generateTableSlide(data: TableSlideData): void {
    const slide = this.pptx.addSlide({ masterName: SLIDE_MASTER_NAMES.table });
    const layout = ALL_LAYOUTS.table;

    // Fond
    slide.background = { color: layout.background.color };

    // Filigrane
    if (this.options.includeWatermark) {
      renderWatermark(slide, 4, 2);
    }

    // Ligne d'accent
    renderAccentLine(
      slide,
      layout.header.accentLine.x,
      layout.header.accentLine.y,
      layout.header.accentLine.w,
      layout.header.accentLine.h
    );

    // Titre
    renderTitle(slide, data.title, layout.title.x, layout.title.y, layout.title.w, layout.title.h);

    // Tableau selon le type
    const tableOptions = {
      colW: data.options?.colW,
      alignHeader: data.options?.alignHeader,
      alignCells: data.options?.alignCells,
    };

    switch (data.tableType) {
      case 'standard':
        generateTable(
          slide,
          data.data as TableData,
          layout.table.x,
          layout.table.y,
          layout.table.w,
          layout.table.h,
          tableOptions
        );
        break;
      case 'financial':
        generateFinancialTable(
          slide,
          data.data as FinancialTableData,
          layout.table.x,
          layout.table.y,
          layout.table.w,
          layout.table.h,
          tableOptions
        );
        break;
      case 'comparison':
        // Pour comparison, on utilise generateTable avec des données adaptées
        generateTable(
          slide,
          data.data as TableData,
          layout.table.x,
          layout.table.y,
          layout.table.w,
          layout.table.h,
          tableOptions
        );
        break;
      case 'portfolio':
        generatePortfolioTable(
          slide,
          data.data as any,
          layout.table.x,
          layout.table.y,
          layout.table.w,
          layout.table.h
        );
        break;
      case 'performance':
        const perfData = data.data as any;
        generatePerformanceTable(
          slide,
          perfData.periods,
          perfData.performances,
          layout.table.x,
          layout.table.y,
          layout.table.w,
          layout.table.h
        );
        break;
      case 'fee':
        generateFeeTable(
          slide,
          data.data as any,
          layout.table.x,
          layout.table.y,
          layout.table.w,
          layout.table.h
        );
        break;
      case 'contact':
        generateContactTable(
          slide,
          data.data as any,
          layout.table.x,
          layout.table.y,
          layout.table.w,
          layout.table.h
        );
        break;
    }

    // Pied de page
    if (this.options.includeFooter) {
      renderFooter(
        slide,
        this.currentSlideNumber,
        this.options.includeDate!,
        this.presentationDate
      );
    }
  }

  /**
   * Génère une slide d'équipe
   */
  private generateTeamSlide(data: TeamSlideData): void {
    const slide = this.pptx.addSlide({ masterName: SLIDE_MASTER_NAMES.team });
    const layout = ALL_LAYOUTS.team;

    // Fond
    slide.background = { color: layout.background.color };

    // Filigrane
    if (this.options.includeWatermark) {
      renderWatermark(slide, 4, 2);
    }

    // Ligne d'accent
    renderAccentLine(
      slide,
      layout.header.accentLine.x,
      layout.header.accentLine.y,
      layout.header.accentLine.w,
      layout.header.accentLine.h
    );

    // Titre
    renderTitle(slide, data.title, layout.title.x, layout.title.y, layout.title.w, layout.title.h);

    // Grille d'équipe
    renderTeamGrid(
      slide,
      data.members,
      layout.teamGrid.x,
      layout.teamGrid.y,
      layout.teamGrid.cardWidth,
      layout.teamGrid.cardHeight,
      layout.teamGrid.columns,
      layout.teamGrid.spacing
    );

    // Pied de page
    if (this.options.includeFooter) {
      renderFooter(
        slide,
        this.currentSlideNumber,
        this.options.includeDate!,
        this.presentationDate
      );
    }
  }

  /**
   * Génère une slide de logos clients
   */
  private generateClientsSlide(data: ClientsSlideData): void {
    const slide = this.pptx.addSlide({ masterName: SLIDE_MASTER_NAMES.clients });
    const layout = ALL_LAYOUTS.clients;

    // Fond
    slide.background = { color: layout.background.color };

    // Filigrane
    if (this.options.includeWatermark) {
      renderWatermark(slide, 4, 2);
    }

    // Ligne d'accent
    renderAccentLine(
      slide,
      layout.header.accentLine.x,
      layout.header.accentLine.y,
      layout.header.accentLine.w,
      layout.header.accentLine.h
    );

    // Titre
    renderTitle(slide, data.title, layout.title.x, layout.title.y, layout.title.w, layout.title.h);

    // Grille de logos
    renderClientLogoGrid(
      slide,
      data.logos,
      layout.logoGrid.x,
      layout.logoGrid.y,
      layout.logoGrid.cellWidth,
      layout.logoGrid.cellHeight,
      layout.logoGrid.columns,
      layout.logoGrid.spacing
    );

    // Pied de page
    if (this.options.includeFooter) {
      renderFooter(
        slide,
        this.currentSlideNumber,
        this.options.includeDate!,
        this.presentationDate
      );
    }
  }

  /**
   * Génère une slide séparateur de section
   */
  private generateSectionDividerSlide(data: SectionDividerSlideData): void {
    const slide = this.pptx.addSlide({ masterName: SLIDE_MASTER_NAMES.sectionDivider });
    const layout = ALL_LAYOUTS.sectionDivider;

    // Fond
    slide.background = { color: layout.background.color };

    // Filigrane (plus visible sur les séparateurs)
    if (this.options.includeWatermark) {
      renderWatermark(slide, 3.5, 1.5, 15);
    }

    // Ligne d'accent
    slide.addShape('rect', {
      x: layout.accentLine.x,
      y: layout.accentLine.y,
      w: layout.accentLine.w,
      h: layout.accentLine.h,
      fill: { color: layout.accentLine.color },
    });

    // Titre principal
    slide.addText(data.title, {
      x: layout.title.x,
      y: layout.title.y,
      w: layout.title.w,
      h: layout.title.h,
      ...layout.title.options,
    });

    // Sous-titre
    if (data.subtitle) {
      slide.addText(data.subtitle, {
        x: layout.subtitle.x,
        y: layout.subtitle.y,
        w: layout.subtitle.w,
        h: layout.subtitle.h,
        ...layout.subtitle.options,
      });
    }

    // Pied de page (numéro uniquement)
    if (this.options.includeFooter) {
      slide.addText(String(this.currentSlideNumber), {
        x: layout.footer.pageNumber.x,
        y: layout.footer.pageNumber.y,
        w: layout.footer.pageNumber.w,
        h: layout.footer.pageNumber.h,
        ...layout.footer.pageNumber.options,
      });
    }
  }

  /**
   * Génère une slide de fermeture
   */
  private generateClosingSlide(data: ClosingSlideData): void {
    const slide = this.pptx.addSlide({ masterName: SLIDE_MASTER_NAMES.closing });
    const layout = ALL_LAYOUTS.closing;

    // Fond
    slide.background = { color: ALECIA_COLORS.primary.dark };

    // Filigrane
    if (this.options.includeWatermark) {
      renderWatermark(slide, 4, 1.8);
    }

    // Ligne d'accent
    slide.addShape('rect', {
      x: layout.accentLine.x,
      y: layout.accentLine.y,
      w: layout.accentLine.w,
      h: layout.accentLine.h,
      fill: { color: layout.accentLine.color },
    });

    // Texte de remerciement
    const thankYouText = data.thankYouText || 'Merci';
    slide.addText(thankYouText, {
      x: layout.thankYou.x,
      y: layout.thankYou.y,
      w: layout.thankYou.w,
      h: layout.thankYou.h,
      ...layout.thankYou.options,
    });

    // Informations de contact
    if (data.contactInfo) {
      renderContactInfo(
        slide,
        data.contactInfo,
        layout.contact.x,
        layout.contact.y,
        layout.contact.w,
        layout.contact.h
      );
    }

    // Logo
    if (data.logo && this.options.includeLogo) {
      renderImage(slide, data.logo, layout.logo.x, layout.logo.y, layout.logo.w, layout.logo.h);
    }
  }

  /**
   * Applique les variables de substitution aux données
   */
  private applyVariables(data: PresentationData, variables: TemplateVariables): PresentationData {
    const jsonString = JSON.stringify(data);
    let processedString = jsonString;

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processedString = processedString.split(placeholder).join(String(value));
    });

    return JSON.parse(processedString);
  }

  /**
   * Vérifie si un tableau est un tableau de BulletPoint
   */
  private isBulletPointArray(arr: any[]): arr is BulletPoint[] {
    return arr.length > 0 && typeof arr[0] === 'object' && 'text' in arr[0];
  }

  /**
   * Formate une date selon le format configuré
   */
  private formatDate(date: Date): string {
    const format = this.options.dateFormat || 'DD/MM/YYYY';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    return format.replace('DD', day).replace('MM', month).replace('YYYY', year);
  }

  /**
   * Sauvegarde la présentation dans un fichier
   */
  public async save(fileName: string = 'presentation.pptx'): Promise<void> {
    await this.pptx.writeFile({ fileName });
  }

  /**
   * Retourne la présentation sous forme de buffer
   */
  public async getBuffer(): Promise<Blob | ArrayBuffer> {
    return await this.pptx.write({ outputType: 'arraybuffer' });
  }

  /**
   * Retourne la présentation sous forme de base64
   */
  public async getBase64(): Promise<string> {
    return await this.pptx.write({ outputType: 'base64' });
  }

  /**
   * Retourne l'instance PptxGenJS
   */
  public getPptxInstance(): PptxGenJS {
    return this.pptx;
  }
}

/**
 * Fonction utilitaire pour créer rapidement une présentation
 */
export async function createPresentation(
  data: PresentationData,
  options: GenerationOptions = {}
): Promise<PptxGenJS> {
  const generator = new AleciaPptxGenerator(options);
  return generator.generatePresentation(data);
}

/**
 * Fonction utilitaire pour sauvegarder une présentation
 */
export async function savePresentation(
  data: PresentationData,
  fileName: string,
  options: GenerationOptions = {}
): Promise<void> {
  const generator = new AleciaPptxGenerator(options);
  generator.generatePresentation(data);
  await generator.save(fileName);
}

// Export des types et fonctions utilitaires
export {
  // Types de brandStyles
  type TemplateVariables,
  type GenerationOptions,
  type SlideType,
  // Types de contentRenderers
  type BulletPoint,
  type TeamMember,
  type ClientLogo,
  type ContactInfo,
  // Types de chartGenerator
  type BarChartData,
  type LineChartData,
  type PieChartData,
  type DoughnutChartData,
  type AreaChartData,
  // Types de tableGenerator
  type TableData,
  type FinancialTableData,
};

// Export des constantes
export { ALECIA_COLORS, ALECIA_FONTS, SLIDE_DIMENSIONS, WATERMARK_CONFIG };
