import { useState, useCallback, useRef } from 'react';

export type FileType = 'image' | 'pptx' | 'pdf' | 'unknown';

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: FileType;
  mimeType: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
  thumbnail?: string;
  url?: string;
}

export interface FileUploadOptions {
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  generateThumbnails?: boolean;
  onFileUploaded?: (file: UploadedFile) => void;
  onUploadError?: (file: UploadedFile, error: string) => void;
}

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
  'image/webp',
];

const ALLOWED_DOCUMENT_TYPES = [
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
];

const getFileType = (mimeType: string): FileType => {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return 'image';
  if (ALLOWED_DOCUMENT_TYPES.includes(mimeType)) return 'pptx';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'unknown';
};

const generateThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve('');
          return;
        }

        const maxSize = 200;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => resolve('');
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

export const useFileUpload = (options: FileUploadOptions = {}) => {
  const {
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    allowedTypes,
    generateThumbnails: shouldGenerateThumbnails = true,
    onFileUploaded,
    onUploadError,
  } = options;

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `Le fichier dépasse la taille maximale de ${(maxFileSize / 1024 / 1024).toFixed(0)} Mo`;
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return `Format de fichier non supporté. Formats acceptés: ${allowedTypes.join(', ')}`;
    }

    const fileType = getFileType(file.type);
    if (fileType === 'unknown') {
      return 'Type de fichier non reconnu';
    }

    return null;
  };

  const createUploadedFile = (file: File): UploadedFile => ({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    file,
    name: file.name,
    size: file.size,
    type: getFileType(file.type),
    mimeType: file.type,
    progress: 0,
    status: 'pending',
  });

  const simulateUpload = useCallback(async (uploadedFile: UploadedFile) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === uploadedFile.id ? { ...f, status: 'uploading' } : f
      )
    );

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id === uploadedFile.id && f.progress < 90) {
            return { ...f, progress: f.progress + Math.random() * 15 };
          }
          return f;
        })
      );
    }, 200);

    try {
      // Generate thumbnail if it's an image
      let thumbnail = '';
      if (shouldGenerateThumbnails && uploadedFile.type === 'image') {
        thumbnail = await generateThumbnail(uploadedFile.file);
      }

      // Create object URL for the file
      const url = URL.createObjectURL(uploadedFile.file);

      clearInterval(progressInterval);

      const completedFile: UploadedFile = {
        ...uploadedFile,
        progress: 100,
        status: 'success',
        thumbnail,
        url,
      };

      setFiles((prev) =>
        prev.map((f) => (f.id === uploadedFile.id ? completedFile : f))
      );

      onFileUploaded?.(completedFile);
    } catch (error) {
      clearInterval(progressInterval);
      const errorFile: UploadedFile = {
        ...uploadedFile,
        status: 'error',
        errorMessage: 'Erreur lors du téléchargement',
      };
      setFiles((prev) =>
        prev.map((f) => (f.id === uploadedFile.id ? errorFile : f))
      );
      onUploadError?.(errorFile, 'Erreur lors du téléchargement');
    }
  }, [shouldGenerateThumbnails, onFileUploaded, onUploadError]);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList) return;

      const newFiles: UploadedFile[] = [];

      Array.from(fileList).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          const errorFile = createUploadedFile(file);
          errorFile.status = 'error';
          errorFile.errorMessage = error;
          newFiles.push(errorFile);
          onUploadError?.(errorFile, error);
        } else {
          newFiles.push(createUploadedFile(file));
        }
      });

      setFiles((prev) => [...prev, ...newFiles]);

      // Start upload for valid files
      newFiles
        .filter((f) => f.status === 'pending')
        .forEach((f) => simulateUpload(f));
    },
    [simulateUpload, onUploadError]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset input value to allow uploading the same file again
      e.target.value = '';
    },
    [handleFiles]
  );

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.url) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => {
        if (f.url) URL.revokeObjectURL(f.url);
      });
      return [];
    });
  }, []);

  const getImageFiles = useCallback(
    () => files.filter((f) => f.type === 'image' && f.status === 'success'),
    [files]
  );

  const getPptxFiles = useCallback(
    () => files.filter((f) => f.type === 'pptx' && f.status === 'success'),
    [files]
  );

  const getSuccessfulFiles = useCallback(
    () => files.filter((f) => f.status === 'success'),
    [files]
  );

  return {
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
    clearFiles,
    getImageFiles,
    getPptxFiles,
    getSuccessfulFiles,
  };
};

export default useFileUpload;
