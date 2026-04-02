import type { BlockContent } from '@/types';

interface Advisor_ListProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Advisor_List({ content, isEditing = false, onChange }: Advisor_ListProps) {
  const advisors = [
    { name: 'Cabinet Alpha', role: 'Conseil juridique' },
    { name: 'Banque Beta', role: 'Conseil financier' },
    { name: 'Expert Comptable Gamma', role: 'Due diligence financière' },
  ];

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <h3 className="text-xl font-bold text-alecia-navy mb-6">Conseillers</h3>
        <div className="space-y-4">
          {advisors.map((advisor, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-alecia-silver/5 rounded-xl">
              <div className="w-12 h-12 bg-alecia-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-white">{advisor.name[0]}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-alecia-navy">{advisor.name}</p>
                <p className="text-sm text-alecia-silver">{advisor.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6">Conseillers</h3>
      <div className="space-y-4">
        {advisors.map((advisor, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-alecia-silver/5 rounded-xl">
            <div className="w-12 h-12 bg-alecia-navy rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-white">{advisor.name[0]}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-alecia-navy">{advisor.name}</p>
              <p className="text-sm text-alecia-silver">{advisor.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
