'use client';

import { useState } from 'react';
import SiteCard from './SiteCard';

export default function SitesFilter({ sites }: { sites: any[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'draft' | 'published'>('all');

  const filtered = sites.filter((site) => {
    const matchesQuery = site.name
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesStatus = status === 'all' || site.status === status;

    return matchesQuery && matchesStatus;
  });

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          placeholder="Поиск..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2"
        >
          <option value="all">Все</option>
          <option value="draft">Черновики</option>
          <option value="published">Опубликованные</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      ) : (
        <div className="mt-20 text-center text-neutral-400">
          Ничего не найдено
        </div>
      )}
    </>
  );
}