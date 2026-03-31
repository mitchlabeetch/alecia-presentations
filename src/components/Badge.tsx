import React from 'react';
import { motion } from 'framer-motion';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  dotColor?: string;
  removable?: boolean;
  onRemove?: () => void;
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  dotColor,
  removable = false,
  onRemove,
  pulse = false,
  className = '',
}) => {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-[#1e3a5f] text-gray-300',
    primary: 'bg-[#e91e63]/20 text-[#e91e63] border border-[#e91e63]/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    outline: 'bg-transparent border border-[#3a5a7f] text-gray-400',
  };

  const sizes: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: 'bg-gray-400',
    primary: 'bg-[#e91e63]',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    danger: 'bg-red-400',
    info: 'bg-blue-400',
    outline: 'bg-gray-400',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span 
          className={`
            w-1.5 h-1.5 rounded-full 
            ${dotColor || dotColors[variant]}
            ${pulse ? 'animate-pulse' : ''}
          `} 
        />
      )}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.span>
  );
};

export interface StatusBadgeProps extends Omit<BadgeProps, 'dot' | 'variant'> {
  status: 'online' | 'offline' | 'busy' | 'away';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  ...props
}) => {
  const statusConfig = {
    online: { variant: 'success' as const, label: label || 'En ligne' },
    offline: { variant: 'default' as const, label: label || 'Hors ligne' },
    busy: { variant: 'danger' as const, label: label || 'Occupé' },
    away: { variant: 'warning' as const, label: label || 'Absent' },
  };

  const config = statusConfig[status];

  return (
    <Badge 
      variant={config.variant} 
      dot 
      pulse={status === 'online'}
      {...props}
    >
      {config.label}
    </Badge>
  );
};

export default Badge;
