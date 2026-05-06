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
          ? 'На Free тарифе можно создать только 1 сайт. Позже можно будет обновить тариф.'
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
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 active:scale-[0.98]"
      >
        Создать сайт
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111114] p-6 text-white shadow-2xl shadow-black/40">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-red-400/80">
                  Новый проект
                </p>

                <h2 className="text-2xl font-semibold tracking-tight">
                  Создать сайт
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Выбери шаблон, задай название и открой редактор.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-white/65 transition hover:bg-white/[0.07] hover:text-white"
              >
                Закрыть
              </button>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm text-white/45">
                Название сайта
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: agency demo"
                className="h-11 w-full rounded-xl border border-white/10 bg-[#08080A] px-3 text-sm outline-none transition placeholder:text-white/30 focus:border-red-500/50"
              />
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-3">
              {siteTemplates.map((template) => {
                const active = selectedTemplateId === template.id;

                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={[
                      'rounded-2xl border p-4 text-left transition',
                      active
                        ? 'border-red-500/50 bg-red-500/10'
                        : 'border-white/10 bg-[#08080A] hover:border-white/20',
                    ].join(' ')}
                  >
                    <div className="mb-4 h-24 rounded-xl border border-white/10 bg-white/[0.03]" />

                    <h3 className="text-lg font-semibold">{template.name}</h3>

                    <p className="mt-2 text-sm leading-6 text-white/45">
                      {template.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/65 transition hover:bg-white/[0.07] hover:text-white"
              >
                Отмена
              </button>

              <button
                disabled={loading}
                onClick={createSite}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
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