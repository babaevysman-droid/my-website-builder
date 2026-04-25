'use client';

import Link from 'next/link';
import { Site } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useBuilderStore } from '@/store/useBuilderStore';

export default function BuilderTopbar({ site }: { site: Site }) {
  const blocks = useBuilderStore((s) => s.blocks);
  const theme = useBuilderStore((s) => s.theme);
  const isSaving = useBuilderStore((s) => s.isSaving);
  const isDirty = useBuilderStore((s) => s.isDirty);
  const setSaving = useBuilderStore((s) => s.setSaving);
  const setDirty = useBuilderStore((s) => s.setDirty);

  async function save(status = site.status) {
    setSaving(true);

    const supabase = createClient();

    const { error } = await supabase
      .from('sites')
      .update({
        blocks,
        theme,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', site.id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setDirty(false);

    if (status === 'published') {
      alert('Сайт опубликован');
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-800 px-5">
      <div>
        <Link href="/dashboard" className="text-sm text-neutral-400">
          ← Дашборд
        </Link>

        <div className="flex items-center gap-3">
          <h1 className="font-semibold">{site.name}</h1>

          <span className="text-xs text-neutral-400">
            {isSaving
              ? 'Сохраняем...'
              : isDirty
                ? 'Есть несохранённые изменения'
                : 'Все изменения сохранены'}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/s/${site.slug}`}
          target="_blank"
          className="rounded-xl border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
        >
          Preview
        </Link>

        <button
          onClick={() => save('draft')}
          className="rounded-xl border border-neutral-700 px-4 py-2 text-sm"
        >
          Сохранить
        </button>

        <button
          onClick={() => save('published')}
          className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
        >
          Опубликовать
        </button>
      </div>
    </header>
  );
}