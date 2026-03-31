import { useState } from 'react';
import { Doc } from '../../convex/_generated/dataModel';
import { SlidePreview } from './SlidePreview';
import { createRoot } from 'react-dom/client';
import { toast } from 'sonner';

interface Theme {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
}

interface Props {
  slides: Doc<'slides'>[];
  theme: Theme;
  projectName: string;
}

export function ExportButton({ slides, theme, projectName }: Props) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    if (exporting || slides.length === 0) return;
    setExporting(true);
    toast.info('Génération du PDF en cours...');

    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');

      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1280, 720] });
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
          scale: 1,
          useCORS: true,
          logging: false,
        });

        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 1280, 720);
      }

      document.body.removeChild(container);
      pdf.save(`${projectName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      toast.success('PDF exporté avec succès !');
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'export PDF");
    } finally {
      setExporting(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting || slides.length === 0}
      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-1.5"
    >
      {exporting ? (
        <>
          <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          Exportation...
        </>
      ) : (
        <>📥 PDF</>
      )}
    </button>
  );
}
