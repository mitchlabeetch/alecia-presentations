import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Plus, 
  LayoutTemplate, 
  ChevronLeft, 
  ChevronRight,
  Layers
} from 'lucide-react';
import { SlideThumbnail } from './SlideThumbnail';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

export interface Slide {
  id: string;
  number: number;
  thumbnail?: string;
  title?: string;
  isHidden?: boolean;
}

export interface SlidePanelProps {
  slides: Slide[];
  activeSlideId?: string;
  selectedSlideIds?: string[];
  onSlideClick?: (slideId: string) => void;
  onSlideReorder?: (newOrder: Slide[]) => void;
  onAddSlide?: () => void;
  onDuplicateSlide?: (slideId: string) => void;
  onDeleteSlide?: (slideId: string) => void;
  onToggleSlideVisibility?: (slideId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SlidePanel: React.FC<SlidePanelProps> = ({
  slides,
  activeSlideId,
  selectedSlideIds = [],
  onSlideClick,
  onSlideReorder,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onToggleSlideVisibility,
  collapsed = false,
  onToggleCollapse,
}) => {
  const [orderedSlides, setOrderedSlides] = useState(slides);

  React.useEffect(() => {
    setOrderedSlides(slides);
  }, [slides]);

  const handleReorder = (newOrder: Slide[]) => {
    setOrderedSlides(newOrder);
    onSlideReorder?.(newOrder);
  };

  if (collapsed) {
    return (
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 48 }}
        className="h-full bg-[#0d1a2d] border-r border-[#1e3a5f] flex flex-col items-center py-4"
      >
        <Tooltip content="Développer le panneau" position="right">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </Tooltip>
        
        <div className="mt-4 flex flex-col items-center gap-2">
          <Tooltip content={`${slides.length} diapositives`} position="right">
            <div className="p-2 rounded-lg text-gray-400">
              <Layers className="w-5 h-5" />
            </div>
          </Tooltip>
          <span className="text-xs text-gray-500 font-medium">{slides.length}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: 280 }}
      className="h-full bg-[#0d1a2d] border-r border-[#1e3a5f] flex flex-col"
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-[#1e3a5f]">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-white">Diapositives</span>
          <span className="text-xs text-gray-500">({slides.length})</span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip content="Ajouter une diapositive" position="bottom">
            <button
              onClick={onAddSlide}
              className="p-2 rounded-lg text-gray-400 hover:text-[#e91e63] hover:bg-[#e91e63]/10 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip content="Réduire" position="bottom">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Slides List */}
      <div className="flex-1 overflow-y-auto p-3">
        <Reorder.Group 
          axis="y" 
          values={orderedSlides} 
          onReorder={handleReorder}
          className="space-y-2"
        >
          <AnimatePresence mode="popLayout">
            {orderedSlides.map((slide, index) => (
              <Reorder.Item
                key={slide.id}
                value={slide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileDrag={{ scale: 1.05, zIndex: 10 }}
              >
                <SlideThumbnail
                  slideNumber={index + 1}
                  isActive={slide.id === activeSlideId}
                  isSelected={selectedSlideIds.includes(slide.id)}
                  isHidden={slide.isHidden}
                  thumbnail={slide.thumbnail}
                  title={slide.title}
                  onClick={() => onSlideClick?.(slide.id)}
                  onDuplicate={() => onDuplicateSlide?.(slide.id)}
                  onDelete={() => onDeleteSlide?.(slide.id)}
                  onToggleVisibility={() => onToggleSlideVisibility?.(slide.id)}
                />
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {/* Add Slide Button at Bottom */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddSlide}
          className="w-full mt-4 p-4 rounded-xl border-2 border-dashed border-[#1e3a5f] text-gray-500 hover:text-[#e91e63] hover:border-[#e91e63]/50 hover:bg-[#e91e63]/5 transition-all flex flex-col items-center gap-2"
        >
          <Plus className="w-6 h-6" />
          <span className="text-sm">Nouvelle diapositive</span>
        </motion.button>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#1e3a5f]">
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          leftIcon={<LayoutTemplate className="w-4 h-4" />}
        >
          Appliquer un modèle
        </Button>
      </div>
    </motion.div>
  );
};

export default SlidePanel;
