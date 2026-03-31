/**
 * Table Generator
 * Génération de tableaux pour les présentations Alecia
 */

import PptxGenJS from 'pptxgenjs';
import {
  ALECIA_COLORS,
  ALECIA_FONTS,
  TABLE_STYLES,
} from './brandStyles';

// Types de données pour les tableaux
export interface TableCell {
  text: string;
  options?: Record<string, unknown>;
}

export interface TableRow {
  cells: TableCell[];
  options?: Record<string, unknown>;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface FinancialTableData {
  headers: string[];
  rows: (string | number)[][];
  currencyColumn?: number[];
  percentageColumn?: number[];
}

// Options de tableau
export interface TableOptions {
  headerFill?: string;
  headerColor?: string;
  rowFill?: string;
  rowAlternateFill?: string;
  rowColor?: string;
  borderColor?: string;
  borderWidth?: number;
  fontSize?: number;
  fontFace?: string;
  boldHeader?: boolean;
  alignHeader?: 'left' | 'center' | 'right';
  alignCells?: 'left' | 'center' | 'right';
  colW?: number[];
}

/**
 * Configuration par défaut des tableaux
 */
const DEFAULT_TABLE_OPTIONS: TableOptions = {
  headerFill: TABLE_STYLES.header.fill,
  headerColor: TABLE_STYLES.header.color,
  rowFill: TABLE_STYLES.row.fill,
  rowAlternateFill: TABLE_STYLES.row.alternateFill,
  rowColor: TABLE_STYLES.row.color,
  borderColor: TABLE_STYLES.border.color,
  borderWidth: TABLE_STYLES.border.width,
  fontSize: ALECIA_FONTS.sizes.body,
  fontFace: ALECIA_FONTS.secondary,
  boldHeader: TABLE_STYLES.header.bold,
  alignHeader: 'center',
  alignCells: 'left',
};

/**
 * Génère un tableau standard
 */
export function generateTable(
  slide: PptxGenJS.Slide,
  data: TableData,
  x: number,
  y: number,
  width: number,
  height: number,
  options: TableOptions = {}
): void {
  const opts = { ...DEFAULT_TABLE_OPTIONS, ...options };
  
  // Construire les données du tableau
  const tableData: PptxGenJS.TableCell[][] = [];
  
  // En-tête
  const headerRow: PptxGenJS.TableCell[] = data.headers.map((header) => ({
    text: header,
    options: {
      fill: { color: opts.headerFill },
      color: opts.headerColor,
      bold: opts.boldHeader,
      align: opts.alignHeader,
      fontSize: opts.fontSize,
      fontFace: opts.fontFace,
      border: createBorder(opts.borderColor!, opts.borderWidth!),
    },
  }));
  tableData.push(headerRow);
  
  // Lignes de données
  data.rows.forEach((row, index) => {
    const fillColor = index % 2 === 0 ? opts.rowFill : opts.rowAlternateFill;
    
    const tableRow: PptxGenJS.TableCell[] = row.map((cell) => ({
      text: cell,
      options: {
        fill: { color: fillColor },
        color: opts.rowColor,
        align: opts.alignCells,
        fontSize: opts.fontSize,
        fontFace: opts.fontFace,
        border: createBorder(opts.borderColor!, opts.borderWidth!),
      },
    }));
    tableData.push(tableRow);
  });
  
  // Ajouter le tableau à la slide
  slide.addTable(tableData, {
    x,
    y,
    w: width,
    h: height,
    colW: opts.colW,
    border: { type: 'solid', pt: opts.borderWidth, color: opts.borderColor },
    color: opts.rowColor,
    fontSize: opts.fontSize,
    fontFace: opts.fontFace,
    align: opts.alignCells,
  });
}

/**
 * Génère un tableau financier avec formatage des nombres
 */
export function generateFinancialTable(
  slide: PptxGenJS.Slide,
  data: FinancialTableData,
  x: number,
  y: number,
  width: number,
  height: number,
  options: TableOptions = {}
): void {
  const opts = { ...DEFAULT_TABLE_OPTIONS, ...options };
  
  // Construire les données du tableau
  const tableData: PptxGenJS.TableCell[][] = [];
  
  // En-tête
  const headerRow: PptxGenJS.TableCell[] = data.headers.map((header) => ({
    text: header,
    options: {
      fill: { color: opts.headerFill },
      color: opts.headerColor,
      bold: opts.boldHeader,
      align: opts.alignHeader,
      fontSize: opts.fontSize,
      fontFace: opts.fontFace,
      border: createBorder(opts.borderColor!, opts.borderWidth!),
    },
  }));
  tableData.push(headerRow);
  
  // Lignes de données
  data.rows.forEach((row, rowIndex) => {
    const fillColor = rowIndex % 2 === 0 ? opts.rowFill : opts.rowAlternateFill;
    
    const tableRow: PptxGenJS.TableCell[] = row.map((cell, colIndex) => {
      let formattedText: string;
      
      // Formater les colonnes monétaires
      if (data.currencyColumn?.includes(colIndex) && typeof cell === 'number') {
        formattedText = formatCurrency(cell);
      }
      // Formater les colonnes de pourcentage
      else if (data.percentageColumn?.includes(colIndex) && typeof cell === 'number') {
        formattedText = formatPercentage(cell);
      }
      else {
        formattedText = String(cell);
      }
      
      return {
        text: formattedText,
        options: {
          fill: { color: fillColor },
          color: opts.rowColor,
          align: colIndex === 0 ? 'left' : 'right',
          fontSize: opts.fontSize,
          fontFace: opts.fontFace,
          border: createBorder(opts.borderColor!, opts.borderWidth!),
        },
      };
    });
    tableData.push(tableRow);
  });
  
  // Ajouter le tableau à la slide
  slide.addTable(tableData, {
    x,
    y,
    w: width,
    h: height,
    colW: opts.colW,
    border: { type: 'solid', pt: opts.borderWidth, color: opts.borderColor },
    color: opts.rowColor,
    fontSize: opts.fontSize,
    fontFace: opts.fontFace,
    align: 'left',
  });
}

/**
 * Génère un tableau de comparaison
 */
export function generateComparisonTable(
  slide: PptxGenJS.Slide,
  headers: string[],
  items: { label: string; values: (string | number)[] }[],
  x: number,
  y: number,
  width: number,
  height: number,
  options: TableOptions = {}
): void {
  const opts = { ...DEFAULT_TABLE_OPTIONS, ...options };
  
  const tableData: PptxGenJS.TableCell[][] = [];
  
  // En-tête
  const headerRow: PptxGenJS.TableCell[] = headers.map((header, index) => ({
    text: header,
    options: {
      fill: { color: opts.headerFill },
      color: opts.headerColor,
      bold: opts.boldHeader,
      align: index === 0 ? 'left' : 'center',
      fontSize: opts.fontSize,
      fontFace: opts.fontFace,
      border: createBorder(opts.borderColor!, opts.borderWidth!),
    },
  }));
  tableData.push(headerRow);
  
  // Lignes de données
  items.forEach((item, index) => {
    const fillColor = index % 2 === 0 ? opts.rowFill : opts.rowAlternateFill;
    
    const row: TableCell[] = [
      {
        text: item.label,
        options: {
          fill: { color: fillColor },
          color: opts.rowColor,
          align: 'left',
          bold: true,
          fontSize: opts.fontSize,
          fontFace: opts.fontFace,
          border: createBorder(opts.borderColor!, opts.borderWidth!),
        },
      },
      ...item.values.map((value): TableCell => ({
        text: String(value),
        options: {
          fill: { color: fillColor },
          color: opts.rowColor,
          align: 'center',
          fontSize: opts.fontSize,
          fontFace: opts.fontFace,
          border: createBorder(opts.borderColor!, opts.borderWidth!),
        },
      })),
    ];
    tableData.push(row);
  });
  
  slide.addTable(tableData, {
    x,
    y,
    w: width,
    h: height,
    colW: opts.colW,
    border: { type: 'solid', pt: opts.borderWidth, color: opts.borderColor },
    color: opts.rowColor,
    fontSize: opts.fontSize,
    fontFace: opts.fontFace,
    align: 'left',
  });
}

/**
 * Génère un tableau de répartition de portefeuille
 */
export function generatePortfolioTable(
  slide: PptxGenJS.Slide,
  allocations: { asset: string; percentage: number; value: number }[],
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const tableData: PptxGenJS.TableCell[][] = [];
  
  // En-tête
  const headerRow: PptxGenJS.TableCell[] = [
    {
      text: 'Classe d\'actifs',
      options: {
        fill: { color: TABLE_STYLES.header.fill },
        color: TABLE_STYLES.header.color,
        bold: true,
        align: 'left',
        fontSize: ALECIA_FONTS.sizes.body,
        fontFace: ALECIA_FONTS.secondary,
        border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
      },
    },
    {
      text: 'Répartition',
      options: {
        fill: { color: TABLE_STYLES.header.fill },
        color: TABLE_STYLES.header.color,
        bold: true,
        align: 'center',
        fontSize: ALECIA_FONTS.sizes.body,
        fontFace: ALECIA_FONTS.secondary,
        border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
      },
    },
    {
      text: 'Valeur',
      options: {
        fill: { color: TABLE_STYLES.header.fill },
        color: TABLE_STYLES.header.color,
        bold: true,
        align: 'right',
        fontSize: ALECIA_FONTS.sizes.body,
        fontFace: ALECIA_FONTS.secondary,
        border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
      },
    },
  ];
  tableData.push(headerRow);
  
  // Lignes de données
  allocations.forEach((allocation, index) => {
    const fillColor = index % 2 === 0 ? TABLE_STYLES.row.fill : TABLE_STYLES.row.alternateFill;
    
    const row: PptxGenJS.TableCell[] = [
      {
        text: allocation.asset,
        options: {
          fill: { color: fillColor },
          color: TABLE_STYLES.row.color,
          align: 'left',
          fontSize: ALECIA_FONTS.sizes.body,
          fontFace: ALECIA_FONTS.secondary,
          border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
        },
      },
      {
        text: `${allocation.percentage}%`,
        options: {
          fill: { color: fillColor },
          color: ALECIA_COLORS.accent.main,
          align: 'center',
          bold: true,
          fontSize: ALECIA_FONTS.sizes.body,
          fontFace: ALECIA_FONTS.secondary,
          border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
        },
      },
      {
        text: formatCurrency(allocation.value),
        options: {
          fill: { color: fillColor },
          color: TABLE_STYLES.row.color,
          align: 'right',
          fontSize: ALECIA_FONTS.sizes.body,
          fontFace: ALECIA_FONTS.secondary,
          border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
        },
      },
    ];
    tableData.push(row);
  });
  
  slide.addTable(tableData, {
    x,
    y,
    w: width,
    h: height,
    colW: [width * 0.5, width * 0.25, width * 0.25],
    border: { type: 'solid', pt: TABLE_STYLES.border.width, color: TABLE_STYLES.border.color },
    color: TABLE_STYLES.row.color,
    fontSize: ALECIA_FONTS.sizes.body,
    fontFace: ALECIA_FONTS.secondary,
    align: 'left',
  });
}

/**
 * Génère un tableau de performance
 */
export function generatePerformanceTable(
  slide: PptxGenJS.Slide,
  periods: string[],
  performances: { name: string; values: number[]; isBenchmark?: boolean }[],
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const tableData: PptxGenJS.TableCell[][] = [];
  
  // En-tête avec périodes
  const headerRow: PptxGenJS.TableCell[] = [
    {
      text: 'Performance',
      options: {
        fill: { color: TABLE_STYLES.header.fill },
        color: TABLE_STYLES.header.color,
        bold: true,
        align: 'left',
        fontSize: ALECIA_FONTS.sizes.body,
        fontFace: ALECIA_FONTS.secondary,
        border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
      },
    },
    ...periods.map((period): TableCell => ({
      text: period,
      options: {
        fill: { color: TABLE_STYLES.header.fill },
        color: TABLE_STYLES.header.color,
        bold: true,
        align: 'center',
        fontSize: ALECIA_FONTS.sizes.body,
        fontFace: ALECIA_FONTS.secondary,
        border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
      },
    })),
  ];
  tableData.push(headerRow);
  
  // Lignes de performances
  performances.forEach((perf, index) => {
    const fillColor = perf.isBenchmark 
      ? ALECIA_COLORS.primary.light 
      : (index % 2 === 0 ? TABLE_STYLES.row.fill : TABLE_STYLES.row.alternateFill);
    
    const row = [
      {
        text: perf.name,
        options: {
          fill: { color: fillColor },
          color: perf.isBenchmark ? ALECIA_COLORS.accent.main : TABLE_STYLES.row.color,
          align: 'left',
          bold: !perf.isBenchmark,
          italic: perf.isBenchmark,
          fontSize: ALECIA_FONTS.sizes.body,
          fontFace: ALECIA_FONTS.secondary,
          border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
        },
      },
      ...perf.values.map((value): TableCell => ({
        text: formatPercentage(value),
        options: {
          fill: { color: fillColor },
          color: value >= 0 ? '#4caf50' : '#f44336',
          align: 'center',
          bold: true,
          fontSize: ALECIA_FONTS.sizes.body,
          fontFace: ALECIA_FONTS.secondary,
          border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
        },
      })),
    ];
    tableData.push(row);
  });
  
  slide.addTable(tableData, {
    x,
    y,
    w: width,
    h: height,
    colW: [width * 0.3, ...periods.map(() => width * 0.7 / periods.length)],
    border: { type: 'solid', pt: TABLE_STYLES.border.width, color: TABLE_STYLES.border.color },
    color: TABLE_STYLES.row.color,
    fontSize: ALECIA_FONTS.sizes.body,
    fontFace: ALECIA_FONTS.secondary,
    align: 'left',
  });
}

/**
 * Génère un tableau de frais
 */
export function generateFeeTable(
  slide: PptxGenJS.Slide,
  fees: { service: string; fee: number; notes?: string }[],
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const tableData: PptxGenJS.TableCell[][] = [];
  
  // En-tête
  const headerRow: PptxGenJS.TableCell[] = [
    {
      text: 'Service',
      options: {
        fill: { color: TABLE_STYLES.header.fill },
        color: TABLE_STYLES.header.color,
        bold: true,
        align: 'left',
        fontSize: ALECIA_FONTS.sizes.body,
        fontFace: ALECIA_FONTS.secondary,
        border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
      },
    },
    {
      text: 'Frais',
      options: {
        fill: { color: TABLE_STYLES.header.fill },
        color: TABLE_STYLES.header.color,
        bold: true,
        align: 'center',
        fontSize: ALECIA_FONTS.sizes.body,
        fontFace: ALECIA_FONTS.secondary,
        border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
      },
    },
  ];
  
  // Ajouter colonne notes si nécessaire
  const hasNotes = fees.some((f) => f.notes);
  if (hasNotes) {
    headerRow.push({
      text: 'Notes',
      options: {
        fill: { color: TABLE_STYLES.header.fill },
        color: TABLE_STYLES.header.color,
        bold: true,
        align: 'left',
        fontSize: ALECIA_FONTS.sizes.body,
        fontFace: ALECIA_FONTS.secondary,
        border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
      },
    });
  }
  
  tableData.push(headerRow);
  
  // Lignes de données
  fees.forEach((fee, index) => {
    const fillColor = index % 2 === 0 ? TABLE_STYLES.row.fill : TABLE_STYLES.row.alternateFill;
    
    const row: PptxGenJS.TableCell[] = [
      {
        text: fee.service,
        options: {
          fill: { color: fillColor },
          color: TABLE_STYLES.row.color,
          align: 'left',
          fontSize: ALECIA_FONTS.sizes.body,
          fontFace: ALECIA_FONTS.secondary,
          border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
        },
      },
      {
        text: formatPercentage(fee.fee),
        options: {
          fill: { color: fillColor },
          color: ALECIA_COLORS.accent.main,
          align: 'center',
          bold: true,
          fontSize: ALECIA_FONTS.sizes.body,
          fontFace: ALECIA_FONTS.secondary,
          border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
        },
      },
    ];
    
    if (hasNotes) {
      row.push({
        text: fee.notes || '',
        options: {
          fill: { color: fillColor },
          color: TABLE_STYLES.row.color,
          align: 'left',
          fontSize: ALECIA_FONTS.sizes.small,
          fontFace: ALECIA_FONTS.secondary,
          border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
        },
      });
    }
    
    tableData.push(row);
  });
  
  const colW = hasNotes 
    ? [width * 0.4, width * 0.2, width * 0.4]
    : [width * 0.6, width * 0.4];
  
  slide.addTable(tableData, {
    x,
    y,
    w: width,
    h: height,
    colW,
    border: { type: 'solid', pt: TABLE_STYLES.border.width, color: TABLE_STYLES.border.color },
    color: TABLE_STYLES.row.color,
    fontSize: ALECIA_FONTS.sizes.body,
    fontFace: ALECIA_FONTS.secondary,
    align: 'left',
  });
}

/**
 * Génère un tableau de contacts
 */
export function generateContactTable(
  slide: PptxGenJS.Slide,
  contacts: { name: string; role: string; phone?: string; email: string }[],
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const tableData: PptxGenJS.TableCell[][] = [];
  
  // En-tête
  const headerRow: PptxGenJS.TableCell[] = [
    {
      text: 'Nom',
      options: {
        fill: { color: TABLE_STYLES.header.fill },
        color: TABLE_STYLES.header.color,
        bold: true,
        align: 'left',
        fontSize: ALECIA_FONTS.sizes.body,
        fontFace: ALECIA_FONTS.secondary,
        border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
      },
    },
    {
      text: 'Fonction',
      options: {
        fill: { color: TABLE_STYLES.header.fill },
        color: TABLE_STYLES.header.color,
        bold: true,
        align: 'left',
        fontSize: ALECIA_FONTS.sizes.body,
        fontFace: ALECIA_FONTS.secondary,
        border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
      },
    },
    {
      text: 'Contact',
      options: {
        fill: { color: TABLE_STYLES.header.fill },
        color: TABLE_STYLES.header.color,
        bold: true,
        align: 'left',
        fontSize: ALECIA_FONTS.sizes.body,
        fontFace: ALECIA_FONTS.secondary,
        border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
      },
    },
  ];
  tableData.push(headerRow);
  
  // Lignes de données
  contacts.forEach((contact, index) => {
    const fillColor = index % 2 === 0 ? TABLE_STYLES.row.fill : TABLE_STYLES.row.alternateFill;
    
    const contactInfo = contact.phone 
      ? `${contact.phone}\n${contact.email}` 
      : contact.email;
    
    const row: PptxGenJS.TableCell[] = [
      {
        text: contact.name,
        options: {
          fill: { color: fillColor },
          color: TABLE_STYLES.row.color,
          align: 'left',
          bold: true,
          fontSize: ALECIA_FONTS.sizes.body,
          fontFace: ALECIA_FONTS.secondary,
          border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
        },
      },
      {
        text: contact.role,
        options: {
          fill: { color: fillColor },
          color: ALECIA_COLORS.accent.main,
          align: 'left',
          fontSize: ALECIA_FONTS.sizes.body,
          fontFace: ALECIA_FONTS.secondary,
          border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
        },
      },
      {
        text: contactInfo,
        options: {
          fill: { color: fillColor },
          color: TABLE_STYLES.row.color,
          align: 'left',
          fontSize: ALECIA_FONTS.sizes.small,
          fontFace: ALECIA_FONTS.secondary,
          border: createBorder(TABLE_STYLES.border.color, TABLE_STYLES.border.width),
        },
      },
    ];
    tableData.push(row);
  });
  
  slide.addTable(tableData, {
    x,
    y,
    w: width,
    h: height,
    colW: [width * 0.3, width * 0.3, width * 0.4],
    border: { type: 'solid', pt: TABLE_STYLES.border.width, color: TABLE_STYLES.border.color },
    color: TABLE_STYLES.row.color,
    fontSize: ALECIA_FONTS.sizes.body,
    fontFace: ALECIA_FONTS.secondary,
    align: 'left',
  });
}

/**
 * Crée une configuration de bordure
 */
function createBorder(color: string, width: number): PptxGenJS.BorderOptions {
  return {
    type: 'solid',
    pt: width,
    color,
  };
}

/**
 * Formate un montant en devise
 */
function formatCurrency(amount: number, _currency: string = '€'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Formate un pourcentage
 */
function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Crée des données de démonstration pour les tableaux
 */
export function createDemoTableData() {
  return {
    standardTable: {
      headers: ['Produit', 'Description', 'Prix'],
      rows: [
        ['Produit A', 'Description du produit A', '1 000 €'],
        ['Produit B', 'Description du produit B', '2 500 €'],
        ['Produit C', 'Description du produit C', '5 000 €'],
      ],
    },
    financialTable: {
      headers: ['Actif', 'Valeur', 'Performance'],
      rows: [
        ['Actions Europe', 150000, 12.5],
        ['Actions USA', 200000, 15.3],
        ['Obligations', 100000, 3.2],
        ['Immobilier', 250000, 8.7],
      ],
      currencyColumn: [1],
      percentageColumn: [2],
    },
    portfolioTable: [
      { asset: 'Actions', percentage: 45, value: 450000 },
      { asset: 'Obligations', percentage: 30, value: 300000 },
      { asset: 'Immobilier', percentage: 20, value: 200000 },
      { asset: 'Liquidités', percentage: 5, value: 50000 },
    ],
    performanceTable: {
      periods: ['1 an', '3 ans', '5 ans', '10 ans'],
      performances: [
        { name: 'Portefeuille', values: [12.5, 35.2, 58.7, 125.3] },
        { name: 'Benchmark', values: [10.2, 28.5, 48.3, 98.7], isBenchmark: true },
      ],
    },
  };
}
