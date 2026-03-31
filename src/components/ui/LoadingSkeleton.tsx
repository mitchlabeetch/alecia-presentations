/**
 * Loading Skeleton Component
 * Animated loading placeholders with alecia-navy brand colors
 */

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "wave",
}: SkeletonProps) {
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-xl",
  };

  const baseClasses = clsx(
    "bg-alecia-navy-lighter/50 dark:bg-alecia-navy-light",
    variantClasses[variant],
    animation === "pulse" && "animate-pulse",
    animation === "wave" && "animate-pulse",
    className
  );

  return (
    <div
      className={baseClasses}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}

// Preset skeleton layouts
export function SlideSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton variant="rectangular" height={180} className="w-full" />
      <Skeleton variant="text" height={20} width="60%" />
      <Skeleton variant="text" height={16} width="40%" />
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-alecia-navy-light rounded-xl p-4 space-y-3 border border-alecia-navy-lighter/30">
      <Skeleton variant="rectangular" height={100} />
      <Skeleton variant="text" height={20} width="70%" />
      <div className="flex gap-2">
        <Skeleton variant="text" height={14} width={60} />
        <Skeleton variant="text" height={14} width={80} />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" height={14} width={100} />
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="space-y-2 p-3">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={28} height={28} />
        <Skeleton variant="text" height={14} width={100} />
      </div>
      <Skeleton variant="text" height={14} className="ml-10" />
      <Skeleton variant="text" height={14} width="80%" className="ml-10" />
    </div>
  );
}

export function SlidePanelSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-2 p-2">
          <Skeleton variant="rectangular" width={20} height={36} />
          <div className="flex-1 space-y-1">
            <Skeleton variant="rectangular" height={50} />
            <Skeleton variant="text" height={12} width="50%" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Animated loading spinner with alecia-pink
export function LoadingSpinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <motion.div
      className={clsx(
        "border-2 border-alecia-navy-lighter border-t-alecia-pink rounded-full",
        sizes[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

// Full page loading state
export function LoadingScreen({ message = "Chargement..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-alecia-navy/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-alecia-gray-400 text-sm">{message}</p>
    </div>
  );
}

// Button press animation wrapper
export function Pressable({
  children,
  onPress,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <motion.button
      className={clsx(
        "transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      whileTap={disabled ? {} : { scale: 0.98 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      onClick={onPress}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

// Success animation with alecia-gold
export function SuccessAnimation({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="flex items-center gap-3 bg-alecia-gold/20 text-alecia-gold px-4 py-3 rounded-lg shadow-lg border border-alecia-gold/30"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="text-lg"
      >
        ✓
      </motion.span>
      <span className="font-medium">{message}</span>
    </motion.div>
  );
}

// Error animation with brand error color
export function ErrorAnimation({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="flex items-center gap-3 bg-red-500/20 text-red-400 px-4 py-3 rounded-lg shadow-lg border border-red-500/30"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="text-lg"
      >
        ✕
      </motion.span>
      <span className="font-medium">{message}</span>
    </motion.div>
  );
}

export default {
  Skeleton,
  SlideSkeleton,
  ProjectCardSkeleton,
  CommentSkeleton,
  SlidePanelSkeleton,
  LoadingSpinner,
  LoadingScreen,
  Pressable,
  SuccessAnimation,
  ErrorAnimation,
};
