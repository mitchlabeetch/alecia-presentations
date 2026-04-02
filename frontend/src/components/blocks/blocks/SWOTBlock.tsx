import type { BlockContent, SWOTData } from '@/types';

interface SWOTBlockProps {
  content: BlockContent;
  data?: { swot?: SWOTData } | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function SWOTBlock({ content, data, isEditing = false, onChange }: SWOTBlockProps) {
  const swot = data?.swot || {
    strengths: ['Force 1', 'Force 2'],
    weaknesses: ['Faiblesse 1', 'Faiblesse 2'],
    opportunities: ['Opportunité 1', 'Opportunité 2'],
    threats: ['Menace 1', 'Menace 2'],
  };

  const SWOT_COLORS = {
    strengths: 'bg-green-500',
    weaknesses: 'bg-alecia-red',
    opportunities: 'bg-blue-500',
    threats: 'bg-yellow-500',
  };

  const SWOT_LABELS = {
    strengths: 'FORCES',
    weaknesses: 'FAIBLESSES',
    opportunities: 'OPPORTUNITÉS',
    threats: 'MENACES',
  };

  const SWOT_KEYS = ['strengths', 'weaknesses', 'opportunities', 'threats'] as const;

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <h3 className="text-xl font-bold text-alecia-navy mb-6 text-center">ANALYSE SWOT</h3>
        <div className="grid grid-cols-2 gap-4">
          {SWOT_KEYS.map((key) => (
            <div key={key} className={`${SWOT_COLORS[key]}/10 rounded-xl p-4 border-2 ${SWOT_COLORS[key]}/30`}>
              <h4 className={`font-bold text-alecia-navy mb-3`}>{SWOT_LABELS[key]}</h4>
              <ul className="space-y-2">
                {swot[key].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-alecia-navy">
                    <span className="text-alecia-red font-bold">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6 text-center">ANALYSE SWOT</h3>
      <div className="grid grid-cols-2 gap-4">
        {SWOT_KEYS.map((key) => (
          <div key={key} className={`${SWOT_COLORS[key]}/10 rounded-xl p-4 border-2 ${SWOT_COLORS[key]}/30`}>
            <h4 className="font-bold text-alecia-navy mb-3">{SWOT_LABELS[key]}</h4>
            <ul className="space-y-2">
              {swot[key].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-alecia-navy">
                  <span className="text-alecia-red font-bold">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
