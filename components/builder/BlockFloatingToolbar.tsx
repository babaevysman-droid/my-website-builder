'use client';

import { useBuilderStore } from '@/store/useBuilderStore';
import AIRefineBlockButton from './AIRefineBlockButton';

export default function BlockFloatingToolbar({
  blockId,
  active,
  dragAttributes,
  dragListeners,
}: {
  blockId: string;
  active: boolean;
  dragAttributes: any;
  dragListeners: any;
}) {
  const removeBlock = useBuilderStore((state) => state.removeBlock);
  const duplicateBlock = useBuilderStore((state) => state.duplicateBlock);
  const moveBlockUp = useBuilderStore((state) => state.moveBlockUp);
  const moveBlockDown = useBuilderStore((state) => state.moveBlockDown);
  const openEditor = useBuilderStore((state) => state.openEditor);

  if (!active) return null;

  return (
    <div className="absolute left-3 top-3 z-40 flex items-center gap-1 rounded-lg bg-black/90 px-2 py-1.5 shadow-xl backdrop-blur">
      <button
        type="button"
        onClick={() => openEditor('content')}
        className="rounded-md px-2.5 py-1 text-[11px] font-semibold text-white/80 hover:bg-white/10 hover:text-white transition"
      >
        Контент
      </button>

      <button
        type="button"
        onClick={() => openEditor('settings')}
        className="rounded-md px-2.5 py-1 text-[11px] font-semibold text-white/80 hover:bg-white/10 hover:text-white transition"
      >
        Настройки
      </button>

      <div className="mx-0.5 h-4 w-px bg-white/20" />

      <button
        type="button"
        onClick={() => duplicateBlock(blockId)}
        className="rounded-md px-2 py-1 text-[11px] font-semibold text-white/60 hover:bg-white/10 hover:text-white transition"
        title="Дублировать"
      >
        ⧉
      </button>

      <button
        type="button"
        onClick={() => moveBlockUp(blockId)}
        className="rounded-md px-2 py-1 text-[11px] font-semibold text-white/60 hover:bg-white/10 hover:text-white transition"
        title="Вверх"
      >
        ↑
      </button>

      <button
        type="button"
        onClick={() => moveBlockDown(blockId)}
        className="rounded-md px-2 py-1 text-[11px] font-semibold text-white/60 hover:bg-white/10 hover:text-white transition"
        title="Вниз"
      >
        ↓
      </button>

      <div className="mx-0.5 h-4 w-px bg-white/20" />

      <AIRefineBlockButton blockId={blockId} />

      <button
        type="button"
        onClick={() => removeBlock(blockId)}
        className="rounded-md px-2 py-1 text-[11px] font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
        title="Удалить"
      >
        ✕
      </button>
    </div>
  );
}