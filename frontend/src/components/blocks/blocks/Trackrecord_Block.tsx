import type { BlockContent } from '@/types';

interface Trackrecord_BlockProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Trackrecord_Block({ content, isEditing = false, onChange }: Trackrecord_BlockProps) {
  const deals = [
    { year: 2023, company: 'Société Alpha', type: 'Cession', amount: '50M€' },
    { year: 2022, company: 'Groupe Beta', type: 'Acquisition', amount: '120M€' },
    { year: 2021, company: 'Industrie Gamma', type: 'LBO', amount: '80M€' },
  ];

  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6">Track Record</h3>
      <div className="space-y-4">
        {deals.map((deal, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-alecia-silver/5 rounded-xl">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-alecia-red">{deal.year}</span>
              <div>
                <p className="font-medium text-alecia-navy">{deal.company}</p>
                <p className="text-sm text-alecia-silver">{deal.type}</p>
              </div>
            </div>
            <span className="text-xl font-bold text-alecia-navy">{deal.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
