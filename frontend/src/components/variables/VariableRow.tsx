import { useState } from 'react';
import { Trash2, DollarSign, Hash, Calendar, AlignLeft, Type } from 'lucide-react';
import type { Variable } from '@/types';

interface VariableRowProps {
  variable: Variable;
  onUpdate: (id: string, updates: Partial<Variable>) => void;
  onDelete: (id: string) => void;
  isSystem?: boolean;
}

const TYPE_ICONS = {
  text: Type,
  number: Hash,
  currency: DollarSign,
  date: Calendar,
  percentage: Percent,
};

function Percent({ className }: { className?: string }) {
  return (
    <span className={className}>%</span>
  );
}

export function VariableRow({ variable, onUpdate, onDelete, isSystem }: VariableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
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

  const formatValue = (value: string, type: Variable['type']) => {
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

  return (
    <div className="bg-white rounded-lg border border-alecia-silver/20 p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-alecia-silver bg-alecia-silver/10 px-2 py-0.5 rounded">
          {{...variable.name}}
        </span>
        {isSystem && (
          <span className="text-xs text-alecia-navy bg-alecia-navy/10 px-2 py-0.5 rounded">
            Système
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={isEditing ? variable.value : formatValue(variable.value, variable.type)}
            onChange={(e) => {
              const rawValue = e.target.value
                .replace(/€$/, '')
                .replace(/%$/, '')
                .trim();
              onUpdate(variable.id, { value: rawValue });
            }}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            disabled={isSystem && !isEditing}
            className="alecia-input text-sm pr-16"
            placeholder={`{{${variable.name}}}`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-alecia-silver">
            {`{{${variable.name}}}`}
          </span>
        </div>

        <select
          value={variable.type}
          onChange={(e) => handleTypeChange(e.target.value as Variable['type'])}
          className="alecia-input w-24 text-sm"
        >
          <option value="text">Texte</option>
          <option value="number">Nombre</option>
          <option value="currency">Montant</option>
          <option value="percentage">Pourcentage</option>
          <option value="date">Date</option>
        </select>

        {!isSystem && (
          <button
            onClick={() => onDelete(variable.id)}
            className="p-1.5 text-alecia-red hover:bg-alecia-red/10 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {variable.description && (
        <p className="text-xs text-alecia-silver mt-1">{variable.description}</p>
      )}
    </div>
  );
}
