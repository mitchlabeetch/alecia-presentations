/**
 * MobileView Component
 * View-only mode for mobile devices with presentation playback
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { PresentationMode } from "./PresentationMode";

interface Slide {
  _id: string;
  title: string;
  content: string;
  notes?: string;
  type: string;
}

interface Theme {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
}

interface MobileViewProps {
  slides: Slide[];
  theme: Theme;
  projectName: string;
  onClose?: () => void;
  /** Share link for the presentation */
  shareUrl?: string;
}

export function MobileView({
  slides,
  theme,
  projectName,
  onClose,
  shareUrl,
}: MobileViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPresentation, setShowPresentation] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Hide controls after inactivity
  useEffect(() => {
    if (!showPresentation) return;

    let timeout: NodeJS.Timeout;
    const resetTimeout = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener("touchstart", resetTimeout);
    window.addEventListener("mousemove", resetTimeout);
    resetTimeout();

    return () => {
      window.removeEventListener("touchstart", resetTimeout);
      window.removeEventListener("mousemove", resetTimeout);
      clearTimeout(timeout);
    };
  }, [showPresentation]);

  // Handle swipe gestures
  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (direction === "left") {
        setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1));
      } else {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    },
    [slides.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          setCurrentIndex((prev) => Math.max(0, prev - 1));
          break;
        case "ArrowRight":
        case "ArrowDown":
        case " ":
          setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1));
          break;
        case "Escape":
          if (showPresentation) {
            setShowPresentation(false);
          } else if (onClose) {
            onClose();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length, showPresentation, onClose]);

  // Request fullscreen
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  }, []);

  // Share functionality
  const handleShare = useCallback(async () => {
    if (navigator.share && shareUrl) {
      try {
        await navigator.share({
          title: projectName,
          text: `Consultez la présentation: ${projectName}`,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          // User cancelled - not an error
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl || window.location.href);
    }
  }, [projectName, shareUrl]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Lien copié dans le presse-papiers!");
    });
  };

  const currentSlide = slides[currentIndex];
  if (!currentSlide) {
    return (
      <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500">Aucune diapositive</p>
      </div>
    );
  }

  // Presentation mode
  if (showPresentation) {
    return (
      <PresentationMode
        slides={slides as any}
        theme={theme}
        initialIndex={currentIndex}
        onClose={() => setShowPresentation(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 flex flex-col select-none">
      {/* Header */}
      <motion.header
        className={clsx(
          "flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10",
          !showControls && "opacity-0 pointer-events-none"
        )}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Fermer"
            >
              ←
            </button>
          )}
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">
              {projectName}
            </h1>
            <span className="text-xs text-gray-500">
              {currentIndex + 1} / {slides.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
            aria-label="Partager"
          >
            📤
          </button>
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
            aria-label={isFullscreen ? "Quitter plein écran" : "Plein écran"}
          >
            {isFullscreen ? "⊡" : "⛶"}
          </button>
        </div>
      </motion.header>

      {/* Main slide view */}
      <div
        className="flex-1 flex items-center justify-center p-4 overflow-hidden"
        onClick={() => setShowControls((prev) => !prev)}
      >
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg"
          style={{ aspectRatio: "16/9" }}
        >
          {/* Slide preview - simplified for mobile */}
          <div
            className="w-full h-full rounded-lg shadow-lg overflow-hidden flex flex-col"
            style={{
              backgroundColor: theme.primaryColor,
              fontFamily: theme.fontFamily,
            }}
          >
            {/* Slide content */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              <h2
                className="text-xl font-bold text-white mb-3"
                style={{ color: "white" }}
              >
                {currentSlide.title}
              </h2>
              <div
                className="text-sm text-white/80 leading-relaxed overflow-hidden"
                style={{ maxHeight: "60%" }}
                dangerouslySetInnerHTML={{
                  __html: currentSlide.content.substring(0, 200),
                }}
              />
            </div>

            {/* Slide footer */}
            <div className="px-6 py-3 flex items-center justify-between border-t border-white/10">
              <span className="text-xs text-white/60">{currentSlide.type}</span>
              <span
                className="text-xs font-semibold"
                style={{ color: theme.accentColor }}
              >
                PitchForge
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation hint */}
      <AnimatePresence>
        {!showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <p className="text-white/50 text-sm bg-black/30 px-4 py-2 rounded-full">
              ← Glisser pour naviguer →
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom navigation */}
      <motion.footer
        className={clsx(
          "bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4 z-10",
          !showControls && "opacity-0 pointer-events-none"
        )}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-4">
          {slides.map((slide, idx) => (
            <button
              key={slide._id}
              onClick={() => setCurrentIndex(idx)}
              className={clsx(
                "rounded-full transition-all",
                idx === currentIndex
                  ? "w-6 h-2"
                  : "w-2 h-2",
                idx === currentIndex ? "" : "bg-gray-300 dark:bg-gray-600"
              )}
              style={{
                width: idx === currentIndex ? "24px" : "8px",
                height: "8px",
                background:
                  idx === currentIndex
                    ? theme.accentColor
                    : undefined,
              }}
              aria-label={`Aller à la diapositive ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() =>
              setCurrentIndex((prev) => Math.max(0, prev - 1))
            }
            disabled={currentIndex === 0}
            className={clsx(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              currentIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
            aria-label="Diapositive précédente"
          >
            ←
          </button>

          <button
            onClick={() => setShowPresentation(true)}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: theme.accentColor }}
            aria-label="Lancer la présentation"
          >
            ▶
          </button>

          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                Math.min(slides.length - 1, prev + 1)
              )
            }
            disabled={currentIndex === slides.length - 1}
            className={clsx(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              currentIndex === slides.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
            aria-label="Diapositive suivante"
          >
            →
          </button>
        </div>

        {/* Slide title */}
        <p className="text-center text-xs text-gray-500 mt-3 truncate">
          {currentSlide.title}
        </p>
      </motion.footer>

      {/* Touch gesture handler */}
      <TouchGestures onSwipe={handleSwipe} />
    </div>
  );
}

/**
 * Touch gesture detection component
 */
function TouchGestures({
  onSwipe,
}: {
  onSwipe: (direction: "left" | "right") => void;
}) {
  const touchStartX = useCallbackRef(0);
  const touchStartY = useCallbackRef(0);
  const isDragging = useCallbackRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    // Only track horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      isDragging.current = false;
      onSwipe(deltaX > 0 ? "right" : "left");
    }
  };

  const onTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="absolute inset-0 z-0"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    />
  );
}

/**
 * Custom hook to store values in refs
 */
function useCallbackRef<T>(initialValue: T) {
  const ref = React.useRef<T>(initialValue);
  ref.current = initialValue;
  return ref;
}

/**
 * Mobile slide list component
 */
export function MobileSlideList({
  slides,
  activeIndex,
  onIndexChange,
}: {
  slides: Slide[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  theme: Theme;
}) {
  return (
    <div className="w-full overflow-x-auto py-2 px-4">
      <div className="flex gap-3">
        {slides.map((slide, idx) => (
          <button
            key={slide._id}
            onClick={() => onIndexChange(idx)}
            className={clsx(
              "flex-shrink-0 w-24 h-16 rounded-lg border-2 transition-all flex flex-col items-center justify-center p-1",
              idx === activeIndex
                ? "border-[#1a3a5c] bg-[#1a3a5c]/5"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
            )}
            aria-label={`Diapositive ${idx + 1}: ${slide.title}`}
            aria-current={idx === activeIndex ? "true" : undefined}
          >
            <span className="text-[10px] font-bold text-gray-400">
              {idx + 1}
            </span>
            <span className="text-[9px] text-gray-600 dark:text-gray-300 truncate max-w-full px-1">
              {slide.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Offline indicator banner
 */
export function OfflineBanner() {
  const [isOffline, setIsOffline] = React.useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  React.useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-amber-500 text-white px-4 py-2 text-sm text-center"
      role="alert"
    >
      ⚠️ Vous êtes hors ligne. Les modifications seront synchronisées automatiquement.
    </motion.div>
  );
}
