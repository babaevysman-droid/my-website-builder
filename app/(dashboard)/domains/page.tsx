import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DomainsManager from '@/components/dashboard/DomainsManager';

export default async function DomainsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: sites } = await supabase
    .from('sites')
    .select('id, name, slug, status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: domains } = await supabase
    .from('custom_domains')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard" className="text-sm text-neutral-400">
          ← Назад в дашборд
        </Link>

        <h1 className="mt-4 text-3xl font-bold">Домены</h1>
        <p className="mt-2 text-neutral-400">
          Подключай собственные домены к опубликованным сайтам.
        </p>

        <DomainsManager sites={sites || []} domains={domains || []} />
      </div>
    </main>
  );
}