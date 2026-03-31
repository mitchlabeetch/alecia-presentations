/**
 * PresetManager - Gestion des préréglages de variables
 * Alecia Presentations - Conseil financier
 */

import React, { useState, useCallback } from 'react';
import { VariablePreset, Variable, VARIABLE_TYPE_LABELS } from './types';

// Couleurs de la marque Alecia
const BRAND_COLORS = {
  darkNavy: '#0a1628',
  pinkAccent: '#e91e63',
  lightPink: '#fce4ec',
};

interface PresetManagerProps {
  presets: VariablePreset[];
  variables: Variable[];
  onSavePreset: (name: string, description?: string) => void;
  onLoadPreset: (presetId: string) => void;
  onDeletePreset: (presetId: string) => void;
  onSetDefault: (presetId: string) => void;
  onExportPresets: () => string;
  onImportPresets: (jsonString: string) => { success: boolean; imported: number; errors: string[] };
}

export const PresetManager: React.FC<PresetManagerProps> = ({
  presets,
  variables,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  onSetDefault,
  onExportPresets,
  onImportPresets,
}) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [importContent, setImportContent] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [expandedPreset, setExpandedPreset] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les préréglages
  const filteredPresets = presets.filter((preset) =>
    preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    preset.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gérer la sauvegarde d'un préréglage
  const handleSave = useCallback(() => {
    if (!presetName.trim()) return;
    
    onSavePreset(presetName.trim(), presetDescription.trim() || undefined);
    setShowSaveModal(false);
    setPresetName('');
    setPresetDescription('');
  }, [presetName, presetDescription, onSavePreset]);

  // Gérer l'import
  const handleImport = useCallback(() => {
    setImportError(null);
    
    const result = onImportPresets(importContent);
    
    if (result.success) {
      setShowImportModal(false);
      setImportContent('');
    } else {
      setImportError(result.errors.join(', '));
    }
  }, [importContent, onImportPresets]);

  // Exporter les préréglages
  const handleExport = useCallback(() => {
    const data = onExportPresets();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alecia-presets-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [onExportPresets]);

  // Formater la date
  const formatDate = useCallback((date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }, []);

  // Styles
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  };

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

  const buttonStyles = (variant: 'primary' | 'secondary' | 'danger' = 'secondary'): React.CSSProperties => {
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

  const presetCardStyles = (isDefault: boolean): React.CSSProperties => ({
    backgroundColor: '#ffffff',
    border: `1px solid ${isDefault ? BRAND_COLORS.pinkAccent : '#e0e0e0'}`,
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '12px',
    transition: 'all 0.2s',
    boxShadow: isDefault ? '0 2px 8px rgba(233, 30, 99, 0.15)' : 'none',
  });

  const presetHeaderStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '8px',
  };

  const presetNameStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: BRAND_COLORS.darkNavy,
    margin: 0,
  };

  const presetMetaStyles: React.CSSProperties = {
    fontSize: '12px',
    color: '#9e9e9e',
    marginTop: '4px',
  };

  const badgeStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: `${BRAND_COLORS.pinkAccent}20`,
    color: BRAND_COLORS.pinkAccent,
  };

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  };

  const iconButtonStyles = (color: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: 'transparent',
    color,
  });

  // iconButtonStyles is available for future use
  const _iconButtonStyles = iconButtonStyles('#666');
  void _iconButtonStyles;

  const emptyStateStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center',
    color: '#9e9e9e',
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
    maxWidth: '500px',
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    outline: 'none',
    marginBottom: '16px',
  };

  const textareaStyles: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
    marginBottom: '16px',
  };

  const variableListStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '8px',
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  };

  const variableItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 10px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    fontSize: '12px',
  };

  return (
    <div style={containerStyles}>
      {/* Barre d'outils */}
      <div style={toolbarStyles}>
        <input
          type="text"
          placeholder="Rechercher un préréglage..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInputStyles}
        />
        <button
          onClick={() => setShowSaveModal(true)}
          style={buttonStyles('primary')}
          disabled={variables.length === 0}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
          </svg>
          Enregistrer le préréglage
        </button>
      </div>

      {/* Actions secondaires */}
      <div style={{ ...toolbarStyles, paddingTop: 0 }}>
        <button onClick={handleExport} style={buttonStyles('secondary')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
          Exporter
        </button>
        <button onClick={() => setShowImportModal(true)} style={buttonStyles('secondary')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
          </svg>
          Importer
        </button>
      </div>

      {/* Liste des préréglages */}
      <div style={contentStyles}>
        {filteredPresets.length === 0 ? (
          <div style={emptyStateStyles}>
            <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor" style={{ marginBottom: '16px', opacity: 0.3 }}>
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
              <path d="M6 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5z"/>
            </svg>
            <p style={{ margin: 0, fontSize: '14px' }}>
              {searchQuery
                ? 'Aucun préréglage ne correspond à votre recherche'
                : 'Aucun préréglage enregistré. Sauvegardez vos variables pour créer un préréglage.'}
            </p>
          </div>
        ) : (
          filteredPresets.map((preset) => (
            <div
              key={preset.id}
              style={presetCardStyles(preset.isDefault || false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = preset.isDefault ? '0 2px 8px rgba(233, 30, 99, 0.15)' : 'none';
              }}
            >
              <div style={presetHeaderStyles}>
                <div>
                  <h4 style={presetNameStyles}>
                    {preset.name}
                    {preset.isDefault && (
                      <span style={{ ...badgeStyles, marginLeft: '8px' }}>Par défaut</span>
                    )}
                  </h4>
                  <div style={presetMetaStyles}>
                    {preset.variables.length} variable{preset.variables.length > 1 ? 's' : ''} • 
                    Créé le {formatDate(preset.createdAt)}
                  </div>
                  {preset.description && (
                    <p style={{ fontSize: '13px', color: '#666666', margin: '8px 0 0 0' }}>
                      {preset.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Liste des variables du préréglage */}
              {expandedPreset === preset.id && (
                <div style={variableListStyles}>
                  {preset.variables.map((v) => (
                    <div key={v.id} style={variableItemStyles}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: VARIABLE_TYPE_LABELS[v.type] ? '#e91e63' : '#9e9e9e',
                        }}
                      />
                      <code style={{ fontSize: '11px', color: '#666666' }}>{'{{' + v.name + '}}'}</code>
                      <span style={{ marginLeft: 'auto', color: '#333333' }}>{v.value || '-'}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={actionsStyles}>
                <button
                  onClick={() => onLoadPreset(preset.id)}
                  style={buttonStyles('primary')}
                  title="Charger ce préréglage"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                  </svg>
                  Charger
                </button>
                <button
                  onClick={() => setExpandedPreset(expandedPreset === preset.id ? null : preset.id)}
                  style={buttonStyles('secondary')}
                  title="Voir les variables"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                  </svg>
                  {expandedPreset === preset.id ? 'Masquer' : 'Voir'}
                </button>
                {!preset.isDefault && (
                  <button
                    onClick={() => onSetDefault(preset.id)}
                    style={buttonStyles('secondary')}
                    title="Définir comme préréglage par défaut"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                    Défaut
                  </button>
                )}
                <button
                  onClick={() => onDeletePreset(preset.id)}
                  style={buttonStyles('danger')}
                  title="Supprimer"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de sauvegarde */}
      {showSaveModal && (
        <div style={modalOverlayStyles} onClick={() => setShowSaveModal(false)}>
          <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px 0', color: BRAND_COLORS.darkNavy }}>
              Enregistrer le préréglage
            </h3>
            
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>
              Nom du préréglage *
            </label>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Ex: Client TechCorp"
              style={inputStyles}
              autoFocus
            />
            
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>
              Description (optionnelle)
            </label>
            <textarea
              value={presetDescription}
              onChange={(e) => setPresetDescription(e.target.value)}
              placeholder="Description du préréglage..."
              style={textareaStyles}
            />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setPresetName('');
                  setPresetDescription('');
                }}
                style={buttonStyles('secondary')}
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={!presetName.trim()}
                style={{ ...buttonStyles('primary'), opacity: presetName.trim() ? 1 : 0.5 }}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'import */}
      {showImportModal && (
        <div style={modalOverlayStyles} onClick={() => setShowImportModal(false)}>
          <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px 0', color: BRAND_COLORS.darkNavy }}>
              Importer des préréglages
            </h3>
            
            <textarea
              value={importContent}
              onChange={(e) => setImportContent(e.target.value)}
              placeholder="Collez le JSON des préréglages ici..."
              style={{ ...textareaStyles, minHeight: '200px', fontFamily: 'monospace', fontSize: '12px' }}
            />
            
            {importError && (
              <div style={{ color: '#f44336', fontSize: '13px', marginBottom: '16px' }}>
                {importError}
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportContent('');
                  setImportError(null);
                }}
                style={buttonStyles('secondary')}
              >
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
    </div>
  );
};

export default PresetManager;
