'use client';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Block } from '@/types';
import { useBuilderStore } from '@/store/useBuilderStore';
import BlockRenderer from './blocks/BlockRenderer';

export default function SortableBlock({ block }: { block: Block }) {
  const blocks = useBuilderStore((s) => s.blocks);
  const activeBlockId = useBuilderStore((s) => s.activeBlockId);

  const setActiveBlock = useBuilderStore((s) => s.setActiveBlock);
  const removeBlock = useBuilderStore((s) => s.removeBlock);
  const duplicateBlock = useBuilderStore((s) => s.duplicateBlock);
  const moveBlockUp = useBuilderStore((s) => s.moveBlockUp);
  const moveBlockDown = useBuilderStore((s) => s.moveBlockDown);

  const index = blocks.findIndex((b) => b.id === block.id);
  const isFirst = index === 0;
  const isLast = index === blocks.length - 1;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const isActive = activeBlockId === block.id;

  return (
    <section
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onClick={() => setActiveBlock(block.id)}
      className={`group relative border-2 ${
        isActive ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      <div className="absolute right-3 top-3 z-10 hidden flex-wrap gap-2 group-hover:flex">
        <button
          {...attributes}
          {...listeners}
          className="rounded-lg bg-black px-3 py-1 text-xs text-white"
        >
          Drag
        </button>

        <button
          disabled={isFirst}
          onClick={(e) => {
            e.stopPropagation();
            moveBlockUp(block.id);
          }}
          className="rounded-lg bg-neutral-800 px-3 py-1 text-xs text-white disabled:opacity-40"
        >
          ↑
        </button>

        <button
          disabled={isLast}
          onClick={(e) => {
            e.stopPropagation();
            moveBlockDown(block.id);
          }}
          className="rounded-lg bg-neutral-800 px-3 py-1 text-xs text-white disabled:opacity-40"
        >
          ↓
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            duplicateBlock(block.id);
          }}
          className="rounded-lg bg-blue-600 px-3 py-1 text-xs text-white"
        >
          Copy
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            removeBlock(block.id);
          }}
          className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white"
        >
          Delete
        </button>
      </div>

      <BlockRenderer block={block} />
    </section>
  );
}