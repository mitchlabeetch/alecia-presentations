'use client';
import { useState } from 'react';
import { Doc } from '../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { createRoot } from 'react-dom/client';
import { SlidePreview } from '../SlidePreview';

interface Props {
  slides: Doc<'slides'>[];
  theme: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
  projectName: string;
}

export function ImageExport({ slides, theme, projectName }: Props) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleExport(format: 'png' | 'jpeg') {
    if (exporting || slides.length === 0) return;
    setExporting(true);
    setProgress(0);
    toast.info(`Export ${format.toUpperCase()} en cours...`);

    try {
      const { default: html2canvas } = await import('html2canvas');
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '1280px';
      container.style.height = '720px';
      document.body.appendChild(container);

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        container.innerHTML = '';
        container.style.width = '1280px';
        container.style.height = '720px';

        await new Promise<void>((resolve) => {
          const root = createRoot(container);
          root.render(
            <div style={{ width: '1280px', height: '720px', overflow: 'hidden' }}>
              <SlidePreview slide={slide} theme={theme} />
            </div>
          );
          setTimeout(resolve, 150);
        });

        const canvas = await html2canvas(container, {
          width: 1280,
          height: 720,
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: theme.primaryColor,
        });

        const dataUrl = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.92 : 1);
        const base64 = dataUrl.split(',')[1];
        zip.file(`slide-${String(i + 1).padStart(3, '0')}.${format}`, base64, { base64: true });

        setProgress(Math.round(((i + 1) / slides.length) * 100));
      }

      document.body.removeChild(container);

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${projectName.replace(/[^a-z0-9]/gi, '_')}_images.zip`;
      link.click();

      toast.success(`${slides.length} images exportees avec succes !`);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'export des images");
    } finally {
      setExporting(false);
      setProgress(0);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-gray-700">Format d'image</div>
      <div className="flex gap-2">
        <button
          onClick={() => void handleExport('png')}
          disabled={exporting || slides.length === 0}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {exporting && progress > 0 ? (
            <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            '📷'
          )}
          PNG ({slides.length} slides)
        </button>
        <button
          onClick={() => void handleExport('jpeg')}
          disabled={exporting || slides.length === 0}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {exporting && progress > 0 ? (
            <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            '🖼️'
          )}
          JPEG ({slides.length} slides)
        </button>
      </div>
      {exporting && progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-alecia-navy h-1.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
