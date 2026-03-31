/**
 * AccessibilityProvider for PitchForge
 * WCAG 2.1 AA compliance - Screen reader, keyboard navigation, high contrast
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
} from "react";

interface AccessibilityContextValue {
  // High Contrast Mode
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;

  // Reduced Motion
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  toggleReducedMotion: () => void;

  // Focus Management
  focusTrap: boolean;
  setFocusTrap: (enabled: boolean) => void;
  announceToScreenReader: (message: string, priority?: "polite" | "assertive") => void;
  moveFocusToTop: () => void;
  moveFocusToElement: (selector: string) => void;

  // Keyboard Navigation
  keyboardNavigation: boolean;
  setKeyboardNavigation: (enabled: boolean) => void;

  // Live Region for announcements
  liveRegionMessage: string;
  liveRegionPriority: "polite" | "assertive";

  // Skip Links
  showSkipLinks: boolean;
  setShowSkipLinks: (show: boolean) => void;

  // Current focused element tracking
  focusedElement: HTMLElement | null;
  setFocusedElement: (element: HTMLElement | null) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function useAccessibility(): AccessibilityContextValue {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
}

interface AccessibilityProviderProps {
  children: ReactNode;
  /** Enable debug mode to log accessibility events */
  debug?: boolean;
}

export function AccessibilityProvider({
  children,
  debug = false,
}: AccessibilityProviderProps) {
  // High Contrast Mode - increases color contrast for visibility
  const [highContrast, setHighContrast] = useState(() => {
    const stored = localStorage.getItem("a11y_high_contrast");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-contrast: more)").matches;
  });

  // Reduced Motion - respects user's motion preferences
  const [reducedMotion, setReducedMotion] = useState(() => {
    const stored = localStorage.getItem("a11y_reduced_motion");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Focus Trap - prevents focus from leaving a modal/dialog
  const [focusTrap, setFocusTrap] = useState(false);

  // Live Region - announces updates to screen readers
  const [liveRegionMessage, setLiveRegionMessage] = useState("");
  const [liveRegionPriority, setLiveRegionPriority] = useState<"polite" | "assertive">("polite");

  // Keyboard Navigation - tracks if user is using keyboard
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);

  // Skip Links visibility
  const [showSkipLinks, setShowSkipLinks] = useState(true);

  // Focused element tracking
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  // Refs for focus management
  const topRef = useRef<HTMLButtonElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const focusTrapContainerRef = useRef<HTMLDivElement>(null);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem("a11y_high_contrast", String(highContrast));
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem("a11y_reduced_motion", String(reducedMotion));
    document.documentElement.classList.toggle("reduced-motion", reducedMotion);
  }, [reducedMotion]);

  // Detect keyboard navigation
  useEffect(() => {
    let lastInputType = "mouse";

    const handlePointerDown = () => {
      lastInputType = "mouse";
      setKeyboardNavigation(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        lastInputType = "keyboard";
        setKeyboardNavigation(true);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Track focused element
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      setFocusedElement(e.target as HTMLElement);
    };

    document.addEventListener("focusin", handleFocusIn);
    return () => document.removeEventListener("focusin", handleFocusIn);
  }, []);

  // Focus trap implementation
  useEffect(() => {
    if (!focusTrap || !focusTrapContainerRef.current) return;

    const container = focusTrapContainerRef.current;
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(", ");

    const getFocusableElements = () => {
      return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [focusTrap]);

  // Announce to screen reader via live region
  const announceToScreenReader = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (debug) console.log(`[A11Y Announce(${priority})]: ${message}`);

      // Clear first to ensure announcement
      setLiveRegionMessage("");
      setLiveRegionPriority(priority);

      // Small delay to ensure screen reader picks up the change
      requestAnimationFrame(() => {
        setLiveRegionMessage(message);
      });
    },
    [debug]
  );

  // Move focus to top/skip link target
  const moveFocusToTop = useCallback(() => {
    if (debug) console.log("[A11Y]: Moving focus to top");
    topRef.current?.focus();
  }, [debug]);

  // Move focus to specific element
  const moveFocusToElement = useCallback(
    (selector: string) => {
      if (debug) console.log(`[A11Y]: Moving focus to ${selector}`);
      const element = document.querySelector<HTMLElement>(selector);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [debug]
  );

  // Toggle functions
  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => !prev);
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setReducedMotion((prev) => !prev);
  }, []);

  // Context value
  const value = useMemo<AccessibilityContextValue>(
    () => ({
      highContrast,
      setHighContrast,
      toggleHighContrast,
      reducedMotion,
      setReducedMotion,
      toggleReducedMotion,
      focusTrap,
      setFocusTrap,
      announceToScreenReader,
      moveFocusToTop,
      moveFocusToElement,
      keyboardNavigation,
      setKeyboardNavigation,
      liveRegionMessage,
      liveRegionPriority,
      showSkipLinks,
      setShowSkipLinks,
      focusedElement,
      setFocusedElement,
    }),
    [
      highContrast,
      toggleHighContrast,
      reducedMotion,
      toggleReducedMotion,
      focusTrap,
      announceToScreenReader,
      moveFocusToTop,
      moveFocusToElement,
      keyboardNavigation,
      liveRegionMessage,
      liveRegionPriority,
      showSkipLinks,
      focusedElement,
    ]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {/* Skip Links for keyboard users */}
      {showSkipLinks && (
        <div className="skip-links sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[300] focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
          <button
            ref={topRef}
            onClick={() => {
              mainContentRef.current?.focus();
              announceToScreenReader("Navigation principale");
            }}
            className="skip-link"
          >
            Aller au contenu principal
          </button>
        </div>
      )}

      {/* Live region for screen reader announcements */}
      <div
        role="status"
        aria-live={liveRegionPriority}
        aria-atomic="true"
        className="sr-only"
      >
        {liveRegionMessage}
      </div>

      {/* Main content with accessible ref */}
      <div
        ref={mainContentRef}
        tabIndex={-1}
        className={keyboardNavigation ? "keyboard-nav" : ""}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

/**
 * Hook for managing focus within a component
 */
export function useFocusManagement() {
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const focusableSelectors = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(", ");

  const saveFocus = useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, []);

  const moveFocusTo = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus();
    }
  }, []);

  const getFirstFocusable = useCallback((container: HTMLElement): HTMLElement | null => {
    return container.querySelector(focusableSelectors) as HTMLElement | null;
  }, []);

  const getLastFocusable = useCallback((container: HTMLElement): HTMLElement | null => {
    const elements = container.querySelectorAll<HTMLElement>(focusableSelectors);
    return elements.length > 0 ? elements[elements.length - 1] : null;
  }, []);

  const trapFocus = useCallback((container: HTMLElement) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const firstFocusable = getFirstFocusable(container);
      const lastFocusable = getLastFocusable(container);

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [getFirstFocusable, getLastFocusable]);

  return {
    saveFocus,
    restoreFocus,
    moveFocusTo,
    getFirstFocusable,
    getLastFocusable,
    trapFocus,
  };
}

/**
 * Component to announce dynamic content changes to screen readers
 */
export function ScreenReaderAnnouncer({
  message,
  priority = "polite",
}: {
  message: string;
  priority?: "polite" | "assertive";
}) {
  return (
    <div role="status" aria-live={priority} aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}

/**
 * High contrast mode toggle button
 */
export function HighContrastToggle() {
  const { highContrast, toggleHighContrast } = useAccessibility();

  return (
    <button
      onClick={toggleHighContrast}
      className="high-contrast-toggle flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-pressed={highContrast}
      aria-label={
        highContrast ? "Désactiver le mode contraste élevé" : "Activer le mode contraste élevé"
      }
      title="Contraste élevé"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <span className="text-sm font-medium">Contraste</span>
    </button>
  );
}

/**
 * Reduced motion toggle button
 */
export function ReducedMotionToggle() {
  const { reducedMotion, toggleReducedMotion } = useAccessibility();

  return (
    <button
      onClick={toggleReducedMotion}
      className="reduced-motion-toggle flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-pressed={reducedMotion}
      aria-label={
        reducedMotion ? "Désactiver la réduction de mouvement" : "Activer la réduction de mouvement"
      }
      title="Réduction de mouvement"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
      <span className="text-sm font-medium">Mouvement</span>
    </button>
  );
}

/**
 * Accessible keyboard shortcuts help dialog
 */
export function KeyboardShortcutsHelp() {
  const { announceToScreenReader } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const shortcuts = [
    { key: "Cmd/Ctrl + S", action: "Enregistrer" },
    { key: "Cmd/Ctrl + Z", action: "Annuler" },
    { key: "Cmd/Ctrl + Shift + Z", action: "Rétablir" },
    { key: "J / ↓", action: "Diapositive suivante" },
    { key: "K / ↑", action: "Diapositive précédente" },
    { key: "C", action: "Afficher/Masquer les commentaires" },
    { key: "D", action: "Dupliquer la diapositive" },
    { key: "P", action: "Mode présentation" },
    { key: "N", action: "Afficher/Masquer les notes" },
    { key: "Échap", action: "Fermer / Quitter" },
    { key: "?", action: "Afficher l'aide" },
  ];

  useEffect(() => {
    if (isOpen) {
      announceToScreenReader("Dialogue d'aide des raccourcis clavier ouvert");
      dialogRef.current?.focus();
    }
  }, [isOpen, announceToScreenReader]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Afficher l'aide des raccourcis clavier"
      >
        ?
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-help-title"
      ref={dialogRef}
      className="fixed inset-0 z-[250] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setIsOpen(false)}
      />
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
        tabIndex={-1}
      >
        <h2
          id="keyboard-help-title"
          className="text-xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Raccourcis clavier
        </h2>

        <div className="space-y-2" role="list" aria-label="Raccourcis clavier">
          {shortcuts.map(({ key, action }) => (
            <div
              key={key}
              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              role="listitem"
            >
              <span className="text-gray-600 dark:text-gray-300">{action}</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-gray-900 dark:text-white">
                {key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="mt-6 w-full px-4 py-2 bg-[#1a3a5c] hover:bg-[#1a3a5c]/90 text-white font-semibold rounded-lg transition-colors"
          autoFocus
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

/**
 * Roving tabindex for complex widgets
 */
export function useRovingTabIndex<T extends HTMLElement>(
  itemCount: number,
  initialIndex = 0
) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);

  const getTabIndex = useCallback(
    (index: number) => (index === activeIndex ? 0 : -1),
    [activeIndex]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let newIndex = activeIndex;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          newIndex = (activeIndex + 1) % itemCount;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          newIndex = (activeIndex - 1 + itemCount) % itemCount;
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = itemCount - 1;
          break;
      }

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
        // Focus the new element
        const container = containerRef.current;
        if (container) {
          const items = container.querySelectorAll<HTMLElement>(
            '[data-roving-item]:not([disabled])'
          );
          const targetItem = items[newIndex];
          targetItem?.focus();
        }
      }
    },
    [activeIndex, itemCount]
  );

  return {
    containerRef,
    activeIndex,
    setActiveIndex,
    getTabIndex,
    handleKeyDown,
  };
}
