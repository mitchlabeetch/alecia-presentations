import React, { useState } from 'react';
import {
  useExport,
  ExportFormat,
  ExportQuality,
  PresentationData,
  PptxExportOptions,
  PdfExportOptions,
} from './useExport';
import ExportProgress from './ExportProgress';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  presentation: PresentationData;
  defaultFormat?: ExportFormat;
  className?: string;
}

interface ExportSettings {
  format: ExportFormat;
  includeSpeakerNotes: boolean;
  quality: ExportQuality;
  includeAnimations: boolean;
  password: string;
  pageSize: 'a4' | 'letter' | 'screen';
  orientation: 'portrait' | 'landscape';
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  presentation,
  defaultFormat = 'pptx',
  className = '',
}) => {
  const [settings, setSettings] = useState<ExportSettings>({
    format: defaultFormat,
    includeSpeakerNotes: true,
    quality: 'standard',
    includeAnimations: false,
    password: '',
    pageSize: 'screen',
    orientation: 'landscape',
  });

  const [isExporting, setIsExporting] = useState(false);
  const { progress, exportPresentation, resetProgress } = useExport();

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    resetProgress();

    try {
      if (settings.format === 'pptx') {
        const options: PptxExportOptions = {
          includeSpeakerNotes: settings.includeSpeakerNotes,
          quality: settings.quality,
          includeAnimations: settings.includeAnimations,
          password: settings.password || undefined,
        };
        await exportPresentation('pptx', presentation, options);
      } else {
        const options: PdfExportOptions = {
          includeSpeakerNotes: settings.includeSpeakerNotes,
          quality: settings.quality,
          pageSize: settings.pageSize,
          orientation: settings.orientation,
        };
        await exportPresentation('pdf', presentation, options);
      }

      // Close modal after successful export
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1500);
    } catch (error) {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    if (!isExporting) {
      resetProgress();
      onClose();
    }
  };

  const qualityOptions: { value: ExportQuality; label: string }[] = [
    { value: 'standard', label: 'Standard' },
    { value: 'high', label: 'Haute qualité' },
  ];

  const pageSizeOptions: { value: 'a4' | 'letter' | 'screen'; label: string }[] = [
    { value: 'screen', label: 'Écran (16:9)' },
    { value: 'a4', label: 'A4' },
    { value: 'letter', label: 'Lettre US' },
  ];

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div
        style={styles.modal}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Exporter la présentation</h2>
          <button type="button" style={styles.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {isExporting ? (
            <ExportProgress
              status={progress.status}
              progress={progress.progress}
              message={progress.message}
              error={progress.error}
            />
          ) : (
            <>
              {/* Format Selection */}
              <div style={styles.section}>
                <label style={styles.label}>Format d'export</label>
                <div style={styles.formatButtons}>
                  <button
                    type="button"
                    style={{
                      ...styles.formatButton,
                      ...(settings.format === 'pptx'
                        ? styles.formatButtonActive
                        : {}),
                    }}
                    onClick={() =>
                      setSettings({ ...settings, format: 'pptx' })
                    }
                  >
                    <span style={styles.formatIcon}>📊</span>
                    <span style={styles.formatName}>PowerPoint</span>
                    <span style={styles.formatExt}>.pptx</span>
                  </button>
                  <button
                    type="button"
                    style={{
                      ...styles.formatButton,
                      ...(settings.format === 'pdf'
                        ? styles.formatButtonActive
                        : {}),
                    }}
                    onClick={() =>
                      setSettings({ ...settings, format: 'pdf' })
                    }
                  >
                    <span style={styles.formatIcon}>📄</span>
                    <span style={styles.formatName}>PDF</span>
                    <span style={styles.formatExt}>.pdf</span>
                  </button>
                </div>
              </div>

              {/* PPTX Options */}
              {settings.format === 'pptx' && (
                <>
                  <div style={styles.section}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={settings.includeSpeakerNotes}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            includeSpeakerNotes: e.target.checked,
                          })
                        }
                        style={styles.checkbox}
                      />
                      <span>Inclure les notes du présentateur</span>
                    </label>
                  </div>

                  <div style={styles.section}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={settings.includeAnimations}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            includeAnimations: e.target.checked,
                          })
                        }
                        style={styles.checkbox}
                      />
                      <span>Inclure les animations</span>
                    </label>
                  </div>

                  <div style={styles.section}>
                    <label style={styles.label}>Protection par mot de passe</label>
                    <input
                      type="password"
                      placeholder="(Optionnel)"
                      value={settings.password}
                      onChange={(e) =>
                        setSettings({ ...settings, password: e.target.value })
                      }
                      style={styles.passwordInput}
                    />
                    <span style={styles.hint}>
                      Laissez vide pour aucune protection
                    </span>
                  </div>
                </>
              )}

              {/* PDF Options */}
              {settings.format === 'pdf' && (
                <>
                  <div style={styles.section}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={settings.includeSpeakerNotes}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            includeSpeakerNotes: e.target.checked,
                          })
                        }
                        style={styles.checkbox}
                      />
                      <span>Inclure les notes du présentateur</span>
                    </label>
                  </div>

                  <div style={styles.section}>
                    <label style={styles.label}>Format de page</label>
                    <select
                      value={settings.pageSize}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pageSize: e.target.value as 'a4' | 'letter' | 'screen',
                        })
                      }
                      style={styles.select}
                    >
                      {pageSizeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.section}>
                    <label style={styles.label}>Orientation</label>
                    <div style={styles.orientationButtons}>
                      <button
                        type="button"
                        style={{
                          ...styles.orientationButton,
                          ...(settings.orientation === 'landscape'
                            ? styles.orientationButtonActive
                            : {}),
                        }}
                        onClick={() =>
                          setSettings({ ...settings, orientation: 'landscape' })
                        }
                      >
                        ⬭ Paysage
                      </button>
                      <button
                        type="button"
                        style={{
                          ...styles.orientationButton,
                          ...(settings.orientation === 'portrait'
                            ? styles.orientationButtonActive
                            : {}),
                        }}
                        onClick={() =>
                          setSettings({ ...settings, orientation: 'portrait' })
                        }
                      >
                        ⬯ Portrait
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Quality (Common) */}
              <div style={styles.section}>
                <label style={styles.label}>Qualité</label>
                <div style={styles.qualityButtons}>
                  {qualityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      style={{
                        ...styles.qualityButton,
                        ...(settings.quality === opt.value
                          ? styles.qualityButtonActive
                          : {}),
                      }}
                      onClick={() =>
                        setSettings({ ...settings, quality: opt.value })
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div style={styles.summary}>
                <h4 style={styles.summaryTitle}>Résumé</h4>
                <div style={styles.summaryRow}>
                  <span>Présentation:</span>
                  <span style={styles.summaryValue}>{presentation.title}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Diapositives:</span>
                  <span style={styles.summaryValue}>
                    {presentation.slides.length}
                  </span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Format:</span>
                  <span style={styles.summaryValue}>
                    {settings.format.toUpperCase()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isExporting && (
          <div style={styles.footer}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={handleClose}
            >
              Annuler
            </button>
            <button
              type="button"
              style={styles.exportButton}
              onClick={handleExport}
            >
              {settings.format === 'pptx'
                ? 'Télécharger en PPTX'
                : 'Télécharger en PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#0a1628',
    margin: 0,
  },
  closeButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    color: '#64748b',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
  },
  section: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#0a1628',
    marginBottom: '8px',
  },
  formatButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  formatButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  formatButtonActive: {
    borderColor: '#e91e63',
    backgroundColor: '#fdf2f8',
  },
  formatIcon: {
    fontSize: '32px',
  },
  formatName: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#0a1628',
  },
  formatExt: {
    fontSize: '12px',
    color: '#64748b',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#0a1628',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#e91e63',
    cursor: 'pointer',
  },
  passwordInput: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  hint: {
    display: 'block',
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '4px',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    outline: 'none',
  },
  orientationButtons: {
    display: 'flex',
    gap: '12px',
  },
  orientationButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  orientationButtonActive: {
    borderColor: '#e91e63',
    backgroundColor: '#fdf2f8',
    color: '#e91e63',
  },
  qualityButtons: {
    display: 'flex',
    gap: '12px',
  },
  qualityButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  qualityButtonActive: {
    borderColor: '#e91e63',
    backgroundColor: '#fdf2f8',
    color: '#e91e63',
  },
  summary: {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    marginTop: '24px',
  },
  summaryTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0a1628',
    margin: '0 0 12px 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '4px',
  },
  summaryValue: {
    color: '#0a1628',
    fontWeight: 500,
  },
  footer: {
    display: 'flex',
    gap: '12px',
    padding: '20px 24px',
    borderTop: '1px solid #e2e8f0',
  },
  cancelButton: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#64748b',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  exportButton: {
    flex: 2,
    padding: '12px 20px',
    backgroundColor: '#e91e63',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
};

export default ExportModal;
