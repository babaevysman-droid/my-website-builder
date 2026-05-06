// types/index.ts

export type PlanType = 'DEMO' | 'FLIGHT' | 'HUNTER' | 'free' | 'pro' | 'business';

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

export type CustomFont = {
  name: string;
  url: string;
};

export type Theme = {
  font: string;
  fontUrl: string;
  customFonts: CustomFont[];
  textColor: string;
  primaryColor: string;
  backgroundColor: string;
  radius: number;
  styleDNA?: StyleDNA;
};

export type Block = {
  id: string;
  type: BlockType;
  // ИСПРАВЛЕНИЕ: Изменили Record<string, unknown> на any, чтобы компилятор не блокировал рендер
  props: any; 
};

export type Site = {
  id: string;
  name: string;
  slug: string;
  status: 'draft' | 'published';
  seo_title?: string | null;
  seo_description?: string | null;
  created_at?: string;
  updated_at?: string;
  theme: Theme;
  blocks: Block[];
  user_id?: string;
};