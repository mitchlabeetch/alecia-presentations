/**
 * Responsive Design Hook for PitchForge
 * Provides breakpoints and device detection for tablet/mobile support
 */

export type DeviceType = "mobile" | "tablet" | "desktop";
export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

export interface ResponsiveState {
  deviceType: DeviceType;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isPortable: boolean; // tablet or mobile
  windowWidth: number;
  windowHeight: number;
  canHover: boolean;
  pointerAccuracy: "fine" | "coarse" | "none";
}

// Breakpoint values (in pixels)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// Device-specific constraints
export const DEVICE_CONSTRAINTS = {
  mobile: {
    maxWidth: 767,
    touchOptimized: true,
    pencilSupport: false,
  },
  tablet: {
    minWidth: 768,
    maxWidth: 1023,
    touchOptimized: true,
    pencilSupport: true,
  },
  desktop: {
    minWidth: 1024,
    touchOptimized: false,
    pencilSupport: false,
  },
} as const;

function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS["2xl"]) return "2xl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  return "sm";
}

function getDeviceType(width: number, touchDevice: boolean): DeviceType {
  if (!touchDevice || width >= DEVICE_CONSTRAINTS.desktop.minWidth) {
    return "desktop";
  }
  if (width >= DEVICE_CONSTRAINTS.tablet.minWidth) {
    return "tablet";
  }
  return "mobile";
}

function detectTouchDevice(): boolean {
  if (typeof window === "undefined") return false;

  // Check for touch capability
  const hasTouchPoints = navigator.maxTouchPoints > 0;
  const hasCoarsePointer =
    window.matchMedia?.("(pointer: coarse)").matches ?? false;

  // Also check via user agent for mobile devices
  const ua = navigator.userAgent.toLowerCase();
  const isMobileUA =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);

  return hasTouchPoints || hasCoarsePointer || isMobileUA;
}

function detectPencilSupport(): boolean {
  if (typeof window === "undefined") return false;

  // Apple Pencil detection via Pointer Events
  if (navigator.maxTouchPoints > 1) {
    // Check for pointer events with pressure
    if (window.PointerEvent && "pressure" in new PointerEvent("pointerdown")) {
      return true;
    }

    // Touch points > 1 suggests pencil or advanced stylus
    if (navigator.maxTouchPoints > 1) {
      return true;
    }
  }

  return false;
}

function getPointerAccuracy(): "fine" | "coarse" | "none" {
  if (typeof window === "undefined") return "none";

  if (window.matchMedia?.("(pointer: fine)").matches) return "fine";
  if (window.matchMedia?.("(pointer: coarse)").matches) return "coarse";
  if (window.matchMedia?.("(pointer: none)").matches) return "none";

  return "fine"; // default to fine for mouse
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === "undefined") {
      return {
        deviceType: "desktop",
        breakpoint: "lg",
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        isPortable: false,
        windowWidth: 1024,
        windowHeight: 768,
        canHover: true,
        pointerAccuracy: "fine",
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const touchDevice = detectTouchDevice();
    const deviceType = getDeviceType(width, touchDevice);
    const breakpoint = getBreakpoint(width);

    return {
      deviceType,
      breakpoint,
      isMobile: deviceType === "mobile",
      isTablet: deviceType === "tablet",
      isDesktop: deviceType === "desktop",
      isTouchDevice: touchDevice,
      isPortable: deviceType === "mobile" || deviceType === "tablet",
      windowWidth: width,
      windowHeight: height,
      canHover: window.matchMedia?.("(hover: hover)").matches ?? true,
      pointerAccuracy: getPointerAccuracy(),
    };
  });

  useEffect(() => {
    function updateState() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const touchDevice = detectTouchDevice();
      const deviceType = getDeviceType(width, touchDevice);
      const breakpoint = getBreakpoint(width);

      setState({
        deviceType,
        breakpoint,
        isMobile: deviceType === "mobile",
        isTablet: deviceType === "tablet",
        isDesktop: deviceType === "desktop",
        isTouchDevice: touchDevice,
        isPortable: deviceType === "mobile" || deviceType === "tablet",
        windowWidth: width,
        windowHeight: height,
        canHover: window.matchMedia?.("(hover: hover)").matches ?? true,
        pointerAccuracy: getPointerAccuracy(),
      });
    }

    // Initial update
    updateState();

    // Listen for resize
    window.addEventListener("resize", updateState);

    // Listen for orientation change (mobile/tablet)
    window.addEventListener("orientationchange", updateState);

    // Listen for device changes using MediaQueryList
    const touchQuery = window.matchMedia("(pointer: coarse)");
    touchQuery.addEventListener("change", updateState);

    return () => {
      window.removeEventListener("resize", updateState);
      window.removeEventListener("orientationchange", updateState);
      touchQuery.removeEventListener("change", updateState);
    };
  }, []);

  return state;
}

/**
 * Hook for tablet-specific optimizations
 */
export function useTabletOptimizations() {
  const responsive = useResponsive();

  const optimizations = {
    dragSensitivity: responsive.isTablet ? 8 : 5, // Higher for touch
    doubleTapInterval: responsive.isTablet ? 300 : 200,
    longPressDuration: responsive.isTablet ? 500 : 300,
    swipeThreshold: responsive.isTablet ? 50 : 30,
    pencilSupport: responsive.isTablet && detectPencilSupport(),
    autoSaveInterval: responsive.isTablet ? 30000 : 10000, // ms
  };

  return {
    ...responsive,
    ...optimizations,
  };
}

/**
 * Hook for mobile view-only mode
 */
export function useMobileViewMode() {
  const responsive = useResponsive();
  const [isViewOnly, setIsViewOnly] = useState(false);

  useEffect(() => {
    // Automatically enable view-only on mobile
    setIsViewOnly(responsive.isMobile);
  }, [responsive.isMobile]);

  return {
    ...responsive,
    isViewOnly,
    setViewOnly: setIsViewOnly,
    canEdit: !responsive.isMobile,
  };
}

/**
 * Check if current media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * Common media query hooks
 */
export function useIsPortrait() {
  return useMediaQuery("(orientation: portrait)");
}

export function useIsLandscape() {
  return useMediaQuery("(orientation: landscape)");
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function usePrefersDarkMode() {
  return useMediaQuery("(prefers-color-scheme: dark)");
}

// Import useState and useEffect
import { useState, useEffect } from "react";
