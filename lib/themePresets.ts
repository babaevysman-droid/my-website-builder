import { Theme } from '@/types';

export type ThemePreset = {
  id: string;
  name: string;
  description: string;
  theme: Theme;
};

export const themePresets: ThemePreset[] = [
  {
    id: 'dark-premium',
    name: 'Dark Premium',
    description: 'Темный премиальный стиль для SaaS, игр, агентств.',
    theme: {
      font: 'Inter',
      fontUrl: '',
      customFonts: [],
      textColor: '#ffffff',
      primaryColor: '#ff3b30',
      backgroundColor: '#050505',
      radius: 28,
    },
  },
  {
    id: 'clean-saas',
    name: 'Clean SaaS',
    description: 'Светлый аккуратный стиль для продукта или стартапа.',
    theme: {
      font: 'Inter',
      fontUrl: '',
      customFonts: [],
      textColor: '#101010',
      primaryColor: '#2563eb',
      backgroundColor: '#ffffff',
      radius: 20,
    },
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'Жирная типографика, контраст, черно-белый стиль.',
    theme: {
      font: 'Arial',
      fontUrl: '',
      customFonts: [],
      textColor: '#000000',
      primaryColor: '#ff4d00',
      backgroundColor: '#f4f1e8',
      radius: 0,
    },
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Темный стиль с теплым золотым акцентом.',
    theme: {
      font: 'Georgia',
      fontUrl: '',
      customFonts: [],
      textColor: '#f7efe1',
      primaryColor: '#c8a46b',
      backgroundColor: '#12100d',
      radius: 32,
    },
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Киберспорт, турниры, Telegram-проекты.',
    theme: {
      font: 'Inter',
      fontUrl: '',
      customFonts: [],
      textColor: '#ffffff',
      primaryColor: '#a855f7',
      backgroundColor: '#070014',
      radius: 24,
    },
  },
];