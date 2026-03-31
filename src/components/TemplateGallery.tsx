import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useRef } from "react";
import { toast } from "sonner";

const BUILTIN_TEMPLATES = [
  {
    id: "cession",
    name: "Mémorandum de Cession",
    description: "Présentation complète pour la cession d'une PME/ETI",
    category: "Cession",
    emoji: "🏢",
    slides: [
      { type: "cover", title: "Mémorandum d'Information Confidentiel", content: "Présentation de la société cible\nOpération de cession\nConfidentiel" },
      { type: "executive_summary", title: "Résumé Exécutif", content: "Points clés de l'opération\nRationale stratégique\nPrincipaux atouts" },
      { type: "thesis", title: "Thèse d'Investissement", content: "Positionnement stratégique\nAvantages concurrentiels\nOpportunités de croissance" },
      { type: "market", title: "Analyse de Marché", content: "Taille et dynamiques du marché\nTendances sectorielles\nPart de marché" },
      { type: "financials", title: "Performances Financières", content: "Chiffre d'affaires et EBITDA\nÉvolution sur 3 ans\nProjections" },
      { type: "team", title: "Équipe Dirigeante", content: "Présentation du management\nExpériences clés\nOrganisation" },
      { type: "timeline", title: "Calendrier du Processus", content: "Étapes du processus de cession\nDates clés\nProchaines étapes" },
    ],
  },
  {
    id: "lbo",
    name: "Dossier LBO",
    description: "Structure pour une opération de LBO/MBO",
    category: "LBO",
    emoji: "💼",
    slides: [
      { type: "cover", title: "Opportunité LBO", content: "Présentation de l'opération\nConfidentiel" },
      { type: "executive_summary", title: "Résumé Exécutif", content: "Thèse d'investissement\nStructure de l'opération\nRetour attendu" },
      { type: "thesis", title: "Thèse d'Investissement", content: "Drivers de valeur\nLevier opérationnel\nPlan de création de valeur" },
      { type: "financials", title: "Modèle Financier", content: "Structure du capital\nPlan de remboursement\nProjections financières" },
      { type: "market", title: "Secteur & Positionnement", content: "Analyse sectorielle\nPosition concurrentielle\nBarrières à l'entrée" },
      { type: "team", title: "Management & Gouvernance", content: "Équipe de direction\nPlan d'intéressement\nGouvernance post-acquisition" },
      { type: "appendix", title: "Annexes", content: "États financiers détaillés\nAnalyse de sensibilité\nDocumentation juridique" },
    ],
  },
  {
    id: "levee",
    name: "Levée de Fonds",
    description: "Pitch deck pour une levée de fonds croissance",
    category: "Levée de fonds",
    emoji: "🚀",
    slides: [
      { type: "cover", title: "Levée de Fonds Série A", content: "Présentation de l'opportunité\nConfidentiel" },
      { type: "executive_summary", title: "Résumé Exécutif", content: "Vision et mission\nOpportunité de marché\nBesoins de financement" },
      { type: "market", title: "Opportunité de Marché", content: "Taille du marché adressable\nCroissance du secteur\nTiming" },
      { type: "thesis", title: "Modèle d'Affaires", content: "Proposition de valeur\nSources de revenus\nÉconomie unitaire" },
      { type: "competition", title: "Paysage Concurrentiel", content: "Analyse des concurrents\nAvantages différenciants\nPositionnement" },
      { type: "financials", title: "Financiers & Utilisation des Fonds", content: "Historique financier\nProjections\nUtilisation des fonds levés" },
      { type: "team", title: "Équipe Fondatrice", content: "Profils des fondateurs\nAdvisors\nRecrutements clés" },
    ],
  },
  {
    id: "acquisition",
    name: "Dossier Acquisition",
    description: "Présentation pour une acquisition stratégique",
    category: "Acquisition",
    emoji: "🎯",
    slides: [
      { type: "cover", title: "Opportunité d'Acquisition", content: "Présentation stratégique\nConfidentiel" },
      { type: "executive_summary", title: "Résumé Exécutif", content: "Rationale stratégique\nSynergies attendues\nStructure proposée" },
      { type: "thesis", title: "Rationale Stratégique", content: "Complémentarité stratégique\nSynergies opérationnelles\nAccélération de la croissance" },
      { type: "market", title: "Analyse Sectorielle", content: "Dynamiques du marché\nConsolidation sectorielle\nOpportunités" },
      { type: "financials", title: "Analyse Financière", content: "Valorisation\nImpact sur les résultats\nFinancement de l'acquisition" },
      { type: "timeline", title: "Plan d'Intégration", content: "Étapes d'intégration\nSynergies et calendrier\nGouvernance" },
    ],
  },
];

interface Props {
  onClose: () => void;
  onSelect: (templateId: Id<"templates"> | null, builtinSlides?: Array<{ type: string; title: string; content: string }>) => void;
}

export function TemplateGallery({ onClose, onSelect }: Props) {
  const customTemplates = useQuery(api.templates.list) ?? [];
  const removeTemplate = useMutation(api.templates.remove);
  const [selected, setSelected] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSelectBuiltin = (t: typeof BUILTIN_TEMPLATES[0]) => {
    onSelect(null, t.slides);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#1a3a5c]">Galerie de Modèles</h2>
            <p className="text-sm text-gray-500 mt-0.5">Choisissez un modèle pour démarrer rapidement</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Modèles Intégrés</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {BUILTIN_TEMPLATES.map(t => (
              <div
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${selected === t.id ? "border-[#1a3a5c] bg-[#1a3a5c]/5" : "border-gray-100 hover:border-gray-200"}`}
              >
                <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-[#1a3a5c] to-[#2d5a8e] flex items-center justify-center mb-3">
                  <span className="text-3xl">{t.emoji}</span>
                </div>
                <h4 className="font-semibold text-[#1a3a5c] text-sm mb-1">{t.name}</h4>
                <p className="text-xs text-gray-500">{t.description}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] text-xs">{t.category}</span>
              </div>
            ))}
          </div>

          {customTemplates.filter(t => t.isCustom).length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Mes Modèles</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {customTemplates.filter(t => t.isCustom).map(t => (
                  <div key={t._id} className="rounded-xl border-2 border-gray-100 p-4 hover:border-gray-200 transition-all group">
                    <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mb-3">
                      <span className="text-2xl">📄</span>
                    </div>
                    <h4 className="font-semibold text-[#1a3a5c] text-sm mb-1">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.description}</p>
                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onSelect(t._id)} className="text-xs text-[#1a3a5c] hover:underline">Utiliser</button>
                      <button onClick={() => removeTemplate({ templateId: t._id })} className="text-xs text-red-400 hover:underline">Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#1a3a5c]/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⬆️</span>
            </div>
            <h4 className="font-semibold text-gray-700 mb-1">Importer un modèle</h4>
            <p className="text-sm text-gray-400 mb-4">Glissez-déposez ou cliquez pour importer un fichier</p>
            <input ref={fileRef} type="file" accept=".pdf,.pptx,.ppt" className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Parcourir les fichiers
            </button>
            <p className="text-xs text-gray-400 mt-2">PDF, PPTX acceptés</p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Annuler</button>
          <button
            onClick={() => {
              const t = BUILTIN_TEMPLATES.find(t => t.id === selected);
              if (t) handleSelectBuiltin(t);
            }}
            disabled={!selected}
            className="px-6 py-2 rounded-lg bg-[#1a3a5c] text-white text-sm font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-50"
          >
            Utiliser ce modèle
          </button>
        </div>
      </div>
    </div>
  );
}
