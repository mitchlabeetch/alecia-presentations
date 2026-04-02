import { useState, useEffect } from 'react';
import { X, MessageSquare, Check, Filter, SortAsc } from 'lucide-react';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import type { Comment } from '@/types';

interface CommentsPanelProps {
  projectId: string;
  slideId: string | null;
  onClose?: () => void;
}

type FilterType = 'all' | 'unresolved' | 'resolved';
type SortType = 'newest' | 'oldest';

export function CommentsPanel({ projectId, slideId, onClose }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [projectId, slideId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const endpoint = slideId
        ? `/api/comments/slide/${slideId}`
        : `/api/comments/project/${projectId}`;
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = (comment: Comment) => {
    setComments((prev) => [comment, ...prev]);
    setShowForm(false);
  };

  const handleUpdateComment = (id: string, updates: Partial<Comment>) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleResolveComment = async (id: string, resolved: boolean) => {
    try {
      await fetch(`/api/comments/${id}/resolve`, { method: 'POST' });
      handleUpdateComment(id, { resolved });
    } catch (error) {
      console.error('Failed to resolve comment:', error);
    }
  };

  const filteredComments = comments.filter((c) => {
    if (filter === 'unresolved') return !c.resolved;
    if (filter === 'resolved') return c.resolved;
    return true;
  });

  const sortedComments = [...filteredComments].sort((a, b) => {
    if (sort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const unresolvedCount = comments.filter((c) => !c.resolved).length;

  return (
    <div className="w-80 h-full bg-white border-l border-alecia-silver/20 flex flex-col">
      <div className="p-4 border-b border-alecia-silver/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-alecia-navy" />
            <h3 className="font-semibold text-alecia-navy">Commentaires</h3>
            {unresolvedCount > 0 && (
              <span className="bg-alecia-red text-white text-xs px-2 py-0.5 rounded-full">
                {unresolvedCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-alecia-silver/10 rounded">
            <X className="w-5 h-5 text-alecia-silver" />
          </button>
        </div>

        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="alecia-input text-sm flex-1"
          >
            <option value="all">Tous</option>
            <option value="unresolved">Non résolus</option>
            <option value="resolved">Résolus</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="alecia-input text-sm flex-1"
          >
            <option value="newest">Plus récents</option>
            <option value="oldest">Plus anciens</option>
          </select>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="alecia-btn-primary w-full mt-4"
        >
          Ajouter un commentaire
        </button>
      </div>

      {showForm && (
        <div className="border-b border-alecia-silver/20 p-4">
          <CommentForm
            slideId={slideId || undefined}
            onSubmit={handleAddComment}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-alecia-silver">Chargement...</div>
        ) : sortedComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-alecia-silver mx-auto mb-4" />
            <p className="text-alecia-silver">
              {filter === 'all' ? 'Aucun commentaire' : `Aucun commentaire ${filter}`}
            </p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
              onResolve={handleResolveComment}
            />
          ))
        )}
      </div>
    </div>
  );
}
