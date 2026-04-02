import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void | Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, placeholder = 'Tapez votre message...' }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = useCallback(async () => {
    if (!message.trim() || disabled || isLoading) return;

    setIsLoading(true);
    try {
      await onSend(message.trim());
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  }, [message, disabled, isLoading, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="
          flex-1 resize-none rounded-lg border border-alecia-silver/50
          px-3 py-2 text-sm
          focus:border-alecia-navy focus:ring-1 focus:ring-alecia-navy
          disabled:opacity-50 disabled:cursor-not-allowed
          placeholder:text-alecia-silver
          max-h-[120px] overflow-y-auto
        "
      />
      
      <button
        onClick={handleSubmit}
        disabled={!message.trim() || disabled || isLoading}
        className="
          p-2 rounded-lg bg-alecia-navy text-white
          hover:bg-alecia-navy/90
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        "
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
