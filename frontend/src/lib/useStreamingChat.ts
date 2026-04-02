import { useCallback, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { ChatMessage as ChatMessageType } from '@/types';

// Mock AI responses for when no backend is available
const MOCK_RESPONSES = [
  "Je comprends votre demande. Pour un pitch deck M&A professionnel, je vous recommande de structurer votre présentation avec une section de couverture, un ordre du jour, puis les sections clés : Contexte de la transaction, Présentation de l'entreprise cible, Analyse SWOT, Valorisation, et Conclusion.",
  "Concernant la valorisation d'une PME française, les méthodes couramment utilisées sont :\n- Multiple de transactions comparables\n- DCF (actualisation des flux de trésorerie)\n- ANR (actif net réel)\n\nJe peux vous aider à calculer ces valorisation si vous me fournissez les données financières.",
  "Pour une cession d'entreprise, les points essentiels à couvrir sont :\n1. Présentation de l'entreprise et de son historique\n2. Secteur d'activité et marché\n3. Performances financières\n4. Avantages concurrentiels\n5. Motifs de la cession\n6. Projections futures\n\nVoulez-vous que je vous aide à développer l'un de ces points ?",
  "Dans le contexte actuel du marché M&A français pour les PME et ETI, les multiples de valorisation observés varient généralement entre 4x et 8x l'EBITDA selon le secteur. Les secteurs technologiques et de santé commandent généralement des multiples plus élevés.",
  "Pour une levée de fonds réussie, votre pitch deck doit clairement démontrer :\n- La taille du marché adressable\n- Votre avantage concurrentiel\n- L'équipe dirigeante\n- Les projections financières réalistes\n- L'utilisation prévue des fonds levés",
  "Je peux vous suggérer plusieurs types de diapositives pour enrichir votre présentation :\n- Timeline du processus de transaction\n- Grille des advisors et leur expertise\n- Carte des acquéreurs potentiels\n- Indicateurs clés de performance (KPIs)\n\nSur quel aspect souhaitez-vous approfondir ?",
];

interface UseStreamingChatOptions {
  projectId: string;
  onMessage: (content: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export function useStreamingChat({
  projectId,
  onMessage,
  onComplete,
  onError,
}: UseStreamingChatOptions) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasMasterAccess = useAppStore((state) => state.hasMasterAccess);

  const getRandomMockResponse = useCallback(() => {
    return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!hasMasterAccess) {
        onError(new Error("Accès maître requis pour utiliser l'IA"));
        return;
      }

      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      try {
        // Try to use real API first
        const response = await fetch(`/api/chat/${projectId}/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
          signal: abortControllerRef.current.signal,
        });

        if (response.ok) {
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('Pas de flux de données');
          }

          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  onComplete();
                  return;
                }
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    onMessage(parsed.content);
                  }
                } catch {
                  // Ignore invalid JSON
                }
              }
            }
          }

          onComplete();
          return;
        }
      } catch (error) {
        // If API fails, fall back to mock response
        if ((error as Error).name !== 'AbortError') {
          console.log('API non disponible, utilisation des réponses mock');
        }
      }

      // Fallback to mock streaming response
      const mockResponse = getRandomMockResponse();
      
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

      // Stream mock response character by character
      for (let i = 0; i < mockResponse.length; i++) {
        if (abortControllerRef.current?.signal.aborted) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 20));
        onMessage(mockResponse[i]);
      }

      onComplete();
    },
    [projectId, hasMasterAccess, onMessage, onComplete, onError, getRandomMockResponse]
  );

  const cancelStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return {
    sendMessage,
    cancelStreaming,
    isStreaming: false,
  };
}

// Helper hook to manage chat messages with the store
export function useChatMessages(projectId: string) {
  const chatMessages = useAppStore((state) => state.chatMessages);
  const addChatMessage = useAppStore((state) => state.addChatMessage);
  const clearChatMessages = useAppStore((state) => state.clearChatMessages);

  return {
    messages: chatMessages[projectId] || [],
    addMessage: (message: Omit<ChatMessageType, 'id' | 'createdAt'>) =>
      addChatMessage(projectId, message),
    clearMessages: () => clearChatMessages(projectId),
  };
}
