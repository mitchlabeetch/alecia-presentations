import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 300,
  maxWidth = '200px',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#1e3a5f]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1e3a5f]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#1e3a5f]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#1e3a5f]',
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 pointer-events-none
              ${positions[position]}
            `}
          >
            <div 
              className="bg-[#1e3a5f] text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-[#3a5a7f] whitespace-nowrap"
              style={{ maxWidth }}
            >
              {content}
            </div>
            <div 
              className={`
                absolute w-0 h-0 
                border-4 border-transparent
                ${arrows[position]}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface IconTooltipProps extends Omit<TooltipProps, 'children'> {
  icon: React.ReactNode;
  iconClassName?: string;
}

export const IconTooltip: React.FC<IconTooltipProps> = ({
  icon,
  iconClassName = '',
  ...props
}) => (
  <Tooltip {...props}>
    <span className={`inline-flex items-center justify-center ${iconClassName}`}>
      {icon}
    </span>
  </Tooltip>
);

export default Tooltip;
