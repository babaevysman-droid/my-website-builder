'use client';

import { motion } from 'framer-motion';

type GlowCardProps = {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
};

export default function GlowCard({
  children,
  className = '',
  glowColor = '#dc2626',
}: GlowCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#111114] p-6 ${className}`}
    >
      <div
        className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}22, transparent 40%)` }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}