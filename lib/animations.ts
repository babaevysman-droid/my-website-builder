import { Variants, Transition } from 'framer-motion';

// ============================================================
// ТИПЫ
// ============================================================

export type AnimationCategory = 'entrances' | 'attention' | 'stagger' | 'special';

export type AnimationIntensity = 'low' | 'medium' | 'high';

export type AnimationConfig = {
  name: string;
  category: AnimationCategory;
  variants: Variants;
  description: string;
  usage: string[];
};

export type AnimationRegistry = Record<string, AnimationConfig>;

// ============================================================
// ХЕЛПЕРЫ
// ============================================================

function transition(intensity: AnimationIntensity, extra: Partial<Transition> = {}): Transition {
  const durations = { low: 0.8, medium: 0.5, high: 0.3 };
  const springs = { low: { stiffness: 80, damping: 25 }, medium: { stiffness: 150, damping: 20 }, high: { stiffness: 300, damping: 15 } };
  return { duration: durations[intensity], ease: 'easeOut', ...extra };
}

// ============================================================
// ENTRANCES (15+)
// ============================================================

const entrances: AnimationConfig[] = [
  {
    name: 'fade-in',
    category: 'entrances',
    description: 'Плавное появление из прозрачности',
    usage: ['Универсальный', 'Для текста', 'Для изображений'],
    variants: {
      hidden: { opacity: 0 },
      visible: (intensity: AnimationIntensity = 'medium') => ({ opacity: 1, transition: transition(intensity) }),
    },
  },
  {
    name: 'fade-in-up',
    category: 'entrances',
    description: 'Появление снизу вверх',
    usage: ['Hero-заголовки', 'Секции контента', 'Формы'],
    variants: {
      hidden: { opacity: 0, y: 60 },
      visible: (intensity: AnimationIntensity = 'medium') => ({ opacity: 1, y: 0, transition: transition(intensity) }),
    },
  },
  {
    name: 'fade-in-down',
    category: 'entrances',
    description: 'Появление сверху вниз',
    usage: ['Header', 'Навигация', 'Уведомления'],
    variants: {
      hidden: { opacity: 0, y: -60 },
      visible: (intensity: AnimationIntensity = 'medium') => ({ opacity: 1, y: 0, transition: transition(intensity) }),
    },
  },
  {
    name: 'fade-in-left',
    category: 'entrances',
    description: 'Появление слева направо',
    usage: ['Боковые панели', 'Изображения', 'Списки'],
    variants: {
      hidden: { opacity: 0, x: -80 },
      visible: (intensity: AnimationIntensity = 'medium') => ({ opacity: 1, x: 0, transition: transition(intensity) }),
    },
  },
  {
    name: 'fade-in-right',
    category: 'entrances',
    description: 'Появление справа налево',
    usage: ['Боковые панели', 'CTA-кнопки', 'Иконки'],
    variants: {
      hidden: { opacity: 0, x: 80 },
      visible: (intensity: AnimationIntensity = 'medium') => ({ opacity: 1, x: 0, transition: transition(intensity) }),
    },
  },
  {
    name: 'blur-in',
    category: 'entrances',
    description: 'Появление из размытия',
    usage: ['Премиум-секции', 'Главные заголовки', 'Фоны'],
    variants: {
      hidden: { opacity: 0, filter: 'blur(20px)', scale: 1.05 },
      visible: (intensity: AnimationIntensity = 'medium') => ({ opacity: 1, filter: 'blur(0px)', scale: 1, transition: transition(intensity, { duration: 1 }) }),
    },
  },
  {
    name: 'blur-in-up',
    category: 'entrances',
    description: 'Размытие + подъём',
    usage: ['Hero-секции', 'Главный контент'],
    variants: {
      hidden: { opacity: 0, filter: 'blur(15px)', y: 40 },
      visible: (intensity: AnimationIntensity = 'medium') => ({ opacity: 1, filter: 'blur(0px)', y: 0, transition: transition(intensity, { duration: 0.9 }) }),
    },
  },
  {
    name: 'scale-in',
    category: 'entrances',
    description: 'Раскрытие из центра',
    usage: ['Модальные окна', 'Карточки', 'Изображения'],
    variants: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: (intensity: AnimationIntensity = 'medium') => ({ opacity: 1, scale: 1, transition: transition(intensity) }),
    },
  },
  {
    name: 'scale-in-spring',
    category: 'entrances',
    description: 'Пружинистое раскрытие',
    usage: ['CTA-кнопки', 'Попапы', 'Формы'],
    variants: {
      hidden: { opacity: 0, scale: 0.6 },
      visible: (intensity: AnimationIntensity = 'medium') => ({
        opacity: 1, scale: 1,
        transition: {
          type: 'spring',
          stiffness: intensity === 'high' ? 400 : intensity === 'medium' ? 250 : 120,
          damping: intensity === 'high' ? 20 : intensity === 'medium' ? 18 : 14,
        },
      }),
    },
  },
  {
    name: 'bounce-in',
    category: 'entrances',
    description: 'Отскок при появлении',
    usage: ['Уведомления', 'Ценники', 'Акции'],
    variants: {
      hidden: { opacity: 0, scale: 0.3 },
      visible: (intensity: AnimationIntensity = 'medium') => ({
        opacity: 1, scale: 1,
        transition: { type: 'spring', stiffness: 400, damping: 10, mass: 1 },
      }),
    },
  },
  {
    name: 'rotate-in',
    category: 'entrances',
    description: 'Появление с вращением',
    usage: ['Иконки', 'Логотипы', 'Декоративные элементы'],
    variants: {
      hidden: { opacity: 0, rotate: -15, scale: 0.9 },
      visible: (intensity: AnimationIntensity = 'medium') => ({ opacity: 1, rotate: 0, scale: 1, transition: transition(intensity) }),
    },
  },
  {
    name: 'flip-in',
    category: 'entrances',
    description: 'Переворот по оси X',
    usage: ['Карточки', 'Изображения', 'Цены'],
    variants: {
      hidden: { opacity: 0, rotateX: 90 },
      visible: (intensity: AnimationIntensity = 'medium') => ({ opacity: 1, rotateX: 0, transition: { duration: 0.6, ease: 'easeOut' } }),
    },
  },
  {
    name: 'slide-up',
    category: 'entrances',
    description: 'Чистый подъём без прозрачности',
    usage: ['Секции контента', 'Списки', 'Таблицы'],
    variants: {
      hidden: { y: 100 },
      visible: (intensity: AnimationIntensity = 'medium') => ({ y: 0, transition: transition(intensity) }),
    },
  },
  {
    name: 'reveal-clip',
    category: 'entrances',
    description: 'Раскрытие текста слева направо (clip-path)',
    usage: ['Заголовки', 'Цитаты', 'Слоганы'],
    variants: {
      hidden: { clipPath: 'inset(0 100% 0 0)' },
      visible: (intensity: AnimationIntensity = 'medium') => ({ clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.8, ease: 'easeInOut' } }),
    },
  },
];

// ============================================================
// ATTENTION SEEKERS (10+)
// ============================================================

const attention: AnimationConfig[] = [
  {
    name: 'pulse',
    category: 'attention',
    description: 'Мягкая пульсация',
    usage: ['CTA-кнопки', 'Новые функции', 'Акции'],
    variants: {
      hidden: { scale: 1 },
      visible: (intensity: AnimationIntensity = 'medium') => ({
        scale: [1, intensity === 'high' ? 1.08 : 1.04, 1],
        transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
      }),
    },
  },
  {
    name: 'glow-pulse',
    category: 'attention',
    description: 'Пульсация со свечением',
    usage: ['Премиум-кнопки', 'Карточки', 'Бейджи'],
    variants: {
      hidden: { boxShadow: '0 0 0 rgba(220,38,38,0)' },
      visible: (intensity: AnimationIntensity = 'medium') => ({
        boxShadow: [
          '0 0 0 rgba(220,38,38,0)',
          '0 0 20px rgba(220,38,38,0.4)',
          '0 0 0 rgba(220,38,38,0)',
        ],
        transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
      }),
    },
  },
  {
    name: 'shake-x',
    category: 'attention',
    description: 'Горизонтальное покачивание',
    usage: ['Ошибки', 'Предупреждения', 'Интерактивные подсказки'],
    variants: {
      hidden: { x: 0 },
      visible: {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.6, ease: 'easeInOut' },
      },
    },
  },
  {
    name: 'shake-y',
    category: 'attention',
    description: 'Вертикальное покачивание (кивок)',
    usage: ['Подтверждения', 'Успешные действия'],
    variants: {
      hidden: { y: 0 },
      visible: {
        y: [0, -8, 4, -4, 0],
        transition: { duration: 0.5, ease: 'easeInOut' },
      },
    },
  },
  {
    name: 'float',
    category: 'attention',
    description: 'Парение в воздухе',
    usage: ['Изображения', 'Иконки', 'Декоративные элементы'],
    variants: {
      hidden: { y: 0 },
      visible: (intensity: AnimationIntensity = 'medium') => ({
        y: [0, intensity === 'high' ? -16 : -8, 0],
        transition: { repeat: Infinity, duration: intensity === 'high' ? 2 : 3, ease: 'easeInOut' },
      }),
    },
  },
  {
    name: 'magnet',
    category: 'attention',
    description: 'Эффект притяжения к курсору',
    usage: ['Карточки', 'Кнопки', 'Изображения'],
    variants: {
      rest: { scale: 1, rotateX: 0, rotateY: 0, transition: { duration: 0.3 } },
      hover: { scale: 1.05, transition: { duration: 0.3 } },
    },
  },
  {
    name: 'wobble',
    category: 'attention',
    description: 'Желейная тряска',
    usage: ['Интерактивные элементы', 'Иконки', 'Бейджи'],
    variants: {
      hidden: { rotate: 0 },
      visible: {
        rotate: [0, -5, 3, -3, 0],
        transition: { duration: 0.7, ease: 'easeInOut' },
      },
    },
  },
  {
    name: 'glow-text',
    category: 'attention',
    description: 'Сияющий текст',
    usage: ['Заголовки', 'Акценты', 'Цены'],
    variants: {
      hidden: { textShadow: '0 0 0px rgba(255,255,255,0)' },
      visible: (intensity: AnimationIntensity = 'medium') => ({
        textShadow: [
          '0 0 0px rgba(255,255,255,0)',
          `0 0 ${intensity === 'high' ? 20 : 10}px rgba(255,255,255,0.5)`,
          '0 0 0px rgba(255,255,255,0)',
        ],
        transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
      }),
    },
  },
  {
    name: 'border-beam',
    category: 'attention',
    description: 'Бегущий луч по границе',
    usage: ['Карточки', 'Инпуты', 'Кнопки'],
    variants: {
      hidden: { '--beam-angle': '0deg' },
      visible: {
        '--beam-angle': ['0deg', '360deg'],
        transition: { repeat: Infinity, duration: 4, ease: 'linear' },
      },
    },
  },
  {
    name: 'shimmer',
    category: 'attention',
    description: 'Блик по поверхности',
    usage: ['Карточки', 'Скелетоны', 'Кнопки'],
    variants: {
      hidden: { backgroundPosition: '-200% 0' },
      visible: {
        backgroundPosition: ['-200% 0', '200% 0'],
        transition: { repeat: Infinity, duration: 2, ease: 'linear' },
      },
    },
  },
];

// ============================================================
// STAGGER (10+)
// ============================================================

const stagger: AnimationConfig[] = [
  {
    name: 'stagger-fade-up',
    category: 'stagger',
    description: 'Каскадное появление снизу',
    usage: ['Списки', 'Карточки', 'Features'],
    variants: {
      hidden: { opacity: 0, y: 30 },
      visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
    },
  },
  {
    name: 'stagger-fade-down',
    category: 'stagger',
    description: 'Каскадное появление сверху',
    usage: ['Навигация', 'Меню', 'Фильтры'],
    variants: {
      hidden: { opacity: 0, y: -30 },
      visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
    },
  },
  {
    name: 'stagger-fade-left',
    category: 'stagger',
    description: 'Каскадное появление слева',
    usage: ['Боковые панели', 'Комментарии'],
    variants: {
      hidden: { opacity: 0, x: -40 },
      visible: (i: number = 0) => ({ opacity: 1, x: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
    },
  },
  {
    name: 'stagger-fade-right',
    category: 'stagger',
    description: 'Каскадное появление справа',
    usage: ['Временная шкала', 'События'],
    variants: {
      hidden: { opacity: 0, x: 40 },
      visible: (i: number = 0) => ({ opacity: 1, x: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
    },
  },
  {
    name: 'stagger-scale',
    category: 'stagger',
    description: 'Каскадное раскрытие из центра',
    usage: ['Сетка карточек', 'Галерея', 'Портфолио'],
    variants: {
      hidden: { opacity: 0, scale: 0.6 },
      visible: (i: number = 0) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.4 } }),
    },
  },
  {
    name: 'stagger-rotate',
    category: 'stagger',
    description: 'Каскадное появление с вращением',
    usage: ['Иконки', 'Бейджи', 'Теги'],
    variants: {
      hidden: { opacity: 0, rotate: -20, scale: 0.5 },
      visible: (i: number = 0) => ({ opacity: 1, rotate: 0, scale: 1, transition: { delay: i * 0.08, duration: 0.4 } }),
    },
  },
  {
    name: 'stagger-blur',
    category: 'stagger',
    description: 'Каскадное появление из размытия',
    usage: ['Премиум-сетки', 'Логотипы', 'Партнёры'],
    variants: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: (i: number = 0) => ({ opacity: 1, filter: 'blur(0px)', transition: { delay: i * 0.15, duration: 0.6 } }),
    },
  },
  {
    name: 'stagger-spring',
    category: 'stagger',
    description: 'Каскадное пружинистое появление',
    usage: ['Интерактивные списки', 'Игровые элементы'],
    variants: {
      hidden: { opacity: 0, scale: 0.3 },
      visible: (i: number = 0) => ({
        opacity: 1, scale: 1,
        transition: { delay: i * 0.05, type: 'spring', stiffness: 300, damping: 15 },
      }),
    },
  },
  {
    name: 'stagger-slide-up',
    category: 'stagger',
    description: 'Чистый каскадный подъём',
    usage: ['Таблицы', 'Строки', 'Данные'],
    variants: {
      hidden: { y: 50 },
      visible: (i: number = 0) => ({ y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
    },
  },
  {
    name: 'stagger-reveal',
    category: 'stagger',
    description: 'Выезд из-за маски справа налево',
    usage: ['Текст построчно', 'Стихи', 'Цитаты'],
    variants: {
      hidden: { x: '100%', opacity: 0 },
      visible: (i: number = 0) => ({ x: '0%', opacity: 1, transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' } }),
    },
  },
];

// ============================================================
// SPECIAL / PREMIUM (15+)
// ============================================================

const special: AnimationConfig[] = [
  {
    name: 'perspective-3d',
    category: 'special',
    description: '3D-перспектива при наведении',
    usage: ['Премиум-карточки', 'Портфолио', 'Продукты'],
    variants: {
      rest: { rotateX: 0, rotateY: 0, scale: 1, transition: { duration: 0.4 } },
      hover: { scale: 1.05, transition: { duration: 0.4 } },
    },
  },
  {
    name: 'glow-border',
    category: 'special',
    description: 'Светящаяся граница при наведении',
    usage: ['Карточки', 'Инпуты', 'Кнопки'],
    variants: {
      rest: { borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 0 0 rgba(220,38,38,0)' },
      hover: { borderColor: 'rgba(220,38,38,0.5)', boxShadow: '0 0 30px rgba(220,38,38,0.15)', transition: { duration: 0.3 } },
    },
  },
  {
    name: 'morph-bg',
    category: 'special',
    description: 'Морфинг фонового градиента',
    usage: ['Hero-секции', 'CTA', 'Секции'],
    variants: {
      hidden: { backgroundPosition: '0% 50%' },
      visible: {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        transition: { repeat: Infinity, duration: 10, ease: 'linear' },
      },
    },
  },
  {
    name: 'particle-burst',
    category: 'special',
    description: 'Взрыв частиц при появлении',
    usage: ['Главные CTA', 'Важные уведомления'],
    variants: {
      hidden: { opacity: 0, scale: 0, rotate: -10 },
      visible: (intensity: AnimationIntensity = 'medium') => ({
        opacity: 1, scale: 1, rotate: 0,
        transition: { type: 'spring', stiffness: 300, damping: 12 },
      }),
    },
  },
  {
    name: 'liquid-reveal',
    category: 'special',
    description: 'Жидкое раскрытие (clip-path)',
    usage: ['Изображения', 'Секции', 'Переходы'],
    variants: {
      hidden: { clipPath: 'circle(0% at 50% 50%)' },
      visible: (intensity: AnimationIntensity = 'medium') => ({
        clipPath: 'circle(100% at 50% 50%)',
        transition: { duration: 1, ease: 'easeInOut' },
      }),
    },
  },
    {
    name: 'typewriter',
    category: 'special',
    description: 'Эффект печатной машинки',
    usage: ['Главные заголовки', 'Слоганы', 'Цитаты'],
    variants: {
      hidden: { width: '0%' },
      visible: (intensity: AnimationIntensity = 'medium') => ({
        width: '100%',
        transition: { duration: 1.5, ease: 'easeInOut' },
      }),
    },
  },
      {
    name: 'glitch',
    category: 'special',
    description: 'Цифровой глитч-эффект',
    usage: ['Киберспорт', 'Техно', 'Игры'],
    variants: {
      hidden: { x: 0, skewX: 0 },
      visible: {
        x: [0, -2, 2, -1, 1, 0],
        skewX: [0, -1, 1, -0.5, 0.5, 0],
        transition: { duration: 0.4 },
      },
    },
  },
  {
    name: 'spotlight',
    category: 'special',
    description: 'Эффект прожектора (радиальный градиент)',
    usage: ['Карточки', 'Hero', 'Изображения'],
    variants: {
      rest: { '--spotlight-x': '50%', '--spotlight-y': '50%', opacity: 0 },
      hover: { opacity: 1, transition: { duration: 0.3 } },
    },
  },
  {
    name: 'parallax-depth',
    category: 'special',
    description: 'Параллакс с глубиной',
    usage: ['Hero-изображения', 'Фоны', 'Секции'],
    variants: {
      hidden: { y: 0, scale: 1 },
      visible: (intensity: AnimationIntensity = 'medium') => ({
        y: intensity === 'high' ? -30 : -15,
        scale: intensity === 'high' ? 1.1 : 1.05,
        transition: { duration: 1.5, ease: 'easeOut' },
      }),
    },
  },
  {
    name: 'elastic-stretch',
    category: 'special',
    description: 'Эластичное растяжение',
    usage: ['Кнопки', 'Бейджи', 'Уведомления'],
    variants: {
      hidden: { scaleX: 0, scaleY: 0 },
      visible: (intensity: AnimationIntensity = 'medium') => ({
        scaleX: [0, 1.1, 0.95, 1],
        scaleY: [0, 0.9, 1.05, 1],
        transition: { duration: 0.8, times: [0, 0.4, 0.7, 1] },
      }),
    },
  },
  {
    name: 'ken-burns',
    category: 'special',
    description: 'Медленное приближение изображения',
    usage: ['Hero-фоны', 'Галерея', 'Портфолио'],
    variants: {
      hidden: { scale: 1, filter: 'brightness(1)' },
      visible: {
        scale: [1, 1.15],
        filter: ['brightness(1)', 'brightness(0.8)'],
        transition: { duration: 20, ease: 'linear' },
      },
    },
  },
  {
    name: 'counter-roll',
    category: 'special',
    description: 'Прокрутка цифр (для чисел)',
    usage: ['Статистика', 'Счётчики', 'Метрики'],
    variants: {
      hidden: { opacity: 0, y: 20 },
      visible: (intensity: AnimationIntensity = 'medium') => ({
        opacity: 1, y: 0,
        transition: { duration: 0.8, ease: 'easeOut' },
      }),
    },
  },
  {
    name: 'hover-lift',
    category: 'special',
    description: 'Подъём карточки при наведении',
    usage: ['Карточки', 'Цены', 'Отзывы'],
    variants: {
      rest: { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' },
      hover: { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', transition: { duration: 0.3 } },
    },
  },
  {
    name: 'gradient-flow',
    category: 'special',
    description: 'Перетекание градиента по тексту',
    usage: ['Заголовки', 'Логотипы', 'Акценты'],
    variants: {
      hidden: { backgroundPosition: '0% 50%' },
      visible: {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        transition: { repeat: Infinity, duration: 6, ease: 'linear' },
      },
    },
  },
  {
    name: 'skeleton-load',
    category: 'special',
    description: 'Скелетон-загрузка',
    usage: ['Загрузка контента', 'Placeholder'],
    variants: {
      hidden: { opacity: 0.3 },
      visible: {
        opacity: [0.3, 0.6, 0.3],
        transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
      },
    },
  },
];

// ============================================================
// REGISTRY
// ============================================================

function buildRegistry(): AnimationRegistry {
  const all = [...entrances, ...attention, ...stagger, ...special];
  const registry: AnimationRegistry = {};
  for (const anim of all) {
    registry[anim.name] = anim;
  }
  return registry;
}

export const animationRegistry: AnimationRegistry = buildRegistry();

export const animationNames: string[] = Object.keys(animationRegistry);

export const animationsByCategory: Record<AnimationCategory, string[]> = {
  entrances: entrances.map(a => a.name),
  attention: attention.map(a => a.name),
  stagger: stagger.map(a => a.name),
  special: special.map(a => a.name),
};

export function getAnimation(name: string): AnimationConfig {
  return animationRegistry[name] || animationRegistry['fade-in'];
}

export function getAnimationsByCategory(category: AnimationCategory): AnimationConfig[] {
  const map: Record<AnimationCategory, AnimationConfig[]> = {
    entrances,
    attention,
    stagger,
    special,
  };
  return map[category];
}