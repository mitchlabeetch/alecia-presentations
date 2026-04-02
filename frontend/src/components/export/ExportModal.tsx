import { useState } from 'react';
import { X, FileText, FileImage, FileSpreadsheet, Package, Download, Settings, Loader2 } from 'lucide-react';
import { ExportFormatSelector } from './ExportFormatSelector';
import { SlideRangeSelector } from './SlideRangeSelector';
import { ExportOptions } from './ExportOptions';
import { ExportProgress } from './ExportProgress';
import type { ExportFormat } from '@/types';

interface ExportModalProps {
  projectId: string;
  projectName: string;
  slideCount: number;
  onClose: () => void;
}

export function ExportModal({ projectId, projectName, slideCount, onClose }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('pptx');
  const [slideRange, setSlideRange] = useState<'all' | 'current' | 'custom'>('all');
  const [customRange, setCustomRange] = useState({ from: 1, to: slideCount });
  const [includeNotes, setIncludeNotes] = useState(false);
  const [includeWatermarks, setIncludeWatermarks] = useState(true);
  const [variablePresetId, setVariablePresetId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportError(null);

    try {
      let endpoint = `/api/export/${format}/${projectId}`;
      const params = new URLSearchParams();

      if (slideRange === 'custom') {
        params.set('from', customRange.from.toString());
        params.set('to', customRange.to.toString());
      } else if (slideRange === 'current') {
        params.set('current', 'true');
      }

      if (includeNotes) params.set('includeNotes', 'true');
      if (includeWatermarks) params.set('includeWatermarks', 'true');
      if (variablePresetId) params.set('variablePresetId', variablePresetId);

      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }

      setExportProgress(20);

      const response = await fetch(endpoint);
      setExportProgress(60);

      if (!response.ok) {
        throw new Error('Erreur lors de l\'export');
      }

      const blob = await response.blob();
      setExportProgress(90);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportProgress(100);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setExportError((error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="p-4 border-b border-alecia-silver/20 flex items-center justify-between">
          <h3 className="font-semibold text-alecia-navy flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter la présentation
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-alecia-silver/10 rounded">
            <X className="w-5 h-5 text-alecia-silver" />
          </button>
        </div>

        {isExporting ? (
          <div className="p-8">
            <ExportProgress
              progress={exportProgress}
              status={exportError ? 'error' : 'success'}
              error={exportError}
            />
          </div>
        ) : (
          <div className="p-4 space-y-6">
            <ExportFormatSelector value={format} onChange={setFormat} />

            <SlideRangeSelector
              value={slideRange}
              customRange={customRange}
              totalSlides={slideCount}
              onChange={setSlideRange}
              onCustomRangeChange={setCustomRange}
            />

            <ExportOptions
              includeNotes={includeNotes}
              includeWatermarks={includeWatermarks}
              variablePresetId={variablePresetId}
              onIncludeNotesChange={setIncludeNotes}
              onIncludeWatermarksChange={setIncludeWatermarks}
              onVariablePresetChange={setVariablePresetId}
            />

            {exportError && (
              <div className="p-3 bg-alecia-red/10 text-alecia-red rounded-lg text-sm">
                {exportError}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 alecia-btn-secondary">
                Annuler
              </button>
              <button onClick={handleExport} className="flex-1 alecia-btn-primary flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
