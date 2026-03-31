import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'buttons';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
}) => {
  const sizes = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2.5 px-4',
    lg: 'text-base py-3 px-5',
  };

  const variants = {
    default: {
      container: 'bg-[#0d1a2d] rounded-xl p-1 border border-[#1e3a5f]',
      tab: 'rounded-lg transition-all duration-200',
      active: 'bg-[#c9a84c] text-[#0a1628] shadow-sm',
      inactive: 'text-gray-400 hover:text-gray-200 hover:bg-white/5',
    },
    pills: {
      container: 'gap-2',
      tab: 'rounded-full transition-all duration-200 border',
      active: 'bg-[#c9a84c] text-[#0a1628] border-[#c9a84c]',
      inactive:
        'bg-transparent text-gray-400 border-[#1e3a5f] hover:border-[#3a5a7f] hover:text-gray-300',
    },
    underline: {
      container: 'border-b border-[#1e3a5f]',
      tab: 'border-b-2 -mb-px transition-all duration-200 rounded-t-lg',
      active: 'border-[#c9a84c] text-white',
      inactive: 'border-transparent text-gray-400 hover:text-gray-300 hover:border-[#3a5a7f]',
    },
    buttons: {
      container: 'gap-1 bg-[#0d1a2d] p-1 rounded-lg border border-[#1e3a5f]',
      tab: 'rounded-md transition-all duration-200',
      active: 'bg-[#c9a84c] text-[#0a1628]',
      inactive: 'text-gray-400 hover:text-white hover:bg-white/5',
    },
  };

  const style = variants[variant];

  return (
    <div className={`flex ${fullWidth ? 'w-full' : ''} ${style.container}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={`
            relative flex items-center justify-center gap-2 font-medium
            ${fullWidth ? 'flex-1' : ''}
            ${sizes[size]}
            ${style.tab}
            ${activeTab === tab.id ? style.active : style.inactive}
            ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span
              className={`
              ml-1 px-1.5 py-0.5 text-xs rounded-full
              ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#1e3a5f] text-gray-400'}
            `}
            >
              {tab.badge}
            </span>
          )}
          {activeTab === tab.id && variant === 'underline' && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c9a84c]"
              transition={{ duration: 0.2 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isActive: boolean;
  animate?: boolean;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  children,
  isActive,
  animate = true,
  className = '',
  ...props
}) => {
  if (!isActive) return null;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

export interface VerticalTabsProps extends Omit<TabsProps, 'variant'> {
  collapsible?: boolean;
}

export const VerticalTabs: React.FC<VerticalTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  size = 'md',
  collapsible = false,
}) => {
  const sizes = {
    sm: 'text-xs py-2 px-3',
    md: 'text-sm py-3 px-4',
    lg: 'text-base py-4 px-5',
  };

  return (
    <div className="flex flex-col gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={`
            flex items-center gap-3 rounded-lg font-medium text-left
            transition-all duration-200
            ${sizes[size]}
            ${
              activeTab === tab.id
                ? 'bg-[#c9a84c]/10 text-[#c9a84c] border-l-2 border-[#c9a84c]'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-l-2 border-transparent'
            }
            ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
          <span className="flex-1">{tab.label}</span>
          {tab.badge !== undefined && (
            <span
              className={`
              px-2 py-0.5 text-xs rounded-full
              ${
                activeTab === tab.id
                  ? 'bg-[#c9a84c]/20 text-[#c9a84c]'
                  : 'bg-[#1e3a5f] text-gray-400'
              }
            `}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
