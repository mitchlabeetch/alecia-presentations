import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize,
  Grid3X3,
  Move,
  MousePointer2,
  Hand
} from 'lucide-react';
import { Tooltip } from './Tooltip';

export interface SlideCanvasProps {
  children?: React.ReactNode;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  slideWidth?: number;
  slideHeight?: number;
  backgroundColor?: string;
  backgroundImage?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onCanvasClick?: () => void;
  editable?: boolean;
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  children,
  zoom = 100,
  onZoomChange,
  minZoom = 25,
  maxZoom = 400,
  showGrid = false,
  onToggleGrid,
  slideWidth = 1280,
  slideHeight = 720,
  backgroundColor = '#ffffff',
  backgroundImage,
  isFullscreen = false,
  onToggleFullscreen,
  onCanvasClick,
  editable = true,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<'select' | 'pan'>('select');

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 25, maxZoom);
    onZoomChange?.(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 25, minZoom);
    onZoomChange?.(newZoom);
  };

  const handleZoomReset = () => {
    onZoomChange?.(100);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta));
      onZoomChange?.(newZoom);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === 'pan' || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsPanning(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const scale = zoom / 100;

  return (
    <div 
      ref={canvasRef}
      className="flex-1 relative overflow-hidden bg-[#080d14]"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={onCanvasClick}
    >
      {/* Grid Background */}
      {showGrid && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #1e3a5f 1px, transparent 1px),
              linear-gradient(to bottom, #1e3a5f 1px, transparent 1px)
            `,
            backgroundSize: `${20 * scale}px ${20 * scale}px`,
          }}
        />
      )}

      {/* Canvas Content */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          cursor: isPanning ? 'grabbing' : tool === 'pan' ? 'grab' : 'default',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: scale }}
          transition={{ duration: 0.2 }}
          className="relative shadow-2xl"
          style={{
            width: slideWidth,
            height: slideHeight,
            backgroundColor,
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {children}
        </motion.div>
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#0d1a2d] rounded-xl border border-[#1e3a5f] p-2 shadow-xl">
        {/* Tool Selection */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#1e3a5f]">
          <Tooltip content="Sélectionner (V)" position="top">
            <button
              onClick={() => setTool('select')}
              className={`
                p-2 rounded-lg transition-colors
                ${tool === 'select' 
                  ? 'bg-[#e91e63]/20 text-[#e91e63]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <MousePointer2 className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Déplacer (H)" position="top">
            <button
              onClick={() => setTool('pan')}
              className={`
                p-2 rounded-lg transition-colors
                ${tool === 'pan' 
                  ? 'bg-[#e91e63]/20 text-[#e91e63]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Hand className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Tooltip content="Zoom arrière" position="top">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= minZoom}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </Tooltip>
          
          <button
            onClick={handleZoomReset}
            className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors min-w-[60px]"
          >
            {zoom}%
          </button>
          
          <Tooltip content="Zoom avant" position="top">
            <button
              onClick={handleZoomIn}
              disabled={zoom >= maxZoom}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-[#1e3a5f]" />

        {/* View Options */}
        <Tooltip content={showGrid ? 'Masquer la grille' : 'Afficher la grille'} position="top">
          <button
            onClick={onToggleGrid}
            className={`
              p-2 rounded-lg transition-colors
              ${showGrid 
                ? 'bg-[#e91e63]/20 text-[#e91e63]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'} position="top">
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </Tooltip>
      </div>

      {/* Zoom Level Indicator (when not 100%) */}
      <AnimatePresence>
        {zoom !== 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-4 right-4 bg-[#0d1a2d] text-gray-300 text-sm px-3 py-1.5 rounded-lg border border-[#1e3a5f]"
          >
            {zoom}%
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlideCanvas;
