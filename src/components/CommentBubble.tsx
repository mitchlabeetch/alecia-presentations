import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface Comment {
  _id: Id<"comments">;
  text: string;
  authorName: string;
  authorEmail?: string;
  field?: string;
  resolved: boolean;
  aiResponse?: string;
  createdAt: number;
  parentCommentId?: Id<"comments">;
  mentions?: string[];
}

interface Props {
  comment: Comment;
  slideTitle: string;
  slideContent: string;
  slideType: string;
  slideId: Id<"slides">;
  projectId: Id<"projects">;
  isReply?: boolean;
}

const FIELD_LABELS: Record<string, { label: string; color: string }> = {
  title: { label: "Titre", color: "bg-blue-100 text-blue-700" },
  content: { label: "Contenu", color: "bg-purple-100 text-purple-700" },
  notes: { label: "Notes", color: "bg-gray-100 text-gray-600" },
  general: { label: "Général", color: "bg-[#1a3a5c]/10 text-[#1a3a5c]" },
};

// Highlight @mentions in text
function HighlightMentions({ text }: { text: string }) {
  const mentionRegex = /@[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  
  // Replace mentions with highlighted version
  const highlighted = text.replace(mentionRegex, (match) => 
    `<<<MENTION>>>${match}<<<ENDMENTION>>>`
  );
  
  const parts = highlighted.split(/(<<<MENTION>>>|<<<ENDMENTION>>>)/);
  const result: React.ReactNode[] = [];
  let isMention = false;
  let key = 0;
  
  for (const part of parts) {
    if (part === "<<<MENTION>>>") {
      isMention = true;
    } else if (part === "<<<ENDMENTION>>>") {
      isMention = false;
    } else if (part) {
      if (isMention) {
        result.push(
          <span key={`mention-${key++}`} className="bg-blue-100 text-blue-700 px-1 rounded font-medium">
            {part}
          </span>
        );
      } else {
        result.push(part);
      }
    }
  }
  
  return (
    <p className="text-xs text-gray-700 leading-relaxed">
      {result.length > 0 ? result : text}
    </p>
  );
}

export function CommentBubble({ comment, slideTitle, slideContent, slideType, slideId, projectId, isReply = false }: Props) {
  const resolveComment = useMutation(api.comments.resolve);
  const removeComment = useMutation(api.comments.remove);
  const requestAI = useMutation(api.comments.requestAiResponse);
  const addComment = useMutation(api.comments.add);
  const replies = useQuery(api.comments.getReplies, { commentId: comment._id }) ?? [];
  const [loadingAI, setLoadingAI] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

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

  async function handleReply() {
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    try {
      await addComment({
        slideId,
        projectId,
        text: replyText.trim(),
        field: "general",
        parentCommentId: comment._id,
      });
      setReplyText("");
      setShowReplyForm(false);
      toast.success("Réponse ajoutée");
    } catch {
      toast.error("Erreur lors de l'ajout de la réponse");
    } finally {
      setSubmittingReply(false);
    }
  }

  const fieldMeta = comment.field ? (FIELD_LABELS[comment.field] ?? { label: comment.field, color: "bg-gray-100 text-gray-600" }) : null;
  const initials = comment.authorName.charAt(0).toUpperCase();
  const avatarColors = ["bg-[#1a3a5c]", "bg-purple-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600"];
  const avatarColor = avatarColors[comment.authorName.charCodeAt(0) % avatarColors.length];

  return (
    <div className={isReply ? "ml-6 border-l-2 border-gray-200 pl-3" : ""}>
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
                  {fieldMeta && !isReply && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${fieldMeta.color}`}>
                      {fieldMeta.label}
                    </span>
                  )}
                  {comment.resolved && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-medium">✓ Résolu</span>
                  )}
                  {comment.parentCommentId && (
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium">↳ Réponse</span>
                  )}
                </div>
                <HighlightMentions text={comment.text} />
                <p className="text-[10px] text-gray-400 mt-1.5">
                  {new Date(comment.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
            {!isReply && (
              <button
                type="button"
                onClick={() => removeComment({ commentId: comment._id })}
                className="text-gray-300 hover:text-red-400 transition-colors text-xs flex-shrink-0 p-0.5 rounded hover:bg-red-50"
                title="Supprimer"
              >✕</button>
            )}
          </div>

          {/* AI Response */}
          {comment.aiResponse && (
            <div className="mt-2.5 rounded-lg bg-[#1a3a5c]/5 border border-[#1a3a5c]/10 overflow-hidden">
              <button
                type="button"
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
          {!comment.resolved && !isReply && (
            <div className="flex gap-2 mt-2.5">
              <button
                type="button"
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
                type="button"
                onClick={handleResolve}
                disabled={resolving}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 text-[10px] font-medium hover:bg-emerald-50 disabled:opacity-50 transition-colors"
              >
                {resolving ? "..." : "✓ Résoudre"}
              </button>
              <button
                type="button"
                onClick={() => setShowReplyForm(r => !r)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-[10px] font-medium hover:bg-gray-50 transition-colors"
              >
                ↳ Répondre
              </button>
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-200">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                placeholder="Ajouter une réponse... (@email pour mentionner)"
                rows={2}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:border-[#1a3a5c] focus:ring-1 focus:ring-[#1a3a5c]/10 resize-none transition-all"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleReply}
                  disabled={!replyText.trim() || submittingReply}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#1a3a5c] text-white text-[10px] font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-50 transition-colors"
                >
                  {submittingReply ? "Envoi..." : "Envoyer"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowReplyForm(false); setReplyText(""); }}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-[10px] font-medium hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {!isReply && replies.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowReplies(s => !s)}
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-700 mb-1.5 ml-6"
          >
            <span>{showReplies ? "▾" : "▸"}</span>
            <span>{replies.length} réponse{replies.length !== 1 ? "s" : ""}</span>
          </button>
          {showReplies && replies.map((reply: Comment) => (
            <CommentBubble
              key={reply._id}
              comment={reply}
              slideTitle={slideTitle}
              slideContent={slideContent}
              slideType={slideType}
              slideId={slideId}
              projectId={projectId}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
