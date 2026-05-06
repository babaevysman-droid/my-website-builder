'use client';

import SiteCard from './SiteCard';

export default function SitesFilter({ sites }: { sites: any[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
}