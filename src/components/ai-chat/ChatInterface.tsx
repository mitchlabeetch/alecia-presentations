'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Sparkles,
  Bot,
  History,
  ChevronDown,
  Settings,
  Download,
} from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SuggestionChips, ContextualSuggestions } from './SuggestionChips';
import { useAIChat, quickSuggestions, SuggestionChip } from './useAIChat';

interface ChatInterfaceProps {
  isOpen?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  className?: string;
  initialMessage?: string;
  showSuggestions?: boolean;
  variant?: 'floating' | 'sidebar' | 'embedded';
  width?: string;
  height?: string;
}

// Suggestions contextuelles basées sur l'historique
const getContextualSuggestions = (lastMessage: string): SuggestionChip[] => {
  const lowerMsg = lastMessage.toLowerCase();

  if (lowerMsg.includes('présentation') || lowerMsg.includes('créer')) {
    return [
      { id: 'ctx-1', label: 'Levée de fonds', action: 'Créer une présentation de levée de fonds' },
      { id: 'ctx-2', label: 'Rapport annuel', action: 'Créer un rapport annuel' },
      { id: 'ctx-3', label: 'Proposition', action: 'Créer une proposition commerciale' },
    ];
  }

  if (lowerMsg.includes('slide') || lowerMsg.includes('ajouter')) {
    return [
      { id: 'ctx-4', label: 'Slide titre', action: 'Ajouter une slide de titre' },
      { id: 'ctx-5', label: 'Slide équipe', action: 'Ajouter une slide équipe' },
      { id: 'ctx-6', label: 'Slide financière', action: 'Ajouter une slide financière' },
    ];
  }

  if (lowerMsg.includes('modèle') || lowerMsg.includes('template')) {
    return [
      { id: 'ctx-7', label: 'Corporate', action: 'Utiliser le modèle corporate' },
      { id: 'ctx-8', label: 'Startup', action: 'Utiliser le modèle startup' },
      { id: 'ctx-9', label: 'Minimaliste', action: 'Utiliser le modèle minimaliste' },
    ];
  }

  return [];
};

// En-tête du chat
const ChatHeader: React.FC<{
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  onClear: () => void;
  messageCount: number;
}> = ({ onClose, onMinimize, isMinimized, onClear, messageCount }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#0a1628] to-[#1a2744]
                 border-b border-[#e91e63]/30 rounded-t-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e63] to-[#c2185b]
                          flex items-center justify-center shadow-lg shadow-[#e91e63]/30"
          >
            <Bot className="w-5 h-5 text-white" />
          </div>
          <motion.div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a1628]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-white flex items-center gap-2">
            Assistant Alecia
            <Sparkles className="w-4 h-4 text-[#e91e63]" />
          </h3>
          <p className="text-xs text-gray-400">
            {messageCount > 1 ? `${messageCount - 1} messages` : 'Prêt à aider'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Menu options */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </motion.button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                className="absolute right-0 top-full mt-2 w-48 bg-[#1a2744] border border-[#e91e63]/30
                           rounded-xl shadow-xl z-20 overflow-hidden"
              >
                <button
                  onClick={() => {
                    onClear();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:text-white
                             hover:bg-[#e91e63]/10 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Effacer la conversation
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:text-white
                             hover:bg-[#e91e63]/10 flex items-center gap-2 transition-colors"
                >
                  <History className="w-4 h-4" />
                  Voir l'historique
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:text-white
                             hover:bg-[#e91e63]/10 flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exporter la conversation
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimiser */}
        {onMinimize && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMinimize}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </motion.button>
        )}

        {/* Fermer */}
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-[#e91e63] hover:bg-[#e91e63]/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Zone de messages vide
const EmptyState: React.FC<{ onSuggestionClick: (s: SuggestionChip) => void }> = ({
  onSuggestionClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center h-full p-6 text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#e91e63]/20 to-[#e91e63]/5
                 border border-[#e91e63]/30 flex items-center justify-center mb-4"
    >
      <Sparkles className="w-10 h-10 text-[#e91e63]" />
    </motion.div>

    <h3 className="text-lg font-semibold text-white mb-2">
      Comment puis-je vous aider avec votre présentation ?
    </h3>

    <p className="text-sm text-gray-400 mb-6 max-w-xs">
      Je peux créer des présentations, générer des slides, suggérer des modèles et vous aider à
      personnaliser votre contenu.
    </p>

    <SuggestionChips
      suggestions={quickSuggestions.slice(0, 4)}
      onSuggestionClick={onSuggestionClick}
      variant="compact"
    />
  </motion.div>
);

// Composant principal
export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isOpen = true,
  onClose,
  onMinimize,
  className = '',
  initialMessage,
  showSuggestions = true,
  variant = 'floating',
  width = '380px',
  height = '600px',
}) => {
  const {
    messages,
    isLoading,
    isStreaming,
    input,
    setInput,
    sendMessage,
    handleSuggestionClick,
    clearChat,
    copyMessage,
    messagesEndRef,
  } = useAIChat();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Message initial
  useEffect(() => {
    if (initialMessage && messages.length === 1) {
      sendMessage(initialMessage);
    }
  }, [initialMessage]);

  // Détection du scroll
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  // Scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Gestion de la minimisation
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    onMinimize?.();
  };

  // Suggestions contextuelles basées sur le dernier message
  const lastAssistantMessage = messages
    .filter((m) => m.role === 'assistant' && !m.isStreaming)
    .pop();
  const contextualSuggestions = lastAssistantMessage
    ? getContextualSuggestions(lastAssistantMessage.content)
    : [];

  // Variante sidebar
  if (variant === 'sidebar') {
    return (
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed right-0 top-0 h-full bg-[#0a1628] border-l border-[#e91e63]/30
                    flex flex-col z-50 ${className}`}
        style={{ width }}
      >
        <ChatHeader onClose={onClose} onClear={clearChat} messageCount={messages.length} />

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin
                     scrollbar-thumb-[#e91e63]/30 scrollbar-track-transparent"
        >
          {messages.length <= 1 ? (
            <EmptyState onSuggestionClick={handleSuggestionClick} />
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} onCopy={copyMessage} />
            ))
          )}

          {/* Suggestions contextuelles */}
          {showSuggestions && contextualSuggestions.length > 0 && !isStreaming && (
            <ContextualSuggestions
              suggestions={contextualSuggestions}
              onSuggestionClick={handleSuggestionClick}
              context="Vous pourriez aussi demander :"
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bouton scroll to bottom */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 p-2 bg-[#e91e63]
                         text-white rounded-full shadow-lg hover:bg-[#c2185b] transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Suggestions rapides */}
        {showSuggestions && messages.length > 1 && !isStreaming && (
          <div className="px-4 py-2 border-t border-[#e91e63]/10">
            <SuggestionChips
              suggestions={quickSuggestions.slice(0, 3)}
              onSuggestionClick={handleSuggestionClick}
              variant="horizontal"
              title=""
            />
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-[#e91e63]/20 bg-[#0a1628]">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage(input)}
            isLoading={isLoading}
            isStreaming={isStreaming}
            placeholder="Envoyer un message..."
          />
        </div>
      </motion.div>
    );
  }

  // Variante embedded
  if (variant === 'embedded') {
    return (
      <div
        className={`flex flex-col bg-[#0a1628] rounded-2xl border border-[#e91e63]/20
                    overflow-hidden ${className}`}
        style={{ height }}
      >
        <ChatHeader onClear={clearChat} messageCount={messages.length} />

        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin
                     scrollbar-thumb-[#e91e63]/30 scrollbar-track-transparent"
        >
          {messages.length <= 1 ? (
            <EmptyState onSuggestionClick={handleSuggestionClick} />
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} onCopy={copyMessage} />
            ))
          )}

          {showSuggestions && contextualSuggestions.length > 0 && !isStreaming && (
            <ContextualSuggestions
              suggestions={contextualSuggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {showSuggestions && messages.length > 1 && !isStreaming && (
          <div className="px-4 py-2 border-t border-[#e91e63]/10">
            <SuggestionChips
              suggestions={quickSuggestions.slice(0, 3)}
              onSuggestionClick={handleSuggestionClick}
              variant="compact"
            />
          </div>
        )}

        <div className="p-4 border-t border-[#e91e63]/20 bg-[#0a1628]">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage(input)}
            isLoading={isLoading}
            isStreaming={isStreaming}
            placeholder="Envoyer un message..."
          />
        </div>
      </div>
    );
  }

  // Variante floating (par défaut)
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            height: isMinimized ? 'auto' : height,
          }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`fixed bottom-4 right-4 bg-[#0a1628] rounded-2xl border border-[#e91e63]/30
                      shadow-2xl shadow-[#e91e63]/10 overflow-hidden z-50 ${className}`}
          style={{ width }}
        >
          <ChatHeader
            onClose={onClose}
            onMinimize={handleMinimize}
            isMinimized={isMinimized}
            onClear={clearChat}
            messageCount={messages.length}
          />

          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col"
                style={{ height: `calc(${height} - 60px)` }}
              >
                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin
                             scrollbar-thumb-[#e91e63]/30 scrollbar-track-transparent"
                >
                  {messages.length <= 1 ? (
                    <EmptyState onSuggestionClick={handleSuggestionClick} />
                  ) : (
                    messages.map((message) => (
                      <ChatMessage key={message.id} message={message} onCopy={copyMessage} />
                    ))
                  )}

                  {showSuggestions && contextualSuggestions.length > 0 && !isStreaming && (
                    <ContextualSuggestions
                      suggestions={contextualSuggestions}
                      onSuggestionClick={handleSuggestionClick}
                      context="Suggestions :"
                    />
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Bouton scroll to bottom */}
                <AnimatePresence>
                  {showScrollButton && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={scrollToBottom}
                      className="absolute bottom-24 left-1/2 -translate-x-1/2 p-2 bg-[#e91e63]
                                 text-white rounded-full shadow-lg hover:bg-[#c2185b] transition-colors"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Suggestions rapides */}
                {showSuggestions && messages.length > 1 && !isStreaming && (
                  <div className="px-4 py-2 border-t border-[#e91e63]/10">
                    <SuggestionChips
                      suggestions={quickSuggestions.slice(0, 3)}
                      onSuggestionClick={handleSuggestionClick}
                      variant="horizontal"
                      title=""
                    />
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-[#e91e63]/20 bg-[#0a1628]">
                  <ChatInput
                    value={input}
                    onChange={setInput}
                    onSend={() => sendMessage(input)}
                    isLoading={isLoading}
                    isStreaming={isStreaming}
                    placeholder="Envoyer un message..."
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Bouton flottant pour ouvrir le chat
export const ChatFloatingButton: React.FC<{
  onClick: () => void;
  unreadCount?: number;
}> = ({ onClick, unreadCount = 0 }) => (
  <motion.button
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-br from-[#e91e63] to-[#c2185b]
               rounded-full shadow-xl shadow-[#e91e63]/30 flex items-center justify-center
               hover:shadow-2xl hover:shadow-[#e91e63]/40 transition-shadow z-40"
  >
    <MessageSquare className="w-6 h-6 text-white" />

    {unreadCount > 0 && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#e91e63] text-xs
                   font-bold rounded-full flex items-center justify-center"
      >
        {unreadCount > 9 ? '9+' : unreadCount}
      </motion.span>
    )}

    {/* Animation pulse */}
    <span className="absolute inset-0 rounded-full bg-[#e91e63] animate-ping opacity-20" />
  </motion.button>
);

export default ChatInterface;
