import { Block, BlockType, Theme, StyleDNA } from '@/types';

const allowedTypes: BlockType[] = [
  'header',
  'hero',
  'features',
  'pricing',
  'testimonials',
  'faq',
  'logos',
  'stats',
  'cta',
  'gallery',
  'contact',
  'footer',
];

// Добавь эту функцию в файл
export function normalizeNavLinks(links: unknown): string[] {
  if (!Array.isArray(links)) return [];
  
  return links.map((link) => {
    // Если это строка — возвращаем как есть
    if (typeof link === 'string') return link;
    
    // Если это объект — извлекаем текст
    if (link && typeof link === 'object') {
      const obj = link as Record<string, unknown>;
      return String(obj.label || obj.text || obj.title || obj.name || "Ссылка");
    }
    
    return "Ссылка";
  });
}

function isBlockType(value: string): value is BlockType {
  return allowedTypes.includes(value as BlockType);
}

function normalizeProps(props: unknown): Record<string, unknown> {
  if (!props || typeof props !== 'object' || Array.isArray(props)) return {};
  return props as Record<string, unknown>;
}

function text(value: unknown, fallback = '') {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
}

function number(value: unknown, fallback: number) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function normalizeStyleDNA(raw: unknown): StyleDNA {
  const dna =
    raw && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  const paletteRaw =
    dna.palette && typeof dna.palette === 'object' && !Array.isArray(dna.palette)
      ? (dna.palette as Record<string, unknown>)
      : {};

  return {
    mood: text(dna.mood, 'premium'),
    headingFont: text(dna.headingFont, 'Inter'),
    bodyFont: text(dna.bodyFont, 'Inter'),
    palette: {
      background: text(paletteRaw.background, '#050505'),
      surface: text(paletteRaw.surface, '#111111'),
      text: text(paletteRaw.text, '#ffffff'),
      muted: text(paletteRaw.muted, '#a3a3a3'),
      accent: text(paletteRaw.accent, '#7c3aed'),
    },
    radius: number(dna.radius, 28),
    typography: text(dna.typography, 'premium'),
    effects: Array.isArray(dna.effects) ? dna.effects.map(String) : [],
    density: text(dna.density, 'spacious'),
    gradientOverlay: text(
      dna.gradientOverlay,
      'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.75))'
    ),
  };
}

export function normalizeAiBlocks(rawBlocks: unknown): Block[] {
  if (!Array.isArray(rawBlocks)) return [];

  return rawBlocks
    .map((rawBlock) => {
      if (!rawBlock || typeof rawBlock !== 'object') return null;

      const item = rawBlock as {
        type?: unknown;
        props?: unknown;
      };

      const type = String(item.type ?? '').toLowerCase();

      if (!isBlockType(type)) return null;

      const rawProps = normalizeProps(item.props);
      
      // 🔥 НОРМАЛИЗУЕМ ССЫЛКИ В HEADER
      if (type === 'header' && rawProps.links) {
        rawProps.links = normalizeNavLinks(rawProps.links);
      }
      
      // 🔥 НОРМАЛИЗУЕМ ССЫЛКИ В FOOTER
      if (type === 'footer') {
        if (rawProps.links) {
          rawProps.links = normalizeNavLinks(rawProps.links);
        }
        if (rawProps.columns) {
          rawProps.columns = normalizeNavLinks(rawProps.columns);
        }
      }

      return {
        id: crypto.randomUUID(),
        type,
        props: rawProps,
      };
    })
    .filter(Boolean) as Block[];
}

export function normalizeAiTheme(rawTheme: unknown, rawStyleDNA?: unknown): Theme {
  const theme =
    rawTheme && typeof rawTheme === 'object'
      ? (rawTheme as Partial<Theme> & Record<string, unknown>)
      : {};

  const styleDNA = normalizeStyleDNA(rawStyleDNA || theme.styleDNA);

  return {
    font: text(theme.font || theme.bodyFont, styleDNA.bodyFont || 'Inter'),
    fontUrl: text(theme.fontUrl, ''),
    customFonts: Array.isArray(theme.customFonts) ? theme.customFonts : [],
    textColor: text(theme.textColor, styleDNA.palette?.text || '#ffffff'),
    primaryColor: text(
      theme.primaryColor || theme.accentColor,
      styleDNA.palette?.accent || '#7c3aed'
    ),
    backgroundColor: text(
      theme.backgroundColor,
      styleDNA.palette?.background || '#050505'
    ),
    radius: number(theme.radius, styleDNA.radius || 28),
    styleDNA,
  };
}