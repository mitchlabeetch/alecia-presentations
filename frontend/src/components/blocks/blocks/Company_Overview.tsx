import { useState } from 'react';
import type { BlockContent, CompanyInfo } from '@/types';
import { Pencil, Check, X } from 'lucide-react';

interface Company_OverviewProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Company_Overview({ content, isEditing = false, onChange }: Company_OverviewProps) {
  const company: CompanyInfo = content.company || {
    name: content.text || 'Presentation de l\'entreprise',
    description: content.caption || '',
  };

  const [editingField, setEditingField] = useState<'name' | 'description' | null>(null);
  const [editValues, setEditValues] = useState({ name: '', description: '' });

  const startEditing = (field: 'name' | 'description') => {
    setEditingField(field);
    setEditValues({ name: company.name || '', description: company.description || '' });
  };

  const saveEditing = () => {
    if (onChange) {
      const updatedCompany = {
        ...company,
        name: editValues.name,
        description: editValues.description,
      };
      onChange({
        ...content,
        text: editValues.name,
        caption: editValues.description,
        company: updatedCompany,
      });
    }
    setEditingField(null);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValues({ name: '', description: '' });
  };

  // Mode edition globale
  if (isEditing && editingField === null) {
    return (
      <div className="w-full h-full p-8">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-alecia-navy rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-4xl font-bold text-white">Logo</span>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-xs text-alecia-silver mb-1 flex items-center gap-1">
                <Pencil className="w-3 h-3" />
                Nom de l'entreprise
              </label>
              <input
                type="text"
                value={company.name || ''}
                onChange={(e) => {
                  if (onChange) {
                    onChange({
                      ...content,
                      text: e.target.value,
                      company: { ...company, name: e.target.value },
                    });
                  }
                }}
                className="w-full text-2xl font-bold text-alecia-navy bg-white border-2 border-alecia-red/30 rounded px-3 py-2 outline-none"
                placeholder="Nom de l'entreprise"
              />
            </div>
            <div>
              <label className="text-xs text-alecia-silver mb-1 flex items-center gap-1">
                <Pencil className="w-3 h-3" />
                Description
              </label>
              <textarea
                value={company.description || ''}
                onChange={(e) => {
                  if (onChange) {
                    onChange({
                      ...content,
                      caption: e.target.value,
                      company: { ...company, description: e.target.value },
                    });
                  }
                }}
                className="w-full text-alecia-silver bg-white border-2 border-alecia-red/30 rounded px-3 py-2 resize-none outline-none"
                rows={4}
                placeholder="Description de l'entreprise..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mode inline editing - nom
  if (editingField === 'name') {
    return (
      <div className="w-full h-full p-8">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-alecia-navy rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-4xl font-bold text-white">Logo</span>
          </div>
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={editValues.name}
                onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEditing();
                  if (e.key === 'Escape') cancelEditing();
                }}
                onBlur={saveEditing}
                className="w-full text-2xl font-bold text-alecia-navy bg-white border-2 border-alecia-red rounded px-3 py-2 outline-none shadow-lg"
                placeholder="Nom de l'entreprise"
                autoFocus
              />
              <div className="absolute -top-8 left-0 flex items-center gap-1 text-xs text-alecia-red bg-white px-2 py-1 rounded-full shadow">
                <Pencil className="w-3 h-3" />
                <span>Entree=OK | Echap=Annuler</span>
              </div>
            </div>
            <p className="text-alecia-silver mt-2 whitespace-pre-wrap">{company.description}</p>
          </div>
        </div>
      </div>
    );
  }

  // Mode inline editing - description
  if (editingField === 'description') {
    return (
      <div className="w-full h-full p-8">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-alecia-navy rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-4xl font-bold text-white">Logo</span>
          </div>
          <div className="flex-1">
            <h2
              className="text-2xl font-bold text-alecia-navy mb-4 cursor-text hover:bg-alecia-silver/10 px-2 py-1 rounded"
              onClick={() => startEditing('name')}
            >
              {company.name}
            </h2>
            <div className="relative">
              <textarea
                value={editValues.description}
                onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') cancelEditing();
                }}
                onBlur={saveEditing}
                className="w-full text-alecia-silver bg-white border-2 border-alecia-red rounded px-3 py-2 resize-none outline-none shadow-lg"
                rows={4}
                placeholder="Description de l'entreprise..."
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full p-8">
      <div className="flex items-start gap-6">
        <div className="w-32 h-32 bg-alecia-navy rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-4xl font-bold text-white">Logo</span>
        </div>
        <div className="flex-1">
          <h2
            className={`text-2xl font-bold text-alecia-navy mb-4 cursor-text hover:bg-alecia-silver/10 px-2 py-1 rounded transition-colors ${isEditing ? 'group' : ''}`}
            onClick={() => isEditing && startEditing('name')}
          >
            {company.name}
          </h2>
          <p
            className={`text-alecia-silver whitespace-pre-wrap cursor-text hover:bg-alecia-silver/10 px-2 py-1 rounded transition-colors ${isEditing ? 'group' : ''}`}
            onClick={() => isEditing && startEditing('description')}
          >
            {company.description}
          </p>
        </div>
      </div>
    </div>
  );
}