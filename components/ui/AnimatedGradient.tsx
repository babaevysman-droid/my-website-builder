'use client';

type AnimatedGradientProps = {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
};

export default function AnimatedGradient({
  children,
  className = '',
  gradient = 'from-red-600/20 via-violet-600/20 to-blue-600/20',
}: AnimatedGradientProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Анимированный градиентный фон */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} animate-gradient-x`}
        style={{
          backgroundSize: '200% 200%',
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 8s ease infinite;
        }
      `}</style>
    </div>
  );
}