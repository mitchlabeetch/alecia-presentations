// AI Chat Components for Alecia Presentations
// Composants de chat IA pour Alecia Presentations

export { ChatInterface, ChatFloatingButton } from './ChatInterface';
export { ChatMessage } from './ChatMessage';
export { ChatInput } from './ChatInput';
export { 
  SuggestionChips, 
  ContextualSuggestions, 
  TemplateSuggestions 
} from './SuggestionChips';
export { 
  useAIChat, 
  quickSuggestions 
} from './useAIChat';

// Types
export type { 
  ChatMessage, 
  MessageRole, 
  SuggestionChip, 
  TemplateRecommendation,
  SlideGenerationRequest 
} from './useAIChat';
