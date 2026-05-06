import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Block, Site, Theme } from '@/types';
import BlockRenderer from '@/components/builder/blocks/BlockRenderer';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const defaultTheme: Theme = {
  font: 'Inter',
  fontUrl: '',
  customFonts: [],
  textColor: '#000000',
  primaryColor: '#000000',
  backgroundColor: '#ffffff',
  radius: 16,
};

function normalizeTheme(theme?: Partial<Theme> | null): Theme {
  return {
    ...defaultTheme,
    ...(theme ?? {}),
    customFonts: theme?.customFonts ?? [],
  };
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

  if (!site) return { title: 'Site Not Found' };

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
  const theme = normalizeTheme(site.theme);
  const customFonts = theme.customFonts ?? [];

  return (
    <>
      {customFonts.map((font) => (
        <link key={font.name} href={font.url} rel="stylesheet" />
      ))}

      {theme.fontUrl && <link href={theme.fontUrl} rel="stylesheet" />}

      <main
        className="min-h-screen w-full"
        style={{
          fontFamily: theme.font || 'Inter',
          backgroundColor: theme.backgroundColor || '#ffffff',
          color: theme.textColor || '#000000',
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
    </>
  );
}