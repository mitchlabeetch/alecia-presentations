import React from 'react';
import { motion } from 'framer-motion';
import { 
  Presentation, 
  LayoutTemplate, 
  Library, 
  Variable, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Tooltip } from './Tooltip';

export type SidebarSection = 'presentations' | 'templates' | 'library' | 'variables' | 'settings';

export interface SidebarProps {
  activeSection: SidebarSection;
  onSectionChange: (section: SidebarSection) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  id: SidebarSection;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  collapsed = false,
  onToggleCollapse,
}) => {
  const navItems: NavItem[] = [
    { 
      id: 'presentations', 
      label: 'Présentations', 
      icon: <Presentation className="w-5 h-5" />,
      badge: 3
    },
    { 
      id: 'templates', 
      label: 'Modèles', 
      icon: <LayoutTemplate className="w-5 h-5" />,
    },
    { 
      id: 'library', 
      label: 'Bibliothèque', 
      icon: <Library className="w-5 h-5" />,
    },
    { 
      id: 'variables', 
      label: 'Variables', 
      icon: <Variable className="w-5 h-5" />,
    },
    { 
      id: 'settings', 
      label: 'Paramètres', 
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-full bg-[#0a1628] border-r border-[#1e3a5f] flex flex-col relative z-20"
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-[#1e3a5f]">
        <motion.div 
          className="flex items-center gap-3 overflow-hidden"
          animate={{ opacity: collapsed ? 0 : 1 }}
        >
          <span className="text-2xl font-bold text-white tracking-tight">
            alecia
          </span>
        </motion.div>
        {collapsed && (
          <span className="text-xl font-bold text-[#e91e63]">a</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const buttonContent = (
            <button
              onClick={() => onSectionChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl
                transition-all duration-200 group
                ${isActive 
                  ? 'bg-[#e91e63]/10 text-[#e91e63]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <span className={`
                transition-colors
                ${isActive ? 'text-[#e91e63]' : 'text-gray-400 group-hover:text-white'}
              `}>
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`
                      px-2 py-0.5 text-xs rounded-full
                      ${isActive 
                        ? 'bg-[#e91e63]/20 text-[#e91e63]' 
                        : 'bg-[#1e3a5f] text-gray-400'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-1 h-5 bg-[#e91e63] rounded-full"
                />
              )}
            </button>
          );

          return collapsed ? (
            <Tooltip key={item.id} content={item.label} position="right">
              {buttonContent}
            </Tooltip>
          ) : (
            <React.Fragment key={item.id}>
              {buttonContent}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-[#1e3a5f]">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Réduire</span>
            </div>
          )}
        </button>
      </div>

      {/* Ampersand Watermark */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none opacity-[0.03]">
        <span className="text-[200px] font-bold text-white leading-none">&</span>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
