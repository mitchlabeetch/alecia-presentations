import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface ExportProgressProps {
  progress: number;
  status: 'loading' | 'success' | 'error';
  error?: string | null;
}

export function ExportProgress({ progress, status, error }: ExportProgressProps) {
  return (
    <div className="text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="w-12 h-12 text-alecia-navy mx-auto mb-4 animate-spin" />
          <p className="text-alecia-navy font-medium mb-2">Export en cours...</p>
          <div className="w-full bg-alecia-silver/20 rounded-full h-2 mb-2">
            <div
              className="bg-alecia-navy h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-alecia-silver">{progress}%</p>
        </>
      )}

      {status === 'success' && (
        <>
          <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-alecia-navy font-medium">Export terminé avec succès!</p>
          <p className="text-sm text-alecia-silver mt-2">Votre fichier a été téléchargé.</p>
        </>
      )}

      {status === 'error' && (
        <>
          <AlertCircle className="w-12 h-12 text-alecia-red mx-auto mb-4" />
          <p className="text-alecia-red font-medium">Erreur lors de l'export</p>
          {error && <p className="text-sm text-alecia-silver mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}
