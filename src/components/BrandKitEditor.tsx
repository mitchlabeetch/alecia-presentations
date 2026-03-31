/**
 * BrandKitEditor Component
 * Editor for configuring Alecia brand colors, typography, and logos
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { ColorPicker } from './ColorPicker';

interface BrandKitColors {
  primary: string;
  accent: string;
  secondary: string;
  text: {
    primary: string;
    secondary: string;
  };
  backgrounds: {
    light: string;
    dark: string;
    card: string;
  };
}

interface BrandKitTypography {
  heading: {
    fontFamily: string;
    weights: number[];
  };
  body: {
    fontFamily: string;
    weights: number[];
  };
  mono: {
    fontFamily: string;
    weights: number[];
  };
}

interface BrandKit {
  colors: BrandKitColors;
  typography: BrandKitTypography;
}

const DEFAULT_BRAND_KIT: BrandKit = {
  colors: {
    primary: '#0a1628',
    accent: '#c9a84c',
    secondary: '#1e3a5f',
    text: {
      primary: '#1a1a1a',
      secondary: '#6b7280',
    },
    backgrounds: {
      light: '#f8fafc',
      dark: '#0a1628',
      card: '#ffffff',
    },
  },
  typography: {
    heading: {
      fontFamily: 'Inter',
      weights: [600, 700, 800],
    },
    body: {
      fontFamily: 'Inter',
      weights: [400, 500, 600],
    },
    mono: {
      fontFamily: 'JetBrains Mono',
      weights: [400, 500],
    },
  },
};

const COLOR_PRESETS = [
  { name: 'Marine & Or (Alecia)', primary: '#0a1628', accent: '#c9a84c', secondary: '#1e3a5f' },
  { name: 'Bordeaux & Argent', primary: '#6b1a2a', accent: '#9ca3af', secondary: '#8b2942' },
  { name: 'Vert & Bronze', primary: '#1a4a2e', accent: '#b87333', secondary: '#2d6b47' },
  { name: 'Ardoise & Cyan', primary: '#1e3a5f', accent: '#06b6d4', secondary: '#2563eb' },
  { name: 'Noir & Or', primary: '#111827', accent: '#f59e0b', secondary: '#1f2937' },
  { name: 'Indigo & Rose', primary: '#3730a3', accent: '#db2777', secondary: '#4f46e5' },
  { name: 'Teal & Ambre', primary: '#0f766e', accent: '#d97706', secondary: '#14b8a6' },
  { name: 'Prune & Vert', primary: '#4c1d95', accent: '#16a34a', secondary: '#7c3aed' },
];

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter', preview: 'Aa Bb Cc 123' },
  { value: 'Georgia', label: 'Georgia', preview: 'Aa Bb Cc 123' },
  { value: 'Times New Roman', label: 'Times New Roman', preview: 'Aa Bb Cc 123' },
  { value: 'Arial', label: 'Arial', preview: 'Aa Bb Cc 123' },
  { value: 'Helvetica', label: 'Helvetica', preview: 'Aa Bb Cc 123' },
  { value: 'Roboto', label: 'Roboto', preview: 'Aa Bb Cc 123' },
  { value: 'Poppins', label: 'Poppins', preview: 'Aa Bb Cc 123' },
  { value: 'Montserrat', label: 'Montserrat', preview: 'Aa Bb Cc 123' },
];

type Tab = 'colors' | 'typography' | 'preview';

interface BrandKitEditorProps {
  initialBrandKit?: BrandKit;
  onSave: (brandKit: BrandKit) => void;
  onClose: () => void;
}

export function BrandKitEditor({
  initialBrandKit,
  onSave,
  onClose,
}: BrandKitEditorProps) {
  const brandKit = initialBrandKit || DEFAULT_BRAND_KIT;
  const [activeTab, setActiveTab] = useState<Tab>('colors');
  const [colors, setColors] = useState<BrandKitColors>(brandKit.colors);
  const [typography, setTypography] = useState<BrandKitTypography>(brandKit.typography);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(
    COLOR_PRESETS.find(
      (p) =>
        p.primary.toLowerCase() === colors.primary.toLowerCase() &&
        p.accent.toLowerCase() === colors.accent.toLowerCase()
    )?.name || null
  );

  const handlePresetSelect = (preset: typeof COLOR_PRESETS[0]) => {
    setSelectedPreset(preset.name);
    setColors({
      ...colors,
      primary: preset.primary,
      accent: preset.accent,
      secondary: preset.secondary,
    });
  };

  const handleSave = () => {
    onSave({ colors, typography });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#0a1628] to-[#1e3a5f]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Brand Kit Editor</h2>
              <p className="text-sm text-white/60">
                Personnalisez l'identité visuelle de vos présentations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {[
            { id: 'colors' as Tab, label: 'Couleurs', icon: '🎨' },
            { id: 'typography' as Tab, label: 'Typographie', icon: '🔤' },
            { id: 'preview' as Tab, label: 'Aperçu', icon: '👁️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2',
                activeTab === tab.id
                  ? 'text-[#0a1628] border-b-2 border-[#c9a84c] bg-[#c9a84c]/5'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'colors' && (
              <motion.div
                key="colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Color Presets */}
                <section>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Palettes prédéfinies
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handlePresetSelect(preset)}
                        className={clsx(
                          'p-3 rounded-xl border-2 transition-all text-left',
                          selectedPreset === preset.name
                            ? 'border-[#c9a84c] bg-[#c9a84c]/5 shadow-md'
                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        )}
                      >
                        <div className="flex gap-1.5 mb-2">
                          <div
                            className="w-6 h-6 rounded-full shadow-sm border border-white"
                            style={{ background: preset.primary }}
                          />
                          <div
                            className="w-6 h-6 rounded-full shadow-sm border border-white"
                            style={{ background: preset.accent }}
                          />
                          <div
                            className="w-6 h-6 rounded-full shadow-sm border border-white"
                            style={{ background: preset.secondary }}
                          />
                        </div>
                        <p className="text-xs font-medium text-gray-700 truncate">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Custom Colors */}
                <section>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Couleurs personnalisées
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ColorPicker
                        value={colors.primary}
                        onChange={(v) => {
                          setColors({ ...colors, primary: v });
                          setSelectedPreset(null);
                        }}
                        label="Couleur principale (Navy)"
                      />
                      <ColorPicker
                        value={colors.accent}
                        onChange={(v) => {
                          setColors({ ...colors, accent: v });
                          setSelectedPreset(null);
                        }}
                        label="Couleur d'accent (Or)"
                      />
                      <ColorPicker
                        value={colors.secondary}
                        onChange={(v) => {
                          setColors({ ...colors, secondary: v });
                          setSelectedPreset(null);
                        }}
                        label="Couleur secondaire"
                      />
                    </div>

                    {/* Text Colors */}
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Couleurs de texte
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ColorPicker
                          value={colors.text.primary}
                          onChange={(v) => setColors({ ...colors, text: { ...colors.text, primary: v } })}
                          label="Texte principal"
                        />
                        <ColorPicker
                          value={colors.text.secondary}
                          onChange={(v) => setColors({ ...colors, text: { ...colors.text, secondary: v } })}
                          label="Texte secondaire"
                        />
                      </div>
                    </div>

                    {/* Background Colors */}
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Couleurs d'arrière-plan
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ColorPicker
                          value={colors.backgrounds.light}
                          onChange={(v) => setColors({ ...colors, backgrounds: { ...colors.backgrounds, light: v } })}
                          label="Fond clair"
                        />
                        <ColorPicker
                          value={colors.backgrounds.dark}
                          onChange={(v) => setColors({ ...colors, backgrounds: { ...colors.backgrounds, dark: v } })}
                          label="Fond sombre"
                        />
                        <ColorPicker
                          value={colors.backgrounds.card}
                          onChange={(v) => setColors({ ...colors, backgrounds: { ...colors.backgrounds, card: v } })}
                          label="Fond carte"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'typography' && (
              <motion.div
                key="typography"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Heading Font */}
                <section>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Police des titres
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {FONT_OPTIONS.map((font) => (
                        <button
                          key={font.value}
                          onClick={() =>
                            setTypography({
                              ...typography,
                              heading: { ...typography.heading, fontFamily: font.value },
                            })
                          }
                          className={clsx(
                            'p-4 rounded-xl border-2 text-left transition-all',
                            typography.heading.fontFamily === font.value
                              ? 'border-[#c9a84c] bg-[#c9a84c]/5'
                              : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                          )}
                        >
                          <p
                            className="font-bold text-lg mb-1"
                            style={{ fontFamily: font.value }}
                          >
                            {font.label}
                          </p>
                          <p className="text-xs text-gray-400" style={{ fontFamily: font.value }}>
                            {font.preview}
                          </p>
                        </button>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Graisse des titres
                      </label>
                      <div className="flex gap-2">
                        {[600, 700, 800].map((weight) => (
                          <button
                            key={weight}
                            onClick={() =>
                              setTypography({
                                ...typography,
                                heading: { ...typography.heading, weights: [weight] },
                              })
                            }
                            className={clsx(
                              'px-4 py-2 rounded-lg border text-sm font-semibold transition-all',
                              typography.heading.weights.includes(weight)
                                ? 'border-[#c9a84c] bg-[#c9a84c] text-white'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            )}
                          >
                            {weight}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Body Font */}
                <section>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Police du corps
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {FONT_OPTIONS.map((font) => (
                        <button
                          key={font.value}
                          onClick={() =>
                            setTypography({
                              ...typography,
                              body: { ...typography.body, fontFamily: font.value },
                            })
                          }
                          className={clsx(
                            'p-4 rounded-xl border-2 text-left transition-all',
                            typography.body.fontFamily === font.value
                              ? 'border-[#c9a84c] bg-[#c9a84c]/5'
                              : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                          )}
                        >
                          <p
                            className="font-normal text-base mb-1"
                            style={{ fontFamily: font.value }}
                          >
                            {font.label}
                          </p>
                          <p className="text-xs text-gray-400" style={{ fontFamily: font.value }}>
                            {font.preview}
                          </p>
                        </button>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Graisses du corps
                      </label>
                      <div className="flex gap-2">
                        {[400, 500, 600].map((weight) => (
                          <button
                            key={weight}
                            onClick={() =>
                              setTypography({
                                ...typography,
                                body: { ...typography.body, weights: [weight] },
                              })
                            }
                            className={clsx(
                              'px-4 py-2 rounded-lg border text-sm font-semibold transition-all',
                              typography.body.weights.includes(weight)
                                ? 'border-[#c9a84c] bg-[#c9a84c] text-white'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            )}
                          >
                            {weight}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Mono Font */}
                <section>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Police monospace (données)
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'JetBrains Mono', label: 'JetBrains Mono', preview: '€1,234,567' },
                      { value: 'Fira Code', label: 'Fira Code', preview: '€1,234,567' },
                      { value: 'Roboto Mono', label: 'Roboto Mono', preview: '€1,234,567' },
                      { value: 'Source Code Pro', label: 'Source Code Pro', preview: '€1,234,567' },
                    ].map((font) => (
                      <button
                        key={font.value}
                        onClick={() =>
                          setTypography({
                            ...typography,
                            mono: { ...typography.mono, fontFamily: font.value },
                          })
                        }
                        className={clsx(
                          'p-4 rounded-xl border-2 text-left transition-all',
                          typography.mono.fontFamily === font.value
                            ? 'border-[#c9a84c] bg-[#c9a84c]/5'
                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        )}
                      >
                        <p
                          className="font-mono text-base mb-1"
                          style={{ fontFamily: font.value }}
                        >
                          {font.label}
                        </p>
                        <p
                          className="font-mono text-xs text-gray-400"
                          style={{ fontFamily: font.value }}
                        >
                          {font.preview}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <p className="text-sm text-gray-500 text-center">
                  Aperçu de votre brand kit en temps réel
                </p>

                {/* Cover Slide Preview */}
                <section>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Slide de couverture
                  </h3>
                  <div
                    className="rounded-xl overflow-hidden shadow-lg"
                    style={{
                      aspectRatio: '16/9',
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                  >
                    <div className="h-full flex flex-col items-center justify-center text-white text-center px-12">
                      <div
                        className="w-16 h-1 rounded mb-6"
                        style={{ background: colors.accent }}
                      />
                      <h1
                        className="text-2xl font-bold mb-2"
                        style={{ fontFamily: typography.heading.fontFamily }}
                      >
                        Nom du Client
                      </h1>
                      <p
                        className="text-sm opacity-70 mb-4"
                        style={{ fontFamily: typography.body.fontFamily }}
                      >
                        Secteur d'activité | Transaction
                      </p>
                      <div
                        className="w-16 h-1 rounded"
                        style={{ background: colors.accent }}
                      />
                    </div>
                  </div>
                </section>

                {/* Content Slide Preview */}
                <section>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Slide de contenu
                  </h3>
                  <div
                    className="rounded-xl overflow-hidden shadow-lg"
                    style={{ aspectRatio: '16/9', background: colors.backgrounds.card }}
                  >
                    <div
                      className="h-1"
                      style={{ background: colors.accent }}
                    />
                    <div className="p-8">
                      <h2
                        className="text-xl font-bold mb-4"
                        style={{
                          fontFamily: typography.heading.fontFamily,
                          color: colors.primary,
                        }}
                      >
                        Titre de la slide
                      </h2>
                      <div
                        className="w-24 h-0.5 rounded mb-4"
                        style={{ background: colors.accent }}
                      />
                      <div className="space-y-2">
                        <div
                          className="h-3 rounded"
                          style={{
                            fontFamily: typography.body.fontFamily,
                            color: colors.text.secondary,
                            width: '90%',
                          }}
                        >
                          Contenu de la slide avec détails importants
                        </div>
                        <div
                          className="h-3 rounded"
                          style={{
                            fontFamily: typography.body.fontFamily,
                            color: colors.text.secondary,
                            width: '75%',
                          }}
                        >
                          Plus d'informations sur l'entreprise
                        </div>
                      </div>
                    </div>
                    <div
                      className="h-1 mt-auto"
                      style={{ background: colors.primary }}
                    />
                  </div>
                </section>

                {/* Closing Slide Preview */}
                <section>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Slide de clôture
                  </h3>
                  <div
                    className="rounded-xl overflow-hidden shadow-lg"
                    style={{
                      aspectRatio: '16/9',
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                  >
                    <div className="h-full flex flex-col items-center justify-center text-white text-center px-12">
                      <h2
                        className="text-2xl font-bold mb-4"
                        style={{ fontFamily: typography.heading.fontFamily }}
                      >
                        Merci
                      </h2>
                      <div
                        className="w-16 h-0.5 rounded mb-6"
                        style={{ background: colors.accent }}
                      />
                      <p
                        className="text-sm opacity-70"
                        style={{ fontFamily: typography.body.fontFamily }}
                      >
                        Contact : advisor@alecia.fr
                      </p>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3 justify-between">
          <button
            onClick={() => {
              setColors(DEFAULT_BRAND_KIT.colors);
              setTypography(DEFAULT_BRAND_KIT.typography);
              setSelectedPreset('Marine & Or (Alecia)');
            }}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Réinitialiser
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-[#c9a84c] text-white text-sm font-semibold hover:bg-[#b8973d] transition-colors shadow-sm"
            >
              Sauvegarder le Brand Kit
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export type { BrandKit, BrandKitColors, BrandKitTypography };
