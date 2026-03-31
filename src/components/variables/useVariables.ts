/**
 * Hook React pour la gestion des variables Alecia Presentations
 * Alecia - Conseil financier
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Variable,
  VariablePreset,
  VariableType,
  VariableMatch,
  ReplacementResult,
  ImportResult,
  SYSTEM_VARIABLES,
  VARIABLE_PLACEHOLDER_REGEX,
  VARIABLE_NAME_REGEX,
} from './types';

const STORAGE_KEY = 'alecia_variables';
const PRESETS_KEY = 'alecia_variable_presets';

// Générer un ID unique
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Créer une variable vide
const createEmptyVariable = (type: VariableType = 'custom'): Variable => ({
  id: generateId(),
  name: '',
  value: '',
  type,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Charger les variables depuis le stockage local
const loadVariablesFromStorage = (): Variable[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((v: Variable) => ({
        ...v,
        createdAt: new Date(v.createdAt),
        updatedAt: new Date(v.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Erreur lors du chargement des variables:', error);
  }
  return [];
};

// Sauvegarder les variables dans le stockage local
const saveVariablesToStorage = (variables: Variable[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(variables));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des variables:', error);
  }
};

// Charger les préréglages depuis le stockage local
const loadPresetsFromStorage = (): VariablePreset[] => {
  try {
    const stored = localStorage.getItem(PRESETS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((p: VariablePreset) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        variables: p.variables.map((v: Variable) => ({
          ...v,
          createdAt: new Date(v.createdAt),
          updatedAt: new Date(v.updatedAt),
        })),
      }));
    }
  } catch (error) {
    console.error('Erreur lors du chargement des préréglages:', error);
  }
  return [];
};

// Sauvegarder les préréglages dans le stockage local
const savePresetsToStorage = (presets: VariablePreset[]): void => {
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des préréglages:', error);
  }
};

export interface UseVariablesReturn {
  // État
  variables: Variable[];
  presets: VariablePreset[];
  
  // Actions sur les variables
  addVariable: (type?: VariableType) => void;
  updateVariable: (id: string, updates: Partial<Omit<Variable, 'id' | 'createdAt'>>) => void;
  deleteVariable: (id: string) => void;
  duplicateVariable: (id: string) => void;
  reorderVariables: (startIndex: number, endIndex: number) => void;
  
  // Validation
  validateVariableName: (name: string, excludeId?: string) => { valid: boolean; error?: string };
  
  // Recherche et remplacement
  findVariablesInText: (text: string) => VariableMatch[];
  replaceVariablesInText: (text: string, customVariables?: Variable[]) => ReplacementResult;
  
  // Préréglages
  savePreset: (name: string, description?: string) => void;
  loadPreset: (presetId: string) => void;
  deletePreset: (presetId: string) => void;
  setDefaultPreset: (presetId: string) => void;
  
  // Import/Export
  exportToJSON: () => string;
  importFromJSON: (jsonString: string) => ImportResult;
  importFromCSV: (csvString: string) => ImportResult;
  exportPresetsToJSON: () => string;
  importPresetsFromJSON: (jsonString: string) => { success: boolean; imported: number; errors: string[] };
  
  // Utilitaires
  getVariableValue: (name: string) => string | undefined;
  getVariablesByType: (type: VariableType) => Variable[];
  hasVariable: (name: string) => boolean;
  resetToDefaults: () => void;
  clearAll: () => void;
  
  // Statistiques
  stats: {
    total: number;
    filled: number;
    empty: number;
    byType: Record<VariableType, number>;
  };
}

export const useVariables = (): UseVariablesReturn => {
  const [variables, setVariables] = useState<Variable[]>(loadVariablesFromStorage);
  const [presets, setPresets] = useState<VariablePreset[]>(loadPresetsFromStorage);

  // Sauvegarder automatiquement les changements
  useEffect(() => {
    saveVariablesToStorage(variables);
  }, [variables]);

  useEffect(() => {
    savePresetsToStorage(presets);
  }, [presets]);

  // Ajouter une nouvelle variable
  const addVariable = useCallback((type: VariableType = 'custom') => {
    setVariables((prev) => [...prev, createEmptyVariable(type)]);
  }, []);

  // Mettre à jour une variable
  const updateVariable = useCallback((id: string, updates: Partial<Omit<Variable, 'id' | 'createdAt'>>) => {
    setVariables((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, ...updates, updatedAt: new Date() }
          : v
      )
    );
  }, []);

  // Supprimer une variable
  const deleteVariable = useCallback((id: string) => {
    setVariables((prev) => prev.filter((v) => v.id !== id));
  }, []);

  // Dupliquer une variable
  const duplicateVariable = useCallback((id: string) => {
    setVariables((prev) => {
      const variable = prev.find((v) => v.id === id);
      if (!variable) return prev;
      
      const newVariable: Variable = {
        ...variable,
        id: generateId(),
        name: `${variable.name}_copie`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const index = prev.findIndex((v) => v.id === id);
      const newVariables = [...prev];
      newVariables.splice(index + 1, 0, newVariable);
      return newVariables;
    });
  }, []);

  // Réordonner les variables
  const reorderVariables = useCallback((startIndex: number, endIndex: number) => {
    setVariables((prev) => {
      const result = [...prev];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  // Valider le nom d'une variable
  const validateVariableName = useCallback((name: string, excludeId?: string): { valid: boolean; error?: string } => {
    if (!name.trim()) {
      return { valid: false, error: 'Le nom est requis' };
    }
    
    if (!VARIABLE_NAME_REGEX.test(name)) {
      return { valid: false, error: 'Le nom doit commencer par une lettre et ne contenir que lettres, chiffres et underscores' };
    }
    
    const exists = variables.some((v) => v.name === name && v.id !== excludeId);
    if (exists) {
      return { valid: false, error: 'Ce nom de variable existe déjà' };
    }
    
    return { valid: true };
  }, [variables]);

  // Trouver les variables dans un texte
  const findVariablesInText = useCallback((text: string): VariableMatch[] => {
    const matches: VariableMatch[] = [];
    let match;
    
    while ((match = VARIABLE_PLACEHOLDER_REGEX.exec(text)) !== null) {
      matches.push({
        fullMatch: match[0],
        variableName: match[1],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
    
    // Réinitialiser la regex
    VARIABLE_PLACEHOLDER_REGEX.lastIndex = 0;
    
    return matches;
  }, []);

  // Remplacer les variables dans un texte
  const replaceVariablesInText = useCallback((text: string, customVariables?: Variable[]): ReplacementResult => {
    const varsToUse = customVariables || variables;
    const variableMap = new Map(varsToUse.map((v) => [v.name, v.value]));
    
    let replaced = text;
    let replacementsCount = 0;
    const unmatchedVariables: string[] = [];
    const matchedVariables = new Set<string>();
    
    const matches = findVariablesInText(text);
    
    // Traiter les correspondances en ordre inverse pour préserver les indices
    const sortedMatches = [...matches].sort((a, b) => b.startIndex - a.startIndex);
    
    for (const match of sortedMatches) {
      const value = variableMap.get(match.variableName);
      
      if (value !== undefined && value !== '') {
        replaced = replaced.substring(0, match.startIndex) + value + replaced.substring(match.endIndex);
        replacementsCount++;
        matchedVariables.add(match.variableName);
      } else {
        unmatchedVariables.push(match.variableName);
      }
    }
    
    return {
      original: text,
      replaced,
      replacementsCount,
      unmatchedVariables: [...new Set(unmatchedVariables)],
    };
  }, [variables, findVariablesInText]);

  // Sauvegarder un préréglage
  const savePreset = useCallback((name: string, description?: string) => {
    const newPreset: VariablePreset = {
      id: generateId(),
      name,
      description,
      variables: variables.map((v) => ({ ...v })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setPresets((prev) => [...prev, newPreset]);
  }, [variables]);

  // Charger un préréglage
  const loadPreset = useCallback((presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setVariables(preset.variables.map((v) => ({
        ...v,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })));
    }
  }, [presets]);

  // Supprimer un préréglage
  const deletePreset = useCallback((presetId: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== presetId));
  }, []);

  // Définir le préréglage par défaut
  const setDefaultPreset = useCallback((presetId: string) => {
    setPresets((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: p.id === presetId,
      }))
    );
  }, []);

  // Exporter vers JSON
  const exportToJSON = useCallback((): string => {
    return JSON.stringify(variables, null, 2);
  }, [variables]);

  // Importer depuis JSON
  const importFromJSON = useCallback((jsonString: string): ImportResult => {
    const errors: string[] = [];
    
    try {
      const parsed = JSON.parse(jsonString);
      
      if (!Array.isArray(parsed)) {
        return { success: false, imported: 0, errors: ['Le format JSON doit être un tableau'], variables: [] };
      }
      
      const importedVariables: Variable[] = [];
      
      for (const item of parsed) {
        if (!item.name || typeof item.name !== 'string') {
          errors.push(`Élément invalide: nom manquant`);
          continue;
        }
        
        const validation = validateVariableName(item.name);
        if (!validation.valid) {
          errors.push(`Variable "${item.name}": ${validation.error}`);
          continue;
        }
        
        importedVariables.push({
          id: generateId(),
          name: item.name,
          value: String(item.value || ''),
          type: item.type || 'custom',
          description: item.description,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      
      if (importedVariables.length > 0) {
        setVariables((prev) => [...prev, ...importedVariables]);
      }
      
      return {
        success: errors.length === 0,
        imported: importedVariables.length,
        errors,
        variables: importedVariables,
      };
    } catch (error) {
      return { success: false, imported: 0, errors: ['JSON invalide'], variables: [] };
    }
  }, [validateVariableName]);

  // Importer depuis CSV
  const importFromCSV = useCallback((csvString: string): ImportResult => {
    const errors: string[] = [];
    const importedVariables: Variable[] = [];
    
    const lines = csvString.split('\n').filter((line) => line.trim());
    
    if (lines.length === 0) {
      return { success: false, imported: 0, errors: ['CSV vide'], variables: [] };
    }
    
    // Détecter si la première ligne est un en-tête
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('name') || firstLine.includes('nom') || firstLine.includes('variable');
    
    const startIndex = hasHeader ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split(',').map((p) => p.trim());
      
      if (parts.length < 2) {
        errors.push(`Ligne ${i + 1}: format invalide`);
        continue;
      }
      
      const name = parts[0];
      const value = parts[1];
      const type = parts[2] as VariableType || 'custom';
      
      const validation = validateVariableName(name);
      if (!validation.valid) {
        errors.push(`Ligne ${i + 1}: ${validation.error}`);
        continue;
      }
      
      importedVariables.push({
        id: generateId(),
        name,
        value,
        type,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    if (importedVariables.length > 0) {
      setVariables((prev) => [...prev, ...importedVariables]);
    }
    
    return {
      success: errors.length === 0,
      imported: importedVariables.length,
      errors,
      variables: importedVariables,
    };
  }, [validateVariableName]);

  // Exporter les préréglages vers JSON
  const exportPresetsToJSON = useCallback((): string => {
    return JSON.stringify(presets, null, 2);
  }, [presets]);

  // Importer les préréglages depuis JSON
  const importPresetsFromJSON = useCallback((jsonString: string): { success: boolean; imported: number; errors: string[] } => {
    const errors: string[] = [];
    
    try {
      const parsed = JSON.parse(jsonString);
      
      if (!Array.isArray(parsed)) {
        return { success: false, imported: 0, errors: ['Le format JSON doit être un tableau'] };
      }
      
      const importedPresets: VariablePreset[] = [];
      
      for (const item of parsed) {
        if (!item.name || typeof item.name !== 'string') {
          errors.push(`Préréglage invalide: nom manquant`);
          continue;
        }
        
        importedPresets.push({
          id: generateId(),
          name: item.name,
          description: item.description,
          variables: Array.isArray(item.variables) ? item.variables.map((v: Variable) => ({
            ...v,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
          })) : [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isDefault: item.isDefault,
        });
      }
      
      if (importedPresets.length > 0) {
        setPresets((prev) => [...prev, ...importedPresets]);
      }
      
      return {
        success: errors.length === 0,
        imported: importedPresets.length,
        errors,
      };
    } catch (error) {
      return { success: false, imported: 0, errors: ['JSON invalide'] };
    }
  }, []);

  // Obtenir la valeur d'une variable
  const getVariableValue = useCallback((name: string): string | undefined => {
    return variables.find((v) => v.name === name)?.value;
  }, [variables]);

  // Obtenir les variables par type
  const getVariablesByType = useCallback((type: VariableType): Variable[] => {
    return variables.filter((v) => v.type === type);
  }, [variables]);

  // Vérifier si une variable existe
  const hasVariable = useCallback((name: string): boolean => {
    return variables.some((v) => v.name === name);
  }, [variables]);

  // Réinitialiser aux valeurs par défaut
  const resetToDefaults = useCallback(() => {
    const defaultVariables: Variable[] = SYSTEM_VARIABLES.map((sv) => ({
      ...sv,
      id: generateId(),
      value: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    setVariables(defaultVariables);
  }, []);

  // Tout effacer
  const clearAll = useCallback(() => {
    setVariables([]);
  }, []);

  // Statistiques
  const stats = useMemo(() => {
    const total = variables.length;
    const filled = variables.filter((v) => v.value.trim() !== '').length;
    const empty = total - filled;
    
    const byType = variables.reduce((acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1;
      return acc;
    }, {} as Record<VariableType, number>);
    
    return { total, filled, empty, byType };
  }, [variables]);

  return {
    variables,
    presets,
    addVariable,
    updateVariable,
    deleteVariable,
    duplicateVariable,
    reorderVariables,
    validateVariableName,
    findVariablesInText,
    replaceVariablesInText,
    savePreset,
    loadPreset,
    deletePreset,
    setDefaultPreset,
    exportToJSON,
    importFromJSON,
    importFromCSV,
    exportPresetsToJSON,
    importPresetsFromJSON,
    getVariableValue,
    getVariablesByType,
    hasVariable,
    resetToDefaults,
    clearAll,
    stats,
  };
};

export default useVariables;
