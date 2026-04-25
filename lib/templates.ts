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
    name: 'SaaS Landing',
    description: 'Для стартапа, приложения или онлайн-сервиса.',
    theme: {
      font: 'Inter',
      primaryColor: '#111827',
      backgroundColor: '#ffffff',
    },
    blocks: [
      {
        id: 'hero-saas',
        type: 'hero',
        props: {
          title: 'Запусти SaaS быстрее',
          subtitle:
            'Современный лендинг для продукта, сервиса или стартапа. Собери страницу без кода за минуты.',
          buttonText: 'Начать бесплатно',
          secondaryButtonText: 'Смотреть демо',
          imageUrl: '',
          backgroundImageUrl: '',
        },
      },
      {
        id: 'features-saas',
        type: 'features',
        props: {
          title: 'Почему выбирают нас',
          items: ['Быстрый запуск', 'Гибкий редактор', 'Готовые блоки'],
        },
      },
      {
        id: 'pricing-saas',
        type: 'pricing',
        props: {
          title: 'Простой тариф',
          price: '1990 ₽/мес',
          description: 'Всё нужное для запуска и роста проекта.',
        },
      },
      {
        id: 'contact-saas',
        type: 'contact',
        props: {
          title: 'Хочешь попробовать?',
          subtitle: 'Оставь заявку, и мы свяжемся с тобой.',
          buttonText: 'Отправить заявку',
        },
      },
      {
        id: 'footer-saas',
        type: 'footer',
        props: {
          text: '© 2026 SaaS Landing. Все права защищены.',
        },
      },
    ],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Для дизайнера, разработчика, фотографа или фрилансера.',
    theme: {
      font: 'Georgia',
      primaryColor: '#18181b',
      backgroundColor: '#fafafa',
    },
    blocks: [
      {
        id: 'hero-portfolio',
        type: 'hero',
        props: {
          title: 'Привет, я создаю сильные визуальные проекты',
          subtitle:
            'Портфолио для презентации работ, услуг и личного бренда.',
          buttonText: 'Связаться',
          secondaryButtonText: 'Посмотреть работы',
          imageUrl: '',
          backgroundImageUrl: '',
        },
      },
      {
        id: 'gallery-portfolio',
        type: 'gallery',
        props: {
          title: 'Мои работы',
          images: [],
        },
      },
      {
        id: 'features-portfolio',
        type: 'features',
        props: {
          title: 'Что я делаю',
          items: ['Дизайн', 'Разработка', 'Брендинг'],
        },
      },
      {
        id: 'contact-portfolio',
        type: 'contact',
        props: {
          title: 'Обсудим проект?',
          subtitle: 'Расскажи о задаче, и я отвечу в ближайшее время.',
          buttonText: 'Написать',
        },
      },
      {
        id: 'footer-portfolio',
        type: 'footer',
        props: {
          text: '© 2026 Portfolio.',
        },
      },
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Для студии, агентства или команды услуг.',
    theme: {
      font: 'Inter',
      primaryColor: '#0f172a',
      backgroundColor: '#f8fafc',
    },
    blocks: [
      {
        id: 'hero-agency',
        type: 'hero',
        props: {
          title: 'Мы создаём сайты, которые продают',
          subtitle:
            'Агентство полного цикла: стратегия, дизайн, разработка и запуск.',
          buttonText: 'Получить консультацию',
          secondaryButtonText: 'Наши кейсы',
          imageUrl: '',
          backgroundImageUrl: '',
        },
      },
      {
        id: 'features-agency',
        type: 'features',
        props: {
          title: 'Наши услуги',
          items: ['Лендинги', 'Интернет-магазины', 'SaaS интерфейсы'],
        },
      },
      {
        id: 'gallery-agency',
        type: 'gallery',
        props: {
          title: 'Кейсы',
          images: [],
        },
      },
      {
        id: 'cta-agency',
        type: 'cta',
        props: {
          title: 'Готовы обсудить ваш проект?',
          buttonText: 'Оставить заявку',
        },
      },
      {
        id: 'footer-agency',
        type: 'footer',
        props: {
          text: '© 2026 Agency Studio.',
        },
      },
    ],
  },
];