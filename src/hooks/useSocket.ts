/**
 * Hook React pour la gestion des connexions WebSocket avec Socket.io
 * Gère la collaboration en temps réel entre utilisateurs
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { CollaborationEvent, CollaborationEventType, Collaborator, User } from '@types/index';

// Configuration du serveur Socket.io
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

// Types d'événements Socket.io
interface ServerToClientEvents {
  'user:joined': (user: Collaborator) => void;
  'user:left': (userId: string) => void;
  'user:updated': (user: Collaborator) => void;
  'slide:updated': (data: { slideId: string; updates: unknown; userId: string }) => void;
  'slide:added': (data: { slide: unknown; userId: string }) => void;
  'slide:removed': (data: { slideId: string; userId: string }) => void;
  'slide:reordered': (data: { slideIds: string[]; userId: string }) => void;
  'variable:changed': (data: { key: string; value: string; userId: string }) => void;
  'cursor:moved': (data: { userId: string; position: { x: number; y: number } }) => void;
  'selection:changed': (data: {
    userId: string;
    slideId: string | null;
    blockId: string | null;
  }) => void;
  connect_error: (error: Error) => void;
  disconnect: (reason: string) => void;
}

interface ClientToServerEvents {
  'room:join': (data: { presentationId: string; user: User }) => void;
  'room:leave': (data: { presentationId: string }) => void;
  'slide:update': (data: { presentationId: string; slideId: string; updates: unknown }) => void;
  'slide:add': (data: { presentationId: string; slide: unknown }) => void;
  'slide:remove': (data: { presentationId: string; slideId: string }) => void;
  'slide:reorder': (data: { presentationId: string; slideIds: string[] }) => void;
  'variable:update': (data: { presentationId: string; key: string; value: string }) => void;
  'cursor:move': (data: { presentationId: string; position: { x: number; y: number } }) => void;
  'selection:update': (data: {
    presentationId: string;
    slideId: string | null;
    blockId: string | null;
  }) => void;
  'user:presence': (data: { status: 'online' | 'away' }) => void;
}

// Options de configuration du hook
export interface UseSocketOptions {
  presentationId?: string;
  user?: User;
  enabled?: boolean;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
  onUserJoined?: (user: Collaborator) => void;
  onUserLeft?: (userId: string) => void;
  onSlideUpdated?: (data: { slideId: string; updates: unknown; userId: string }) => void;
  onSlideAdded?: (data: { slide: unknown; userId: string }) => void;
  onSlideRemoved?: (data: { slideId: string; userId: string }) => void;
  onSlideReordered?: (data: { slideIds: string[]; userId: string }) => void;
  onVariableChanged?: (data: { key: string; value: string; userId: string }) => void;
  onCursorMoved?: (data: { userId: string; position: { x: number; y: number } }) => void;
  onSelectionChanged?: (data: {
    userId: string;
    slideId: string | null;
    blockId: string | null;
  }) => void;
}

// Résultat du hook
export interface UseSocketResult {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  collaborators: Collaborator[];
  joinPresentation: (presentationId: string) => void;
  leavePresentation: () => void;
  emitSlideUpdate: (slideId: string, updates: unknown) => void;
  emitSlideAdd: (slide: unknown) => void;
  emitSlideRemove: (slideId: string) => void;
  emitSlideReorder: (slideIds: string[]) => void;
  emitVariableUpdate: (key: string, value: string) => void;
  emitCursorMove: (position: { x: number; y: number }) => void;
  emitSelectionUpdate: (slideId: string | null, blockId: string | null) => void;
  updatePresence: (status: 'online' | 'away') => void;
  reconnect: () => void;
  disconnect: () => void;
}

/**
 * Hook pour gérer la connexion Socket.io et la collaboration en temps réel
 */
export function useSocket(options: UseSocketOptions = {}): UseSocketResult {
  const {
    presentationId: initialPresentationId,
    user,
    enabled = true,
    onConnect,
    onDisconnect,
    onError,
    onUserJoined,
    onUserLeft,
    onSlideUpdated,
    onSlideAdded,
    onSlideRemoved,
    onSlideReordered,
    onVariableChanged,
    onCursorMoved,
    onSelectionChanged,
  } = options;

  // Références
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const currentPresentationIdRef = useRef<string | undefined>(initialPresentationId);

  // États
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  // Initialise la connexion Socket.io
  const initializeSocket = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
    });

    socketRef.current = socket;

    // Gestionnaires d'événements de connexion
    socket.on('connect', () => {
      console.log('[Socket] Connecté au serveur');
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
      onConnect?.();

      // Rejoindre la présentation si déjà spécifiée
      if (currentPresentationIdRef.current && user) {
        socket.emit('room:join', {
          presentationId: currentPresentationIdRef.current,
          user,
        });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Déconnecté:', reason);
      setIsConnected(false);
      setIsConnecting(false);
      onDisconnect?.(reason);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Erreur de connexion:', err);
      setError(err);
      setIsConnecting(false);
      onError?.(err);
    });

    // Gestionnaires d'événements de collaboration
    socket.on('user:joined', (collaborator) => {
      console.log('[Socket] Utilisateur rejoint:', collaborator);
      setCollaborators((prev) => {
        const exists = prev.find((c) => c.id === collaborator.id);
        if (exists) {
          return prev.map((c) => (c.id === collaborator.id ? collaborator : c));
        }
        return [...prev, collaborator];
      });
      onUserJoined?.(collaborator);
    });

    socket.on('user:left', (userId) => {
      console.log('[Socket] Utilisateur parti:', userId);
      setCollaborators((prev) => prev.filter((c) => c.id !== userId));
      onUserLeft?.(userId);
    });

    socket.on('user:updated', (collaborator) => {
      setCollaborators((prev) => prev.map((c) => (c.id === collaborator.id ? collaborator : c)));
    });

    socket.on('slide:updated', (data) => {
      console.log('[Socket] Slide mise à jour:', data);
      onSlideUpdated?.(data);
    });

    socket.on('slide:added', (data) => {
      console.log('[Socket] Slide ajoutée:', data);
      onSlideAdded?.(data);
    });

    socket.on('slide:removed', (data) => {
      console.log('[Socket] Slide supprimée:', data);
      onSlideRemoved?.(data);
    });

    socket.on('slide:reordered', (data) => {
      console.log('[Socket] Slides réordonnées:', data);
      onSlideReordered?.(data);
    });

    socket.on('variable:changed', (data) => {
      console.log('[Socket] Variable modifiée:', data);
      onVariableChanged?.(data);
    });

    socket.on('cursor:moved', (data) => {
      setCollaborators((prev) =>
        prev.map((c) => (c.id === data.userId ? { ...c, cursorPosition: data.position } : c))
      );
      onCursorMoved?.(data);
    });

    socket.on('selection:changed', (data) => {
      setCollaborators((prev) =>
        prev.map((c) =>
          c.id === data.userId ? { ...c, currentSlideId: data.slideId || undefined } : c
        )
      );
      onSelectionChanged?.(data);
    });
  }, [
    user,
    onConnect,
    onDisconnect,
    onError,
    onUserJoined,
    onUserLeft,
    onSlideUpdated,
    onSlideAdded,
    onSlideRemoved,
    onSlideReordered,
    onVariableChanged,
    onCursorMoved,
    onSelectionChanged,
  ]);

  // Nettoyage à la destruction du hook
  useEffect(() => {
    if (!enabled) return;

    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [enabled, initializeSocket]);

  // Rejoindre une présentation
  const joinPresentation = useCallback(
    (presentationId: string) => {
      currentPresentationIdRef.current = presentationId;

      if (socketRef.current?.connected && user) {
        socketRef.current.emit('room:join', { presentationId, user });
      }
    },
    [user]
  );

  // Quitter une présentation
  const leavePresentation = useCallback(() => {
    if (socketRef.current?.connected && currentPresentationIdRef.current) {
      socketRef.current.emit('room:leave', {
        presentationId: currentPresentationIdRef.current,
      });
      currentPresentationIdRef.current = undefined;
      setCollaborators([]);
    }
  }, []);

  // Émettre une mise à jour de slide
  const emitSlideUpdate = useCallback((slideId: string, updates: unknown) => {
    if (socketRef.current?.connected && currentPresentationIdRef.current) {
      socketRef.current.emit('slide:update', {
        presentationId: currentPresentationIdRef.current,
        slideId,
        updates,
      });
    }
  }, []);

  // Émettre l'ajout d'une slide
  const emitSlideAdd = useCallback((slide: unknown) => {
    if (socketRef.current?.connected && currentPresentationIdRef.current) {
      socketRef.current.emit('slide:add', {
        presentationId: currentPresentationIdRef.current,
        slide,
      });
    }
  }, []);

  // Émettre la suppression d'une slide
  const emitSlideRemove = useCallback((slideId: string) => {
    if (socketRef.current?.connected && currentPresentationIdRef.current) {
      socketRef.current.emit('slide:remove', {
        presentationId: currentPresentationIdRef.current,
        slideId,
      });
    }
  }, []);

  // Émettre le réordonnancement des slides
  const emitSlideReorder = useCallback((slideIds: string[]) => {
    if (socketRef.current?.connected && currentPresentationIdRef.current) {
      socketRef.current.emit('slide:reorder', {
        presentationId: currentPresentationIdRef.current,
        slideIds,
      });
    }
  }, []);

  // Émettre une mise à jour de variable
  const emitVariableUpdate = useCallback((key: string, value: string) => {
    if (socketRef.current?.connected && currentPresentationIdRef.current) {
      socketRef.current.emit('variable:update', {
        presentationId: currentPresentationIdRef.current,
        key,
        value,
      });
    }
  }, []);

  // Émettre un mouvement de curseur
  const emitCursorMove = useCallback((position: { x: number; y: number }) => {
    if (socketRef.current?.connected && currentPresentationIdRef.current) {
      socketRef.current.emit('cursor:move', {
        presentationId: currentPresentationIdRef.current,
        position,
      });
    }
  }, []);

  // Émettre une mise à jour de sélection
  const emitSelectionUpdate = useCallback((slideId: string | null, blockId: string | null) => {
    if (socketRef.current?.connected && currentPresentationIdRef.current) {
      socketRef.current.emit('selection:update', {
        presentationId: currentPresentationIdRef.current,
        slideId,
        blockId,
      });
    }
  }, []);

  // Mettre à jour le statut de présence
  const updatePresence = useCallback((status: 'online' | 'away') => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('user:presence', { status });
    }
  }, []);

  // Forcer la reconnexion
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    } else {
      initializeSocket();
    }
  }, [initializeSocket]);

  // Déconnexion manuelle
  const disconnect = useCallback(() => {
    leavePresentation();
    socketRef.current?.disconnect();
    setIsConnected(false);
    setCollaborators([]);
  }, [leavePresentation]);

  return {
    socket: socketRef.current,
    isConnected,
    isConnecting,
    error,
    collaborators,
    joinPresentation,
    leavePresentation,
    emitSlideUpdate,
    emitSlideAdd,
    emitSlideRemove,
    emitSlideReorder,
    emitVariableUpdate,
    emitCursorMove,
    emitSelectionUpdate,
    updatePresence,
    reconnect,
    disconnect,
  };
}

/**
 * Hook pour suivre la position du curseur de l'utilisateur courant
 * et l'envoyer aux autres collaborateurs
 */
export function useCursorTracking(
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
  presentationId: string | undefined,
  enabled: boolean = true,
  throttleMs: number = 50
) {
  const lastEmitTime = useRef<number>(0);
  const rafId = useRef<number | null>(null);
  const pendingPosition = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled || !socket || !presentationId) return;

    const handleMouseMove = (e: MouseEvent) => {
      const position = { x: e.clientX, y: e.clientY };
      pendingPosition.current = position;

      // Throttle avec requestAnimationFrame pour les performances
      if (rafId.current) return;

      rafId.current = requestAnimationFrame(() => {
        const now = Date.now();
        if (now - lastEmitTime.current >= throttleMs && pendingPosition.current) {
          socket.emit('cursor:move', {
            presentationId,
            position: pendingPosition.current,
          });
          lastEmitTime.current = now;
        }
        rafId.current = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [socket, presentationId, enabled, throttleMs]);
}

/**
 * Hook pour gérer la détection d'inactivité et mettre à jour le statut de présence
 */
export function usePresenceDetection(
  updatePresence: (status: 'online' | 'away') => void,
  awayTimeoutMs: number = 60000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAwayRef = useRef(false);

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (isAwayRef.current) {
        isAwayRef.current = false;
        updatePresence('online');
      }

      timeoutRef.current = setTimeout(() => {
        isAwayRef.current = true;
        updatePresence('away');
      }, awayTimeoutMs);
    };

    // Événements à surveiller pour l'activité
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimeout);
    });

    // Initialisation
    resetTimeout();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimeout);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updatePresence, awayTimeoutMs]);
}

export default useSocket;
