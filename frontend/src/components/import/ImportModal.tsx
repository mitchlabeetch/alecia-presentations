import { useState, useCallback } from 'react';
import { Upload, X, FileText, FileImage, Check, Loader2, AlertCircle } from 'lucide-react';
import { ImportDropzone } from './ImportDropzone';
import { ImportPreview } from './ImportPreview';
import type { Slide } from '@/types';

interface ImportModalProps {
  onClose: () => void;
  onImportComplete: (slides: Slide[]) => void;
}

type ImportStatus = 'idle' | 'uploading' | 'converting' | 'preview' | 'success' | 'error';

export function ImportModal({ onClose, onImportComplete }: ImportModalProps) {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewSlides, setPreviewSlides] = useState<Slide[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [createNewProject, setCreateNewProject] = useState(true);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setStatus('uploading');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const endpoint = selectedFile.name.endsWith('.pptx')
        ? '/api/import/pptx'
        : '/api/import/pdf';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      setProgress(30);

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload du fichier');
      }

      const data = await response.json();
      setProgress(60);

      setStatus('converting');
      setProgress(80);

      if (data.slides) {
        setPreviewSlides(data.slides);
        setStatus('preview');
        setProgress(100);
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (err) {
      setStatus('error');
      setError((err as Error).message);
    }
  }, []);

  const handleImport = async () => {
    if (previewSlides.length === 0) return;

    setStatus('uploading');
    setProgress(0);

    try {
      const endpoint = createNewProject
        ? '/api/import/create-project'
        : '/api/import/add-to-project';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides: previewSlides }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'import');
      }

      const data = await response.json();
      setProgress(100);
      setStatus('success');

      setTimeout(() => {
        onImportComplete(data.slides || []);
        onClose();
      }, 1000);
    } catch (err) {
      setStatus('error');
      setError((err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-alecia-silver/20 flex items-center justify-between">
          <h3 className="font-semibold text-alecia-navy flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importer une présentation
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-alecia-silver/10 rounded">
            <X className="w-5 h-5 text-alecia-silver" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {status === 'idle' && (
            <ImportDropzone onFileSelect={handleFileSelect} />
          )}

          {(status === 'uploading' || status === 'converting') && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-alecia-navy mx-auto mb-4 animate-spin" />
              <p className="text-alecia-navy font-medium mb-2">
                {status === 'uploading' ? 'Upload en cours...' : 'Conversion en cours...'}
              </p>
              <div className="w-full bg-alecia-silver/20 rounded-full h-2 max-w-xs mx-auto">
                <div
                  className="bg-alecia-navy h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-alecia-silver mt-2">{progress}%</p>
            </div>
          )}

          {status === 'preview' && previewSlides.length > 0 && (
            <div className="space-y-4">
              <ImportPreview slides={previewSlides} />

              <div className="p-4 bg-alecia-silver/5 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createNewProject}
                    onChange={(e) => setCreateNewProject(e.target.checked)}
                    className="rounded border-alecia-silver/50 text-alecia-navy focus:ring-alecia-navy"
                  />
                  <span className="text-sm text-alecia-navy">
                    Créer un nouveau projet
                  </span>
                </label>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-alecia-navy font-medium">Import terminé avec succès!</p>
              <p className="text-sm text-alecia-silver mt-2">
                {previewSlides.length} diapositive(s) importée(s)
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-alecia-red mx-auto mb-4" />
              <p className="text-alecia-red font-medium">Erreur lors de l'import</p>
              {error && <p className="text-sm text-alecia-silver mt-2">{error}</p>}
              <button
                onClick={() => {
                  setStatus('idle');
                  setFile(null);
                  setError(null);
                }}
                className="alecia-btn-secondary mt-4"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>

        {status === 'preview' && (
          <div className="p-4 border-t border-alecia-silver/20 flex gap-3">
            <button onClick={onClose} className="flex-1 alecia-btn-secondary">
              Annuler
            </button>
            <button onClick={handleImport} className="flex-1 alecia-btn-primary">
              Importer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
