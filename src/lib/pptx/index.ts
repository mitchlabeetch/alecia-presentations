/**
 * Alecia PPTX Generator
 * Module de génération de présentations PowerPoint pour Alecia
 */

// Export du générateur principal
export {
  AleciaPptxGenerator,
  createPresentation,
  savePresentation,
} from './pptxGenerator';

// Export des types du générateur
export type {
  // Slides
  TitleSlideData,
  ContentSlideData,
  TwoColumnSlideData,
  ImageSlideData,
  ChartSlideData,
  TableSlideData,
  TeamSlideData,
  ClientsSlideData,
  SectionDividerSlideData,
  ClosingSlideData,
  SlideData,
  PresentationData,
} from './pptxGenerator';

// Export des styles de marque
export {
  ALECIA_COLORS,
  ALECIA_FONTS,
  ALECIA_SPACING,
  SLIDE_DIMENSIONS,
  WATERMARK_CONFIG,
  LOGO_CONFIG,
  FOOTER_CONFIG,
  BORDER_STYLES,
  TABLE_STYLES,
  CHART_STYLES,
  BULLET_STYLES,
  TEAM_CARD_CONFIG,
  CLIENT_LOGO_CONFIG,
  SLIDE_TYPES,
  DEFAULT_GENERATION_OPTIONS,
} from './brandStyles';

// Export des types de brandStyles
export type {
  TemplateVariables,
  GenerationOptions,
  SlideType,
} from './brandStyles';

// Export des slide masters
export {
  createTitleSlideMaster,
  createContentSlideMaster,
  createTwoColumnSlideMaster,
  createImageSlideMaster,
  createChartSlideMaster,
  createTableSlideMaster,
  createTeamSlideMaster,
  createClientsSlideMaster,
  createSectionDividerMaster,
  createClosingSlideMaster,
  registerAllSlideMasters,
  SLIDE_MASTER_NAMES,
} from './slideMasters';

// Export des layouts
export {
  ALL_LAYOUTS,
  TITLE_SLIDE_LAYOUT,
  CONTENT_SLIDE_LAYOUT,
  TWO_COLUMN_SLIDE_LAYOUT,
  IMAGE_SLIDE_LAYOUT,
  CHART_SLIDE_LAYOUT,
  TABLE_SLIDE_LAYOUT,
  TEAM_SLIDE_LAYOUT,
  CLIENTS_SLIDE_LAYOUT,
  SECTION_DIVIDER_LAYOUT,
  CLOSING_SLIDE_LAYOUT,
  getLayout,
  calculateGridPositions,
  calculateTeamCardPositions,
  calculateClientLogoPositions,
} from './slideLayouts';

// Export des types de layouts
export type {
  SlideLayoutType,
  Position,
  TextOptions,
} from './slideLayouts';

// Export des renderers de contenu
export {
  renderWatermark,
  renderAccentLine,
  renderTitle,
  renderBulletList,
  renderParagraph,
  renderParagraphs,
  renderImage,
  renderTeamMemberCard,
  renderTeamGrid,
  renderClientLogo,
  renderClientLogoGrid,
  renderContactInfo,
  renderFooter,
  renderHeader,
  renderQuote,
  renderStatistic,
  renderStatisticsGrid,
  renderProgressBar,
  renderInfoBox,
  renderProcessStep,
  renderTimeline,
} from './contentRenderers';

// Export des types de contentRenderers
export type {
  BulletPoint,
  TeamMember,
  ClientLogo,
  ContactInfo,
} from './contentRenderers';

// Export du générateur de graphiques
export {
  generateBarChart,
  generateHorizontalBarChart,
  generateStackedBarChart,
  generateLineChart,
  generateAreaChart,
  generatePieChart,
  generateDoughnutChart,
  generateComboChart,
  generateRadarChart,
  generateComparisonChart,
  generateMiniCharts,
  createDemoChartData,
} from './chartGenerator';

// Export des types de chartGenerator
export type {
  ChartDataPoint,
  ChartSeries,
  PieChartData,
  BarChartData,
  LineChartData,
  AreaChartData,
  DoughnutChartData,
} from './chartGenerator';

// Export du générateur de tableaux
export {
  generateTable,
  generateFinancialTable,
  generateComparisonTable,
  generatePortfolioTable,
  generatePerformanceTable,
  generateFeeTable,
  generateContactTable,
  createDemoTableData,
} from './tableGenerator';

// Export des types de tableGenerator
export type {
  TableCell,
  TableRow,
  TableData,
  FinancialTableData,
  TableOptions,
} from './tableGenerator';
