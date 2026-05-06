import { BlockStyleSettings } from './BlockRenderer';
import InlineText from '../InlineText';

export default function CtaBlock({
  blockId,
  editable,
  title,
  buttonText,
  blockStyle,
}: {
  blockId: string;
  editable?: boolean;
  title: string;
  buttonText: string;
  blockStyle?: BlockStyleSettings;
}) {
  const align = blockStyle?.align ?? 'center';
  const paddingY = blockStyle?.paddingY ?? 80;
  const paddingX = blockStyle?.paddingX ?? 32;
  const containerWidth = blockStyle?.containerWidth ?? 1120;
  const radius = blockStyle?.radius ?? 24;

  return (
    <section
      style={{
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        backgroundColor: blockStyle?.backgroundColor || undefined,
        color: blockStyle?.textColor || undefined,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: containerWidth }}>
        <div
          className="bg-black px-8 py-16 text-white"
          style={{ borderRadius: radius, textAlign: align }}
        >
          <InlineText
            blockId={blockId}
            propKey="title"
            value={title}
            editable={editable}
            as="h2"
            className="text-4xl font-bold"
          />

          <InlineText
            blockId={blockId}
            propKey="buttonText"
            value={buttonText}
            editable={editable}
            as="button"
            className="mt-8 rounded-xl bg-white px-6 py-3 font-medium text-black"
          />
        </div>
      </div>
    </section>
  );
}