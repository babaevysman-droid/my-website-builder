import { BlockStyleSettings } from './BlockRenderer';
import InlineText from '../InlineText';

export default function FooterBlock({
  blockId,
  editable,
  text,
  blockStyle,
}: {
  blockId: string;
  editable?: boolean;
  text: string;
  blockStyle?: BlockStyleSettings;
}) {
  const align = blockStyle?.align ?? 'center';
  const paddingY = blockStyle?.paddingY ?? 32;
  const paddingX = blockStyle?.paddingX ?? 32;

  return (
    <footer
      className="border-t text-sm opacity-70"
      style={{
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        textAlign: align,
        backgroundColor: blockStyle?.backgroundColor || undefined,
        color: blockStyle?.textColor || undefined,
      }}
    >
      <InlineText
        blockId={blockId}
        propKey="text"
        value={text}
        editable={editable}
        as="span"
      />
    </footer>
  );
}