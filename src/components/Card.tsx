import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  className = '',
  onClick,
}) => {
  const baseStyles = 'rounded-xl overflow-hidden transition-all duration-300';
  
  const variants = {
    default: 'bg-[#111d2e] border border-[#1e3a5f]/50',
    outlined: 'bg-transparent border border-[#3a5a7f]',
    elevated: 'bg-[#111d2e] shadow-xl shadow-black/20 border border-[#1e3a5f]/30',
  };
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  return (
    <motion.div
      whileHover={hoverable || clickable ? { 
        y: -4, 
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        borderColor: 'rgba(233, 30, 99, 0.3)'
      } : undefined}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${clickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
}) => (
  <div className={`flex items-start justify-between mb-4 ${className}`}>
    <div className="flex-1 min-w-0">
      {title && (
        <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
      )}
      {subtitle && (
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
      )}
      {children}
    </div>
    {action && (
      <div className="ml-4 flex-shrink-0">{action}</div>
    )}
  </div>
);

export interface CardContentProps {
  children?: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
}) => (
  <div className={`text-gray-300 ${className}`}>
    {children}
  </div>
);

export interface CardFooterProps {
  align?: 'left' | 'center' | 'right' | 'between';
  children?: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  align = 'between',
  className = '',
}) => {
  const alignments = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div className={`flex items-center ${alignments[align]} mt-4 pt-4 border-t border-[#1e3a5f]/50 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
