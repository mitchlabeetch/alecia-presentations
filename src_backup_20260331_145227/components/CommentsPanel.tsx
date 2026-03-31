import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { CommentBubble } from "./CommentBubble";

interface Props {
  slideId: Id<"slides">;
  projectId: Id<"projects">;
  slide: Doc<"slides">;
}

const FIELD_OPTIONS = [
  { value: "title", label: "Titre", icon: "📌" },
  { value: "content", label: "Contenu", icon: "📝" },
  { value: "notes", label: "Notes", icon: "🗒" },
  { value: "general", label: "Général", icon: "💬" },
];

export function CommentsPanel({ slideId, projectId, slide }: Props) {
  const comments = useQuery(api.comments.list, { slideId }) ?? [];
  const addComment = useMutation(api.comments.add);
  const [text, setText] = useState("");
  const [field, setField] = useState<string>("content");
  const [showResolved, setShowResolved] = useState(false);
  const [adding, setAdding] = useState(false);

  const open = comments.filter(c => !c.resolved);
  const resolved = comments.filter(c => c.resolved);

  async function handleAdd() {
    if (!text.trim()) return;
    setAdding(true);
    try {
      await addComment({ slideId, projectId, text: text.trim(), field });
      setText("");
      toast.success("Commentaire ajouté");
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-amber-50/60 to-transparent flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">💬</span>
            <p className="text-xs font-bold text-gray-700">Commentaires & Révisions</p>
          </div>
          <div className="flex items-center gap-1.5">
            {open.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                {open.length} ouvert{open.length !== 1 ? "s" : ""}
              </span>
            )}
            {resolved.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                {resolved.length} résolu{resolved.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add comment form */}
      <div className="p-3 border-b border-gray-100 bg-white flex-shrink-0">
        {/* Field selector */}
        <div className="flex gap-1 mb-2">
          {FIELD_OPTIONS.map(o => (
            <button
              key={o.value}
              onClick={() => setField(o.value)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                field === o.value
                  ? "bg-[#1a3a5c] text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <span>{o.icon}</span>
              <span>{o.label}</span>
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); } }}
          placeholder="Ajouter un commentaire ou une révision... (↵ pour envoyer)"
          rows={2}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 resize-none transition-all text-gray-800 placeholder-gray-400"
        />
        <button
          onClick={handleAdd}
          disabled={!text.trim() || adding}
          className="mt-2 w-full px-3 py-2 rounded-xl bg-[#1a3a5c] text-white text-xs font-semibold hover:bg-[#1a3a5c]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          {adding ? (
            <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Ajout...</>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un commentaire
            </>
          )}
        </button>
      </div>

      {/* Comments list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {open.length === 0 && (
          <div className="text-center py-10">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
              <span className="text-lg">💬</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Aucun commentaire ouvert</p>
            <p className="text-[10px] text-gray-400 mt-1">Ajoutez un commentaire pour collaborer</p>
          </div>
        )}
        {open.map(c => (
          <CommentBubble
            key={c._id}
            comment={c}
            slideTitle={slide.title}
            slideContent={slide.content}
            slideType={slide.type}
          />
        ))}

        {resolved.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowResolved(s => !s)}
              className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 flex items-center justify-center gap-1.5 rounded-xl hover:bg-gray-50 transition-colors border border-dashed border-gray-200"
            >
              <span>{showResolved ? "▾" : "▸"}</span>
              <span>{resolved.length} commentaire{resolved.length !== 1 ? "s" : ""} résolu{resolved.length !== 1 ? "s" : ""}</span>
            </button>
            {showResolved && (
              <div className="space-y-2 mt-2">
                {resolved.map(c => (
                  <CommentBubble
                    key={c._id}
                    comment={c}
                    slideTitle={slide.title}
                    slideContent={slide.content}
                    slideType={slide.type}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
