import { formatDistanceToNow } from 'date-fns';
import { frFR } from 'date-fns/locale';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import type { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  onRegenerate?: () => void;
}

export function ChatMessage({ message, onRegenerate }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: frFR });
    } catch {
      return '';
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[85%] rounded-lg p-3
          ${isUser
            ? 'bg-alecia-navy text-white'
            : 'bg-alecia-silver/10 text-alecia-navy'
          }
        `}
      >
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>

        <div className={`flex items-center gap-2 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-xs ${isUser ? 'text-white/70' : 'text-alecia-silver'}`}>
            {formatTime(message.createdAt)}
          </span>
          
          <div className={`flex items-center gap-1 ${isUser ? '' : ''}`}>
            <button
              onClick={handleCopy}
              className={`p-1 rounded hover:bg-white/10 ${isUser ? '' : ''}`}
              title="Copier"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className={`w-3 h-3 ${isUser ? 'text-white/70' : 'text-alecia-silver'}`} />
              )}
            </button>

            {!isUser && onRegenerate && (
              <button
                onClick={onRegenerate}
                className={`p-1 rounded hover:bg-white/10`}
                title="Régénérer"
              >
                <RefreshCw className={`w-3 h-3 ${isUser ? 'text-white/70' : 'text-alecia-silver'}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
