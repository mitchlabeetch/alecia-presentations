'use client';

import React, { useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Mic, 
  X,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onFileSelect?: (files: FileList) => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

// Formatage de la taille du fichier
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Icône selon le type de fichier
const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) {
    return <FileSpreadsheet className="w-4 h-4" />;
  }
  return <FileText className="w-4 h-4" />;
};

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onFileSelect,
  isLoading = false,
  isStreaming = false,
  placeholder = 'Envoyer un message...',
  disabled = false,
  maxLength = 2000,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Ajuster la hauteur du textarea automatiquement
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
  }, []);

  // Gestion du changement de valeur
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
      adjustTextareaHeight();
    }
  };

  // Gestion de la touche Entrée
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Envoyer le message
  const handleSend = () => {
    if (canSend) {
      onSend();
      // Réinitialiser la hauteur
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      // Réinitialiser les fichiers attachés
      setAttachedFiles([]);
    }
  };

  // Vérifier si on peut envoyer
  const canSend = (value.trim() || attachedFiles.length > 0) && !isLoading && !isStreaming && !disabled;

  // Gestion des fichiers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: AttachedFile[] = Array.from(files).map((file) => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      
      setAttachedFiles((prev) => [...prev, ...newFiles]);
      
      if (onFileSelect) {
        onFileSelect(files);
      }
    }
    
    // Réinitialiser l'input pour permettre la sélection du même fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowAttachmentMenu(false);
  };

  // Supprimer un fichier attaché
  const removeAttachedFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Démarrer l'enregistrement vocal (simulé)
  const startRecording = () => {
    setIsRecording(true);
    // Simuler l'enregistrement
    setTimeout(() => {
      setIsRecording(false);
      onChange(value + ' (Message vocal transcrit)');
    }, 2000);
  };

  // Arrêter l'enregistrement
  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="relative">
      {/* Fichiers attachés */}
      <AnimatePresence>
        {attachedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 mb-2 px-1"
          >
            {attachedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1a2744] 
                           border border-[#e91e63]/30 rounded-lg text-sm"
              >
                <span className="text-[#e91e63]">{getFileIcon(file.type)}</span>
                <span className="text-gray-300 truncate max-w-[150px]">{file.name}</span>
                <span className="text-gray-500 text-xs">({formatFileSize(file.size)})</span>
                <button
                  onClick={() => removeAttachedFile(file.id)}
                  className="ml-1 p-0.5 hover:bg-[#e91e63]/20 rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-400 hover:text-[#e91e63]" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone de saisie principale */}
      <div className="relative flex items-end gap-2 bg-[#0a1628] border border-[#e91e63]/30 
                      rounded-2xl p-2 focus-within:border-[#e91e63] focus-within:ring-2 
                      focus-within:ring-[#e91e63]/20 transition-all">
        
        {/* Bouton pièce jointe */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            disabled={isLoading || isStreaming || disabled || isRecording}
            className="p-2.5 rounded-xl text-gray-400 hover:text-[#e91e63] 
                       hover:bg-[#e91e63]/10 transition-colors disabled:opacity-50 
                       disabled:cursor-not-allowed"
            title="Joindre un fichier"
          >
            <Paperclip className="w-5 h-5" />
          </motion.button>

          {/* Menu d'attachement */}
          <AnimatePresence>
            {showAttachmentMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-full left-0 mb-2 p-2 bg-[#1a2744] 
                           border border-[#e91e63]/30 rounded-xl shadow-xl z-10"
              >
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 
                             hover:text-white hover:bg-[#e91e63]/10 rounded-lg transition-colors w-full"
                >
                  <FileText className="w-4 h-4" />
                  Document
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 
                             hover:text-white hover:bg-[#e91e63]/10 rounded-lg transition-colors w-full"
                >
                  <ImageIcon className="w-4 h-4" />
                  Image
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input file caché */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.gif"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? 'Enregistrement en cours...' : placeholder}
            disabled={isLoading || isStreaming || disabled || isRecording}
            rows={1}
            className="w-full bg-transparent text-white placeholder-gray-500 
                       resize-none outline-none py-2.5 px-1 min-h-[44px] max-h-[150px]
                       disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ overflow: 'auto' }}
          />
          
          {/* Compteur de caractères */}
          {value.length > 0 && (
            <span className={`absolute right-0 bottom-0 text-xs ${
              value.length > maxLength * 0.9 ? 'text-[#e91e63]' : 'text-gray-600'
            }`}>
              {value.length}/{maxLength}
            </span>
          )}
        </div>

        {/* Bouton micro (enregistrement vocal) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading || isStreaming || disabled || !!value}
          className={`p-2.5 rounded-xl transition-colors disabled:opacity-50 
                      disabled:cursor-not-allowed ${
            isRecording 
              ? 'bg-[#e91e63] text-white animate-pulse' 
              : 'text-gray-400 hover:text-[#e91e63] hover:bg-[#e91e63]/10'
          }`}
          title={isRecording ? 'Arrêter l\'enregistrement' : 'Message vocal'}
        >
          <Mic className="w-5 h-5" />
        </motion.button>

        {/* Bouton envoyer */}
        <motion.button
          whileHover={{ scale: canSend ? 1.05 : 1 }}
          whileTap={{ scale: canSend ? 0.95 : 1 }}
          onClick={handleSend}
          disabled={!canSend}
          className={`p-2.5 rounded-xl transition-all disabled:opacity-50 
                      disabled:cursor-not-allowed ${
            canSend
              ? 'bg-gradient-to-r from-[#e91e63] to-[#c2185b] text-white shadow-lg shadow-[#e91e63]/30'
              : 'bg-gray-700 text-gray-500'
          }`}
          title="Envoyer"
        >
          {isLoading || isStreaming ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Indicateur d'enregistrement */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-8 left-0 right-0 text-center"
          >
            <span className="text-xs text-[#e91e63] bg-[#0a1628] px-3 py-1 rounded-full border border-[#e91e63]/30">
              Cliquez sur le micro pour arrêter
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay pour fermer le menu d'attachement */}
      {showAttachmentMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowAttachmentMenu(false)}
        />
      )}
    </div>
  );
};

export default ChatInput;
