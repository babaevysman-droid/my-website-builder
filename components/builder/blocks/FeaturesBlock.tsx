import InlineText from '../InlineText';
import IconRenderer from '../icons/IconRenderer';
import { BlockStyleSettings } from './BlockRenderer';

type FeaturesVariant =
  | 'icon-grid'
  | 'left-list'
  | 'checkerboard'
  | 'glass-cards'
  | 'timeline';

type FeatureItem =
  | string
  | {
      title?: unknown;
      description?: unknown;
      icon?: unknown;
    };

function toText(value: unknown, fallback = '') {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return fallback;
  return String(value);
}

function normalizeVariant(value?: string): FeaturesVariant {
  const variants: FeaturesVariant[] = [
    'icon-grid',
    'left-list',
    'checkerboard',
    'glass-cards',
    'timeline',
  ];

  return variants.includes(value as FeaturesVariant)
    ? (value as FeaturesVariant)
    : 'icon-grid';
}

function normalizeItems(items: FeatureItem[]) {
  return items.map((item, index) => {
    if (typeof item === 'string') {
      return {
        title: item,
        description: 'Описание преимущества можно изменить в редакторе.',
        icon: 'sparkles',
      };
    }

    return {
      title: toText(item.title, `Преимущество ${index + 1}`),
      description: toText(item.description, 'Описание преимущества.'),
      icon: toText(item.icon, 'sparkles'),
    };
  });
}

export default function FeaturesBlock({
  blockId,
  editable = false,
  title,
  items,
  blockStyle,
}: {
  blockId: string;
  editable?: boolean;
  title: string;
  items: FeatureItem[];
  blockStyle?: BlockStyleSettings;
}) {
  const normalizedItems = normalizeItems(Array.isArray(items) ? items : []);
  const variant = normalizeVariant(blockStyle?.variant ?? blockStyle?.layoutType);

  const paddingY = blockStyle?.paddingY ?? 110;
  const paddingX = blockStyle?.paddingX ?? 32;
  const containerWidth = blockStyle?.containerWidth ?? 1180;
  const radius = blockStyle?.radius ?? 32;
  const backgroundColor = blockStyle?.backgroundColor || '#ffffff';
  const textColor = blockStyle?.textColor || '#111111';
  const accent = blockStyle?.accentColor || blockStyle?.primaryColor || '#a855f7';

  const isDark =
    backgroundColor !== '#ffffff' &&
    backgroundColor !== '#fff' &&
    backgroundColor !== 'white';

  const titleNode = (
    <InlineText
      blockId={blockId}
      propKey="title"
      value={title}
      editable={editable}
      as="h2"
      className="mx-auto max-w-4xl text-center text-4xl font-black tracking-tight md:text-6xl"
    />
  );

  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        backgroundColor,
        color: textColor,
      }}
    >
      {(variant === 'glass-cards' || blockStyle?.effects?.glow) && (
        <div
          className="pointer-events-none absolute -right-32 top-24 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: accent, opacity: 0.18 }}
        />
      )}

      <div className="relative mx-auto" style={{ maxWidth: containerWidth }}>
        {variant !== 'left-list' && titleNode}

        {variant === 'icon-grid' && (
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {normalizedItems.map((item, index) => (
              <FeatureCard
                key={`${item.title}-${index}`}
                item={item}
                radius={radius}
                accent={accent}
                isDark={isDark}
              />
            ))}
          </div>
        )}

        {variant === 'glass-cards' && (
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {normalizedItems.map((item, index) => (
              <FeatureCard
                key={`${item.title}-${index}`}
                item={item}
                radius={radius}
                accent={accent}
                isDark
                glass
              />
            ))}
          </div>
        )}

        {variant === 'left-list' && (
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-20 lg:self-start">{titleNode}</div>
            <div className="space-y-4">
              {normalizedItems.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="flex gap-5 border border-current/10 p-6"
                  style={{ borderRadius: radius }}
                >
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: accent, color: '#fff' }}
                  >
                    <IconRenderer name={item.icon} size={26} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{item.title}</h3>
                    <p className="mt-3 text-base leading-8 opacity-65">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {variant === 'checkerboard' && (
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {normalizedItems.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className={[
                  'border p-8',
                  index % 2 === 0
                    ? isDark
                      ? 'border-white/10 bg-white/[0.08]'
                      : 'border-black/10 bg-black text-white'
                    : isDark
                      ? 'border-white/10 bg-transparent'
                      : 'border-black/10 bg-white',
                ].join(' ')}
                style={{ borderRadius: radius }}
              >
                <IconRenderer name={item.icon} size={30} />
                <h3 className="mt-8 text-2xl font-black">{item.title}</h3>
                <p className="mt-4 text-base leading-8 opacity-65">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        )}

        {variant === 'timeline' && (
          <div className="mx-auto mt-14 max-w-3xl space-y-6">
            {normalizedItems.map((item, index) => (
              <article key={`${item.title}-${index}`} className="relative pl-14">
                <div
                  className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{ backgroundColor: accent }}
                >
                  {index + 1}
                </div>
                <div
                  className="border border-current/10 p-6"
                  style={{ borderRadius: radius }}
                >
                  <h3 className="text-2xl font-black">{item.title}</h3>
                  <p className="mt-3 text-base leading-8 opacity-65">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeatureCard({
  item,
  radius,
  accent,
  isDark,
  glass = false,
}: {
  item: { title: string; description: string; icon: string };
  radius: number;
  accent: string;
  isDark: boolean;
  glass?: boolean;
}) {
  return (
    <article
      className={[
        'group relative overflow-hidden border p-8 transition duration-300 hover:-translate-y-1',
        isDark || glass
          ? 'border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-xl hover:bg-white/[0.1]'
          : 'border-black/10 bg-white shadow-sm hover:shadow-xl',
      ].join(' ')}
      style={{ borderRadius: radius }}
    >
      <div
        className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: isDark || glass ? 'rgba(255,255,255,0.12)' : '#f1f1f1',
          color: isDark || glass ? '#ffffff' : '#111111',
        }}
      >
        <IconRenderer name={item.icon} size={28} />
      </div>

      <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>

      <p className="mt-5 text-base leading-8 opacity-65">{item.description}</p>

      <div
        className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full"
        style={{ backgroundColor: accent }}
      />
    </article>
  );
}