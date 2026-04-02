// ============================================
// Alecia Presentation Builder - Type Definitions
// ============================================

// Project Types
export interface Project {
  id: string;
  name: string;
  pinHash?: string | null;
  userTag?: string | null;
  targetCompany?: string;
  targetSector?: string;
  dealType?: 'cession_vente' | 'lbo_levee_fonds' | 'acquisition_achats' | 'custom';
  potentialBuyers?: string[];
  keyIndividuals?: string[];
  theme?: Theme;
  templateId?: string | null;
  createdAt: string | number;
  updatedAt: string | number;
  slides?: Slide[];
}

export interface Theme {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoPath: string | null;
}

// Slide Types
export interface Slide {
  id: string;
  projectId: string;
  orderIndex: number;
  type: BlockType;
  title: string;
  content: BlockContent;
  notes?: string | null;
  imagePath?: string | null;
  data?: SlideData | null;
  createdAt?: number;
  updatedAt?: number;
}

export type BlockType = 
  // Text blocks
  | 'Titre' 
  | 'Sous-titre' 
  | 'Paragraphe' 
  | 'Liste' 
  | 'Citation'
  // Financial blocks
  | 'KPI_Card' 
  | 'Chart_Block' 
  | 'Table_Block' 
  | 'Timeline_Block'
  // M&A blocks
  | 'Company_Overview' 
  | 'Deal_Rationale' 
  | 'SWOT' 
  | 'Key_Metrics' 
  | 'Process_Timeline'
  // Team blocks
  | 'Team_Grid' 
  | 'Team_Row' 
  | 'Advisor_List'
  // Visual blocks
  | 'Image' 
  | 'Logo_Grid' 
  | 'Icon_Text'
  // Layout blocks
  | 'Two_Column'
  | 'TwoColumn'
  // Navigation blocks
  | 'Section_Navigator'
  | 'SectionNavigator'
  | 'Section_Divider'
  | 'SectionDivider'
  | 'Cover'
  | 'Couverture'
  | 'Disclaimer'
  | 'Disclaimer_Block'
  | 'Trackrecord_Block'
  | 'CSR_Block'
  | 'Contact_Block';

export interface BlockContent {
  text?: string;
  items?: ListItem[];
  imageUrl?: string;
  caption?: string;
  layout?: 'left' | 'center' | 'right';
  subtitle?: string;
  sections?: Section[];
  id?: string;
  alt?: string;
  icon?: string;
  value?: string;
  kpis?: KPI[];
  advisor?: Advisor;
  advisors?: Advisor[];
  targetCompany?: string;
  company?: CompanyInfo;
  contact?: ContactInfo;
  [key: string]: unknown;
}

export interface Section {
  id?: string;
  title: string;
  page?: number;
}

export interface Advisor {
  name: string;
  role: string;
  firm?: string;
  email?: string;
  phone?: string;
}

export interface CompanyInfo {
  name?: string;
  sector?: string;
  description?: string;
  logo?: string;
}

export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}

export interface ListItem {
  id: string;
  text: string;
  level: number;
}

export interface SlideData {
  chartData?: ChartData;
  tableData?: TableData;
  kpis?: KPI[];
  timeline?: TimelineItem[];
  swot?: SWOTData;
  [key: string]: unknown;
}

// Chart Types
export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area';
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
}

// Table Types
export interface TableData {
  headers: string[];
  rows: TableRow[];
  caption?: string;
}

export interface TableRow {
  cells: (string | number | null)[];
  isHeader?: boolean;
  highlight?: 'positive' | 'negative' | 'neutral';
}

// KPI Types
export interface KPI {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

// Timeline Types
export interface TimelineItem {
  id: string;
  phase: string;
  title: string;
  description: string;
  duration?: string;
}

// SWOT Types
export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'cession_vente' | 'lbo_levee_fonds' | 'acquisition_achats' | 'custom';
  slides: Slide[];
  isCustom: boolean;
  thumbnailPath: string | null;
  createdAt: number;
}

// Deal Types (from Datatable_Alecia CSV)
export interface Deal {
  id: string;
  dealId: number;
  company: string;
  anneeDeal: number;
  typeDeal: 'Cession' | 'Levée de fonds' | 'Acquisition' | 'Financements structurés';
  responsableDeal: string;
  equipierDeal: string | null;
  isClientOuContrepartie: 'client' | 'contrepartie';
  descriptionDeal: string;
  regionDeal: string;
  sectorDeal: string;
  tailleOperationMEuro: number | null;
  caCibleMEuro: number | null;
  afficherSite: boolean;
  afficherPitchdeck: boolean;
  isCompany: boolean;
  isAlecia: boolean;
  logoFilename: string;
}

// Variable Types (from Project 2 variable system)
export interface Variable {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'percentage';
  description?: string;
}

export interface VariablePreset {
  id: string;
  projectId: string | null;
  name: string;
  variables: Variable[];
  isDefault: boolean;
  createdAt: number;
}

// Chat Types
export interface ChatMessage {
  id: string;
  projectId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

// Comment Types
export interface Comment {
  id: string;
  slideId: string;
  projectId: string;
  authorTag: string | null;
  authorName?: string;
  field: 'title' | 'content' | 'notes';
  text: string;
  content?: string;
  resolved: boolean;
  aiResponse: string | null;
  parentCommentId: string | null;
  createdAt: number;
}

// AI Settings Types
export interface AISettings {
  id: string;
  provider: string;
  baseUrl: string | null;
  apiKey: string | null;
  model: string;
  apiFormat: 'openai' | 'anthropic' | 'google';
  systemPromptExtra: string | null;
  createdAt: number;
}

// Upload Types
export interface Upload {
  id: string;
  projectId: string;
  filePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: number;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  userTag: string | null;
  hasMasterAccess: boolean;
}

// Socket.IO Types
export interface SocketPresence {
  socketId: string;
  userTag: string;
  projectId: string;
  cursorPosition?: { x: number; y: number };
  lastActivity: number;
}

// Export Types
export type ExportFormat = 'pptx' | 'pdf' | 'png' | 'zip';

export interface ExportOptions {
  format: ExportFormat;
  includeNotes: boolean;
  includeWatermarks: boolean;
  variablePresetId?: string;
  slideRange?: 'all' | 'current' | number[];
}

// Block Library Item
export interface BlockLibraryItem {
  type: BlockType;
  name: string;
  description: string;
  icon: string;
  category: 'text' | 'financial' | 'ma' | 'team' | 'visual' | 'layout' | 'navigation';
  defaultContent: Partial<BlockContent>;
}
