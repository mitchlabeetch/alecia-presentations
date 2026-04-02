import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface ImportDropzoneProps {
  onFileSelect: (file: File) => void;
}

export function ImportDropzone({ onFileSelect }: ImportDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const validExtensions = ['.pptx', '.pdf'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(extension)) {
      setError('Format non supporté. Utilisez PPTX ou PDF.');
      return false;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Fichier trop volumineux. Maximum 50 Mo.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
          ${isDragging
            ? 'border-alecia-navy bg-alecia-navy/5'
            : 'border-alecia-silver/30 hover:border-alecia-silver'
          }
        `}
      >
        <input
          type="file"
          accept=".pptx,.pdf"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-alecia-navy' : 'text-alecia-silver'}`} />
          <p className="text-alecia-navy font-medium mb-1">
            Glissez-déposez votre fichier ici
          </p>
          <p className="text-sm text-alecia-silver">
            ou cliquez pour sélectionner
          </p>
        </label>
      </div>

      <div className="flex items-center justify-center gap-4 text-sm text-alecia-silver">
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          <span>PPTX</span>
        </div>
        <span>|</span>
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          <span>PDF</span>
        </div>
        <span>|</span>
        <span>Max 50 Mo</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-alecia-red text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
