import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SiteSettings from '@/components/dashboard/SiteSettings';

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: sites, error } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-950 p-8 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-red-400">{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-neutral-400">
            ← Назад в дашборд
          </Link>

          <h1 className="mt-3 text-3xl font-bold">Настройки сайтов</h1>
          <p className="mt-2 text-neutral-400">
            Управляй slug, публикацией, SEO и удалением сайтов.
          </p>
        </div>

        <div className="space-y-6">
          {sites?.length ? (
            sites.map((site) => <SiteSettings key={site.id} site={site} />)
          ) : (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-neutral-400">
              У тебя пока нет сайтов.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}