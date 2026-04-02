import { useState } from 'react';
import { X, Plus, Upload, Search, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { VariableRow } from './VariableRow';
import type { Variable, VariablePreset } from '@/types';

interface VariablePanelProps {
  onClose?: () => void;
}

export function VariablePanel({ onClose }: VariablePanelProps) {
  const variables = useAppStore((state) => state.variables);
  const variablePresets = useAppStore((state) => state.variablePresets);
  const addVariable = useAppStore((state) => state.addVariable);
  const updateVariable = useAppStore((state) => state.updateVariable);
  const deleteVariable = useAppStore((state) => state.deleteVariable);
  const setVariablePreset = useAppStore((state) => state.setVariablePreset);

  const [searchQuery, setSearchQuery] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [showNewPresetForm, setShowNewPresetForm] = useState(false);

  const handleAddVariable = () => {
    addVariable({
      name: '',
      value: '',
      type: 'text',
      description: '',
    });
  };

  const handleDeleteVariable = (id: string) => {
    // Ne pas supprimer les variables système (v1-v9)
    if (id.startsWith('v') && /^\d+$/.test(id.substring(1))) {
      return;
    }
    deleteVariable(id);
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;

    const customVars = variables.filter((v) => !v.id.startsWith('v') || !/^\d+$/.test(v.id.substring(1)));
    const preset: VariablePreset = {
      id: `preset-${Date.now()}`,
      projectId: null,
      name: newPresetName.trim(),
      variables: variables,
      isDefault: false,
      createdAt: Date.now(),
    };

    setVariablePreset(preset);
    setNewPresetName('');
    setShowNewPresetForm(false);
  };

  const handleLoadPreset = (preset: VariablePreset) => {
    // Mettre à jour les valeurs des variables existantes avec le preset
    preset.variables.forEach((pv) => {
      const existing = variables.find((v) => v.name === pv.name);
      if (existing) {
        updateVariable(existing.id, { value: pv.value });
      }
    });
  };

  const handleDeletePreset = (presetId: string) => {
    setVariablePreset(null);
  };

  const filteredVariables = variables.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const isSystemVariable = (id: string): boolean => {
    return id.startsWith('v') && /^\d+$/.test(id.substring(1));
  };

  return (
    <div className="w-80 h-full bg-white border-l border-alecia-silver/20 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-alecia-silver/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-alecia-navy">Variables</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-alecia-silver/10 rounded transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-alecia-silver" />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-alecia-silver" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="alecia-input pl-9 text-sm"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddVariable}
            className="alecia-btn-primary flex items-center justify-center gap-2 text-sm flex-1"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="alecia-btn-secondary flex items-center justify-center gap-2 text-sm px-3"
            title="Presets"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Presets section */}
      {showPresets && (
        <div className="border-b border-alecia-silver/20 p-4 bg-alecia-silver/5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-alecia-navy">Presets</h4>
              <button
                onClick={() => setShowNewPresetForm(!showNewPresetForm)}
                className="p-1 hover:bg-alecia-silver/10 rounded transition-colors"
              >
                <Plus className="w-4 h-4 text-alecia-navy" />
              </button>
            </div>

            {showNewPresetForm && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="Nom du preset..."
                  className="alecia-input text-sm flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                />
                <button
                  onClick={handleSavePreset}
                  className="alecia-btn-primary text-sm px-3"
                >
                  Sauvegarder
                </button>
              </div>
            )}

            <div className="space-y-1 max-h-32 overflow-y-auto">
              {variablePresets.length === 0 ? (
                <p className="text-xs text-alecia-silver text-center py-2">
                  Aucun preset
                </p>
              ) : (
                variablePresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-white/50 transition-colors"
                  >
                    <button
                      onClick={() => handleLoadPreset(preset)}
                      className="flex-1 text-left text-sm text-alecia-navy"
                    >
                      {preset.name}
                    </button>
                    <span className="text-xs text-alecia-silver">
                      {preset.variables.length}
                    </span>
                    <button
                      onClick={() => handleDeletePreset(preset.id)}
                      className="p-1 hover:bg-alecia-red/10 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-alecia-red" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Variables list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {filteredVariables.length === 0 ? (
          <div className="text-center py-8 text-alecia-silver">
            {searchQuery ? 'Aucune variable correspondante' : 'Aucune variable'}
          </div>
        ) : (
          filteredVariables.map((variable) => (
            <VariableRow
              key={variable.id}
              variable={variable}
              onUpdate={updateVariable}
              onDelete={handleDeleteVariable}
              isSystem={isSystemVariable(variable.id)}
            />
          ))
        )}
      </div>

      {/* Footer with variable count */}
      <div className="p-3 border-t border-alecia-silver/20 bg-alecia-silver/5">
        <p className="text-xs text-alecia-silver text-center">
          {variables.length} variable{variables.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
