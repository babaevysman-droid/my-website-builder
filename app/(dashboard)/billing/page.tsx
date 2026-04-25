import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BillingPlans from '@/components/dashboard/BillingPlans';

export default async function BillingPage() {
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

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Тарифы</h1>
        <p className="mt-2 text-neutral-400">
          Выбери тариф под свой проект
        </p>

        <BillingPlans currentPlan={profile?.plan || 'free'} />
      </div>
    </main>
  );
}