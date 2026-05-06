import { Block, Theme } from '@/types';

export interface SiteTemplate {
  id: string;
  name: string;
  description: string;
  theme: Theme;
  blocks: Block[];
}

export const siteTemplates: SiteTemplate[] = [
  {
    id: 'saas',
    name: 'SaaS Platform',
    description: 'Темная тема. Идеально для технологичного стартапа, нейросети или SaaS-продукта.',
    theme: {
      font: 'Inter',
      fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      customFonts: [],
      textColor: '#F9FAFB', // Светлый текст
      primaryColor: '#3B82F6', // Яркий синий акцент
      backgroundColor: '#0B0F19', // Глубокий темный фон
      radius: 12,
      styleDNA: {
        mood: 'dark-tech',
        density: 'spacious',
        gradientOverlay: 'rgba(59, 130, 246, 0.05)',
        effects: ['glow', 'glass'],
      }
    },
    blocks: [
      {
        id: 'hero-saas',
        type: 'hero',
        props: {
          eyebrow: 'Версия 2.0 уже здесь',
          title: 'Ускорьте рост вашего продукта',
          subtitle: 'Премиальное решение для управления процессами. Автоматизируйте рутину и сфокусируйтесь на главном.',
          buttonText: 'Начать бесплатно',
          secondaryButtonText: 'Документация',
          imageUrl: '',
          backgroundImageUrl: '',
          layoutType: 'split',
        },
      },
      {
        id: 'logos-saas',
        type: 'logos',
        props: {
          title: 'Нам доверяют лидеры рынка',
          logos: ['Acme Corp', 'GlobalTech', 'Quantum', 'Nebula', 'Zenith'],
        },
      },
      {
        id: 'features-saas',
        type: 'features',
        props: {
          title: 'Инструменты нового поколения',
          items: ['Аналитика в реальном времени', 'Умные интеграции', 'Высокая безопасность', 'API для разработчиков'],
        },
      },
      {
        id: 'pricing-saas',
        type: 'pricing',
        props: {
          title: 'Гибкие тарифы',
          description: 'Масштабируйтесь без ограничений. Выберите план, который подходит вашей команде.',
          plans: ['DEMO', 'FLIGHT', 'HUNTER'], // Используем обновленные типы
          buttonText: 'Выбрать тариф',
        },
      },
      {
        id: 'cta-saas',
        type: 'cta',
        props: {
          title: 'Готовы изменить правила игры?',
          buttonText: 'Создать аккаунт',
        },
      },
      {
        id: 'footer-saas',
        type: 'footer',
        props: {
          brand: 'Quantum SaaS',
          description: 'Создаем цифровое будущее для передовых команд по всему миру.',
          columns: ['Продукт', 'Решения', 'Разработчикам'],
          links: ['Политика конфиденциальности', 'Terms of Service', 'Status'],
          copyright: '© 2026 Quantum Inc. Все права защищены.',
        },
      },
    ],
  },
  {
    id: 'portfolio',
    name: 'Creative Portfolio',
    description: 'Минималистичный дизайн в стиле Editorial. Для креативных директоров, студий и фрилансеров.',
    theme: {
      font: 'Playfair Display',
      fontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
      customFonts: [],
      textColor: '#111111',
      primaryColor: '#111111',
      backgroundColor: '#F8F8F8', // Мягкий светлый фон
      radius: 0, // Строгие углы для минимализма
      styleDNA: {
        mood: 'editorial',
        density: 'comfortable',
        typography: 'serif-heavy',
      }
    },
    blocks: [
      {
        id: 'hero-portfolio',
        type: 'hero',
        props: {
          title: 'Визуальное искусство и цифровой дизайн.',
          subtitle: 'Независимый арт-директор. Создаю бренды, которые остаются в памяти.',
          buttonText: 'Связаться со мной',
          layoutType: 'minimal',
        },
      },
      {
        id: 'gallery-portfolio',
        type: 'gallery',
        props: {
          title: 'Избранные проекты',
          images: [], 
          imageQuery: 'minimalist architecture design',
        },
      },
      {
        id: 'contact-portfolio',
        type: 'contact',
        props: {
          title: 'Давайте обсудим вашу идею',
          subtitle: 'Я всегда открыт к новым интересным проектам и коллаборациям.',
          buttonText: 'Отправить сообщение',
          successMessage: 'Спасибо! Я свяжусь с вами в течение дня.',
        },
      },
      {
        id: 'footer-portfolio',
        type: 'footer',
        props: {
          brand: 'Арт-Директор.',
          description: 'Дизайн, стратегия и креативный консалтинг.',
          columns: [],
          links: ['Behance', 'Dribbble', 'Instagram', 'LinkedIn'],
          copyright: '© 2026. Made with passion.',
        },
      },
    ],
  },
  {
    id: 'agency',
    name: 'Digital Agency',
    description: 'Современный и яркий корпоративный сайт. Идеально для digital-агентств и консалтинга.',
    theme: {
      font: 'SF Pro Display', // Apple-style typography
      fontUrl: '', 
      customFonts: [],
      textColor: '#0F172A',
      primaryColor: '#4F46E5', // Индиго
      backgroundColor: '#FFFFFF',
      radius: 24, // Мягкие, круглые формы
      styleDNA: {
        mood: 'clean-modern',
        density: 'tight',
        effects: ['glass'],
      }
    },
    blocks: [
      {
        id: 'header-agency',
        type: 'header',
        props: {
          logo: 'Agency™',
          links: ['Кейсы', 'Услуги', 'О нас', 'Контакты'],
          buttonText: 'Начать проект',
        }
      },
      {
        id: 'hero-agency',
        type: 'hero',
        props: {
          eyebrow: 'Digital Agency',
          title: 'Мы создаём цифровые продукты, которые работают',
          subtitle: 'От стратегии до запуска. Помогаем бизнесу расти с помощью сильного дизайна и передовых технологий.',
          buttonText: 'Бесплатный аудит',
          secondaryButtonText: 'Смотреть кейсы',
          layoutType: 'classic',
        },
      },
      {
        id: 'stats-agency',
        type: 'stats',
        props: {
          title: 'В цифрах',
          items: ['50+ Проектов', '12 Наград', '98% Довольных клиентов', '5 Лет на рынке'],
        },
      },
      {
        id: 'features-agency',
        type: 'features',
        props: {
          title: 'Экспертиза',
          items: ['UX/UI Дизайн', 'Разработка (Next.js)', 'Брендинг', 'Маркетинг и SEO'],
        },
      },
      {
        id: 'footer-agency',
        type: 'footer',
        props: {
          brand: 'Agency™',
          description: 'Трансформируем бизнес через дизайн и технологии.',
          columns: ['Услуги', 'Компания', 'Офис'],
          links: ['Facebook', 'Twitter', 'Privacy Policy'],
          copyright: '© 2026 Agency Digital. Все права защищены.',
        },
      },
    ],
  },
];