import type { BlockContent } from '@/types';

interface Team_GridProps {
  content: BlockContent;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Team_Grid({ content, isEditing = false, onChange }: Team_GridProps) {
  const members = [
    { name: 'Jean Dupont', role: 'Directeur général', email: 'jean.dupont@entreprise.com' },
    { name: 'Marie Martin', role: 'Directrice financière', email: 'marie.martin@entreprise.com' },
    { name: 'Pierre Leroy', role: 'Directeur technique', email: 'pierre.leroy@entreprise.com' },
    { name: 'Sophie Bernard', role: 'Directrice juridique', email: 'sophie.bernard@entreprise.com' },
  ];

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <h3 className="text-xl font-bold text-alecia-navy mb-6">Équipe dirigeante</h3>
        <div className="grid grid-cols-2 gap-6">
          {members.map((member, index) => (
            <div key={index} className="bg-alecia-silver/5 rounded-xl p-4">
              <div className="w-16 h-16 bg-alecia-navy rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-white">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h4 className="font-semibold text-alecia-navy text-center">{member.name}</h4>
              <p className="text-sm text-alecia-silver text-center">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6">Équipe dirigeante</h3>
      <div className="grid grid-cols-2 gap-6">
        {members.map((member, index) => (
          <div key={index} className="bg-alecia-silver/5 rounded-xl p-4">
            <div className="w-16 h-16 bg-alecia-navy rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-white">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h4 className="font-semibold text-alecia-navy text-center">{member.name}</h4>
            <p className="text-sm text-alecia-silver text-center">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
