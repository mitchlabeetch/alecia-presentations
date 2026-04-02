import { useState, useEffect } from 'react';
import { X, Plus, Save, Download, Upload, Search, Trash2 } from 'lucide-react';
import { VariableRow } from './VariableRow';
import { PresetManager } from './PresetManager';
import { BulkReplaceModal } from './BulkReplaceModal';
import type { Variable, VariablePreset } from '@/types';

interface VariablePanelProps {
  projectId: string;
  onClose?: () => void;
}

const SYSTEM_VARIABLES: Variable[] = [
  { id: 'sys-1', name: 'client_name', value: '', type: 'text', description: 'Nom du client' },
  { id: 'sys-2', name: 'client_sector', value: '', type: 'text', description: 'Secteur du client' },
  { id: 'sys-3', name: 'deal_amount', value: '', type: 'currency', description: 'Montant de la transaction' },
  { id: 'sys-4', name: 'ebitda', value: '', type: 'currency', description: 'EBITDA' },
  { id: 'sys-5', name: 'ebitda_multiple', value: '', type: 'number', description: 'Multiple EBITDA' },
  { id: 'sys-6', name: 'advisor_name', value: '', type: 'text', description: 'Nom du conseiller' },
  { id: 'sys-7', name: 'target_company', value: '', type: 'text', description: 'Entreprise cible' },
  { id: 'sys-8', name: 'date', value: '', type: 'date', description: 'Date' },
  { id: 'sys-9', name: 'confidentiality_level', value: 'Strictement confidentiel', type: 'text', description: 'Niveau de confidentialité' },
];

export function VariablePanel({ projectId, onClose }: VariablePanelProps) {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [presets, setPresets] = useState<VariablePreset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBulkReplace, setShowBulkReplace] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVariables();
    fetchPresets();
  }, [projectId]);

  const fetchVariables = async () => {
    try {
      const response = await fetch(`/api/variables?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        const allVars = [...SYSTEM_VARIABLES];
        data.forEach((preset: VariablePreset) => {
          preset.variables.forEach((v: Variable) => {
            if (!allVars.find((sv) => sv.name === v.name)) {
              allVars.push(v);
            }
          });
        });
        setVariables(allVars);
      }
    } catch (error) {
      console.error('Failed to fetch variables:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPresets = async () => {
    try {
      const response = await fetch(`/api/variables?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setPresets(data);
      }
    } catch (error) {
      console.error('Failed to fetch presets:', error);
    }
  };

  const handleUpdateVariable = (id: string, updates: Partial<Variable>) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const handleDeleteVariable = (id: string) => {
    setVariables((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAddVariable = () => {
    const newVar: Variable = {
      id: `custom-${Date.now()}`,
      name: '',
      value: '',
      type: 'text',
    };
    setVariables((prev) => [...prev, newVar]);
  };

  const handleSavePreset = async (name: string) => {
    try {
      const customVars = variables.filter((v) => v.id.startsWith('custom-'));
      await fetch('/api/variables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name,
          variables: customVars,
          isDefault: false,
        }),
      });
      fetchPresets();
    } catch (error) {
      console.error('Failed to save preset:', error);
    }
  };

  const handleLoadPreset = (preset: VariablePreset) => {
    setVariables((prev) => {
      const updated = [...prev];
      preset.variables.forEach((pv) => {
        const existing = updated.find((v) => v.name === pv.name);
        if (existing) {
          existing.value = pv.value;
        } else {
          updated.push({ ...pv, id: `loaded-${Date.now()}-${pv.name}` });
        }
      });
      return updated;
    });
  };

  const filteredVariables = variables.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 h-full bg-white border-l border-alecia-silver/20 flex flex-col">
      <div className="p-4 border-b border-alecia-silver/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-alecia-navy">Variables</h3>
          <button onClick={onClose} className="p-1 hover:bg-alecia-silver/10 rounded">
            <X className="w-5 h-5 text-alecia-silver" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-alecia-silver" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="alecia-input pl-9"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddVariable}
            className="flex-1 alecia-btn-primary flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
          <button
            onClick={() => setShowBulkReplace(true)}
            className="alecia-btn-secondary flex items-center justify-center gap-2 text-sm"
            title="Remplacer en masse"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="alecia-btn-secondary flex items-center justify-center gap-2 text-sm"
            title="Presets"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showPresets && (
        <div className="border-b border-alecia-silver/20 p-4 bg-alecia-silver/5">
          <PresetManager
            presets={presets}
            onSave={handleSavePreset}
            onLoad={handleLoadPreset}
            onDelete={fetchPresets}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="text-center py-8 text-alecia-silver">Chargement...</div>
        ) : filteredVariables.length === 0 ? (
          <div className="text-center py-8 text-alecia-silver">
            Aucune variable
          </div>
        ) : (
          filteredVariables.map((variable) => (
            <VariableRow
              key={variable.id}
              variable={variable}
              onUpdate={handleUpdateVariable}
              onDelete={handleDeleteVariable}
              isSystem={variable.id.startsWith('sys-')}
            />
          ))
        )}
      </div>

      {showBulkReplace && (
        <BulkReplaceModal
          projectId={projectId}
          variables={variables}
          onClose={() => setShowBulkReplace(false)}
        />
      )}
    </div>
  );
}
