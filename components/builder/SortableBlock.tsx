'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '@/types';
import { useBuilderStore } from '@/store/useBuilderStore';
import BlockRenderer from './blocks/BlockRenderer';
import BlockFloatingToolbar from './BlockFloatingToolbar';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';  // <-- ЭТО НОВЫЙ ИМПОРТ

export default function SortableBlock({
  id,
  block,
}: {
  id: string;
  block: Block;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const activeBlockId = useBuilderStore((state) => state.activeBlockId);
  const setActiveBlock = useBuilderStore((state) => state.setActiveBlock);

  const isActive = activeBlockId === id;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onClick={(event) => {
        event.stopPropagation();
        setActiveBlock(id);
      }}
      className={[
        'group relative cursor-default',
        isActive ? 'z-20 outline outline-2 outline-blue-500' : 'hover:outline hover:outline-1 hover:outline-blue-300',
      ].join(' ')}
    >
      <BlockFloatingToolbar
        blockId={id}
        active={isActive}
        dragAttributes={attributes}
        dragListeners={listeners}
      />

      {/* 🔥 ВОТ ЗДЕСЬ ОБОРАЧИВАЕМ BlockRenderer в ErrorBoundary */}
      <ErrorBoundary
        fallback={
          <div className="p-8 m-4 text-center text-red-400 border border-red-500/30 rounded-xl">
            ⚠️ Блок [{block.type}] не может быть отображён
          </div>
        }
      >
        <BlockRenderer block={block} editable />
      </ErrorBoundary>
    </div>
  );
}