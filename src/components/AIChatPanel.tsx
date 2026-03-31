import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface Props {
  projectId: Id<"projects">;
  project: Doc<"projects"> | null | undefined;
  slides: Doc<"slides">[];
}

const QUICK_PROMPTS = [
  {
    label: "Générer le deck complet",
    icon: "✨",
    special: "generate",
    color: "#1a3a5c",
  },
  {
    label: "Améliorer le résumé exécutif",
    icon: "📋",
    prompt:
      "Améliore et enrichis le résumé exécutif avec des éléments plus percutants et différenciants. Fournis le contenu révisé en JSON slides.",
  },
  {
    label: "Renforcer la thèse d'investissement",
    icon: "💡",
    prompt:
      "Renforce la thèse d'investissement avec des arguments plus convaincants et des données de marché pertinentes. Fournis le contenu révisé en JSON slides.",
  },
  {
    label: "Projections financières",
    icon: "📊",
    prompt:
      "Propose des diapositives de projections financières détaillées avec CA, EBITDA, croissance et multiples de valorisation. Fournis en JSON slides.",
  },
  {
    label: "Acquéreurs potentiels",
    icon: "🎯",
    prompt:
      "Identifie et présente des acquéreurs stratégiques et financiers potentiels pour cette opération. Fournis en JSON slides.",
  },
  {
    label: "Analyse de marché TAM/SAM/SOM",
    icon: "🌍",
    prompt:
      "Crée une analyse de marché approfondie avec TAM/SAM/SOM, tendances et dynamiques concurrentielles. Fournis en JSON slides.",
  },
  {
    label: "Équipe dirigeante",
    icon: "👥",
    prompt:
      "Crée une diapositive équipe dirigeante professionnelle avec les profils clés. Fournis en JSON slides.",
  },
  {
    label: "Calendrier du processus",
    icon: "📅",
    prompt:
      "Propose un calendrier de processus M&A réaliste avec les étapes clés. Fournis en JSON slides.",
  },
];

// Batch enhancement quick prompts
const BATCH_PROMPTS = [
  {
    label: "Polir toutes les slides",
    icon: "✨",
    intent: "polish" as const,
    description: "Rendre le contenu plus professionnel",
  },
  {
    label: "Raccourcir toutes les slides",
    icon: "📝",
    intent: "shorten" as const,
    description: "Réduire à l'essentiel",
  },
  {
    label: "Développer toutes les slides",
    icon: "📖",
    intent: "expand" as const,
    description: "Enrichir avec plus de détails",
  },
];

function MessageContent({
  content,
  onApplySlides,
}: {
  content: string;
  onApplySlides: (content: string) => void;
}) {
  const hasSlides = content.includes("```slides");
  const displayContent = content.replace(/```slides[\s\S]*?```/g, "").trim();

  return (
    <div>
      {displayContent && (
        <p className="whitespace-pre-wrap text-xs leading-relaxed">
          {displayContent}
        </p>
      )}
      {hasSlides && (
        <button
          onClick={() => onApplySlides(content)}
          className="mt-2.5 w-full px-3 py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          style={{ background: "#1a3a5c" }}
        >
          <span>✅</span>
          <span>Appliquer les diapositives générées</span>
        </button>
      )}
    </div>
  );
}

export function AIChatPanel({ projectId, project, slides }: Props) {
  const messages = useQuery(api.chat.list, { projectId }) ?? [];
  const sendMessage = useMutation(api.chat.send);
  const generateDeck = useMutation(api.chat.generateDeck);
  const enhanceAllSlides = useMutation(api.chat.enhanceAllSlides);
  const clearHistory = useMutation(api.chat.clearHistory);
  const bulkInsert = useMutation(api.slides.bulkInsert);
  const aiSettings = useQuery(api.aiSettings.get);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [showBatchPrompts, setShowBatchPrompts] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (messages.length > 0) setShowQuickPrompts(false);
  }, [messages.length]);

  const projectContext = project
    ? `Projet: "${project.name}" | Cible: ${project.targetCompany ?? "N/A"} | Type d'opération: ${project.dealType ?? "N/A"} | Secteur: ${project.targetSector ?? "N/A"} | Acquéreurs potentiels: ${(project.potentialBuyers ?? []).join(", ") || "N/A"} | Individus clés: ${(project.keyIndividuals ?? []).join(", ") || "N/A"}`
    : "";
  const slidesContext =
    slides.length > 0
      ? slides
          .map(
            (s, i) =>
              `${i + 1}. [${s.type}] "${s.title}": ${s.content.substring(0, 150)}`,
          )
          .join("\n")
      : "Aucune diapositive";

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || sending) return;
    setSending(true);
    setInput("");
    setShowQuickPrompts(false);
    try {
      await sendMessage({
        projectId,
        content: msg,
        projectContext,
        slidesContext,
      });
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  }

  async function handleGenerateDeck() {
    if (!project) return;
    setSending(true);
    setShowQuickPrompts(false);
    try {
      await generateDeck({
        projectId,
        projectContext,
        brief: {
          clientName: project.targetCompany ?? project.name,
          clientSector: project.targetSector ?? "",
          dealType: project.dealType ?? "M&A",
        },
      });
      toast.success("Génération du deck en cours...");
    } catch {
      toast.error("Erreur lors de la génération");
    } finally {
      setSending(false);
    }
  }

  async function handleBatchEnhance(intent: "polish" | "shorten" | "expand") {
    if (slides.length === 0) {
      toast.error("Aucune slide à améliorer");
      return;
    }
    setSending(true);
    setShowQuickPrompts(false);
    setShowBatchPrompts(false);
    try {
      await enhanceAllSlides({ projectId, intent });
      toast.success(`Amélioration de ${slides.length} slides en cours...`);
    } catch {
      toast.error("Erreur lors de l'amélioration");
    } finally {
      setSending(false);
    }
  }

  async function applySlides(content: string) {
    const match = content.match(/```slides\n([\s\S]*?)\n```/);
    if (!match) {
      toast.error("Format de diapositives invalide");
      return;
    }
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) {
        await bulkInsert({
          projectId,
          slides: parsed.map(
            (
              s: { type: string; title: string; content: string },
              i: number,
            ) => ({
              ...s,
              order: slides.length + i,
            }),
          ),
        });
        toast.success(`${parsed.length} diapositive(s) ajoutée(s) ✓`);
      }
    } catch {
      toast.error(
        "Impossible d'appliquer les diapositives — format JSON invalide",
      );
    }
  }

  const providerLabel = aiSettings
    ? aiSettings.provider === "convex_builtin"
      ? `PitchForge AI · ${aiSettings.model}`
      : `${aiSettings.provider} · ${aiSettings.model}`
    : "PitchForge AI";

  const isWaiting =
    messages.length > 0 && messages[messages.length - 1]?.role === "user";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#1a3a5c]/5 to-transparent flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1a3a5c] flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-xs">✨</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#1a3a5c] leading-tight">
              Assistant IA M&A
            </p>
            <p className="text-[10px] text-gray-400 leading-tight truncate max-w-[140px]">
              {providerLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={() => setShowBatchPrompts((s) => !s)}
              className={`text-[10px] px-2 py-1 rounded-lg font-semibold transition-all ${
                showBatchPrompts
                  ? "bg-emerald-500 text-white"
                  : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
              title="Appliquer à toutes les slides"
            >
              📋 Batch
            </button>
          )}
          {messages.length > 0 && (
            <button
              onClick={() => setShowQuickPrompts((s) => !s)}
              className={`text-[10px] px-2 py-1 rounded-lg font-semibold transition-all ${
                showQuickPrompts
                  ? "bg-[#1a3a5c] text-white"
                  : "text-gray-500 hover:text-[#1a3a5c] hover:bg-[#1a3a5c]/8"
              }`}
              title="Actions rapides"
            >
              ⚡ Rapide
            </button>
          )}
          {messages.length > 0 && (
            <button
              onClick={() => {
                clearHistory({ projectId });
                setShowQuickPrompts(true);
                setShowBatchPrompts(false);
              }}
              className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Effacer l'historique"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Batch prompts - Apply to all slides */}
      {showBatchPrompts && (
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-transparent flex-shrink-0">
          <div className="px-3 pt-2.5 pb-1">
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-2">
              📋 Amélioration par lot — {slides.length} slides
            </p>
          </div>
          <div className="px-2 pb-2 space-y-1">
            {BATCH_PROMPTS.map((p) => (
              <button
                key={p.intent}
                onClick={() => handleBatchEnhance(p.intent)}
                disabled={sending || slides.length === 0}
                className="w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-3 disabled:opacity-50 hover:bg-emerald-100 group border border-emerald-200"
                style={{ background: "#f0fdf4" }}
              >
                <span className="flex-shrink-0 text-base">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-emerald-800 leading-tight">{p.label}</p>
                  <p className="text-[10px] text-emerald-600 leading-tight">{p.description}</p>
                </div>
                <svg
                  className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick prompts */}
      {showQuickPrompts && (
        <div className="border-b border-gray-100 bg-white flex-shrink-0">
          <div className="px-3 pt-2.5 pb-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
              ⚡ Actions rapides
            </p>
          </div>
          <div className="px-2 pb-2 space-y-1 max-h-[220px] overflow-y-auto">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p.label}
                onClick={() =>
                  p.special === "generate"
                    ? handleGenerateDeck()
                    : handleSend(p.prompt)
                }
                disabled={sending}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 disabled:opacity-50 hover:bg-[#1a3a5c] hover:text-white group border border-transparent hover:border-[#1a3a5c]/20"
                style={{ background: "#1a3a5c0d", color: "#1a3a5c" }}
              >
                <span className="flex-shrink-0 text-sm">{p.icon}</span>
                <span className="leading-tight">{p.label}</span>
                <svg
                  className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && !showQuickPrompts && (
          <div className="text-center py-10 text-gray-400">
            <div className="w-10 h-10 rounded-xl bg-[#1a3a5c]/8 flex items-center justify-center mx-auto mb-3">
              <span className="text-lg">✨</span>
            </div>
            <p className="text-xs font-medium">
              Posez une question à l'assistant IA
            </p>
            <p className="text-[10px] mt-1 text-gray-300">
              Spécialisé en M&A, fusions-acquisitions et pitch decks
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-[#1a3a5c] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <span className="text-white text-[9px]">✨</span>
              </div>
            )}
            <div
              className={`max-w-[88%] rounded-2xl px-3 py-2.5 ${
                msg.role === "user"
                  ? "bg-[#1a3a5c] text-white rounded-tr-sm shadow-sm"
                  : "bg-white text-gray-800 rounded-tl-sm border border-gray-100 shadow-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                <MessageContent
                  content={msg.content}
                  onApplySlides={applySlides}
                />
              ) : (
                <p className="text-xs leading-relaxed">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isWaiting && (
          <div className="flex gap-2 justify-start animate-fade-in">
            <div className="w-6 h-6 rounded-full bg-[#1a3a5c] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
              <span className="text-white text-[9px]">✨</span>
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100 shadow-sm">
              <div className="flex gap-1 items-center">
                {[0, 150, 300].map((d) => (
                  <div
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-[#1a3a5c]/40 animate-bounce"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 bg-white flex-shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Demandez à l'IA M&A... (↵ envoyer, ⇧↵ nouvelle ligne)"
            rows={2}
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 resize-none transition-all text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="w-9 h-9 rounded-xl text-white text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ background: "#1a3a5c" }}
          >
            {sending ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
