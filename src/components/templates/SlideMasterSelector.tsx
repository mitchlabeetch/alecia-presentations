/**
 * SlideMasterSelector Component
 * Allows users to choose a slide master when creating new slides
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

// Slide master types
export type SlideMasterType = 'title' | 'content' | 'section' | 'closing' | 'chart' | 'table';

export interface SlideMasterOption {
  id: string;
  name: string;
  type: SlideMasterType;
  description: string;
  emoji: string;
  preview: {
    background: string;
    accentColor: string;
    elements: Array<{ type: string; x: number; y: number; w: number; h: number }>;
  };
}

const SLIDE_MASTERS: SlideMasterOption[] = [
  {
    id: 'master-title',
    name: 'Maître Titre',
    type: 'title',
    description: 'Page de couverture avec grand titre centré',
    emoji: '📄',
    preview: {
      background: '#0a1628',
      accentColor: '#c9a84c',
      elements: [
        { type: 'accent-line', x: 40, y: 30, w: 20, h: 2 },
        { type: 'title', x: 10, y: 40, w: 80, h: 20 },
        { type: 'subtitle', x: 20, y: 65, w: 60, h: 10 },
        { type: 'accent-line', x: 40, y: 80, w: 20, h: 2 },
      ],
    },
  },
  {
    id: 'master-content',
    name: 'Maître Contenu',
    type: 'content',
    description: 'Contenu principal avec titre et zone de texte',
    emoji: '📝',
    preview: {
      background: '#ffffff',
      accentColor: '#c9a84c',
      elements: [
        { type: 'accent-bar', x: 0, y: 0, w: 100, h: 4 },
        { type: 'title', x: 5, y: 8, w: 90, h: 12 },
        { type: 'content-area', x: 5, y: 25, w: 90, h: 65 },
        { type: 'footer-bar', x: 0, y: 95, w: 100, h: 5 },
      ],
    },
  },
  {
    id: 'master-section',
    name: 'Maître Section',
    type: 'section',
    description: 'Slide de transition entre sections',
    emoji: '📑',
    preview: {
      background: '#1a3a5c',
      accentColor: '#c9a84c',
      elements: [
        { type: 'accent-line', x: 35, y: 35, w: 30, h: 3 },
        { type: 'section-title', x: 10, y: 45, w: 80, h: 20 },
        { type: 'accent-line', x: 35, y: 70, w: 30, h: 3 },
      ],
    },
  },
  {
    id: 'master-closing',
    name: 'Maître Clôture',
    type: 'closing',
    description: 'Page de fin avec informations de contact',
    emoji: '✅',
    preview: {
      background: '#0a1628',
      accentColor: '#c9a84c',
      elements: [
        { type: 'thank-you', x: 20, y: 25, w: 60, h: 15 },
        { type: 'accent-divider', x: 30, y: 45, w: 40, h: 2 },
        { type: 'contact-info', x: 25, y: 55, w: 50, h: 30 },
        { type: 'footer-accent', x: 40, y: 90, w: 20, h: 3 },
      ],
    },
  },
  {
    id: 'master-chart',
    name: 'Maître Graphique',
    type: 'chart',
    description: 'Slide dédiée aux graphiques et données',
    emoji: '📊',
    preview: {
      background: '#ffffff',
      accentColor: '#c9a84c',
      elements: [
        { type: 'accent-bar', x: 0, y: 0, w: 100, h: 4 },
        { type: 'title', x: 5, y: 8, w: 70, h: 12 },
        { type: 'chart-area', x: 5, y: 25, w: 60, h: 65 },
        { type: 'legend', x: 70, y: 30, w: 25, h: 40 },
        { type: 'footer-bar', x: 0, y: 95, w: 100, h: 5 },
      ],
    },
  },
  {
    id: 'master-table',
    name: 'Maître Tableau',
    type: 'table',
    description: 'Slide pour tableaux et données structurées',
    emoji: '📋',
    preview: {
      background: '#ffffff',
      accentColor: '#c9a84c',
      elements: [
        { type: 'accent-bar', x: 0, y: 0, w: 100, h: 4 },
        { type: 'title', x: 5, y: 8, w: 90, h: 12 },
        { type: 'table-area', x: 5, y: 25, w: 90, h: 60 },
        { type: 'footer-bar', x: 0, y: 95, w: 100, h: 5 },
      ],
    },
  },
];

interface SlideMasterSelectorProps {
  onSelect: (master: SlideMasterOption) => void;
  onClose: () => void;
  selectedMasterId?: string;
}

export function SlideMasterSelector({
  onSelect,
  onClose,
  selectedMasterId,
}: SlideMasterSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#0a1628]">Choisir un maître de slide</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Sélectionnez un modèle de base pour votre nouvelle slide
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Slide Masters Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SLIDE_MASTERS.map((master) => {
              const isSelected = selectedMasterId === master.id;
              const isHovered = hoveredId === master.id;

              return (
                <motion.div
                  key={master.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: SLIDE_MASTERS.indexOf(master) * 0.05 }}
                  onMouseEnter={() => setHoveredId(master.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onSelect(master)}
                  className={clsx(
                    'rounded-xl border-2 p-4 cursor-pointer transition-all',
                    isSelected
                      ? 'border-[#c9a84c] bg-[#c9a84c]/5 shadow-md'
                      : isHovered
                        ? 'border-[#0a1628]/30 bg-gray-50 shadow-sm'
                        : 'border-gray-100 hover:border-gray-200'
                  )}
                >
                  {/* Mini preview */}
                  <div
                    className="w-full aspect-video rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
                    style={{ background: master.preview.background }}
                  >
                    {/* Preview elements */}
                    {master.preview.elements.map((el, idx) => {
                      if (el.type === 'accent-line') {
                        return (
                          <div
                            key={idx}
                            className="absolute rounded"
                            style={{
                              left: `${el.x}%`,
                              top: `${el.y}%`,
                              width: `${el.w}%`,
                              height: `${el.h}%`,
                              background: master.preview.accentColor,
                            }}
                          />
                        );
                      }
                      if (el.type === 'title' || el.type === 'section-title') {
                        return (
                          <div
                            key={idx}
                            className="absolute bg-white/20 rounded"
                            style={{
                              left: `${el.x}%`,
                              top: `${el.y}%`,
                              width: `${el.w}%`,
                              height: `${el.h}%`,
                            }}
                          />
                        );
                      }
                      if (el.type === 'subtitle' || el.type === 'thank-you') {
                        return (
                          <div
                            key={idx}
                            className="absolute bg-white/10 rounded"
                            style={{
                              left: `${el.x}%`,
                              top: `${el.y}%`,
                              width: `${el.w}%`,
                              height: `${el.h}%`,
                            }}
                          />
                        );
                      }
                      if (el.type === 'accent-bar' || el.type === 'footer-bar' || el.type === 'footer-accent') {
                        return (
                          <div
                            key={idx}
                            className="absolute"
                            style={{
                              left: `${el.x}%`,
                              top: `${el.y}%`,
                              width: `${el.w}%`,
                              height: `${el.h}%`,
                              background: master.preview.accentColor,
                            }}
                          />
                        );
                      }
                      if (el.type === 'content-area' || el.type === 'chart-area' || el.type === 'table-area') {
                        return (
                          <div
                            key={idx}
                            className="absolute bg-gray-100/50 rounded"
                            style={{
                              left: `${el.x}%`,
                              top: `${el.y}%`,
                              width: `${el.w}%`,
                              height: `${el.h}%`,
                            }}
                          />
                        );
                      }
                      if (el.type === 'legend') {
                        return (
                          <div
                            key={idx}
                            className="absolute flex flex-col gap-1"
                            style={{
                              left: `${el.x}%`,
                              top: `${el.y}%`,
                              width: `${el.w}%`,
                              height: `${el.h}%`,
                            }}
                          >
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded bg-white/30" />
                                <div className="flex-1 h-2 bg-white/10 rounded" />
                              </div>
                            ))}
                          </div>
                        );
                      }
                      if (el.type === 'accent-divider') {
                        return (
                          <div
                            key={idx}
                            className="absolute rounded"
                            style={{
                              left: `${el.x}%`,
                              top: `${el.y}%`,
                              width: `${el.w}%`,
                              height: `${el.h}%`,
                              background: master.preview.accentColor,
                            }}
                          />
                        );
                      }
                      if (el.type === 'contact-info') {
                        return (
                          <div
                            key={idx}
                            className="absolute flex flex-col gap-2 justify-center"
                            style={{
                              left: `${el.x}%`,
                              top: `${el.y}%`,
                              width: `${el.w}%`,
                              height: `${el.h}%`,
                            }}
                          >
                            <div className="h-1 bg-white/20 rounded w-full" />
                            <div className="h-1 bg-white/10 rounded w-3/4" />
                            <div className="h-1 bg-white/10 rounded w-full" />
                            <div className="h-1 bg-white/10 rounded w-2/3" />
                          </div>
                        );
                      }
                      return null;
                    })}

                    {/* Emoji overlay */}
                    <span className="text-2xl relative z-10">{master.emoji}</span>
                  </div>

                  {/* Master info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[#0a1628] text-sm mb-0.5">
                        {master.name}
                      </h3>
                      <p className="text-xs text-gray-500 leading-tight">
                        {master.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#c9a84c] flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              if (selectedMasterId) {
                const master = SLIDE_MASTERS.find((m) => m.id === selectedMasterId);
                if (master) onSelect(master);
              }
            }}
            disabled={!selectedMasterId}
            className="px-6 py-2 rounded-lg bg-[#0a1628] text-white text-sm font-medium hover:bg-[#0a1628]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Utiliser ce maître
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Export masters for use elsewhere
export { SLIDE_MASTERS };
