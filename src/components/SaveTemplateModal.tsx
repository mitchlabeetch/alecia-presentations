import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface Props {
  slides: Doc<"slides">[];
  onClose: () => void;
}

export function SaveTemplateModal({ slides, onClose }: Props) {
  const createTemplate = useMutation(api.templates.create);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personnalisé");
  const [saving, setSaving] = useState(false);

  const categories = ["Cession", "Acquisition", "LBO", "Levée de fonds", "Fusion", "Personnalisé"];

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createTemplate({
        name,
        description,
        category,
        slides: slides.map(s => ({ type: s.type, title: s.title, content: s.content })),
        isCustom: true,
      });
      toast.success("Modèle sauvegardé !");
      onClose();
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-[#1a3a5c] mb-1">Sauvegarder comme modèle</h2>
        <p className="text-sm text-gray-500 mb-4">Ce deck ({slides.length} diapositives) sera sauvegardé comme modèle réutilisable.</p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du modèle *</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#1a3a5c] focus:ring-1 focus:ring-[#1a3a5c]"
              placeholder="ex: Mon modèle LBO"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#1a3a5c] focus:ring-1 focus:ring-[#1a3a5c]"
              placeholder="Décrivez ce modèle..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#1a3a5c] bg-white"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Annuler</button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="flex-1 px-4 py-2 rounded-lg bg-[#1a3a5c] text-white text-sm font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-50"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  );
}
