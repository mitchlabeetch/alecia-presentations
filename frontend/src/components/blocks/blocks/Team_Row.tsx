import { useState } from 'react';
import type { BlockContent } from '@/types';
import { Pencil, X, Check } from 'lucide-react';

interface Team_RowProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

interface MemberData {
  name: string;
  role: string;
}

const DEFAULT_MEMBERS: MemberData[] = [
  { name: 'Jean Dupont', role: 'Directeur general' },
  { name: 'Marie Martin', role: 'Directrice financiere' },
  { name: 'Pierre Leroy', role: 'Directeur technique' },
];

export function Team_Row({ content, isEditing = false, onChange }: Team_RowProps) {
  const members = content.items as unknown as MemberData[] || DEFAULT_MEMBERS;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<MemberData>({ name: '', role: '' });

  const updateMember = (index: number, updates: Partial<MemberData>) => {
    if (onChange) {
      const newMembers = [...members];
      newMembers[index] = { ...newMembers[index], ...updates };
      onChange({ ...content, items: newMembers });
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValues(members[index]);
  };

  const saveEditing = () => {
    if (editingIndex !== null) {
      updateMember(editingIndex, editValues);
    }
    setEditingIndex(null);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditValues({ name: '', role: '' });
  };

  // Mode edition inline
  const renderMember = (member: MemberData, index: number) => {
    const isEditing = editingIndex === index;
    const initials = member.name.split(' ').map(n => n[0]).join('');

    if (isEditing) {
      return (
        <div key={index} className="flex items-center gap-4 bg-white border-2 border-alecia-red rounded-lg p-3 shadow-lg">
          <div className="w-10 h-10 bg-alecia-navy rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">
              {editValues.name.split(' ').map(n => n[0]).join('') || '?'}
            </span>
          </div>
          <div className="flex-1 space-y-1">
            <input
              type="text"
              value={editValues.name}
              onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
              className="w-full font-medium text-alecia-navy bg-transparent border border-alecia-silver/30 rounded px-2 py-1 outline-none"
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
        className="flex items-center gap-4 bg-alecia-silver/5 rounded-lg p-3 group hover:bg-alecia-silver/10 transition-colors"
      >
        <div className="w-10 h-10 bg-alecia-navy rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-white">{initials}</span>
        </div>
        <div className="flex-1">
          <p className="font-medium text-alecia-navy">{member.name}</p>
          <p className="text-sm text-alecia-silver">{member.role}</p>
        </div>
        {isEditing && (
          <button
            onClick={() => startEditing(index)}
            className="p-1 hover:bg-alecia-red/10 rounded"
          >
            <Pencil className="w-4 h-4 text-alecia-red" />
          </button>
        )}
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
        <h3 className="text-xl font-bold text-alecia-navy mb-6">Equipe</h3>
        <div className="mb-4 flex items-center gap-2 text-sm text-alecia-red">
          <Pencil className="w-4 h-4" />
          <span>Cliquez sur le crayon pour editer un membre</span>
        </div>
        <div className="space-y-3">
          {members.map((member, index) => renderMember(member, index))}
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6">Equipe</h3>
      <div className="space-y-3">
        {members.map((member, index) => (
          <div key={index} className="flex items-center gap-4 bg-alecia-silver/5 rounded-lg p-3">
            <div className="w-10 h-10 bg-alecia-navy rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-alecia-navy">{member.name}</p>
              <p className="text-sm text-alecia-silver">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}