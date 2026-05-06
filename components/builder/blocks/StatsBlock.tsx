import InlineText from '../InlineText';
import { BlockStyleSettings } from './BlockRenderer';

type StatItem =
  | string
  | {
      title?: unknown;
      value?: unknown;
      label?: unknown;
      description?: unknown;
    };

type StatsVariant =
  | 'big-numbers'
  | 'glass-grid'
  | 'horizontal-strip'
  | 'split-copy'
  | 'dark-cards'
  | 'minimal-line'
  | 'gradient-cards'
  | 'boxed'
  | 'editorial'
  | 'neon';

function text(value: unknown, fallback = '') {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return fallback;
  return String(value);
}

function normalizeVariant(value?: string): StatsVariant {
  const variants: StatsVariant[] = [
    'big-numbers',
    'glass-grid',
    'horizontal-strip',
    'split-copy',
    'dark-cards',
    'minimal-line',
    'gradient-cards',
    'boxed',
    'editorial',
    'neon',
  ];

  return variants.includes(value as StatsVariant)
    ? (value as StatsVariant)
    : 'big-numbers';
}

function normalizeItems(items: StatItem[]) {
  return items.map((item, index) => {
    if (typeof item === 'string') {
      const [value, ...label] = item.split(' ');
      return {
        value: value || `${index + 1}+`,
        label: label.join(' ') || 'метрика',
      };
    }

    return {
      value: text(item.value ?? item.title, `${index + 1}+`),
      label: text(item.label ?? item.description, 'метрика'),
    };
  });
}

export default function StatsBlock({
  blockId,
  editable = false,
  title,
  items,
  blockStyle,
}: {
  blockId: string;
  editable?: boolean;
  title: string;
  items: StatItem[];
  blockStyle?: BlockStyleSettings;
}) {
  const normalizedItems = normalizeItems(Array.isArray(items) ? items : []);
  const variant = normalizeVariant(blockStyle?.variant ?? blockStyle?.layoutType);

  const paddingY = blockStyle?.paddingY ?? 96;
  const paddingX = blockStyle?.paddingX ?? 32;
  const containerWidth = blockStyle?.containerWidth ?? 1180;
  const radius = blockStyle?.radius ?? 28;
  const bg = blockStyle?.backgroundColor || '#050505';
  const color = blockStyle?.textColor || '#ffffff';
  const accent = blockStyle?.accentColor || blockStyle?.primaryColor || '#a855f7';

  const isLight = bg === '#ffffff' || bg === '#fff' || bg === 'white';

  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        backgroundColor: bg,
        color,
      }}
    >
      {(variant === 'gradient-cards' || variant === 'neon') && (
        <div
          className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: accent, opacity: 0.22 }}
        />
      )}

      <div className="relative mx-auto" style={{ maxWidth: containerWidth }}>
        <InlineText
          blockId={blockId}
          propKey="title"
          value={title}
          editable={editable}
          as="h2"
          className={[
            'mx-auto max-w-4xl text-4xl font-black tracking-tight md:text-6xl',
            variant === 'split-copy' ? 'text-left' : 'text-center',
          ].join(' ')}
        />

        {variant === 'horizontal-strip' ? (
          <div className="mt-12 grid overflow-hidden border border-current/10 md:grid-cols-3" style={{ borderRadius: radius }}>
            {normalizedItems.map((item, index) => (
              <div key={`${item.value}-${index}`} className="border-current/10 p-8 text-center md:border-r last:border-r-0">
                <p className="text-5xl font-black">{item.value}</p>
                <p className="mt-3 text-sm opacity-60">{item.label}</p>
              </div>
            ))}
          </div>
        ) : variant === 'split-copy' ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {normalizedItems.map((item, index) => (
              <div key={`${item.value}-${index}`} className="border-l-4 p-6" style={{ borderColor: accent }}>
                <p className="text-6xl font-black">{item.value}</p>
                <p className="mt-4 text-sm leading-6 opacity-65">{item.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {normalizedItems.map((item, index) => (
              <div
                key={`${item.value}-${index}`}
                className={[
                  'relative overflow-hidden border p-8 text-center transition hover:-translate-y-1',
                  variant === 'minimal-line'
                    ? 'border-x-0 border-b-0 border-t-current/20 bg-transparent'
                    : '',
                  variant === 'boxed'
                    ? 'border-current/10 bg-transparent'
                    : '',
                  variant === 'glass-grid'
                    ? 'border-white/10 bg-white/[0.07] backdrop-blur-xl'
                    : '',
                  variant === 'dark-cards'
                    ? 'border-white/10 bg-black/30'
                    : '',
                  variant === 'gradient-cards'
                    ? 'border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] backdrop-blur-xl'
                    : '',
                  variant === 'neon'
                    ? 'border-current/20 bg-black/30 shadow-2xl'
                    : '',
                  variant === 'big-numbers' || variant === 'editorial'
                    ? isLight
                      ? 'border-black/10 bg-white shadow-sm'
                      : 'border-white/10 bg-white/[0.06]'
                    : '',
                ].join(' ')}
                style={{
                  borderRadius:
                    variant === 'minimal-line' || variant === 'editorial'
                      ? 0
                      : radius,
                  boxShadow:
                    variant === 'neon' ? `0 0 40px ${accent}44` : undefined,
                }}
              >
                <p
                  className={[
                    'font-black tracking-tight',
                    variant === 'editorial' ? 'text-7xl' : 'text-6xl',
                  ].join(' ')}
                  style={{
                    color:
                      variant === 'neon' || variant === 'gradient-cards'
                        ? accent
                        : undefined,
                  }}
                >
                  {item.value}
                </p>
                <p className="mt-4 text-sm leading-6 opacity-65">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}