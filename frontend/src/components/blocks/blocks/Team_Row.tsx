import type { BlockContent } from '@/types';

interface Team_RowProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Team_Row({ content, isEditing = false, onChange }: Team_RowProps) {
  const members = [
    { name: 'Jean Dupont', role: 'Directeur général' },
    { name: 'Marie Martin', role: 'Directrice financière' },
    { name: 'Pierre Leroy', role: 'Directeur technique' },
  ];

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <h3 className="text-xl font-bold text-alecia-navy mb-6">Équipe</h3>
        <div className="space-y-3">
          {members.map((member, index) => (
            <div key={index} className="flex items-center gap-4 bg-alecia-silver/5 rounded-lg p-3">
              <div className="w-10 h-10 bg-alecia-navy rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-alecia-navy">{member.name}</p>
                <p className="text-sm text-alecia-silver">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6">Équipe</h3>
      <div className="space-y-3">
        {members.map((member, index) => (
          <div key={index} className="flex items-center gap-4 bg-alecia-silver/5 rounded-lg p-3">
            <div className="w-10 h-10 bg-alecia-navy rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-alecia-navy">{member.name}</p>
              <p className="text-sm text-alecia-silver">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
