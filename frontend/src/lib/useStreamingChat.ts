import { useCallback, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface UseStreamingChatOptions {
  projectId: string;
  onMessage: (content: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export function useStreamingChat({ projectId, onMessage, onComplete, onError }: UseStreamingChatOptions) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasMasterAccess = useAppStore((state) => state.hasMasterAccess);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!hasMasterAccess) {
        onError(new Error('Accès maître requis pour utiliser l\'IA'));
        return;
      }

      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(`/api/chat/${projectId}/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'envoi du message');
        }

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
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          onError(error as Error);
        }
      }
    },
    [projectId, hasMasterAccess, onMessage, onComplete, onError]
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
