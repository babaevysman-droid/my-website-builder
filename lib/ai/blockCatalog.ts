import { BlockType } from '@/types';

export type AiBlockSchema = {
  type: BlockType;
  purpose: string;
  props: Record<string, string>;
};

export const aiBlockCatalog: AiBlockSchema[] = [
  {
    type: 'header',
    purpose: 'Верхняя навигация сайта',
    props: {
      logo: 'Название бренда',
      links: 'Массив пунктов меню',
      buttonText: 'Текст CTA-кнопки',
    },
  },
  {
    type: 'hero',
    purpose: 'Первый экран лендинга',
    props: {
      eyebrow: 'Короткая надпись над заголовком',
      title: 'Главный заголовок',
      subtitle: 'Подзаголовок',
      buttonText: 'Главная кнопка',
      secondaryButtonText: 'Вторая кнопка',
    },
  },
  {
    type: 'features',
    purpose: 'Преимущества продукта',
    props: {
      title: 'Заголовок секции',
      items: 'Массив преимуществ',
    },
  },
  {
    type: 'pricing',
    purpose: 'Тариф или цена',
    props: {
      title: 'Название тарифа',
      price: 'Цена',
      description: 'Описание тарифа',
    },
  },
  {
    type: 'testimonials',
    purpose: 'Отзывы',
    props: {
      title: 'Заголовок отзывов',
      items: 'Массив отзывов',
    },
  },
  {
    type: 'faq',
    purpose: 'Частые вопросы',
    props: {
      title: 'Заголовок FAQ',
      items: 'Массив вопросов',
    },
  },
  {
    type: 'cta',
    purpose: 'Финальный призыв к действию',
    props: {
      title: 'Заголовок CTA',
      buttonText: 'Текст кнопки',
    },
  },
  {
    type: 'contact',
    purpose: 'Форма заявки',
    props: {
      title: 'Заголовок формы',
      subtitle: 'Описание формы',
      buttonText: 'Текст кнопки',
    },
  },
  {
    type: 'footer',
    purpose: 'Футер сайта',
    props: {
      brand: 'Название бренда',
      description: 'Короткое описание',
      columns: 'Колонки футера',
      links: 'Ссылки футера',
      copyright: 'Копирайт',
    },
  },
];