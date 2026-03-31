/**
 * Indicateur de curseur pour les utilisateurs distants
 * Alecia Presentations - Composant de collaboration
 */

import React, { useEffect, useRef, useState } from 'react';
import type { UserCursor } from '../../types/collaboration';

interface UserCursorProps {
  cursor: UserCursor;
  containerRef?: React.RefObject<HTMLElement>;
  smooth?: boolean;
  showLabel?: boolean;
  className?: string;
}

// Icône de curseur personnalisée
const CursorIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
    }}
  >
    <path
      d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87a.5.5 0 00.35-.85L6.35 2.85a.5.5 0 00-.85.35z"
      fill={color}
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const UserCursorComponent: React.FC<UserCursorProps> = ({
  cursor,
  containerRef,
  smooth = true,
  showLabel = true,
  className = '',
}) => {
  const { userName, userColor, position } = cursor;
  const [displayPosition, setDisplayPosition] = useState(position);
  const [isVisible, setIsVisible] = useState(true);
  const lastUpdateRef = useRef(Date.now());
  const animationRef = useRef<number | null>(null);
  const targetPositionRef = useRef(position);

  // Animation fluide vers la nouvelle position
  useEffect(() => {
    targetPositionRef.current = position;
    lastUpdateRef.current = Date.now();
    setIsVisible(true);

    if (smooth) {
      const animate = () => {
        setDisplayPosition((prev) => {
          const dx = targetPositionRef.current.x - prev.x;
          const dy = targetPositionRef.current.y - prev.y;

          // Interpolation linéaire pour un mouvement fluide
          const lerpFactor = 0.15;

          return {
            x: prev.x + dx * lerpFactor,
            y: prev.y + dy * lerpFactor,
            slideId: targetPositionRef.current.slideId,
          };
        });

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      setDisplayPosition(position);
    }
  }, [position, smooth]);

  // Masquer le curseur après inactivité
  useEffect(() => {
    const checkInactivity = setInterval(() => {
      const inactiveTime = Date.now() - lastUpdateRef.current;
      if (inactiveTime > 10000) {
        // 10 secondes
        setIsVisible(false);
      }
    }, 1000);

    return () => clearInterval(checkInactivity);
  }, []);

  // Calculer la position relative au conteneur
  const getRelativePosition = () => {
    if (!containerRef?.current) {
      return { x: displayPosition.x, y: displayPosition.y };
    }

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    return {
      x: displayPosition.x - rect.left,
      y: displayPosition.y - rect.top,
    };
  };

  const relativePos = getRelativePosition();

  if (!isVisible) return null;

  return (
    <div
      className={className}
      style={{
        position: containerRef?.current ? 'absolute' : 'fixed',
        left: relativePos.x,
        top: relativePos.y,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(0, 0)',
        transition: smooth ? 'none' : 'all 0.1s ease-out',
      }}
    >
      {/* Icône du curseur */}
      <CursorIcon color={userColor} />

      {/* Étiquette avec le nom */}
      {showLabel && (
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '14px',
            backgroundColor: userColor,
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            fontFamily: 'Inter, system-ui, sans-serif',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            animation: 'cursorLabelFadeIn 0.2s ease-out',
          }}
        >
          {userName}
        </div>
      )}

      {/* Animation d'apparition */}
      <style>{`
        @keyframes cursorLabelFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Composant pour afficher tous les curseurs
interface CursorsOverlayProps {
  cursors: Map<string, UserCursor>;
  containerRef?: React.RefObject<HTMLElement>;
  currentSlideId: string;
  className?: string;
}

export const CursorsOverlay: React.FC<CursorsOverlayProps> = ({
  cursors,
  containerRef,
  currentSlideId,
  className = '',
}) => {
  // Filtrer les curseurs pour la diapositive courante
  const visibleCursors = Array.from(cursors.values()).filter(
    (cursor) => cursor.position.slideId === currentSlideId
  );

  if (visibleCursors.length === 0) return null;

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        overflow: 'hidden',
      }}
    >
      {visibleCursors.map((cursor) => (
        <UserCursorComponent
          key={cursor.userId}
          cursor={cursor}
          containerRef={containerRef}
          smooth={true}
          showLabel={true}
        />
      ))}
    </div>
  );
};

// Hook pour tracker la position du curseur local
interface UseCursorTrackingOptions {
  slideId: string;
  onCursorMove: (x: number, y: number, slideId: string) => void;
  enabled?: boolean;
  throttleMs?: number;
}

export function useCursorTracking(options: UseCursorTrackingOptions) {
  const { slideId, onCursorMove, enabled = true, throttleMs = 50 } = options;
  const lastMoveRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const now = Date.now();
      if (now - lastMoveRef.current < throttleMs) return;
      lastMoveRef.current = now;
      onCursorMove(mouseEvent.clientX, mouseEvent.clientY, slideId);
    };

    const handleMouseLeave = () => {
      // Optionnel : notifier que le curseur a quitté la zone
    };

    const element = containerRef.current || document;
    element.addEventListener('mousemove', handleMouseMove as EventListener);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove as EventListener);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [slideId, onCursorMove, enabled, throttleMs]);

  return containerRef;
}

// Composant pour la zone de tracking du curseur
interface CursorTrackingAreaProps {
  slideId: string;
  onCursorMove: (x: number, y: number, slideId: string) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const CursorTrackingArea: React.FC<CursorTrackingAreaProps> = ({
  slideId,
  onCursorMove,
  children,
  className = '',
  style = {},
}) => {
  const containerRef = useCursorTracking({
    slideId,
    onCursorMove,
    enabled: true,
  });

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default UserCursorComponent;
