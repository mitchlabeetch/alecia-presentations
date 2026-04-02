import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Settings, Loader2, Send, MessageSquare, Trash2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { AISettings } from './AISettings';
import { useAppStore } from '@/store/useAppStore';
import type { ChatMessage as ChatMessageType } from '@/types';

interface AIChatPanelProps {
  projectId: string;
  onClose?: () => void;
}

// Mock AI responses for demonstration
const MOCK_RESPONSES = [
  "Je comprends votre demande. Pour un pitch deck M&A professionnel, je vous recommande de structurer votre présentation avec une section de couverture, un ordre du jour, puis les sections clés : Contexte de la transaction, Présentation de l'entreprise cible, Analyse SWOT, Valorisation, et Conclusion.",
  "Concernant la valorisation d'une PME française, les méthodes couramment utilisées sont :\n- Multiple de transactions comparables\n- DCF (actualisation des flux de trésorerie)\n- ANR (actif net réel)\n\nJe peux vous aider à calculer ces valorisation si vous me fournissez les données financières.",
  "Pour une cession d'entreprise, les points essentiels à couvrir sont :\n1. Présentation de l'entreprise et de son historique\n2. Secteur d'activité et marché\n3. Performances financières\n4. Avantages concurrentiels\n5. Motifs de la cession\n6. Projections futures\n\nVoulez-vous que je vous aide à développer l'un de ces points ?",
  "Dans le contexte actuel du marché M&A français pour les PME et ETI, les multiples de valorisation observés varient généralement entre 4x et 8x l'EBITDA selon le secteur. Les secteurs technologiques et de santé commandent généralement des multiples plus élevés.",
  "Pour une levée de fonds réussie, votre pitch deck doit clairement démontrer :\n- La taille du marché adressable\n- Votre avantage concurrentiel\n- L'équipe dirigeante\n- Les projections financières réalistes\n- L'utilisation prévue des fonds levés",
  "Je peux vous suggérer plusieurs types de diapositives pour enrichir votre présentation :\n- Timeline du processus de transaction\n- Grille des advisors et leur expertise\n- Carte des acquéreurs potentiels\n- Indicateurs clés de performance (KPIs)\n\nSur quel aspect souhaitez-vous approfondir ?",
];

export function AIChatPanel({ projectId, onClose }: AIChatPanelProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMasterAccess = useAppStore((state) => state.hasMasterAccess);
  const chatMessages = useAppStore((state) => state.chatMessages);
  const addChatMessage = useAppStore((state) => state.addChatMessage);
  const clearChatMessages = useAppStore((state) => state.clearChatMessages);

  // Get messages for current project
  const messages = chatMessages[projectId] || [];

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get random mock response
  const getMockResponse = useCallback(() => {
    return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  }, []);

  // Simulate streaming response
  const simulateStreamingResponse = useCallback(async (response: string) => {
    setIsLoading(true);
    setStreamingContent('');

    // Add empty assistant message
    const tempMessage: ChatMessageType = {
      id: `msg-temp-${Date.now()}`,
      projectId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
    };

    // Stream characters one by one
    for (let i = 0; i < response.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 20));
      setStreamingContent(response.slice(0, i + 1));
    }

    // Save complete message to store
    const finalMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      projectId,
      role: 'assistant',
      content: response,
      createdAt: Date.now(),
    };
    addChatMessage(projectId, finalMessage);

    setStreamingContent('');
    setIsLoading(false);
  }, [projectId, addChatMessage]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !hasMasterAccess) return;

    // Add user message to store
    addChatMessage(projectId, {
      projectId,
      role: 'user',
      content,
    });

    // Simulate AI thinking then response
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500));
    const mockResponse = getMockResponse();
    await simulateStreamingResponse(mockResponse);
  }, [projectId, hasMasterAccess, addChatMessage, getMockResponse, simulateStreamingResponse]);

  const handleClearChat = useCallback(() => {
    clearChatMessages(projectId);
  }, [projectId, clearChatMessages]);

  if (!hasMasterAccess) {
    return (
      <div className="w-80 h-full bg-white border-l border-alecia-silver/20 flex flex-col">
        <div className="p-4 border-b border-alecia-silver/20 flex items-center justify-between">
          <h3 className="font-semibold text-alecia-navy flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Assistant IA
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-alecia-silver/10 rounded-md transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5 text-alecia-silver" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-alecia-light-gray rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-alecia-silver" />
            </div>
            <h4 className="font-semibold text-alecia-navy mb-2">Accès restreint</h4>
            <p className="text-sm text-alecia-silver leading-relaxed">
              Entrez le mot de passe maître pour accéder à l'assistant IA.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white border-l border-alecia-silver/20 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-alecia-silver/20 flex items-center justify-between">
        <h3 className="font-semibold text-alecia-navy flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Assistant IA
        </h3>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-1.5 hover:bg-alecia-red/10 rounded-md transition-colors group"
              title="Effacer la conversation"
            >
              <Trash2 className="w-4 h-4 text-alecia-silver group-hover:text-alecia-red" />
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-md transition-colors ${
              showSettings ? 'bg-alecia-navy/10' : 'hover:bg-alecia-silver/10'
            }`}
            title="Paramètres"
          >
            <Settings
              className={`w-4 h-4 ${showSettings ? 'text-alecia-navy' : 'text-alecia-silver'}`}
            />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-alecia-silver/10 rounded-md transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5 text-alecia-silver" />
          </button>
        </div>
      </div>

      {/* Content */}
      {showSettings ? (
        <div className="flex-1 overflow-y-auto p-4">
          <AISettings />
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-8 px-4">
                <div className="w-14 h-14 bg-alecia-light-gray rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-7 h-7 text-alecia-silver" />
                </div>
                <h4 className="font-medium text-alecia-navy mb-2">
                  Bienvenue dans l'assistant IA
                </h4>
                <p className="text-sm text-alecia-silver leading-relaxed">
                  Je peux vous aider à créer des diapositives, rédiger du contenu
                  pour vos pitch decks M&A, et répondre à vos questions sur les
                  transactions.
                </p>
                <div className="mt-6 space-y-2 text-left">
                  <p className="text-xs text-alecia-silver font-medium mb-2">
                    Exemples de demandes :
                  </p>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleSendMessage("Comment structurer un pitch deck pour une cession d'entreprise ?")}
                      className="w-full text-left px-3 py-2 text-sm bg-alecia-light-gray rounded-md hover:bg-alecia-silver/20 transition-colors text-alecia-navy"
                    >
                      Comment structurer un pitch deck pour une cession ?
                    </button>
                    <button
                      onClick={() => handleSendMessage("Quels sont les multiples de valorisation actuels pour les PME françaises ?")}
                      className="w-full text-left px-3 py-2 text-sm bg-alecia-light-gray rounded-md hover:bg-alecia-silver/20 transition-colors text-alecia-navy"
                    >
                      Multiples de valorisation pour PME françaises ?
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Render messages */}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Streaming indicator */}
            {isLoading && streamingContent && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg p-3 bg-alecia-silver/10 text-alecia-navy">
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {streamingContent}
                    <span className="inline-block w-2 h-4 ml-1 bg-alecia-navy animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && !streamingContent && (
              <div className="flex items-center gap-2 text-alecia-silver py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">L'assistant IA réfléchit...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-alecia-silver/20 p-4 bg-white">
            <ChatInput
              onSend={handleSendMessage}
              disabled={isLoading}
              placeholder="Tapez votre message..."
            />
          </div>
        </>
      )}
    </div>
  );
}
