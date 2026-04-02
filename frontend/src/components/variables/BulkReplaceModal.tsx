import { useState } from 'react';
import { X, Search, Replace, Check } from 'lucide-react';
import type { Variable } from '@/types';

interface BulkReplaceModalProps {
  projectId: string;
  variables: Variable[];
  onClose: () => void;
}

export function BulkReplaceModal({ projectId, variables, onClose }: BulkReplaceModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [previewResults, setPreviewResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replacedCount, setReplacedCount] = useState(0);

  const handlePreview = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/slides/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchTerm,
          caseSensitive,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setPreviewResults(data.matches || []);
      }
    } catch (error) {
      console.error('Failed to preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplace = async () => {
    if (!searchTerm.trim() || !replaceTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/slides/replace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          search: searchTerm,
          replace: replaceTerm,
          caseSensitive,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setReplacedCount(data.replaced || 0);
      }
    } catch (error) {
      console.error('Failed to replace:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedVariable = variables.find(
    (v) => `{{${v.name}}}` === searchTerm || v.name === searchTerm.replace(/[{}]/g, '')
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-alecia-silver/20 flex items-center justify-between">
          <h3 className="font-semibold text-alecia-navy flex items-center gap-2">
            <Replace className="w-5 h-5" />
            Remplacement en masse
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-alecia-silver/10 rounded">
            <X className="w-5 h-5 text-alecia-silver" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-alecia-navy mb-1">
              Rechercher
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-alecia-silver" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Texte à rechercher..."
                className="alecia-input pl-9"
              />
            </div>
            {selectedVariable && (
              <p className="text-xs text-alecia-navy mt-1">
                Variable sélectionnée: {selectedVariable.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-alecia-navy mb-1">
              Remplacer par
            </label>
            <input
              type="text"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              placeholder="Nouveau texte ou {{variable}}..."
              className="alecia-input"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded border-alecia-silver/50 text-alecia-navy focus:ring-alecia-navy"
            />
            <span className="text-sm text-alecia-navy">Respecter la casse</span>
          </label>

          <div className="flex gap-2">
            <button
              onClick={handlePreview}
              disabled={!searchTerm.trim() || isLoading}
              className="flex-1 alecia-btn-secondary"
            >
              Aperçu
            </button>
            <button
              onClick={handleReplace}
              disabled={!searchTerm.trim() || !replaceTerm.trim() || isLoading}
              className="flex-1 alecia-btn-primary"
            >
              Remplacer tout
            </button>
          </div>

          {previewResults.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-alecia-navy mb-2">
                Aperçu ({previewResults.length} correspondances)
              </h4>
              <div className="max-h-40 overflow-y-auto bg-alecia-silver/5 rounded p-2 space-y-1">
                {previewResults.map((result, index) => (
                  <p key={index} className="text-xs text-alecia-navy bg-white p-2 rounded">
                    {result}
                  </p>
                ))}
              </div>
            </div>
          )}

          {replacedCount > 0 && (
            <div className="flex items-center gap-2 text-alecia-navy bg-alecia-navy/10 p-3 rounded-lg">
              <Check className="w-5 h-5" />
              <span>{replacedCount} remplacement(s) effectué(s)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
