import { getDb } from '../db/index.js';

export interface VariableValue {
  key: string;
  value: string;
}

export interface VariablePreset {
  id: string;
  projectId: string | null;
  name: string;
  variables: VariableValue[];
  isDefault: boolean;
  createdAt: number;
}

export function substituteVariables(text: string, variables: VariableValue[]): string {
  if (!text || !variables.length) return text;

  let result = text;
  for (const variable of variables) {
    const pattern = new RegExp(`\\{\\{${escapeRegex(variable.key)}\\}\\}`, 'g');
    result = result.replace(pattern, variable.value);
  }

  const emptyPattern = /\{\{[^}]+\}\}/g;
  result = result.replace(emptyPattern, '');

  return result;
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getVariablesForProject(projectId: string): VariableValue[] {
  const db = getDb();
  
  const defaultPreset = db.prepare(`
    SELECT variables FROM variable_presets
    WHERE project_id IS NULL AND is_default = 1
    LIMIT 1
  `).get() as { variables: string } | undefined;

  const projectPreset = db.prepare(`
    SELECT variables FROM variable_presets
    WHERE project_id = ? AND is_default = 1
    LIMIT 1
  `).get(projectId) as { variables: string } | undefined;

  let variables: VariableValue[] = [];

  if (defaultPreset) {
    try {
      variables = JSON.parse(defaultPreset.variables);
    } catch {
      variables = [];
    }
  }

  if (projectPreset) {
    try {
      const projectVars = JSON.parse(projectPreset.variables) as VariableValue[];
      const varMap = new Map(variables.map(v => [v.key, v.value]));
      for (const pv of projectVars) {
        varMap.set(pv.key, pv.value);
      }
      variables = Array.from(varMap, ([key, value]) => ({ key, value }));
    } catch {
      // ignore
    }
  }

  return variables;
}

export function getVariablesForPreset(presetId: string): VariableValue[] {
  const db = getDb();
  const preset = db.prepare('SELECT variables FROM variable_presets WHERE id = ?').get(presetId) as { variables: string } | undefined;

  if (!preset) return [];

  try {
    return JSON.parse(preset.variables);
  } catch {
    return [];
  }
}

export function getAllPresets(projectId?: string): VariablePreset[] {
  const db = getDb();
  
  let presets: { id: string; project_id: string | null; name: string; variables: string; is_default: number; created_at: number }[];
  
  if (projectId) {
    presets = db.prepare(`
      SELECT id, project_id, name, variables, is_default, created_at
      FROM variable_presets
      WHERE project_id = ? OR project_id IS NULL
      ORDER BY is_default DESC, created_at DESC
    `).all(projectId) as typeof presets;
  } else {
    presets = db.prepare(`
      SELECT id, project_id, name, variables, is_default, created_at
      FROM variable_presets
      WHERE project_id IS NULL
      ORDER BY is_default DESC, created_at DESC
    `).all() as typeof presets;
  }

  return presets.map(p => ({
    id: p.id,
    projectId: p.project_id,
    name: p.name,
    variables: JSON.parse(p.variables || '[]'),
    isDefault: p.is_default === 1,
    createdAt: p.created_at,
  }));
}
