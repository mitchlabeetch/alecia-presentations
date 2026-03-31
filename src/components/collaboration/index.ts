/**
 * Exportations du module de collaboration
 * Alecia Presentations - Système de collaboration en temps réel
 */

// Composants
export { PresenceBar } from './PresenceBar';
export { UserCursorComponent, CursorsOverlay, CursorTrackingArea, useCursorTracking } from './UserCursor';
export { ActivityFeed } from './ActivityFeed';
export { ShareModal } from './ShareModal';
export { 
  PermissionBadge, 
  ActivePermissionBadge, 
  PermissionIndicator, 
  PermissionBadgeGroup,
  PermissionLegend 
} from './PermissionBadge';

// Hooks
export { useWebSocket } from '../../hooks/useWebSocket';
export { useCollaboration } from '../../hooks/useCollaboration';

// Types
export type {
  User,
  UserRole,
  UserStatus,
  UserCursor,
  CursorPosition,
  Activity,
  ActivityType,
  Permission,
  ShareSettings,
  CollaborationState,
  SlideUpdate,
  VariableChange,
  Conflict,
  WebSocketEvent,
} from '../../types/collaboration';

// Constantes et utilitaires
export {
  USER_COLORS,
  getUserColor,
  ROLE_LABELS,
  STATUS_LABELS,
  ACTIVITY_LABELS,
} from '../../types/collaboration';
