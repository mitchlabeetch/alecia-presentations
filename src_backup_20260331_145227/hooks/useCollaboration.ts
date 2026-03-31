/**
 * Hook principal pour la gestion de la collaboration
 * Alecia Presentations - État global de la collaboration
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import type {
  User,
  UserCursor,
  Activity,
  Permission,
  SlideUpdate,
  VariableChange,
  ShareSettings,
  Conflict,
  UserRole,
} from '../types/collaboration';
import { getUserColor, ROLE_LABELS, ACTIVITY_LABELS } from '../types/collaboration';

interface UseCollaborationOptions {
  presentationId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserEmail: string;
  initialRole?: UserRole;
}

interface UseCollaborationReturn {
  // Utilisateurs
  users: User[];
  currentUser: User | null;
  getUserById: (userId: string) => User | undefined;
  getOnlineUsers: () => User[];
  getEditors: () => User[];
  getViewers: () => User[];
  
  // Curseurs
  cursors: Map<string, UserCursor>;
  updateCursorPosition: (x: number, y: number, slideId: string) => void;
  
  // Activités
  activities: Activity[];
  addActivity: (type: Activity['type'], details: Activity['details']) => void;
  clearActivities: () => void;
  
  // Permissions
  permissions: Permission[];
  shareSettings: ShareSettings;
  updateShareSettings: (settings: Partial<ShareSettings>) => void;
  grantPermission: (userEmail: string, role: UserRole) => void;
  revokePermission: (userId: string) => void;
  canEdit: () => boolean;
  canShare: () => boolean;
  
  // Conflits
  conflicts: Conflict[];
  resolveConflict: (conflictId: string, resolution: 'local' | 'remote' | 'merged') => void;
  
  // Connexion
  isConnected: boolean;
  isReconnecting: boolean;
  connectionError: string | null;
  reconnect: () => void;
  
  // Présence
  updateUserStatus: (status: User['status']) => void;
  updateCurrentSlide: (slideId: string) => void;
}

// Générer un ID unique
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Formater le temps relatif
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours} h`;
  return `Il y a ${days} j`;
}

export function useCollaboration(options: UseCollaborationOptions): UseCollaborationReturn {
  const { presentationId, currentUserId, currentUserName, currentUserEmail, initialRole = 'editor' } = options;

  // État des utilisateurs
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const userColorIndexRef = useRef(0);

  // État des curseurs
  const [cursors, setCursors] = useState<Map<string, UserCursor>>(new Map());
  const cursorThrottleRef = useRef<number | null>(null);

  // État des activités
  const [activities, setActivities] = useState<Activity[]>([]);
  const maxActivities = 50;

  // État des permissions
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    isPublic: false,
    publicAccess: 'none',
    allowComments: true,
    allowDownload: false,
  });

  // État des conflits
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  // Initialiser l'utilisateur courant
  useEffect(() => {
    const newCurrentUser: User = {
      id: currentUserId,
      name: currentUserName,
      email: currentUserEmail,
      role: initialRole,
      status: 'online',
      color: getUserColor(0),
      joinedAt: new Date(),
      lastSeenAt: new Date(),
    };
    setCurrentUser(newCurrentUser);
  }, [currentUserId, currentUserName, currentUserEmail, initialRole]);

  // Gestionnaires d'événements WebSocket
  const handleUserJoin = useCallback((user: User) => {
    setUsers(prev => {
      if (prev.find(u => u.id === user.id)) {
        return prev.map(u => u.id === user.id ? { ...user, color: u.color } : u);
      }
      userColorIndexRef.current++;
      return [...prev, { ...user, color: getUserColor(userColorIndexRef.current) }];
    });

    // Ajouter une activité
    const activity: Activity = {
      id: generateId(),
      type: 'user_joined',
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      timestamp: new Date(),
      details: {},
    };
    setActivities(prev => [activity, ...prev].slice(0, maxActivities));
  }, []);

  const handleUserLeave = useCallback((userId: string) => {
    setUsers(prev => {
      const user = prev.find(u => u.id === userId);
      if (user) {
        const activity: Activity = {
          id: generateId(),
          type: 'user_left',
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          timestamp: new Date(),
          details: {},
        };
        setActivities(prevActivities => [activity, ...prevActivities].slice(0, maxActivities));
      }
      return prev.filter(u => u.id !== userId);
    });
    
    // Supprimer le curseur de l'utilisateur
    setCursors(prev => {
      const next = new Map(prev);
      next.delete(userId);
      return next;
    });
  }, []);

  const handleUserUpdate = useCallback((update: Partial<User> & { id: string }) => {
    setUsers(prev => prev.map(u => 
      u.id === update.id ? { ...u, ...update, lastSeenAt: new Date() } : u
    ));
  }, []);

  const handleCursorMove = useCallback((cursor: UserCursor) => {
    if (cursor.userId === currentUserId) return;
    
    setCursors(prev => {
      const next = new Map(prev);
      next.set(cursor.userId, cursor);
      return next;
    });
  }, [currentUserId]);

  const handleSlideUpdate = useCallback((update: SlideUpdate) => {
    // Ajouter une activité
    const activity: Activity = {
      id: generateId(),
      type: 'slide_updated',
      userId: update.updatedBy,
      userName: users.find(u => u.id === update.updatedBy)?.name || 'Utilisateur inconnu',
      timestamp: update.updatedAt,
      details: {
        slideId: update.slideId,
        slideName: `Diapositive ${update.slideId}`,
      },
    };
    setActivities(prev => [activity, ...prev].slice(0, maxActivities));
  }, [users]);

  const handleVariableChange = useCallback((change: VariableChange) => {
    const activity: Activity = {
      id: generateId(),
      type: 'variable_changed',
      userId: change.changedBy,
      userName: users.find(u => u.id === change.changedBy)?.name || 'Utilisateur inconnu',
      timestamp: change.changedAt,
      details: {
        variableName: change.name,
        oldValue: String(change.previousValue),
        newValue: String(change.value),
      },
    };
    setActivities(prev => [activity, ...prev].slice(0, maxActivities));
  }, [users]);

  const handleActivity = useCallback((activity: Activity) => {
    setActivities(prev => [activity, ...prev].slice(0, maxActivities));
  }, []);

  const handlePermissionUpdate = useCallback((permission: Permission) => {
    setPermissions(prev => {
      const exists = prev.find(p => p.userId === permission.userId);
      if (exists) {
        return prev.map(p => p.userId === permission.userId ? permission : p);
      }
      return [...prev, permission];
    });
  }, []);

  // Connexion WebSocket
  const { isConnected, isReconnecting, error, emit, reconnect } = useWebSocket({
    presentationId,
    userId: currentUserId,
    userName: currentUserName,
    onUserJoin: handleUserJoin,
    onUserLeave: handleUserLeave,
    onUserUpdate: handleUserUpdate,
    onCursorMove: handleCursorMove,
    onSlideUpdate: handleSlideUpdate,
    onVariableChange: handleVariableChange,
    onActivity: handleActivity,
    onPermissionUpdate: handlePermissionUpdate,
  });

  // Fonctions utilitaires
  const getUserById = useCallback((userId: string) => {
    if (userId === currentUserId) return currentUser || undefined;
    return users.find(u => u.id === userId);
  }, [users, currentUser, currentUserId]);

  const getOnlineUsers = useCallback(() => {
    return users.filter(u => u.status === 'online' || u.status === 'editing');
  }, [users]);

  const getEditors = useCallback(() => {
    return users.filter(u => u.role === 'editor' || u.role === 'owner');
  }, [users]);

  const getViewers = useCallback(() => {
    return users.filter(u => u.role === 'viewer');
  }, [users]);

  // Mise à jour de la position du curseur (avec throttle)
  const updateCursorPosition = useCallback((x: number, y: number, slideId: string) => {
    if (cursorThrottleRef.current) {
      window.clearTimeout(cursorThrottleRef.current);
    }

    cursorThrottleRef.current = window.setTimeout(() => {
      if (currentUser) {
        const cursor: UserCursor = {
          userId: currentUser.id,
          userName: currentUser.name,
          userColor: currentUser.color,
          position: { x, y, slideId },
          timestamp: new Date(),
        };
        emit('cursor:move', cursor);
      }
    }, 50); // Throttle à 50ms
  }, [currentUser, emit]);

  // Ajouter une activité
  const addActivity = useCallback((type: Activity['type'], details: Activity['details']) => {
    if (!currentUser) return;

    const activity: Activity = {
      id: generateId(),
      type,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      timestamp: new Date(),
      details,
    };

    setActivities(prev => [activity, ...prev].slice(0, maxActivities));
    emit('activity:new', activity);
  }, [currentUser, emit]);

  // Effacer les activités
  const clearActivities = useCallback(() => {
    setActivities([]);
  }, []);

  // Mettre à jour les paramètres de partage
  const updateShareSettings = useCallback((settings: Partial<ShareSettings>) => {
    setShareSettings(prev => ({ ...prev, ...settings }));
  }, []);

  // Accorder une permission
  const grantPermission = useCallback((userEmail: string, role: UserRole) => {
    const newPermission: Permission = {
      userId: generateId(),
      userName: userEmail.split('@')[0],
      userEmail,
      role,
      grantedAt: new Date(),
      grantedBy: currentUserId,
    };
    setPermissions(prev => [...prev, newPermission]);
    emit('permission:update', newPermission);

    // Ajouter une activité
    addActivity('permission_changed', {
      targetUserId: newPermission.userId,
      targetUserName: newPermission.userName,
      message: `${currentUserName} a accordé les droits de ${ROLE_LABELS[role]} à ${userEmail}`,
    });
  }, [currentUserId, currentUserName, emit, addActivity]);

  // Révoquer une permission
  const revokePermission = useCallback((userId: string) => {
    const permission = permissions.find(p => p.userId === userId);
    setPermissions(prev => prev.filter(p => p.userId !== userId));
    
    if (permission) {
      addActivity('permission_changed', {
        targetUserId: userId,
        targetUserName: permission.userName,
        message: `${currentUserName} a révoqué les droits de ${permission.userName}`,
      });
    }
  }, [permissions, currentUserName, addActivity]);

  // Vérifier les permissions
  const canEdit = useCallback(() => {
    return currentUser?.role === 'editor' || currentUser?.role === 'owner';
  }, [currentUser]);

  const canShare = useCallback(() => {
    return currentUser?.role === 'owner';
  }, [currentUser]);

  // Résoudre un conflit
  const resolveConflict = useCallback((conflictId: string, resolution: 'local' | 'remote' | 'merged') => {
    setConflicts(prev => prev.map(c => 
      c.id === conflictId ? { ...c, resolved: true, resolution } : c
    ));
  }, []);

  // Mettre à jour le statut de l'utilisateur
  const updateUserStatus = useCallback((status: User['status']) => {
    setCurrentUser(prev => prev ? { ...prev, status, lastSeenAt: new Date() } : null);
    emit('user:update', { id: currentUserId, status });
  }, [currentUserId, emit]);

  // Mettre à jour la diapositive courante
  const updateCurrentSlide = useCallback((slideId: string) => {
    setCurrentUser(prev => prev ? { ...prev, currentSlideId: slideId, status: 'editing' } : null);
    emit('user:update', { id: currentUserId, currentSlideId: slideId, status: 'editing' });
  }, [currentUserId, emit]);

  // Nettoyer les curseurs inactifs
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCursors(prev => {
        const next = new Map(prev);
        prev.forEach((cursor, userId) => {
          if (now - cursor.timestamp.getTime() > 30000) { // 30 secondes
            next.delete(userId);
          }
        });
        return next;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return {
    // Utilisateurs
    users,
    currentUser,
    getUserById,
    getOnlineUsers,
    getEditors,
    getViewers,

    // Curseurs
    cursors,
    updateCursorPosition,

    // Activités
    activities,
    addActivity,
    clearActivities,

    // Permissions
    permissions,
    shareSettings,
    updateShareSettings,
    grantPermission,
    revokePermission,
    canEdit,
    canShare,

    // Conflits
    conflicts,
    resolveConflict,

    // Connexion
    isConnected,
    isReconnecting,
    connectionError: error,
    reconnect,

    // Présence
    updateUserStatus,
    updateCurrentSlide,
  };
}

export default useCollaboration;
