'use client';

import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Theme } from '@/types';
import { blockPresets, createBlockFromPreset } from '@/lib/blockPresets';
import { useBuilderStore } from '@/store/useBuilderStore';
import SortableBlock from './SortableBlock';

const fallbackTheme: Theme = {
  font: 'Inter',
  fontUrl: '',
  customFonts: [],
  textColor: '#000000',
  primaryColor: '#000000',
  backgroundColor: '#ffffff',
  radius: 16,
};

export default function Canvas() {
  const blocks = useBuilderStore((state) => state.blocks);
  const theme = useBuilderStore((state) => state.theme);
  const viewport = useBuilderStore((state) => state.viewport);
  const moveBlock = useBuilderStore((state) => state.moveBlock);
  const addBlockAt = useBuilderStore((state) => state.addBlockAt);

  const safeTheme: Theme = {
    ...fallbackTheme,
    ...(theme ?? {}),
    customFonts: theme?.customFonts ?? [],
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    moveBlock(String(active.id), String(over.id));
  }

  function addDefaultBlock(index: number) {
    addBlockAt(createBlockFromPreset(blockPresets[0]), index);
  }

  const canvasWidth = viewport === 'mobile' ? 390 : '100%';

  return (
    // В return найди div с overflow-y-auto и замени класс bg:
<div className="h-full overflow-y-auto bg-[#08080A]">
      {safeTheme.customFonts?.map((font) => (
        <link key={font.name} href={font.url} rel="stylesheet" />
      ))}

      {safeTheme.fontUrl && <link href={safeTheme.fontUrl} rel="stylesheet" />}

      <div
        className={[
          'mx-auto min-h-full bg-white shadow-sm transition-all duration-300',
          viewport === 'mobile' ? 'my-5 overflow-hidden rounded-[28px]' : '',
        ].join(' ')}
        style={{
          width: canvasWidth,
          fontFamily: safeTheme.font,
          backgroundColor: safeTheme.backgroundColor,
          color: safeTheme.textColor || safeTheme.primaryColor,
        }}
      >
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={blocks.map((block) => block.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="w-full">
              {blocks.map((block, index) => (
                <div key={block.id} className="group/insert relative">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      addDefaultBlock(index);
                    }}
                    className="absolute left-1/2 top-0 z-40 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black font-sans text-lg font-bold text-white opacity-0 shadow-xl transition hover:scale-110 group-hover/insert:opacity-100"
                    title="Добавить блок ниже"
                  >
                    +
                  </button>

                  <SortableBlock id={block.id} block={block} />
                </div>
              ))}

              {blocks.length === 0 && (
                <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      addDefaultBlock(-1);
                    }}
                    className="rounded-2xl bg-black px-6 py-4 font-sans text-sm font-bold text-white shadow-xl transition hover:bg-neutral-800"
                  >
                    + Добавить первый блок
                  </button>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}