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

  // Handle zoom
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

  // Handle keyboard shortcuts
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

  // Handle panning
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

  // Calculate slide dimensions (16:9 aspect ratio)
  const baseWidth = 1280;
  const baseHeight = 720;
  const scaledWidth = (baseWidth * zoom) / 100;
  const scaledHeight = (baseHeight * zoom) / 100;

  return (
    <div className="h-full flex flex-col">
      {/* Zoom Controls */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors"
          title="Zoom arrière ( - )"
        >
          <ZoomOut className="w-5 h-5 text-alecia-navy" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1 bg-alecia-silver/10 rounded-lg">
          <span className="text-sm font-medium text-alecia-navy w-12 text-center">
            {zoom}%
          </span>
        </div>

        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors"
          title="Zoom avant ( + )"
        >
          <ZoomIn className="w-5 h-5 text-alecia-navy" />
        </button>

        <div className="w-px h-6 bg-alecia-silver/30 mx-2" />

        <button
          onClick={handleZoomFit}
          className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors"
          title="Ajuster au zoom 100%"
        >
          <Maximize2 className="w-5 h-5 text-alecia-navy" />
        </button>

        <div className="w-px h-6 bg-alecia-silver/30 mx-2" />

        <button
          onClick={() => {
            setZoom(50);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors"
          title="Mode navigation"
        >
          <Move className="w-5 h-5 text-alecia-navy" />
        </button>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden bg-alecia-silver/10 rounded-xl relative"
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
              {/* Block Renderer */}
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
              {/* Logo */}
              <div className="flex items-center gap-2">
                <AleciaLogo className="h-6 text-alecia-navy" />
                <span className="text-xs text-alecia-silver">
                  Strictement confidentiel
                </span>
              </div>

              {/* Page Number */}
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

      {/* Slide Info */}
      <div className="flex items-center justify-between mt-4 text-sm text-alecia-silver">
        <div>
          <span className="font-medium text-alecia-navy">{slide.title || 'Sans titre'}</span>
          <span className="mx-2">•</span>
          <span>Type: {slide.type}</span>
        </div>
        <div>
          {zoom}% • {baseWidth} x {baseHeight}px
        </div>
      </div>
    </div>
  );
}
