import { useState } from 'react';
import type { BlockContent, ListItem } from '@/types';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface ListeProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Liste({ content, isEditing = false, onChange }: ListeProps) {
  const items = content.items || [];

  const addItem = () => {
    const newItem: ListItem = {
      id: `item-${Date.now()}`,
      text: 'Nouvel élément',
      level: 0,
    };
    if (onChange) {
      onChange({ ...content, items: [...items, newItem] });
    }
  };

  const updateItem = (id: string, text: string) => {
    if (onChange) {
      onChange({
        ...content,
        items: items.map((item) =>
          item.id === id ? { ...item, text } : item
        ),
      });
    }
  };

  const removeItem = (id: string) => {
    if (onChange) {
      onChange({
        ...content,
        items: items.filter((item) => item.id !== id),
      });
    }
  };

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-alecia-silver cursor-grab" />
              <span className="text-alecia-red font-bold">›</span>
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateItem(item.id, e.target.value)}
                className="flex-1 text-alecia-navy bg-transparent border-none outline-none focus:ring-2 focus:ring-alecia-red/30 rounded px-2"
              />
              <button
                onClick={() => removeItem(item.id)}
                className="p-1 hover:bg-alecia-red/10 rounded"
              >
                <Trash2 className="w-4 h-4 text-alecia-red" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-4 flex items-center gap-2 text-sm text-alecia-red hover:underline"
        >
          <Plus className="w-4 h-4" />
          Ajouter un élément
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <span className="text-alecia-red font-bold text-xl mt-0.5">›</span>
            <span className="text-alecia-navy text-lg leading-relaxed">
              {item.text}
            </span>
          </li>
        ))}
      </ul>
      {items.length === 0 && (
        <p className="text-alecia-silver text-center">Aucun élément</p>
      )}
    </div>
  );
}
