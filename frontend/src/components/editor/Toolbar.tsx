import { useState, useCallback } from 'react';
import {
  Save,
  Undo2,
  Redo2,
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
  Columns,
  Sparkles,
  Settings,
} from 'lucide-react';
import { useHistory, useUI, useProjects } from '@/store/useAppStore';
import { api, downloadBlob } from '@/lib/api';

interface ToolbarProps {
  onPreview?: () => void;
  onShare?: () => void;
}

export function Toolbar({ onPreview, onShare }: ToolbarProps) {
  const { undo, redo, canUndo, canRedo } = useHistory();
  const { toggleAiPanel, toggleVariablesPanel, toggleCommentsPanel, addToast } = useUI();
  const { currentProject } = useProjects();

  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Handle save
  const handleSave = useCallback(async () => {
    if (!currentProject) return;

    setSaveStatus('saving');
    try {
      // The slides are already being saved via the API on change
      // This is just for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSaveStatus('saved');
      addToast('success', 'Projet enregistré');

      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch {
      setSaveStatus('idle');
      addToast('error', 'Erreur lors de l\'enregistrement');
    }
  }, [currentProject, addToast]);

  // Handle export
  const handleExport = useCallback(
    async (format: 'pptx' | 'pdf' | 'png') => {
      if (!currentProject) return;

      setIsExporting(true);
      setShowExportMenu(false);

      try {
        let blob: Blob;
        let filename: string;

        switch (format) {
          case 'pptx':
            blob = await api.export.toPptx(currentProject.id);
            filename = `${currentProject.name}.pptx`;
            break;
          case 'pdf':
            blob = await api.export.toPdf(currentProject.id);
            filename = `${currentProject.name}.pdf`;
            break;
          case 'png':
            blob = await api.export.toImages(currentProject.id, { format: 'png' });
            filename = `${currentProject.name}.zip`;
            break;
          default:
            throw new Error('Format non supporté');
        }

        downloadBlob(blob, filename);
        addToast('success', `Export ${format.toUpperCase()} réussi`);
      } catch {
        addToast('error', 'Erreur lors de l\'export');
      } finally {
        setIsExporting(false);
      }
    },
    [currentProject, addToast]
  );

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-alecia-silver/20">
      {/* Left Section - Project Name & Actions */}
      <div className="flex items-center gap-4">
        {/* Save Button */}
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

        {/* Undo/Redo */}
        <div className="flex items-center gap-1 bg-alecia-silver/10 rounded-lg p-1">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-2 rounded hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Annuler (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4 text-alecia-navy" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-2 rounded hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Rétablir (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4 text-alecia-navy" />
          </button>
        </div>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            className="alecia-btn-secondary gap-2"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
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

        {/* Preview */}
        <button onClick={onPreview} className="alecia-btn-secondary gap-2">
          <Eye className="w-4 h-4" />
          Aperçu
        </button>
      </div>

      {/* Right Section - Panels */}
      <div className="flex items-center gap-2">
        {/* AI Chat */}
        <button
          onClick={toggleAiPanel}
          className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors group"
          title="Chat IA"
        >
          <Sparkles className="w-5 h-5 text-alecia-navy group-hover:text-alecia-red transition-colors" />
        </button>

        {/* Variables */}
        <button
          onClick={toggleVariablesPanel}
          className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors group"
          title="Variables"
        >
          <Variable className="w-5 h-5 text-alecia-navy group-hover:text-alecia-red transition-colors" />
        </button>

        {/* Comments */}
        <button
          onClick={toggleCommentsPanel}
          className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors group"
          title="Commentaires"
        >
          <MessageSquare className="w-5 h-5 text-alecia-navy group-hover:text-alecia-red transition-colors" />
        </button>

        <div className="w-px h-6 bg-alecia-silver/30 mx-2" />

        {/* Share */}
        <button onClick={onShare} className="alecia-btn-accent gap-2">
          <Share2 className="w-4 h-4" />
          Partager
        </button>

        {/* Settings */}
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
