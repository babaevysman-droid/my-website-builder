'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function normalizeDomain(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}

export default function DomainsManager({
  sites,
  domains,
}: {
  sites: any[];
  domains: any[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [siteId, setSiteId] = useState(sites[0]?.id || '');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);

  async function addDomain() {
    const cleanDomain = normalizeDomain(domain);

    if (!siteId) {
      alert('Сначала создай сайт');
      return;
    }

    if (!cleanDomain || !cleanDomain.includes('.')) {
      alert('Введите корректный домен, например example.ru');
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      alert('Не авторизован');
      return;
    }

    const { error } = await supabase.from('custom_domains').insert({
      site_id: siteId,
      user_id: user.id,
      domain: cleanDomain,
      status: 'pending',
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setDomain('');
    router.refresh();
  }

  async function deleteDomain(id: string) {
    if (!confirm('Удалить домен?')) return;

    const { error } = await supabase
      .from('custom_domains')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  async function markVerified(id: string) {
    const { error } = await supabase
      .from('custom_domains')
      .update({ status: 'verified' })
      .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="text-xl font-semibold">Добавить домен</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <select
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name} /{site.slug}
              </option>
            ))}
          </select>

          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.ru"
            className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
          />

          <button
            disabled={loading}
            onClick={addDomain}
            className="rounded-xl bg-white px-5 py-3 font-medium text-black disabled:opacity-60"
          >
            {loading ? 'Добавляем...' : 'Добавить'}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="text-xl font-semibold">DNS-настройка</h2>

        <p className="mt-3 text-sm text-neutral-400">
          У регистратора домена добавь эти записи:
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-950 text-neutral-400">
              <tr>
                <th className="p-3">Тип</th>
                <th className="p-3">Имя</th>
                <th className="p-3">Значение</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-neutral-800">
                <td className="p-3">CNAME</td>
                <td className="p-3">www</td>
                <td className="p-3">cname.vercel-dns.com</td>
              </tr>
              <tr className="border-t border-neutral-800">
                <td className="p-3">A</td>
                <td className="p-3">@</td>
                <td className="p-3">76.76.21.21</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        {domains.length === 0 && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-400">
            Домены пока не добавлены.
          </div>
        )}

        {domains.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{item.domain}</h3>
                <p className="mt-1 text-sm text-neutral-400">
                  Site ID: {item.site_id}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  item.status === 'verified'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {item.status === 'verified' ? 'Verified' : 'Pending'}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => markVerified(item.id)}
                className="rounded-xl border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
              >
                Пометить verified
              </button>

              <button
                onClick={() => deleteDomain(item.id)}
                className="rounded-xl border border-red-500 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}