import { useState, useCallback, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { AleciaLogo } from '@/components/ui/AleciaLogo';
import type { Slide } from '@/types';

interface SlideCanvasProps {
  slide: Slide;
  isEditing?: boolean;
  onContentChange?: (content: Record<string, unknown>) => void;
}

export function SlideCanvas({
  slide,
  isEditing = true,
  onContentChange,
}: SlideCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 25, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 25, 25));
  }, []);

  const handleZoomFit = useCallback(() => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleZoomFit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut, handleZoomFit]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;
      setPanOffset((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    },
    [isPanning]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const baseWidth = 1280;
  const baseHeight = 720;

  return (
    <div className="h-full flex flex-col p-4">
      {/* Zoom Controls - Compact */}
      <div className="flex-shrink-0 flex items-center justify-center gap-1 mb-3">
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-alecia-silver/20 rounded transition-colors"
          title="Zoom arriere ( - )"
        >
          <ZoomOut className="w-4 h-4 text-alecia-navy" />
        </button>

        <div className="flex items-center px-2 py-1 bg-alecia-silver/10 rounded min-w-[60px] justify-center">
          <span className="text-xs font-medium text-alecia-navy">{zoom}%</span>
        </div>

        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-alecia-silver/20 rounded transition-colors"
          title="Zoom avant ( + )"
        >
          <ZoomIn className="w-4 h-4 text-alecia-navy" />
        </button>

        <div className="w-px h-5 bg-alecia-silver/30 mx-1" />

        <button
          onClick={handleZoomFit}
          className="p-1.5 hover:bg-alecia-silver/20 rounded transition-colors"
          title="Ajuster au zoom 100%"
        >
          <Maximize2 className="w-4 h-4 text-alecia-navy" />
        </button>

        <div className="w-px h-5 bg-alecia-silver/30 mx-1" />

        <button
          onClick={() => {
            setZoom(50);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="p-1.5 hover:bg-alecia-silver/20 rounded transition-colors"
          title="Mode navigation"
        >
          <Move className="w-4 h-4 text-alecia-navy" />
        </button>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden bg-alecia-silver/5 rounded-lg relative border border-alecia-silver/10"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        {/* Centered Slide */}
        <div
          className="absolute top-1/2 left-1/2 transition-transform"
          style={{
            transform: `translate(-50%, -50%) translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
            width: baseWidth,
            height: baseHeight,
          }}
        >
          {/* Slide */}
          <div
            className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden relative"
            style={{
              aspectRatio: `${baseWidth}/${baseHeight}`,
            }}
          >
            {/* Alecia branding strip - top */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-alecia-navy" />

            {/* Content Area */}
            <div className="absolute inset-0 pt-8 pb-16 px-16">
              <BlockRenderer
                slide={slide}
                isEditing={isEditing}
                onBlockSelect={setSelectedBlockId}
                selectedBlockId={selectedBlockId}
                onContentChange={onContentChange}
              />
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 h-12 px-16 flex items-center justify-between border-t border-alecia-silver/20">
              <div className="flex items-center gap-2">
                <AleciaLogo className="h-6 text-alecia-navy" />
                <span className="text-xs text-alecia-silver">
                  Strictement confidentiel
                </span>
              </div>

              <div className="text-sm text-alecia-silver">
                {slide.orderIndex + 1}
              </div>
            </div>

            {/* Selection Border */}
            {isEditing && selectedBlockId && (
              <div className="absolute inset-0 border-2 border-dashed border-alecia-red/50 pointer-events-none" />
            )}
          </div>

          {/* Selection Handles */}
          {isEditing && selectedBlockId && (
            <>
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-alecia-red rounded-sm cursor-nw-resize" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-alecia-red rounded-sm cursor-ne-resize" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-alecia-red rounded-sm cursor-sw-resize" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-alecia-red rounded-sm cursor-se-resize" />
            </>
          )}
        </div>

        {/* Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e6e8ec 1px, transparent 1px),
              linear-gradient(to bottom, #e6e8ec 1px, transparent 1px)
            `,
            backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
            backgroundPosition: `${panOffset.x % (20 * (zoom / 100))}px ${panOffset.y % (20 * (zoom / 100))}px`,
          }}
        />
      </div>

      {/* Slide Info - Compact */}
      <div className="flex-shrink-0 flex items-center justify-between mt-2 text-xs text-alecia-silver px-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-alecia-navy">{slide.title || 'Sans titre'}</span>
          <span className="text-alecia-silver/50">•</span>
          <span className="text-alecia-silver">{slide.type}</span>
        </div>
        <div>
          {baseWidth}x{baseHeight}
        </div>
      </div>
    </div>
  );
}