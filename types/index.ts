export type BlockType =
  | 'header'
  | 'hero'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'faq'
  | 'logos'
  | 'stats'
  | 'cta'
  | 'gallery'
  | 'contact'
  | 'footer';

export type StyleDNA = {
  mood?: string;
  headingFont?: string;
  bodyFont?: string;
  palette?: {
    background?: string;
    surface?: string;
    text?: string;
    muted?: string;
    accent?: string;
  };
  radius?: number;
  typography?: string;
  effects?: string[];
  density?: string;
  gradientOverlay?: string;
};

export type Theme = {
  font: string;
  fontUrl?: string;
  customFonts?: string[];
  textColor: string;
  primaryColor: string;
  backgroundColor: string;
  radius: number;
  styleDNA?: StyleDNA;
};

export type Block = {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
};

export type Site = {
  id: string;
  name: string;
  slug?: string;
  theme: Theme;
  blocks: Block[];
};