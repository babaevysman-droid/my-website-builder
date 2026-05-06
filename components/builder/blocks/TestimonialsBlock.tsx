import InlineText from '../InlineText';
import { BlockStyleSettings } from './BlockRenderer';

type TestimonialItem =
  | string
  | {
      title?: unknown;
      name?: unknown;
      description?: unknown;
      text?: unknown;
      role?: unknown;
    };

function toText(value: unknown, fallback = '') {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return fallback;
  return String(value);
}

function normalizeItems(items: TestimonialItem[]) {
  return items.map((item, index) => {
    if (typeof item === 'string') {
      return {
        name: `Клиент #${index + 1}`,
        role: 'Клиент',
        text: item,
      };
    }

    return {
      name: toText(item.name ?? item.title, `Клиент #${index + 1}`),
      role: toText(item.role, 'Клиент'),
      text: toText(item.text ?? item.description, 'Отзыв клиента.'),
    };
  });
}

export default function TestimonialsBlock({
  blockId,
  editable = false,
  title,
  items,
  blockStyle,
}: {
  blockId: string;
  editable?: boolean;
  title: string;
  items: TestimonialItem[];
  blockStyle?: BlockStyleSettings;
}) {
  const normalizedItems = normalizeItems(Array.isArray(items) ? items : []);
  const layoutType = blockStyle?.layoutType ?? blockStyle?.variant ?? 'cards';

  const paddingY = blockStyle?.paddingY ?? 110;
  const paddingX = blockStyle?.paddingX ?? 32;
  const containerWidth = blockStyle?.containerWidth ?? 1180;
  const radius = blockStyle?.radius ?? 32;
  const backgroundColor = blockStyle?.backgroundColor || '#f7f7f7';
  const textColor = blockStyle?.textColor || '#111111';
  const accent = blockStyle?.accentColor || blockStyle?.primaryColor || '#a855f7';

  const isDark =
    backgroundColor !== '#ffffff' &&
    backgroundColor !== '#fff' &&
    backgroundColor !== 'white' &&
    backgroundColor !== '#f7f7f7';

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
      {layoutType === 'gradient' && (
        <div
          className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: accent, opacity: 0.16 }}
        />
      )}

      <div className="relative mx-auto" style={{ maxWidth: containerWidth }}>
        <InlineText
          blockId={blockId}
          propKey="title"
          value={title}
          editable={editable}
          as="h2"
          className="mx-auto max-w-4xl text-center text-4xl font-black tracking-tight md:text-6xl"
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {normalizedItems.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className={[
                'relative overflow-hidden border p-8 shadow-sm',
                isDark
                  ? 'border-white/10 bg-white/[0.07] text-white backdrop-blur-xl'
                  : 'border-black/10 bg-white text-black',
              ].join(' ')}
              style={{ borderRadius: radius }}
            >
              <div
                className="mb-8 h-12 w-12 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${accent}, transparent)`,
                }}
              />

              <p className="text-xl leading-9">“{item.text}”</p>

              <div className="mt-8 border-t border-current/10 pt-6">
                <p className="font-black">{item.name}</p>
                <p className="mt-1 text-sm opacity-50">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}