import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect?: (item: DropdownItem) => void;
  align?: 'left' | 'right';
  width?: 'auto' | 'sm' | 'md' | 'lg';
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onSelect,
  align = 'left',
  width = 'auto',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const widths = {
    auto: 'w-auto min-w-[160px]',
    sm: 'w-40',
    md: 'w-56',
    lg: 'w-72',
  };

  const alignments = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 mt-2
              ${widths[width]}
              ${alignments[align]}
              bg-[#111d2e] rounded-xl
              border border-[#1e3a5f]
              shadow-xl shadow-black/30
              py-1.5
            `}
          >
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                {item.divider && index > 0 && (
                  <div className="my-1.5 border-t border-[#1e3a5f]" />
                )}
                <button
                  onClick={() => {
                    if (!item.disabled) {
                      onSelect?.(item);
                      setIsOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center justify-between px-4 py-2.5
                    text-sm transition-colors
                    ${item.disabled 
                      ? 'text-gray-600 cursor-not-allowed' 
                      : 'text-gray-300 hover:text-white hover:bg-[#e91e63]/10 cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && (
                      <span className="text-gray-400">{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <span className="text-xs text-gray-500 ml-4">{item.shortcut}</span>
                  )}
                </button>
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full appearance-none bg-[#0d1a2d] border rounded-lg px-4 py-2.5 pr-10
            text-white
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#e91e63]/50
            ${error 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-[#1e3a5f] focus:border-[#e91e63] hover:border-[#3a5a7f]'
            }
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;
