import type { BlockContent, ChartData } from '@/types';
import { Pencil } from 'lucide-react';

interface Chart_BlockProps {
  content: BlockContent;
  data?: { chartData?: ChartData } | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Chart_Block({ content, data, isEditing = false, onChange }: Chart_BlockProps) {
  const chartData = data?.chartData;

  if (!chartData) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <p className="text-alecia-silver text-center">Aucune donnee de graphique</p>
      </div>
    );
  }

  // Simple bar chart rendering
  const maxValue = Math.max(...chartData.datasets.flatMap((d) => d.data));

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <h3 className="text-lg font-semibold text-alecia-navy mb-4 flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          Graphique
        </h3>
        <div className="mb-4 flex items-center gap-2 text-sm text-alecia-silver">
          <span>Les donnees de graphique doivent etre modifiees via le panneau de configuration</span>
        </div>
        <div className="flex items-end gap-4 h-64">
          {chartData.labels.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-alecia-navy/50 rounded-t"
                style={{
                  height: `${(chartData.datasets[0]?.data[i] || 0) / maxValue * 100}%`,
                }}
              />
              <span className="text-xs text-alecia-silver mt-2">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <h3 className="text-lg font-semibold text-alecia-navy mb-4">Graphique</h3>
      <div className="flex items-end gap-4 h-64">
        {chartData.labels.map((label, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-alecia-navy rounded-t transition-all hover:bg-alecia-red"
              style={{
                height: `${(chartData.datasets[0]?.data[i] || 0) / maxValue * 100}%`,
              }}
            />
            <span className="text-xs text-alecia-silver mt-2">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {chartData.datasets.map((dataset, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: dataset.borderColor || '#061a40' }}
            />
            <span className="text-xs text-alecia-silver">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}