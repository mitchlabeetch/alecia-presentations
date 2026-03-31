import { useEffect, useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import { SlidePreview } from "./SlidePreview";

interface Theme {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
}

interface Props {
  slides: Doc<"slides">[];
  theme: Theme;
  initialIndex?: number;
  onClose: () => void;
}

export function PresentationMode({ slides, theme, initialIndex = 0, onClose }: Props) {
  const [current, setCurrent] = useState(initialIndex);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setCurrent(c => Math.min(slides.length - 1, c + 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrent(c => Math.max(0, c - 1));
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key === "n" || e.key === "N") {
        setShowNotes(s => !s);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slides.length, onClose]);

  const slide = slides[current];
  if (!slide) return null;

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col select-none">
      {/* Slide area */}
      <div className={`flex-1 flex items-center justify-center px-8 ${showNotes && slide.notes ? "pb-0" : ""}`}>
        <div className="w-full" style={{ maxWidth: "min(1200px, calc(100vw - 64px))", aspectRatio: "16/9", maxHeight: showNotes && slide.notes ? "60vh" : "80vh" }}>
          <SlidePreview slide={slide} theme={theme} />
        </div>
      </div>

      {/* Notes panel */}
      {showNotes && slide.notes && (
        <div className="bg-gray-900 border-t border-gray-700 px-8 py-4 max-h-[25vh] overflow-y-auto">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">📝 Notes du présentateur</p>
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{slide.notes}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 py-4 bg-black/80">
        <button
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-white transition-colors text-lg"
        >
          ←
        </button>
        <div className="flex gap-1.5 max-w-xs overflow-hidden">
          {slides.slice(Math.max(0, current - 5), Math.min(slides.length, current + 6)).map((_, relIdx) => {
            const absIdx = Math.max(0, current - 5) + relIdx;
            return (
              <button
                key={absIdx}
                onClick={() => setCurrent(absIdx)}
                className="rounded-full transition-all flex-shrink-0"
                style={{
                  width: absIdx === current ? "24px" : "8px",
                  height: "8px",
                  background: absIdx === current ? theme.accentColor : "rgba(255,255,255,0.3)",
                }}
              />
            );
          })}
        </div>
        <button
          onClick={() => setCurrent(c => Math.min(slides.length - 1, c + 1))}
          disabled={current === slides.length - 1}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-white transition-colors text-lg"
        >
          →
        </button>
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-sm font-semibold tabular-nums">
            {current + 1} <span className="text-white/40">/</span> {slides.length}
          </span>
          <span className="text-white/50 text-xs truncate max-w-[200px]">{slide.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {slide.notes && (
            <button
              onClick={() => setShowNotes(s => !s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                showNotes ? "bg-white/20 text-white" : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
              }`}
              title="Afficher/masquer les notes (N)"
            >
              📝 Notes
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors text-sm"
            title="Quitter (Échap)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="text-white/25 text-xs">← → pour naviguer · N pour les notes · Échap pour quitter</p>
      </div>
    </div>
  );
}
