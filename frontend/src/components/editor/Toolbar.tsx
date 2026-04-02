import { useState, useCallback } from 'react';
import {
  Save,
  Download,
  Eye,
  MessageSquare,
  Variable,
  Share2,
  ChevronDown,
  Loader2,
  Check,
  FileText,
  Image,
  Sparkles,
  Settings,
} from 'lucide-react';
import { useProjects, useAppStore } from '@/store/useAppStore';

interface ToolbarProps {
  onPreview?: () => void;
  onShare?: () => void;
}

export function Toolbar({ onPreview, onShare }: ToolbarProps) {
  const { currentProject } = useProjects();
  const toggleAiPanel = useAppStore((state) => state.toggleAIPanel);
  const toggleVariablesPanel = useAppStore((state) => state.toggleVariablesPanel);
  const setToast = useAppStore((state) => state.setToast);

  const [isSaving, setIsSaving] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSaveStatus('saved');
      setToast({ message: 'Projet enregistré', type: 'success' });
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
      setToast({ message: `Export ${format.toUpperCase()} - Fonctionnalité à venir`, type: 'info' });
    },
    [currentProject, setToast]
  );

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-alecia-silver/20">
      <div className="flex items-center gap-4">
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
          {saveStatus === 'saved' ? 'Enregistré' : 'Enregistrer'}
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
          Aperçu
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleAiPanel}
          className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors group"
          title="Chat IA"
        >
          <Sparkles className="w-5 h-5 text-alecia-navy group-hover:text-alecia-red transition-colors" />
        </button>

        <button
          onClick={toggleVariablesPanel}
          className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors group"
          title="Variables"
        >
          <Variable className="w-5 h-5 text-alecia-navy group-hover:text-alecia-red transition-colors" />
        </button>

        <button
          className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors group"
          title="Commentaires (Bientôt)"
          disabled
        >
          <MessageSquare className="w-5 h-5 text-alecia-silver/30 group-hover:text-alecia-silver transition-colors" />
        </button>

        <div className="w-px h-6 bg-alecia-silver/30 mx-2" />

        <button onClick={onShare} className="alecia-btn-accent gap-2">
          <Share2 className="w-4 h-4" />
          Partager
        </button>

        <button
          className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors"
          title="Paramètres"
        >
          <Settings className="w-5 h-5 text-alecia-silver hover:text-alecia-navy transition-colors" />
        </button>
      </div>
    </div>
  );
}
