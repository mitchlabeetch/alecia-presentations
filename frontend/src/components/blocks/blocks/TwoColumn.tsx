import { useState } from 'react';
import type { BlockContent } from '@/types';
import { Pencil } from 'lucide-react';

interface TwoColumnProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function TwoColumn({ content, isEditing = false, onChange }: TwoColumnProps) {
  const leftText = content.text || '';
  const rightText = content.caption || '';
  const [editingColumn, setEditingColumn] = useState<'left' | 'right' | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (column: 'left' | 'right') => {
    setEditingColumn(column);
    setEditValue(column === 'left' ? leftText : rightText);
  };

  const saveEditing = () => {
    if (editingColumn && onChange) {
      if (editingColumn === 'left') {
        onChange({ ...content, text: editValue });
      } else {
        onChange({ ...content, caption: editValue });
      }
    }
    setEditingColumn(null);
  };

  const cancelEditing = () => {
    setEditingColumn(null);
    setEditValue('');
  };

  // Mode edition globale
  if (isEditing && editingColumn === null) {
    return (
      <div className="w-full h-full p-4 flex gap-8">
        <div className="flex-1">
          <label className="text-xs font-medium text-alecia-silver mb-2 block flex items-center gap-1">
            <Pencil className="w-3 h-3" />
            Colonne gauche
          </label>
          <textarea
            value={leftText}
            onChange={(e) => onChange?.({ ...content, text: e.target.value })}
            className="w-full h-full text-alecia-navy bg-white/80 border-2 border-alecia-red/30 rounded p-2 resize-none"
            placeholder="Contenu gauche..."
          />
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium text-alecia-silver mb-2 block flex items-center gap-1">
            <Pencil className="w-3 h-3" />
            Colonne droite
          </label>
          <textarea
            value={rightText}
            onChange={(e) => onChange?.({ ...content, caption: e.target.value })}
            className="w-full h-full text-alecia-navy bg-white/80 border-2 border-alecia-red/30 rounded p-2 resize-none"
            placeholder="Contenu droit..."
          />
        </div>
      </div>
    );
  }

  // Mode inline editing - colonne gauche
  if (editingColumn === 'left') {
    return (
      <div className="w-full h-full p-8 flex gap-12">
        <div className="flex-1 relative">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) saveEditing();
              if (e.key === 'Escape') cancelEditing();
            }}
            onBlur={saveEditing}
            className="w-full h-full text-alecia-navy bg-white/90 border-2 border-alecia-red rounded p-4 resize-none shadow-lg"
            placeholder="Contenu gauche..."
            autoFocus
          />
          <div className="absolute -top-8 left-0 flex items-center gap-2 text-xs text-alecia-red bg-white px-2 py-1 rounded-full shadow">
            <Pencil className="w-3 h-3" />
            <span>Cmd+Entree=OK | Echap=Annuler</span>
          </div>
        </div>
        <div className="flex-1">
          <div
            className="prose prose-alecia text-alecia-navy whitespace-pre-wrap cursor-text hover:bg-alecia-silver/5 p-2 rounded transition-colors"
            onClick={() => startEditing('right')}
          >
            {rightText || <span className="text-alecia-silver italic">Colonne droite - cliquer pour editer</span>}
          </div>
        </div>
      </div>
    );
  }

  // Mode inline editing - colonne droite
  if (editingColumn === 'right') {
    return (
      <div className="w-full h-full p-8 flex gap-12">
        <div className="flex-1">
          <div
            className="prose prose-alecia text-alecia-navy whitespace-pre-wrap cursor-text hover:bg-alecia-silver/5 p-2 rounded transition-colors"
            onClick={() => startEditing('left')}
          >
            {leftText || <span className="text-alecia-silver italic">Colonne gauche - cliquer pour editer</span>}
          </div>
        </div>
        <div className="flex-1 relative">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) saveEditing();
              if (e.key === 'Escape') cancelEditing();
            }}
            onBlur={saveEditing}
            className="w-full h-full text-alecia-navy bg-white/90 border-2 border-alecia-red rounded p-4 resize-none shadow-lg"
            placeholder="Contenu droit..."
            autoFocus
          />
          <div className="absolute -top-8 left-0 flex items-center gap-2 text-xs text-alecia-red bg-white px-2 py-1 rounded-full shadow">
            <Pencil className="w-3 h-3" />
            <span>Cmd+Entree=OK | Echap=Annuler</span>
          </div>
        </div>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full p-8 flex gap-12">
      <div className="flex-1">
        <div
          className="prose prose-alecia text-alecia-navy whitespace-pre-wrap cursor-text hover:bg-alecia-silver/5 p-2 rounded transition-colors"
          onClick={() => isEditing && startEditing('left')}
        >
          {leftText || <span className="text-alecia-silver italic">Colonne gauche</span>}
        </div>
      </div>
      <div className="flex-1">
        <div
          className="prose prose-alecia text-alecia-navy whitespace-pre-wrap cursor-text hover:bg-alecia-silver/5 p-2 rounded transition-colors"
          onClick={() => isEditing && startEditing('right')}
        >
          {rightText || <span className="text-alecia-silver italic">Colonne droite</span>}
        </div>
      </div>
    </div>
  );
}