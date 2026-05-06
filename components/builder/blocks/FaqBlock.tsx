import InlineText from '../InlineText';
import { BlockStyleSettings } from './BlockRenderer';

type FaqItem =
  | string
  | {
      title?: unknown;
      question?: unknown;
      description?: unknown;
      answer?: unknown;
    };

function toText(value: unknown, fallback = '') {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return fallback;
  return String(value);
}

function normalizeItems(items: FaqItem[]) {
  return items.map((item, index) => {
    if (typeof item === 'string') {
      return {
        question: item,
        answer: 'Да, эту настройку можно изменить в редакторе сайта.',
      };
    }

    return {
      question: toText(item.question ?? item.title, `Вопрос ${index + 1}`),
      answer: toText(
        item.answer ?? item.description,
        'Да, эту настройку можно изменить в редакторе сайта.'
      ),
    };
  });
}

export default function FaqBlock({
  blockId,
  editable = false,
  title,
  items,
  blockStyle,
}: {
  blockId: string;
  editable?: boolean;
  title: string;
  items: FaqItem[];
  blockStyle?: BlockStyleSettings;
}) {
  const normalizedItems = normalizeItems(Array.isArray(items) ? items : []);

  const paddingY = blockStyle?.paddingY ?? 96;
  const paddingX = blockStyle?.paddingX ?? 32;
  const containerWidth = blockStyle?.containerWidth ?? 960;
  const radius = blockStyle?.radius ?? 24;
  const backgroundColor = blockStyle?.backgroundColor || '#ffffff';
  const textColor = blockStyle?.textColor || '#111111';

  const isDark =
    backgroundColor !== '#ffffff' &&
    backgroundColor !== '#fff' &&
    backgroundColor !== 'white';

  return (
    <section
      style={{
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        backgroundColor,
        color: textColor,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: containerWidth }}>
        <InlineText
          blockId={blockId}
          propKey="title"
          value={title}
          editable={editable}
          as="h2"
          className="mx-auto max-w-4xl text-center text-4xl font-black tracking-tight md:text-6xl"
        />

        <div className="mt-12 space-y-4">
          {normalizedItems.map((item, index) => (
            <details
              key={`${item.question}-${index}`}
              className={[
                'group border p-6 shadow-sm',
                isDark
                  ? 'border-white/10 bg-white/[0.06] backdrop-blur-xl'
                  : 'border-black/10 bg-white',
              ].join(' ')}
              style={{ borderRadius: radius }}
              open={index === 0}
            >
              <summary className="cursor-pointer list-none text-lg font-black">
                <span className="mr-3 inline-block transition group-open:rotate-90">
                  ›
                </span>
                {item.question}
              </summary>

              <p className="mt-5 pl-8 text-sm leading-7 opacity-65">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}