import { useState } from 'react';
import type { BlockContent, Section } from '@/types';
import { Pencil, Plus } from 'lucide-react';

interface SectionNavigatorProps {
  content: BlockContent;
  data?: { sections?: Section[] } | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export function SectionNavigator({ content, data, isEditing = false, onChange }: SectionNavigatorProps) {
  const sections = data?.sections || content.sections || [];
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const updateSection = (index: number, newTitle: string) => {
    if (onChange) {
      const newSections = [...sections];
      newSections[index] = { ...newSections[index], title: newTitle };
      onChange({ ...content, sections: newSections });
    }
  };

  const startEditing = (index: number, currentTitle: string) => {
    setEditingIndex(index);
    setEditValue(currentTitle);
  };

  const saveEditing = () => {
    if (editingIndex !== null && editValue.trim()) {
      updateSection(editingIndex, editValue.trim());
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const addSection = () => {
    if (onChange) {
      const newSection: Section = {
        id: `section-${Date.now()}`,
        title: 'Nouvelle section',
        page: sections.length + 1,
      };
      onChange({ ...content, sections: [...sections, newSection] });
    }
  };

  // Mode edition globale
  if (isEditing && editingIndex === null) {
    return (
      <div className="w-full h-full p-8">
        <h2 className="text-2xl font-bold text-alecia-navy mb-6">SOMMAIRE</h2>
        <div className="mb-4 flex items-center gap-2 text-sm text-alecia-red">
          <Pencil className="w-4 h-4" />
          <span>Cliquez sur une section pour l'editer</span>
        </div>
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={section.id || index} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-alecia-red rounded-full flex items-center justify-center text-white font-bold">
                {ROMAN_NUMERALS[index] || index + 1}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(index, e.target.value)}
                  className="w-full text-alecia-navy bg-white border-2 border-alecia-red/30 rounded px-3 py-2 outline-none"
                  placeholder="Titre de la section"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addSection}
          className="mt-4 flex items-center gap-2 text-sm text-alecia-red hover:underline"
        >
          <Plus className="w-4 h-4" />
          Ajouter une section
        </button>
        {sections.length === 0 && (
          <p className="text-alecia-silver text-center">Aucune section definie</p>
        )}
      </div>
    );
  }

  // Mode inline editing
  if (editingIndex !== null) {
    return (
      <div className="w-full h-full p-8">
        <h2 className="text-2xl font-bold text-alecia-navy mb-6">SOMMAIRE</h2>
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={section.id || index} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-alecia-red rounded-full flex items-center justify-center text-white font-bold">
                {ROMAN_NUMERALS[index] || index + 1}
              </div>
              <div className="flex-1">
                {index === editingIndex ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditing();
                      if (e.key === 'Escape') cancelEditing();
                    }}
                    onBlur={saveEditing}
                    className="w-full text-alecia-navy bg-white border-2 border-alecia-red rounded px-3 py-2 outline-none shadow-lg"
                    placeholder="Titre de la section"
                    autoFocus
                  />
                ) : (
                  <div
                    className="border-b border-alecia-silver/20 pb-2 cursor-text hover:bg-alecia-silver/10 px-2 py-1 rounded"
                    onClick={() => startEditing(index, section.title)}
                  >
                    <span className="text-alecia-navy font-medium">{section.title}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full p-8">
      <h2 className="text-2xl font-bold text-alecia-navy mb-6">SOMMAIRE</h2>
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.id || index} className="flex items-center gap-4">
            <div className="w-12 h-12 bg-alecia-red rounded-full flex items-center justify-center text-white font-bold">
              {ROMAN_NUMERALS[index] || index + 1}
            </div>
            <div className="flex-1 border-b border-alecia-silver/20 pb-2">
              <span
                className={`text-alecia-navy font-medium cursor-text hover:bg-alecia-silver/10 px-2 py-1 rounded transition-colors ${isEditing ? 'group' : ''}`}
                onClick={() => isEditing && startEditing(index, section.title)}
              >
                {section.title}
              </span>
            </div>
          </div>
        ))}
      </div>
      {sections.length === 0 && (
        <p className="text-alecia-silver text-center">Aucune section definie</p>
      )}
    </div>
  );
}