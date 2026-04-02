import type { BlockContent, TimelineItem } from '@/types';

interface Process_TimelineProps {
  content: BlockContent;
  data?: { timeline?: TimelineItem[] } | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Process_Timeline({ content, data, isEditing = false, onChange }: Process_TimelineProps) {
  const steps = data?.timeline || [];

  if (isEditing) {
    return (
      <div className="w-full h-full p-8">
        <h3 className="text-xl font-bold text-alecia-navy mb-6">Processus</h3>
        <div className="flex items-center justify-between gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 text-center">
              <div className="w-12 h-12 rounded-full bg-alecia-navy text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {index + 1}
              </div>
              <h4 className="font-semibold text-alecia-navy">{step.title}</h4>
              <p className="text-sm text-alecia-silver mt-1">{step.description}</p>
              {step.duration && (
                <span className="inline-block mt-2 text-xs bg-alecia-silver/10 px-2 py-1 rounded">{step.duration}</span>
              )}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-alecia-silver/20" />
              )}
            </div>
          ))}
        </div>
        {steps.length === 0 && (
          <p className="text-alecia-silver text-center">Aucune étape définie</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <h3 className="text-xl font-bold text-alecia-navy mb-6">Processus</h3>
      <div className="flex items-center justify-between gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 text-center relative">
            <div className="w-12 h-12 rounded-full bg-alecia-navy text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">
              {index + 1}
            </div>
            <h4 className="font-semibold text-alecia-navy">{step.title}</h4>
            <p className="text-sm text-alecia-silver mt-1">{step.description}</p>
            {step.duration && (
              <span className="inline-block mt-2 text-xs bg-alecia-silver/10 px-2 py-1 rounded">{step.duration}</span>
            )}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 bg-alecia-silver/20" />
            )}
          </div>
        ))}
      </div>
      {steps.length === 0 && (
        <p className="text-alecia-silver text-center">Aucune étape définie</p>
      )}
    </div>
  );
}
