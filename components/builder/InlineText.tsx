'use client';

import {
  CSSProperties,
  ElementType,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
} from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';

type InlineTextProps = {
  blockId: string;
  propKey: string;
  value: string;
  editable?: boolean;
  multiline?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

export default function InlineText({
  blockId,
  propKey,
  value,
  editable = false,
  multiline = false,
  as: Component = 'span',
  className,
  style,
}: InlineTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const updateBlockProps = useBuilderStore((state) => state.updateBlockProps);
  const setActiveBlock = useBuilderStore((state) => state.setActiveBlock);
  const setActiveText = useBuilderStore((state) => state.setActiveText);

  useEffect(() => {
    if (!ref.current) return;
    if (document.activeElement === ref.current) return;

    ref.current.innerText = value;
  }, [value]);

  function activate() {
    setActiveBlock(blockId);
    setActiveText({ blockId, propKey });
  }

  function commit(event: FocusEvent<HTMLElement>) {
    const nextValue = event.currentTarget.innerText.trim();

    if (nextValue !== value) {
      updateBlockProps(blockId, { [propKey]: nextValue });
    }
  }

  function handleClick(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
    activate();
    ref.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!multiline && event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    }
  }

  if (!editable) {
    return (
      <Component className={className} style={style}>
        {value}
      </Component>
    );
  }

  return (
    <Component
      ref={ref}
      data-corshun-inline-text="true"
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      className={[
        className,
        'outline-none transition focus:ring-2 focus:ring-violet-500/50',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      onClick={handleClick}
      onMouseDown={(event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        activate();
      }}
      onFocus={activate}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      type={Component === 'button' ? 'button' : undefined}
    >
      {value}
    </Component>
  );
}