import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, MessageSquare, Sparkles, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import type { Comment } from '@/types';

interface CommentItemProps {
  comment: Comment;
  onUpdate: (id: string, updates: Partial<Comment>) => void;
  onDelete: (id: string) => void;
  onResolve: (id: string, resolved: boolean) => void;
}

export function CommentItem({ comment, onUpdate, onDelete, onResolve }: CommentItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatTime = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr });
    } catch {
      return '';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleGenerateAIResponse = async () => {
    try {
      const response = await fetch(`/api/comments/${comment.id}/ai-response`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        onUpdate(comment.id, { 
          content: comment.content + '\n\n---\n' + data.response 
        });
      }
    } catch (error) {
      console.error('Failed to generate AI response:', error);
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg border p-3 transition-all
        ${comment.resolved ? 'border-green-500/30 bg-green-500/5' : 'border-alecia-silver/20'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-alecia-navy flex items-center justify-center">
          <span className="text-white text-xs font-medium">
            {getInitials(comment.authorName || 'AN')}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-alecia-navy text-sm">
              {comment.authorName || 'Anonyme'}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-alecia-silver/10 rounded"
              >
                <MoreVertical className="w-4 h-4 text-alecia-silver" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-alecia-silver/20 py-1 z-10">
                  <button
                    onClick={() => {
                      onResolve(comment.id, !comment.resolved);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-alecia-silver/10 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {comment.resolved ? 'Rouvrir' : 'Résoudre'}
                  </button>
                  <button
                    onClick={handleGenerateAIResponse}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-alecia-silver/10 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Réponse IA
                  </button>
                  <button
                    onClick={() => {
                      onDelete(comment.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-alecia-red/10 text-alecia-red"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-alecia-navy whitespace-pre-wrap break-words">
            {comment.content}
          </p>

          {comment.aiResponse && (
            <div className="mt-2 p-2 bg-alecia-silver/5 rounded border-l-2 border-alecia-navy">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-alecia-navy" />
                <span className="text-xs text-alecia-navy font-medium">Réponse IA</span>
              </div>
              <p className="text-xs text-alecia-navy">{comment.aiResponse}</p>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-alecia-silver">
              {formatTime(comment.createdAt)}
            </span>
            {comment.resolved && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Résolu
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
