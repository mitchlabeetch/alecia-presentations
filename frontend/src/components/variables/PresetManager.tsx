import { useState } from 'react';
import { Plus, Download, Trash2, Check, Star } from 'lucide-react';
import type { VariablePreset } from '@/types';

interface PresetManagerProps {
  presets: VariablePreset[];
  onSave: (name: string) => void;
  onLoad: (preset: VariablePreset) => void;
  onDelete: () => void;
}

export function PresetManager({ presets, onSave, onLoad, onDelete }: PresetManagerProps) {
  const [newPresetName, setNewPresetName] = useState('');
  const [showNewPreset, setShowNewPreset] = useState(false);

  const handleSave = () => {
    if (newPresetName.trim()) {
      onSave(newPresetName.trim());
      setNewPresetName('');
      setShowNewPreset(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/variables/${id}`, { method: 'DELETE' });
      onDelete();
    } catch (error) {
      console.error('Failed to delete preset:', error);
    }
  };

  const handleSetDefault = async (preset: VariablePreset) => {
    try {
      await fetch(`/api/variables/${preset.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      });
      onDelete();
    } catch (error) {
      console.error('Failed to set default:', error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-alecia-navy">Presets</h4>
        <button
          onClick={() => setShowNewPreset(!showNewPreset)}
          className="p-1 hover:bg-alecia-silver/10 rounded"
        >
          <Plus className="w-4 h-4 text-alecia-navy" />
        </button>
      </div>

      {showNewPreset && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="Nom du preset..."
            className="alecia-input text-sm flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button onClick={handleSave} className="alecia-btn-primary text-sm px-3">
            Sauvegarder
          </button>
        </div>
      )}

      <div className="space-y-1 max-h-48 overflow-y-auto">
        {presets.length === 0 ? (
          <p className="text-xs text-alecia-silver text-center py-2">
            Aucun preset
          </p>
        ) : (
          presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center gap-2 p-2 rounded hover:bg-alecia-silver/5"
            >
              <button
                onClick={() => onLoad(preset)}
                className="flex-1 text-left text-sm text-alecia-navy"
              >
                {preset.name}
              </button>
              <span className="text-xs text-alecia-silver">
                {preset.variables.length} variables
              </span>
              {preset.isDefault && (
                <Star className="w-3 h-3 text-alecia-red fill-alecia-red" />
              )}
              <button
                onClick={() => handleSetDefault(preset)}
                className="p-1 hover:bg-alecia-silver/10 rounded"
                title="Définir par défaut"
              >
                <Star className="w-3 h-3 text-alecia-silver" />
              </button>
              <button
                onClick={() => handleDelete(preset.id)}
                className="p-1 hover:bg-alecia-red/10 rounded"
              >
                <Trash2 className="w-3 h-3 text-alecia-red" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
