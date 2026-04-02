import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Pencil, Plus, Check, X } from 'lucide-react';
import type { BlockContent, KPI, SlideData } from '@/types';

interface KPI_CardProps {
  content: BlockContent;
  data?: SlideData | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function KPI_Card({ content, data, isEditing = false, onChange }: KPI_CardProps) {
  const kpis = data?.kpis || content.kpis || [];
  const [editingKpiId, setEditingKpiId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ label: '', value: '', unit: '', change: '' });

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-alecia-red" />;
      default:
        return <Minus className="w-4 h-4 text-alecia-silver" />;
    }
  };

  const addKpi = () => {
    const newKpi: KPI = {
      id: `kpi-${Date.now()}`,
      label: 'Nouvel indicateur',
      value: '0',
      unit: '',
      change: 0,
      trend: 'neutral',
    };
    if (onChange) {
      const newKpis = [...kpis, newKpi];
      onChange({ ...content, kpis: newKpis });
      // Demarrer l'edition du nouveau KPI
      startEditing(newKpi.id, { label: newKpi.label, value: newKpi.value, unit: newKpi.unit, change: '' });
    }
  };

  const updateKpi = (id: string, updates: Partial<KPI>) => {
    if (onChange) {
      onChange({
        ...content,
        kpis: kpis.map((kpi) => (kpi.id === id ? { ...kpi, ...updates } : kpi)),
      });
    }
  };

  const removeKpi = (id: string) => {
    if (onChange) {
      onChange({ ...content, kpis: kpis.filter((kpi) => kpi.id !== id) });
    }
  };

  const startEditing = (id: string, current: { label: string; value: string; unit: string; change: string }) => {
    setEditingKpiId(id);
    setEditValues({ ...current, value: String(current.value), change: String(current.change) });
  };

  const saveEditing = () => {
    if (editingKpiId) {
      updateKpi(editingKpiId, {
        label: editValues.label,
        value: editValues.value,
        unit: editValues.unit,
        change: editValues.change ? parseFloat(editValues.change) : undefined,
      });
    }
    setEditingKpiId(null);
  };

  const cancelEditing = () => {
    setEditingKpiId(null);
    setEditValues({ label: '', value: '', unit: '', change: '' });
  };

  // Mode edition inline - chaque KPI editable
  const renderKpi = (kpi: KPI) => {
    const isKpiEditing = editingKpiId === kpi.id;

    if (isKpiEditing) {
      return (
        <div key={kpi.id} className="bg-white border-2 border-alecia-red rounded-lg p-4 space-y-2 shadow-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={editValues.label}
              onChange={(e) => setEditValues({ ...editValues, label: e.target.value })}
              className="flex-1 text-sm text-alecia-navy bg-transparent border border-alecia-silver/30 rounded px-2 py-1 outline-none"
              placeholder="Label"
              autoFocus
            />
            <button onClick={saveEditing} className="p-1 hover:bg-green-100 rounded">
              <Check className="w-4 h-4 text-green-600" />
            </button>
            <button onClick={cancelEditing} className="p-1 hover:bg-red-100 rounded">
              <X className="w-4 h-4 text-alecia-red" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={editValues.value}
              onChange={(e) => setEditValues({ ...editValues, value: e.target.value })}
              className="flex-1 text-2xl font-bold text-alecia-navy bg-transparent border border-alecia-silver/30 rounded px-2 py-1 outline-none"
              placeholder="Valeur"
            />
            <input
              type="text"
              value={editValues.unit}
              onChange={(e) => setEditValues({ ...editValues, unit: e.target.value })}
              className="w-20 text-sm text-alecia-silver bg-transparent border border-alecia-silver/30 rounded px-2 py-1 outline-none"
              placeholder="Unit"
            />
          </div>
          <input
            type="text"
            value={editValues.change}
            onChange={(e) => setEditValues({ ...editValues, change: e.target.value })}
            className="w-full text-xs text-alecia-silver bg-transparent border border-alecia-silver/30 rounded px-2 py-1 outline-none"
            placeholder="Variation % (ex: +5)"
          />
        </div>
      );
    }

    return (
      <div
        key={kpi.id}
        className="bg-alecia-silver/5 rounded-lg p-4 group hover:bg-alecia-silver/10 transition-colors"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-alecia-silver">{kpi.label}</p>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => startEditing(kpi.id, { label: kpi.label, value: String(kpi.value), unit: kpi.unit || '', change: kpi.change !== undefined ? String(kpi.change) : '' })}
              className="p-1 hover:bg-alecia-red/10 rounded"
            >
              <Pencil className="w-3 h-3 text-alecia-red" />
            </button>
            <button
              onClick={() => removeKpi(kpi.id)}
              className="p-1 hover:bg-alecia-red/10 rounded"
            >
              <X className="w-3 h-3 text-alecia-red" />
            </button>
          </div>
        </div>
        <p className="text-2xl font-bold text-alecia-navy mt-1">
          {kpi.value}
          {kpi.unit && <span className="text-lg font-normal text-alecia-silver ml-1">{kpi.unit}</span>}
        </p>
        {kpi.change !== undefined && (
          <p className={`text-xs mt-1 ${kpi.change >= 0 ? 'text-green-500' : 'text-alecia-red'}`}>
            {kpi.change >= 0 ? '+' : ''}{kpi.change}%
          </p>
        )}
        {getTrendIcon(kpi.trend)}
      </div>
    );
  };

  // Mode d'edition global
  if (isEditing && !editingKpiId) {
    return (
      <div className="w-full h-full p-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-alecia-red">
          <Pencil className="w-4 h-4" />
          <span>Cliquez sur le crayon pour editer un indicateur</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {kpis.map(renderKpi)}
        </div>
        <button
          onClick={addKpi}
          className="mt-4 flex items-center gap-2 text-sm text-alecia-red hover:underline"
        >
          <Plus className="w-4 h-4" />
          Ajouter un indicateur
        </button>
      </div>
    );
  }

  // Mode affichage
  return (
    <div className="w-full h-full p-8">
      <h3 className="text-lg font-semibold text-alecia-navy mb-4">Indicateurs cles</h3>
      <div className="grid grid-cols-2 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="bg-alecia-silver/5 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-alecia-silver">{kpi.label}</p>
              {getTrendIcon(kpi.trend)}
            </div>
            <p className="text-2xl font-bold text-alecia-navy mt-1">
              {kpi.value}
              {kpi.unit && <span className="text-lg font-normal text-alecia-silver ml-1">{kpi.unit}</span>}
            </p>
            {kpi.change !== undefined && (
              <p className={`text-xs mt-1 ${kpi.change >= 0 ? 'text-green-500' : 'text-alecia-red'}`}>
                {kpi.change >= 0 ? '+' : ''}{kpi.change}%
              </p>
            )}
          </div>
        ))}
      </div>
      {kpis.length === 0 && (
        <p className="text-alecia-silver text-center">
          Aucun indicateur defini | Mode edition pour ajouter
        </p>
      )}
    </div>
  );
}