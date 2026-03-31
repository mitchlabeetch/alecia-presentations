import { useState, useCallback } from 'react';
import PptxGenJS from 'pptxgenjs';
import { jsPDF } from 'jspdf';

export type ExportFormat = 'pptx' | 'pdf';
export type ExportQuality = 'standard' | 'high';

export interface SlideData {
  id: string;
  title?: string;
  content?: string;
  notes?: string;
  backgroundColor?: string;
  elements: SlideElement[];
}

export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'chart';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: Record<string, unknown>;
  imageUrl?: string;
}

export interface PresentationData {
  title: string;
  author?: string;
  company?: string;
  subject?: string;
  slides: SlideData[];
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
  };
}

export interface PptxExportOptions {
  includeSpeakerNotes?: boolean;
  quality?: ExportQuality;
  includeAnimations?: boolean;
  password?: string;
  preserveLayout?: boolean;
}

export interface PdfExportOptions {
  includeSpeakerNotes?: boolean;
  quality?: ExportQuality;
  pageSize?: 'a4' | 'letter' | 'screen';
  orientation?: 'portrait' | 'landscape';
}

export interface ExportProgress {
  status: 'idle' | 'preparing' | 'generating' | 'finalizing' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

const DEFAULT_PPTX_OPTIONS: PptxExportOptions = {
  includeSpeakerNotes: true,
  quality: 'standard',
  includeAnimations: false,
  preserveLayout: true,
};

const DEFAULT_PDF_OPTIONS: PdfExportOptions = {
  includeSpeakerNotes: false,
  quality: 'standard',
  pageSize: 'screen',
  orientation: 'landscape',
};

export const useExport = () => {
  const [progress, setProgress] = useState<ExportProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  });

  const updateProgress = useCallback(
    (status: ExportProgress['status'], progressPercent: number, message: string) => {
      setProgress({ status, progress: progressPercent, message });
    },
    []
  );

  const exportToPptx = useCallback(
    async (
      presentation: PresentationData,
      options: PptxExportOptions = {}
    ): Promise<Blob> => {
      const mergedOptions = { ...DEFAULT_PPTX_OPTIONS, ...options };

      try {
        updateProgress('preparing', 10, 'Préparation de la présentation...');

        const pptx = new PptxGenJS();

        // Set presentation properties
        pptx.title = presentation.title;
        pptx.author = presentation.author || 'Alecia';
        pptx.company = presentation.company || 'Alecia Conseil';
        pptx.subject = presentation.subject || '';

        // Set password if provided
        if (mergedOptions.password) {
          pptx.write = ((originalWrite) => {
            return async (options?: { fileName?: string }) => {
              return originalWrite.call(pptx, {
                ...options,
                password: mergedOptions.password,
              });
            };
          })(pptx.write);
        }

        updateProgress('generating', 30, 'Génération des diapositives...');

        // Create slides
        presentation.slides.forEach((slide, index) => {
          const pptSlide = pptx.addSlide();

          // Set slide background
          if (slide.backgroundColor) {
            pptSlide.background = { color: slide.backgroundColor };
          }

          // Add elements
          slide.elements.forEach((element) => {
            switch (element.type) {
              case 'text':
                pptSlide.addText(element.content || '', {
                  x: element.x,
                  y: element.y,
                  w: element.width,
                  h: element.height,
                  fontSize: (element.style?.fontSize as number) || 18,
                  color: (element.style?.color as string) || '#000000',
                  bold: (element.style?.bold as boolean) || false,
                  align: (element.style?.align as string) || 'left',
                });
                break;

              case 'image':
                if (element.imageUrl) {
                  pptSlide.addImage({
                    path: element.imageUrl,
                    x: element.x,
                    y: element.y,
                    w: element.width,
                    h: element.height,
                  });
                }
                break;

              case 'shape':
                pptSlide.addShape('rect' as any, {
                  x: element.x,
                  y: element.y,
                  w: element.width,
                  h: element.height,
                  fill: (element.style?.fill as string) || '#e91e63',
                });
                break;
            }
          });

          // Add speaker notes
          if (mergedOptions.includeSpeakerNotes && slide.notes) {
            pptSlide.addNotes(slide.notes);
          }

          // Update progress
          const slideProgress = 30 + ((index + 1) / presentation.slides.length) * 50;
          updateProgress(
            'generating',
            slideProgress,
            `Génération de la diapositive ${index + 1}/${presentation.slides.length}...`
          );
        });

        updateProgress('finalizing', 90, 'Finalisation du fichier...');

        // Generate blob
        const blob = await pptx.write({ outputType: 'blob' });

        updateProgress('complete', 100, 'Export terminé !');

        return blob as Blob;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erreur lors de l\'export PPTX';
        updateProgress('error', 0, errorMessage);
        throw new Error(errorMessage);
      }
    },
    [updateProgress]
  );

  const exportToPdf = useCallback(
    async (
      presentation: PresentationData,
      options: PdfExportOptions = {}
    ): Promise<Blob> => {
      const mergedOptions = { ...DEFAULT_PDF_OPTIONS, ...options };

      try {
        updateProgress('preparing', 10, 'Préparation du PDF...');

        const pageSizes = {
          a4: { width: 210, height: 297 },
          letter: { width: 216, height: 279 },
          screen: { width: 297, height: 210 },
        };

        const pageSize = pageSizes[mergedOptions.pageSize || 'screen'];
        const isLandscape = mergedOptions.orientation === 'landscape';

        const doc = new jsPDF({
          orientation: isLandscape ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [pageSize.width, pageSize.height],
        });

        const scaleFactor = mergedOptions.quality === 'high' ? 2 : 1;

        updateProgress('generating', 30, 'Génération des pages...');

        for (let i = 0; i < presentation.slides.length; i++) {
          const slide = presentation.slides[i];

          if (i > 0) {
            doc.addPage();
          }

          // Set background color
          if (slide.backgroundColor) {
            doc.setFillColor(slide.backgroundColor);
            doc.rect(0, 0, pageSize.width, pageSize.height, 'F');
          }

          // Add title if present
          if (slide.title) {
            doc.setFontSize(24);
            doc.setTextColor('#0a1628');
            doc.text(slide.title, 10, 20);
          }

          // Add content
          if (slide.content) {
            doc.setFontSize(12);
            doc.setTextColor('#333333');
            const splitContent = doc.splitTextToSize(slide.content, pageSize.width - 20);
            doc.text(splitContent, 10, 40);
          }

          // Add elements
          slide.elements.forEach((element) => {
            if (element.type === 'text' && element.content) {
              doc.setFontSize((element.style?.fontSize as number) || 12);
              doc.setTextColor((element.style?.color as string) || '#000000');
              doc.text(
                element.content,
                element.x * 100,
                element.y * 100 + 50
              );
            }
          });

          // Add speaker notes if enabled
          if (mergedOptions.includeSpeakerNotes && slide.notes) {
            doc.setFontSize(8);
            doc.setTextColor('#666666');
            const notes = doc.splitTextToSize(`Notes: ${slide.notes}`, pageSize.width - 20);
            doc.text(notes, 10, pageSize.height - 20);
          }

          // Update progress
          const slideProgress = 30 + ((i + 1) / presentation.slides.length) * 50;
          updateProgress(
            'generating',
            slideProgress,
            `Génération de la page ${i + 1}/${presentation.slides.length}...`
          );
        }

        updateProgress('finalizing', 90, 'Finalisation du PDF...');

        const pdfBlob = doc.output('blob');

        updateProgress('complete', 100, 'Export PDF terminé !');

        return pdfBlob;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erreur lors de l\'export PDF';
        updateProgress('error', 0, errorMessage);
        throw new Error(errorMessage);
      }
    },
    [updateProgress]
  );

  const downloadBlob = useCallback(
    (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    []
  );

  const exportPresentation = useCallback(
    async (
      format: ExportFormat,
      presentation: PresentationData,
      options?: PptxExportOptions | PdfExportOptions
    ) => {
      setProgress({ status: 'idle', progress: 0, message: '' });

      let blob: Blob;
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${presentation.title.replace(/\s+/g, '_')}_${timestamp}`;

      if (format === 'pptx') {
        blob = await exportToPptx(presentation, options as PptxExportOptions);
        downloadBlob(blob, `${filename}.pptx`);
      } else {
        blob = await exportToPdf(presentation, options as PdfExportOptions);
        downloadBlob(blob, `${filename}.pdf`);
      }

      return blob;
    },
    [exportToPptx, exportToPdf, downloadBlob]
  );

  const resetProgress = useCallback(() => {
    setProgress({ status: 'idle', progress: 0, message: '' });
  }, []);

  return {
    progress,
    exportToPptx,
    exportToPdf,
    exportPresentation,
    downloadBlob,
    resetProgress,
  };
};

export default useExport;
