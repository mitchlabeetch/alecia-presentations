/**
 * Alecia Presentations - Type Definitions
 * Tous les types TypeScript pour le serveur
 */

// ============================================================================
// Projet et Slides
// ============================================================================

export interface Project {
  id: string;
  name: string;
  pin_hash: string | null;
  user_tag: string | null;
  target_company: string | null;
  target_sector: string | null;
  deal_type: DealType;
  potential_buyers: string[];
  key_individuals: string[];
  theme_primary_color: string;
  theme_accent_color: string;
  theme_font_family: string;
  theme_logo_path: string | null;
  template_id: string | null;
  created_at: number;
  updated_at: number;
}

export type DealType = 'cession_vente' | 'lbo_levee_fonds' | 'acquisition_achat' | 'custom';

export interface Slide {
  id: string;
  project_id: string;
  order_index: number;
  type: SlideType;
  title: string;
  content: SlideContent;
  notes: string | null;
  image_path: string | null;
  data: string | null;
  docling_json: string | null;
  created_at: number;
  updated_at: number;
}

export type SlideType =
  | 'Cover'
  | 'Section_Navigator'
  | 'Company_Overview'
  | 'Trackrecord_Block'
  | 'Table_Block'
  | 'KPI_Card'
  | 'Process_Timeline'
  | 'Deal_Rationale'
  | 'SWOT'
  | 'Text_Block'
  | 'Image_Block'
  | 'Chart_Block'
  | 'Comparison_Table'
  | 'Quote_Block'
  | 'Team_Members'
  | 'Financial_Summary'
  | 'Market_Analysis'
  | 'Valuation_Methodology'
  | 'Risk_Analysis'
  | 'Timeline_Milestones'
  | 'Contact_Block';

export interface SlideContent {
  [key: string]: unknown;
}

// ============================================================================
// Templates
// ============================================================================

export interface Template {
  id: string;
  name: string;
  description: string | null;
  category: TemplateCategory;
  slides: TemplateSlide[];
  is_custom: boolean;
  thumbnail_path: string | null;
  created_at: number;
}

export type TemplateCategory =
  | 'cession_vente'
  | 'lbo_levee_fonds'
  | 'acquisition_achats'
  | 'custom';

export interface TemplateSlide {
  orderIndex: number;
  type: SlideType;
  title: string;
  content: Record<string, unknown>;
}

// ============================================================================
// Chat et IA
// ============================================================================

export interface ChatMessage {
  id: string;
  project_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: number;
}

export interface AIProvider {
  id: string;
  name: string;
  baseUrl: string;
  defaultModel: string;
  supportsStreaming: boolean;
  apiFormat: 'openai' | 'anthropic' | 'ollama';
}

export interface AIStreamChunk {
  type: 'content' | 'done' | 'error';
  content?: string;
  error?: string;
}

export interface AISettings {
  id: string;
  provider: string;
  base_url: string | null;
  api_key: string | null;
  model: string;
  api_format: 'openai' | 'anthropic' | 'ollama';
  system_prompt_extra: string | null;
  created_at: number;
}

// Liste des providers IA supportés
export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'anthropic/claude-3.5-sonnet',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4-turbo-preview',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-5-sonnet-20241022',
    supportsStreaming: true,
    apiFormat: 'anthropic',
  },
  {
    id: 'ollama',
    name: 'Ollama',
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
    defaultModel: 'llama3',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.1-70b-versatile',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'mistral',
    name: 'Mistral',
    baseUrl: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-large-latest',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'cohere',
    name: 'Cohere',
    baseUrl: 'https://api.cohere.ai/v2',
    defaultModel: 'command-r-plus',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'together',
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    defaultModel: 'meta-llama/Llama-3-70b-chat-hf',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    defaultModel: 'accounts/fireworks/models/llama-v3-70b-instruct',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    baseUrl: 'https://api.perplexity.ai',
    defaultModel: 'sonar-pro',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'azure',
    name: 'Azure OpenAI',
    baseUrl: process.env.AZURE_OPENAI_ENDPOINT || '',
    defaultModel: 'gpt-4-turbo',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'vertex',
    name: 'Google Vertex AI',
    baseUrl: process.env.VERTEX_AI_ENDPOINT || '',
    defaultModel: 'gemini-1.5-pro',
    supportsStreaming: true,
    apiFormat: 'anthropic',
  },
  {
    id: 'aws_bedrock',
    name: 'AWS Bedrock',
    baseUrl: '',
    defaultModel: 'anthropic.claude-3-5-sonnet-20241022-v1:0',
    supportsStreaming: true,
    apiFormat: 'anthropic',
  },
  {
    id: 'replicate',
    name: 'Replicate',
    baseUrl: 'https://api.replicate.com/v1',
    defaultModel: 'meta/meta-llama-3-70b-instruct',
    supportsStreaming: false,
    apiFormat: 'openai',
  },
  {
    id: 'anyscale',
    name: 'Anyscale',
    baseUrl: 'https://api.endpoints.anyscale.com/v1',
    defaultModel: 'meta-llama/Llama-3-70b-chat-hf',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'openllm',
    name: 'OpenLLM',
    baseUrl: process.env.OPENLLM_BASE_URL || 'http://localhost:3000/v1',
    defaultModel: 'llama-3.1-8b-instruct',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'lmstudio',
    name: 'LM Studio',
    baseUrl: process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234/v1',
    defaultModel: 'local-model',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'textgen',
    name: 'Text Generation WebUI',
    baseUrl: process.env.TEXTGEN_BASE_URL || 'http://localhost:5000/v1',
    defaultModel: 'local-model',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
  {
    id: 'koboldcpp',
    name: 'KoboldCPP',
    baseUrl: process.env.KOBOLDCPP_BASE_URL || 'http://localhost:5001/v1',
    defaultModel: 'local-model',
    supportsStreaming: true,
    apiFormat: 'openai',
  },
];

// ============================================================================
// Commentaires
// ============================================================================

export interface Comment {
  id: string;
  slide_id: string;
  project_id: string;
  author_tag: string | null;
  field: string | null;
  text: string;
  resolved: boolean;
  ai_response: string | null;
  parent_comment_id: string | null;
  created_at: number;
}

export interface CreateCommentDTO {
  slideId: string;
  projectId: string;
  authorTag?: string;
  field?: string;
  text: string;
  parentCommentId?: string;
}

export interface UpdateCommentDTO {
  text?: string;
  resolved?: boolean;
}

// ============================================================================
// Variables
// ============================================================================

export interface VariableValue {
  key: string;
  value: string;
}

export interface VariablePreset {
  id: string;
  project_id: string | null;
  name: string;
  variables: VariableValue[];
  is_default: boolean;
  created_at: number;
}

// ============================================================================
// Deals
// ============================================================================

export interface Deal {
  id: string;
  deal_id: number;
  company: string;
  annee_deal: number | null;
  type_deal: string | null;
  responsable_deal: string | null;
  equipier_deal: string | null;
  is_client_ou_contrepartie: string | null;
  description_deal: string | null;
  region_deal: string | null;
  sector_deal: string | null;
  taille_operation_m_euro: number | null;
  ca_cible_m_euro: number | null;
  afficher_site: number;
  afficher_pitchdeck: number;
  is_company: number;
  is_alecia: number;
  logo_filename: string | null;
}

// ============================================================================
// Export
// ============================================================================

export interface ExportOptions {
  projectId: string;
  format: 'pptx' | 'pdf' | 'png';
  variablePresetId?: string;
  slideRange?: {
    start: number;
    end: number;
  };
  includeWatermark: boolean;
  aleciaBranding: boolean;
}

export interface ExportResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
}

// ============================================================================
// Import
// ============================================================================

export interface ImportResult {
  success: boolean;
  fileId: string;
  projectId?: string;
  slides?: Slide[];
  error?: string;
}

export interface DoclingSlide {
  orderIndex: number;
  type: SlideType;
  title: string;
  content: SlideContent;
  notes?: string;
  imageData?: string;
}

// ============================================================================
// API Responses
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
