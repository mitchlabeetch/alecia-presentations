import { useState } from 'react';
import { Trash2, DollarSign, Hash, Calendar, AlignLeft, Type, Check } from 'lucide-react';
import type { Variable } from '@/types';

interface VariableRowProps {
  variable: Variable;
  onUpdate: (id: string, updates: Partial<Variable>) => void;
  onDelete: (id: string) => void;
  isSystem?: boolean;
}

const TYPE_ICONS: Record<Variable['type'], typeof Type> = {
  text: Type,
  number: Hash,
  currency: DollarSign,
  date: Calendar,
  percentage: Type,
};

const TYPE_LABELS: Record<Variable['type'], string> = {
  text: 'Texte',
  number: 'Nombre',
  currency: 'Montant',
  percentage: 'Pourcentage',
  date: 'Date',
};

export function VariableRow({ variable, onUpdate, onDelete, isSystem }: VariableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(variable.name);
  const [editDescription, setEditDescription] = useState(variable.description || '');
  const TypeIcon = TYPE_ICONS[variable.type] || Type;

  const handleTypeChange = (type: Variable['type']) => {
    let formattedValue = variable.value;

    switch (type) {
      case 'currency':
        formattedValue = variable.value.replace(/[€$]/g, '').trim();
        break;
      case 'percentage':
        formattedValue = variable.value.replace(/%/g, '').trim();
        break;
      case 'number':
        formattedValue = variable.value.replace(/[^0-9.-]/g, '').trim();
        break;
    }

    onUpdate(variable.id, { type, value: formattedValue });
  };

  const handleNameBlur = () => {
    if (editName.trim() !== variable.name) {
      onUpdate(variable.id, { name: editName.trim() || variable.name });
    }
    setIsEditing(false);
  };

  const handleDescriptionBlur = () => {
    if (editDescription !== variable.description) {
      onUpdate(variable.id, { description: editDescription });
    }
  };

  const formatDisplayValue = (value: string, type: Variable['type']): string => {
    if (!value) return '';
    switch (type) {
      case 'currency':
        return `${value} €`;
      case 'percentage':
        return `${value}%`;
      default:
        return value;
    }
  };

  const getRawValue = (value: string): string => {
    return value.replace(/[€%]$/, '').trim();
  };

  return (
    <div className="bg-white rounded-lg border border-alecia-silver/20 p-3 transition-all hover:shadow-sm">
      {/* Header with name and badges */}
      <div className="flex items-center gap-2 mb-3">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
            className="alecia-input text-xs font-mono flex-1"
            autoFocus
            placeholder="nom_variable"
          />
        ) : (
          <button
            onClick={() => !isSystem && setIsEditing(true)}
            className={`text-xs font-mono px-2 py-0.5 rounded bg-alecia-silver/10 text-alecia-navy ${!isSystem ? 'hover:bg-alecia-silver/20 cursor-pointer' : ''}`}
          >
            {variable.name || 'sans_nom'}
          </button>
        )}

        {isSystem && (
          <span className="text-xs text-alecia-navy/60 bg-alecia-navy/5 px-2 py-0.5 rounded">
            Système
          </span>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <TypeIcon className="w-3 h-3 text-alecia-silver" />
          <span className="text-xs text-alecia-silver">
            {TYPE_LABELS[variable.type]}
          </span>
        </div>
      </div>

      {/* Value input */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 relative">
          <input
            type={variable.type === 'date' ? 'date' : 'text'}
            value={isEditing ? variable.value : getRawValue(variable.value)}
            onChange={(e) => {
              const rawValue = e.target.value
                .replace(/€$/, '')
                .replace(/%$/, '')
                .trim();
              onUpdate(variable.id, { value: rawValue });
            }}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            className="alecia-input text-sm pr-12"
            placeholder={`{{${variable.name || 'variable'}}}`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-alecia-silver/60">
            {isEditing ? '' : formatDisplayValue(variable.value, variable.type)}
          </span>
        </div>

        {/* Type selector */}
        <select
          value={variable.type}
          onChange={(e) => handleTypeChange(e.target.value as Variable['type'])}
          className="alecia-input w-28 text-sm bg-white"
        >
          <option value="text">Texte</option>
          <option value="number">Nombre</option>
          <option value="currency">Montant</option>
          <option value="percentage">%</option>
          <option value="date">Date</option>
        </select>

        {/* Delete button */}
        {!isSystem && (
          <button
            onClick={() => onDelete(variable.id)}
            className="p-1.5 text-alecia-silver hover:text-alecia-red hover:bg-alecia-red/10 rounded transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Description */}
      <div className="mt-2">
        <input
          type="text"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          onBlur={handleDescriptionBlur}
          className="w-full text-xs text-alecia-silver bg-transparent border-none outline-none focus:ring-0 placeholder:text-alecia-silver/50"
          placeholder="Description (optionnel)"
        />
      </div>

      {/* Variable syntax hint */}
      <div className="mt-2 pt-2 border-t border-alecia-silver/10">
        <code className="text-xs text-alecia-silver/50 font-mono">
          {'{{'}{variable.name || 'variable'}{'}}'}
        </code>
      </div>
    </div>
  );
}
