import type { BlockContent, TimelineItem } from '@/types';
import { Pencil } from 'lucide-react';

interface Key_MetricsProps {
  content: BlockContent;
  data?: { kpis?: { id: string; label: string; value: string | number; unit?: string; description?: string }[] } | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Key_Metrics({ content, data, isEditing = false, onChange }: Key_MetricsProps) {
  const metrics = data?.kpis || [];

  // Ces blocs affichent des donnees - edition limitee
  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <h3 className="text-xl font-bold text-alecia-navy mb-6">Metriques cles</h3>
        <div className="mb-4 flex items-center gap-2 text-sm text-alecia-silver">
          <Pencil className="w-4 h-4" />
          <span>Les donnees de metriques doivent etre modifiees via le panneau de configuration</span>
        </div>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-alecia-silver/5 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-alecia-silver">{metric.label}</span>
                <span className="text-xs text-alecia-silver">{metric.description}</span>
              </div>
              <div className="text-3xl font-bold text-alecia-navy">
                {metric.value}
                {metric.unit && <span className="text-lg font-normal ml-1">{metric.unit}</span>}
              </div>
            </div>
          ))}
        </div>
        {metrics.length === 0 && (
          <p className="text-alecia-silver text-center">Aucune metrique definie</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6">Metriques cles</h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-alecia-silver/5 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-alecia-silver">{metric.label}</span>
              {metric.description && (
                <span className="text-xs text-alecia-silver">{metric.description}</span>
              )}
            </div>
            <div className="text-3xl font-bold text-alecia-navy">
              {metric.value}
              {metric.unit && <span className="text-lg font-normal ml-1">{metric.unit}</span>}
            </div>
          </div>
        ))}
      </div>
      {metrics.length === 0 && (
        <p className="text-alecia-silver text-center">Aucune metrique definie</p>
      )}
    </div>
  );
}