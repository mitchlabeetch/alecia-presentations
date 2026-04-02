import { FileText } from 'lucide-react';
import type { Slide } from '@/types';

interface ImportPreviewProps {
  slides: Slide[];
}

export function ImportPreview({ slides }: ImportPreviewProps) {
  const previewCount = Math.min(slides.length, 5);
  const remainingCount = slides.length - previewCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-alecia-navy">
          Aperçu de l'import
        </h4>
        <span className="text-sm text-alecia-silver">
          {slides.length} diapositive(s)
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {slides.slice(0, previewCount).map((slide, index) => (
          <div
            key={slide.id || index}
            className="aspect-video bg-white rounded border border-alecia-silver/20 overflow-hidden"
          >
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 bg-alecia-navy/5 p-2 flex items-center justify-center">
                <span className="text-2xl font-bold text-alecia-navy">
                  {index + 1}
                </span>
              </div>
              <div className="p-1.5 bg-alecia-silver/5">
                <p className="text-xs text-alecia-navy truncate">
                  {slide.title || 'Sans titre'}
                </p>
              </div>
            </div>
          </div>
        ))}

        {remainingCount > 0 && (
          <div className="aspect-video bg-alecia-silver/10 rounded border border-alecia-silver/20 flex items-center justify-center">
            <span className="text-sm text-alecia-silver">
              +{remainingCount}
            </span>
          </div>
        )}
      </div>

      {slides.length > previewCount && (
        <p className="text-xs text-alecia-silver text-center">
          Affichage limité aux 5 premières diapositives
        </p>
      )}
    </div>
  );
}
