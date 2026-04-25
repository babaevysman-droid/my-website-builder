'use client';

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useBuilderStore } from '@/store/useBuilderStore';
import SortableBlock from './SortableBlock';

export default function Canvas() {
  const blocks = useBuilderStore((s) => s.blocks);
  const moveBlock = useBuilderStore((s) => s.moveBlock);
  const theme = useBuilderStore((s) => s.theme);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    moveBlock(String(active.id), String(over.id));
  }

  return (
    <main className="overflow-y-auto bg-neutral-100 p-8 text-black">
      <div
        className="mx-auto min-h-full max-w-5xl rounded-3xl shadow-xl"
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.primaryColor,
          fontFamily: theme.font,
        }}
      >
        {blocks.length === 0 ? (
          <div className="flex h-[600px] items-center justify-center text-neutral-400">
            Добавь первый блок слева
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {blocks.map((block) => (
                <SortableBlock key={block.id} block={block} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </main>
  );
}