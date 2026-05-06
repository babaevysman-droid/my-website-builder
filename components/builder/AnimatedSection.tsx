'use client';

import { motion, Variants } from 'framer-motion';
import { AnimationIntensity, getAnimation } from '@/lib/animations';

type AnimatedSectionProps = {
  children: React.ReactNode;
  animation?: string;
  intensity?: AnimationIntensity;
  delay?: number;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
  once?: boolean;
};

export default function AnimatedSection({
  children,
  animation = 'fade-in-up',
  intensity = 'medium',
  delay = 0,
  threshold = 0.2,
  className,
  style,
  once = true,
}: AnimatedSectionProps) {
  const config = getAnimation(animation);
  const variants: Variants = {
    hidden: config.variants.hidden,
    visible: typeof config.variants.visible === 'function'
      ? (config.variants.visible as Function)(intensity, delay)
      : config.variants.visible,
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: `-${Math.round(threshold * 100)}px` }}
      variants={variants}
      transition={{ delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}