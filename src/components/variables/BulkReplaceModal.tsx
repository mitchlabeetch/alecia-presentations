/**
 * BulkReplaceModal - Modal pour le remplacement global de variables
 * Alecia Presentations - Conseil financier
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Variable, VARIABLE_PLACEHOLDER_REGEX } from './types';

// Couleurs de la marque Alecia
const BRAND_COLORS = {
  darkNavy: '#0a1628',
  pinkAccent: '#e91e63',
  lightPink: '#fce4ec',
};

interface BulkReplaceModalProps {
  variables: Variable[];
  slides?: Array<{ id: string; title: string; content: string }>;
  onClose: () => void;
  onReplaceAll: (search: string, replace: string, options: ReplaceOptions) => void;
}

interface ReplaceOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  useRegex: boolean;
  scope: 'all' | 'selected';
}

interface ReplacementPreview {
  slideId: string;
  slideTitle: string;
  originalContent: string;
  replacedContent: string;
  replacementsCount: number;
}

export const BulkReplaceModal: React.FC<BulkReplaceModalProps> = ({
  variables,
  slides = [],
  onClose,
  onReplaceAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [options, setOptions] = useState<ReplaceOptions>({
    caseSensitive: false,
    wholeWord: false,
    useRegex: false,
    scope: 'all',
  });
  const [showPreview, setShowPreview] = useState(true);
  const [selectedSlides, setSelectedSlides] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');

  // Obtenir toutes les variables uniques utilisées
  const usedVariables = useMemo(() => {
    const varSet = new Set<string>();
    slides.forEach((slide) => {
      const matches = slide.content.match(VARIABLE_PLACEHOLDER_REGEX);
      if (matches) {
        matches.forEach((match) => {
          const varName = match.replace(/\{\{|\}\}/g, '');
          varSet.add(varName);
        });
      }
    });
    return Array.from(varSet).sort();
  }, [slides]);

  // Générer l'aperçu des remplacements
  const preview = useMemo((): ReplacementPreview[] => {
    if (!searchTerm) return [];

    const results: ReplacementPreview[] = [];
    const slidesToProcess =
      options.scope === 'selected'
        ? slides.filter((s) => selectedSlides.has(s.id))
        : slides;

    slidesToProcess.forEach((slide) => {
      let regex: RegExp;
      const flags = options.caseSensitive ? 'g' : 'gi';

      try {
        if (options.useRegex) {
          regex = new RegExp(searchTerm, flags);
        } else if (options.wholeWord) {
          regex = new RegExp(`\\b${escapeRegex(searchTerm)}\\b`, flags);
        } else {
          regex = new RegExp(escapeRegex(searchTerm), flags);
        }

        let replacementsCount = 0;
        const replacedContent = slide.content.replace(regex, () => {
          replacementsCount++;
          return replaceTerm;
        });

        if (replacementsCount > 0) {
          results.push({
            slideId: slide.id,
            slideTitle: slide.title,
            originalContent: slide.content,
            replacedContent,
            replacementsCount,
          });
        }
      } catch (e) {
        // Regex invalide
      }
    });

    return results;
  }, [searchTerm, replaceTerm, options, slides, selectedSlides]);

  // Statistiques totales
  const totalStats = useMemo(() => {
    return preview.reduce(
      (acc, p) => ({
        slides: acc.slides + 1,
        replacements: acc.replacements + p.replacementsCount,
      }),
      { slides: 0, replacements: 0 }
    );
  }, [preview]);

  // Échapper les caractères spéciaux regex
  const escapeRegex = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Basculer la sélection d'une diapositive
  const toggleSlideSelection = useCallback((slideId: string) => {
    setSelectedSlides((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slideId)) {
        newSet.delete(slideId);
      } else {
        newSet.add(slideId);
      }
      return newSet;
    });
  }, []);

  // Sélectionner toutes les diapositives
  const selectAllSlides = useCallback(() => {
    setSelectedSlides(new Set(slides.map((s) => s.id)));
  }, [slides]);

  // Désélectionner toutes les diapositives
  const deselectAllSlides = useCallback(() => {
    setSelectedSlides(new Set());
  }, []);

  // Exécuter le remplacement
  const handleReplace = useCallback(() => {
    onReplaceAll(searchTerm, replaceTerm, options);
    onClose();
  }, [searchTerm, replaceTerm, options, onReplaceAll, onClose]);

  // Insérer une variable dans le terme de recherche
  const insertVariable = useCallback((varName: string) => {
    setSearchTerm((prev) => prev + `{{${varName}}}`);
  }, []);

  // Styles
  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    backgroundColor: BRAND_COLORS.darkNavy,
    color: '#ffffff',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    margin: 0,
  };

  const closeButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
  };

  const tabsStyles: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
    marginBottom: '20px',
    borderBottom: '1px solid #e0e0e0',
  };

  const tabStyles = (isActive: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    border: 'none',
    borderBottom: `2px solid ${isActive ? BRAND_COLORS.pinkAccent : 'transparent'}`,
    backgroundColor: 'transparent',
    color: isActive ? BRAND_COLORS.pinkAccent : '#666666',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const inputGroupStyles: React.CSSProperties = {
    marginBottom: '20px',
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#333333',
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const textareaStyles: React.CSSProperties = {
    ...inputStyles,
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: 'monospace',
  };

  const optionsGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  };

  const checkboxStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
  };

  const buttonStyles = (variant: 'primary' | 'secondary' | 'danger' = 'secondary'): React.CSSProperties => {
    const colors = {
      primary: { bg: BRAND_COLORS.pinkAccent, color: '#ffffff', hover: '#d81b60' },
      secondary: { bg: '#f5f5f5', color: '#333333', hover: '#e0e0e0' },
      danger: { bg: '#ffebee', color: '#f44336', hover: '#ffcdd2' },
    };

    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: 500,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: colors[variant].bg,
      color: colors[variant].color,
    };
  };

  const previewSectionStyles: React.CSSProperties = {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  };

  const previewHeaderStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  };

  const previewItemStyles: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid #e0e0e0',
  };

  const diffStyles = {
    removed: {
      backgroundColor: '#ffebee',
      color: '#c62828',
      textDecoration: 'line-through',
      padding: '2px 4px',
      borderRadius: '4px',
    } as React.CSSProperties,
    added: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      padding: '2px 4px',
      borderRadius: '4px',
    } as React.CSSProperties,
  };

  const variablesListStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  };

  const variableChipStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '16px',
    fontSize: '12px',
    fontFamily: 'monospace',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const footerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #e0e0e0',
  };

  return (
    <div style={overlayStyles} onClick={onClose}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div style={headerStyles}>
          <h2 style={titleStyles}>Remplacer tout</h2>
          <button onClick={onClose} style={closeButtonStyles} title="Fermer">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>

        {/* Contenu */}
        <div style={contentStyles}>
          {/* Onglets */}
          <div style={tabsStyles}>
            <button
              onClick={() => setActiveTab('simple')}
              style={tabStyles(activeTab === 'simple')}
            >
              Recherche simple
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              style={tabStyles(activeTab === 'advanced')}
            >
              Options avancées
            </button>
          </div>

          {/* Recherche */}
          <div style={inputGroupStyles}>
            <label style={labelStyles}>Rechercher</label>
            <textarea
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Texte ou variable à rechercher (ex: {{client}})"
              style={textareaStyles}
            />
          </div>

          {/* Variables rapides */}
          {usedVariables.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ ...labelStyles, fontSize: '12px', color: '#666666' }}>
                Variables utilisées (cliquez pour insérer)
              </label>
              <div style={variablesListStyles}>
                {usedVariables.map((varName) => (
                  <button
                    key={varName}
                    onClick={() => insertVariable(varName)}
                    style={variableChipStyles}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = BRAND_COLORS.pinkAccent;
                      e.currentTarget.style.color = BRAND_COLORS.pinkAccent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.color = '#333333';
                    }}
                  >
                    {'{{' + varName + '}}'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Remplacement */}
          <div style={inputGroupStyles}>
            <label style={labelStyles}>Remplacer par</label>
            <textarea
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              placeholder="Nouveau texte ou variable"
              style={textareaStyles}
            />
          </div>

          {/* Options avancées */}
          {activeTab === 'advanced' && (
            <div style={optionsGridStyles}>
              <label style={checkboxStyles}>
                <input
                  type="checkbox"
                  checked={options.caseSensitive}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, caseSensitive: e.target.checked }))
                  }
                />
                <span>Sensible à la casse</span>
              </label>
              <label style={checkboxStyles}>
                <input
                  type="checkbox"
                  checked={options.wholeWord}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, wholeWord: e.target.checked }))
                  }
                />
                <span>Mot entier uniquement</span>
              </label>
              <label style={checkboxStyles}>
                <input
                  type="checkbox"
                  checked={options.useRegex}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, useRegex: e.target.checked }))
                  }
                />
                <span>Utiliser une expression régulière</span>
              </label>
            </div>
          )}

          {/* Portée */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyles}>Portée</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="scope"
                  checked={options.scope === 'all'}
                  onChange={() => setOptions((prev) => ({ ...prev, scope: 'all' }))}
                />
                <span>Toutes les diapositives</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="scope"
                  checked={options.scope === 'selected'}
                  onChange={() => setOptions((prev) => ({ ...prev, scope: 'selected' }))}
                />
                <span>Diapositives sélectionnées</span>
              </label>
            </div>
          </div>

          {/* Sélection des diapositives */}
          {options.scope === 'selected' && slides.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <button onClick={selectAllSlides} style={{ ...buttonStyles('secondary'), padding: '6px 12px' }}>
                  Tout sélectionner
                </button>
                <button onClick={deselectAllSlides} style={{ ...buttonStyles('secondary'), padding: '6px 12px' }}>
                  Tout désélectionner
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflow: 'auto' }}>
                {slides.map((slide) => (
                  <label
                    key={slide.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      backgroundColor: selectedSlides.has(slide.id) ? BRAND_COLORS.lightPink : '#f5f5f5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSlides.has(slide.id)}
                      onChange={() => toggleSlideSelection(slide.id)}
                    />
                    <span style={{ flex: 1, fontSize: '14px' }}>{slide.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Aperçu */}
          {showPreview && searchTerm && preview.length > 0 && (
            <div style={previewSectionStyles}>
              <div style={previewHeaderStyles}>
                <h4 style={{ margin: 0, fontSize: '16px', color: BRAND_COLORS.darkNavy }}>
                  Aperçu ({totalStats.replacements} remplacement{totalStats.replacements > 1 ? 's' : ''} dans {totalStats.slides} diapositive{totalStats.slides > 1 ? 's' : ''})
                </h4>
                <button
                  onClick={() => setShowPreview(false)}
                  style={{ ...buttonStyles('secondary'), padding: '6px 12px' }}
                >
                  Masquer
                </button>
              </div>
              {preview.map((item) => (
                <div key={item.slideId} style={previewItemStyles}>
                  <div style={{ fontWeight: 600, marginBottom: '8px', color: BRAND_COLORS.darkNavy }}>
                    {item.slideTitle}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666666', marginBottom: '8px' }}>
                    {item.replacementsCount} remplacement{item.replacementsCount > 1 ? 's' : ''}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#9e9e9e', marginBottom: '4px' }}>Avant</div>
                      <div style={{ padding: '8px', backgroundColor: '#ffebee', borderRadius: '4px', fontFamily: 'monospace' }}>
                        {item.originalContent.substring(0, 200)}
                        {item.originalContent.length > 200 && '...'}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#9e9e9e', marginBottom: '4px' }}>Après</div>
                      <div style={{ padding: '8px', backgroundColor: '#e8f5e9', borderRadius: '4px', fontFamily: 'monospace' }}>
                        {item.replacedContent.substring(0, 200)}
                        {item.replacedContent.length > 200 && '...'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchTerm && preview.length === 0 && (
            <div style={{ ...previewSectionStyles, textAlign: 'center', color: '#9e9e9e' }}>
              Aucun résultat trouvé pour cette recherche
            </div>
          )}
        </div>

        {/* Pied de page */}
        <div style={footerStyles}>
          <div style={{ fontSize: '13px', color: '#666666' }}>
            {totalStats.replacements > 0 ? (
              <span>
                <strong>{totalStats.replacements}</strong> remplacement
                {totalStats.replacements > 1 ? 's' : ''} dans{' '}
                <strong>{totalStats.slides}</strong> diapositive
                {totalStats.slides > 1 ? 's' : ''}
              </span>
            ) : (
              <span>Aucun remplacement à effectuer</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} style={buttonStyles('secondary')}>
              Annuler
            </button>
            <button
              onClick={handleReplace}
              disabled={!searchTerm || preview.length === 0}
              style={{
                ...buttonStyles('primary'),
                opacity: !searchTerm || preview.length === 0 ? 0.5 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
              </svg>
              Remplacer tout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkReplaceModal;
