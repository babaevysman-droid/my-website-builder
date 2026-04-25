import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CreateSiteButton from '@/components/dashboard/CreateSiteButton';
import LogoutButton from '@/components/dashboard/LogoutButton';
import SitesFilter from '@/components/dashboard/SitesFilter';
import { PlanType } from '@/types';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const { data: sites } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const plan = (profile?.plan || 'free') as PlanType;
  const sitesCount = sites?.length || 0;

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Мои сайты</h1>
            <p className="text-neutral-400">
              Тариф: {plan} • сайтов: {sitesCount}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/domains"
              className="rounded-xl border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
            >
              Домены
            </Link>

            <Link
              href="/settings"
              className="rounded-xl border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
            >
              Настройки
            </Link>

            <Link
              href="/dashboard/leads"
              className="rounded-xl border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
            >
              Заявки
            </Link>

            <Link
              href="/dashboard/billing"
              className="rounded-xl border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
            >
              Тарифы
            </Link>

            <LogoutButton />

            <CreateSiteButton
              userId={user.id}
              plan={plan}
              sitesCount={sitesCount}
            />
          </div>
        </div>

        {sites && sites.length > 0 ? (
          <SitesFilter sites={sites} />
        ) : (
          <div className="mt-20 text-center text-neutral-400">
            У тебя пока нет сайтов
          </div>
        )}
      </div>
    </main>
  );
}