/**
 * Types pour le système de drag-and-drop d'Alecia Presentations
 * Alecia - Conseil financier français
 */

// ============================================================================
// Drag Types
// ============================================================================

export type DragType = 'SLIDE' | 'BLOCK' | 'TEMPLATE' | 'IMAGE';

export interface DragItem {
  id: string;
  type: DragType;
  data?: unknown;
}

// ============================================================================
// Block Types
// ============================================================================

// Text Blocks
export type TextBlockType = 'Titre' | 'Sous-titre' | 'Paragraphe' | 'Liste' | 'Citation';

// Financial Blocks
export type FinancialBlockType = 'KPI_Card' | 'Chart_Block' | 'Table_Block' | 'Timeline_Block';
export type KPIVariant = 'revenue' | 'ebitda' | 'margin' | 'growth' | 'multiple';
export type ChartVariant = 'bar' | 'line' | 'pie' | 'waterfall' | 'funnel';
export type TableVariant = 'standard' | 'comparison' | 'waterfall';

// M&A Content Blocks
export type MABlockType =
  | 'Company_Overview'
  | 'Deal_Rationale'
  | 'SWOT'
  | 'Key_Metrics'
  | 'Process_Timeline';

// Team Blocks
export type TeamBlockType = 'Team_Grid' | 'Team_Row' | 'Advisor_List';

// Visual Blocks
export type VisualBlockType = 'Image' | 'Logo_Grid' | 'Icon_Text';

// Layout Blocks
export type LayoutBlockType = 'Two_Column' | 'Three_Column' | 'Grid';

// Union of all block types
export type BlockType =
  | TextBlockType
  | FinancialBlockType
  | MABlockType
  | TeamBlockType
  | VisualBlockType
  | LayoutBlockType;

// ============================================================================
// Block Data Interfaces
// ============================================================================

export interface BaseBlockData {
  id: string;
  type: BlockType;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  styles?: Record<string, string>;
}

// Financial Block Data
export interface KPIData extends BaseBlockData {
  type: 'KPI_Card';
  variant: KPIVariant;
  value?: string;
  change?: string;
  currency?: string;
}

export interface ChartData extends BaseBlockData {
  type: 'Chart_Block';
  variant: ChartVariant;
  data?: {
    labels?: string[];
    values?: number[];
    title?: string;
  };
}

export interface TableData extends BaseBlockData {
  type: 'Table_Block';
  variant: TableVariant;
  headers?: string[];
  rows?: string[][];
}

export interface TimelineData extends BaseBlockData {
  type: 'Timeline_Block';
  events?: {
    date: string;
    title: string;
    description?: string;
  }[];
}

// M&A Block Data
export interface CompanyOverviewData extends BaseBlockData {
  type: 'Company_Overview';
  companyName?: string;
  industry?: string;
  founded?: string;
  headquarters?: string;
  description?: string;
}

export interface DealRationaleData extends BaseBlockData {
  type: 'Deal_Rationale';
  synergies?: string[];
  strategicRationale?: string;
  financialRationale?: string;
}

export interface SWOTData extends BaseBlockData {
  type: 'SWOT';
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
}

export interface KeyMetricsData extends BaseBlockData {
  type: 'Key_Metrics';
  metrics?: {
    label: string;
    value: string;
    change?: string;
  }[];
}

export interface ProcessTimelineData extends BaseBlockData {
  type: 'Process_Timeline';
  steps?: {
    phase: string;
    status: 'completed' | 'current' | 'pending';
    date?: string;
  }[];
}

// Team Block Data
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
}

export interface TeamGridData extends BaseBlockData {
  type: 'Team_Grid';
  members: TeamMember[];
  maxItems: number;
}

export interface TeamRowData extends BaseBlockData {
  type: 'Team_Row';
  members: TeamMember[];
}

export interface AdvisorData extends BaseBlockData {
  type: 'Advisor_List';
  advisors: TeamMember[];
}

// Union type for all block data
export type BlockData =
  | BaseBlockData
  | KPIData
  | ChartData
  | TableData
  | TimelineData
  | CompanyOverviewData
  | DealRationaleData
  | SWOTData
  | KeyMetricsData
  | ProcessTimelineData
  | TeamGridData
  | TeamRowData
  | AdvisorData;

// ============================================================================
// Slide & Template Types
// ============================================================================

export interface SlideData {
  id: string;
  title: string;
  order: number;
  thumbnail?: string;
  content?: BlockData[];
}

export interface TemplateData {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  slides: SlideData[];
}

// ============================================================================
// Drag State
// ============================================================================

export interface DragState {
  activeId: string | null;
  activeType: DragType | null;
  overId: string | null;
  isDragging: boolean;
}

// ============================================================================
// Block Library Item
// ============================================================================

export interface BlockCategory {
  id: string;
  label: string;
  blocks: BlockType[];
}

export interface BlockLibraryItem {
  type: BlockType;
  icon: string;
  label: string;
  description: string;
  defaultContent: string;
  category: string; // Category ID like 'text', 'financial', 'ma_content', etc.
  variants?: string[];
}
