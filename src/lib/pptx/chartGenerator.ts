/**
 * Chart Generator
 * Génération de graphiques pour les présentations Alecia
 */

import PptxGenJS from 'pptxgenjs';
import { ALECIA_COLORS, ALECIA_FONTS, CHART_STYLES } from './brandStyles';

// Types de données pour les graphiques
export interface ChartDataPoint {
  name: string;
  value: number;
  labels?: string[];
}

export interface ChartSeries {
  name: string;
  data: number[];
  labels?: string[];
}

export interface PieChartData {
  labels: string[];
  values: number[];
}

export interface BarChartData {
  categories: string[];
  series: ChartSeries[];
}

export interface LineChartData {
  categories: string[];
  series: ChartSeries[];
}

export interface AreaChartData {
  categories: string[];
  series: ChartSeries[];
}

export interface DoughnutChartData {
  labels: string[];
  values: number[];
}

// Options communes pour tous les graphiques
interface CommonChartOptions {
  title?: string;
  showLegend?: boolean;
  showValue?: boolean;
  showPercent?: boolean;
  barDir?: 'bar' | 'col';
  barGrouping?: 'clustered' | 'stacked' | 'percentStacked';
  dataLabelPosition?: 'bestFit' | 'outEnd' | 'inEnd' | 'ctr';
}

/**
 * Configuration des axes par défaut
 */
const DEFAULT_AXIS_CONFIG = {
  color: CHART_STYLES.axis.color,
  fontSize: CHART_STYLES.axis.fontSize,
  fontFace: ALECIA_FONTS.secondary,
};

/**
 * Configuration de la légende par défaut
 */
const DEFAULT_LEGEND_CONFIG = {
  color: CHART_STYLES.legend.color,
  fontSize: CHART_STYLES.legend.fontSize,
  fontFace: ALECIA_FONTS.secondary,
};

/**
 * Configuration du titre par défaut
 */
const DEFAULT_TITLE_CONFIG = {
  color: CHART_STYLES.title.color,
  fontSize: CHART_STYLES.title.fontSize,
  fontFace: ALECIA_FONTS.primary,
  bold: CHART_STYLES.title.bold,
};

/**
 * Génère un graphique à barres
 */
export function generateBarChart(
  slide: PptxGenJS.Slide,
  data: BarChartData,
  x: number,
  y: number,
  width: number,
  height: number,
  options: CommonChartOptions = {}
): void {
  const chartData = data.series.map((series) => ({
    name: series.name,
    labels: data.categories,
    values: series.data,
  }));

  slide.addChart('bar', chartData, {
    x,
    y,
    w: width,
    h: height,
    chartColors: CHART_STYLES.colors,
    barDir: options.barDir || 'col',
    barGrouping: options.barGrouping || 'clustered',
    showValue: options.showValue ?? false,
    showLegend: options.showLegend ?? true,
    legendPos: 'b',
    legendFontFace: DEFAULT_LEGEND_CONFIG.fontFace,
    legendFontSize: DEFAULT_LEGEND_CONFIG.fontSize,
    legendColor: DEFAULT_LEGEND_CONFIG.color,
    title: options.title || '',
    titleFontFace: DEFAULT_TITLE_CONFIG.fontFace,
    titleFontSize: DEFAULT_TITLE_CONFIG.fontSize,
    titleColor: DEFAULT_TITLE_CONFIG.color,
    titleBold: DEFAULT_TITLE_CONFIG.bold,
    catAxisLabelColor: DEFAULT_AXIS_CONFIG.color,
    catAxisLabelFontSize: DEFAULT_AXIS_CONFIG.fontSize,
    catAxisLabelFontFace: DEFAULT_AXIS_CONFIG.fontFace,
    valAxisLabelColor: DEFAULT_AXIS_CONFIG.color,
    valAxisLabelFontSize: DEFAULT_AXIS_CONFIG.fontSize,
    valAxisLabelFontFace: DEFAULT_AXIS_CONFIG.fontFace,
    chartArea: { fill: { color: 'transparent' } },
    plotArea: { fill: { color: 'transparent' } },
  });
}

/**
 * Génère un graphique à barres horizontales
 */
export function generateHorizontalBarChart(
  slide: PptxGenJS.Slide,
  data: BarChartData,
  x: number,
  y: number,
  width: number,
  height: number,
  options: CommonChartOptions = {}
): void {
  generateBarChart(slide, data, x, y, width, height, {
    ...options,
    barDir: 'bar',
  });
}

/**
 * Génère un graphique à barres empilées
 */
export function generateStackedBarChart(
  slide: PptxGenJS.Slide,
  data: BarChartData,
  x: number,
  y: number,
  width: number,
  height: number,
  options: CommonChartOptions = {}
): void {
  generateBarChart(slide, data, x, y, width, height, {
    ...options,
    barGrouping: 'stacked',
  });
}

/**
 * Génère un graphique linéaire
 */
export function generateLineChart(
  slide: PptxGenJS.Slide,
  data: LineChartData,
  x: number,
  y: number,
  width: number,
  height: number,
  options: CommonChartOptions = {}
): void {
  const chartData = data.series.map((series) => ({
    name: series.name,
    labels: data.categories,
    values: series.data,
  }));

  slide.addChart('line', chartData, {
    x,
    y,
    w: width,
    h: height,
    chartColors: CHART_STYLES.colors,
    lineDataSymbol: 'circle',
    lineDataSymbolSize: 8,
    showValue: options.showValue ?? false,
    showLegend: options.showLegend ?? true,
    legendPos: 'b',
    legendFontFace: DEFAULT_LEGEND_CONFIG.fontFace,
    legendFontSize: DEFAULT_LEGEND_CONFIG.fontSize,
    legendColor: DEFAULT_LEGEND_CONFIG.color,
    title: options.title || '',
    titleFontFace: DEFAULT_TITLE_CONFIG.fontFace,
    titleFontSize: DEFAULT_TITLE_CONFIG.fontSize,
    titleColor: DEFAULT_TITLE_CONFIG.color,
    titleBold: DEFAULT_TITLE_CONFIG.bold,
    catAxisLabelColor: DEFAULT_AXIS_CONFIG.color,
    catAxisLabelFontSize: DEFAULT_AXIS_CONFIG.fontSize,
    catAxisLabelFontFace: DEFAULT_AXIS_CONFIG.fontFace,
    valAxisLabelColor: DEFAULT_AXIS_CONFIG.color,
    valAxisLabelFontSize: DEFAULT_AXIS_CONFIG.fontSize,
    valAxisLabelFontFace: DEFAULT_AXIS_CONFIG.fontFace,
    chartArea: { fill: { color: 'transparent' } },
    plotArea: { fill: { color: 'transparent' } },
  });
}

/**
 * Génère un graphique en aires
 */
export function generateAreaChart(
  slide: PptxGenJS.Slide,
  data: AreaChartData,
  x: number,
  y: number,
  width: number,
  height: number,
  options: CommonChartOptions = {}
): void {
  const chartData = data.series.map((series) => ({
    name: series.name,
    labels: data.categories,
    values: series.data,
  }));

  slide.addChart('area', chartData, {
    x,
    y,
    w: width,
    h: height,
    chartColors: CHART_STYLES.colors,
    showValue: options.showValue ?? false,
    showLegend: options.showLegend ?? true,
    legendPos: 'b',
    legendFontFace: DEFAULT_LEGEND_CONFIG.fontFace,
    legendFontSize: DEFAULT_LEGEND_CONFIG.fontSize,
    legendColor: DEFAULT_LEGEND_CONFIG.color,
    title: options.title || '',
    titleFontFace: DEFAULT_TITLE_CONFIG.fontFace,
    titleFontSize: DEFAULT_TITLE_CONFIG.fontSize,
    titleColor: DEFAULT_TITLE_CONFIG.color,
    titleBold: DEFAULT_TITLE_CONFIG.bold,
    catAxisLabelColor: DEFAULT_AXIS_CONFIG.color,
    catAxisLabelFontSize: DEFAULT_AXIS_CONFIG.fontSize,
    catAxisLabelFontFace: DEFAULT_AXIS_CONFIG.fontFace,
    valAxisLabelColor: DEFAULT_AXIS_CONFIG.color,
    valAxisLabelFontSize: DEFAULT_AXIS_CONFIG.fontSize,
    valAxisLabelFontFace: DEFAULT_AXIS_CONFIG.fontFace,
    chartArea: { fill: { color: 'transparent' } },
    plotArea: { fill: { color: 'transparent' } },
  });
}

/**
 * Génère un graphique circulaire (camembert)
 */
export function generatePieChart(
  slide: PptxGenJS.Slide,
  data: PieChartData,
  x: number,
  y: number,
  width: number,
  height: number,
  options: CommonChartOptions = {}
): void {
  const chartData = [
    {
      name: 'Données',
      labels: data.labels,
      values: data.values,
    },
  ];

  slide.addChart('pie', chartData, {
    x,
    y,
    w: width,
    h: height,
    chartColors: CHART_STYLES.colors,
    showValue: options.showValue ?? true,
    showPercent: options.showPercent ?? true,
    showLegend: options.showLegend ?? true,
    legendPos: 'b',
    legendFontFace: DEFAULT_LEGEND_CONFIG.fontFace,
    legendFontSize: DEFAULT_LEGEND_CONFIG.fontSize,
    legendColor: DEFAULT_LEGEND_CONFIG.color,
    title: options.title || '',
    titleFontFace: DEFAULT_TITLE_CONFIG.fontFace,
    titleFontSize: DEFAULT_TITLE_CONFIG.fontSize,
    titleColor: DEFAULT_TITLE_CONFIG.color,
    titleBold: DEFAULT_TITLE_CONFIG.bold,
    dataLabelPosition: options.dataLabelPosition || 'bestFit',
    chartArea: { fill: { color: 'transparent' } },
    plotArea: { fill: { color: 'transparent' } },
  });
}

/**
 * Génère un graphique en anneau (doughnut)
 */
export function generateDoughnutChart(
  slide: PptxGenJS.Slide,
  data: DoughnutChartData,
  x: number,
  y: number,
  width: number,
  height: number,
  options: CommonChartOptions = {}
): void {
  const chartData = [
    {
      name: 'Données',
      labels: data.labels,
      values: data.values,
    },
  ];

  slide.addChart('doughnut', chartData, {
    x,
    y,
    w: width,
    h: height,
    chartColors: CHART_STYLES.colors,
    showValue: options.showValue ?? true,
    showPercent: options.showPercent ?? true,
    showLegend: options.showLegend ?? true,
    legendPos: 'b',
    legendFontFace: DEFAULT_LEGEND_CONFIG.fontFace,
    legendFontSize: DEFAULT_LEGEND_CONFIG.fontSize,
    legendColor: DEFAULT_LEGEND_CONFIG.color,
    title: options.title || '',
    titleFontFace: DEFAULT_TITLE_CONFIG.fontFace,
    titleFontSize: DEFAULT_TITLE_CONFIG.fontSize,
    titleColor: DEFAULT_TITLE_CONFIG.color,
    titleBold: DEFAULT_TITLE_CONFIG.bold,
    holeSize: 50,
    chartArea: { fill: { color: 'transparent' } },
    plotArea: { fill: { color: 'transparent' } },
  });
}

/**
 * Génère un graphique combiné (ligne + barres)
 */
export function generateComboChart(
  slide: PptxGenJS.Slide,
  barData: BarChartData,
  lineData: LineChartData,
  x: number,
  y: number,
  width: number,
  height: number,
  options: CommonChartOptions = {}
): void {
  // Combiner les données
  const chartData = [
    ...barData.series.map((series) => ({
      name: series.name,
      labels: barData.categories,
      values: series.data,
    })),
    ...lineData.series.map((series) => ({
      name: series.name,
      labels: lineData.categories,
      values: series.data,
    })),
  ];

  slide.addChart('bar', chartData, {
    x,
    y,
    w: width,
    h: height,
    chartColors: CHART_STYLES.colors,
    barDir: 'col',
    barGrouping: 'clustered',
    showValue: options.showValue ?? false,
    showLegend: options.showLegend ?? true,
    legendPos: 'b',
    legendFontFace: DEFAULT_LEGEND_CONFIG.fontFace,
    legendFontSize: DEFAULT_LEGEND_CONFIG.fontSize,
    legendColor: DEFAULT_LEGEND_CONFIG.color,
    title: options.title || '',
    titleFontFace: DEFAULT_TITLE_CONFIG.fontFace,
    titleFontSize: DEFAULT_TITLE_CONFIG.fontSize,
    titleColor: DEFAULT_TITLE_CONFIG.color,
    titleBold: DEFAULT_TITLE_CONFIG.bold,
    catAxisLabelColor: DEFAULT_AXIS_CONFIG.color,
    catAxisLabelFontSize: DEFAULT_AXIS_CONFIG.fontSize,
    catAxisLabelFontFace: DEFAULT_AXIS_CONFIG.fontFace,
    valAxisLabelColor: DEFAULT_AXIS_CONFIG.color,
    valAxisLabelFontSize: DEFAULT_AXIS_CONFIG.fontSize,
    valAxisLabelFontFace: DEFAULT_AXIS_CONFIG.fontFace,
    chartArea: { fill: { color: 'transparent' } },
    plotArea: { fill: { color: 'transparent' } },
  });
}

/**
 * Génère un graphique radar
 */
export function generateRadarChart(
  slide: PptxGenJS.Slide,
  categories: string[],
  series: ChartSeries[],
  x: number,
  y: number,
  width: number,
  height: number,
  options: CommonChartOptions = {}
): void {
  const chartData = series.map((s) => ({
    name: s.name,
    labels: categories,
    values: s.data,
  }));

  slide.addChart('radar', chartData, {
    x,
    y,
    w: width,
    h: height,
    chartColors: CHART_STYLES.colors,
    radarStyle: 'filled',
    showValue: options.showValue ?? false,
    showLegend: options.showLegend ?? true,
    legendPos: 'b',
    legendFontFace: DEFAULT_LEGEND_CONFIG.fontFace,
    legendFontSize: DEFAULT_LEGEND_CONFIG.fontSize,
    legendColor: DEFAULT_LEGEND_CONFIG.color,
    title: options.title || '',
    titleFontFace: DEFAULT_TITLE_CONFIG.fontFace,
    titleFontSize: DEFAULT_TITLE_CONFIG.fontSize,
    titleColor: DEFAULT_TITLE_CONFIG.color,
    titleBold: DEFAULT_TITLE_CONFIG.bold,
    chartArea: { fill: { color: 'transparent' } },
    plotArea: { fill: { color: 'transparent' } },
  });
}

/**
 * Génère un graphique de comparaison (deux séries côte à côte)
 */
export function generateComparisonChart(
  slide: PptxGenJS.Slide,
  data1: { label: string; value: number; color?: string },
  data2: { label: string; value: number; color?: string },
  x: number,
  y: number,
  width: number,
  height: number,
  title?: string
): void {
  const maxValue = Math.max(data1.value, data2.value);
  const barHeight = height * 0.35;
  const barWidth = (width - 1) * 0.45;

  // Titre
  if (title) {
    slide.addText(title, {
      x,
      y: y - 0.4,
      w: width,
      h: 0.35,
      fontSize: DEFAULT_TITLE_CONFIG.fontSize,
      fontFace: DEFAULT_TITLE_CONFIG.fontFace,
      color: DEFAULT_TITLE_CONFIG.color,
      bold: DEFAULT_TITLE_CONFIG.bold,
      align: 'center',
    });
  }

  // Première barre
  const bar1Width = barWidth * (data1.value / maxValue);
  slide.addShape('rect', {
    x: x + width / 2 - bar1Width,
    y: y,
    w: bar1Width,
    h: barHeight,
    fill: { color: data1.color || CHART_STYLES.colors[0] },
  });

  slide.addText(`${data1.label}: ${data1.value}`, {
    x: x,
    y: y + barHeight + 0.05,
    w: width / 2 - 0.2,
    h: 0.25,
    fontSize: ALECIA_FONTS.sizes.body,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.primary,
    align: 'right',
  });

  // Deuxième barre
  const bar2Width = barWidth * (data2.value / maxValue);
  slide.addShape('rect', {
    x: x + width / 2 + 0.2,
    y: y + height * 0.5,
    w: bar2Width,
    h: barHeight,
    fill: { color: data2.color || CHART_STYLES.colors[1] },
  });

  slide.addText(`${data2.label}: ${data2.value}`, {
    x: x + width / 2 + 0.2,
    y: y + height * 0.5 + barHeight + 0.05,
    w: width / 2 - 0.2,
    h: 0.25,
    fontSize: ALECIA_FONTS.sizes.body,
    fontFace: ALECIA_FONTS.secondary,
    color: ALECIA_COLORS.text.primary,
    align: 'left',
  });

  // Ligne centrale
  slide.addShape('rect', {
    x: x + width / 2 - 0.01,
    y: y - 0.1,
    w: 0.02,
    h: height + 0.3,
    fill: { color: ALECIA_COLORS.neutral.darkGray },
  });
}

/**
 * Génère un graphique de répartition (mini graphiques)
 */
export function generateMiniCharts(
  slide: PptxGenJS.Slide,
  charts: {
    title: string;
    value: number;
    total: number;
    color?: string;
  }[],
  startX: number,
  startY: number,
  itemWidth: number,
  itemHeight: number,
  columns: number,
  spacing: number
): void {
  charts.forEach((chart, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);

    const x = startX + col * (itemWidth + spacing);
    const y = startY + row * (itemHeight + spacing);

    // Fond
    slide.addShape('rect', {
      x,
      y,
      w: itemWidth,
      h: itemHeight,
      fill: { color: ALECIA_COLORS.primary.main },
      line: { color: ALECIA_COLORS.neutral.darkGray, width: 1 },
    });

    // Titre
    slide.addText(chart.title, {
      x: x + 0.1,
      y: y + 0.1,
      w: itemWidth - 0.2,
      h: 0.3,
      fontSize: ALECIA_FONTS.sizes.small,
      fontFace: ALECIA_FONTS.secondary,
      color: ALECIA_COLORS.text.secondary,
      align: 'center',
    });

    // Valeur
    const percentage = Math.round((chart.value / chart.total) * 100);
    slide.addText(`${percentage}%`, {
      x: x + 0.1,
      y: y + 0.5,
      w: itemWidth - 0.2,
      h: 0.4,
      fontSize: 28,
      fontFace: ALECIA_FONTS.primary,
      color: chart.color || ALECIA_COLORS.accent.main,
      bold: true,
      align: 'center',
    });

    // Barre de progression
    const barWidth = itemWidth - 0.3;
    slide.addShape('rect', {
      x: x + 0.15,
      y: y + itemHeight - 0.3,
      w: barWidth,
      h: 0.1,
      fill: { color: ALECIA_COLORS.primary.dark },
    });

    slide.addShape('rect', {
      x: x + 0.15,
      y: y + itemHeight - 0.3,
      w: barWidth * (percentage / 100),
      h: 0.1,
      fill: { color: chart.color || ALECIA_COLORS.accent.main },
    });
  });
}

/**
 * Crée des données de démonstration pour les graphiques
 */
export function createDemoChartData() {
  return {
    barChart: {
      categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      series: [
        {
          name: '2023',
          data: [65, 78, 90, 85, 95, 110],
        },
        {
          name: '2024',
          data: [75, 85, 100, 95, 105, 120],
        },
      ],
    },
    pieChart: {
      labels: ['Actions', 'Obligations', 'Immobilier', 'Liquidités', 'Autres'],
      values: [40, 25, 20, 10, 5],
    },
    lineChart: {
      categories: ['2019', '2020', '2021', '2022', '2023', '2024'],
      series: [
        {
          name: 'Performance',
          data: [100, 95, 115, 120, 135, 150],
        },
      ],
    },
    doughnutChart: {
      labels: ['Europe', 'Amérique du Nord', 'Asie', 'Autres'],
      values: [45, 30, 20, 5],
    },
  };
}
