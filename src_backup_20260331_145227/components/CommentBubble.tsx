import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface Comment {
  _id: Id<"comments">;
  text: string;
  authorName: string;
  field?: string;
  resolved: boolean;
  aiResponse?: string;
  createdAt: number;
}

interface Props {
  comment: Comment;
  slideTitle: string;
  slideContent: string;
  slideType: string;
}

const FIELD_LABELS: Record<string, { label: string; color: string }> = {
  title: { label: "Titre", color: "bg-blue-100 text-blue-700" },
  content: { label: "Contenu", color: "bg-purple-100 text-purple-700" },
  notes: { label: "Notes", color: "bg-gray-100 text-gray-600" },
  general: { label: "Général", color: "bg-[#1a3a5c]/10 text-[#1a3a5c]" },
};

export function CommentBubble({ comment, slideTitle, slideContent, slideType }: Props) {
  const resolveComment = useMutation(api.comments.resolve);
  const removeComment = useMutation(api.comments.remove);
  const requestAI = useMutation(api.comments.requestAiResponse);
  const [loadingAI, setLoadingAI] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [resolving, setResolving] = useState(false);

  async function handleAIResolve() {
    setLoadingAI(true);
    try {
      await requestAI({
        commentId: comment._id,
        slideContent,
        slideTitle,
        slideType,
      });
      toast.success("L'IA analyse le commentaire...");
      setExpanded(true);
    } catch {
      toast.error("Erreur lors de la demande IA");
    } finally {
      setLoadingAI(false);
    }
  }

  async function handleResolve() {
    setResolving(true);
    try {
      await resolveComment({ commentId: comment._id });
    } finally {
      setResolving(false);
    }
  }

  const fieldMeta = comment.field ? (FIELD_LABELS[comment.field] ?? { label: comment.field, color: "bg-gray-100 text-gray-600" }) : null;
  const initials = comment.authorName.charAt(0).toUpperCase();
  const avatarColors = ["bg-[#1a3a5c]", "bg-purple-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600"];
  const avatarColor = avatarColors[comment.authorName.charCodeAt(0) % avatarColors.length];

  return (
    <div className={`rounded-xl border transition-all ${comment.resolved ? "border-emerald-100 bg-emerald-50/40 opacity-75" : "border-amber-100 bg-amber-50/40 hover:border-amber-200"}`}>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className={`w-6 h-6 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <span className="text-white text-[9px] font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <span className="text-xs font-semibold text-gray-700">{comment.authorName}</span>
                {fieldMeta && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${fieldMeta.color}`}>
                    {fieldMeta.label}
                  </span>
                )}
                {comment.resolved && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-medium">✓ Résolu</span>
                )}
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{comment.text}</p>
              <p className="text-[10px] text-gray-400 mt-1.5">
                {new Date(comment.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          <button
            onClick={() => removeComment({ commentId: comment._id })}
            className="text-gray-300 hover:text-red-400 transition-colors text-xs flex-shrink-0 p-0.5 rounded hover:bg-red-50"
            title="Supprimer"
          >✕</button>
        </div>

        {/* AI Response */}
        {comment.aiResponse && (
          <div className="mt-2.5 rounded-lg bg-[#1a3a5c]/5 border border-[#1a3a5c]/10 overflow-hidden">
            <button
              onClick={() => setExpanded(e => !e)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1a3a5c]/5 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">✨</span>
                <span className="text-[10px] font-semibold text-[#1a3a5c]">Suggestion IA</span>
              </div>
              <span className="text-[10px] text-gray-400">{expanded ? "▾ Réduire" : "▸ Voir"}</span>
            </button>
            {expanded && (
              <div className="px-3 pb-3">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.aiResponse}</p>
              </div>
            )}
          </div>
        )}

        {/* Loading AI indicator */}
        {loadingAI && !comment.aiResponse && (
          <div className="mt-2.5 rounded-lg bg-[#1a3a5c]/5 border border-[#1a3a5c]/10 px-3 py-2 flex items-center gap-2">
            <div className="w-3 h-3 border border-[#1a3a5c] border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <span className="text-[10px] text-[#1a3a5c]">L'IA analyse et génère une suggestion...</span>
          </div>
        )}

        {/* Actions */}
        {!comment.resolved && (
          <div className="flex gap-2 mt-2.5">
            <button
              onClick={handleAIResolve}
              disabled={loadingAI}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1a3a5c] text-white text-[10px] font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-50 transition-colors flex-1 justify-center"
            >
              {loadingAI ? (
                <><span className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin" /> Analyse IA...</>
              ) : (
                <>✨ {comment.aiResponse ? "Régénérer" : "Demander à l'IA"}</>
              )}
            </button>
            <button
              onClick={handleResolve}
              disabled={resolving}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 text-[10px] font-medium hover:bg-emerald-50 disabled:opacity-50 transition-colors"
            >
              {resolving ? "..." : "✓ Résoudre"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
