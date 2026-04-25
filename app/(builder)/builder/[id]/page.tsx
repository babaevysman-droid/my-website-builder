import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BuilderShell from '@/components/builder/BuilderShell';

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: site, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !site) redirect('/dashboard');

  return <BuilderShell site={site} />;
}