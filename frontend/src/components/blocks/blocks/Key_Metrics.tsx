import type { BlockContent, KPI } from '@/types';

interface Key_MetricsProps {
  content: BlockContent;
  data?: { kpis?: KPI[] } | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Key_Metrics({ content, data, isEditing = false, onChange }: Key_MetricsProps) {
  const metrics = data?.kpis || [];

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <h3 className="text-xl font-bold text-alecia-navy mb-6">Métriques clés</h3>
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
          <p className="text-alecia-silver text-center">Aucune métrique définie</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6">Métriques clés</h3>
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
        <p className="text-alecia-silver text-center">Aucune métrique définie</p>
      )}
    </div>
  );
}
