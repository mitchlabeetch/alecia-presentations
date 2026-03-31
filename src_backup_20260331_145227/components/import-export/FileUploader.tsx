import React from 'react';
import { useFileUpload, UploadedFile } from './useFileUpload';

interface FileUploaderProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  onFileUploaded?: (file: UploadedFile) => void;
  onUploadError?: (file: UploadedFile, error: string) => void;
  acceptedFormats?: string[];
  maxFileSize?: number;
  allowMultiple?: boolean;
  showPreview?: boolean;
  className?: string;
  uploadButtonText?: string;
  dropzoneText?: string;
  supportedFormatsText?: string;
}

const FILE_TYPE_ICONS: Record<string, string> = {
  'image/png': '🖼️',
  'image/jpeg': '🖼️',
  'image/jpg': '🖼️',
  'image/svg+xml': '🎨',
  'image/webp': '🖼️',
  'application/pdf': '📄',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📊',
  'application/vnd.ms-powerpoint': '📊',
};

const getFileIcon = (mimeType: string): string => {
  return FILE_TYPE_ICONS[mimeType] || '📎';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesUploaded,
  onFileUploaded,
  onUploadError,
  acceptedFormats = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/svg+xml',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowMultiple = true,
  showPreview = true,
  className = '',
  uploadButtonText = 'Parcourir',
  dropzoneText = 'Glisser-déposer vos fichiers ici',
  supportedFormatsText = 'Formats supportés',
}) => {
  const {
    files,
    isDragging,
    inputRef,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleInputChange,
    openFileDialog,
    removeFile,
    getSuccessfulFiles,
  } = useFileUpload({
    maxFileSize,
    allowedTypes: acceptedFormats,
    generateThumbnails: true,
    onFileUploaded: (file) => {
      onFileUploaded?.(file);
      const successfulFiles = getSuccessfulFiles();
      onFilesUploaded?.(successfulFiles);
    },
    onUploadError,
  });

  const getSupportedFormatsDisplay = (): string => {
    const formats = acceptedFormats.map((format) => {
      if (format.startsWith('image/')) {
        return format.replace('image/', '').toUpperCase();
      }
      if (format.includes('presentationml')) {
        return 'PPTX';
      }
      if (format === 'application/pdf') {
        return 'PDF';
      }
      return format;
    });
    return formats.join(', ');
  };

  const successfulUploads = files.filter((f) => f.status === 'success');
  const pendingUploads = files.filter((f) => f.status === 'uploading');
  const errorUploads = files.filter((f) => f.status === 'error');

  return (
    <div className={`file-uploader ${className}`} style={styles.container}>
      {/* Dropzone */}
      <div
        style={{
          ...styles.dropzone,
          ...(isDragging ? styles.dropzoneActive : {}),
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={inputRef}
          type="file"
          style={styles.hiddenInput}
          onChange={handleInputChange}
          accept={acceptedFormats.join(',')}
          multiple={allowMultiple}
        />
        <div style={styles.dropzoneContent}>
          <div style={styles.uploadIcon}>📁</div>
          <p style={styles.dropzoneText}>{dropzoneText}</p>
          <p style={styles.orText}>ou</p>
          <button
            type="button"
            style={styles.browseButton}
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
          >
            {uploadButtonText}
          </button>
          <p style={styles.supportedFormats}>
            {supportedFormatsText}: {getSupportedFormatsDisplay()}
          </p>
          <p style={styles.maxSize}>
            Taille maximale: {formatFileSize(maxFileSize)}
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {pendingUploads.length > 0 && (
        <div style={styles.progressSection}>
          <h4 style={styles.sectionTitle}>Téléchargement en cours...</h4>
          {pendingUploads.map((file) => (
            <div key={file.id} style={styles.progressItem}>
              <div style={styles.progressInfo}>
                <span style={styles.fileIcon}>{getFileIcon(file.mimeType)}</span>
                <span style={styles.fileName}>{file.name}</span>
                <span style={styles.fileSize}>{formatFileSize(file.size)}</span>
              </div>
              <div style={styles.progressBarContainer}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${Math.min(file.progress, 100)}%`,
                  }}
                />
              </div>
              <span style={styles.progressPercent}>
                {Math.round(file.progress)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Error Files */}
      {errorUploads.length > 0 && (
        <div style={styles.errorSection}>
          <h4 style={styles.sectionTitle}>Erreurs</h4>
          {errorUploads.map((file) => (
            <div key={file.id} style={styles.errorItem}>
              <span style={styles.fileIcon}>⚠️</span>
              <div style={styles.errorInfo}>
                <span style={styles.fileName}>{file.name}</span>
                <span style={styles.errorMessage}>{file.errorMessage}</span>
              </div>
              <button
                type="button"
                style={styles.removeButton}
                onClick={() => removeFile(file.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File Preview */}
      {showPreview && successfulUploads.length > 0 && (
        <div style={styles.previewSection}>
          <h4 style={styles.sectionTitle}>
            Fichiers téléchargés ({successfulUploads.length})
          </h4>
          <div style={styles.previewGrid}>
            {successfulUploads.map((file) => (
              <div key={file.id} style={styles.previewItem}>
                <button
                  type="button"
                  style={styles.removePreviewButton}
                  onClick={() => removeFile(file.id)}
                  title="Supprimer"
                >
                  ✕
                </button>
                {file.thumbnail ? (
                  <img
                    src={file.thumbnail}
                    alt={file.name}
                    style={styles.previewImage}
                  />
                ) : (
                  <div style={styles.previewPlaceholder}>
                    <span style={styles.previewIcon}>
                      {getFileIcon(file.mimeType)}
                    </span>
                  </div>
                )}
                <div style={styles.previewInfo}>
                  <span style={styles.previewName} title={file.name}>
                    {file.name.length > 20
                      ? `${file.name.substring(0, 20)}...`
                      : file.name}
                  </span>
                  <span style={styles.previewSize}>
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  dropzone: {
    border: '2px dashed #cbd5e1',
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#f8fafc',
  },
  dropzoneActive: {
    borderColor: '#e91e63',
    backgroundColor: '#fdf2f8',
  },
  hiddenInput: {
    display: 'none',
  },
  dropzoneContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  uploadIcon: {
    fontSize: '48px',
    marginBottom: '8px',
  },
  dropzoneText: {
    fontSize: '18px',
    fontWeight: 500,
    color: '#0a1628',
    margin: 0,
  },
  orText: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  browseButton: {
    padding: '10px 24px',
    backgroundColor: '#0a1628',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  supportedFormats: {
    fontSize: '12px',
    color: '#64748b',
    margin: '8px 0 0 0',
  },
  maxSize: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: '4px 0 0 0',
  },
  progressSection: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0a1628',
    margin: '0 0 12px 0',
  },
  progressItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  progressInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: 0,
  },
  fileIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  fileName: {
    fontSize: '14px',
    color: '#0a1628',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
  },
  fileSize: {
    fontSize: '12px',
    color: '#64748b',
    flexShrink: 0,
  },
  progressBarContainer: {
    flex: 1,
    height: '6px',
    backgroundColor: '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#e91e63',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  progressPercent: {
    fontSize: '12px',
    color: '#64748b',
    minWidth: '40px',
    textAlign: 'right',
  },
  errorSection: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#fef2f2',
    borderRadius: '8px',
    border: '1px solid #fecaca',
  },
  errorItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0',
    borderBottom: '1px solid #fecaca',
  },
  errorInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
  },
  errorMessage: {
    fontSize: '12px',
    color: '#dc2626',
  },
  removeButton: {
    padding: '4px 8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  },
  previewSection: {
    marginTop: '24px',
  },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '16px',
  },
  previewItem: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
  },
  removePreviewButton: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    padding: '4px 6px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '12px',
    borderRadius: '4px',
    zIndex: 1,
    transition: 'background-color 0.2s ease',
  },
  previewImage: {
    width: '100%',
    height: '100px',
    objectFit: 'cover',
  },
  previewPlaceholder: {
    width: '100%',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e2e8f0',
  },
  previewIcon: {
    fontSize: '32px',
  },
  previewInfo: {
    padding: '8px',
    backgroundColor: '#ffffff',
  },
  previewName: {
    display: 'block',
    fontSize: '12px',
    color: '#0a1628',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  previewSize: {
    display: 'block',
    fontSize: '10px',
    color: '#64748b',
    marginTop: '2px',
  },
};

export default FileUploader;
