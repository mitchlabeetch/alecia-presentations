import { useState } from 'react';
import type { BlockContent, ListItem } from '@/types';
import { Plus, Trash2, GripVertical, Pencil, Check, X } from 'lucide-react';

interface ListeProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Liste({ content, isEditing = false, onChange }: ListeProps) {
  const items = content.items || [];
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const addItem = () => {
    const newItem: ListItem = {
      id: `item-${Date.now()}`,
      text: 'Nouvel element',
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

  const startEditing = (id: string, currentText: string) => {
    setEditingItemId(id);
    setEditValue(currentText);
  };

  const saveEditing = () => {
    if (editingItemId && editValue.trim()) {
      updateItem(editingItemId, editValue.trim());
    }
    setEditingItemId(null);
    setEditValue('');
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditValue('');
  };

  // Mode edition inline - affichage avec edition par element
  const renderItem = (item: ListItem) => {
    const isItemEditing = editingItemId === item.id;

    return (
      <div key={item.id} className="flex items-center gap-2 group">
        <GripVertical className="w-4 h-4 text-alecia-silver cursor-grab" />
        <span className="text-alecia-red font-bold">›</span>

        {isItemEditing ? (
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
            <button
              onClick={saveEditing}
              className="p-1 hover:bg-green-100 rounded"
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
            <button
              onClick={cancelEditing}
              className="p-1 hover:bg-red-100 rounded"
            >
              <X className="w-4 h-4 text-alecia-red" />
            </button>
          </>
        ) : (
          <>
            <span
              className="flex-1 text-alecia-navy cursor-text hover:bg-alecia-silver/10 px-2 py-1 rounded transition-colors"
              onDoubleClick={() => startEditing(item.id, item.text)}
            >
              {item.text}
            </span>
            <button
              onClick={() => startEditing(item.id, item.text)}
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-alecia-red/10 rounded transition-all"
            >
              <Pencil className="w-4 h-4 text-alecia-red" />
            </button>
            <button
              onClick={() => removeItem(item.id)}
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-alecia-red/10 rounded transition-all"
            >
              <Trash2 className="w-4 h-4 text-alecia-red" />
            </button>
          </>
        )}
      </div>
    );
  };

  // Mode d'edition global (barre d'outils)
  if (isEditing && !editingItemId) {
    return (
      <div className="w-full h-full p-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-alecia-red">
          <Pencil className="w-4 h-4" />
          <span>Double-cliquez sur un element pour l'editer</span>
        </div>
        <div className="space-y-2">
          {items.map(renderItem)}
        </div>
        <button
          onClick={addItem}
          className="mt-4 flex items-center gap-2 text-sm text-alecia-red hover:underline"
        >
          <Plus className="w-4 h-4" />
          Ajouter un element
        </button>
      </div>
    );
  }

  // Mode affichage
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
        <p className="text-alecia-silver text-center">
          Aucun element | Double-cliquez pour editer
        </p>
      )}
    </div>
  );
}