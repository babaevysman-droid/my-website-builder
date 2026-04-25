import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Block, Site } from '@/types';
import BlockRenderer from '@/components/builder/blocks/BlockRenderer';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: site } = await supabase
    .from('sites')
    .select('name, seo_title, seo_description')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!site) {
    return {
      title: 'Site Not Found',
    };
  }

  const title = site.seo_title || site.name;
  const description = site.seo_description || '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

function renderBlock(block: Block, siteId: string) {
  return <BlockRenderer key={block.id} block={block} siteId={siteId} />;
}

export default async function PublicSitePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    notFound();
  }

  const site = data as Site;

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
        {site.blocks?.map((block) => renderBlock(block, site.id))}
      </div>

      <div className="fixed bottom-4 right-4 rounded border bg-white px-3 py-1 text-xs text-black opacity-70 shadow-lg">
        Made with Builder
      </div>
    </main>
  );
}