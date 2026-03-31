/**
 * Hook WebSocket pour la collaboration en temps réel
 * Alecia Presentations - Gestion de la connexion Socket.io
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import type {
  User,
  UserCursor,
  SlideUpdate,
  VariableChange,
  Activity,
  Permission,
} from '../types/collaboration';

// Mock Socket.io pour la démonstration
// En production, remplacer par : import { io, Socket } from 'socket.io-client';

interface MockSocket {
  connected: boolean;
  id: string;
  emit: (event: string, ...args: unknown[]) => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback?: (...args: unknown[]) => void) => void;
  connect: () => void;
  disconnect: () => void;
}

interface UseWebSocketOptions {
  presentationId: string;
  userId: string;
  userName: string;
  onUserJoin?: (user: User) => void;
  onUserLeave?: (userId: string) => void;
  onUserUpdate?: (user: Partial<User> & { id: string }) => void;
  onSlideUpdate?: (update: SlideUpdate) => void;
  onSlideAdd?: (payload: { slideId: string; position: number; createdBy: string }) => void;
  onSlideRemove?: (payload: { slideId: string; removedBy: string }) => void;
  onCursorMove?: (cursor: UserCursor) => void;
  onVariableChange?: (change: VariableChange) => void;
  onActivity?: (activity: Activity) => void;
  onPermissionUpdate?: (permission: Permission) => void;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: string) => void;
}

interface UseWebSocketReturn {
  socket: MockSocket | null;
  isConnected: boolean;
  isReconnecting: boolean;
  error: string | null;
  emit: (event: string, payload: unknown) => void;
  reconnect: () => void;
}

// Créer un mock socket pour la démonstration
function createMockSocket(
  _presentationId: string,
  _userId: string,
  _userName: string,
  callbacks: {
    onConnect?: () => void;
    onDisconnect?: (reason: string) => void;
    onError?: (error: string) => void;
  }
): MockSocket {
  const listeners: Record<string, ((...args: unknown[]) => void)[]> = {};

  const socket: MockSocket = {
    connected: false,
    id: `mock-${Date.now()}`,

    emit: (event: string, ...args: unknown[]) => {
      console.log(`[WebSocket] Emit: ${event}`, args);

      // Simuler des réponses du serveur
      if (event === 'cursor:move') {
        // Diffuser le mouvement du curseur aux autres
        setTimeout(() => {
          socket.on('cursor:move', () => {});
        }, 10);
      }
    },

    on: (event: string, callback: (...args: unknown[]) => void) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    },

    off: (event: string, callback?: (...args: unknown[]) => void) => {
      if (listeners[event]) {
        if (callback) {
          listeners[event] = listeners[event].filter((cb) => cb !== callback);
        } else {
          delete listeners[event];
        }
      }
    },

    connect: () => {
      console.log('[WebSocket] Connexion simulée...');
      setTimeout(() => {
        socket.connected = true;
        callbacks.onConnect?.();

        // Simuler l'arrivée d'autres utilisateurs
        triggerEvent('user:join', {
          id: 'user-2',
          name: 'Marie Martin',
          email: 'marie.martin@alecia.fr',
          role: 'editor',
          status: 'online',
          color: '#2196f3',
          joinedAt: new Date(),
          lastSeenAt: new Date(),
        } as User);

        triggerEvent('user:join', {
          id: 'user-3',
          name: 'Pierre Bernard',
          email: 'pierre.bernard@alecia.fr',
          role: 'viewer',
          status: 'online',
          color: '#4caf50',
          joinedAt: new Date(),
          lastSeenAt: new Date(),
        } as User);
      }, 500);
    },

    disconnect: () => {
      socket.connected = false;
      callbacks.onDisconnect?.('client disconnect');
    },
  };

  function triggerEvent(event: string, ...args: unknown[]) {
    listeners[event]?.forEach((callback) => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`[WebSocket] Erreur dans le callback ${event}:`, error);
      }
    });
  }

  return socket;
}

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    presentationId,
    userId,
    userName,
    onUserJoin,
    onUserLeave,
    onUserUpdate,
    onSlideUpdate,
    onSlideAdd,
    onSlideRemove,
    onCursorMove,
    onVariableChange,
    onActivity,
    onPermissionUpdate,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const socketRef = useRef<MockSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Initialiser la connexion
  useEffect(() => {
    if (!presentationId || !userId) {
      setError('Identifiants manquants pour la connexion');
      return;
    }

    const socket = createMockSocket(presentationId, userId, userName, {
      onConnect: () => {
        setIsConnected(true);
        setIsReconnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      },
      onDisconnect: (reason) => {
        setIsConnected(false);
        onDisconnect?.(reason);

        // Tentative de reconnexion automatique
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          setIsReconnecting(true);
          reconnectAttemptsRef.current++;
          setTimeout(
            () => {
              socket.connect();
            },
            1000 * Math.min(reconnectAttemptsRef.current, 5)
          );
        }
      },
      onError: (err) => {
        setError(err);
        onError?.(err);
      },
    });

    socketRef.current = socket;

    // Configurer les écouteurs d'événements
    const handleUserJoin = (user: User) => onUserJoin?.(user);
    const handleUserLeave = (payload: { userId: string }) => onUserLeave?.(payload.userId);
    const handleUserUpdate = (user: Partial<User> & { id: string }) => onUserUpdate?.(user);
    const handleSlideUpdate = (update: SlideUpdate) => onSlideUpdate?.(update);
    const handleSlideAdd = (payload: { slideId: string; position: number; createdBy: string }) =>
      onSlideAdd?.(payload);
    const handleSlideRemove = (payload: { slideId: string; removedBy: string }) =>
      onSlideRemove?.(payload);
    const handleCursorMove = (cursor: UserCursor) => onCursorMove?.(cursor);
    const handleVariableChange = (change: VariableChange) => onVariableChange?.(change);
    const handleActivity = (activity: Activity) => onActivity?.(activity);
    const handlePermissionUpdate = (permission: Permission) => onPermissionUpdate?.(permission);

    socket.on('user:join', handleUserJoin as (...args: unknown[]) => void);
    socket.on('user:leave', handleUserLeave as (...args: unknown[]) => void);
    socket.on('user:update', handleUserUpdate as (...args: unknown[]) => void);
    socket.on('slide:update', handleSlideUpdate as (...args: unknown[]) => void);
    socket.on('slide:add', handleSlideAdd as (...args: unknown[]) => void);
    socket.on('slide:remove', handleSlideRemove as (...args: unknown[]) => void);
    socket.on('cursor:move', handleCursorMove as (...args: unknown[]) => void);
    socket.on('variable:change', handleVariableChange as (...args: unknown[]) => void);
    socket.on('activity:new', handleActivity as (...args: unknown[]) => void);
    socket.on('permission:update', handlePermissionUpdate as (...args: unknown[]) => void);

    // Connexion initiale
    socket.connect();

    // Nettoyage
    return () => {
      socket.off('user:join', handleUserJoin as (...args: unknown[]) => void);
      socket.off('user:leave', handleUserLeave as (...args: unknown[]) => void);
      socket.off('user:update', handleUserUpdate as (...args: unknown[]) => void);
      socket.off('slide:update', handleSlideUpdate as (...args: unknown[]) => void);
      socket.off('slide:add', handleSlideAdd as (...args: unknown[]) => void);
      socket.off('slide:remove', handleSlideRemove as (...args: unknown[]) => void);
      socket.off('cursor:move', handleCursorMove as (...args: unknown[]) => void);
      socket.off('variable:change', handleVariableChange as (...args: unknown[]) => void);
      socket.off('activity:new', handleActivity as (...args: unknown[]) => void);
      socket.off('permission:update', handlePermissionUpdate as (...args: unknown[]) => void);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [presentationId, userId, userName]);

  // Fonction pour émettre des événements
  const emit = useCallback((event: string, payload: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, payload);
    } else {
      console.warn("[WebSocket] Tentative d'émission sans connexion:", event);
    }
  }, []);

  // Fonction de reconnexion manuelle
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      setIsReconnecting(true);
      reconnectAttemptsRef.current = 0;
      socketRef.current.connect();
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    isReconnecting,
    error,
    emit,
    reconnect,
  };
}

export default useWebSocket;
