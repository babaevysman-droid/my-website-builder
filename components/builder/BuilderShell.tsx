'use client';

import { useEffect } from 'react';
import { Site } from '@/types';
import { useBuilderStore } from '@/store/useBuilderStore';

import Sidebar from './Sidebar';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import BuilderTopbar from './BuilderTopbar';
import AutoSave from './AutoSave';

export default function BuilderShell({ site }: { site: Site }) {
  const initSite = useBuilderStore((s) => s.initSite);

  useEffect(() => {
    initSite(site);
  }, [site, initSite]);

  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-white">
      <AutoSave />

      <BuilderTopbar site={site} />

      <div className="grid min-h-0 flex-1 grid-cols-[260px_1fr_320px]">
        <Sidebar />
        <Canvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}