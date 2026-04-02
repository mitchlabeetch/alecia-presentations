import type { BlockContent, Section } from '@/types';

interface SectionNavigatorProps {
  content: BlockContent;
  data?: { sections?: Section[] } | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export function SectionNavigator({ content, data, isEditing = false, onChange }: SectionNavigatorProps) {
  const sections = data?.sections || [];

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <h2 className="text-2xl font-bold text-alecia-navy mb-6">SOMMAIRE</h2>
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={section.id} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-alecia-red rounded-full flex items-center justify-center text-white font-bold">
                {ROMAN_NUMERALS[index] || index + 1}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={section.title}
                  className="w-full text-alecia-navy bg-transparent border-b border-alecia-silver/20 focus:border-alecia-red outline-none"
                  placeholder="Titre de la section"
                />
              </div>
            </div>
          ))}
        </div>
        {sections.length === 0 && (
          <p className="text-alecia-silver text-center">Aucune section définie</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <h2 className="text-2xl font-bold text-alecia-navy mb-6">SOMMAIRE</h2>
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.id} className="flex items-center gap-4">
            <div className="w-12 h-12 bg-alecia-red rounded-full flex items-center justify-center text-white font-bold">
              {ROMAN_NUMERALS[index] || index + 1}
            </div>
            <div className="flex-1 border-b border-alecia-silver/20 pb-2">
              <span className="text-alecia-navy font-medium">{section.title}</span>
            </div>
          </div>
        ))}
      </div>
      {sections.length === 0 && (
        <p className="text-alecia-silver text-center">Aucune section définie</p>
      )}
    </div>
  );
}
