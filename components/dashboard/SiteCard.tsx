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
  };
}) {
  const router = useRouter();

  async function deleteSite() {
    const confirmed = confirm('Удалить сайт?');
    if (!confirmed) return;

    const supabase = createClient();

    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', site.id);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{site.name}</h2>
        <p className="text-sm text-neutral-400">/{site.slug}</p>
      </div>

      <div className="mb-4">
        <span
          className={`rounded-full px-3 py-1 text-xs ${
            site.status === 'published'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          {site.status === 'published' ? 'Опубликован' : 'Черновик'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => router.push(`/builder/${site.id}`)}
          className="rounded-xl bg-white px-4 py-2 text-sm text-black"
        >
          Редактировать
        </button>

        {site.status === 'published' && (
          <button
            onClick={() => window.open(`/s/${site.slug}`, '_blank')}
            className="rounded-xl border border-neutral-700 px-4 py-2 text-sm"
          >
            Открыть
          </button>
        )}

        <button
          onClick={deleteSite}
          className="rounded-xl border border-red-500 px-4 py-2 text-sm text-red-400"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}