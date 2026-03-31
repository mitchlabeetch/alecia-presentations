/**
 * VariableRow - Composant d'édition d'une variable individuelle
 * Alecia Presentations - Conseil financier
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Variable,
  VariableType,
  VARIABLE_TYPE_LABELS,
  VARIABLE_TYPE_COLORS,
  VARIABLE_NAME_REGEX,
} from './types';

// Couleurs de la marque Alecia
const BRAND_COLORS = {
  darkNavy: '#0a1628',
  pinkAccent: '#e91e63',
};

interface VariableRowProps {
  variable: Variable;
  onUpdate: (id: string, updates: Partial<Omit<Variable, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  existingNames: string[];
}

const variableTypes: VariableType[] = [
  'client',
  'adresse',
  'contact',
  'date',
  'projet',
  'montant',
  'secteur',
  'region',
  'alecia',
  'custom',
];

export const VariableRow: React.FC<VariableRowProps> = ({
  variable,
  onUpdate,
  onDelete,
  onDuplicate,
  isDragging = false,
  dragHandleProps,
  existingNames,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const validateName = useCallback((name: string): string | null => {
    if (!name.trim()) {
      return 'Le nom est requis';
    }
    if (!VARIABLE_NAME_REGEX.test(name)) {
      return 'Lettres, chiffres et underscores uniquement';
    }
    if (existingNames.includes(name) && name !== variable.name) {
      return 'Ce nom existe déjà';
    }
    return null;
  }, [existingNames, variable.name]);

  const handleNameChange = useCallback((newName: string) => {
    const error = validateName(newName);
    setNameError(error);
    
    if (!error) {
      onUpdate(variable.id, { name: newName });
    }
  }, [validateName, onUpdate, variable.id]);

  const handleNameBlur = useCallback(() => {
    setIsEditing(false);
    setNameError(null);
    
    // Réinitialiser si le nom est vide ou invalide
    if (!variable.name.trim() || nameError) {
      onUpdate(variable.id, { name: variable.name || 'nouvelle_variable' });
    }
  }, [variable.id, variable.name, nameError, onUpdate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setNameError(null);
    }
  }, [handleNameBlur]);

  const handleValueChange = useCallback((value: string) => {
    onUpdate(variable.id, { value });
  }, [onUpdate, variable.id]);

  const handleTypeChange = useCallback((type: VariableType) => {
    onUpdate(variable.id, { type });
  }, [onUpdate, variable.id]);

  // handleDescriptionChange is available for future use
  const _handleDescriptionChange = useCallback((description: string) => {
    onUpdate(variable.id, { description });
  }, [onUpdate, variable.id]);
  void _handleDescriptionChange;

  const typeColor = VARIABLE_TYPE_COLORS[variable.type];

  const rowStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: isDragging ? '#f5f5f5' : '#ffffff',
    border: `1px solid ${nameError ? '#f44336' : '#e0e0e0'}`,
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
  };

  const dragHandleStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    cursor: 'grab',
    color: '#9e9e9e',
    flexShrink: 0,
  };

  const typeBadgeStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    backgroundColor: `${typeColor}20`,
    color: typeColor,
    flexShrink: 0,
    minWidth: '80px',
    justifyContent: 'center',
  };

  const nameContainerStyles: React.CSSProperties = {
    flex: '0 0 180px',
    display: 'flex',
    flexDirection: 'column',
  };

  const nameDisplayStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: BRAND_COLORS.darkNavy,
    cursor: 'pointer',
    padding: '6px 8px',
    borderRadius: '4px',
    backgroundColor: '#f5f5f5',
    transition: 'background-color 0.2s',
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '6px 8px',
    fontSize: '13px',
    fontFamily: 'monospace',
    border: `1px solid ${BRAND_COLORS.pinkAccent}`,
    borderRadius: '4px',
    outline: 'none',
  };

  const valueInputStyles: React.CSSProperties = {
    flex: 1,
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
    opacity: showActions ? 1 : 0,
    transition: 'opacity 0.2s',
  };

  const buttonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: 'transparent',
  };

  const errorTextStyles: React.CSSProperties = {
    fontSize: '11px',
    color: '#f44336',
    marginTop: '4px',
  };

  return (
    <div
      style={rowStyles}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Poignée de glisser-déposer */}
      <div {...dragHandleProps} style={dragHandleStyles} title="Déplacer">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="4" cy="4" r="1.5" />
          <circle cx="8" cy="4" r="1.5" />
          <circle cx="12" cy="4" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="12" cy="8" r="1.5" />
          <circle cx="4" cy="12" r="1.5" />
          <circle cx="8" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      </div>

      {/* Badge de type */}
      <select
        value={variable.type}
        onChange={(e) => handleTypeChange(e.target.value as VariableType)}
        style={{
          ...typeBadgeStyles,
          cursor: 'pointer',
          border: 'none',
          appearance: 'none',
          textAlign: 'center',
        }}
        title="Type de variable"
      >
        {variableTypes.map((type) => (
          <option key={type} value={type}>
            {VARIABLE_TYPE_LABELS[type]}
          </option>
        ))}
      </select>

      {/* Nom de la variable */}
      <div style={nameContainerStyles}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={variable.name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleKeyDown}
            style={inputStyles}
            placeholder="nom_variable"
          />
        ) : (
          <div
            style={nameDisplayStyles}
            onClick={() => !variable.isSystem && setIsEditing(true)}
            title={variable.isSystem ? 'Variable système (non modifiable)' : 'Cliquer pour modifier'}
          >
            <span style={{ color: '#9e9e9e' }}>{'{{'}</span>
            <span>{variable.name || '...'}</span>
            <span style={{ color: '#9e9e9e' }}>{'}}'}</span>
            {!variable.isSystem && (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: '4px', opacity: 0.5 }}>
                <path d="M12.146 2.854a.5.5 0 0 1 .708 0l1.292 1.292a.5.5 0 0 1 0 .708l-8 8a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708l8-8zM11.207 4l-7 7L3 10.793l7-7L11.207 4z"/>
              </svg>
            )}
          </div>
        )}
        {nameError && <span style={errorTextStyles}>{nameError}</span>}
      </div>

      {/* Valeur */}
      <input
        type="text"
        value={variable.value}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder="Valeur..."
        style={valueInputStyles}
        title={variable.description || 'Valeur de la variable'}
      />

      {/* Actions */}
      <div style={actionsStyles}>
        <button
          onClick={() => onDuplicate(variable.id)}
          style={{ ...buttonStyles, color: '#2196F3' }}
          title="Dupliquer"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e3f2fd';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2z"/>
          </svg>
        </button>
        <button
          onClick={() => onDelete(variable.id)}
          style={{ ...buttonStyles, color: '#f44336' }}
          title="Supprimer"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ffebee';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VariableRow;
