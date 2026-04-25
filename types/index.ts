export type PlanType = 'free' | 'pro' | 'business';

export interface UserProfile {
  id: string;
  email: string;
  plan: PlanType;
  created_at: string;
}

export type BlockType =
  | 'hero'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'cta'
  | 'faq'
  | 'gallery'
  | 'footer'
  | 'contact';

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, any>;
}



export interface Theme {
  font: string;
  primaryColor: string;
  backgroundColor: string;
}

export interface Site {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  status: 'draft' | 'published';
  theme: Theme;
  blocks: Block[];
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  site_id: string;
  data: Record<string, string>;
  created_at: string;
  
}