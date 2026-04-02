import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface CommentFormProps {
  slideId?: string;
  projectId?: string;
  parentCommentId?: string;
  onSubmit: (comment: unknown) => void;
  onCancel?: () => void;
}

export function CommentForm({ slideId, projectId, parentCommentId, onSubmit, onCancel }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userTag = useAppStore((state) => state.userTag);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          slideId,
          projectId,
          parentCommentId,
          authorName: userTag || 'Anonyme',
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        onSubmit(comment);
        setContent('');
      }
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Votre commentaire..."
        rows={3}
        className="alecia-input resize-none"
        autoFocus
      />
      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="alecia-btn-secondary flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="flex-1 alecia-btn-primary flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Envoyer
        </button>
      </div>
    </form>
  );
}
