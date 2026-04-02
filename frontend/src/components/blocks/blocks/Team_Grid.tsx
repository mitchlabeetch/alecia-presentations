import { useState } from 'react';
import type { BlockContent, Advisor } from '@/types';
import { Pencil, X, Check } from 'lucide-react';

interface Team_GridProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

interface MemberData {
  name: string;
  role: string;
  email?: string;
}

const DEFAULT_MEMBERS: MemberData[] = [
  { name: 'Jean Dupont', role: 'Directeur general', email: 'jean.dupont@entreprise.com' },
  { name: 'Marie Martin', role: 'Directrice financiere', email: 'marie.martin@entreprise.com' },
  { name: 'Pierre Leroy', role: 'Directeur technique', email: 'pierre.leroy@entreprise.com' },
  { name: 'Sophie Bernard', role: 'Directrice juridique', email: 'sophie.bernard@entreprise.com' },
];

export function Team_Grid({ content, isEditing = false, onChange }: Team_GridProps) {
  // Charger les membres depuis le content ou utiliser les defauts
  const storedMembers = content.advisors || content.members || content.items as unknown as Advisor[] | undefined;
  const members: MemberData[] = storedMembers
    ? storedMembers.map((a: Advisor | unknown) => {
        if (typeof a === 'object' && a !== null && 'name' in a) {
          return { name: (a as Advisor).name, role: (a as Advisor).role, email: (a as Advisor).email };
        }
        return a as unknown as MemberData;
      })
    : DEFAULT_MEMBERS;

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<MemberData>({ name: '', role: '', email: '' });

  const updateMember = (index: number, updates: Partial<MemberData>) => {
    if (onChange) {
      const newMembers = [...members];
      newMembers[index] = { ...newMembers[index], ...updates };
      onChange({ ...content, advisors: newMembers });
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
    setEditValues({ name: '', role: '', email: '' });
  };

  // Mode edition inline
  const renderMember = (member: MemberData, index: number) => {
    const isEditing = editingIndex === index;
    const initials = member.name.split(' ').map(n => n[0]).join('');

    if (isEditing) {
      return (
        <div key={index} className="bg-white border-2 border-alecia-red rounded-xl p-4 space-y-2 shadow-lg">
          <div className="flex justify-center gap-2 mb-2">
            <input
              type="text"
              value={editValues.name}
              onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
              className="flex-1 text-center font-semibold text-alecia-navy bg-transparent border border-alecia-silver/30 rounded px-2 py-1 outline-none"
              placeholder="Nom"
              autoFocus
            />
          </div>
          <div className="w-16 h-16 bg-alecia-navy rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-2xl font-bold text-white">
              {editValues.name.split(' ').map(n => n[0]).join('') || '?'}
            </span>
          </div>
          <input
            type="text"
            value={editValues.role}
            onChange={(e) => setEditValues({ ...editValues, role: e.target.value })}
            className="w-full text-sm text-alecia-silver bg-transparent border border-alecia-silver/30 rounded px-2 py-1 outline-none text-center"
            placeholder="Role"
          />
          <input
            type="text"
            value={editValues.email || ''}
            onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
            className="w-full text-xs text-alecia-silver bg-transparent border border-alecia-silver/30 rounded px-2 py-1 outline-none text-center"
            placeholder="Email"
          />
          <div className="flex justify-center gap-2 mt-2">
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
        className="bg-alecia-silver/5 rounded-xl p-4 group hover:bg-alecia-silver/10 transition-colors relative"
      >
        <div className="w-16 h-16 bg-alecia-navy rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-bold text-white">{initials}</span>
        </div>
        <h4 className="font-semibold text-alecia-navy text-center">{member.name}</h4>
        <p className="text-sm text-alecia-silver text-center">{member.role}</p>
        {member.email && (
          <p className="text-xs text-alecia-silver/60 text-center mt-1">{member.email}</p>
        )}
        {isEditing && (
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={() => startEditing(index)}
              className="p-1 hover:bg-alecia-red/10 rounded"
            >
              <Pencil className="w-4 h-4 text-alecia-red" />
            </button>
          </div>
        )}
        {/* Boutons visibles au survol */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
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
        <h3 className="text-xl font-bold text-alecia-navy mb-6">Equipe dirigeante</h3>
        <div className="mb-4 flex items-center gap-2 text-sm text-alecia-red">
          <Pencil className="w-4 h-4" />
          <span>Cliquez sur le crayon pour editer un membre</span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {members.map((member, index) => renderMember(member, index))}
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6">Equipe dirigeante</h3>
      <div className="grid grid-cols-2 gap-6">
        {members.map((member, index) => (
          <div key={index} className="bg-alecia-silver/5 rounded-xl p-4">
            <div className="w-16 h-16 bg-alecia-navy rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-white">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h4 className="font-semibold text-alecia-navy text-center">{member.name}</h4>
            <p className="text-sm text-alecia-silver text-center">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}