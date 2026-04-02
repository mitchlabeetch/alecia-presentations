import type { BlockContent, TimelineItem } from '@/types';
import { Pencil } from 'lucide-react';

interface Timeline_BlockProps {
  content: BlockContent;
  data?: { timeline?: TimelineItem[] } | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Timeline_Block({ content, data, isEditing = false, onChange }: Timeline_BlockProps) {
  const timeline = data?.timeline || [];

  // Ces blocs affichent des donnees - edition limitee
  if (isEditing) {
    return (
      <div className="w-full h-full p-8 overflow-auto">
        <h3 className="text-lg font-semibold text-alecia-navy mb-6">Chronologie</h3>
        <div className="mb-4 flex items-center gap-2 text-sm text-alecia-silver">
          <Pencil className="w-4 h-4" />
          <span>Les donnees de chronologie doivent etre modifiees via le panneau de configuration</span>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-alecia-silver/20" />
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={item.id} className="relative flex gap-4">
                <div className="w-8 h-8 rounded-full bg-alecia-navy text-white flex items-center justify-center font-bold z-10">
                  {index + 1}
                </div>
                <div className="flex-1 bg-alecia-silver/5 rounded-lg p-4">
                  <h4 className="font-semibold text-alecia-navy">{item.title}</h4>
                  <p className="text-sm text-alecia-silver mt-1">{item.description}</p>
                  {item.duration && (
                    <span className="inline-block mt-2 text-xs text-alecia-silver bg-alecia-silver/10 px-2 py-1 rounded">
                      {item.duration}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {timeline.length === 0 && (
          <p className="text-alecia-silver text-center">Aucune etape definie</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 overflow-auto">
      <h3 className="text-lg font-semibold text-alecia-navy mb-6">Chronologie</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-alecia-silver/20" />
        <div className="space-y-6">
          {timeline.map((item, index) => (
            <div key={item.id} className="relative flex gap-4">
              <div className="w-8 h-8 rounded-full bg-alecia-navy text-white flex items-center justify-center font-bold z-10">
                {index + 1}
              </div>
              <div className="flex-1 bg-alecia-silver/5 rounded-lg p-4">
                <h4 className="font-semibold text-alecia-navy">{item.title}</h4>
                <p className="text-sm text-alecia-silver mt-1">{item.description}</p>
                {item.duration && (
                  <span className="inline-block mt-2 text-xs text-alecia-silver bg-alecia-silver/10 px-2 py-1 rounded">
                    {item.duration}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {timeline.length === 0 && (
        <p className="text-alecia-silver text-center">Aucune etape definie</p>
