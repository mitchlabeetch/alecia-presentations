import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { BlockContent, KPI, SlideData } from '@/types';

interface KPI_CardProps {
  content: BlockContent;
  data?: SlideData | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function KPI_Card({ content, data, isEditing = false, onChange }: KPI_CardProps) {
  const kpis = data?.kpis || [];

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

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <h3 className="text-lg font-semibold text-alecia-navy mb-4">Indicateurs clés</h3>
        <div className="grid grid-cols-2 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.id} className="bg-alecia-silver/5 rounded-lg p-4">
              <p className="text-sm text-alecia-silver">{kpi.label}</p>
              <p className="text-2xl font-bold text-alecia-navy mt-1">
                {kpi.value} {kpi.unit}
              </p>
            </div>
          ))}
        </div>
        {kpis.length === 0 && (
          <p className="text-alecia-silver text-center">Aucun indicateur défini</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <h3 className="text-lg font-semibold text-alecia-navy mb-4">Indicateurs clés</h3>
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
        <p className="text-alecia-silver text-center">Aucun indicateur défini</p>
      )}
    </div>
  );
}
