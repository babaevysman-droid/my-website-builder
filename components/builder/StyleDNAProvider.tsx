import { Theme } from '@/types';

function getStyleDNA(theme?: Theme) {
  return theme?.styleDNA;
}

export default function StyleDNAProvider({
  theme,
  children,
}: {
  theme?: Theme;
  children: React.ReactNode;
}) {
  const styleDNA = getStyleDNA(theme);
  const palette = styleDNA?.palette;

  return (
    <div
      style={
        {
          '--color-bg': palette?.background || theme?.backgroundColor || '#050505',
          '--color-surface': palette?.surface || '#111111',
          '--color-text': palette?.text || theme?.textColor || '#ffffff',
          '--color-muted': palette?.muted || '#a3a3a3',
          '--color-accent': palette?.accent || theme?.primaryColor || '#7c3aed',
          '--radius-main': `${styleDNA?.radius ?? theme?.radius ?? 28}px`,
          '--font-heading': styleDNA?.headingFont || theme?.font || 'Inter',
          '--font-body': styleDNA?.bodyFont || theme?.font || 'Inter',
          '--gradient-overlay':
            styleDNA?.gradientOverlay ||
            'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.75))',
        } as React.CSSProperties
      }
      className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      {children}
    </div>
  );
}