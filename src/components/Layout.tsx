import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar, SidebarSection } from './Sidebar';
import { Header, Collaborator } from './Header';

export interface LayoutProps {
  children: React.ReactNode;
  activeSection?: SidebarSection;
  onSectionChange?: (section: SidebarSection) => void;
  headerProps?: Omit<React.ComponentProps<typeof Header>, 'onOpenChat'>;
  showSidebar?: boolean;
  showHeader?: boolean;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onOpenChat?: () => void;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeSection = 'presentations',
  onSectionChange,
  headerProps,
  showSidebar = true,
  showHeader = true,
  sidebarCollapsed = false,
  onToggleSidebar,
  onOpenChat,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(sidebarCollapsed);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onToggleSidebar?.();
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex">
      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02]">
          <span className="text-[800px] font-bold text-white leading-none select-none">&</span>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange || (() => {})}
          collapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        {/* Header */}
        {showHeader && (
          <Header
            {...headerProps}
            onOpenChat={onOpenChat}
          />
        )}

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`
            flex-1 overflow-auto
            ${className}
          `}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'full',
  padding = 'md',
  className = '',
  ...props
}) => {
  const maxWidths = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div 
      className={`
        mx-auto w-full
        ${maxWidths[maxWidth]}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
}) => {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-[#e91e63] transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className={index === breadcrumbs.length - 1 ? 'text-gray-300' : ''}>
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-gray-400 mt-2">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
