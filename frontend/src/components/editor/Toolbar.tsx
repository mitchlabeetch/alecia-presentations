import { useState, useCallback } from 'react';
import {
  Save,
  Download,
  Eye,
  Share2,
  ChevronDown,
  Loader2,
  Check,
  FileText,
  Image,
  Settings,
} from 'lucide-react';
import { useProjects, useAppStore } from '@/store/useAppStore';

interface ToolbarProps {
  onPreview?: () => void;
  onShare?: () => void;
}

export function Toolbar({ onPreview, onShare }: ToolbarProps) {
  const { currentProject } = useProjects();
  const setToast = useAppStore((state) => state.setToast);

  const [isSaving, setIsSaving] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSaveStatus('saved');
      setToast({ message: 'Projet enregistre', type: 'success' });
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('idle');
      setToast({ message: 'Erreur lors de l\'enregistrement', type: 'error' });
    }
  }, [setToast]);

  const handleExport = useCallback(
    async (format: 'pptx' | 'pdf' | 'png') => {
      if (!currentProject) return;
      setShowExportMenu(false);
      setToast({ message: `Export ${format.toUpperCase()} - Fonctionnalite a venir`, type: 'info' });
    },
    [currentProject, setToast]
  );

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSave}
        disabled={saveStatus === 'saving'}
        className="alecia-btn-primary gap-2"
      >
        {saveStatus === 'saving' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saveStatus === 'saved' ? (
          <Check className="w-4 h-4" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {saveStatus === 'saved' ? 'Enregistre' : 'Enregistrer'}
      </button>

      <div className="relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="alecia-btn-secondary gap-2"
        >
          <Download className="w-4 h-4" />
          Exporter
          <ChevronDown className="w-4 h-4" />
        </button>

        {showExportMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowExportMenu(false)}
            />
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-alecia-silver/20 py-2 min-w-[200px] z-20">
              <button
                onClick={() => handleExport('pptx')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-alecia-silver/10 flex items-center gap-3"
              >
                <FileText className="w-4 h-4 text-alecia-silver" />
                PowerPoint (.pptx)
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-alecia-silver/10 flex items-center gap-3"
              >
                <FileText className="w-4 h-4 text-alecia-silver" />
                PDF (.pdf)
              </button>
              <button
                onClick={() => handleExport('png')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-alecia-silver/10 flex items-center gap-3"
              >
                <Image className="w-4 h-4 text-alecia-silver" />
                Images PNG (.zip)
              </button>
            </div>
          </>
        )}
      </div>

      <button onClick={onPreview} className="alecia-btn-secondary gap-2">
        <Eye className="w-4 h-4" />
        Apercu
      </button>

      <div className="w-px h-6 bg-alecia-silver/30" />

      <button onClick={onShare} className="alecia-btn-accent gap-2">
        <Share2 className="w-4 h-4" />
        Partager
      </button>

      <button
        className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors"
        title="Parametres"
      >
        <Settings className="w-5 h-5 text-alecia-silver hover:text-alecia-navy transition-colors" />
      </button>
    </div>
  );
}
