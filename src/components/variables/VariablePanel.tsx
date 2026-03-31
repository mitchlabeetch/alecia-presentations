/**
 * VariablePanel - Panneau principal de gestion des variables
 * Alecia Presentations - Conseil financier
 */

import React, { useState, useCallback, useMemo } from 'react';
import { VariableRow } from './VariableRow';
import { PresetManager } from './PresetManager';
import { BulkReplaceModal } from './BulkReplaceModal';
import { Variable, VariableType, VARIABLE_TYPE_LABELS } from './types';
import { useVariables } from './useVariables';

// Couleurs de la marque Alecia
const BRAND_COLORS = {
  darkNavy: '#0a1628',
  pinkAccent: '#e91e63',
  lightPink: '#fce4ec',
};

interface VariablePanelProps {
  onVariablesChange?: (variables: Variable[]) => void;
  initialVariables?: Variable[];
  className?: string;
}

export const VariablePanel: React.FC<VariablePanelProps> = ({
  onVariablesChange,
  initialVariables: _initialVariables,
  className = '',
}) => {
  const {
    variables,
    presets,
    addVariable,
    updateVariable,
    deleteVariable,
    duplicateVariable,
    savePreset,
    loadPreset,
    deletePreset,
    setDefaultPreset,
    exportToJSON,
    importFromJSON,
    importFromCSV,
    exportPresetsToJSON,
    importPresetsFromJSON,
    resetToDefaults,
    clearAll,
    stats,
  } = useVariables();

  const [activeTab, setActiveTab] = useState<'variables' | 'presets'>('variables');
  const [selectedType, setSelectedType] = useState<VariableType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBulkReplace, setShowBulkReplace] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState<'json' | 'csv'>('json');
  const [importContent, setImportContent] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // Notifier les changements
  React.useEffect(() => {
    onVariablesChange?.(variables);
  }, [variables, onVariablesChange]);

  // Filtrer les variables
  const filteredVariables = useMemo(() => {
    return variables.filter((v) => {
      const matchesType = selectedType === 'all' || v.type === selectedType;
      const matchesSearch =
        searchQuery === '' ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [variables, selectedType, searchQuery]);

  // Obtenir les noms existants pour la validation
  const existingNames = useMemo(() => variables.map((v) => v.name), [variables]);

  // Gérer l'import
  const handleImport = useCallback(() => {
    setImportError(null);

    let result;
    if (importType === 'json') {
      result = importFromJSON(importContent);
    } else {
      result = importFromCSV(importContent);
    }

    if (result.success) {
      setShowImportModal(false);
      setImportContent('');
    } else {
      setImportError(result.errors.join(', '));
    }
  }, [importType, importContent, importFromJSON, importFromCSV]);

  // Gérer l'export
  const handleExport = useCallback(() => {
    const data = exportToJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alecia-variables-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportToJSON]);

  // Gérer le glisser-déposer
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, _index: number) => {
      e.preventDefault();
      if (draggedIndex === null) return;

      // Réordonner visuellement (la logique réelle serait dans useVariables)
    },
    [draggedIndex]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, _index: number) => {
      e.preventDefault();
      if (draggedIndex === null) return;

      // Réordonner les variables
      // reorderVariables(draggedIndex, index);
      setDraggedIndex(null);
    },
    [draggedIndex]
  );

  // Styles
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    backgroundColor: BRAND_COLORS.darkNavy,
    color: '#ffffff',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    margin: 0,
  };

  const tabsStyles: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
  };

  const tabStyles = (isActive: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: isActive ? BRAND_COLORS.pinkAccent : 'transparent',
    color: isActive ? '#ffffff' : '#666666',
  });

  const toolbarStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderBottom: '1px solid #e0e0e0',
    flexWrap: 'wrap',
  };

  const searchInputStyles: React.CSSProperties = {
    flex: 1,
    minWidth: '200px',
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    outline: 'none',
  };

  const selectStyles: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  };

  const buttonStyles = (
    variant: 'primary' | 'secondary' | 'danger' = 'secondary'
  ): React.CSSProperties => {
    const colors = {
      primary: { bg: BRAND_COLORS.pinkAccent, color: '#ffffff', hover: '#d81b60' },
      secondary: { bg: '#f5f5f5', color: '#333333', hover: '#e0e0e0' },
      danger: { bg: '#ffebee', color: '#f44336', hover: '#ffcdd2' },
    };

    return {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      fontSize: '13px',
      fontWeight: 500,
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: colors[variant].bg,
      color: colors[variant].color,
    };
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
  };

  const emptyStateStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center',
    color: '#9e9e9e',
  };

  const statsStyles: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    padding: '12px 16px',
    backgroundColor: '#fafafa',
    borderTop: '1px solid #e0e0e0',
    fontSize: '12px',
    color: '#666666',
  };

  const statItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const modalOverlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
  };

  return (
    <div style={containerStyles} className={className}>
      {/* En-tête */}
      <div style={headerStyles}>
        <h2 style={titleStyles}>Variables de présentation</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowBulkReplace(true)}
            style={{ ...buttonStyles('secondary'), padding: '6px 12px' }}
            title="Remplacer tout"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
            Remplacer tout
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div style={tabsStyles}>
        <button
          onClick={() => setActiveTab('variables')}
          style={tabStyles(activeTab === 'variables')}
        >
          Variables ({stats.total})
        </button>
        <button onClick={() => setActiveTab('presets')} style={tabStyles(activeTab === 'presets')}>
          Préréglages ({presets.length})
        </button>
      </div>

      {activeTab === 'variables' ? (
        <>
          {/* Barre d'outils */}
          <div style={toolbarStyles}>
            <input
              type="text"
              placeholder="Rechercher une variable..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInputStyles}
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as VariableType | 'all')}
              style={selectStyles}
            >
              <option value="all">Tous les types</option>
              {Object.entries(VARIABLE_TYPE_LABELS).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
            <button onClick={() => addVariable('custom')} style={buttonStyles('primary')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              Ajouter
            </button>
          </div>

          {/* Actions secondaires */}
          <div style={{ ...toolbarStyles, paddingTop: 0 }}>
            <button onClick={handleExport} style={buttonStyles('secondary')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
              </svg>
              Exporter
            </button>
            <button onClick={() => setShowImportModal(true)} style={buttonStyles('secondary')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
              </svg>
              Importer
            </button>
            <button onClick={resetToDefaults} style={buttonStyles('secondary')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
              </svg>
              Réinitialiser
            </button>
            <button onClick={clearAll} style={buttonStyles('danger')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path
                  fillRule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                />
              </svg>
              Tout effacer
            </button>
          </div>

          {/* Liste des variables */}
          <div style={contentStyles}>
            {filteredVariables.length === 0 ? (
              <div style={emptyStateStyles}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  style={{ marginBottom: '16px', opacity: 0.3 }}
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  {searchQuery
                    ? 'Aucune variable ne correspond à votre recherche'
                    : 'Aucune variable définie. Cliquez sur "Ajouter" pour commencer.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredVariables.map((variable, index) => (
                  <VariableRow
                    key={variable.id}
                    variable={variable}
                    onUpdate={updateVariable}
                    onDelete={deleteVariable}
                    onDuplicate={duplicateVariable}
                    existingNames={existingNames}
                    dragHandleProps={{
                      draggable: true,
                      onDragStart: () => handleDragStart(index),
                      onDragOver: (e) => handleDragOver(e, index),
                      onDrop: (e) => handleDrop(e, index),
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div style={statsStyles}>
            <div style={statItemStyles}>
              <strong>{stats.total}</strong> variables
            </div>
            <div style={statItemStyles}>
              <strong>{stats.filled}</strong> renseignées
            </div>
            <div style={statItemStyles}>
              <strong>{stats.empty}</strong> vides
            </div>
          </div>
        </>
      ) : (
        <PresetManager
          presets={presets}
          variables={variables}
          onSavePreset={savePreset}
          onLoadPreset={loadPreset}
          onDeletePreset={deletePreset}
          onSetDefault={setDefaultPreset}
          onExportPresets={exportPresetsToJSON}
          onImportPresets={importPresetsFromJSON}
        />
      )}

      {/* Modal d'import */}
      {showImportModal && (
        <div style={modalOverlayStyles} onClick={() => setShowImportModal(false)}>
          <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px 0', color: BRAND_COLORS.darkNavy }}>
              Importer des variables
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}
              >
                Format
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <input
                    type="radio"
                    value="json"
                    checked={importType === 'json'}
                    onChange={() => setImportType('json')}
                  />
                  <span>JSON</span>
                </label>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <input
                    type="radio"
                    value="csv"
                    checked={importType === 'csv'}
                    onChange={() => setImportType('csv')}
                  />
                  <span>CSV</span>
                </label>
              </div>
            </div>

            <textarea
              value={importContent}
              onChange={(e) => setImportContent(e.target.value)}
              placeholder={
                importType === 'json'
                  ? '[\n  {"name": "client", "value": "Acme Corp"}\n]'
                  : 'nom,valeur,type\nclient,Acme Corp,client'
              }
              style={{
                width: '100%',
                height: '200px',
                padding: '12px',
                fontSize: '13px',
                fontFamily: 'monospace',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                resize: 'vertical',
                marginBottom: '16px',
              }}
            />

            {importError && (
              <div style={{ color: '#f44336', fontSize: '13px', marginBottom: '16px' }}>
                {importError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowImportModal(false)} style={buttonStyles('secondary')}>
                Annuler
              </button>
              <button
                onClick={handleImport}
                disabled={!importContent.trim()}
                style={{ ...buttonStyles('primary'), opacity: importContent.trim() ? 1 : 0.5 }}
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de remplacement global */}
      {showBulkReplace && (
        <BulkReplaceModal
          variables={variables}
          onClose={() => setShowBulkReplace(false)}
          onReplaceAll={(search, replace) => {
            // Logique de remplacement global
            console.log('Remplacer', search, 'par', replace);
            setShowBulkReplace(false);
          }}
        />
      )}
    </div>
  );
};

export default VariablePanel;
