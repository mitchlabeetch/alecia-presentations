/**
 * Hooks personnalisés pour l'application Alecia Presentations
 */

// Hooks de collaboration
export { useSocket, useCursorTracking, usePresenceDetection } from './useSocket';
export { useCollaboration } from './useCollaboration';
export { useWebSocket } from './useWebSocket';

// Réexportation des types
export type { UseSocketResult, UseSocketOptions } from './useSocket';
