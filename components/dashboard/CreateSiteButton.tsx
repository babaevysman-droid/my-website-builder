'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PlanType } from '@/types';
import { canCreateSite } from '@/lib/plans';
import { siteTemplates } from '@/lib/templates';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cloneBlocks(blocks: typeof siteTemplates[number]['blocks']) {
  return blocks.map((block) => ({
    ...block,
    id: crypto.randomUUID(),
    props: JSON.parse(JSON.stringify(block.props)),
  }));
}

export default function CreateSiteButton({
  userId,
  plan,
  sitesCount,
}: {
  userId: string;
  plan: PlanType;
  sitesCount: number;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('saas');
  const [loading, setLoading] = useState(false);

  async function createSite() {
    if (!canCreateSite(plan, sitesCount)) {
      alert(
        plan === 'free'
          ? 'На Free тарифе можно создать только 1 сайт. Обнови тариф до Pro.'
          : 'Ты достиг лимита сайтов на текущем тарифе.'
      );
      return;
    }

    const template = siteTemplates.find((item) => item.id === selectedTemplateId);

    if (!template) {
      alert('Шаблон не найден');
      return;
    }

    if (!name.trim()) {
      alert('Введите название сайта');
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const slugBase = slugify(name);
    const slug = `${slugBase || 'site'}-${Math.random().toString(36).slice(2, 7)}`;

    const { data, error } = await supabase
      .from('sites')
      .insert({
        user_id: userId,
        name: name.trim(),
        slug,
        status: 'draft',
        theme: template.theme,
        blocks: cloneBlocks(template.blocks),
        seo_title: name.trim(),
        seo_description: template.description,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setOpen(false);
    router.push(`/builder/${data.id}`);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-white px-5 py-3 font-medium text-black"
      >
        Создать сайт
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl rounded-3xl border border-neutral-800 bg-neutral-950 p-6 text-white shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">Создать сайт</h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Выбери шаблон и задай название проекта.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-800"
              >
                Закрыть
              </button>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm text-neutral-400">
                Название сайта
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: demo landing"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 outline-none focus:border-white"
              />
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-3">
              {siteTemplates.map((template) => {
                const active = selectedTemplateId === template.id;

                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      active
                        ? 'border-white bg-neutral-900'
                        : 'border-neutral-800 bg-neutral-900 hover:border-neutral-500'
                    }`}
                  >
                    <div className="mb-4 h-28 rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-800 to-neutral-950" />

                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="mt-2 text-sm text-neutral-400">
                      {template.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-neutral-700 px-5 py-3 text-sm hover:bg-neutral-800"
              >
                Отмена
              </button>

              <button
                disabled={loading}
                onClick={createSite}
                className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-60"
              >
                {loading ? 'Создаём...' : 'Создать и открыть редактор'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}