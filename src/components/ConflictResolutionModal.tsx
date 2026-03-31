import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ConflictData {
  id?: number;
  entityType: 'project' | 'slide';
  entityId: string;
  localData: {
    lastModified?: number;
    title?: string;
    content?: string;
    data?: unknown;
    [key: string]: unknown;
  };
  serverData: {
    lastModified?: number;
    title?: string;
    content?: string;
    data?: unknown;
    [key: string]: unknown;
  };
  localTimestamp: number;
  serverTimestamp: number;
}

interface ConflictResolutionModalProps {
  isOpen: boolean;
  conflicts: ConflictData[];
  onClose: () => void;
  onResolve: (
    conflictId: number | string,
    resolution: 'local' | 'server' | 'merge',
    mergedData?: unknown
  ) => Promise<void>;
  onResolveAll?: (strategy: 'local' | 'server') => Promise<void>;
}

type ViewMode = 'list' | 'detail';

const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  isOpen,
  conflicts,
  onClose,
  onResolve,
  onResolveAll,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedConflict, setSelectedConflict] = useState<ConflictData | null>(null);
  const [resolving, setResolving] = useState(false);
  const [showMergeEditor, setShowMergeEditor] = useState(false);
  const [mergedTitle, setMergedTitle] = useState('');
  const [mergedContent, setMergedContent] = useState('');

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'il y a quelques secondes';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return 'il y a ' + minutes + ' minute' + (minutes > 1 ? 's' : '');
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return 'il y a ' + hours + ' heure' + (hours > 1 ? 's' : '');
    const days = Math.floor(hours / 24);
    return 'il y a ' + days + ' jour' + (days > 1 ? 's' : '');
  };

  const handleSelectConflict = useCallback((conflict: ConflictData) => {
    setSelectedConflict(conflict);
    setMergedTitle(
      (conflict.localData.title as string) || (conflict.serverData.title as string) || ''
    );
    setMergedContent(
      (conflict.localData.content as string) || (conflict.serverData.content as string) || ''
    );
    setViewMode('detail');
    setShowMergeEditor(false);
  }, []);

  const handleResolve = useCallback(
    async (resolution: 'local' | 'server' | 'merge') => {
      if (!selectedConflict) return;

      setResolving(true);
      try {
        let mergedData: unknown = undefined;

        if (resolution === 'merge') {
          mergedData = {
            ...selectedConflict.serverData,
            title: mergedTitle,
            content: mergedContent,
            lastModified: Date.now(),
          };
        }

        await onResolve(selectedConflict.entityId, resolution, mergedData);
        toast.success(
          resolution === 'local'
            ? 'Version locale appliquee'
            : resolution === 'server'
              ? 'Version serveur appliquee'
              : 'Fusion appliquee'
        );

        const remainingConflicts = conflicts.filter(
          (c) => c.entityId !== selectedConflict.entityId
        );
        if (remainingConflicts.length > 0) {
          handleSelectConflict(remainingConflicts[0]);
        } else {
          onClose();
        }
      } catch (error) {
        toast.error('Erreur lors de la resolution du conflit');
        console.error(error);
      } finally {
        setResolving(false);
      }
    },
    [
      selectedConflict,
      onResolve,
      onClose,
      conflicts,
      mergedTitle,
      mergedContent,
      handleSelectConflict,
    ]
  );

  const handleResolveAll = useCallback(
    async (strategy: 'local' | 'server') => {
      if (!onResolveAll) return;

      setResolving(true);
      try {
        await onResolveAll(strategy);
        toast.success(
          'Toutes les versions ' +
            (strategy === 'local' ? 'locales' : 'serveur') +
            ' ont ete appliquees'
        );
        onClose();
      } catch (error) {
        toast.error('Erreur lors de la resolution des conflits');
        console.error(error);
      } finally {
        setResolving(false);
      }
    },
    [onResolveAll, onClose]
  );

  const handleBack = useCallback(() => {
    setViewMode('list');
    setSelectedConflict(null);
    setShowMergeEditor(false);
  }, []);

  if (!isOpen) return null;

  // List view
  if (viewMode === 'list') {
    return React.createElement(
      'div',
      {
        style: {
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        },
        onClick: onClose,
      },
      React.createElement(
        'div',
        {
          style: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '85vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          },
          onClick: (e: React.MouseEvent) => e.stopPropagation(),
        },
        // Header
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#fef3c7',
            },
          },
          React.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
            React.createElement('span', { style: { fontSize: '24px' } }, '⚠️'),
            React.createElement(
              'div',
              null,
              React.createElement(
                'h2',
                {
                  style: { margin: 0, fontSize: '18px', fontWeight: 600, color: '#92400e' },
                },
                'Conflits detectes'
              ),
              React.createElement(
                'p',
                {
                  style: { margin: '4px 0 0 0', fontSize: '13px', color: '#a16207' },
                },
                conflicts.length + ' element' + (conflicts.length > 1 ? 's' : '') + ' en conflit'
              )
            )
          ),
          React.createElement(
            'button',
            {
              onClick: onClose,
              style: {
                padding: '8px',
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                color: '#92400e',
                cursor: 'pointer',
                borderRadius: '6px',
              },
            },
            '✕'
          )
        ),
        // Info Banner
        React.createElement(
          'div',
          {
            style: {
              padding: '12px 24px',
              backgroundColor: '#fef9c3',
              borderBottom: '1px solid #fef08a',
              fontSize: '13px',
              color: '#854d0e',
            },
          },
          '📝 Derniere modification gagne : Vous pouvez choisir de conserver automatiquement la version la plus recente, ou resoudre manuellement chaque conflit.'
        ),
        // Conflict List
        React.createElement(
          'div',
          { style: { flex: 1, overflow: 'auto', padding: '16px 24px' } },
          conflicts.map((conflict) =>
            React.createElement(
              'div',
              {
                key: conflict.entityId,
                onClick: () => handleSelectConflict(conflict),
                style: {
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                },
              },
              React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                  },
                },
                React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'span',
                    {
                      style: {
                        display: 'inline-block',
                        padding: '2px 8px',
                        backgroundColor: '#0a1628',
                        color: '#ffffff',
                        fontSize: '10px',
                        fontWeight: 600,
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        marginRight: '8px',
                      },
                    },
                    conflict.entityType
                  ),
                  React.createElement(
                    'span',
                    {
                      style: { fontSize: '14px', fontWeight: 500, color: '#0a1628' },
                    },
                    (conflict.localData.title as string) ||
                      (conflict.serverData.title as string) ||
                      conflict.entityId
                  )
                ),
                React.createElement('span', { style: { fontSize: '12px', color: '#6b7280' } }, '→')
              ),
              React.createElement(
                'div',
                {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    fontSize: '12px',
                  },
                },
                React.createElement(
                  'div',
                  { style: { padding: '8px', backgroundColor: '#ffffff', borderRadius: '6px' } },
                  React.createElement(
                    'div',
                    { style: { color: '#6b7280', marginBottom: '4px' } },
                    'Version locale'
                  ),
                  React.createElement(
                    'div',
                    { style: { color: '#374151', fontWeight: 500 } },
                    formatTimeAgo(conflict.localTimestamp)
                  )
                ),
                React.createElement(
                  'div',
                  { style: { padding: '8px', backgroundColor: '#ffffff', borderRadius: '6px' } },
                  React.createElement(
                    'div',
                    { style: { color: '#6b7280', marginBottom: '4px' } },
                    'Version serveur'
                  ),
                  React.createElement(
                    'div',
                    { style: { color: '#374151', fontWeight: 500 } },
                    formatTimeAgo(conflict.serverTimestamp)
                  )
                )
              )
            )
          )
        ),
        // Footer
        onResolveAll &&
          React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                gap: '12px',
                padding: '16px 24px',
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
              },
            },
            React.createElement(
              'button',
              {
                onClick: () => handleResolveAll('local'),
                disabled: resolving,
                style: {
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#374151',
                  cursor: resolving ? 'not-allowed' : 'pointer',
                  opacity: resolving ? 0.6 : 1,
                },
              },
              '📱 Garder tout local'
            ),
            React.createElement(
              'button',
              {
                onClick: () => handleResolveAll('server'),
                disabled: resolving,
                style: {
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: '#0a1628',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#ffffff',
                  cursor: resolving ? 'not-allowed' : 'pointer',
                  opacity: resolving ? 0.6 : 1,
                },
              },
              '☁️ Garder tout serveur'
            )
          )
      )
    );
  }

  // Detail view
  if (viewMode === 'detail' && selectedConflict) {
    return React.createElement(
      'div',
      {
        style: {
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        },
        onClick: handleBack,
      },
      React.createElement(
        'div',
        {
          style: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          },
          onClick: (e) => e.stopPropagation(),
        },
        // Header
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
            },
          },
          React.createElement(
            'button',
            {
              onClick: handleBack,
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                fontSize: '14px',
                color: '#6b7280',
                cursor: 'pointer',
                borderRadius: '6px',
              },
            },
            '← Retour'
          ),
          React.createElement(
            'h2',
            {
              style: { margin: 0, fontSize: '16px', fontWeight: 600, color: '#0a1628' },
            },
            'Resoudre le conflit'
          ),
          React.createElement('div', { style: { width: '80px' } })
        ),
        // Content
        React.createElement(
          'div',
          { style: { flex: 1, overflow: 'auto', padding: '24px' } },
          // Entity Info
          React.createElement(
            'div',
            {
              style: {
                padding: '12px 16px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '13px',
                color: '#6b7280',
              },
            },
            React.createElement('strong', null, selectedConflict.entityType),
            ' : ' + selectedConflict.entityId
          ),
          // Version Comparison
          React.createElement(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '24px',
              },
            },
            // Local Version
            React.createElement(
              'div',
              {
                style: {
                  padding: '16px',
                  backgroundColor: '#eff6ff',
                  border: '2px solid #3b82f6',
                  borderRadius: '8px',
                },
              },
              React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  },
                },
                React.createElement(
                  'span',
                  {
                    style: {
                      display: 'inline-block',
                      padding: '2px 8px',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 600,
                      borderRadius: '4px',
                    },
                  },
                  'VERSION LOCALE'
                ),
                React.createElement(
                  'span',
                  { style: { fontSize: '11px', color: '#6b7280' } },
                  formatTimestamp(selectedConflict.localTimestamp)
                )
              ),
              React.createElement(
                'div',
                { style: { marginBottom: '8px' } },
                React.createElement(
                  'div',
                  { style: { fontSize: '11px', color: '#6b7280', marginBottom: '4px' } },
                  'Titre'
                ),
                React.createElement(
                  'div',
                  {
                    style: {
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#1e40af',
                      padding: '8px',
                      backgroundColor: '#ffffff',
                      borderRadius: '4px',
                    },
                  },
                  (selectedConflict.localData.title as string) || '(sans titre)'
                )
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'div',
                  { style: { fontSize: '11px', color: '#6b7280', marginBottom: '4px' } },
                  'Contenu'
                ),
                React.createElement(
                  'div',
                  {
                    style: {
                      fontSize: '12px',
                      color: '#374151',
                      padding: '8px',
                      backgroundColor: '#ffffff',
                      borderRadius: '4px',
                      maxHeight: '120px',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                    },
                  },
                  (selectedConflict.localData.content as string) || '(vide)'
                )
              )
            ),
            // Server Version
            React.createElement(
              'div',
              {
                style: {
                  padding: '16px',
                  backgroundColor: '#f0fdf4',
                  border: '2px solid #22c55e',
                  borderRadius: '8px',
                },
              },
              React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  },
                },
                React.createElement(
                  'span',
                  {
                    style: {
                      display: 'inline-block',
                      padding: '2px 8px',
                      backgroundColor: '#22c55e',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 600,
                      borderRadius: '4px',
                    },
                  },
                  'VERSION SERVEUR'
                ),
                React.createElement(
                  'span',
                  { style: { fontSize: '11px', color: '#6b7280' } },
                  formatTimestamp(selectedConflict.serverTimestamp)
                )
              ),
              React.createElement(
                'div',
                { style: { marginBottom: '8px' } },
                React.createElement(
                  'div',
                  { style: { fontSize: '11px', color: '#6b7280', marginBottom: '4px' } },
                  'Titre'
                ),
                React.createElement(
                  'div',
                  {
                    style: {
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#166534',
                      padding: '8px',
                      backgroundColor: '#ffffff',
                      borderRadius: '4px',
                    },
                  },
                  (selectedConflict.serverData.title as string) || '(sans titre)'
                )
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'div',
                  { style: { fontSize: '11px', color: '#6b7280', marginBottom: '4px' } },
                  'Contenu'
                ),
                React.createElement(
                  'div',
                  {
                    style: {
                      fontSize: '12px',
                      color: '#374151',
                      padding: '8px',
                      backgroundColor: '#ffffff',
                      borderRadius: '4px',
                      maxHeight: '120px',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                    },
                  },
                  (selectedConflict.serverData.content as string) || '(vide)'
                )
              )
            )
          ),
          // Merge Editor
          showMergeEditor &&
            React.createElement(
              'div',
              {
                style: {
                  padding: '16px',
                  backgroundColor: '#fef3c7',
                  border: '2px solid #f59e0b',
                  borderRadius: '8px',
                  marginBottom: '24px',
                },
              },
              React.createElement(
                'h4',
                {
                  style: {
                    margin: '0 0 16px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#92400e',
                  },
                },
                '✏️ Fusionner manuellement'
              ),
              React.createElement(
                'div',
                { style: { marginBottom: '16px' } },
                React.createElement(
                  'label',
                  {
                    style: {
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#78350f',
                      marginBottom: '6px',
                    },
                  },
                  'Titre fusionne'
                ),
                React.createElement('input', {
                  type: 'text',
                  value: mergedTitle,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    setMergedTitle(e.target.value),
                  style: {
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: '1px solid #d97706',
                    borderRadius: '6px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  },
                  placeholder: 'Entrez le titre fusionne...',
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'label',
                  {
                    style: {
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#78350f',
                      marginBottom: '6px',
                    },
                  },
                  'Contenu fusionne'
                ),
                React.createElement('textarea', {
                  value: mergedContent,
                  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setMergedContent(e.target.value),
                  style: {
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '13px',
                    border: '1px solid #d97706',
                    borderRadius: '6px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    minHeight: '150px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  },
                  placeholder: 'Entrez le contenu fusionne...',
                })
              )
            ),
          // Resolution Options
          React.createElement(
            'div',
            { style: { display: 'flex', gap: '12px', flexWrap: 'wrap' } },
            React.createElement(
              'button',
              {
                onClick: () => handleResolve('local'),
                disabled: resolving,
                style: {
                  flex: 1,
                  minWidth: '150px',
                  padding: '14px 16px',
                  backgroundColor: '#3b82f6',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#ffffff',
                  cursor: resolving ? 'not-allowed' : 'pointer',
                  opacity: resolving ? 0.6 : 1,
                },
              },
              '📱 Utiliser version locale'
            ),
            React.createElement(
              'button',
              {
                onClick: () => handleResolve('server'),
                disabled: resolving,
                style: {
                  flex: 1,
                  minWidth: '150px',
                  padding: '14px 16px',
                  backgroundColor: '#22c55e',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#ffffff',
                  cursor: resolving ? 'not-allowed' : 'pointer',
                  opacity: resolving ? 0.6 : 1,
                },
              },
              '☁️ Utiliser version serveur'
            ),
            React.createElement(
              'button',
              {
                onClick: () => setShowMergeEditor(!showMergeEditor),
                style: {
                  flex: 1,
                  minWidth: '150px',
                  padding: '14px 16px',
                  backgroundColor: showMergeEditor ? '#f59e0b' : '#fef3c7',
                  border: showMergeEditor ? 'none' : '1px solid #f59e0b',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: showMergeEditor ? '#ffffff' : '#92400e',
                  cursor: 'pointer',
                },
              },
              '🔀 Fusionner manuellement'
            )
          ),
          // Merge Confirm Button
          showMergeEditor &&
            React.createElement(
              'button',
              {
                onClick: () => handleResolve('merge'),
                disabled: resolving || !mergedTitle.trim(),
                style: {
                  width: '100%',
                  marginTop: '16px',
                  padding: '14px 16px',
                  backgroundColor: !mergedTitle.trim() ? '#9ca3af' : '#f59e0b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#ffffff',
                  cursor: !mergedTitle.trim() ? 'not-allowed' : 'pointer',
                },
              },
              '✓ Confirmer la fusion'
            )
        )
      )
    );
  }

  return null;
};

export default ConflictResolutionModal;
