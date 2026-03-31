import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { TemplateGallery } from "./TemplateGallery";
import { SignOutButton } from "../SignOutButton";
import { PitchForgeLogoFull } from "./Logo";
import { NewProjectWizard } from "./NewProjectWizard";

interface Props {
  onOpenProject: (id: Id<"projects">) => void;
}

const DEAL_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  "Cession":        { bg: "#dbeafe", text: "#1d4ed8" },
  "Acquisition":    { bg: "#ede9fe", text: "#6d28d9" },
  "LBO":            { bg: "#fef3c7", text: "#b45309" },
  "Levée de fonds": { bg: "#d1fae5", text: "#065f46" },
  "Fusion":         { bg: "#ffe4e6", text: "#be123c" },
  "Recapitalisation":{ bg: "#f3f4f6", text: "#374151" },
  "IPO":            { bg: "#e0f2fe", text: "#0369a1" },
  "Carve-out":      { bg: "#ffedd5", text: "#c2410c" },
};

const DEAL_TYPE_ICONS: Record<string, string> = {
  "Cession": "🏢", "Acquisition": "🎯", "LBO": "💼",
  "Levée de fonds": "🚀", "Fusion": "🤝", "Recapitalisation": "🔄",
  "IPO": "📈", "Carve-out": "✂️",
};

const dealTypes = ["Cession", "Acquisition", "LBO", "Levée de fonds", "Fusion", "Recapitalisation", "IPO", "Carve-out"];

export function Dashboard({ onOpenProject }: Props) {
  const projects = useQuery(api.projects.list) ?? [];
  const user = useQuery(api.auth.loggedInUser);
  const removeProject = useMutation(api.projects.remove);
  const [showWizard, setShowWizard] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDeal, setFilterDeal] = useState("Tous");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filteredProjects = projects.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.targetCompany ?? "").toLowerCase().includes(search.toLowerCase());
    const matchDeal = filterDeal === "Tous" || p.dealType === filterDeal;
    return matchSearch && matchDeal;
  });

  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "Utilisateur";

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <PitchForgeLogoFull height={36} />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1a3a5c] flex items-center justify-center">
              <span className="text-white text-xs font-bold">{displayName.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-sm text-gray-700 font-medium hidden sm:block">{displayName}</span>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Hero */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[#1a3a5c]">Mes Projets M&A</h1>
            <p className="text-gray-500 text-sm mt-1">
              {projects.length} projet{projects.length !== 1 ? "s" : ""} · Gérez vos pitch decks professionnels
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowTemplates(true)}
              className="px-4 py-2.5 rounded-xl border-2 border-[#1a3a5c] text-[#1a3a5c] text-sm font-semibold hover:bg-[#1a3a5c]/5 transition-colors flex items-center gap-2"
            >
              <span>📋</span> Modèles
            </button>
            <button
              onClick={() => setShowWizard(true)}
              className="px-4 py-2.5 rounded-xl bg-[#1a3a5c] text-white text-sm font-semibold hover:bg-[#152e4a] transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>+</span> Nouveau projet
            </button>
          </div>
        </div>

        {/* Stats */}
        {projects.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total projets", value: projects.length, icon: "📁", color: "#1a3a5c" },
              { label: "Cessions", value: projects.filter(p => p.dealType === "Cession").length, icon: "🏢", color: "#1d4ed8" },
              { label: "LBO / Acquisitions", value: projects.filter(p => p.dealType === "LBO" || p.dealType === "Acquisition").length, icon: "💼", color: "#b45309" },
              { label: "Levées de fonds", value: projects.filter(p => p.dealType === "Levée de fonds").length, icon: "🚀", color: "#065f46" },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${stat.color}12` }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs text-gray-500 leading-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        {projects.length > 0 && (
          <div className="flex gap-3 mb-6 flex-wrap items-center">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un projet..."
                className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-colors w-56 bg-white"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {["Tous", ...dealTypes].map(d => (
                <button
                  key={d}
                  onClick={() => setFilterDeal(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filterDeal === d
                      ? "bg-[#1a3a5c] text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[#1a3a5c]/40 hover:text-[#1a3a5c]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-[#1a3a5c] text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                title="Vue grille"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/></svg>
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-[#1a3a5c] text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                title="Vue liste"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredProjects.length === 0 && projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-2xl bg-[#1a3a5c]/8 flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-[#1a3a5c] mb-2">Bienvenue sur PitchForge</h3>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
              Créez votre premier pitch deck M&A professionnel en quelques minutes grâce à l'IA
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => setShowTemplates(true)}
                className="px-6 py-3 rounded-xl border-2 border-[#1a3a5c] text-[#1a3a5c] text-sm font-semibold hover:bg-[#1a3a5c]/5 transition-colors"
              >
                📋 Partir d'un modèle
              </button>
              <button
                onClick={() => setShowWizard(true)}
                className="px-6 py-3 rounded-xl bg-[#1a3a5c] text-white text-sm font-semibold hover:bg-[#152e4a] transition-colors shadow-sm"
              >
                ✨ Créer avec l'IA
              </button>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">Aucun projet ne correspond à votre recherche</p>
            <button onClick={() => { setSearch(""); setFilterDeal("Tous"); }} className="mt-2 text-xs text-[#1a3a5c] hover:underline">
              Réinitialiser les filtres
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map(p => {
              const colors = DEAL_TYPE_COLORS[p.dealType ?? ""] ?? { bg: "#f3f4f6", text: "#374151" };
              return (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group hover:border-[#1a3a5c]/20"
                  onClick={() => onOpenProject(p._id)}
                >
                  {/* Color band */}
                  <div className="h-1.5" style={{ background: p.theme?.primaryColor ?? "#1a3a5c" }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `${p.theme?.primaryColor ?? "#1a3a5c"}12` }}
                      >
                        {DEAL_TYPE_ICONS[p.dealType ?? ""] ?? "📊"}
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (confirm("Supprimer ce projet ? Cette action est irréversible.")) {
                            removeProject({ projectId: p._id });
                            toast.success("Projet supprimé");
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all text-sm p-1.5 rounded-lg hover:bg-red-50"
                        title="Supprimer le projet"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="font-bold text-[#1a3a5c] mb-1 leading-tight text-base">{p.name}</h3>
                    {p.targetCompany && (
                      <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <span>🏢</span> {p.targetCompany}
                      </p>
                    )}
                    {p.targetSector && (
                      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <span>🏭</span> {p.targetSector}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      {p.dealType && (
                        <span
                          className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ background: colors.bg, color: colors.text }}
                        >
                          {p.dealType}
                        </span>
                      )}
                      <p className="text-xs text-gray-400 ml-auto">
                        {new Date(p.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {filteredProjects.map((p, i) => {
              const colors = DEAL_TYPE_COLORS[p.dealType ?? ""] ?? { bg: "#f3f4f6", text: "#374151" };
              return (
                <div
                  key={p._id}
                  className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors group ${i > 0 ? "border-t border-gray-50" : ""}`}
                  onClick={() => onOpenProject(p._id)}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: `${p.theme?.primaryColor ?? "#1a3a5c"}12` }}
                  >
                    {DEAL_TYPE_ICONS[p.dealType ?? ""] ?? "📊"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1a3a5c] text-sm truncate">{p.name}</p>
                    <p className="text-xs text-gray-400 truncate">{p.targetCompany ?? p.targetSector ?? "—"}</p>
                  </div>
                  {p.dealType && (
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                      style={{ background: colors.bg, color: colors.text }}
                    >
                      {p.dealType}
                    </span>
                  )}
                  <p className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                    {new Date(p.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </p>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (confirm("Supprimer ce projet ?")) {
                        removeProject({ projectId: p._id });
                        toast.success("Projet supprimé");
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1.5 rounded-lg hover:bg-red-50 flex-shrink-0"
                    title="Supprimer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {showWizard && (
        <NewProjectWizard
          onCreated={id => { setShowWizard(false); onOpenProject(id); }}
          onClose={() => setShowWizard(false)}
        />
      )}

      {showTemplates && (
        <TemplateGallery
          onClose={() => setShowTemplates(false)}
          onSelect={async (_templateId, _builtinSlides) => {
            setShowWizard(true);
            setShowTemplates(false);
          }}
        />
      )}
    </div>
  );
}
