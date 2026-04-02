import { useState } from 'react';
import type { BlockContent, SWOTData } from '@/types';
import { Pencil, Plus, X, Check } from 'lucide-react';

interface SWOTBlockProps {
  content: BlockContent;
  data?: { swot?: SWOTData } | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

type SWOTKey = 'strengths' | 'weaknesses' | 'opportunities' | 'threats';

const SWOT_COLORS = {
  strengths: 'bg-green-500',
  weaknesses: 'bg-alecia-red',
  opportunities: 'bg-blue-500',
  threats: 'bg-yellow-500',
};

const SWOT_LABELS = {
  strengths: 'FORCES',
  weaknesses: 'FAIBLESSES',
  opportunities: 'OPPORTUNITÉS',
  threats: 'MENACES',
};

const SWOT_KEYS: SWOTKey[] = ['strengths', 'weaknesses', 'opportunities', 'threats'];

export function SWOTBlock({ content, data, isEditing = false, onChange }: SWOTBlockProps) {
  const getDefaultSwot = (): SWOTData => ({
    strengths: ['Force 1', 'Force 2'],
    weaknesses: ['Faiblesse 1', 'Faiblesse 2'],
    opportunities: ['Opportunite 1', 'Opportunite 2'],
    threats: ['Menace 1', 'Menace 2'],
  });
  
  // Use type assertion to handle the union type
  const swot: SWOTData = (data?.swot ?? content.swot ?? getDefaultSwot()) as SWOTData;

  const [editingKey, setEditingKey] = useState<SWOTKey | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const updateSwot = (key: SWOTKey, newItems: string[]) => {
    if (onChange) {
      onChange({ ...content, swot: { ...swot, [key]: newItems } });
    }
  };

  const startEditingItem = (key: SWOTKey, index: number, currentValue: string) => {
    setEditingKey(key);
    setEditingIndex(index);
    setEditValue(currentValue);
  };

  const saveEditing = () => {
    if (editingKey !== null && editingIndex !== null && editValue.trim()) {
      const newItems = [...swot[editingKey]];
      newItems[editingIndex] = editValue.trim();
      updateSwot(editingKey, newItems);
    }
    setEditingKey(null);
    setEditingIndex(null);
    setEditValue('');
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setEditingIndex(null);
    setEditValue('');
  };

  const addItem = (key: SWOTKey) => {
    const newItems = [...swot[key], 'Nouvel element'];
    updateSwot(key, newItems);
    // Demarrer l'edition du nouvel element
    setEditingKey(key);
    setEditingIndex(newItems.length - 1);
    setEditValue('Nouvel element');
  };

  const removeItem = (key: SWOTKey, index: number) => {
    const newItems = swot[key].filter((_, i) => i !== index);
    updateSwot(key, newItems);
  };

  // Mode edition inline
  const renderItem = (key: SWOTKey, item: string, index: number) => {
    const isEditing = editingKey === key && editingIndex === index;

    return (
      <li key={`${key}-${index}`} className="flex items-center gap-2 group">
        <span className="text-alecia-red font-bold">{'>'}</span>
        {isEditing ? (
          <>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEditing();
                if (e.key === 'Escape') cancelEditing();
              }}
              className="flex-1 text-alecia-navy bg-white border border-alecia-red rounded px-2 py-1 outline-none"
              autoFocus
            />
            <button onClick={saveEditing} className="p-1 hover:bg-green-100 rounded">
              <Check className="w-4 h-4 text-green-600" />
            </button>
            <button onClick={cancelEditing} className="p-1 hover:bg-red-100 rounded">
              <X className="w-4 h-4 text-alecia-red" />
            </button>
          </>
        ) : (
          <>
            <span
              className="flex-1 text-alecia-navy cursor-text hover:bg-alecia-silver/10 px-2 py-1 rounded transition-colors"
              onDoubleClick={() => startEditingItem(key, index, item)}
            >
              {item}
            </span>
            {isEditing && (
              <>
                <button
                  onClick={() => startEditingItem(key, index, item)}
                  className="p-1 hover:bg-alecia-red/10 rounded"
                >
                  <Pencil className="w-4 h-4 text-alecia-red" />
                </button>
                <button
                  onClick={() => removeItem(key, index)}
                  className="p-1 hover:bg-alecia-red/10 rounded"
                >
                  <X className="w-4 h-4 text-alecia-red" />
                </button>
              </>
            )}
          </>
        )}
      </li>
    );
  };

  // Mode edition globale (depuis la barre d'outils)
  if (isEditing && editingKey === null) {
    return (
      <div className="w-full h-full p-8">
        <h3 className="text-xl font-bold text-alecia-navy mb-6 text-center">ANALYSE SWOT</h3>
        <div className="mb-4 flex items-center gap-2 text-sm text-alecia-red justify-center">
          <Pencil className="w-4 h-4" />
          <span>Double-cliquez sur un element pour l'editer</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {SWOT_KEYS.map((key) => (
            <div key={key} className={`${SWOT_COLORS[key]}/10 rounded-xl p-4 border-2 ${SWOT_COLORS[key]}/30`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-alecia-navy">{SWOT_LABELS[key]}</h4>
                <button
                  onClick={() => addItem(key)}
                  className="p-1 hover:bg-white/50 rounded"
                >
                  <Plus className="w-4 h-4 text-alecia-navy" />
                </button>
              </div>
              <ul className="space-y-2">
                {swot[key].map((item, i) => renderItem(key, item, i))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6 text-center">ANALYSE SWOT</h3>
      <div className="grid grid-cols-2 gap-4">
        {SWOT_KEYS.map((key) => (
          <div key={key} className={`${SWOT_COLORS[key]}/10 rounded-xl p-4 border-2 ${SWOT_COLORS[key]}/30`}>
            <h4 className="font-bold text-alecia-navy mb-3">{SWOT_LABELS[key]}</h4>
            <ul className="space-y-2">
              {swot[key].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-alecia-navy">
                  <span className="text-alecia-red font-bold">{'>'}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}