'use client';

import { motion } from 'framer-motion';

type ShinyButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost';
};

export default function ShinyButton({
  children,
  onClick,
  href,
  className = '',
  variant = 'primary',
}: ShinyButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm overflow-hidden transition-all duration-300';

  const variants = {
    primary: 'bg-red-600 text-white hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]',
    outline: 'border border-white/20 text-white hover:border-white/40 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]',
    ghost: 'text-white/70 hover:text-white hover:bg-white/5',
  };

  const buttonContent = (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: '200%', opacity: 0.3 }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', repeatDelay: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
      />
    </motion.button>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {buttonContent}
      </a>
    );
  }

  return buttonContent;
}