/**
 * Layout de l'éditeur de présentation
 * Inclut la barre d'outils, le panneau latéral des slides et la zone d'édition
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Download,
  Share2,
  Play,
  Grid,
  Type,
  Image as ImageIcon,
  BarChart3,
  Table,
  LayoutTemplate,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  MessageSquare,
  Variable,
  Layers,
  Plus,
  MoreHorizontal,
  Trash2,
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react';
import useStore, { useSlides, useSelectedSlide } from '@store/index';
import { useSocket, useCursorTracking } from '@hooks/useSocket';
import { formatRelativeTime } from '@lib/utils';
import type { Slide, SlideType } from '@types/index';

/**
 * Bouton d'outil dans la barre d'outils
 */
interface ToolbarButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  shortcut?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  disabled,
  active,
  shortcut,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
      ${
        active
          ? 'bg-alecia-pink text-white'
          : 'text-alecia-gray-300 hover:bg-alecia-navy-light hover:text-white'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
    title={shortcut ? `${label} (${shortcut})` : label}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

/**
 * Miniature de slide dans le panneau latéral
 */
interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}

const SlideThumbnail: React.FC<SlideThumbnailProps> = ({
  slide,
  index,
  isSelected,
  onClick,
  onDuplicate,
  onDelete,
  onToggleVisibility,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  if (!slide) return null;

  return (
    <div
      className={`
        relative group cursor-pointer rounded-lg overflow-hidden transition-all duration-200
        ${
          isSelected
            ? 'ring-2 ring-alecia-pink shadow-alecia-pink'
            : 'hover:ring-2 hover:ring-alecia-navy-lighter'
        }
        ${slide.isHidden ? 'opacity-50' : ''}
      `}
      onClick={onClick}
    >
      {/* Numéro de slide */}
      <div className="absolute top-2 left-2 z-10">
        <span className="text-xs font-medium text-alecia-gray-400 bg-alecia-navy/80 px-2 py-0.5 rounded">
          {index + 1}
        </span>
      </div>

      {/* Actions de la slide */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 rounded bg-alecia-navy/80 text-alecia-gray-300 hover:text-white"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-alecia-navy-light rounded-lg border border-alecia-navy-lighter/30 shadow-alecia z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-alecia-gray-300 hover:bg-alecia-navy hover:text-white text-left rounded-t-lg"
            >
              <Copy className="w-4 h-4" />
              Dupliquer
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-alecia-gray-300 hover:bg-alecia-navy hover:text-white text-left"
            >
              {slide.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {slide.isHidden ? 'Afficher' : 'Masquer'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left rounded-b-lg"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        )}
      </div>

      {/* Aperçu de la slide */}
      <div className="aspect-video bg-alecia-navy rounded-lg border border-alecia-navy-lighter/30 p-4">
        <div className="h-full flex flex-col justify-center">
          {slide.title && (
            <h4 className="text-white text-sm font-medium truncate">{slide.title}</h4>
          )}
          <p className="text-alecia-gray-500 text-xs mt-1">
            {slide.type === 'title' && 'Page de titre'}
            {slide.type === 'content' && 'Contenu'}
            {slide.type === 'two-column' && 'Deux colonnes'}
            {slide.type === 'image' && 'Image'}
            {slide.type === 'chart' && 'Graphique'}
            {slide.type === 'table' && 'Tableau'}
            {slide.type === 'timeline' && 'Chronologie'}
            {slide.type === 'team' && 'Équipe'}
            {slide.type === 'financial' && 'Financier'}
            {slide.type === 'quote' && 'Citation'}
            {slide.type === 'blank' && 'Vide'}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Panneau de chat IA
 */
const ChatPanel: React.FC = () => {
  const { currentPresentation, sessions, currentSessionId, addMessage, isTyping } = useStore();
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || !currentSessionId) return;

    addMessage(currentSessionId, {
      role: 'user',
      content: input,
    });
    setInput('');

    // Simuler une réponse de l'IA
    setTimeout(() => {
      addMessage(currentSessionId, {
        role: 'assistant',
        content: 'Je comprends votre demande. Je vais vous aider à créer cette slide.',
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* En-tête du chat */}
      <div className="p-4 border-b border-alecia-navy-lighter/30">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-alecia-pink" />
          Assistant IA
        </h3>
        <p className="text-alecia-gray-400 text-sm mt-1">
          Posez vos questions ou demandez la création de slides
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentSession?.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded-2xl px-4 py-3
                ${
                  message.role === 'user'
                    ? 'bg-alecia-pink text-white rounded-br-md'
                    : 'bg-alecia-navy-light text-alecia-gray-200 rounded-bl-md'
                }
              `}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-60 mt-1 block">
                {formatRelativeTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-alecia-navy-light rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-alecia-gray-400 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-alecia-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <span
                  className="w-2 h-2 bg-alecia-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Saisie */}
      <div className="p-4 border-t border-alecia-navy-lighter/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-2 bg-alecia-navy border border-alecia-navy-lighter/50 rounded-lg text-white text-sm placeholder:text-alecia-gray-400 focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-2 bg-alecia-pink text-white rounded-lg hover:bg-alecia-pink-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Panneau des variables
 */
const VariablesPanel: React.FC = () => {
  const { currentPresentation, updateVariables, setVariable } = useStore();
  const variables = currentPresentation?.variables;

  if (!variables) return null;

  return (
    <div className="flex flex-col h-full">
      {/* En-tête */}
      <div className="p-4 border-b border-alecia-navy-lighter/30">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Variable className="w-5 h-5 text-alecia-pink" />
          Variables
        </h3>
        <p className="text-alecia-gray-400 text-sm mt-1">
          Définissez les variables de la présentation
        </p>
      </div>

      {/* Formulaire des variables */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Informations client */}
        <div>
          <h4 className="text-alecia-gray-300 text-sm font-medium mb-3">Client</h4>
          <div className="space-y-3">
            <div>
              <label className="text-alecia-gray-400 text-xs mb-1 block">Nom du client</label>
              <input
                type="text"
                value={variables.clientName}
                onChange={(e) => setVariable('clientName', e.target.value)}
                placeholder="Nom du client"
                className="w-full px-3 py-2 bg-alecia-navy border border-alecia-navy-lighter/50 rounded-lg text-white text-sm placeholder:text-alecia-gray-500 focus:border-alecia-pink focus:outline-none"
              />
            </div>
            <div>
              <label className="text-alecia-gray-400 text-xs mb-1 block">Adresse</label>
              <input
                type="text"
                value={variables.clientAddress || ''}
                onChange={(e) => setVariable('clientAddress', e.target.value)}
                placeholder="Adresse"
                className="w-full px-3 py-2 bg-alecia-navy border border-alecia-navy-lighter/50 rounded-lg text-white text-sm placeholder:text-alecia-gray-500 focus:border-alecia-pink focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Interlocuteurs */}
        <div>
          <h4 className="text-alecia-gray-300 text-sm font-medium mb-3">Interlocuteurs</h4>
          <div className="space-y-3">
            <div>
              <label className="text-alecia-gray-400 text-xs mb-1 block">Contact client</label>
              <input
                type="text"
                value={variables.clientContactName || ''}
                onChange={(e) => setVariable('clientContactName', e.target.value)}
                placeholder="Nom du contact"
                className="w-full px-3 py-2 bg-alecia-navy border border-alecia-navy-lighter/50 rounded-lg text-white text-sm placeholder:text-alecia-gray-500 focus:border-alecia-pink focus:outline-none"
              />
            </div>
            <div>
              <label className="text-alecia-gray-400 text-xs mb-1 block">Contact Alecia</label>
              <input
                type="text"
                value={variables.aleciaContactName}
                onChange={(e) => setVariable('aleciaContactName', e.target.value)}
                placeholder="Votre nom"
                className="w-full px-3 py-2 bg-alecia-navy border border-alecia-navy-lighter/50 rounded-lg text-white text-sm placeholder:text-alecia-gray-500 focus:border-alecia-pink focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Projet */}
        <div>
          <h4 className="text-alecia-gray-300 text-sm font-medium mb-3">Projet</h4>
          <div className="space-y-3">
            <div>
              <label className="text-alecia-gray-400 text-xs mb-1 block">Nom du projet</label>
              <input
                type="text"
                value={variables.projectName || ''}
                onChange={(e) => setVariable('projectName', e.target.value)}
                placeholder="Nom du projet"
                className="w-full px-3 py-2 bg-alecia-navy border border-alecia-navy-lighter/50 rounded-lg text-white text-sm placeholder:text-alecia-gray-500 focus:border-alecia-pink focus:outline-none"
              />
            </div>
            <div>
              <label className="text-alecia-gray-400 text-xs mb-1 block">Référence</label>
              <input
                type="text"
                value={variables.projectReference || ''}
                onChange={(e) => setVariable('projectReference', e.target.value)}
                placeholder="Référence du projet"
                className="w-full px-3 py-2 bg-alecia-navy border border-alecia-navy-lighter/50 rounded-lg text-white text-sm placeholder:text-alecia-gray-500 focus:border-alecia-pink focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Layout de l'éditeur
 */
const EditorLayout: React.FC = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  const navigate = useNavigate();
  const {
    currentPresentation,
    setCurrentPresentation,
    addSlide,
    deleteSlide,
    duplicateSlide,
    updateSlide,
    setSelectedSlide,
    editorState,
    setZoom,
    togglePreviewMode,
    toggleGrid,
    setActiveTab,
    createSession,
    user,
  } = useStore();

  const slides = useSlides();
  const selectedSlideId = useSelectedSlide();
  const selectedSlide = slides.find((s) => s.id === selectedSlideId);

  // Connexion Socket.io pour la collaboration
  const { collaborators, isConnected, joinPresentation, leavePresentation } = useSocket({
    presentationId,
    user,
    enabled: !!presentationId && !!user,
  });

  // Suivi du curseur
  const { socket } = useSocket({ presentationId, user, enabled: false });
  useCursorTracking(socket, presentationId, true);

  // Charger la présentation
  React.useEffect(() => {
    if (presentationId && !currentPresentation) {
      // Simuler le chargement - à remplacer par l'appel API réel
      const mockPresentation = {
        id: presentationId,
        title: 'Nouvelle présentation',
        slides: [],
        variables: {
          clientName: '',
          aleciaContactName: user?.firstName + ' ' + user?.lastName || '',
          aleciaContactEmail: user?.email || '',
          projectDate: new Date(),
          custom: {},
        },
        settings: {
          theme: 'alecia',
          aspectRatio: '16:9',
          defaultFont: 'Inter',
          showSlideNumbers: true,
          showFooter: true,
        },
      };
      setCurrentPresentation(mockPresentation as typeof currentPresentation);

      // Créer une session de chat
      createSession(presentationId);

      // Rejoindre la room de collaboration
      joinPresentation(presentationId);
    }

    return () => {
      leavePresentation();
    };
  }, [presentationId]);

  const handleAddSlide = (type: SlideType) => {
    const newSlide = addSlide(type);
    setSelectedSlide(newSlide.id);
  };

  return (
    <div className="h-screen bg-alecia-navy flex flex-col overflow-hidden">
      {/* Barre d'outils supérieure */}
      <header className="h-14 bg-alecia-navy-light border-b border-alecia-navy-lighter/30 flex items-center justify-between px-4">
        {/* Gauche : Navigation et titre */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/presentations')}
            className="p-2 rounded-lg hover:bg-alecia-navy transition-colors"
            title="Retour aux présentations"
          >
            <ChevronLeft className="w-5 h-5 text-alecia-gray-300" />
          </button>

          <div className="h-6 w-px bg-alecia-navy-lighter/50" />

          <input
            type="text"
            value={currentPresentation?.title || ''}
            onChange={(e) => {
              /* Mettre à jour le titre */
            }}
            className="bg-transparent text-white font-medium focus:outline-none focus:border-b focus:border-alecia-pink min-w-[200px]"
            placeholder="Titre de la présentation"
          />

          {/* Indicateur de sauvegarde */}
          <span className="text-alecia-gray-500 text-xs">
            {currentPresentation ? 'Sauvegardé' : 'Non sauvegardé'}
          </span>
        </div>

        {/* Centre : Outils d'édition */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Undo} label="Annuler" shortcut="Ctrl+Z" />
          <ToolbarButton icon={Redo} label="Rétablir" shortcut="Ctrl+Y" />
          <div className="h-6 w-px bg-alecia-navy-lighter/50 mx-2" />
          <ToolbarButton icon={Type} label="Texte" onClick={() => handleAddSlide('content')} />
          <ToolbarButton icon={ImageIcon} label="Image" />
          <ToolbarButton
            icon={BarChart3}
            label="Graphique"
            onClick={() => handleAddSlide('chart')}
          />
          <ToolbarButton icon={Table} label="Tableau" onClick={() => handleAddSlide('table')} />
          <ToolbarButton icon={LayoutTemplate} label="Template" />
        </div>

        {/* Droite : Actions et collaboration */}
        <div className="flex items-center gap-3">
          {/* Indicateurs de présence */}
          {collaborators.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {collaborators.slice(0, 3).map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="w-8 h-8 rounded-full bg-alecia-pink border-2 border-alecia-navy-light flex items-center justify-center"
                    title={`${collaborator.firstName} ${collaborator.lastName}`}
                  >
                    <span className="text-white text-xs font-medium">
                      {collaborator.firstName[0]}
                      {collaborator.lastName[0]}
                    </span>
                  </div>
                ))}
                {collaborators.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-alecia-navy-lighter border-2 border-alecia-navy-light flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      +{collaborators.length - 3}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-alecia-gray-400 text-xs">{collaborators.length} en ligne</span>
            </div>
          )}

          <div className="h-6 w-px bg-alecia-navy-lighter/50" />

          <ToolbarButton
            icon={Grid}
            label="Grille"
            active={editorState.showGrid}
            onClick={toggleGrid}
          />
          <ToolbarButton icon={Play} label="Présenter" onClick={togglePreviewMode} />

          <div className="h-6 w-px bg-alecia-navy-lighter/50" />

          <button className="btn-secondary flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Partager
          </button>

          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </header>

      {/* Zone principale */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panneau latéral gauche - Slides */}
        <aside className="w-72 bg-alecia-navy-light border-r border-alecia-navy-lighter/30 flex flex-col">
          {/* En-tête du panneau */}
          <div className="p-4 border-b border-alecia-navy-lighter/30 flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Layers className="w-5 h-5 text-alecia-pink" />
              Slides ({slides.length})
            </h3>
            <button
              onClick={() => handleAddSlide('content')}
              className="p-1.5 rounded-lg bg-alecia-pink text-white hover:bg-alecia-pink-dark transition-colors"
              title="Ajouter une slide"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Liste des slides */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {slides.map((slide, index) => (
              <SlideThumbnail
                key={slide.id}
                slide={slide}
                index={index}
                isSelected={slide.id === editorState.selectedSlideId}
                onClick={() => setSelectedSlide(slide.id)}
                onDuplicate={() => duplicateSlide(slide.id)}
                onDelete={() => deleteSlide(slide.id)}
                onToggleVisibility={() => updateSlide(slide.id, { isHidden: !slide.isHidden })}
              />
            ))}

            {slides.length === 0 && (
              <div className="text-center py-8">
                <p className="text-alecia-gray-500 text-sm">Aucune slide</p>
                <button
                  onClick={() => handleAddSlide('title')}
                  className="mt-2 text-alecia-pink text-sm hover:underline"
                >
                  Ajouter une slide
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Zone d'édition principale */}
        <main className="flex-1 bg-alecia-navy relative overflow-hidden">
          {/* Filigrane Alecia */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[50vh] font-bold text-alecia-navy-light/5">&</span>
          </div>

          {/* Canvas d'édition */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg shadow-alecia-lg overflow-hidden"
              style={{
                width: editorState.zoom + '%',
                maxWidth: '100%',
                aspectRatio: currentPresentation?.settings.aspectRatio === '4:3' ? '4/3' : '16/9',
              }}
            >
              {selectedSlide ? (
                <div className="w-full h-full p-8 text-alecia-navy">
                  <h2 className="text-2xl font-bold">{selectedSlide.title}</h2>
                  <p className="text-gray-500 mt-2">Type: {selectedSlide.type}</p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-alecia-gray-400">
                  <p>Sélectionnez une slide pour commencer l'édition</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Contrôles de zoom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-alecia-navy-light rounded-lg px-3 py-2 border border-alecia-navy-lighter/30">
            <button
              onClick={() => setZoom(editorState.zoom - 10)}
              disabled={editorState.zoom <= 25}
              className="p-1 rounded hover:bg-alecia-navy disabled:opacity-50"
            >
              <ZoomOut className="w-4 h-4 text-alecia-gray-300" />
            </button>
            <span className="text-white text-sm w-16 text-center">{editorState.zoom}%</span>
            <button
              onClick={() => setZoom(editorState.zoom + 10)}
              disabled={editorState.zoom >= 200}
              className="p-1 rounded hover:bg-alecia-navy disabled:opacity-50"
            >
              <ZoomIn className="w-4 h-4 text-alecia-gray-300" />
            </button>
            <div className="h-4 w-px bg-alecia-navy-lighter/50 mx-1" />
            <button
              onClick={togglePreviewMode}
              className="p-1 rounded hover:bg-alecia-navy"
              title="Plein écran"
            >
              <Maximize className="w-4 h-4 text-alecia-gray-300" />
            </button>
          </div>
        </main>

        {/* Panneau latéral droit */}
        {editorState.rightPanelOpen && (
          <aside className="w-80 bg-alecia-navy-light border-l border-alecia-navy-lighter/30 flex flex-col">
            {/* Onglets */}
            <div className="flex border-b border-alecia-navy-lighter/30">
              {[
                { id: 'slides', icon: Layers, label: 'Slides' },
                { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
                { id: 'variables', icon: Variable, label: 'Variables' },
                { id: 'chat', icon: MessageSquare, label: 'Chat' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof editorState.activeTab)}
                  className={`
                    flex-1 py-3 flex flex-col items-center gap-1 transition-colors
                    ${
                      editorState.activeTab === tab.id
                        ? 'text-alecia-pink border-b-2 border-alecia-pink'
                        : 'text-alecia-gray-400 hover:text-white'
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-xs">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Contenu de l'onglet actif */}
            <div className="flex-1 overflow-hidden">
              {editorState.activeTab === 'chat' && <ChatPanel />}
              {editorState.activeTab === 'variables' && <VariablesPanel />}
              {editorState.activeTab === 'slides' && (
                <div className="p-4 text-alecia-gray-400 text-center">
                  <p>Sélectionnez une slide pour voir ses propriétés</p>
                </div>
              )}
              {editorState.activeTab === 'templates' && (
                <div className="p-4 text-alecia-gray-400 text-center">
                  <p>Templates disponibles</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default EditorLayout;
