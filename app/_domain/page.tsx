import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Block, Site } from '@/types';
import BlockRenderer from '@/components/builder/blocks/BlockRenderer';

export default async function DomainSitePage({
  searchParams,
}: {
  searchParams: Promise<{
    host?: string;
  }>;
}) {
  const { host } = await searchParams;

  if (!host) notFound();

  const cleanHost = host
    .toLowerCase()
    .replace(/^www\./, '')
    .split(':')[0];

  const supabase = await createClient();

  const { data: domain, error } = await supabase
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

  if (error || !domain?.sites) {
    notFound();
  }

  const site = domain.sites as Site;

  if (site.status !== 'published') {
    notFound();
  }

  return (
    <main
      className="min-h-screen w-full"
      style={{
        fontFamily: site.theme?.font || 'Inter',
        backgroundColor: site.theme?.backgroundColor || '#ffffff',
        color: site.theme?.primaryColor || '#000000',
      }}
    >
      <div className="flex w-full flex-col">
        {site.blocks?.map((block: Block) => (
          <BlockRenderer key={block.id} block={block} siteId={site.id} />
        ))}
      </div>

      <div className="fixed bottom-4 right-4 rounded border bg-white px-3 py-1 text-xs text-black opacity-70 shadow-lg">
        Made with Corshun
      </div>
    </main>
  );
}