/**
 * VariableHighlighter - Composant pour surligner les variables dans le contenu
 * Alecia Presentations - Conseil financier
 */

import React, { useMemo, useCallback } from 'react';
import { Variable, VariableMatch, VARIABLE_TYPE_COLORS, VARIABLE_PLACEHOLDER_REGEX } from './types';

// Couleurs de la marque Alecia
const BRAND_COLORS = {
  darkNavy: '#0a1628',
  pinkAccent: '#e91e63',
};

interface VariableHighlighterProps {
  content: string;
  variables: Variable[];
  onVariableClick?: (variableName: string) => void;
  onVariableHover?: (variableName: string | null) => void;
  className?: string;
  style?: React.CSSProperties;
  showTooltip?: boolean;
  renderAs?: 'html' | 'react';
  editable?: boolean;
  onContentChange?: (content: string) => void;
}

interface HighlightedPart {
  type: 'text' | 'variable';
  content: string;
  variableName?: string;
  variableData?: Variable;
  startIndex: number;
  endIndex: number;
}

export const VariableHighlighter: React.FC<VariableHighlighterProps> = ({
  content,
  variables,
  onVariableClick,
  onVariableHover,
  className = '',
  style = {},
  showTooltip = true,
  renderAs = 'react',
}) => {
  // Créer une map des variables pour un accès rapide
  const variableMap = useMemo(() => {
    const map = new Map<string, Variable>();
    variables.forEach((v) => map.set(v.name, v));
    return map;
  }, [variables]);

  // Parser le contenu pour identifier les variables
  const parsedContent = useMemo((): HighlightedPart[] => {
    const parts: HighlightedPart[] = [];
    let lastIndex = 0;
    let match;

    // Réinitialiser la regex
    VARIABLE_PLACEHOLDER_REGEX.lastIndex = 0;

    while ((match = VARIABLE_PLACEHOLDER_REGEX.exec(content)) !== null) {
      // Ajouter le texte avant la variable
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index),
          startIndex: lastIndex,
          endIndex: match.index,
        });
      }

      // Ajouter la variable
      const variableName = match[1];
      parts.push({
        type: 'variable',
        content: match[0],
        variableName,
        variableData: variableMap.get(variableName),
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });

      lastIndex = match.index + match[0].length;
    }

    // Ajouter le reste du texte
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex),
        startIndex: lastIndex,
        endIndex: content.length,
      });
    }

    // Réinitialiser la regex
    VARIABLE_PLACEHOLDER_REGEX.lastIndex = 0;

    return parts;
  }, [content, variableMap]);

  // Compter les variables
  const variableStats = useMemo(() => {
    const total = parsedContent.filter((p) => p.type === 'variable').length;
    const matched = parsedContent.filter(
      (p) => p.type === 'variable' && p.variableData
    ).length;
    const unmatched = total - matched;
    return { total, matched, unmatched };
  }, [parsedContent]);

  // Gérer le clic sur une variable
  const handleVariableClick = useCallback(
    (variableName: string) => {
      onVariableClick?.(variableName);
    },
    [onVariableClick]
  );

  // Gérer le survol d'une variable
  const handleVariableMouseEnter = useCallback(
    (variableName: string) => {
      onVariableHover?.(variableName);
    },
    [onVariableHover]
  );

  const handleVariableMouseLeave = useCallback(() => {
    onVariableHover?.(null);
  }, [onVariableHover]);

  // Obtenir le style d'une variable
  const getVariableStyle = (part: HighlightedPart): React.CSSProperties => {
    const hasValue = part.variableData?.value && part.variableData.value.trim() !== '';
    const typeColor = part.variableData?.type
      ? VARIABLE_TYPE_COLORS[part.variableData.type]
      : BRAND_COLORS.pinkAccent;

    return {
      display: 'inline',
      padding: '2px 6px',
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '0.95em',
      cursor: onVariableClick ? 'pointer' : 'default',
      backgroundColor: hasValue ? `${typeColor}30` : '#ffebee',
      color: hasValue ? typeColor : '#f44336',
      border: `1px dashed ${hasValue ? typeColor : '#f44336'}`,
      transition: 'all 0.2s',
    };
  };

  // Rendu React
  const renderReact = () => {
    return (
      <div className={className} style={{ ...containerStyles, ...style }}>
        {parsedContent.map((part, index) => {
          if (part.type === 'text') {
            return <span key={index}>{part.content}</span>;
          }

          const hasValue = part.variableData?.value && part.variableData.value.trim() !== '';

          return (
            <span
              key={index}
              style={getVariableStyle(part)}
              onClick={() => part.variableName && handleVariableClick(part.variableName)}
              onMouseEnter={() => part.variableName && handleVariableMouseEnter(part.variableName)}
              onMouseLeave={handleVariableMouseLeave}
              title={
                showTooltip
                  ? part.variableData
                    ? `${part.variableName} = "${part.variableData.value}"`
                    : `Variable non définie: ${part.variableName}`
                  : undefined
              }
            >
              {part.content}
              {!hasValue && (
                <span style={{ marginLeft: '4px', fontSize: '0.8em' }}>⚠</span>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  // Rendu HTML (pour export)
  const renderHTML = () => {
    let html = '';

    parsedContent.forEach((part) => {
      if (part.type === 'text') {
        html += escapeHtml(part.content);
      } else {
        const hasValue = part.variableData?.value && part.variableData.value.trim() !== '';
        const typeColor = part.variableData?.type
          ? VARIABLE_TYPE_COLORS[part.variableData.type]
          : BRAND_COLORS.pinkAccent;

        const style = `
          display: inline;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.95em;
          background-color: ${hasValue ? `${typeColor}30` : '#ffebee'};
          color: ${hasValue ? typeColor : '#f44336'};
          border: 1px dashed ${hasValue ? typeColor : '#f44336'};
        `;

        html += `<span style="${style}">${escapeHtml(part.content)}</span>`;
      }
    });

    return html;
  };

  // Styles du conteneur
  const containerStyles: React.CSSProperties = {
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  };

  // Fonction utilitaire pour échapper le HTML
  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Composant de statistiques
  const StatsBar: React.FC = () => (
    <div style={statsBarStyles}>
      <span style={statItemStyles}>
        <strong>{variableStats.total}</strong> variables détectées
      </span>
      <span style={{ ...statItemStyles, color: '#4CAF50' }}>
        <strong>{variableStats.matched}</strong> définies
      </span>
      {variableStats.unmatched > 0 && (
        <span style={{ ...statItemStyles, color: '#f44336' }}>
          <strong>{variableStats.unmatched}</strong> non définies
        </span>
      )}
    </div>
  );

  const statsBarStyles: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    padding: '8px 12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    fontSize: '12px',
    marginBottom: '12px',
  };

  const statItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  return (
    <div>
      <StatsBar />
      {renderAs === 'html' ? (
        <div dangerouslySetInnerHTML={{ __html: renderHTML() }} />
      ) : (
        renderReact()
      )}
    </div>
  );
};

// Hook pour utiliser le surlignage
export const useVariableHighlighter = (
  content: string,
  variables: Variable[]
) => {
  const variableMap = useMemo(() => {
    const map = new Map<string, Variable>();
    variables.forEach((v) => map.set(v.name, v));
    return map;
  }, [variables]);

  const findVariables = useCallback((): VariableMatch[] => {
    const matches: VariableMatch[] = [];
    let match;

    while ((match = VARIABLE_PLACEHOLDER_REGEX.exec(content)) !== null) {
      matches.push({
        fullMatch: match[0],
        variableName: match[1],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    VARIABLE_PLACEHOLDER_REGEX.lastIndex = 0;
    return matches;
  }, [content]);

  const getVariableStatus = useCallback(
    (variableName: string): 'defined' | 'empty' | 'undefined' => {
      const variable = variableMap.get(variableName);
      if (!variable) return 'undefined';
      if (!variable.value || variable.value.trim() === '') return 'empty';
      return 'defined';
    },
    [variableMap]
  );

  const getUniqueVariables = useCallback((): string[] => {
    const matches = findVariables();
    return [...new Set(matches.map((m) => m.variableName))];
  }, [findVariables]);

  const getMissingVariables = useCallback((): string[] => {
    const uniqueVars = getUniqueVariables();
    return uniqueVars.filter((v) => getVariableStatus(v) === 'undefined');
  }, [getUniqueVariables, getVariableStatus]);

  const getEmptyVariables = useCallback((): string[] => {
    const uniqueVars = getUniqueVariables();
    return uniqueVars.filter((v) => getVariableStatus(v) === 'empty');
  }, [getUniqueVariables, getVariableStatus]);

  return {
    findVariables,
    getVariableStatus,
    getUniqueVariables,
    getMissingVariables,
    getEmptyVariables,
    variableMap,
  };
};

// Composant pour l'aperçu des remplacements
interface VariablePreviewProps {
  content: string;
  variables: Variable[];
  className?: string;
  style?: React.CSSProperties;
}

export const VariablePreview: React.FC<VariablePreviewProps> = ({
  content,
  variables,
  className = '',
  style = {},
}) => {
  const variableMap = useMemo(() => {
    const map = new Map<string, string>();
    variables.forEach((v) => map.set(v.name, v.value));
    return map;
  }, [variables]);

  const replacedContent = useMemo(() => {
    return content.replace(VARIABLE_PLACEHOLDER_REGEX, (match, varName) => {
      const value = variableMap.get(varName);
      return value !== undefined && value !== '' ? value : match;
    });
  }, [content, variableMap]);

  const previewStyles: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    lineHeight: 1.6,
    ...style,
  };

  return (
    <div className={className} style={previewStyles}>
      {replacedContent}
    </div>
  );
};

// Composant pour la liste des variables détectées
interface DetectedVariablesListProps {
  content: string;
  variables: Variable[];
  onVariableClick?: (variableName: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const DetectedVariablesList: React.FC<DetectedVariablesListProps> = ({
  content,
  variables,
  onVariableClick,
  className = '',
  style = {},
}) => {
  const { getUniqueVariables, getVariableStatus } = useVariableHighlighter(
    content,
    variables
  );

  const uniqueVars = getUniqueVariables();
  const variableMap = useMemo(() => {
    const map = new Map<string, Variable>();
    variables.forEach((v) => map.set(v.name, v));
    return map;
  }, [variables]);

  const listStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    ...style,
  };

  const itemStyles = (status: 'defined' | 'empty' | 'undefined'): React.CSSProperties => {
    const colors = {
      defined: { bg: '#e8f5e9', border: '#4CAF50', text: '#2e7d32' },
      empty: { bg: '#fff3e0', border: '#FF9800', text: '#e65100' },
      undefined: { bg: '#ffebee', border: '#f44336', text: '#c62828' },
    };

    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      backgroundColor: colors[status].bg,
      border: `1px solid ${colors[status].border}`,
      borderRadius: '8px',
      cursor: onVariableClick ? 'pointer' : 'default',
      transition: 'all 0.2s',
    };
  };

  const statusBadgeStyles = (status: 'defined' | 'empty' | 'undefined'): React.CSSProperties => {
    const colors = {
      defined: '#4CAF50',
      empty: '#FF9800',
      undefined: '#f44336',
    };

    return {
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 600,
      textTransform: 'uppercase',
      backgroundColor: colors[status],
      color: '#ffffff',
    };
  };

  if (uniqueVars.length === 0) {
    return (
      <div className={className} style={{ ...listStyles, padding: '24px', textAlign: 'center', color: '#9e9e9e' }}>
        Aucune variable détectée dans le contenu
      </div>
    );
  }

  return (
    <div className={className} style={listStyles}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: BRAND_COLORS.darkNavy }}>
        Variables détectées ({uniqueVars.length})
      </h4>
      {uniqueVars.map((varName) => {
        const status = getVariableStatus(varName);
        const variable = variableMap.get(varName);

        return (
          <div
            key={varName}
            style={itemStyles(status)}
            onClick={() => onVariableClick?.(varName)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <code style={{ fontSize: '13px', color: BRAND_COLORS.darkNavy }}>
              {'{{' + varName + '}}'}
            </code>
            <span style={{ flex: 1, fontSize: '13px', color: '#666666' }}>
              {variable?.value || '-'}
            </span>
            <span style={statusBadgeStyles(status)}>
              {status === 'defined' ? 'Définie' : status === 'empty' ? 'Vide' : 'Non définie'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default VariableHighlighter;
