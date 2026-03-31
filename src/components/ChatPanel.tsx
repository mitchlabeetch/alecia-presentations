import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Paperclip, 
  Smile,
  MoreVertical,
  Trash2,
  Edit2,
  Check,
  CheckCheck,
  Clock,
  Bot,
  User,
  ChevronDown,
  Image as ImageIcon,
  FileText,
  Download
} from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { Badge } from './Badge';
import { Tooltip } from './Tooltip';
import { Dropdown } from './Dropdown';

export type MessageType = 'user' | 'ai' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error';

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
    color?: string;
  };
  status?: MessageStatus;
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: number;
    url?: string;
  }[];
  isEdited?: boolean;
  replyTo?: string;
  suggestions?: string[];
}

export interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (content: string, attachments?: File[]) => void;
  onEditMessage?: (id: string, content: string) => void;
  onDeleteMessage?: (id: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
  isTyping?: boolean;
  currentUserId: string;
  title?: string;
  placeholder?: string;
  showAIIndicator?: boolean;
}

const statusIcons: Record<MessageStatus, React.ReactNode> = {
  sending: <Clock className="w-3 h-3" />,
  sent: <Check className="w-3 h-3" />,
  delivered: <CheckCheck className="w-3 h-3" />,
  read: <CheckCheck className="w-3 h-3 text-blue-400" />,
  error: <Clock className="w-3 h-3 text-red-400" />,
};

const suggestions = [
  "Génère un résumé de cette présentation",
  "Suggère des améliorations pour cette slide",
  "Crée un graphique avec ces données",
  "Aide-moi à rédiger ce texte",
  "Quelles sont les tendances actuelles ?",
];

export const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onSuggestionClick,
  isTyping = false,
  currentUserId,
  title = 'Assistant Alecia',
  placeholder = 'Écrivez votre message...',
  showAIIndicator = true,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim() || attachments.length > 0) {
      onSendMessage(inputValue.trim(), attachments);
      setInputValue('');
      setAttachments([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEdit = (message: ChatMessage) => {
    setEditingMessageId(message.id);
    setEditValue(message.content);
  };

  const handleSaveEdit = () => {
    if (editingMessageId && editValue.trim()) {
      onEditMessage?.(editingMessageId, editValue.trim());
      setEditingMessageId(null);
      setEditValue('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a1628] border-l border-[#1e3a5f] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-[#1e3a5f] bg-[#0d1a2d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e63] to-[#9c27b0] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400">En ligne</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip content="Réduire" position="bottom">
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </Tooltip>
                <Tooltip content="Fermer" position="bottom">
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#e91e63] to-[#9c27b0] flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">
                    Bonjour ! Je suis l'assistant Alecia
                  </h4>
                  <p className="text-sm text-gray-400 mb-6">
                    Je peux vous aider à créer, modifier et améliorer vos présentations.
                  </p>
                </motion.div>
              )}

              {/* Suggestions */}
              {showSuggestions && messages.length < 3 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSuggestionClick?.(suggestion)}
                        className="px-3 py-2 bg-[#1e3a5f] hover:bg-[#2a4a73] text-gray-300 text-sm rounded-lg transition-colors text-left"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message List */}
              {messages.map((message, index) => {
                const isOwnMessage = message.sender?.id === currentUserId;
                const isAI = message.type === 'ai';
                const showAvatar = !isOwnMessage || isAI;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    {showAvatar && (
                      <div 
                        className={`
                          w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                          ${isAI 
                            ? 'bg-gradient-to-br from-[#e91e63] to-[#9c27b0]' 
                            : 'bg-[#1e3a5f]'
                          }
                        `}
                      >
                        {isAI ? (
                          <Bot className="w-4 h-4 text-white" />
                        ) : message.sender?.avatar ? (
                          <img 
                            src={message.sender.avatar} 
                            alt={message.sender.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    )}

                    {/* Message Content */}
                    <div className={`flex-1 ${isOwnMessage ? 'text-right' : ''}`}>
                      {/* Sender Name */}
                      {message.sender && !isOwnMessage && (
                        <span className="text-xs text-gray-500 mb-1 block">
                          {message.sender.name}
                        </span>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`
                          inline-block max-w-[85%] text-left
                          ${isOwnMessage 
                            ? 'bg-[#e91e63] text-white rounded-2xl rounded-tr-sm' 
                            : isAI
                              ? 'bg-[#1e3a5f] text-white rounded-2xl rounded-tl-sm border border-[#3a5a7f]'
                              : 'bg-[#111d2e] text-gray-200 rounded-2xl rounded-tl-sm'
                          }
                          px-4 py-2.5
                        `}
                      >
                        {editingMessageId === message.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') setEditingMessageId(null);
                              }}
                              className="bg-transparent border-none outline-none text-white"
                              autoFocus
                            />
                            <button onClick={handleSaveEdit}>
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}

                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment) => (
                              <div 
                                key={attachment.id}
                                className="flex items-center gap-2 p-2 bg-black/20 rounded-lg"
                              >
                                <FileText className="w-4 h-4" />
                                <span className="text-xs truncate flex-1">{attachment.name}</span>
                                <span className="text-xs opacity-70">{formatFileSize(attachment.size)}</span>
                                {attachment.url && (
                                  <a href={attachment.url} download className="p-1 hover:bg-white/10 rounded">
                                    <Download className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Message Meta */}
                      <div className={`flex items-center gap-2 mt-1 ${isOwnMessage ? 'justify-end' : ''}`}>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.isEdited && (
                          <span className="text-xs text-gray-500">(modifié)</span>
                        )}
                        {isOwnMessage && message.status && (
                          <span className="text-gray-500">
                            {statusIcons[message.status]}
                          </span>
                        )}
                        {isOwnMessage && onEditMessage && onDeleteMessage && (
                          <Dropdown
                            trigger={
                              <button className="p-1 rounded text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100">
                                <MoreVertical className="w-3 h-3" />
                              </button>
                            }
                            items={[
                              { id: 'edit', label: 'Modifier', icon: <Edit2 className="w-3 h-3" /> },
                              { id: 'delete', label: 'Supprimer', icon: <Trash2 className="w-3 h-3" /> },
                            ]}
                            onSelect={(item) => {
                              if (item.id === 'edit') handleEdit(message);
                              if (item.id === 'delete') onDeleteMessage(message.id);
                            }}
                            width="sm"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e91e63] to-[#9c27b0] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[#1e3a5f] rounded-2xl rounded-tl-sm px-4 py-3 border border-[#3a5a7f]">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#1e3a5f] bg-[#0d1a2d]">
              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {attachments.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 px-2 py-1 bg-[#1e3a5f] rounded-lg text-sm"
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 truncate max-w-[120px]">{file.name}</span>
                      <button 
                        onClick={() => removeAttachment(index)}
                        className="p-0.5 hover:bg-white/10 rounded"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                />
                <Tooltip content="Joindre un fichier" position="top">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                </Tooltip>
                
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    className="w-full bg-[#111d2e] border border-[#1e3a5f] rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#e91e63] max-h-32"
                    style={{ minHeight: '48px' }}
                  />
                  <Tooltip content="Emoji" position="top">
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                  </Tooltip>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSend}
                  disabled={!inputValue.trim() && attachments.length === 0}
                  className="px-4"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
