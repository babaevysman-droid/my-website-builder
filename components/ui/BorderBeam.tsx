'use client';

import { useEffect, useRef } from 'react';

type BorderBeamProps = {
  children: React.ReactNode;
  className?: string;
  beamColor?: string;
  beamSize?: number;
  duration?: number;
  borderRadius?: number;
};

export default function BorderBeam({
  children,
  className = '',
  beamColor = '#dc2626',
  beamSize = 2,
  duration = 4,
  borderRadius = 24,
}: BorderBeamProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let angle = 0;
    let animationId: number;

    const animate = () => {
      angle = (angle + 1) % 360;
      const rad = (angle * Math.PI) / 180;
      const gradientX1 = 50 + 50 * Math.cos(rad);
      const gradientY1 = 50 + 50 * Math.sin(rad);
      const gradientX2 = 50 - 50 * Math.cos(rad);
      const gradientY2 = 50 - 50 * Math.sin(rad);

      container.style.background = `
        conic-gradient(
          from ${angle}deg at ${gradientX1}% ${gradientY1}%,
          ${beamColor} 0%,
          transparent 25%,
          transparent 75%,
          ${beamColor} 100%
        )
      `;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [beamColor, duration]);

  return (
    <div className={`relative ${className}`}>
      {/* Beam border */}
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: borderRadius + beamSize,
          padding: beamSize,
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />
      {/* Content */}
      <div
        className="relative bg-[#111114] z-10"
        style={{ borderRadius }}
      >
        {children}
      </div>
    </div>
  );
}