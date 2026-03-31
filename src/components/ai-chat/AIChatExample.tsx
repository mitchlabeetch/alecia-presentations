'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChatInterface, 
  ChatFloatingButton,
  SuggestionChips,
  useAIChat,
  quickSuggestions 
} from './index';
import { Bot, MessageSquare, PanelRight, Layout } from 'lucide-react';

/**
 * Exemple d'utilisation des composants de chat IA
 * 
 * Ce fichier montre comment intégrer le chat IA dans différentes configurations
 * pour l'application Alecia Presentations.
 */

// ============================================
// EXEMPLE 1: Chat flottant (bouton + popup)
// ============================================
export const FloatingChatExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatInterface
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="floating"
        width="400px"
        height="650px"
      />
      <ChatFloatingButton 
        onClick={() => setIsOpen(!isOpen)} 
        unreadCount={0}
      />
    </>
  );
};

// ============================================
// EXEMPLE 2: Chat en sidebar
// ============================================
export const SidebarChatExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Contenu principal */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-white">Présentation</h1>
        <p className="text-gray-400 mt-4">
          Votre contenu de présentation ici...
        </p>
      </div>

      {/* Sidebar Chat */}
      {isOpen && (
        <ChatInterface
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          variant="sidebar"
          width="380px"
        />
      )}

      {/* Bouton pour ouvrir le chat si fermé */}
      {!isOpen && (
        <motion.button
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          onClick={() => setIsOpen(true)}
          className="fixed right-4 top-1/2 -translate-y-1/2 p-3 bg-[#e91e63] 
                     text-white rounded-l-xl shadow-lg hover:bg-[#c2185b]"
        >
          <PanelRight className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};

// ============================================
// EXEMPLE 3: Chat intégré (embedded)
// ============================================
export const EmbeddedChatExample: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Zone de prévisualisation */}
      <div className="bg-[#1a2744] rounded-2xl p-6 border border-[#e91e63]/20">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Layout className="w-5 h-5 text-[#e91e63]" />
          Prévisualisation
        </h2>
        <div className="aspect-video bg-[#0a1628] rounded-xl flex items-center justify-center">
          <p className="text-gray-500">Votre présentation apparaîtra ici</p>
        </div>
      </div>

      {/* Chat intégré */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#e91e63]" />
          Assistant IA
        </h2>
        <ChatInterface
          variant="embedded"
          height="500px"
          showSuggestions={true}
        />
      </div>
    </div>
  );
};

// ============================================
// EXEMPLE 4: Utilisation du hook useAIChat seul
// ============================================
export const CustomChatExample: React.FC = () => {
  const {
    messages,
    isLoading,
    isStreaming,
    input,
    setInput,
    sendMessage,
    handleSuggestionClick,
    clearChat,
    messagesEndRef,
  } = useAIChat();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Chat Personnalisé
      </h2>

      {/* Liste des messages personnalisée */}
      <div className="bg-[#1a2744] rounded-2xl border border-[#e91e63]/20 overflow-hidden">
        {/* En-tête personnalisé */}
        <div className="px-4 py-3 bg-[#0a1628] border-b border-[#e91e63]/20">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Messages</span>
            <button
              onClick={clearChat}
              className="text-sm text-[#e91e63] hover:text-[#f06292]"
            >
              Effacer
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-[#e91e63]/20 ml-auto max-w-[80%]'
                  : 'bg-[#0a1628] mr-auto max-w-[80%]'
              }`}
            >
              <p className="text-sm text-gray-200">{msg.content}</p>
              {msg.isStreaming && (
                <span className="inline-block w-2 h-4 bg-[#e91e63] ml-1 animate-pulse" />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input personnalisé */}
        <div className="p-4 border-t border-[#e91e63]/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Votre message..."
              className="flex-1 bg-[#0a1628] border border-[#e91e63]/30 rounded-xl px-4 py-2
                         text-white placeholder-gray-500 outline-none focus:border-[#e91e63]"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || isStreaming || !input.trim()}
              className="px-4 py-2 bg-[#e91e63] text-white rounded-xl disabled:opacity-50
                         hover:bg-[#c2185b] transition-colors"
            >
              {isLoading || isStreaming ? '...' : 'Envoyer'}
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-4">
        <SuggestionChips
          suggestions={quickSuggestions}
          onSuggestionClick={handleSuggestionClick}
          variant="compact"
        />
      </div>
    </div>
  );
};

// ============================================
// EXEMPLE 5: Page complète avec toutes les variantes
// ============================================
export const AIChatShowcase: React.FC = () => {
  const [activeExample, setActiveExample] = useState<'floating' | 'sidebar' | 'embedded' | 'custom'>('floating');

  const examples = [
    { id: 'floating', label: 'Chat Flottant', icon: MessageSquare },
    { id: 'sidebar', label: 'Sidebar', icon: PanelRight },
    { id: 'embedded', label: 'Intégré', icon: Layout },
    { id: 'custom', label: 'Personnalisé', icon: Bot },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0a1628] p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Composants Chat IA
          </h1>
          <p className="text-gray-400">
            Démonstration des différentes configurations du chat assistant
          </p>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          {examples.map((ex) => (
            <motion.button
              key={ex.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveExample(ex.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeExample === ex.id
                  ? 'bg-[#e91e63] text-white'
                  : 'bg-[#1a2744] text-gray-400 hover:text-white'
              }`}
            >
              <ex.icon className="w-4 h-4" />
              {ex.label}
            </motion.button>
          ))}
        </div>

        {/* Contenu de l'exemple */}
        <motion.div
          key={activeExample}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {activeExample === 'floating' && <FloatingChatExample />}
          {activeExample === 'sidebar' && <SidebarChatExample />}
          {activeExample === 'embedded' && <EmbeddedChatExample />}
          {activeExample === 'custom' && <CustomChatExample />}
        </motion.div>

        {/* Documentation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 bg-[#1a2744]/50 rounded-2xl border border-[#e91e63]/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Fonctionnalités disponibles
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#e91e63] rounded-full" />
                Messages avec historique complet
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#e91e63] rounded-full" />
                Réponses en streaming avec curseur
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#e91e63] rounded-full" />
                Suggestions rapides contextuelles
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#e91e63] rounded-full" />
                Formatage markdown (gras, listes, tableaux)
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#e91e63] rounded-full" />
                Variables dynamiques {'{{'}client{'}}'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#e91e63] rounded-full" />
                Copie des messages
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#e91e63] rounded-full" />
                Pièces jointes (fichiers, images)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#e91e63] rounded-full" />
                3 variantes d'affichage
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIChatShowcase;
