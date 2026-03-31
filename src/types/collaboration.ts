/**
 * Types pour le système de collaboration en temps réel
 * Alecia Presentations - Système de collaboration
 */

export type UserRole = 'owner' | 'editor' | 'viewer';
export type UserStatus = 'online' | 'away' | 'offline' | 'editing';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  color: string;
  joinedAt: Date;
  lastSeenAt: Date;
  currentSlideId?: string;
}

export interface CursorPosition {
  x: number;
  y: number;
  slideId: string;
}

export interface UserCursor {
  userId: string;
  userName: string;
  userColor: string;
  position: CursorPosition;
  timestamp: Date;
}

export type ActivityType = 
  | 'slide_created'
  | 'slide_updated'
  | 'slide_deleted'
  | 'slide_moved'
  | 'variable_changed'
  | 'user_joined'
  | 'user_left'
  | 'permission_changed'
  | 'presentation_shared';

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  details: {
    slideId?: string;
    slideName?: string;
    variableName?: string;
    oldValue?: string;
    newValue?: string;
    targetUserId?: string;
    targetUserName?: string;
    message?: string;
  };
}

export interface Permission {
  userId: string;
  userName: string;
  userEmail: string;
  role: UserRole;
  grantedAt: Date;
  grantedBy: string;
}

export interface ShareSettings {
  isPublic: boolean;
  publicAccess: 'view' | 'edit' | 'none';
  allowComments: boolean;
  allowDownload: boolean;
  expirationDate?: Date;
}

export interface CollaborationState {
  currentUser: User | null;
  users: User[];
  cursors: Map<string, UserCursor>;
  activities: Activity[];
  permissions: Permission[];
  shareSettings: ShareSettings;
  isConnected: boolean;
  isReconnecting: boolean;
  connectionError: string | null;
}

export interface SlideUpdate {
  slideId: string;
  updates: Partial<{
    title: string;
    content: string;
    layout: string;
    variables: Record<string, unknown>;
  }>;
  updatedBy: string;
  updatedAt: Date;
}

export interface VariableChange {
  name: string;
  value: unknown;
  previousValue: unknown;
  changedBy: string;
  changedAt: Date;
}

// WebSocket Event Types
export type WebSocketEvent =
  | { type: 'user:join'; payload: User }
  | { type: 'user:leave'; payload: { userId: string } }
  | { type: 'user:update'; payload: Partial<User> & { id: string } }
  | { type: 'slide:update'; payload: SlideUpdate }
  | { type: 'slide:add'; payload: { slideId: string; position: number; createdBy: string } }
  | { type: 'slide:remove'; payload: { slideId: string; removedBy: string } }
  | { type: 'cursor:move'; payload: UserCursor }
  | { type: 'variable:change'; payload: VariableChange }
  | { type: 'activity:new'; payload: Activity }
  | { type: 'permission:update'; payload: Permission }
  | { type: 'connect'; payload: null }
  | { type: 'disconnect'; payload: { reason: string } }
  | { type: 'error'; payload: { message: string } };

// Conflict Resolution
export interface Conflict {
  id: string;
  slideId: string;
  field: string;
  localValue: unknown;
  remoteValue: unknown;
  localTimestamp: Date;
  remoteTimestamp: Date;
  localUserId: string;
  remoteUserId: string;
  resolved: boolean;
  resolution?: 'local' | 'remote' | 'merged';
}

// Presence Colors for users
export const USER_COLORS = [
  '#e91e63', // Rose (Alecia brand)
  '#2196f3', // Bleu
  '#4caf50', // Vert
  '#ff9800', // Orange
  '#9c27b0', // Violet
  '#00bcd4', // Cyan
  '#f44336', // Rouge
  '#795548', // Marron
  '#607d8b', // Gris bleu
  '#8bc34a', // Vert clair
] as const;

export function getUserColor(index: number): string {
  return USER_COLORS[index % USER_COLORS.length];
}

// Role labels in French
export const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Propriétaire',
  editor: 'Éditeur',
  viewer: 'Lecteur',
};

// Status labels in French
export const STATUS_LABELS: Record<UserStatus, string> = {
  online: 'En ligne',
  away: 'Absent',
  offline: 'Hors ligne',
  editing: 'En train d\'éditer',
};

// Activity type labels in French
export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  slide_created: 'a créé une diapositive',
  slide_updated: 'a modifié une diapositive',
  slide_deleted: 'a supprimé une diapositive',
  slide_moved: 'a déplacé une diapositive',
  variable_changed: 'a modifié une variable',
  user_joined: 'a rejoint la présentation',
  user_left: 'a quitté la présentation',
  permission_changed: 'a modifié les permissions',
  presentation_shared: 'a partagé la présentation',
};
