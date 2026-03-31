'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bot, Copy, Check, Sparkles, Clock } from 'lucide-react';
import { ChatMessage as ChatMessageType } from './useAIChat';

interface ChatMessageProps {
  message: ChatMessageType;
  onCopy?: (messageId: string) => Promise<boolean>;
  brandColor?: string;
}

// Fonction pour parser le markdown simple
const parseMarkdown = (content: string): React.ReactNode[] => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-2 ml-2">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (inTable && tableRows.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-3">
          <table className="min-w-full text-sm border-collapse">
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Ligne vide
    if (!trimmedLine) {
      flushList();
      flushTable();
      elements.push(<div key={`empty-${index}`} className="h-2" />);
      return;
    }

    // Tableau markdown
    if (trimmedLine.startsWith('|')) {
      flushList();
      inTable = true;
      const cells = trimmedLine
        .split('|')
        .filter((cell) => cell.trim())
        .map((cell) => cell.trim());

      // Ignorer la ligne de séparation (---)
      if (cells.every((cell) => cell.replace(/-/g, '').trim() === '')) {
        return;
      }

      const isHeader = index === 0 || (index > 0 && !lines[index - 1].trim().startsWith('|'));

      tableRows.push(
        <tr
          key={`row-${index}`}
          className={isHeader ? 'bg-[#e91e63]/10 font-semibold' : 'border-b border-gray-700/30'}
        >
          {cells.map((cell, cellIndex) => (
            <td
              key={`cell-${cellIndex}`}
              className="px-3 py-2 text-left"
              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }}
            />
          ))}
        </tr>
      );
      return;
    }
    flushTable();

    // Titres
    if (
      trimmedLine.startsWith('**') &&
      trimmedLine.endsWith('**') &&
      !trimmedLine.slice(2, -2).includes('**')
    ) {
      flushList();
      elements.push(
        <h4 key={`heading-${index}`} className="font-bold text-white mt-4 mb-2 text-base">
          {trimmedLine.slice(2, -2)}
        </h4>
      );
      return;
    }

    // Liste à puces
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
      inList = true;
      const itemContent = trimmedLine.slice(2);
      listItems.push(
        <li
          key={`item-${index}`}
          className="text-gray-200"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(itemContent) }}
        />
      );
      return;
    }
    flushList();

    // Numérotation
    if (/^\d+\./.test(trimmedLine)) {
      const match = trimmedLine.match(/^(\d+)\.\s*(.+)$/);
      if (match) {
        elements.push(
          <div key={`numbered-${index}`} className="flex gap-2 my-1">
            <span className="text-[#e91e63] font-semibold min-w-[1.5rem]">{match[1]}.</span>
            <span
              className="text-gray-200"
              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(match[2]) }}
            />
          </div>
        );
        return;
      }
    }

    // Texte normal avec formatage inline
    elements.push(
      <p
        key={`p-${index}`}
        className="text-gray-200 my-1 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmedLine) }}
      />
    );
  });

  flushList();
  flushTable();

  return elements;
};

// Formatage inline (gras, italique, code, variables)
const formatInlineMarkdown = (text: string): string => {
  let formatted = text
    // Gras
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    // Italique
    .replace(/\*(.+?)\*/g, '<em class="text-gray-300">$1</em>')
    // Code inline
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-[#0a1628] px-1.5 py-0.5 rounded text-[#e91e63] text-sm font-mono">$1</code>'
    )
    // Variables {{variable}}
    .replace(
      /\{\{([^}]+)\}\}/g,
      '<span class="bg-[#e91e63]/20 text-[#e91e63] px-1.5 py-0.5 rounded text-sm font-mono">{{$1}}</span>'
    );

  return formatted;
};

// Curseur de streaming
const StreamingCursor: React.FC = () => (
  <motion.span
    className="inline-block w-2 h-5 bg-[#e91e63] ml-1 align-middle"
    animate={{ opacity: [1, 0.3, 1] }}
    transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// Indicateur de réflexion
const ThinkingIndicator: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 text-gray-400 py-3"
  >
    <div className="flex gap-1">
      <motion.div
        className="w-2 h-2 bg-[#e91e63] rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 bg-[#e91e63] rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-[#e91e63] rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </div>
    <span className="text-sm italic">L'IA réfléchit...</span>
  </motion.div>
);

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onCopy,
  _brandColor = '#e91e63',
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const handleCopy = async () => {
    if (onCopy && !copied) {
      const success = await onCopy(message.id);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  // Message système
  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center my-3"
      >
        <span className="text-xs text-gray-500 bg-[#0a1628]/50 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: message.isStreaming ? 0 : 0.05,
      }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-[#e91e63] to-[#c2185b]'
            : 'bg-gradient-to-br from-[#1a2744] to-[#0a1628] border border-[#e91e63]/30'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-[#e91e63]" />
        )}
      </motion.div>

      {/* Contenu du message */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
        {/* En-tête */}
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium ${isUser ? 'text-[#e91e63]' : 'text-gray-400'}`}>
            {isUser ? 'Vous' : 'Assistant Alecia'}
          </span>
          {!isUser && <Sparkles className="w-3 h-3 text-[#e91e63]/70" />}
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {message.timestamp.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Bulle de message */}
        <motion.div
          layout
          className={`relative group px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-br from-[#e91e63] to-[#c2185b] text-white rounded-br-md'
              : 'bg-[#1a2744]/80 border border-[#e91e63]/20 text-gray-100 rounded-bl-md backdrop-blur-sm'
          }`}
        >
          {/* Contenu */}
          <div className="prose prose-invert prose-sm max-w-none">
            {isUser ? (
              <p className="m-0 leading-relaxed">{message.content}</p>
            ) : message.isStreaming && !message.content ? (
              <ThinkingIndicator />
            ) : (
              <>
                {parseMarkdown(message.content)}
                {message.isStreaming && <StreamingCursor />}
              </>
            )}
          </div>

          {/* Bouton copier (uniquement pour les messages IA) */}
          {!isUser && !message.isStreaming && message.content && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="absolute -right-2 -top-2 p-1.5 bg-[#0a1628] border border-[#e91e63]/30
                         rounded-lg opacity-0 group-hover:opacity-100 transition-opacity
                         hover:bg-[#e91e63]/10 hover:border-[#e91e63]"
              title={copied ? 'Copié !' : 'Copier le message'}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              )}
            </motion.button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
