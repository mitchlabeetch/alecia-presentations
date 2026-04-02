import { useState, useRef, useEffect } from 'react';
import { X, Settings, Loader2, Send, MessageSquare } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { AISettings } from './AISettings';
import { useStreamingChat } from '@/lib/useStreamingChat';
import { useAppStore } from '@/store/useAppStore';
import type { ChatMessage as ChatMessageType } from '@/types';

interface AIChatPanelProps {
  projectId: string;
  onClose?: () => void;
}

export function AIChatPanel({ projectId, onClose }: AIChatPanelProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMasterAccess = useAppStore((state) => state.hasMasterAccess);

  const { sendMessage, isStreaming } = useStreamingChat({
    projectId,
    onMessage: (content) => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.role === 'assistant') {
          return prev.map((msg, i) =>
            i === prev.length - 1 ? { ...msg, content: msg.content + content } : msg
          );
        }
        return [...prev, { id: `temp-${Date.now()}`, projectId, role: 'assistant', content, createdAt: Date.now() }];
      });
    },
    onComplete: () => {
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      console.error('Chat error:', error);
    },
  });

  useEffect(() => {
    fetchMessages();
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      projectId,
      role: 'user',
      content,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    await sendMessage(content);
  };

  const handleClearChat = async () => {
    try {
      await fetch(`/api/chat/${projectId}`, { method: 'DELETE' });
      setMessages([]);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  if (!hasMasterAccess) {
    return (
      <div className="w-80 h-full bg-white border-l border-alecia-silver/20 flex flex-col">
        <div className="p-4 border-b border-alecia-silver/20 flex items-center justify-between">
          <h3 className="font-semibold text-alecia-navy flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Assistant IA
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-alecia-silver/10 rounded">
            <X className="w-5 h-5 text-alecia-silver" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-alecia-silver mx-auto mb-4" />
            <h4 className="font-medium text-alecia-navy mb-2">Accès restreint</h4>
            <p className="text-sm text-alecia-silver">
              Entrez le mot de passe maître pour accéder à l'assistant IA.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white border-l border-alecia-silver/20 flex flex-col">
      <div className="p-4 border-b border-alecia-silver/20 flex items-center justify-between">
        <h3 className="font-semibold text-alecia-navy flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Assistant IA
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-alecia-silver/10 rounded"
            title="Paramètres"
          >
            <Settings className="w-5 h-5 text-alecia-silver" />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-alecia-silver/10 rounded">
            <X className="w-5 h-5 text-alecia-silver" />
          </button>
        </div>
      </div>

      {showSettings ? (
        <div className="flex-1 overflow-y-auto p-4">
          <AISettings />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-alecia-silver mx-auto mb-4" />
                <h4 className="font-medium text-alecia-navy mb-2">Commencez une conversation</h4>
                <p className="text-sm text-alecia-silver">
                  Je peux vous aider à créer des diapositives, rédiger du contenu, et plus encore.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-alecia-silver">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">L'assistant IA réfléchit...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-alecia-silver/20 p-4">
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
