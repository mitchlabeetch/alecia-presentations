/**
 * Touch-Optimized Drag and Drop Hook for PitchForge
 * Provides smooth 60fps touch interactions for tablet and mobile
 */

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  RefObject,
} from "react";

export interface TouchDragOptions {
  /** Minimum distance before drag starts (px) */
  activationDistance?: number;
  /** Touch action CSS value */
  touchAction?: string;
  /** Enable pinch-to-zoom during drag */
  enablePinchZoom?: boolean;
  /** Mouse drag support */
  enableMouse?: boolean;
  /** Callback when drag starts */
  onDragStart?: (event: TouchDragEvent) => void;
  /** Callback during drag */
  onDragMove?: (event: TouchDragEvent) => void;
  /** Callback when drag ends */
  onDragEnd?: (event: TouchDragEvent) => void;
  /** Callback when drag is cancelled */
  onDragCancel?: () => void;
}

export interface TouchDragEvent {
  /** Current pointer position */
  position: { x: number; y: number };
  /** Delta from start position */
  delta: { x: number; y: number };
  /** Total distance from start */
  distance: number;
  /** Direction of movement */
  direction: "horizontal" | "vertical" | "diagonal" | "none";
  /** Velocity of movement (px/ms) */
  velocity: { x: number; y: number };
  /** Is this a flick/pinch gesture */
  gesture: "drag" | "pinch" | "none";
  /** Original touch/mouse event */
  originalEvent: TouchEvent | MouseEvent | PointerEvent | React.PointerEvent;
}

interface DragState {
  isDragging: boolean;
  isPinching: boolean;
  startPosition: { x: number; y: number } | null;
  lastPosition: { x: number; y: number } | null;
  lastTime: number;
  velocity: { x: number; y: number };
  touchIds: Set<number>;
}

const DEFAULT_OPTIONS: Required<TouchDragOptions> = {
  activationDistance: 8,
  touchAction: "none",
  enablePinchZoom: true,
  enableMouse: true,
  onDragStart: () => {},
  onDragMove: () => {},
  onDragEnd: () => {},
  onDragCancel: () => {},
};

export function useTouchDrag<T extends HTMLElement = HTMLDivElement>(
  options: TouchDragOptions = {},
): {
  containerRef: RefObject<T>;
  isDragging: boolean;
  isPinching: boolean;
  handlers: {
    onPointerDown: (e: React.PointerEvent<T>) => void;
    onPointerMove: (e: React.PointerEvent<T>) => void;
    onPointerUp: (e: React.PointerEvent<T>) => void;
    onPointerCancel: (e: React.PointerEvent<T>) => void;
    onWheel: (e: React.WheelEvent<T>) => void;
  };
  reset: () => void;
} {
  const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);
  const containerRef = useRef<T>(null);

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isPinching: false,
    startPosition: null,
    lastPosition: null,
    lastTime: 0,
    velocity: { x: 0, y: 0 },
    touchIds: new Set(),
  });

  const dragStateRef = useRef(dragState);
  dragStateRef.current = dragState;

  // Calculate velocity from position delta
  const calculateVelocity = useCallback(
    (position: { x: number; y: number }, time: number) => {
      const last = dragStateRef.current.lastPosition;
      const lastTime = dragStateRef.current.lastTime;

      if (!last || !lastTime) {
        return { x: 0, y: 0 };
      }

      const dt = time - lastTime;
      if (dt === 0) return { x: 0, y: 0 };

      return {
        x: (position.x - last.x) / dt,
        y: (position.y - last.y) / dt,
      };
    },
    [],
  );

  // Determine drag direction
  const getDirection = useCallback(
    (delta: {
      x: number;
      y: number;
    }): "horizontal" | "vertical" | "diagonal" | "none" => {
      const absX = Math.abs(delta.x);
      const absY = Math.abs(delta.y);
      const threshold = 5;

      if (absX < threshold && absY < threshold) return "none";

      const ratio = Math.max(absX, absY) / Math.min(absX || 1, absY || 1);
      if (ratio < 1.5) return "diagonal";

      return absX > absY ? "horizontal" : "vertical";
    },
    [],
  );

  // Create drag event from current state
  const createDragEvent = useCallback(
    (
      position: { x: number; y: number },
      originalEvent: TouchEvent | MouseEvent | PointerEvent,
    ): TouchDragEvent => {
      const state = dragStateRef.current;
      const start = state.startPosition || position;
      const delta = {
        x: position.x - start.x,
        y: position.y - start.y,
      };
      const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
      const velocity = calculateVelocity(position, Date.now());

      return {
        position,
        delta,
        distance,
        direction: getDirection(delta),
        velocity,
        gesture: state.isPinching
          ? "pinch"
          : state.isDragging
            ? "drag"
            : "none",
        originalEvent,
      };
    },
    [calculateVelocity, getDirection],
  );

  // Reset drag state
  const reset = useCallback(() => {
    setDragState({
      isDragging: false,
      isPinching: false,
      startPosition: null,
      lastPosition: null,
      lastTime: 0,
      velocity: { x: 0, y: 0 },
      touchIds: new Set(),
    });
  }, []);

  // Pointer down handler
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<T>) => {
      if (e.pointerType === "mouse" && !opts.enableMouse) return;
      if (
        e.pointerType === "touch" ||
        e.pointerType === "mouse" ||
        e.pointerType === "pen"
      ) {
        // Capture pointer for smooth tracking
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

        const position = { x: e.clientX, y: e.clientY };
        const now = Date.now();

        setDragState((prev) => ({
          ...prev,
          isDragging: false,
          startPosition: position,
          lastPosition: position,
          lastTime: now,
          velocity: { x: 0, y: 0 },
          touchIds: new Set([e.pointerId]),
        }));
      }
    },
    [opts.enableMouse],
  );

  // Pointer move handler
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      const state = dragStateRef.current;
      if (!state.startPosition) return;

      const position = { x: e.clientX, y: e.clientY };
      const delta = {
        x: position.x - state.startPosition.x,
        y: position.y - state.startPosition.y,
      };
      const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);

      // Check if we should activate dragging
      if (!state.isDragging && distance >= opts.activationDistance) {
        setDragState((prev) => ({
          ...prev,
          isDragging: true,
          lastPosition: position,
          lastTime: Date.now(),
        }));

        opts.onDragStart?.(
          createDragEvent(position, e as unknown as PointerEvent),
        );
      }

      // If dragging, fire move callback
      if (state.isDragging) {
        const velocity = calculateVelocity(position, Date.now());

        setDragState((prev) => ({
          ...prev,
          lastPosition: position,
          lastTime: Date.now(),
          velocity,
        }));

        opts.onDragMove?.(
          createDragEvent(position, e as unknown as PointerEvent),
        );
      }
    },
    [opts, createDragEvent, calculateVelocity],
  );

  // Pointer up handler
  const handlePointerUp = useCallback(
    (e: React.PointerEvent<T>) => {
      const state = dragStateRef.current;

      if (state.isDragging) {
        const position = { x: e.clientX, y: e.clientY };
        opts.onDragEnd?.(
          createDragEvent(position, e as unknown as PointerEvent),
        );
      }

      reset();
    },
    [opts, createDragEvent, reset],
  );

  // Pointer cancel handler
  const handlePointerCancel = useCallback(
    (_e: React.PointerEvent<T>) => {
      const state = dragStateRef.current;

      if (state.isDragging) {
        opts.onDragCancel?.();
      }

      reset();
    },
    [opts, reset],
  );

  // Wheel handler for pinch-to-zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent<T>) => {
      if (!opts.enablePinchZoom) return;

      // Allow native browser pinch-zoom while preventing page scroll
      if (e.ctrlKey) {
        e.preventDefault();
      }
    },
    [opts.enablePinchZoom],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Set touch action CSS on container
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.touchAction = opts.touchAction;
    }
  }, [opts.touchAction]);

  return {
    containerRef,
    isDragging: dragState.isDragging,
    isPinching: dragState.isPinching,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onWheel: handleWheel,
    },
    reset,
  };
}

/**
 * Simplified version for sortable lists with touch support
 */
export function useSortableTouch<T extends HTMLElement = HTMLDivElement>(
  id: string,
  options?: Pick<
    TouchDragOptions,
    "activationDistance" | "onDragStart" | "onDragEnd" | "onDragMove"
  >,
) {
  const { containerRef, isDragging, handlers } = useTouchDrag<T>({
    activationDistance: options?.activationDistance ?? 5,
    onDragStart: options?.onDragStart,
    onDragMove: options?.onDragMove,
    onDragEnd: options?.onDragEnd,
  });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortableTouchCore(id, containerRef, isDragging, handlers);

  return {
    ref: setNodeRef,
    isDragging,
    attributes,
    listeners,
    transform,
    transition,
    handlers,
  };
}

// Internal sortable hook
function useSortableTouchCore(
  id: string,
  containerRef: RefObject<HTMLElement | null>,
  isDragging: boolean,
  handlers: ReturnType<typeof useTouchDrag>["handlers"],
) {
  const [transform, setTransform] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [transition, setTransition] = useState<string | null>(null);

  const handleDragStart = useCallback((event: TouchDragEvent) => {
    setTransition(null);
  }, []);

  const handleDragMove = useCallback((event: TouchDragEvent) => {
    setTransform({ x: event.delta.x, y: event.delta.y });
  }, []);

  const handleDragEnd = useCallback((_event: TouchDragEvent) => {
    setTransform(null);
    setTransition("transform 200ms ease-out");
  }, []);

  return {
    attributes: {
      "data-sortable-id": id,
      role: "listitem",
      "aria-roledescription": "Élément glissable",
    },
    listeners: {
      ...handlers,
    },
    setNodeRef: containerRef,
    transform,
    transition,
  };
}

/**
 * Hook for detecting swipe gestures
 */
export function useSwipeGesture<T extends HTMLElement = HTMLDivElement>(
  options: {
    /** Minimum swipe distance */
    swipeDistance?: number;
    /** Maximum perpendicular deviation */
    maxDeviation?: number;
    /** Timeout for swipe completion */
    swipeTimeout?: number;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
  } = {},
) {
  const containerRef = useRef<T>(null);
  const startPoint = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);

  const { handlers, isDragging } = useTouchDrag<T>({
    activationDistance: options.swipeDistance ?? 30,
    enableMouse: true,
    onDragStart: () => {
      startPoint.current = {
        x: 0,
        y: 0,
        time: Date.now(),
      };
    },
    onDragMove: (event) => {
      if (startPoint.current) {
        // Determine primary direction while dragging
        const { delta } = event;
        if (Math.abs(delta.x) > Math.abs(delta.y)) {
          setSwipeDirection(delta.x > 0 ? "right" : "left");
        } else {
          setSwipeDirection(delta.y > 0 ? "down" : "up");
        }
      }
    },
    onDragEnd: (event) => {
      if (!startPoint.current) return;

      const { delta, distance, direction } = event;
      const maxDev = options.maxDeviation ?? 100;
      const elapsed = Date.now() - startPoint.current.time;

      // Check if swipe is valid
      if (
        direction === "horizontal" &&
        distance >= (options.swipeDistance ?? 30)
      ) {
        // Check perpendicular deviation
        if (Math.abs(delta.y) < maxDev) {
          if (delta.x > 0) {
            options.onSwipeRight?.();
          } else {
            options.onSwipeLeft?.();
          }
        }
      } else if (
        direction === "vertical" &&
        distance >= (options.swipeDistance ?? 30)
      ) {
        // Check perpendicular deviation
        if (Math.abs(delta.x) < maxDev) {
          if (delta.y > 0) {
            options.onSwipeDown?.();
          } else {
            options.onSwipeUp?.();
          }
        }
      }

      startPoint.current = null;
      setSwipeDirection(null);
    },
  });

  return {
    ref: containerRef,
    isSwiping: isDragging,
    swipeDirection,
    handlers,
  };
}
