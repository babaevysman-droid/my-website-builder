import { createClient } from '@/lib/supabase/client';

export async function uploadSiteImage(file: File, siteId?: string | null) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Можно загрузить только изображение.');
  }

  const supabase = createClient();

  const ext = file.name.split('.').pop() || 'png';
  const safeSiteId = siteId || 'draft';
  const path = `${safeSiteId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from('site-media')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from('site-media').getPublicUrl(path);

  return data.publicUrl;
}