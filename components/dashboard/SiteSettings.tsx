'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function SiteSettings({ site }: { site: any }) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState(site.name || '');
  const [slug, setSlug] = useState(site.slug || '');
  const [seoTitle, setSeoTitle] = useState(site.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(
    site.seo_description || ''
  );
  const [status, setStatus] = useState<'draft' | 'published'>(
    site.status || 'draft'
  );
  const [saving, setSaving] = useState(false);

  async function save() {
    const cleanSlug = normalizeSlug(slug);

    if (!name.trim()) {
      alert('Название сайта обязательно');
      return;
    }

    if (!cleanSlug) {
      alert('Slug обязателен и должен быть латиницей');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('sites')
      .update({
        name: name.trim(),
        slug: cleanSlug,
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', site.id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSlug(cleanSlug);
    router.refresh();
    alert('Настройки сохранены');
  }

  async function toggleStatus() {
    const nextStatus = status === 'published' ? 'draft' : 'published';

    setSaving(true);

    const { error } = await supabase
      .from('sites')
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', site.id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setStatus(nextStatus);
    router.refresh();
  }

  async function remove() {
    const confirmed = confirm(
      `Удалить сайт "${site.name}"? Это действие нельзя отменить.`
    );

    if (!confirmed) return;

    const { error } = await supabase.from('sites').delete().eq('id', site.id);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{site.name}</h2>
          <p className="mt-1 text-sm text-neutral-400">/{site.slug}</p>
        </div>

        <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs">
          {status === 'published' ? 'Опубликован' : 'Черновик'}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-neutral-400">
            Название сайта
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-400">
            Slug
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onBlur={() => setSlug(normalizeSlug(slug))}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-white"
            placeholder="my-site"
          />
          <p className="mt-2 text-xs text-neutral-500">
            Только латиница, цифры и дефисы. Публичная ссылка: /s/
            {normalizeSlug(slug) || 'your-slug'}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-400">
            SEO Title
          </label>
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-white"
            placeholder="Лучший сайт для..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-400">
            SEO Description
          </label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-white"
            placeholder="Краткое описание сайта для поисковиков и соцсетей"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
          >
            {saving ? 'Сохраняем...' : 'Сохранить настройки'}
          </button>

          <button
            onClick={toggleStatus}
            disabled={saving}
            className="rounded-xl border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800 disabled:opacity-60"
          >
            {status === 'published' ? 'Снять с публикации' : 'Опубликовать'}
          </button>

          <Link
            href={`/builder/${site.id}`}
            className="rounded-xl border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
          >
            Редактор
          </Link>

          <Link
            href={`/s/${normalizeSlug(slug)}`}
            target="_blank"
            className="rounded-xl border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
          >
            Preview
          </Link>

          <button
            onClick={remove}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}