import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Variable,
  Plus,
  Trash2,
  Edit2,
  Search,
  Database,
  Type,
  Hash,
  Calendar,
  ToggleLeft,
  DollarSign,
  Percent,
  ChevronDown,
  Download,
  Upload,
} from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { Badge } from './Badge';
import { Modal } from './Modal';
import { Tooltip } from './Tooltip';
import { Tabs } from './Tabs';

export type VariableType = 'text' | 'number' | 'date' | 'boolean' | 'currency' | 'percentage';

export interface VariableItem {
  id: string;
  name: string;
  key: string;
  value: string | number | boolean;
  type: VariableType;
  description?: string;
  isUsed?: boolean;
  usageCount?: number;
  category?: string;
}

export interface VariableEditorProps {
  variables?: VariableItem[];
  onVariableAdd?: (variable: Omit<VariableItem, 'id'>) => void;
  onVariableUpdate?: (id: string, updates: Partial<VariableItem>) => void;
  onVariableDelete?: (id: string) => void;
  onVariablesImport?: (variables: VariableItem[]) => void;
  onVariablesExport?: () => void;
  categories?: string[];
}

const typeIcons: Record<VariableType, React.ReactNode> = {
  text: <Type className="w-4 h-4" />,
  number: <Hash className="w-4 h-4" />,
  date: <Calendar className="w-4 h-4" />,
  boolean: <ToggleLeft className="w-4 h-4" />,
  currency: <DollarSign className="w-4 h-4" />,
  percentage: <Percent className="w-4 h-4" />,
};

const typeLabels: Record<VariableType, string> = {
  text: 'Texte',
  number: 'Nombre',
  date: 'Date',
  boolean: 'Booléen',
  currency: 'Devise',
  percentage: 'Pourcentage',
};

const typeColors: Record<VariableType, string> = {
  text: 'bg-blue-500/20 text-blue-400',
  number: 'bg-green-500/20 text-green-400',
  date: 'bg-purple-500/20 text-purple-400',
  boolean: 'bg-yellow-500/20 text-yellow-400',
  currency: 'bg-emerald-500/20 text-emerald-400',
  percentage: 'bg-orange-500/20 text-orange-400',
};

export const VariableEditor: React.FC<VariableEditorProps> = ({
  variables = [],
  onVariableAdd,
  onVariableUpdate,
  onVariableDelete,
  onVariablesImport,
  onVariablesExport,
  categories = ['Général', 'Financier', 'Client', 'Projet'],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVariable, setEditingVariable] = useState<VariableItem | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const [newVariable, setNewVariable] = useState<Partial<VariableItem>>({
    name: '',
    key: '',
    value: '',
    type: 'text',
    description: '',
    category: 'Général',
  });

  const filteredVariables = variables.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(v.value).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'used' && v.isUsed) ||
      (activeTab === 'unused' && !v.isUsed);
    return matchesSearch && matchesCategory && matchesTab;
  });

  const handleAddVariable = () => {
    if (newVariable.name && newVariable.key) {
      onVariableAdd?.(newVariable as Omit<VariableItem, 'id'>);
      setNewVariable({
        name: '',
        key: '',
        value: '',
        type: 'text',
        description: '',
        category: 'Général',
      });
      setIsAddModalOpen(false);
    }
  };

  const handleUpdateVariable = () => {
    if (editingVariable) {
      onVariableUpdate?.(editingVariable.id, editingVariable);
      setEditingVariable(null);
    }
  };

  const generateKey = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  };

  const tabs = [
    { id: 'all', label: 'Toutes', badge: variables.length },
    { id: 'used', label: 'Utilisées', badge: variables.filter((v) => v.isUsed).length },
    { id: 'unused', label: 'Non utilisées', badge: variables.filter((v) => !v.isUsed).length },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-[#1e3a5f]">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-[#e91e63]" />
          <h2 className="text-lg font-semibold text-white">Variables</h2>
          <Badge variant="default" size="sm">
            {variables.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content="Importer" position="bottom">
            <button
              onClick={() => onVariablesImport?.([])}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Exporter" position="bottom">
            <button
              onClick={onVariablesExport}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </Tooltip>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Nouvelle variable
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-[#1e3a5f] space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher une variable..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </div>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-[#0d1a2d] border border-[#1e3a5f] text-gray-300 text-sm rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-[#e91e63]"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
          size="sm"
        />
      </div>

      {/* Variables List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {filteredVariables.map((variable, index) => (
              <motion.div
                key={variable.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
                className="group bg-[#111d2e] rounded-xl p-4 border border-[#1e3a5f]/50 hover:border-[#3a5a7f] transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Type Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[variable.type]}`}
                  >
                    {typeIcons[variable.type]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{variable.name}</span>
                      <code className="text-xs text-gray-500 bg-[#0d1a2d] px-1.5 py-0.5 rounded">
                        {'{{' + variable.key + '}}'}
                      </code>
                      {variable.isUsed && (
                        <Badge variant="success" size="sm" dot>
                          Utilisée
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-[#e91e63] font-mono">
                        {String(variable.value)}
                      </span>
                      {variable.category && (
                        <Badge variant="outline" size="sm">
                          {variable.category}
                        </Badge>
                      )}
                      {variable.usageCount !== undefined && variable.usageCount > 0 && (
                        <span className="text-xs text-gray-500">
                          {variable.usageCount} utilisation{variable.usageCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip content="Modifier" position="left">
                      <button
                        onClick={() => setEditingVariable(variable)}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Supprimer" position="left">
                      <button
                        onClick={() => onVariableDelete?.(variable.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredVariables.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Variable className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">Aucune variable trouvée</p>
            <p className="text-sm mt-1">Créez votre première variable pour commencer</p>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4"
            >
              Nouvelle variable
            </Button>
          </div>
        )}
      </div>

      {/* Add Variable Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Nouvelle variable"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Nom"
            placeholder="Nom de la variable"
            value={newVariable.name}
            onChange={(e) => {
              const name = e.target.value;
              setNewVariable((prev) => ({
                ...prev,
                name,
                key: generateKey(name),
              }));
            }}
            fullWidth
          />
          <Input
            label="Clé"
            placeholder="cle_variable"
            value={newVariable.key}
            onChange={(e) => setNewVariable((prev) => ({ ...prev, key: e.target.value }))}
            helperText="Utilisée dans les templates : {{cle_variable}}"
            fullWidth
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(typeLabels) as VariableType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setNewVariable((prev) => ({ ...prev, type }))}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg border transition-all
                    ${
                      newVariable.type === type
                        ? 'border-[#e91e63] bg-[#e91e63]/10 text-white'
                        : 'border-[#1e3a5f] text-gray-400 hover:border-[#3a5a7f]'
                    }
                  `}
                >
                  {typeIcons[type]}
                  <span className="text-sm">{typeLabels[type]}</span>
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Valeur par défaut"
            placeholder="Valeur"
            value={String(newVariable.value || '')}
            onChange={(e) => setNewVariable((prev) => ({ ...prev, value: e.target.value }))}
            fullWidth
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
            <select
              value={newVariable.category}
              onChange={(e) => setNewVariable((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full bg-[#0d1a2d] border border-[#1e3a5f] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#e91e63]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Description (optionnel)"
            placeholder="Description de la variable"
            value={newVariable.description || ''}
            onChange={(e) => setNewVariable((prev) => ({ ...prev, description: e.target.value }))}
            fullWidth
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddVariable}>Créer la variable</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Variable Modal */}
      <Modal
        isOpen={!!editingVariable}
        onClose={() => setEditingVariable(null)}
        title="Modifier la variable"
        size="md"
      >
        {editingVariable && (
          <div className="space-y-4">
            <Input
              label="Nom"
              value={editingVariable.name}
              onChange={(e) =>
                setEditingVariable((prev) => (prev ? { ...prev, name: e.target.value } : null))
              }
              fullWidth
            />
            <Input
              label="Valeur"
              value={String(editingVariable.value)}
              onChange={(e) =>
                setEditingVariable((prev) => (prev ? { ...prev, value: e.target.value } : null))
              }
              fullWidth
            />
            <Input
              label="Description"
              value={editingVariable.description || ''}
              onChange={(e) =>
                setEditingVariable((prev) =>
                  prev ? { ...prev, description: e.target.value } : null
                )
              }
              fullWidth
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setEditingVariable(null)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateVariable}>Enregistrer</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VariableEditor;
