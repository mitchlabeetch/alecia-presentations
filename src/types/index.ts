/**
 * Types et interfaces TypeScript pour l'application Alecia Presentations
 * Définit tous les modèles de données utilisés dans l'application
 */

// ============================================================================
// UTILISATEURS ET COLLABORATION
// ============================================================================

/**
 * Rôle d'un utilisateur dans l'application
 */
export type UserRole = "admin" | "editor" | "viewer";

/**
 * Statut de présence d'un utilisateur
 */
export type PresenceStatus = "online" | "away" | "offline";

/**
 * Représente un utilisateur de l'application
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Utilisateur avec statut de présence pour la collaboration en temps réel
 */
export interface Collaborator extends User {
  presenceStatus: PresenceStatus;
  currentSlideId?: string;
  lastSeen: Date;
  cursorPosition?: { x: number; y: number };
}

// ============================================================================
// PRÉSENTATIONS
// ============================================================================

/**
 * Statut d'une présentation
 */
export type PresentationStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "archived";

/**
 * Métadonnées d'une présentation
 */
export interface PresentationMetadata {
  id: string;
  title: string;
  description?: string;
  status: PresentationStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy: string;
  tags: string[];
  folderId?: string;
}

/**
 * Présentation complète
 */
export interface Presentation extends PresentationMetadata {
  slides: Slide[];
  variables: PresentationVariables;
  templateId?: string;
  collaborators: string[];
  settings: PresentationSettings;
}

/**
 * Paramètres d'une présentation
 */
export interface PresentationSettings {
  theme: string;
  aspectRatio: "16:9" | "4:3" | "16:10";
  defaultFont: string;
  showSlideNumbers: boolean;
  showFooter: boolean;
  footerText?: string;
}

// ============================================================================
// SLIDES ET CONTENU
// ============================================================================

/**
 * Types de slides disponibles
 */
export type SlideType =
  | "title"
  | "content"
  | "two-column"
  | "image"
  | "chart"
  | "table"
  | "timeline"
  | "team"
  | "financial"
  | "quote"
  | "blank";

/**
 * Slide individuelle
 */
export interface Slide {
  id: string;
  type: SlideType;
  title?: string;
  subtitle?: string;
  content: SlideContent;
  layout: SlideLayout;
  order: number;
  notes?: string;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contenu d'une slide (varie selon le type)
 */
export interface SlideContent {
  blocks: ContentBlock[];
  background?: BackgroundSettings;
}

/**
 * Configuration du layout d'une slide
 */
export interface SlideLayout {
  template: string;
  padding: { top: number; right: number; bottom: number; left: number };
}

/**
 * Paramètres d'arrière-plan
 */
export interface BackgroundSettings {
  type: "solid" | "gradient" | "image";
  color?: string;
  gradient?: { from: string; to: string; angle: number };
  imageUrl?: string;
  opacity?: number;
}

// ============================================================================
// BLOCS DE CONTENU
// ============================================================================

/**
 * Types de blocs de contenu
 */
export type ContentBlockType =
  | "text"
  | "heading"
  | "image"
  | "chart"
  | "table"
  | "list"
  | "quote"
  | "divider"
  | "spacer"
  | "logo"
  | "variable";

/**
 * Bloc de contenu générique
 */
export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  styles: BlockStyles;
  data: BlockData;
}

/**
 * Styles applicables aux blocs
 */
export interface BlockStyles {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: "normal" | "bold" | "lighter" | "bolder" | number;
  color?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  borderRadius?: number;
  padding?: number;
  margin?: number;
  opacity?: number;
}

/**
 * Données spécifiques selon le type de bloc
 */
export type BlockData =
  | TextBlockData
  | HeadingBlockData
  | ImageBlockData
  | ChartBlockData
  | TableBlockData
  | ListBlockData
  | QuoteBlockData
  | VariableBlockData;

export interface TextBlockData {
  text: string;
  paragraphs?: string[];
}

export interface HeadingBlockData {
  level: 1 | 2 | 3 | 4;
  text: string;
}

export interface ImageBlockData {
  src: string;
  alt: string;
  caption?: string;
  objectFit?: "cover" | "contain" | "fill";
}

export interface ChartBlockData {
  chartType: "bar" | "line" | "pie" | "doughnut" | "area";
  data: ChartDataset[];
  labels: string[];
  title?: string;
  options?: Record<string, unknown>;
}

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
  backgroundColor?: string;
}

export interface TableBlockData {
  headers: string[];
  rows: (string | number)[][];
  hasHeaderRow: boolean;
  hasHeaderColumn: boolean;
}

export interface ListBlockData {
  items: string[];
  ordered: boolean;
  style?: "disc" | "circle" | "square" | "decimal";
}

export interface QuoteBlockData {
  text: string;
  author?: string;
  source?: string;
}

export interface VariableBlockData {
  variableName: string;
  fallback?: string;
}

// ============================================================================
// VARIABLES DE PRÉSENTATION
// ============================================================================

/**
 * Variables globales d'une présentation
 * Ces valeurs peuvent être référencées dans les slides
 */
export interface PresentationVariables {
  // Informations client
  clientName: string;
  clientAddress?: string;
  clientCity?: string;
  clientPostalCode?: string;
  clientCountry?: string;

  // Interlocuteurs
  clientContactName?: string;
  clientContactEmail?: string;
  clientContactPhone?: string;
  clientContactRole?: string;

  // Informations Alecia
  aleciaContactName: string;
  aleciaContactEmail: string;
  aleciaContactPhone?: string;
  aleciaContactRole?: string;

  // Métadonnées du projet
  projectName?: string;
  projectDate: Date;
  projectReference?: string;
  confidentialityLevel?:
    | "public"
    | "internal"
    | "confidential"
    | "strictly_confidential";

  // Variables personnalisées
  custom: Record<string, string>;
}

// ============================================================================
// TEMPLATES
// ============================================================================

/**
 * Template de présentation
 */
export interface Template {
  id: string;
  name: string;
  description?: string;
  category: TemplateCategory;
  thumbnail?: string;
  slides: Slide[];
  variables: Partial<PresentationVariables>;
  settings: PresentationSettings;
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Catégories de templates
 */
export type TemplateCategory =
  | "pitch_deck"
  | "financial"
  | "ma"
  | "reporting"
  | "internal"
  | "custom"
  | "cession_vente"
  | "acquisition_achats"
  | "lbo_levee_fonds"
  | "fusion_partenariat"
  | "ipo";

// ============================================================================
// BRAND KIT (Alecia Brand Identity)
// ============================================================================

/**
 * Palette de couleurs de la marque Alecia
 */
export interface BrandColors {
  primary: string; // Navy #0a1628
  accent: string; // Gold #c9a84c
  secondary: string; // Additional brand color
  text: {
    primary: string; // On-light text
    secondary: string; // On-dark text
  };
  backgrounds: {
    light: string;
    dark: string;
    card: string;
  };
}

/**
 * Configuration typographique de la marque
 */
export interface BrandTypography {
  heading: {
    fontFamily: string; // Inter
    weights: number[]; // [600, 700, 800]
  };
  body: {
    fontFamily: string;
    weights: number[];
  };
  mono: {
    fontFamily: string; // For numbers/data
    weights: number[];
  };
}

/**
 * Variantes de logos Alecia
 */
export interface BrandLogos {
  primary: string; // SVG or PNG
  white: string; // For dark backgrounds
  icon: string; // Small icon variant
  watermark: string; // Ampersand "&" watermark
}

/**
 * Modèle de bloc réutilisable
 */
export interface BlockTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  block: ContentBlock;
  thumbnail?: string;
}

/**
 * Palette de couleurs alternative
 */
export interface ColorPalette {
  id: string;
  name: string;
  colors: BrandColors;
  preview?: string;
}

/**
 * Master de slide (fondation)
 */
export interface SlideMaster {
  id: string;
  name: string;
  type: "title" | "content" | "section" | "closing" | "chart" | "table";
  layout: SlideLayout;
  background: BackgroundSettings;
  blocks: ContentBlock[];
  styles: BlockStyles;
}

/**
 * Kit de marque complet Alecia
 */
export interface BrandKit {
  colors: BrandColors;
  typography: BrandTypography;
  logos: BrandLogos;
  templates: {
    slideMasters: SlideMaster[];
    blockTemplates: BlockTemplate[];
    colorPalettes: ColorPalette[];
  };
}

// ============================================================================
// CHAT ET IA
// ============================================================================

/**
 * Message du chat
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  isStreaming?: boolean;
}

/**
 * Pièce jointe à un message
 */
export interface Attachment {
  id: string;
  type: "image" | "document" | "slide";
  name: string;
  url: string;
  size?: number;
}

/**
 * Session de chat
 */
export interface ChatSession {
  id: string;
  presentationId: string;
  messages: ChatMessage[];
  context?: ChatContext;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contexte pour le chat IA
 */
export interface ChatContext {
  presentationSummary?: string;
  selectedSlides?: string[];
  currentTopic?: string;
  suggestions?: string[];
}

// ============================================================================
// AI AGENT (M&A Intelligence)
// ============================================================================

/**
 * Contexte d'un projet pour l'IA
 */
export interface ProjectContext {
  project: {
    id: string;
    name: string;
    targetCompany?: string;
    targetSector?: string;
    dealType?: string;
    potentialBuyers?: string[];
    keyIndividuals?: string[];
  };
  slides: Slide[];
  brandKit: BrandKit;
  dealType: string;
  clientInfo: Record<string, string>;
}

/**
 * Contexte d'une slide pour l'IA
 */
export interface SlideContext {
  slide: Slide;
  project: {
    id: string;
    name: string;
    targetCompany?: string;
    dealType?: string;
  };
  adjacentSlides: Slide[];
  brandKit: BrandKit;
}

/**
 * Contenu généré par l'IA
 */
export interface GeneratedContent {
  text: string;
  suggestions?: string[];
  confidence?: number;
}

/**
 * Brief pour génération de deck complet
 */
export interface DeckBrief {
  clientName: string;
  clientSector: string;
  dealType: string;
  keyMetrics: {
    revenue?: number;
    ebitda?: number;
    growth?: number;
    multiple?: number;
  };
  teamSize?: number;
  yearFounded?: number;
  transactionRationale?: string;
}

/**
 * Deck généré par l'IA
 */
export interface GeneratedDeck {
  slides: Array<{
    type: string;
    title: string;
    content: string;
  }>;
  executiveSummary?: string;
}

/**
 * Séquence de slides suggérée
 */
export interface SlideSequence {
  slides: Array<{
    type: string;
    title: string;
    rationale: string;
  }>;
  totalSlides: number;
}

/**
 * Agent IA pour PitchForge
 */
export interface AIAgent {
  gatherProjectContext(): Promise<ProjectContext>;
  gatherSlideContext(slideId: string): Promise<SlideContext>;
  generateSlideContent(
    prompt: string,
    context: SlideContext,
  ): Promise<GeneratedContent>;
  generateDeckFromBrief(brief: DeckBrief): Promise<GeneratedDeck>;
  enhanceExistingContent(
    content: string,
    intent: "polish" | "shorten" | "expand",
  ): Promise<string>;
  suggestSlideSequence(dealType: string): Promise<SlideSequence>;
  generateExecutiveSummary(project: ProjectContext): Promise<string>;
  generateTalkingPoints(slide: Slide): Promise<string[]>;
}

/**
 * Paramètres du fournisseur IA
 */
export interface AIProviderSettings {
  provider: "convex_builtin" | "openai" | "anthropic" | "custom";
  baseUrl?: string;
  apiKey?: string;
  model: string;
  apiFormat: "openai" | "anthropic";
  systemPromptExtra?: string;
}

// ============================================================================
// IMPORT/EXPORT
// ============================================================================

/**
 * Options d'export
 */
export interface ExportOptions {
  format: "pptx" | "pdf" | "images";
  includeHiddenSlides: boolean;
  includeNotes: boolean;
  quality: "low" | "medium" | "high";
  filename: string;
  selectedSlides?: string[];
}

/**
 * Résultat d'une importation
 */
export interface ImportResult {
  success: boolean;
  message: string;
  slides?: Slide[];
  errors?: ImportError[];
}

export interface ImportError {
  file: string;
  error: string;
}

// ============================================================================
// ÉVÉNEMENTS SOCKET.IO
// ============================================================================

/**
 * Types d'événements de collaboration
 */
export type CollaborationEventType =
  | "user_joined"
  | "user_left"
  | "slide_updated"
  | "slide_added"
  | "slide_removed"
  | "slide_reordered"
  | "variable_changed"
  | "cursor_moved"
  | "selection_changed";

/**
 * Événement de collaboration
 */
export interface CollaborationEvent {
  type: CollaborationEventType;
  userId: string;
  presentationId: string;
  timestamp: Date;
  data: unknown;
}

// ============================================================================
// UI ET ÉTAT
// ============================================================================

/**
 * État de l'éditeur
 */
export interface EditorState {
  selectedSlideId: string | null;
  selectedBlockId: string | null;
  zoom: number;
  isPreviewMode: boolean;
  isFullscreen: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  activeTab: "slides" | "templates" | "variables" | "chat";
}

/**
 * Notification
 */
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================================================
// API ET RÉPONSES
// ============================================================================

/**
 * Réponse API standard
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiMeta {
  page?: number;
  perPage?: number;
  total?: number;
  totalPages?: number;
}
