import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function LeadsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: leads, error } = await supabase
    .from('leads')
    .select(`
      id,
      data,
      created_at,
      sites (
        id,
        name,
        slug,
        user_id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-950 p-8 text-white">
        <p className="text-red-400">{error.message}</p>
      </main>
    );
  }

  const ownLeads =
    leads?.filter((lead: any) => lead.sites?.user_id === user.id) || [];

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-sm text-neutral-400">
              ← Назад
            </Link>
            <h1 className="mt-2 text-3xl font-bold">Заявки</h1>
            <p className="text-neutral-400">
              Все заявки с опубликованных сайтов.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {ownLeads.length === 0 && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-neutral-400">
              Заявок пока нет.
            </div>
          )}

          {ownLeads.map((lead: any) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {lead.data?.name || 'Без имени'}
                  </h2>
                  <p className="text-sm text-neutral-400">
                    {lead.data?.email}
                  </p>
                </div>

                <div className="text-right text-sm text-neutral-500">
                  <p>{lead.sites?.name}</p>
                  <p>{new Date(lead.created_at).toLocaleString('ru-RU')}</p>
                </div>
              </div>

              {lead.data?.message && (
                <p className="rounded-xl bg-neutral-950 p-4 text-neutral-300">
                  {lead.data.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}