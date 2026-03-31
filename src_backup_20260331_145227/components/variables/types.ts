/**
 * Types pour le système de gestion de variables Alecia Presentations
 * Alecia - Conseil financier
 */

export interface Variable {
  id: string;
  name: string;
  value: string;
  type: VariableType;
  description?: string;
  isSystem?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type VariableType =
  | 'client'
  | 'adresse'
  | 'contact'
  | 'date'
  | 'projet'
  | 'montant'
  | 'secteur'
  | 'region'
  | 'alecia'
  | 'custom';

export interface VariablePreset {
  id: string;
  name: string;
  description?: string;
  variables: Variable[];
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

export interface VariableMatch {
  fullMatch: string;
  variableName: string;
  startIndex: number;
  endIndex: number;
}

export interface ReplacementResult {
  original: string;
  replaced: string;
  replacementsCount: number;
  unmatchedVariables: string[];
}

export interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  variables: Variable[];
}

export const SYSTEM_VARIABLES: Omit<Variable, 'id' | 'value' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'client', type: 'client', description: 'Nom de la société cliente', isSystem: true },
  { name: 'adresse_client', type: 'adresse', description: 'Adresse du client', isSystem: true },
  { name: 'contact_nom', type: 'contact', description: 'Nom du contact', isSystem: true },
  { name: 'contact_fonction', type: 'contact', description: 'Fonction du contact', isSystem: true },
  { name: 'date', type: 'date', description: 'Date (format court)', isSystem: true },
  { name: 'date_longue', type: 'date', description: 'Date (format long)', isSystem: true },
  { name: 'nom_projet', type: 'projet', description: 'Nom du projet', isSystem: true },
  { name: 'montant', type: 'montant', description: 'Montant de la transaction', isSystem: true },
  { name: 'secteur', type: 'secteur', description: 'Secteur d\'activité', isSystem: true },
  { name: 'region', type: 'region', description: 'Région géographique', isSystem: true },
  { name: 'alecia_nom', type: 'alecia', description: 'Nom de l\'interlocuteur Alecia', isSystem: true },
  { name: 'alecia_email', type: 'alecia', description: 'Email Alecia', isSystem: true },
  { name: 'alecia_telephone', type: 'alecia', description: 'Téléphone Alecia', isSystem: true },
];

export const VARIABLE_TYPE_LABELS: Record<VariableType, string> = {
  client: 'Client',
  adresse: 'Adresse',
  contact: 'Contact',
  date: 'Date',
  projet: 'Projet',
  montant: 'Montant',
  secteur: 'Secteur',
  region: 'Région',
  alecia: 'Alecia',
  custom: 'Personnalisé',
};

export const VARIABLE_TYPE_COLORS: Record<VariableType, string> = {
  client: '#4CAF50',
  adresse: '#2196F3',
  contact: '#9C27B0',
  date: '#FF9800',
  projet: '#00BCD4',
  montant: '#F44336',
  secteur: '#795548',
  region: '#607D8B',
  alecia: '#e91e63',
  custom: '#3F51B5',
};

export const VARIABLE_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;
export const VARIABLE_PLACEHOLDER_REGEX = /\{\{([a-zA-Z][a-zA-Z0-9_]*)\}\}/g;
