'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SiteCard({
  site,
}: {
  site: {
    id: string;
    name: string;
    slug: string;
    status: 'draft' | 'published';
    updated_at?: string;
  };
}) {
  const router = useRouter();

  async function deleteSite() {
    const confirmed = confirm(`Удалить сайт "${site.name}"?`);
    if (!confirmed) return;

    const supabase = createClient();

    const { error } = await supabase.from('sites').delete().eq('id', site.id);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#111114] transition hover:border-white/20">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span
            className={[
              'rounded-full px-2 py-0.5 text-xs font-medium',
              site.status === 'published'
                ? 'bg-red-500/10 text-red-300'
                : 'bg-white/10 text-white/45',
            ].join(' ')}
          >
            {site.status === 'published' ? 'Published' : 'Draft'}
          </span>

          <span className="text-xs text-white/30">/{site.slug}</span>
        </div>

        <h2 className="text-xl font-semibold tracking-tight">{site.name}</h2>

        <p className="mt-1 text-sm text-white/35">
          {site.status === 'published'
            ? 'Сайт доступен по публичной ссылке.'
            : 'Сайт пока находится в черновике.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push(`/builder/${site.id}`)}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-white/65 transition hover:bg-white/[0.07] hover:text-white"
          >
            Редактор
          </button>

          {site.status === 'published' && (
            <button
              onClick={() => window.open(`/s/${site.slug}`, '_blank')}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-white/65 transition hover:bg-white/[0.07] hover:text-white"
            >
              Открыть
            </button>
          )}
        </div>

        <button
          onClick={deleteSite}
          className="text-sm text-red-300 transition hover:text-red-200"
        >
          Удалить
        </button>
      </div>
    </article>
  );
}