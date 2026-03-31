import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { AISettingsPanel } from "./AISettingsPanel";
import { ColorPicker } from "./ColorPicker";

interface Props {
  projectId: Id<"projects">;
  project: Doc<"projects"> | null | undefined;
}

const DEAL_TYPES = ["Cession", "Acquisition", "LBO", "Levée de fonds", "Fusion", "Recapitalisation", "IPO", "Carve-out"];
const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Georgia", label: "Georgia" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
];
const COLOR_PRESETS = [
  { name: "Marine & Or", primary: "#1a3a5c", accent: "#c9a84c" },
  { name: "Bordeaux & Argent", primary: "#6b1a2a", accent: "#9ca3af" },
  { name: "Vert & Bronze", primary: "#1a4a2e", accent: "#b87333" },
  { name: "Ardoise & Cyan", primary: "#1e3a5f", accent: "#06b6d4" },
  { name: "Noir & Or", primary: "#111827", accent: "#f59e0b" },
  { name: "Indigo & Rose", primary: "#3730a3", accent: "#db2777" },
  { name: "Teal & Ambre", primary: "#0f766e", accent: "#d97706" },
  { name: "Prune & Vert", primary: "#4c1d95", accent: "#16a34a" },
];

type SettingsTab = "project" | "theme" | "ai";

export function ProjectSettings({ projectId, project }: Props) {
  const updateProject = useMutation(api.projects.update);
  const [activeTab, setActiveTab] = useState<SettingsTab>("project");

  const [name, setName] = useState(project?.name ?? "");
  const [targetCompany, setTargetCompany] = useState(project?.targetCompany ?? "");
  const [targetSector, setTargetSector] = useState(project?.targetSector ?? "");
  const [dealType, setDealType] = useState(project?.dealType ?? "Cession");
  const [potentialBuyers, setPotentialBuyers] = useState((project?.potentialBuyers ?? []).join("\n"));
  const [keyIndividuals, setKeyIndividuals] = useState((project?.keyIndividuals ?? []).join("\n"));
  const [primaryColor, setPrimaryColor] = useState(project?.theme?.primaryColor ?? "#1a3a5c");
  const [accentColor, setAccentColor] = useState(project?.theme?.accentColor ?? "#c9a84c");
  const [fontFamily, setFontFamily] = useState(project?.theme?.fontFamily ?? "Inter");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setTargetCompany(project.targetCompany ?? "");
      setTargetSector(project.targetSector ?? "");
      setDealType(project.dealType ?? "Cession");
      setPotentialBuyers((project.potentialBuyers ?? []).join("\n"));
      setKeyIndividuals((project.keyIndividuals ?? []).join("\n"));
      setPrimaryColor(project.theme?.primaryColor ?? "#1a3a5c");
      setAccentColor(project.theme?.accentColor ?? "#c9a84c");
      setFontFamily(project.theme?.fontFamily ?? "Inter");
    }
  }, [project?._id]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProject({
        projectId,
        name,
        targetCompany: targetCompany || undefined,
        targetSector: targetSector || undefined,
        dealType: dealType || undefined,
        potentialBuyers: potentialBuyers.split("\n").map(s => s.trim()).filter(Boolean),
        keyIndividuals: keyIndividuals.split("\n").map(s => s.trim()).filter(Boolean),
        theme: { primaryColor, accentColor, fontFamily },
      });
      toast.success("Paramètres sauvegardés");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  const settingsTabs: Array<{ id: SettingsTab; label: string; icon: string }> = [
    { id: "project", label: "Projet", icon: "📁" },
    { id: "theme", label: "Thème", icon: "🎨" },
    { id: "ai", label: "IA", icon: "🤖" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-100">
        {settingsTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${activeTab === t.id ? "text-[#1a3a5c] border-b-2 border-[#1a3a5c] bg-[#1a3a5c]/3" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "ai" ? (
        <AISettingsPanel />
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {activeTab === "project" && (
              <>
                <section>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Informations du projet</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nom du projet <span className="text-red-400">*</span></label>
                      <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Société cible</label>
                      <input value={targetCompany} onChange={e => setTargetCompany(e.target.value)} placeholder="ex: Groupe Dupont SAS" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Secteur d'activité</label>
                      <input value={targetSector} onChange={e => setTargetSector(e.target.value)} placeholder="ex: Industrie, Tech, Santé..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Type d'opération</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {DEAL_TYPES.map(d => (
                          <button key={d} onClick={() => setDealType(d)}
                            className={`px-2 py-1.5 rounded-lg border text-xs font-semibold transition-all text-left ${dealType === d ? "border-[#1a3a5c] bg-[#1a3a5c] text-white" : "border-gray-200 text-gray-700 hover:border-[#1a3a5c]/40 hover:text-[#1a3a5c]"}`}>
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Parties prenantes</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Acquéreurs potentiels <span className="text-gray-400">(un par ligne)</span></label>
                      <textarea value={potentialBuyers} onChange={e => setPotentialBuyers(e.target.value)} rows={3} placeholder={"Société A\nFonds B\nGroupe C"} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] resize-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Individus clés <span className="text-gray-400">(un par ligne)</span></label>
                      <textarea value={keyIndividuals} onChange={e => setKeyIndividuals(e.target.value)} rows={3} placeholder={"Jean Dupont - PDG\nMarie Martin - DAF"} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] resize-none transition-colors" />
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab === "theme" && (
              <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Thème visuel</h3>
                <div className="space-y-4">
                  {/* Live mini preview */}
                  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ aspectRatio: "16/9" }}>
                    <div className="h-full flex flex-col" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}>
                      <div className="flex-1 flex flex-col items-center justify-center text-white text-center px-4">
                        <div className="w-6 h-0.5 rounded mb-2" style={{ background: accentColor }} />
                        <p className="font-bold text-xs" style={{ fontFamily }}>{project?.name ?? "Aperçu"}</p>
                        <p className="text-[10px] opacity-60 mt-0.5" style={{ fontFamily }}>{project?.targetCompany ?? "Société cible"}</p>
                        <div className="w-6 h-0.5 rounded mt-2" style={{ background: accentColor }} />
                      </div>
                      <div className="h-0.5" style={{ background: accentColor }} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Palettes prédéfinies</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {COLOR_PRESETS.map(p => (
                        <button key={p.name} onClick={() => { setPrimaryColor(p.primary); setAccentColor(p.accent); }}
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs transition-all ${primaryColor === p.primary ? "border-[#1a3a5c] bg-[#1a3a5c]/5 shadow-sm" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}>
                          <div className="flex gap-0.5">
                            <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ background: p.primary }} />
                            <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ background: p.accent }} />
                          </div>
                          <span className="text-gray-600 font-medium text-[10px] truncate">{p.name}</span>
                          {primaryColor === p.primary && <span className="ml-auto text-[#1a3a5c] font-bold text-[10px]">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <ColorPicker value={primaryColor} onChange={setPrimaryColor} label="Couleur principale" />
                    <ColorPicker value={accentColor} onChange={setAccentColor} label="Couleur d'accent" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Police de caractères</label>
                    <div className="space-y-1">
                      {FONT_OPTIONS.map(f => (
                        <button key={f.value} onClick={() => setFontFamily(f.value)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-all ${fontFamily === f.value ? "border-[#1a3a5c] bg-[#1a3a5c] text-white" : "border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50"}`}>
                          <span style={{ fontFamily: f.value }}>{f.label}</span>
                          {fontFamily === f.value && <span className="font-bold">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <button onClick={handleSave} disabled={saving || !name.trim()} className="w-full px-4 py-2.5 rounded-xl bg-[#1a3a5c] text-white text-xs font-semibold hover:bg-[#1a3a5c]/90 disabled:opacity-50 transition-colors">
              {saving ? "Sauvegarde..." : "Sauvegarder les paramètres"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
