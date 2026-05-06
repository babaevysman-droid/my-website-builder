import InlineText from '../InlineText';
import { BlockStyleSettings } from './BlockRenderer';

type PricingPlan = {
  name?: unknown;
  title?: unknown;
  price?: unknown;
  description?: unknown;
  features?: unknown;
  buttonText?: unknown;
};

function toText(value: unknown, fallback = '') {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return fallback;
  return String(value);
}

function normalizePlans(plans: unknown, fallback: PricingPlan) {
  if (Array.isArray(plans) && plans.length > 0) {
    return plans.map((plan, index) => {
      const item = typeof plan === 'object' && plan ? (plan as PricingPlan) : {};

      return {
        name: toText(item.name ?? item.title, `Тариф ${index + 1}`),
        price: toText(item.price, 'от 0 ₽'),
        description: toText(item.description, 'Описание тарифа.'),
        features: Array.isArray(item.features)
          ? item.features.map((feature) => toText(feature)).filter(Boolean)
          : ['Быстрый старт', 'Готовая страница', 'Поддержка'],
        buttonText: toText(item.buttonText, 'Выбрать'),
      };
    });
  }

  return [
    {
      name: toText(fallback.title ?? fallback.name, 'Старт'),
      price: toText(fallback.price, 'от 0 ₽'),
      description: toText(fallback.description, 'Описание тарифа.'),
      features: ['Готовый лендинг', 'Форма заявки', 'Публикация сайта'],
      buttonText: toText(fallback.buttonText, 'Выбрать'),
    },
  ];
}

export default function PricingBlock({
  blockId,
  editable = false,
  title,
  price,
  description,
  plans,
  buttonText,
  blockStyle,
}: {
  blockId: string;
  editable?: boolean;
  title: string;
  price?: string;
  description?: string;
  plans?: unknown;
  buttonText?: string;
  blockStyle?: BlockStyleSettings;
}) {
  const variant = blockStyle?.variant || 'cards';
  const safePlans = normalizePlans(plans, { title, price, description, buttonText });

  const radius = blockStyle?.radius ?? 28;
  const accent = blockStyle?.accentColor || blockStyle?.primaryColor || '#111111';
  const backgroundColor = blockStyle?.backgroundColor || '#ffffff';
  const textColor = blockStyle?.textColor || '#111111';

  const Card = (plan: (typeof safePlans)[number], index: number) => (
    <article
      key={`${plan.name}-${index}`}
      className={[
        'border p-7 shadow-sm',
        variant === 'dark' || variant === 'glass'
          ? 'border-white/10 bg-white/[0.07] text-white backdrop-blur-xl'
          : 'border-black/10 bg-white text-black',
        variant === 'highlight' && index === 1 ? 'scale-[1.04] shadow-2xl' : '',
      ].join(' ')}
      style={{ borderRadius: radius }}
    >
      <h3 className="text-2xl font-black">{plan.name}</h3>

      <p className="mt-5 text-4xl font-black tracking-tight">{plan.price}</p>

      <p className="mt-4 text-sm leading-7 opacity-60">{plan.description}</p>

      <ul className="mt-6 space-y-3 text-sm">
        {plan.features.map((feature, featureIndex) => (
          <li key={`${feature}-${featureIndex}`} className="flex gap-3">
            <span style={{ color: accent }}>✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-7 h-12 w-full rounded-xl text-sm font-black text-white"
        style={{ backgroundColor: accent }}
      >
        {plan.buttonText}
      </button>
    </article>
  );

  return (
    <section
      style={{
        paddingTop: blockStyle?.paddingY ?? 96,
        paddingBottom: blockStyle?.paddingY ?? 96,
        paddingLeft: blockStyle?.paddingX ?? 32,
        paddingRight: blockStyle?.paddingX ?? 32,
        backgroundColor,
        color: textColor,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: blockStyle?.containerWidth ?? 1180 }}>
        <InlineText
          blockId={blockId}
          propKey="title"
          value={title}
          editable={editable}
          as="h2"
          className="mx-auto max-w-4xl text-center text-4xl font-black tracking-tight md:text-6xl"
        />

        <div
          className={[
            'mt-12 gap-6',
            variant === 'stacked' ? 'space-y-6' : 'grid md:grid-cols-3',
          ].join(' ')}
        >
          {safePlans.map(Card)}
        </div>
      </div>
    </section>
  );
}