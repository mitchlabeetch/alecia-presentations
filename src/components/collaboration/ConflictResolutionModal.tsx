'use client';
import { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { toast } from 'sonner';

interface ConflictItem {
  id: string;
  type: 'slide' | 'project' | 'comment';
  title: string;
  localVersion: {
    content: string;
    timestamp: number;
  };
  serverVersion: {
    content: string;
    timestamp: number;
  };
}

interface Props {
  conflicts: ConflictItem[];
  onResolve: (conflictId: string, resolution: 'local' | 'server' | 'merge') => void;
  onResolveAll?: (resolution: 'local' | 'server') => void;
  onCancel: () => void;
}

export function ConflictResolutionModal({
  conflicts,
  onResolve,
  onResolveAll: _onResolveAll,
  onCancel,
}: Props) {
  const [selectedConflicts, setSelectedConflicts] = useState<Set<string>>(
    new Set(conflicts.map((c) => c.id))
  );
  const [expandedConflict, setExpandedConflict] = useState<string | null>(null);

  const formatTimestamp = (ts: number) => {
    return new Date(ts).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleConflict = (id: string) => {
    const newSet = new Set(selectedConflicts);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedConflicts(newSet);
  };

  const handleResolveSelected = (resolution: 'local' | 'server') => {
    selectedConflicts.forEach((id) => {
      onResolve(id, resolution);
    });
    toast.success(` ${selectedConflicts.size} conflit(s) resolu(s)`);
  };

  return (
    <Modal isOpen onClose={onCancel} title="Resoudre les conflits de synchronisation">
      <div className="flex flex-col gap-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            ⚠️ {conflicts.length} modification(s) ont ete effectuees hors ligne qui sont en conflit
            avec le serveur. Choisissez quelle version conserver pour chaque element.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleResolveSelected('local')}
            disabled={selectedConflicts.size === 0}
          >
            📍 Garder mes versions
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleResolveSelected('server')}
            disabled={selectedConflicts.size === 0}
          >
            ☁️ Garder serveur
          </Button>
          <div className="flex-1" />
          <span className="text-sm text-gray-500 self-center">
            {selectedConflicts.size}/{conflicts.length} selectionne(s)
          </span>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {conflicts.map((conflict) => (
            <div
              key={conflict.id}
              className={`border rounded-lg p-3 transition-colors ${
                selectedConflicts.has(conflict.id)
                  ? 'border-alecia-navy bg-alecia-navy/5'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedConflicts.has(conflict.id)}
                  onChange={() => toggleConflict(conflict.id)}
                  className="rounded border-gray-300"
                />
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                  {conflict.type === 'slide' ? '📄' : conflict.type === 'project' ? '📁' : '💬'}{' '}
                  {conflict.type}
                </span>
                <span className="font-medium flex-1">{conflict.title}</span>
                <button
                  onClick={() =>
                    setExpandedConflict(expandedConflict === conflict.id ? null : conflict.id)
                  }
                  className="text-xs text-alecia-navy hover:underline"
                >
                  {expandedConflict === conflict.id ? 'Reduire' : 'Comparer'}
                </button>
              </div>

              {expandedConflict === conflict.id && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      📍 Votre version ({formatTimestamp(conflict.localVersion.timestamp)})
                    </div>
                    <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-2 rounded">
                      {conflict.localVersion.content}
                    </pre>
                  </div>
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      ☁️ Version serveur ({formatTimestamp(conflict.serverVersion.timestamp)})
                    </div>
                    <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-2 rounded">
                      {conflict.serverVersion.content}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onResolve(conflict.id, 'local')}
                  className="flex-1"
                >
                  Garder locale
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onResolve(conflict.id, 'server')}
                  className="flex-1"
                >
                  Garder serveur
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </div>
    </Modal>
  );
}
