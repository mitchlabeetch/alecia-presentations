import React, { useState, useCallback } from 'react';
import FileUploader, { UploadedFile } from './useFileUpload';

export interface ImportedPresentation {
  title: string;
  slides: ImportedSlide[];
  author?: string;
  company?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export interface ImportedSlide {
  id: string;
  title?: string;
  content?: string;
  layout: string;
  elements: ImportedElement[];
  notes?: string;
}

export interface ImportedElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'chart' | 'table';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: Record<string, unknown>;
}

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (presentation: ImportedPresentation) => void;
  onFilesImported?: (files: UploadedFile[]) => void;
  projectId?: string;
  className?: string;
}

interface ImportOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  acceptedFormats: string[];
}

const importOptions: ImportOption[] = [
  {
    id: 'pptx',
    label: 'PowerPoint',
    description: 'Importer une présentation PowerPoint existante',
    icon: '📊',
    acceptedFormats: [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
    ],
  },
  {
    id: 'images',
    label: 'Images',
    description: 'Importer des images ou logos',
    icon: '🖼️',
    acceptedFormats: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'],
  },
  {
    id: 'templates',
    label: 'Modèles',
    description: 'Charger un modèle de présentation',
    icon: '📋',
    acceptedFormats: [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/json',
    ],
  },
];

const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  onFilesImported,
  projectId,
  className = '',
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('pptx');
  const [importedFiles, setImportedFiles] = useState<UploadedFile[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [parseMessage, setParseMessage] = useState('');
  const [parsedPresentation, setParsedPresentation] = useState<ImportedPresentation | null>(null);

  if (!isOpen) return null;

  const currentOption = importOptions.find((opt) => opt.id === selectedOption);

  // Parse PPTX file client-side using JSZip
  const parsePptxFile = useCallback(async (file: File): Promise<ImportedPresentation> => {
    setIsParsing(true);
    setParseProgress(0);
    setParseMessage('Analyse du fichier PowerPoint...');

    try {
      const JSZip = require('jszip');
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);

      setParseProgress(20);
      setParseMessage('Lecture des métadonnées...');

      // Parse core.xml for metadata
      const coreXml = await zip.file('docProps/core.xml')?.async('text');
      const appXml = await zip.file('docProps/app.xml')?.async('text');

      let title = file.name.replace(/\.[^/.]+$/, '');
      let author = 'Importé';

      if (coreXml) {
        const titleMatch = coreXml.match(/<dc:title>([^<]*)<\/dc:title>/);
        const creatorMatch = coreXml.match(/<dc:creator>([^<]*)<\/dc:creator>/);
        if (titleMatch?.[1]) title = decodeXmlEntities(titleMatch[1]);
        if (creatorMatch?.[1]) author = decodeXmlEntities(creatorMatch[1]);
      }

      setParseProgress(40);
      setParseMessage('Extraction des diapositives...');

      // Find and sort slide files
      const slideFiles = zip.file(/ppt\/slides\/slide[0-9]+\.xml$/);
      const sortedFiles = slideFiles.sort((a: any, b: any) => {
        const numA = parseInt(a.name.match(/slide(\d+)\.xml$/)?.[1] || '0');
        const numB = parseInt(b.name.match(/slide(\d+)\.xml$/)?.[1] || '0');
        return numA - numB;
      });

      const slides: ImportedSlide[] = [];

      for (let i = 0; i < sortedFiles.length; i++) {
        const slideXml = await sortedFiles[i].async('text');
        const slideNumber = i + 1;

        setParseProgress(40 + Math.round((i / sortedFiles.length) * 40));
        setParseMessage(`Analyse de la diapositive ${slideNumber}...`);

        // Extract slide title
        const titleMatch = slideXml.match(
          /<p:sp[^>]*>[\s\S]*?<p:ph[^>]*type="title"[^>]*>[\s\S]*?<a:t>([^<]*)<\/a:t>[\s\S]*?<\/p:sp>/
        );
        const slideTitle = titleMatch?.[1]
          ? decodeXmlEntities(titleMatch[1])
          : `Diapositive ${slideNumber}`;

        // Extract text content
        const textMatches = slideXml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
        const texts = textMatches.map((m: string) => decodeXmlEntities(m.replace(/<\/?a:t>/g, '')));
        const content = texts.filter((t: string) => t && t.length > 2).join('\n');

        // Determine layout
        let layout = 'content';
        if (slideXml.includes('type="title"')) layout = 'title';
        else if (slideXml.includes('type="ctrTitle"')) layout = 'cover';
        else if (slideXml.includes('type="sectionHeader"')) layout = 'section';

        // Extract notes
        const notesXml = await zip
          .file(`ppt/notesSlides/notesSlide${slideNumber}.xml`)
          ?.async('text');
        let notes: string | undefined;
        if (notesXml) {
          const notesMatch = notesXml.match(/<a:t>([^<]*)<\/a:t>/g);
          if (notesMatch) {
            notes = notesMatch
              .map((m: string) => m.replace(/<\/?a:t>/g, ''))
              .join(' ')
              .trim();
          }
        }

        slides.push({
          id: `slide-${slideNumber}`,
          title: slideTitle.substring(0, 50),
          content: content.substring(0, 500),
          layout,
          elements: [],
          notes,
        });
      }

      setParseProgress(90);
      setParseMessage("Finalisation de l'aperçu...");

      const presentation: ImportedPresentation = {
        title,
        author,
        slides,
      };

      setParseProgress(100);
      setParseMessage('Analyse terminée !');

      return presentation;
    } catch (error) {
      console.error('Error parsing PPTX:', error);
      throw new Error("Impossible d'analyser le fichier PowerPoint");
    } finally {
      setIsParsing(false);
    }
  }, []);

  const decodeXmlEntities = (text: string): string => {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  };

  const handleFilesUploaded = useCallback(
    async (files: UploadedFile[]) => {
      setImportedFiles(files);
      onFilesImported?.(files);

      // If it's a PPTX file, parse it
      const pptxFile = files.find(
        (f) =>
          f.mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      );
      if (pptxFile && selectedOption === 'pptx') {
        try {
          const presentation = await parsePptxFile(pptxFile.file);
          setParsedPresentation(presentation);
        } catch (error) {
          console.error('Failed to parse PPTX:', error);
          setParseMessage('');
          setIsParsing(false);
        }
      }
    },
    [onFilesImported, selectedOption, parsePptxFile]
  );

  const handleImport = useCallback(() => {
    if (parsedPresentation) {
      onImport?.(parsedPresentation);
    }
    handleClose();
  }, [parsedPresentation, onImport]);

  const handleClose = useCallback(() => {
    setImportedFiles([]);
    setParsedPresentation(null);
    setIsParsing(false);
    setParseProgress(0);
    setParseMessage('');
    onClose();
  }, [onClose]);

  const handleOptionChange = (optionId: string) => {
    setSelectedOption(optionId);
    setImportedFiles([]);
    setParsedPresentation(null);
  };

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} className={className} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Importer</h2>
          <button type="button" style={styles.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Import Options */}
          {!parsedPresentation && !isParsing && (
            <div style={styles.optionsSection}>
              <label style={styles.label}>Type d'import</label>
              <div style={styles.optionsGrid}>
                {importOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    style={{
                      ...styles.optionButton,
                      ...(selectedOption === option.id ? styles.optionButtonActive : {}),
                    }}
                    onClick={() => handleOptionChange(option.id)}
                  >
                    <span style={styles.optionIcon}>{option.icon}</span>
                    <span style={styles.optionLabel}>{option.label}</span>
                    <span style={styles.optionDescription}>{option.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* File Upload */}
          {!parsedPresentation && !isParsing && (
            <div style={styles.uploadSection}>
              <FileUploader
                onFilesUploaded={handleFilesUploaded}
                acceptedFormats={currentOption?.acceptedFormats}
                allowMultiple={selectedOption === 'images'}
                dropzoneText="Glisser-déposer vos fichiers ici"
                uploadButtonText="ou cliquer pour parcourir"
                supportedFormatsText="Formats supportés"
              />
            </div>
          )}

          {/* Parsing Progress */}
          {isParsing && (
            <div style={styles.parsingSection}>
              <div style={styles.parsingIcon}>⏳</div>
              <p style={styles.parsingMessage}>{parseMessage}</p>
              <div style={styles.progressBarContainer}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${parseProgress}%`,
                  }}
                />
              </div>
              <span style={styles.progressPercent}>{parseProgress}%</span>
            </div>
          )}

          {/* Preview */}
          {parsedPresentation && (
            <div style={styles.previewSection}>
              <h3 style={styles.previewTitle}>Aperçu de l'import</h3>

              <div style={styles.previewInfo}>
                <div style={styles.previewRow}>
                  <span style={styles.previewLabel}>Titre:</span>
                  <span style={styles.previewValue}>{parsedPresentation.title}</span>
                </div>
                <div style={styles.previewRow}>
                  <span style={styles.previewLabel}>Diapositives:</span>
                  <span style={styles.previewValue}>{parsedPresentation.slides.length}</span>
                </div>
                {parsedPresentation.author && (
                  <div style={styles.previewRow}>
                    <span style={styles.previewLabel}>Auteur:</span>
                    <span style={styles.previewValue}>{parsedPresentation.author}</span>
                  </div>
                )}
              </div>

              <div style={styles.slidesPreview}>
                <h4 style={styles.slidesTitle}>Diapositives détectées</h4>
                <div style={styles.slidesGrid}>
                  {parsedPresentation.slides.map((slide, index) => (
                    <div key={slide.id} style={styles.slidePreview}>
                      <div style={styles.slideNumber}>{index + 1}</div>
                      <div style={styles.slideContent}>
                        <span style={styles.slideTitle}>
                          {slide.title || `Diapositive ${index + 1}`}
                        </span>
                        <span style={styles.slideElements}>{slide.elements.length} élément(s)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.importActions}>
                <button
                  type="button"
                  style={styles.cancelImportButton}
                  onClick={() => {
                    setParsedPresentation(null);
                    setImportedFiles([]);
                  }}
                >
                  Annuler
                </button>
                <button type="button" style={styles.confirmImportButton} onClick={handleImport}>
                  Importer la présentation
                </button>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {selectedOption === 'images' && importedFiles.length > 0 && (
            <div style={styles.imagePreviewSection}>
              <h3 style={styles.previewTitle}>Images importées</h3>
              <div style={styles.imageGrid}>
                {importedFiles.map((file) => (
                  <div key={file.id} style={styles.imagePreviewItem}>
                    {file.thumbnail ? (
                      <img src={file.thumbnail} alt={file.name} style={styles.imageThumbnail} />
                    ) : (
                      <div style={styles.imagePlaceholder}>🖼️</div>
                    )}
                    <span style={styles.imageName}>{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
    maxWidth: '640px',
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
  optionsSection: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#0a1628',
    marginBottom: '12px',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  optionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 12px',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  optionButtonActive: {
    borderColor: '#e91e63',
    backgroundColor: '#fdf2f8',
  },
  optionIcon: {
    fontSize: '28px',
  },
  optionLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#0a1628',
  },
  optionDescription: {
    fontSize: '11px',
    color: '#64748b',
    textAlign: 'center',
  },
  uploadSection: {
    marginBottom: '24px',
  },
  parsingSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    textAlign: 'center',
  },
  parsingIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  parsingMessage: {
    fontSize: '16px',
    color: '#0a1628',
    margin: '0 0 20px 0',
  },
  progressBarContainer: {
    width: '100%',
    maxWidth: '300px',
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#e91e63',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressPercent: {
    fontSize: '14px',
    color: '#64748b',
  },
  previewSection: {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
  },
  previewTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0a1628',
    margin: '0 0 16px 0',
  },
  previewInfo: {
    marginBottom: '20px',
  },
  previewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  previewLabel: {
    fontSize: '13px',
    color: '#64748b',
  },
  previewValue: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#0a1628',
  },
  slidesPreview: {
    marginBottom: '20px',
  },
  slidesTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#0a1628',
    margin: '0 0 12px 0',
  },
  slidesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '12px',
  },
  slidePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  slideNumber: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a1628',
    color: '#ffffff',
    borderRadius: '50%',
    fontSize: '12px',
    fontWeight: 600,
    flexShrink: 0,
  },
  slideContent: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  slideTitle: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#0a1628',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  slideElements: {
    fontSize: '10px',
    color: '#64748b',
  },
  importActions: {
    display: 'flex',
    gap: '12px',
  },
  cancelImportButton: {
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
  confirmImportButton: {
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
  imagePreviewSection: {
    marginTop: '24px',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '12px',
  },
  imagePreviewItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  imageThumbnail: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e2e8f0',
    borderRadius: '8px',
    fontSize: '32px',
  },
  imageName: {
    fontSize: '11px',
    color: '#64748b',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
};

export default ImportModal;
