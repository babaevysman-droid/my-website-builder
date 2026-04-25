import { createClient } from '@/lib/supabase/server';

export async function getSiteByHost(host: string) {
  const supabase = await createClient();

  const cleanHost = host
    .toLowerCase()
    .replace(/^www\./, '')
    .split(':')[0];

  const { data: domain } = await supabase
    .from('custom_domains')
    .select(
      `
      *,
      sites (*)
    `
    )
    .eq('domain', cleanHost)
    .eq('status', 'verified')
    .single();

  if (!domain?.sites) {
    return null;
  }

  return domain.sites;
}