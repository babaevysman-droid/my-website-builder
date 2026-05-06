type UnsplashPhoto = {
  urls?: {
    raw?: string;
    full?: string;
    regular?: string;
    small?: string;
  };
};

type UnsplashSearchResponse = {
  results?: UnsplashPhoto[];
};

export async function findUnsplashImage(query: string) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey || !query.trim()) {
    return '';
  }

  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '1');
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('content_filter', 'high');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      'Accept-Version': 'v1',
    },
    next: {
      revalidate: 86400,
    },
  });

  if (!response.ok) {
    return '';
  }

  const data = (await response.json()) as UnsplashSearchResponse;
  const photo = data.results?.[0];

  return photo?.urls?.regular || photo?.urls?.full || photo?.urls?.raw || '';
}