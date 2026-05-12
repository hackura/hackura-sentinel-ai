'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`
        bg-zinc-900/40 backdrop-blur-xl border border-zinc-700/50
        rounded-lg md:rounded-xl p-4 md:p-6 transition-all duration-300
        ${hover ? 'hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

interface RiskBadgeProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  className?: string;
}

export function RiskBadge({ level, className = '' }: RiskBadgeProps) {
  const colors = {
    LOW: 'bg-green-900/30 text-green-300 border-green-700/50',
    MEDIUM: 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50',
    HIGH: 'bg-red-900/30 text-red-300 border-red-700/50',
  };

  return (
    <span className={`
      px-3 py-1 rounded-full text-sm font-medium border
      ${colors[level]} ${className}
    `}>
      {level}
    </span>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={`
        rounded-lg font-medium transition-all duration-200 disabled:opacity-50
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {loading ? 'Loading...' : children}
    </motion.button>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizes[size]} border-2 border-purple-500/30 border-t-purple-500 rounded-full`}
    />
  );
}
