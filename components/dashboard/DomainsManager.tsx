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

    const { error } = await supabase.from('custom_domains').delete().eq('id', id);

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
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111114]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Добавить домен клиента
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-white/45">
            Свяжи домен с сайтом. После DNS-настройки домен будет открывать
            опубликованную страницу.
          </p>
        </div>

        <div className="grid gap-3 px-5 py-5 md:grid-cols-[1fr_1fr_auto]">
          <select
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-[#08080A] px-3 text-sm text-white outline-none transition focus:border-red-500/50"
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
            placeholder="client-domain.ru"
            className="h-11 rounded-xl border border-white/10 bg-[#08080A] px-3 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-red-500/50"
          />

          <button
            disabled={loading}
            onClick={addDomain}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {loading ? 'Добавляем...' : 'Добавить'}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111114]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-xl font-semibold tracking-tight">
            DNS для клиента
          </h2>

          <p className="mt-1 text-sm leading-6 text-white/45">
            Эти записи клиент добавляет у регистратора домена.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-[#08080A] text-white/35">
              <tr>
                <th className="px-5 py-3 font-medium">Тип</th>
                <th className="px-5 py-3 font-medium">Имя</th>
                <th className="px-5 py-3 font-medium">Значение</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              <tr>
                <td className="px-5 py-4 font-medium text-white">A</td>
                <td className="px-5 py-4 text-white/65">@</td>
                <td className="px-5 py-4 text-white/65">216.198.79.1</td>
              </tr>

              <tr>
                <td className="px-5 py-4 font-medium text-white">CNAME</td>
                <td className="px-5 py-4 text-white/65">www</td>
                <td className="px-5 py-4 text-white/65">
                  f2576c776fc05e50.vercel-dns-017.com
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border-t border-white/10 px-5 py-3">
          <p className="text-xs leading-5 text-white/35">
            Если Vercel показывает другие DNS-записи — используй значения из
            Vercel.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        {domains.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#111114] p-8 text-center">
            <h3 className="text-lg font-semibold">Домены пока не добавлены</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
              Добавь первый клиентский домен и свяжи его с опубликованным сайтом.
            </p>
          </div>
        )}

        {domains.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#111114]"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={[
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      item.status === 'verified'
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : 'bg-white/10 text-white/45',
                    ].join(' ')}
                  >
                    {item.status === 'verified' ? 'Verified' : 'Pending'}
                  </span>
                </div>

                <h3 className="text-xl font-semibold tracking-tight">
                  {item.domain}
                </h3>

                <p className="mt-1 text-sm text-white/35">
                  Site ID: {item.site_id}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => markVerified(item.id)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-white/65 transition hover:bg-white/[0.07] hover:text-white"
                >
                  Verified
                </button>

                <button
                  onClick={() => window.open(`https://${item.domain}`, '_blank')}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-white/65 transition hover:bg-white/[0.07] hover:text-white"
                >
                  Открыть
                </button>

                <button
                  onClick={() => deleteDomain(item.id)}
                  className="rounded-lg border border-red-500/20 px-3.5 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                >
                  Удалить
                </button>
              </div>
            </div>

            {item.verification_token && (
              <div className="px-5 py-3 text-xs text-white/35">
                Token: {item.verification_token}
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}