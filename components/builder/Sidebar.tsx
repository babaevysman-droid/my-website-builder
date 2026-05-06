'use client';

import { useMemo, useState } from 'react';
import { blockPresets, createBlockFromPreset } from '@/lib/blockPresets';
import { useBuilderStore } from '@/store/useBuilderStore';

const categories = ['Все', 'Основные', 'Продажи', 'Контент', 'Системные'] as const;

function PreviewMockup({ title }: { title: string }) {
  return (
    <div className="relative h-32 overflow-hidden rounded-2xl bg-gradient-to-br from-red-100 via-white to-black">
      <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.28),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.55),transparent_34%)]" />
      <div className="absolute left-5 top-5 h-3 w-24 rounded-full bg-black/80" />
      <div className="absolute left-5 top-12 h-8 w-40 rounded-xl bg-white/80" />
      <div className="absolute bottom-5 left-5 rounded-full bg-red-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
        {title}
      </div>
    </div>
  );
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const addBlock = useBuilderStore((state) => state.addBlock);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('Все');

  const filteredPresets = useMemo(() => {
    return blockPresets.filter((preset) => {
      const matchesCategory = category === 'Все' || preset.category === category;
      const search = query.toLowerCase().trim();

      const matchesQuery =
        !search ||
        preset.title.toLowerCase().includes(search) ||
        preset.description.toLowerCase().includes(search) ||
        preset.type.toLowerCase().includes(search);

      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  function handleAddBlock(preset: (typeof blockPresets)[number]) {
    addBlock(createBlockFromPreset(preset));
    onClose?.();
  }

  return (
    <aside className="flex h-full flex-col bg-white font-sans text-black">
      <div className="border-b border-black/10 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
              Blocks
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Библиотека
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg hover:bg-neutral-100"
          >
            ×
          </button>
        </div>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Найти блок..."
          className="mt-6 h-12 w-full rounded-2xl border border-black/10 bg-neutral-100 px-4 text-sm outline-none placeholder:text-black/35 focus:border-red-500"
        />

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={[
                'shrink-0 rounded-full px-4 py-2 text-xs font-black transition',
                category === item
                  ? 'bg-red-500 text-white'
                  : 'border border-black/10 bg-white text-black/55 hover:bg-neutral-100 hover:text-black',
              ].join(' ')}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {filteredPresets.map((preset) => (
          <button
            key={`${preset.type}-${preset.title}`}
            type="button"
            onClick={() => handleAddBlock(preset)}
            className="group w-full overflow-hidden rounded-3xl border border-black/10 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-400 hover:shadow-xl"
          >
            <div className="p-4">
              <PreviewMockup title={preset.preview} />
            </div>

            <div className="border-t border-black/10 p-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-red-500">
                {preset.category}
              </p>

              <h3 className="text-lg font-black tracking-tight text-black">
                {preset.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/45">
                {preset.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}