import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Trash2, Copy, Eye, EyeOff, MoreHorizontal } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { Dropdown } from './Dropdown';

export interface SlideThumbnailProps {
  slideNumber: number;
  isActive?: boolean;
  isSelected?: boolean;
  isHidden?: boolean;
  thumbnail?: string;
  title?: string;
  onClick?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  dragHandleProps?: any;
}

export const SlideThumbnail: React.FC<SlideThumbnailProps> = ({
  slideNumber,
  isActive = false,
  isSelected = false,
  isHidden = false,
  thumbnail,
  title,
  onClick,
  onDuplicate,
  onDelete,
  onToggleVisibility,
  onDragStart,
  onDragEnd,
  dragHandleProps,
}) => {
  const menuItems = [
    {
      id: 'duplicate',
      label: 'Dupliquer',
      icon: <Copy className="w-4 h-4" />,
    },
    {
      id: 'visibility',
      label: isHidden ? 'Afficher' : 'Masquer',
      icon: isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />,
    },
    { id: 'divider', label: '', divider: true },
    {
      id: 'delete',
      label: 'Supprimer',
      icon: <Trash2 className="w-4 h-4" />,
    },
  ];

  const handleMenuSelect = (item: { id: string }) => {
    switch (item.id) {
      case 'duplicate':
        onDuplicate?.();
        break;
      case 'visibility':
        onToggleVisibility?.();
        break;
      case 'delete':
        onDelete?.();
        break;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`
        group relative flex items-start gap-2 p-2 rounded-xl cursor-pointer
        transition-all duration-200
        ${isActive 
          ? 'bg-[#e91e63]/10 ring-2 ring-[#e91e63]' 
          : isSelected
            ? 'bg-[#1e3a5f] ring-1 ring-[#3a5a7f]'
            : 'hover:bg-[#1e3a5f]/50'
        }
      `}
    >
      {/* Drag Handle */}
      <div 
        {...dragHandleProps}
        className="pt-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-gray-500" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Slide Number */}
        <div className="flex items-center justify-between mb-1.5">
          <span className={`
            text-xs font-medium
            ${isActive ? 'text-[#e91e63]' : 'text-gray-500'}
          `}>
            {slideNumber}
          </span>
          {isHidden && (
            <EyeOff className="w-3 h-3 text-gray-500" />
          )}
        </div>

        {/* Thumbnail */}
        <div className={`
          aspect-[16/10] bg-[#0a1628] rounded-lg overflow-hidden border
          ${isActive ? 'border-[#e91e63]/50' : 'border-[#1e3a5f]'}
          ${isHidden ? 'opacity-50' : ''}
        `}>
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={`Slide ${slideNumber}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl font-bold text-[#1e3a5f]">{slideNumber}</span>
            </div>
          )}
        </div>

        {/* Title */}
        {title && (
          <p className="mt-1.5 text-xs text-gray-400 truncate">{title}</p>
        )}
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Dropdown
          trigger={
            <button 
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-[#0a1628] text-gray-400 hover:text-white hover:bg-[#1e3a5f] transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          }
          items={menuItems}
          onSelect={handleMenuSelect}
          align="right"
          width="sm"
        />
      </div>
    </motion.div>
  );
};

export default SlideThumbnail;
