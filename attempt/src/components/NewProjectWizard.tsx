import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { ColorPicker } from "./ColorPicker";
import { PitchForgeLogo } from "./Logo";

interface Props {
  onCreated: (id: Id<"projects">) => void;
  onClose: () => void;
}

const DEAL_TYPES = [
  { id: "Cession", label: "Cession", icon: "🏢", desc: "Vente d'une société ou d'une participation" },
  { id: "Acquisition", label: "Acquisition", icon: "🎯", desc: "Rachat d'une cible stratégique" },
  { id: "LBO", label: "LBO", icon: "💼", desc: "Leveraged Buy-Out par effet de levier" },
  { id: "Levée de fonds", label: "Levée de fonds", icon: "🚀", desc: "Financement en capital (Série A, B...)" },
  { id: "Fusion", label: "Fusion", icon: "🤝", desc: "Rapprochement de deux entités" },
  { id: "Recapitalisation", label: "Recapitalisation", icon: "🔄", desc: "Restructuration du capital" },
  { id: "IPO", label: "Introduction en bourse", icon: "📈", desc: "Cotation sur un marché réglementé" },
  { id: "Carve-out", label: "Carve-out", icon: "✂️", desc: "Cession d'une filiale ou division" },
];

const SECTORS = [
  "Industrie & Manufacturing", "Technologies & SaaS", "Santé & Medtech",
  "Distribution & Retail", "Services aux entreprises", "Immobilier & Construction",
  "Énergie & Environnement", "Finance & Assurance", "Agroalimentaire",
  "Médias & Communication", "Transport & Logistique", "Tourisme & Hôtellerie",
];

const COLOR_PRESETS = [
  { name: "Marine & Or", primary: "#1a3a5c", accent: "#c9a84c" },
  { name: "Bordeaux & Argent", primary: "#6b1a2a", accent: "#9ca3af" },
  { name: "Vert Forêt & Bronze", primary: "#1a4a2e", accent: "#b87333" },
  { name: "Ardoise & Cyan", primary: "#1e3a5f", accent: "#06b6d4" },
  { name: "Noir & Or", primary: "#111827", accent: "#f59e0b" },
  { name: "Indigo & Rose", primary: "#3730a3", accent: "#db2777" },
  { name: "Teal & Ambre", primary: "#0f766e", accent: "#d97706" },
  { name: "Prune & Vert", primary: "#4c1d95", accent: "#16a34a" },
];

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter — Moderne & Lisible" },
  { value: "Georgia", label: "Georgia — Classique & Élégant" },
  { value: "Arial", label: "Arial — Neutre & Professionnel" },
  { value: "Helvetica", label: "Helvetica — Minimaliste" },
  { value: "Times New Roman", label: "Times New Roman — Traditionnel" },
];

type Step = "type" | "details" | "theme" | "confirm";

export function NewProjectWizard({ onCreated, onClose }: Props) {
  const createProject = useMutation(api.projects.create);
  const [step, setStep] = useState<Step>("type");
  const [creating, setCreating] = useState(false);

  // Form state
  const [dealType, setDealType] = useState("Cession");
  const [name, setName] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [targetSector, setTargetSector] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1a3a5c");
  const [accentColor, setAccentColor] = useState("#c9a84c");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [skipTheme, setSkipTheme] = useState(false);

  const steps: Step[] = ["type", "details", "theme", "confirm"];
  const stepIdx = steps.indexOf(step);

  async function handleCreate() {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const id = await createProject({
        name: name.trim(),
        targetCompany: targetCompany.trim() || undefined,
        dealType,
        targetSector: targetSector.trim() || undefined,
      });
      // Update theme separately via update mutation
      toast.success("Projet créé avec succès !");
      onCreated(id);
    } catch {
      toast.error("Erreur lors de la création");
    } finally {
      setCreating(false);
    }
  }

  const selectedDeal = DEAL_TYPES.find(d => d.id === dealType);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#1a3a5c] to-[#1e3a5f]">
          <div className="flex items-center gap-3">
            <PitchForgeLogo size={32} />
            <div>
              <h2 className="text-white font-bold text-base">Nouveau projet M&A</h2>
              <p className="text-white/60 text-xs">
                Étape {stepIdx + 1} sur {steps.length} — {
                  step === "type" ? "Type d'opération" :
                  step === "details" ? "Informations du projet" :
                  step === "theme" ? "Identité visuelle" :
                  "Confirmation"
                }
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-[#c9a84c] transition-all duration-500" style={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "type" && (
            <div>
              <h3 className="text-lg font-bold text-[#1a3a5c] mb-1">Type d'opération</h3>
              <p className="text-sm text-gray-500 mb-5">Sélectionnez le type de transaction pour personnaliser votre pitch deck</p>
              <div className="grid grid-cols-2 gap-3">
                {DEAL_TYPES.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDealType(d.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${dealType === d.id ? "border-[#1a3a5c] bg-[#1a3a5c]/5 shadow-sm" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}
                  >
                    <span className="text-2xl flex-shrink-0">{d.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{d.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-tight">{d.desc}</p>
                    </div>
                    {dealType === d.id && (
                      <div className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-[#1a3a5c] flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "details" && (
            <div>
              <h3 className="text-lg font-bold text-[#1a3a5c] mb-1">Informations du projet</h3>
              <p className="text-sm text-gray-500 mb-5">Ces informations seront utilisées par l'IA pour personnaliser votre deck</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nom du projet <span className="text-red-400">*</span>
                  </label>
                  <input
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={`ex: ${dealType} Groupe Dupont 2025`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Société cible <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <input
                    value={targetCompany}
                    onChange={e => setTargetCompany(e.target.value)}
                    placeholder="ex: Groupe Dupont SAS"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Secteur d'activité <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <input
                      value={targetSector}
                      onChange={e => setTargetSector(e.target.value)}
                      placeholder="ex: Industrie, Technologies, Santé..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-all"
                      list="sectors-list"
                    />
                    <datalist id="sectors-list">
                      {SECTORS.map(s => <option key={s} value={s} />)}
                    </datalist>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SECTORS.slice(0, 6).map(s => (
                      <button key={s} type="button" onClick={() => setTargetSector(s)}
                        className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${targetSector === s ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "theme" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-[#1a3a5c]">Identité visuelle</h3>
                <button onClick={() => setSkipTheme(true)} className="text-xs text-gray-400 hover:text-gray-600 underline">
                  Configurer plus tard
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-5">Choisissez les couleurs et la police de votre pitch deck</p>

              {/* Live preview */}
              <div className="mb-5 rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ aspectRatio: "16/9", background: primaryColor }}>
                <div className="h-full flex flex-col" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}>
                  <div className="flex-1 flex flex-col items-center justify-center text-white text-center px-8">
                    <div className="w-8 h-0.5 rounded mb-3" style={{ background: accentColor }} />
                    <p className="font-bold text-lg" style={{ fontFamily }}>{name || "Nom du projet"}</p>
                    <p className="text-sm opacity-70 mt-1" style={{ fontFamily }}>{targetCompany || "Société cible"}</p>
                    <div className="w-8 h-0.5 rounded mt-3" style={{ background: accentColor }} />
                  </div>
                  <div className="h-1" style={{ background: accentColor }} />
                </div>
              </div>

              {/* Presets */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Palettes prédéfinies</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map(p => (
                    <button key={p.name} onClick={() => { setPrimaryColor(p.primary); setAccentColor(p.accent); }}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${primaryColor === p.primary && accentColor === p.accent ? "border-[#1a3a5c] shadow-sm" : "border-gray-100 hover:border-gray-200"}`}>
                      <div className="flex gap-1">
                        <div className="w-5 h-5 rounded-full shadow-sm" style={{ background: p.primary }} />
                        <div className="w-5 h-5 rounded-full shadow-sm" style={{ background: p.accent }} />
                      </div>
                      <span className="text-[9px] text-gray-500 text-center leading-tight">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom colors */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <ColorPicker value={primaryColor} onChange={setPrimaryColor} label="Couleur principale" />
                <ColorPicker value={accentColor} onChange={setAccentColor} label="Couleur d'accent" />
              </div>

              {/* Font */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Police de caractères</label>
                <div className="space-y-1.5">
                  {FONT_OPTIONS.map(f => (
                    <button key={f.value} onClick={() => setFontFamily(f.value)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-left transition-all ${fontFamily === f.value ? "border-[#1a3a5c] bg-[#1a3a5c]/5" : "border-gray-100 hover:border-gray-200"}`}>
                      <span className="text-sm text-gray-700" style={{ fontFamily: f.value }}>{f.label}</span>
                      {fontFamily === f.value && <span className="text-[#1a3a5c] text-xs font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div>
              <h3 className="text-lg font-bold text-[#1a3a5c] mb-1">Récapitulatif</h3>
              <p className="text-sm text-gray-500 mb-5">Vérifiez les informations avant de créer votre projet</p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{selectedDeal?.icon}</span>
                    <div>
                      <p className="font-bold text-[#1a3a5c]">{name}</p>
                      <p className="text-xs text-gray-500">{selectedDeal?.label}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {targetCompany && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <span>🏢</span> <span>{targetCompany}</span>
                      </div>
                    )}
                    {targetSector && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <span>🏭</span> <span>{targetSector}</span>
                      </div>
                    )}
                  </div>
                </div>

                {!skipTheme && (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Thème visuel</p>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-6 h-6 rounded-full shadow-sm border border-white" style={{ background: primaryColor }} />
                        <div className="w-6 h-6 rounded-full shadow-sm border border-white" style={{ background: accentColor }} />
                      </div>
                      <span className="text-xs text-gray-600" style={{ fontFamily }}>{fontFamily}</span>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-[#1a3a5c]/5 border border-[#1a3a5c]/20">
                  <p className="text-xs text-[#1a3a5c] font-medium">
                    ✨ L'assistant IA sera prêt à générer votre deck complet dès la création du projet.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={() => {
              if (stepIdx === 0) onClose();
              else setStep(steps[stepIdx - 1]);
            }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {stepIdx === 0 ? "Annuler" : "Retour"}
          </button>

          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className={`w-2 h-2 rounded-full transition-all ${i === stepIdx ? "bg-[#1a3a5c] w-4" : i < stepIdx ? "bg-[#c9a84c]" : "bg-gray-200"}`} />
            ))}
          </div>

          {step !== "confirm" ? (
            <button
              onClick={() => {
                if (step === "details" && !name.trim()) {
                  toast.error("Le nom du projet est requis");
                  return;
                }
                if (step === "theme" && skipTheme) {
                  setStep("confirm");
                  return;
                }
                setStep(steps[stepIdx + 1]);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#1a3a5c] text-white text-sm font-semibold hover:bg-[#1a3a5c]/90 transition-colors flex items-center gap-2"
            >
              Suivant
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={creating || !name.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#c9a84c] text-white text-sm font-bold hover:bg-[#b8973b] disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              {creating ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Création...</>
              ) : (
                <>✨ Créer le projet</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
