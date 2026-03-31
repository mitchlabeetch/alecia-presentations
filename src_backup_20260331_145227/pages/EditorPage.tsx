/**
 * Editor Page - Interface principale d'édition
 * Tous les outils : drag & drop, templates, variables, IA, collaboration
 * Avec blocs prédéfinis et assets Alecia
 */

import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Hooks and Icons
import {
  ChevronLeft, Save, Share2, Download, Plus, Settings, Variable,
  Bot, Users, Grid, Type, Image, BarChart3, Table, Layout, Trash2, Copy, Eye,
  EyeOff, MoreHorizontal, Undo, Redo, ZoomIn, ZoomOut, Maximize2, X, Palette,
  Sparkles, Check, ChevronDown, GripVertical, FileText, Quote, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Link, Hash,
  Building2, TrendingUp, Handshake, Landmark, Award, Briefcase, Target, Lightbulb,
  MessageSquare, Calendar, MapPin, Phone, Mail, Globe, Linkedin, Twitter, ChevronRight
} from 'lucide-react';
// DnD
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Convex Integration
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";

// Components
import { AIChatPanel } from '../components/AIChatPanel';
import { SlideEditor } from '../components/SlideEditor';
import { useAuthStore } from '../store/authStore';

// API URL (legacy export only)
const API_URL = '/api';

// Types
interface Slide {
  id: string;
  type: string;
  title: string;
  content: any;
  layout?: any;
  order: number;
  is_hidden: boolean;
}

interface Presentation {
  id: string;
  title: string;
  description?: string;
  variables: Record<string, string>;
  settings?: any;
}

interface Collaborator {
  socketId: string;
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

// Slide Types with icons and descriptions
const SLIDE_TYPES = [
  { id: 'title', name: 'Titre', icon: Type, description: 'Page de couverture', color: 'from-blue-500 to-blue-600' },
  { id: 'content', name: 'Contenu', icon: FileText, description: 'Texte et listes', color: 'from-green-500 to-green-600' },
  { id: 'two-column', name: '2 Colonnes', icon: Layout, description: 'Deux colonnes', color: 'from-purple-500 to-purple-600' },
  { id: 'image', name: 'Image', icon: Image, description: 'Image avec légende', color: 'from-pink-500 to-pink-600' },
  { id: 'chart', name: 'Graphique', icon: BarChart3, description: 'Données visuelles', color: 'from-orange-500 to-orange-600' },
  { id: 'table', name: 'Tableau', icon: Table, description: 'Données tabulaires', color: 'from-cyan-500 to-cyan-600' },
  { id: 'team', name: 'Équipe', icon: Users, description: 'Présentation équipe', color: 'from-indigo-500 to-indigo-600' },
  { id: 'clients', name: 'Références', icon: Award, description: 'Logos clients', color: 'from-yellow-500 to-yellow-600' },
  { id: 'section', name: 'Section', icon: Hash, description: 'Séparateur', color: 'from-red-500 to-red-600' },
  { id: 'closing', name: 'Clôture', icon: MessageSquare, description: 'Page de fin', color: 'from-teal-500 to-teal-600' },
];

// Premade Content Blocks
const CONTENT_BLOCKS = [
  { id: 'heading', name: 'Titre', icon: Type, category: 'text' },
  { id: 'paragraph', name: 'Paragraphe', icon: AlignLeft, category: 'text' },
  { id: 'bullet-list', name: 'Liste à puces', icon: List, category: 'text' },
  { id: 'numbered-list', name: 'Liste numérotée', icon: ListOrdered, category: 'text' },
  { id: 'quote', name: 'Citation', icon: Quote, category: 'text' },
  { id: 'image-block', name: 'Image', icon: Image, category: 'media' },
  { id: 'chart-block', name: 'Graphique', icon: BarChart3, category: 'data' },
  { id: 'table-block', name: 'Tableau', icon: Table, category: 'data' },
  { id: 'spacer', name: 'Espace', icon: Layout, category: 'layout' },
  { id: 'divider', name: 'Séparateur', icon: GripVertical, category: 'layout' },
];

// Alecia Branded Templates
const ALECIA_TEMPLATES = [
  {
    id: 'pitch',
    name: 'Pitch Deck',
    icon: Target,
    description: 'Présentation client standard',
    slides: 5,
    category: 'vente'
  },
  {
    id: 'fundraising',
    name: 'Levée de Fonds',
    icon: TrendingUp,
    description: 'Accompagnement levée',
    slides: 7,
    category: 'finance'
  },
  {
    id: 'cession',
    name: 'Cession',
    icon: Handshake,
    description: 'Opération de cession',
    slides: 6,
    category: 'm&a'
  },
  {
    id: 'acquisition',
    name: 'Acquisition',
    icon: Building2,
    description: 'Projet acquisition',
    slides: 6,
    category: 'm&a'
  },
  {
    id: 'financing',
    name: 'Financements',
    icon: Landmark,
    description: 'Structuration dette',
    slides: 5,
    category: 'finance'
  },
  {
    id: 'team',
    name: 'Équipe',
    icon: Users,
    description: 'Présentation équipe',
    slides: 4,
    category: 'interne'
  },
  {
    id: 'references',
    name: 'Références',
    icon: Award,
    description: 'Track record clients',
    slides: 3,
    category: 'vente'
  },
  {
    id: 'report',
    name: 'Rapport',
    icon: FileText,
    description: 'Rapport générique',
    slides: 5,
    category: 'interne'
  },
];

// Default Variables
const DEFAULT_VARIABLES = {
  client: '',
  adresse_client: '',
  contact_nom: '',
  contact_fonction: '',
  date: new Date().toLocaleDateString('fr-FR'),
  date_longue: new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  nom_projet: '',
  montant: '',
  secteur: '',
  region: '',
  alecia_nom: '',
  alecia_email: '',
  alecia_telephone: '',
};

// Collaborator colors
const COLLABORATOR_COLORS = [
  '#e91e63', '#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#f44336', '#8bc34a'
];

const EditorPage: React.FC = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  // Convex State
  const projectId = presentationId as Id<"projects">;
  const project = useQuery(api.projects.get, { projectId });
  const slidesQuery = useQuery(api.slides.list, { projectId });

  // Convex Mutations
  const upsertSlide = useMutation(api.slides.upsert);
  const removeSlide = useMutation(api.slides.remove);
  const duplicateSlideDb = useMutation(api.slides.duplicate);
  const reorderSlides = useMutation(api.slides.reorder);

  // Presence
  const userId = useQuery(api.presence.getUserId);
  const presenceState = usePresence(
    api.presence,
    `project-${projectId}`,
    userId ?? "",
    10000
  );

  // Local State
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [showVariables, setShowVariables] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [activeTab, setActiveTab] = useState<'slides' | 'blocks' | 'templates'>('slides');
  // Local state for dragging
  const [localSlides, setLocalSlides] = useState<any[]>([]);
  const [draggedSlide, setDraggedSlide] = useState<any | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync Convex query to local state for DND support
  React.useEffect(() => {
    if (slidesQuery) setLocalSlides(slidesQuery);
  }, [slidesQuery]);

  // Sensors for drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  );

  // Load presentation
  useEffect(() => {
    if (presentationId) {
      loadPresentation();
      initSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-presentation', { presentationId });
        socketRef.current.disconnect();
      }
    };
  }, [presentationId]);

  const initSocket = () => {
    // Initialize Socket.io connection
    import('socket.io-client').then(({ io }) => {
      socketRef.current = io('http://localhost:3001');

      socketRef.current.emit('join-presentation', {
        presentationId,
        user: {
          id: user?.id,
          name: `${user?.firstName} ${user?.lastName}`,
          avatar: user?.avatarUrl
        }
      });

      socketRef.current.on('users-list', (users: any[]) => {
        setCollaborators(users.map((u, i) => ({
          ...u,
          color: COLLABORATOR_COLORS[i % COLLABORATOR_COLORS.length]
        })));
      });

      socketRef.current.on('user-joined', ({ user, users }: any) => {
        setCollaborators(users.map((u: any, i: number) => ({
          ...u,
          color: COLLABORATOR_COLORS[i % COLLABORATOR_COLORS.length]
        })));
        addActivity(`${user.name} a rejoint`);
      });

      socketRef.current.on('user-left', ({ users }: any) => {
        setCollaborators(users.map((u: any, i: number) => ({
          ...u,
          color: COLLABORATOR_COLORS[i % COLLABORATOR_COLORS.length]
        })));
      });

      socketRef.current.on('slide-updated', ({ slideId, updates, user }: any) => {
        setSlides(prev => prev.map(s => s.id === slideId ? { ...s, ...updates } : s));
        addActivity(`${user?.name} a modifié une slide`);
      });
    });
  };

  const addActivity = (message: string) => {
    setActivities(prev => [{ id: Date.now(), message, time: new Date() }, ...prev].slice(0, 20));
  };

  const loadPresentation = async () => {
    try {
      const response = await fetch(`${API_URL}/presentations/${presentationId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPresentation(data);
        setSlides(data.slides || []);
        if (data.slides?.length > 0) {
          setSelectedSlideId(data.slides[0].id);
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to load presentation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSlide = async (type: string, templateData?: any) => {
    const newSlideContent = templateData || getDefaultContent(type);
    await upsertSlide({
      projectId,
      order: localSlides.length,
      type,
      title: getDefaultTitle(type),
      content: typeof newSlideContent === 'string' ? newSlideContent : JSON.stringify(newSlideContent),
    });
  };

  const getDefaultTitle = (type: string): string => {
    const titles: Record<string, string> = {
      title: 'Titre de la présentation', content: 'Nouvelle slide', 'two-column': 'Comparaison',
      image: 'Image', chart: 'Graphique', table: 'Tableau', team: 'Notre équipe',
      clients: 'Nos références', section: 'Nouvelle section', closing: 'Merci'
    };
    return titles[type] || 'Nouvelle slide';
  };

  const getDefaultContent = (type: string): any => {
    const contents: Record<string, any> = {
      title: { subtitle: 'Sous-titre', showDate: true },
      content: { text: '', bullets: ['Point 1', 'Point 2', 'Point 3'] },
      'two-column': { left: { title: 'Colonne 1', text: '' }, right: { title: 'Colonne 2', text: '' } },
      image: { caption: '', align: 'center' }, chart: { chartType: 'bar', data: [] },
      table: { headers: ['Colonne 1', 'Colonne 2'], rows: [['', '']] },
      team: { members: [{ name: 'Nom', role: 'Fonction' }] },
      clients: { logos: [] }, section: {}, closing: { contact: '', email: '' }
    };
    return contents[type] || {};
  };

  const deleteSlide = async (slideId: string) => {
    if (!confirm('Supprimer cette slide ?')) return;
    await removeSlide({ slideId: slideId as Id<"slides"> });
    if (selectedSlideId === slideId) setSelectedSlideId(null);
  };

  const duplicateSlide = async (slide: any) => {
    await duplicateSlideDb({ slideId: slide._id });
  };

  const toggleSlideVisibility = async (slide: any) => {
    // Removed visibility toggle for prototype scale, or mock update depending on schema
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = localSlides.findIndex(s => s._id === active.id);
      const newIndex = localSlides.findIndex(s => s._id === over.id);
      const reordered = arrayMove(localSlides, oldIndex, newIndex);
      setLocalSlides(reordered);
      await reorderSlides({ projectId, slideIds: reordered.map(s => s._id) });
    }
    setDraggedSlide(null);
  };

  const exportPPTX = async () => {
    try {
      setIsSaving(true);
      const siteUrlRaw = import.meta.env.VITE_CONVEX_SITE_URL;
      const convexSiteUrl = siteUrlRaw || import.meta.env.VITE_CONVEX_URL.replace(".cloud", ".site");
      const response = await fetch(`${convexSiteUrl}/export/pptx?projectId=${projectId}`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project?.name || 'presentation'}.pptx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const errorText = await response.text();
        console.error('Export PPTX failed:', response.status, errorText);
        alert(`Erreur lors de l'export: ${response.status}. Vérifiez que les fonctions sont déployées sur le VPS.`);
      }
    } catch (err) {
      console.error('Export fetch error:', err);
      alert('Erreur réseau lors de l\'export. Vérifiez la connexion au backend.');
    } finally {
      setIsSaving(false);
      setShowExportMenu(false);
    }
  };

  const applyTemplate = async (templateId: string) => {
    const template = ALECIA_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    for (let i = 0; i < template.slides; i++) {
      await addSlide(i === 0 ? 'title' : 'content');
    }
    setShowTemplates(false);
  };

  const updateVariables = async (newVars: Record<string, string>) => {
    // Project theming update mock
  };

  const selectedSlide = localSlides.find(s => s._id === selectedSlideId);
  const selectedSlideIndex = localSlides.findIndex(s => s._id === selectedSlideId);
  const variables = {};

  if (slidesQuery === undefined || !project) {
    return (
      <div className="min-h-screen bg-alecia-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-alecia-pink border-t-transparent rounded-full animate-spin" />
          <p className="text-alecia-gray-400">Chargement de la présentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-alecia-navy flex flex-col">
      {/* Header */}
      <header className="bg-alecia-navy-light/90 backdrop-blur-md border-b border-alecia-navy-lighter/30 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-alecia-navy-lighter rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <h1 className="font-semibold text-white">{project?.name || 'Projet'}</h1>
            <p className="text-xs text-alecia-gray-500">
              {localSlides.length} slide{localSlides.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Collaborators (Handled Native by Convex Presence) */}
          {userId && presenceState && (
            <div className="mr-4">
              <FacePile presenceState={presenceState} />
            </div>
          )}

          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 bg-alecia-navy rounded-xl p-1 mr-2 border border-alecia-navy-lighter/30">
            <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1.5 hover:bg-alecia-navy-lighter rounded-lg">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs w-10 text-center font-medium">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-1.5 hover:bg-alecia-navy-lighter rounded-lg">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowCollaboration(!showCollaboration)}
            className={`p-2.5 rounded-xl transition-colors ${showCollaboration ? 'bg-alecia-pink/20 text-alecia-pink' : 'hover:bg-alecia-navy-lighter'}`}
            title="Collaboration"
          >
            <Users className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowAIChat(!showAIChat)}
            className={`p-2.5 rounded-xl transition-colors ${showAIChat ? 'bg-alecia-pink/20 text-alecia-pink' : 'hover:bg-alecia-navy-lighter'}`}
            title="Assistant IA"
          >
            <Bot className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isSaving}
              className="px-4 py-2.5 bg-gradient-to-r from-alecia-pink to-alecia-pink-dark text-white rounded-xl hover:shadow-lg hover:shadow-alecia-pink/30 transition-all flex items-center gap-2 font-medium disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter</span>
            </button>

            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-alecia-navy-light rounded-xl border border-alecia-navy-lighter/50 shadow-xl py-1 z-50"
                >
                  <button
                    onClick={exportPPTX}
                    className="w-full px-4 py-3 text-left hover:bg-alecia-navy-lighter flex items-center gap-3"
                  >
                    <FileText className="w-5 h-5 text-alecia-pink" />
                    <div>
                      <p className="font-medium">PowerPoint</p>
                      <p className="text-xs text-alecia-gray-500">.pptx</p>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-alecia-navy-light border-r border-alecia-navy-lighter/30 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-alecia-navy-lighter/30">
            {[
              { id: 'slides', icon: Layout, label: 'Slides' },
              { id: 'blocks', icon: Grid, label: 'Blocs' },
              { id: 'templates', icon: Sparkles, label: 'Modèles' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm transition-colors ${activeTab === tab.id
                  ? 'text-alecia-pink border-b-2 border-alecia-pink bg-alecia-pink/5'
                  : 'text-alecia-gray-400 hover:text-white hover:bg-alecia-navy-lighter/50'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'slides' && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={(e) => setDraggedSlide(localSlides.find(s => s._id === e.active.id) || null)}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={localSlides.map(s => s._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {localSlides.map((slide: any, index) => (
                      <SortableSlide
                        key={slide._id}
                        slide={slide}
                        index={index}
                        isSelected={slide._id === selectedSlideId}
                        onSelect={() => setSelectedSlideId(slide._id)}
                        onDelete={() => deleteSlide(slide._id)}
                        onDuplicate={() => duplicateSlide(slide)}
                        onToggleVisibility={() => toggleSlideVisibility(slide)}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {draggedSlide && (
                    <div className="opacity-80 p-4 bg-alecia-navy rounded-xl border border-alecia-pink">{draggedSlide.title}</div>
                  )}
                </DragOverlay>
              </DndContext>
            )}

            {activeTab === 'blocks' && (
              <div className="space-y-6">
                {/* Text Blocks */}
                <div>
                  <h3 className="text-xs font-semibold text-alecia-gray-500 uppercase tracking-wider mb-3">Texte</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {CONTENT_BLOCKS.filter(b => b.category === 'text').map(block => (
                      <button
                        key={block.id}
                        onClick={() => {/* Add block to slide */ }}
                        className="p-3 bg-alecia-navy rounded-xl hover:bg-alecia-navy-lighter transition-all flex flex-col items-center gap-2 group border border-transparent hover:border-alecia-navy-lighter"
                      >
                        <block.icon className="w-5 h-5 text-alecia-pink group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-alecia-gray-400 group-hover:text-white">{block.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Media Blocks */}
                <div>
                  <h3 className="text-xs font-semibold text-alecia-gray-500 uppercase tracking-wider mb-3">Média</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {CONTENT_BLOCKS.filter(b => b.category === 'media').map(block => (
                      <button
                        key={block.id}
                        onClick={() => {/* Add block to slide */ }}
                        className="p-3 bg-alecia-navy rounded-xl hover:bg-alecia-navy-lighter transition-all flex flex-col items-center gap-2 group border border-transparent hover:border-alecia-navy-lighter"
                      >
                        <block.icon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-alecia-gray-400 group-hover:text-white">{block.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Data Blocks */}
                <div>
                  <h3 className="text-xs font-semibold text-alecia-gray-500 uppercase tracking-wider mb-3">Données</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {CONTENT_BLOCKS.filter(b => b.category === 'data').map(block => (
                      <button
                        key={block.id}
                        onClick={() => {/* Add block to slide */ }}
                        className="p-3 bg-alecia-navy rounded-xl hover:bg-alecia-navy-lighter transition-all flex flex-col items-center gap-2 group border border-transparent hover:border-alecia-navy-lighter"
                      >
                        <block.icon className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-alecia-gray-400 group-hover:text-white">{block.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-4">
                <p className="text-sm text-alecia-gray-500">
                  Sélectionnez un template pour créer une présentation pré-construite
                </p>

                {/* Categories */}
                {['finance', 'm&a', 'vente', 'interne'].map(category => (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-alecia-gray-500 uppercase tracking-wider mb-3">
                      {category === 'm&a' ? 'M&A' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </h3>
                    <div className="space-y-2">
                      {ALECIA_TEMPLATES.filter(t => t.category === category).map(template => (
                        <button
                          key={template.id}
                          onClick={() => applyTemplate(template.id)}
                          className="w-full p-4 bg-alecia-navy rounded-xl hover:bg-alecia-navy-lighter transition-all text-left group border border-transparent hover:border-alecia-navy-lighter"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-alecia-pink/20 to-alecia-pink/10 flex items-center justify-center flex-shrink-0">
                              <template.icon className="w-5 h-5 text-alecia-pink" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-white group-hover:text-alecia-pink transition-colors">{template.name}</h4>
                                <span className="text-xs text-alecia-gray-500">{template.slides} slides</span>
                              </div>
                              <p className="text-xs text-alecia-gray-500 mt-1">{template.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Slide Button */}
          <div className="p-4 border-t border-alecia-navy-lighter/30">
            <button
              onClick={() => addSlide('content')}
              className="w-full py-3 bg-gradient-to-r from-alecia-pink to-alecia-pink-dark text-white rounded-xl hover:shadow-lg hover:shadow-alecia-pink/30 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Ajouter une slide
            </button>
          </div>
        </div>

        {/* Main Canvas with Convex Component */}
        <div className="flex-1 bg-alecia-navy/50 flex flex-col p-4 md:p-8 overflow-auto">
          {selectedSlide ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={selectedSlide._id}
              className="bg-white rounded-2xl shadow-2xl relative overflow-hidden flex-1 flex"
            >
              <SlideEditor
                slide={selectedSlide}
                project={project}
                onPrev={() => setSelectedSlideId(localSlides[Math.max(0, selectedSlideIndex - 1)]._id)}
                onNext={() => setSelectedSlideId(localSlides[Math.min(localSlides.length - 1, selectedSlideIndex + 1)]._id)}
                hasPrev={selectedSlideIndex > 0}
                hasNext={selectedSlideIndex < localSlides.length - 1}
                slideIndex={selectedSlideIndex}
                totalSlides={localSlides.length}
              />
            </motion.div>
          ) : (
            <div className="m-auto text-center text-alecia-gray-500">
              <div className="w-20 h-20 rounded-2xl bg-alecia-navy-light flex items-center justify-center mx-auto mb-4">
                <Layout className="w-10 h-10" />
              </div>
              <p className="text-lg">Sélectionnez une slide pour l'éditer</p>
              <p className="text-sm mt-2">ou ajoutez une nouvelle slide</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties & Variables */}
        <div className="w-80 bg-alecia-navy-light border-l border-alecia-navy-lighter/30 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-alecia-navy-lighter/30">
            <button
              onClick={() => setShowVariables(false)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${!showVariables ? 'text-alecia-pink border-b-2 border-alecia-pink bg-alecia-pink/5' : 'text-alecia-gray-400 hover:text-white'}`}
            >
              Propriétés
            </button>
            <button
              onClick={() => setShowVariables(true)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${showVariables ? 'text-alecia-pink border-b-2 border-alecia-pink bg-alecia-pink/5' : 'text-alecia-gray-400 hover:text-white'}`}
            >
              Variables
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {showVariables ? (
              <VariablesPanel
                presentationId={presentationId!}
                variables={variables}
                onUpdate={updateVariables}
              />
            ) : selectedSlide ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-alecia-gray-400 mb-2">Titre de la slide</label>
                  <input
                    type="text"
                    value={selectedSlide.title}
                    onChange={(e) => {
                      // Update slide title
                    }}
                    className="w-full px-4 py-3 bg-alecia-navy rounded-xl border border-alecia-navy-lighter/50 text-white text-sm focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-alecia-gray-400 mb-2">Type de slide</label>
                  <select
                    value={selectedSlide.type}
                    onChange={(e) => {
                      // Update slide type
                    }}
                    className="w-full px-4 py-3 bg-alecia-navy rounded-xl border border-alecia-navy-lighter/50 text-white text-sm focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none"
                  >
                    {SLIDE_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-alecia-gray-400 mb-2">Visibilité</label>
                  <button
                    onClick={() => toggleSlideVisibility(selectedSlide)}
                    className={`w-full px-4 py-3 rounded-xl border flex items-center justify-center gap-2 transition-colors ${selectedSlide.is_hidden
                      ? 'border-alecia-gray-600 text-alecia-gray-500 bg-alecia-navy'
                      : 'border-green-500/50 text-green-400 bg-green-500/10'
                      }`}
                  >
                    {selectedSlide.is_hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {selectedSlide.is_hidden ? 'Masquée' : 'Visible'}
                  </button>
                </div>

                <div className="pt-6 border-t border-alecia-navy-lighter/30">
                  <button
                    onClick={() => deleteSlide(selectedSlide.id)}
                    className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 font-medium border border-red-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer la slide
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-alecia-navy-lighter/50 flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-alecia-gray-500" />
                </div>
                <p className="text-alecia-gray-500">Sélectionnez une slide pour voir ses propriétés</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Chat Panel Powered By Convex */}
        <AnimatePresence>
          {showAIChat && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="w-80 bg-white border-l border-gray-200 flex flex-col"
            >
              <div className="p-2 flex justify-end"><button onClick={() => setShowAIChat(false)}><X className="w-4 h-4" /></button></div>
              <AIChatPanel projectId={projectId} project={project!} slides={localSlides} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collaboration Panel */}
        <AnimatePresence>
          {showCollaboration && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="w-72 bg-alecia-navy-light border-l border-alecia-navy-lighter/30 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-alecia-navy-lighter/30">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Collaboration
                </h3>
                <button onClick={() => setShowCollaboration(false)} className="p-2 hover:bg-alecia-navy-lighter rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 border-b border-alecia-navy-lighter/30">
                <h4 className="text-xs font-semibold text-alecia-gray-500 uppercase tracking-wider mb-3">En ligne ({collaborators.length})</h4>
                <div className="space-y-2">
                  {collaborators.map((c) => (
                    <div key={c.socketId} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: c.color }}
                      >
                        {c.name?.[0]}
                      </div>
                      <span className="text-sm text-white">{c.name}</span>
                      {c.id === user?.id && <span className="text-xs text-alecia-gray-500">(vous)</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <h4 className="text-xs font-semibold text-alecia-gray-500 uppercase tracking-wider mb-3">Activité récente</h4>
                <div className="space-y-3">
                  {activities.length === 0 && (
                    <p className="text-sm text-alecia-gray-500">Aucune activité récente</p>
                  )}
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-alecia-pink mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-white">{activity.message}</p>
                        <p className="text-xs text-alecia-gray-500">
                          {activity.time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close menus */}
      {showExportMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setShowExportMenu(false)} />
      )}
    </div>
  );
};

// Sortable Slide Component
interface SortableSlideProps {
  slide: { _id: string, title?: string, is_hidden?: boolean, type: string };
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
}

const SortableSlide: React.FC<SortableSlideProps> = ({
  slide,
  index,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleVisibility
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide._id });


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const slideType = SLIDE_TYPES.find(t => t.id === slide.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative bg-alecia-navy rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${isSelected
        ? 'border-alecia-pink ring-2 ring-alecia-pink/20'
        : 'border-transparent hover:border-alecia-navy-lighter'
        } ${slide.is_hidden ? 'opacity-40' : ''}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing z-10"
      >
        <div className="p-1 hover:bg-alecia-navy-lighter rounded">
          <GripVertical className="w-4 h-4 text-alecia-gray-500" />
        </div>
      </div>

      {/* Slide Content */}
      <div className="aspect-video p-4 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-alecia-gray-500">{index + 1}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
              className="p-1.5 hover:bg-alecia-navy-lighter rounded"
              title={slide.is_hidden ? 'Afficher' : 'Masquer'}
            >
              {slide.is_hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
              className="p-1.5 hover:bg-alecia-navy-lighter rounded"
              title="Dupliquer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded"
              title="Supprimer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          {slideType && (
            <slideType.icon className="w-6 h-6 text-alecia-gray-600 mb-2" />
          )}
          <span className="text-sm text-alecia-gray-400 truncate text-center max-w-full">{slide.title}</span>
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-alecia-pink rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Hidden indicator */}
      {slide.is_hidden && (
        <div className="absolute inset-0 flex items-center justify-center bg-alecia-navy/60">
          <EyeOff className="w-6 h-6 text-alecia-gray-500" />
        </div>
      )}
    </div>
  );
};

// Simple Slide Thumbnail (for drag overlay)
const SlideThumbnail: React.FC<{
  slide: Slide;
  index: number;
}> = ({ slide, index }) => {
  const slideType = SLIDE_TYPES.find(t => t.id === slide.type);

  return (
    <div className="bg-alecia-navy rounded-xl border-2 border-alecia-pink shadow-2xl w-64">
      <div className="aspect-video p-4 flex flex-col">
        <span className="text-xs font-medium text-alecia-gray-500 mb-2">{index + 1}</span>
        <div className="flex-1 flex flex-col items-center justify-center">
          {slideType && <slideType.icon className="w-6 h-6 text-alecia-gray-600 mb-2" />}
          <span className="text-sm text-alecia-gray-400 truncate">{slide.title}</span>
        </div>
      </div>
    </div>
  );
};

// Variables Panel
const VariablesPanel: React.FC<{
  presentationId: string;
  variables: Record<string, string>;
  onUpdate: (vars: Record<string, string>) => void;
}> = ({ variables, onUpdate }) => {
  const [localVars, setLocalVars] = useState(variables);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalVars(variables);
  }, [variables]);

  const updateVariable = (key: string, value: string) => {
    const newVars = { ...localVars, [key]: value };
    setLocalVars(newVars);
    setHasChanges(true);
  };

  const saveVariables = () => {
    onUpdate(localVars);
    setHasChanges(false);
  };

  const addVariable = () => {
    const key = prompt('Nom de la variable (sans {{ }}):');
    if (key && !localVars[key]) {
      setLocalVars({ ...localVars, [key]: '' });
      setHasChanges(true);
    }
  };

  const removeVariable = (key: string) => {
    const newVars = { ...localVars };
    delete newVars[key];
    setLocalVars(newVars);
    setHasChanges(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-white flex items-center gap-2">
          <Variable className="w-4 h-4 text-alecia-pink" />
          Variables
        </h3>
        <button
          onClick={addVariable}
          className="text-xs text-alecia-pink hover:underline flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Ajouter
        </button>
      </div>

      <p className="text-xs text-alecia-gray-500">
        Utilisez {'{{'}nom{'}'} dans votre contenu pour insérer ces valeurs
      </p>

      <div className="space-y-3">
        {Object.entries(localVars).map(([key, value]) => (
          <div key={key} className="group">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-alecia-pink font-mono">
                {`{{${key}}}`}
              </label>
              <button
                onClick={() => removeVariable(key)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-red-400 rounded transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => updateVariable(key, e.target.value)}
              placeholder={`Valeur pour ${key}`}
              className="w-full px-3 py-2.5 bg-alecia-navy rounded-xl border border-alecia-navy-lighter/50 text-white text-sm focus:border-alecia-pink focus:ring-2 focus:ring-alecia-pink/20 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {Object.keys(localVars).length === 0 && (
        <div className="text-center py-6">
          <Variable className="w-10 h-10 text-alecia-gray-600 mx-auto mb-2" />
          <p className="text-sm text-alecia-gray-500">Aucune variable définie</p>
        </div>
      )}

      {hasChanges && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={saveVariables}
          className="w-full py-2.5 bg-alecia-pink text-white rounded-xl hover:bg-alecia-pink-dark transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Appliquer les variables
        </motion.button>
      )}
    </div>
  );
};

export default EditorPage;
