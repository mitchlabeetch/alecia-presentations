import { useState } from 'react';
import type { BlockContent } from '@/types';
import { Pencil } from 'lucide-react';

interface Deal_RationaleProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Deal_Rationale({ content, isEditing = false, onChange }: Deal_RationaleProps) {
  const title = content.text || 'Justification de l\'operation';
  const description = content.caption || '';

  const [editingField, setEditingField] = useState<'title' | 'description' | null>(null);
  const [editValues, setEditValues] = useState({ title: '', description: '' });

  const startEditing = (field: 'title' | 'description') => {
    setEditingField(field);
    setEditValues({ title, description });
  };

  const saveEditing = () => {
    if (onChange) {
      onChange({
        ...content,
        text: editValues.title,
        caption: editValues.description,
      });
    }
    setEditingField(null);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValues({ title: '', description: '' });
  };

  // Mode edition globale
  if (isEditing && editingField === null) {
    return (
      <div className="w-full h-full p-8">
        <div className="bg-alecia-red/5 rounded-xl p-6 border-l-4 border-alecia-red space-y-4">
          <div>
            <label className="text-xs text-alecia-silver mb-1 flex items-center gap-1">
              <Pencil className="w-3 h-3" />
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onChange?.({ ...content, text: e.target.value })}
              className="w-full text-lg font-bold text-alecia-navy bg-white border-2 border-alecia-red/30 rounded px-3 py-2 outline-none"
              placeholder="Titre de la justification"
            />
          </div>
          <div>
            <label className="text-xs text-alecia-silver mb-1 flex items-center gap-1">
              <Pencil className="w-3 h-3" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => onChange?.({ ...content, caption: e.target.value })}
              className="w-full text-alecia-navy bg-white border-2 border-alecia-red/30 rounded px-3 py-2 resize-none outline-none"
              rows={6}
              placeholder="Expliquez la justification de l'operation..."
            />
          </div>
        </div>
      </div>
    );
  }

  // Mode inline editing - titre
  if (editingField === 'title') {
    return (
      <div className="w-full h-full p-8">
        <div className="bg-alecia-red/5 rounded-xl p-6 border-l-4 border-alecia-red">
          <div className="relative">
            <input
              type="text"
              value={editValues.title}
              onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEditing();
                if (e.key === 'Escape') cancelEditing();
              }}
              onBlur={saveEditing}
              className="w-full text-lg font-bold text-alecia-navy bg-white border-2 border-alecia-red rounded px-3 py-2 outline-none shadow-lg"
              placeholder="Titre de la justification"
              autoFocus
            />
            <div className="absolute -top-8 left-0 flex items-center gap-1 text-xs text-alecia-red bg-white px-2 py-1 rounded-full shadow">
              <Pencil className="w-3 h-3" />
              <span>Entree=OK | Echap=Annuler</span>
            </div>
          </div>
          <p className="text-alecia-navy mt-3 whitespace-pre-wrap">{description}</p>
        </div>
      </div>
    );
  }

  // Mode inline editing - description
  if (editingField === 'description') {
    return (
      <div className="w-full h-full p-8">
        <div className="bg-alecia-red/5 rounded-xl p-6 border-l-4 border-alecia-red">
          <h3
            className="text-lg font-bold text-alecia-navy mb-3 cursor-text hover:bg-alecia-silver/10 px-2 py-1 rounded"
            onClick={() => startEditing('title')}
          >
            {title}
          </h3>
          <div className="relative">
            <textarea
              value={editValues.description}
              onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Escape') cancelEditing();
              }}
              onBlur={saveEditing}
              className="w-full text-alecia-navy bg-white border-2 border-alecia-red rounded px-3 py-2 resize-none outline-none shadow-lg"
              rows={6}
              placeholder="Expliquez la justification de l'operation..."
              autoFocus
            />
          </div>
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full p-8">
      <div className="bg-alecia-red/5 rounded-xl p-6 border-l-4 border-alecia-red">
        <h3
          className={`text-lg font-bold text-alecia-navy mb-3 cursor-text hover:bg-alecia-silver/10 px-2 py-1 rounded transition-colors ${isEditing ? 'group' : ''}`}
          onClick={() => isEditing && startEditing('title')}
        >
          {title}
        </h3>
        <p
          className={`text-alecia-navy whitespace-pre-wrap cursor-text hover:bg-alecia-silver/10 px-2 py-1 rounded transition-colors ${isEditing ? 'group' : ''}`}
          onClick={() => isEditing && startEditing('description')}
        >
          {description}
        </p>
      </div>
    </div>
  );
}