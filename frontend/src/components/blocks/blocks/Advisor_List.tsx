import { useState } from 'react';
import type { BlockContent, Advisor } from '@/types';
import { Pencil, X, Check } from 'lucide-react';

interface Advisor_ListProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

interface AdvisorData {
  name: string;
  role: string;
  firm?: string;
}

const DEFAULT_ADVISORS: AdvisorData[] = [
  { name: 'Cabinet Alpha', role: 'Conseil juridique' },
  { name: 'Banque Beta', role: 'Conseil financier' },
  { name: 'Expert Comptable Gamma', role: 'Due diligence financiere' },
];

export function Advisor_List({ content, isEditing = false, onChange }: Advisor_ListProps) {
  const advisors = (content.advisors || content.items as unknown) as AdvisorData[] || DEFAULT_ADVISORS;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<AdvisorData>({ name: '', role: '', firm: '' });

  const updateAdvisor = (index: number, updates: Partial<AdvisorData>) => {
    if (onChange) {
      const newAdvisors = [...advisors];
      newAdvisors[index] = { ...newAdvisors[index], ...updates };
      onChange({ ...content, advisors: newAdvisors });
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValues(advisors[index]);
  };

  const saveEditing = () => {
    if (editingIndex !== null) {
      updateAdvisor(editingIndex, editValues);
    }
    setEditingIndex(null);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditValues({ name: '', role: '', firm: '' });
  };

  // Mode edition inline
  const renderAdvisor = (advisor: AdvisorData, index: number) => {
    const isEditing = editingIndex === index;

    if (isEditing) {
      return (
        <div key={index} className="flex items-center gap-4 p-4 bg-white border-2 border-alecia-red rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-alecia-navy rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-white">{editValues.name[0] || '?'}</span>
          </div>
          <div className="flex-1 space-y-1">
            <input
              type="text"
              value={editValues.name}
              onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
              className="w-full font-semibold text-alecia-navy bg-transparent border border-alecia-silver/30 rounded px-2 py-1 outline-none"
              placeholder="Nom"
              autoFocus
            />
            <input
              type="text"
              value={editValues.role}
              onChange={(e) => setEditValues({ ...editValues, role: e.target.value })}
              className="w-full text-sm text-alecia-silver bg-transparent border border-alecia-silver/30 rounded px-2 py-1 outline-none"
              placeholder="Role"
            />
          </div>
          <div className="flex gap-1">
            <button onClick={saveEditing} className="p-1 hover:bg-green-100 rounded">
              <Check className="w-4 h-4 text-green-600" />
            </button>
            <button onClick={cancelEditing} className="p-1 hover:bg-red-100 rounded">
              <X className="w-4 h-4 text-alecia-red" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className="flex items-center gap-4 p-4 bg-alecia-silver/5 rounded-xl group hover:bg-alecia-silver/10 transition-colors"
      >
        <div className="w-12 h-12 bg-alecia-navy rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-white">{advisor.name[0]}</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-alecia-navy">{advisor.name}</p>
          <p className="text-sm text-alecia-silver">{advisor.role}</p>
        </div>
        {/* Boutons visibles au survol */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => startEditing(index)}
            className="p-1 hover:bg-alecia-red/10 rounded"
          >
            <Pencil className="w-4 h-4 text-alecia-red" />
          </button>
        </div>
      </div>
    );
  };

  // Mode edition globale
  if (isEditing && editingIndex === null) {
    return (
      <div className="w-full h-full p-8">
        <h3 className="text-xl font-bold text-alecia-navy mb-6">Conseillers</h3>
        <div className="mb-4 flex items-center gap-2 text-sm text-alecia-red">
          <Pencil className="w-4 h-4" />
          <span>Cliquez sur le crayon pour editer un conseiller</span>
        </div>
        <div className="space-y-4">
          {advisors.map((advisor, index) => renderAdvisor(advisor, index))}
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6">Conseillers</h3>
      <div className="space-y-4">
        {advisors.map((advisor, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-alecia-silver/5 rounded-xl">
            <div className="w-12 h-12 bg-alecia-navy rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-white">{advisor.name[0]}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-alecia-navy">{advisor.name}</p>
              <p className="text-sm text-alecia-silver">{advisor.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}