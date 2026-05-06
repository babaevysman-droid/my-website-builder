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
    <main className="min-h-screen bg-[#08080A] text-white">
      <header className="border-b border-white/10 bg-[#0b0b0d]">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-5">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            Corshun<span className="text-red-500">.</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-8 text-[13px] font-medium text-white/55 md:flex">
            <Link href="/domains" className="transition hover:text-white">
              Домены
            </Link>
            <Link href="/settings" className="transition hover:text-white">
              Настройки
            </Link>
            <Link href="/dashboard/leads" className="transition hover:text-white">
              Заявки
            </Link>
            <Link href="/billing" className="transition hover:text-white">
              Тарифы
            </Link>
          </nav>

          <div className="ml-6">
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute right-0 top-0 hidden h-full w-[48%] overflow-hidden lg:block">
          <img
            src="/dashboard-hero.jpg"
            alt=""
            className="h-full w-full scale-105 object-cover opacity-35 blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#08080A]/20 via-[#08080A]/65 to-[#08080A]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-[#08080A]/40" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl items-end justify-between gap-6 px-5 py-10">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-red-400/80">
              Dashboard
            </p>

            <h1 className="text-4xl font-semibold tracking-tight">
              Мои сайты
            </h1>

            <p className="mt-3 text-white/45">
              Тариф: <span className="text-white">{plan}</span> · сайтов:{' '}
              <span className="text-white">{sitesCount}</span>
            </p>
          </div>

          <CreateSiteButton
            userId={user.id}
            plan={plan}
            sitesCount={sitesCount}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        {sites && sites.length > 0 ? (
          <SitesFilter sites={sites} />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#111114] p-8 text-center">
            <h2 className="text-xl font-semibold">Создай первый сайт</h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
              Выбери шаблон, настрой блоки и открой редактор.
            </p>

            <div className="mt-5 flex justify-center">
              <CreateSiteButton
                userId={user.id}
                plan={plan}
                sitesCount={sitesCount}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}