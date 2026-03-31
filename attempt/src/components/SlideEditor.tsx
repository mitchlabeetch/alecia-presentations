import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { SlidePreview } from "./SlidePreview";
import { CollaborativeSlideEditor } from "./CollaborativeSlideEditor";
import { CommentsPanel } from "./CommentsPanel";

interface Props {
  slide: Doc<"slides">;
  project: Doc<"projects"> | null | undefined;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  slideIndex: number;
  totalSlides: number;
  onDuplicated?: (newIdx: number) => void;
}

const SLIDE_TYPES = [
  { value: "cover", label: "Couverture", icon: "🏛" },
  { value: "executive_summary", label: "Résumé Exécutif", icon: "📋" },
  { value: "thesis", label: "Thèse d'Investissement", icon: "💡" },
  { value: "market", label: "Analyse de Marché", icon: "🌍" },
  { value: "financials", label: "Financiers", icon: "📊" },
  { value: "competition", label: "Concurrence", icon: "⚔️" },
  { value: "team", label: "Équipe", icon: "👥" },
  { value: "timeline", label: "Calendrier", icon: "📅" },
  { value: "swot", label: "SWOT", icon: "🔲" },
  { value: "valuation", label: "Valorisation", icon: "💰" },
  { value: "risk", label: "Risques", icon: "⚠️" },
  { value: "esg", label: "ESG / RSE", icon: "🌱" },
  { value: "synergies", label: "Synergies", icon: "🔗" },
  { value: "process", label: "Processus", icon: "⚙️" },
  { value: "appendix", label: "Annexes", icon: "📎" },
  { value: "custom", label: "Personnalisé", icon: "✏️" },
];

type Tab = "preview" | "edit" | "comments";

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  field: "title" | "content" | "notes";
}

export function SlideEditor({ slide, project, onPrev, onNext, hasPrev, hasNext, slideIndex, totalSlides, onDuplicated }: Props) {
  const upsertSlide = useMutation(api.slides.upsert);
  const removeSlide = useMutation(api.slides.remove);
  const duplicateSlide = useMutation(api.slides.duplicate);
  const comments = useQuery(api.comments.list, { slideId: slide._id }) ?? [];

  const [title, setTitle] = useState(slide.title);
  const [content, setContent] = useState(slide.content);
  const [notes, setNotes] = useState(slide.notes ?? "");
  const [type, setType] = useState(slide.type);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [tab, setTab] = useState<Tab>("preview");
  const [editField, setEditField] = useState<"title" | "content" | "notes" | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, field: "content" });
  const [useCollaborative, setUseCollaborative] = useState(true);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirty = useRef(false);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitle(slide.title);
    setContent(slide.content);
    setNotes(slide.notes ?? "");
    setType(slide.type);
    setAutoSaveStatus("saved");
    isDirty.current = false;
    setEditField(null);
  }, [slide._id]);

  useEffect(() => {
    if (!isDirty.current) return;
    setAutoSaveStatus("unsaved");
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setAutoSaveStatus("saving");
      try {
        await upsertSlide({ slideId: slide._id, projectId: slide.projectId, order: slide.order, type, title, content, notes });
        setAutoSaveStatus("saved");
      } catch {
        setAutoSaveStatus("unsaved");
      }
    }, 1500);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [title, content, notes, type]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(m => ({ ...m, visible: false }));
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function markDirty() { isDirty.current = true; }

  async function save() {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    setSaving(true);
    setAutoSaveStatus("saving");
    try {
      await upsertSlide({ slideId: slide._id, projectId: slide.projectId, order: slide.order, type, title, content, notes });
      setAutoSaveStatus("saved");
      isDirty.current = false;
      toast.success("Sauvegardé");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer cette diapositive ?")) return;
    await removeSlide({ slideId: slide._id });
    toast.success("Diapositive supprimée");
  }

  async function handleDuplicate() {
    try {
      await duplicateSlide({ slideId: slide._id });
      toast.success("Diapositive dupliquée");
      if (onDuplicated) onDuplicated(slideIndex + 1);
    } catch {
      toast.error("Erreur lors de la duplication");
    }
  }

  function handleContextMenu(e: React.MouseEvent, field: "title" | "content" | "notes") {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, field });
  }

  function openEdit(field: "title" | "content" | "notes") {
    setEditField(field);
    setTab("edit");
    setContextMenu(m => ({ ...m, visible: false }));
  }

  const theme = project?.theme ?? { primaryColor: "#1a3a5c", accentColor: "#c9a84c", fontFamily: "Inter" };
  const openComments = comments.filter(c => !c.resolved).length;

  const saveStatusConfig = {
    saved: { color: "text-emerald-600", label: "✓ Sauvegardé", dot: "bg-emerald-400" },
    saving: { color: "text-amber-500", label: "Sauvegarde...", dot: "bg-amber-400" },
    unsaved: { color: "text-gray-400", label: "Non sauvegardé", dot: "bg-gray-300" },
  };
  const saveStatus = saveStatusConfig[autoSaveStatus];

  const tabs: Array<{ id: Tab; label: string; icon: string; badge?: number }> = [
    { id: "preview", label: "Aperçu", icon: "👁" },
    { id: "edit", label: "Éditer", icon: "✏️" },
    { id: "comments", label: "Commentaires", icon: "💬", badge: openComments },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f7f8fa]">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-white flex-shrink-0">
        {/* Left: navigation + type */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className="w-6 h-6 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all text-sm"
              title="Diapositive précédente (←)"
            >←</button>
            <span className="text-xs font-bold text-gray-600 tabular-nums px-1.5 min-w-[40px] text-center">
              {slideIndex + 1}/{totalSlides}
            </span>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="w-6 h-6 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all text-sm"
              title="Diapositive suivante (→)"
            >→</button>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <select
            value={type}
            onChange={e => { setType(e.target.value); markDirty(); }}
            className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:border-[#1a3a5c] bg-white text-gray-700 transition-colors cursor-pointer"
          >
            {SLIDE_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
          </select>
        </div>

        {/* Right: save status + actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${saveStatus.dot} ${autoSaveStatus === "saving" ? "animate-pulse" : ""}`} />
            <span className={`text-[10px] font-medium ${saveStatus.color}`}>{saveStatus.label}</span>
          </div>
          <div className="w-px h-4 bg-gray-200 hidden sm:block" />
          <button
            onClick={handleDuplicate}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Dupliquer la diapositive"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
            style={{ background: theme.primaryColor }}
          >
            {saving ? "..." : "Sauvegarder"}
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
            title="Supprimer la diapositive"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex border-b border-gray-100 bg-white flex-shrink-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold transition-all border-b-2 relative ${
              tab === t.id
                ? "border-[#1a3a5c] text-[#1a3a5c] bg-[#1a3a5c]/3"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
            {t.badge !== undefined && t.badge > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-white text-[9px] font-bold flex items-center justify-center">
                {t.badge}
              </span>
            )}
          </button>
        ))}

        {/* Collaborative toggle (edit tab only) */}
        {tab === "edit" && (
          <div className="ml-auto flex items-center px-3">
            <button
              onClick={() => setUseCollaborative(c => !c)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border ${
                useCollaborative
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-gray-50 text-gray-500 border-gray-200"
              }`}
              title={useCollaborative ? "Mode collaboratif actif" : "Mode classique actif"}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${useCollaborative ? "bg-emerald-500 animate-pulse-dot" : "bg-gray-400"}`} />
              {useCollaborative ? "Collaboratif" : "Classique"}
            </button>
          </div>
        )}

        {/* Preview hint */}
        {tab === "preview" && (
          <div className="ml-auto flex items-center px-4">
            <span className="text-[10px] text-gray-400">Clic sur un bloc pour éditer · Clic droit pour options</span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-hidden flex relative">

        {/* PREVIEW TAB */}
        {tab === "preview" && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-5 bg-[#f0f2f5]">
            {/* Interactive slide */}
            <div className="relative w-full" style={{ maxWidth: "800px" }}>
              {/* Title overlay */}
              <div
                className="absolute z-10 cursor-pointer group"
                style={{ top: "10%", left: "5%", right: "5%", height: "18%" }}
                onContextMenu={e => handleContextMenu(e, "title")}
                onClick={() => openEdit("title")}
                title="Cliquer pour éditer le titre"
              >
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-[#c9a84c]/70 group-hover:bg-[#c9a84c]/5 transition-all" />
                <div className="absolute -top-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="bg-[#c9a84c] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">✏️ Titre</span>
                </div>
              </div>
              {/* Content overlay */}
              <div
                className="absolute z-10 cursor-pointer group"
                style={{ top: "30%", left: "5%", right: "5%", height: "55%" }}
                onContextMenu={e => handleContextMenu(e, "content")}
                onClick={() => openEdit("content")}
                title="Cliquer pour éditer le contenu"
              >
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-[#1a3a5c]/40 group-hover:bg-[#1a3a5c]/3 transition-all" />
                <div className="absolute -top-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="bg-[#1a3a5c] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">✏️ Contenu</span>
                </div>
              </div>
              <SlidePreview slide={{ ...slide, title, content, type }} theme={theme} />
            </div>

            {/* Notes */}
            <div className="w-full max-w-[800px] bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📝</span>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Notes du présentateur</p>
                </div>
                <button
                  onClick={() => openEdit("notes")}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: theme.primaryColor }}
                >
                  Éditer
                </button>
              </div>
              {notes ? (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{notes}</p>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  Aucune note — cliquez sur "Éditer" pour ajouter des notes de présentation
                </p>
              )}
            </div>
          </div>
        )}

        {/* EDIT TAB */}
        {tab === "edit" && (
          <div className="flex-1 overflow-y-auto bg-white">
            {useCollaborative ? (
              <div className="p-5 space-y-5">
                {/* Field selector */}
                <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl">
                  {(["title", "content", "notes"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setEditField(f)}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        editField === f
                          ? "bg-white text-[#1a3a5c] shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {f === "title" ? "📌 Titre" : f === "content" ? "📝 Contenu" : "🗒 Notes"}
                    </button>
                  ))}
                </div>

                {(editField === "title" || editField === null) && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Titre</label>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                        Collaboratif
                      </span>
                    </div>
                    <div className="rounded-xl border border-gray-200 overflow-hidden focus-within:border-[#1a3a5c] focus-within:ring-2 focus-within:ring-[#1a3a5c]/10 transition-all">
                      <CollaborativeSlideEditor slideId={slide._id} field="title" onContentChange={t => { setTitle(t); markDirty(); }} minHeight="48px" />
                    </div>
                  </div>
                )}
                {(editField === "content" || editField === null) && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contenu</label>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                        Collaboratif
                      </span>
                    </div>
                    <div className="rounded-xl border border-gray-200 overflow-hidden focus-within:border-[#1a3a5c] focus-within:ring-2 focus-within:ring-[#1a3a5c]/10 transition-all">
                      <CollaborativeSlideEditor slideId={slide._id} field="content" onContentChange={c => { setContent(c); markDirty(); }} minHeight="200px" />
                    </div>
                  </div>
                )}
                {(editField === "notes" || editField === null) && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Notes du présentateur</label>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                        Collaboratif
                      </span>
                    </div>
                    <div className="rounded-xl border border-gray-200 overflow-hidden focus-within:border-[#1a3a5c] focus-within:ring-2 focus-within:ring-[#1a3a5c]/10 transition-all">
                      <CollaborativeSlideEditor slideId={slide._id} field="notes" onContentChange={n => { setNotes(n); markDirty(); }} minHeight="80px" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Titre</label>
                  <input
                    value={title}
                    onChange={e => { setTitle(e.target.value); markDirty(); }}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-all text-gray-800"
                    placeholder="Titre de la diapositive"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Contenu</label>
                  <textarea
                    value={content}
                    onChange={e => { setContent(e.target.value); markDirty(); }}
                    rows={10}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 resize-none font-mono transition-all text-gray-800"
                    placeholder="Contenu (une ligne par point)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Notes du présentateur</label>
                  <textarea
                    value={notes}
                    onChange={e => { setNotes(e.target.value); markDirty(); }}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 resize-none transition-all text-gray-800"
                    placeholder="Notes pour le présentateur..."
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* COMMENTS TAB */}
        {tab === "comments" && (
          <div className="flex-1 overflow-hidden">
            <CommentsPanel slideId={slide._id} projectId={slide.projectId} slide={{ ...slide, title, content, type }} />
          </div>
        )}

        {/* Context menu */}
        {contextMenu.visible && (
          <div
            ref={contextMenuRef}
            className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 py-1.5 min-w-[190px] animate-fade-in"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                {contextMenu.field === "title" ? "📌 Titre" : contextMenu.field === "content" ? "📝 Contenu" : "🗒 Notes"}
              </p>
            </div>
            <button
              onClick={() => openEdit(contextMenu.field)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-[#1a3a5c]/5 hover:text-[#1a3a5c] transition-colors font-medium"
            >
              <span>✏️</span> Éditer ce bloc
            </button>
            <button
              onClick={() => { setTab("comments"); setContextMenu(m => ({ ...m, visible: false })); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-[#1a3a5c]/5 hover:text-[#1a3a5c] transition-colors"
            >
              <span>💬</span> Ajouter un commentaire
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  contextMenu.field === "title" ? title : contextMenu.field === "content" ? content : notes
                );
                toast.success("Copié !");
                setContextMenu(m => ({ ...m, visible: false }));
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>📋</span> Copier le texte
            </button>
            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={() => { handleDuplicate(); setContextMenu(m => ({ ...m, visible: false })); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Dupliquer la diapositive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
