'use client';

import { useEffect } from 'react';
import { Site } from '@/types';
import { useBuilderStore } from '@/store/useBuilderStore';
import BuilderTopbar, { PageSettingsModal } from './BuilderTopbar';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import AutoSave from './AutoSave';

export default function BuilderShell({ site }: { site: Site }) {
  const initSite = useBuilderStore((state) => state.initSite);
  const activePanel = useBuilderStore((state) => state.activePanel);
  const setActiveBlock = useBuilderStore((state) => state.setActiveBlock);
  const setActiveText = useBuilderStore((state) => state.setActiveText);
  const setActivePanel = useBuilderStore((state) => state.setActivePanel);
  const openEditor = useBuilderStore((state) => state.openEditor);

  useEffect(() => {
    initSite(site);
  }, [initSite, site]);

  useEffect(() => {
    function openProperties(event: Event) {
      const customEvent = event as CustomEvent<{
        tab?: 'content' | 'settings' | 'design' | 'media';
      }>;

      openEditor(customEvent.detail?.tab ?? 'content');
    }

    window.addEventListener('corshun:open-properties', openProperties);

    return () => {
      window.removeEventListener('corshun:open-properties', openProperties);
    };
  }, [openEditor]);

  return (
    <main className="h-screen overflow-hidden bg-[#eeeeee] text-black">
      <AutoSave />

      <BuilderTopbar site={site} />

      <div
        className="relative h-[calc(100vh-64px)] overflow-hidden"
        onClick={() => {
          setActiveBlock(null);
          setActiveText(null);
        }}
      >
        <Canvas />

        {activePanel === 'blocks' && (
          <div
            className="absolute left-0 top-0 z-40 h-full w-[420px] border-r border-black/10 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Sidebar onClose={() => setActivePanel(null)} />
          </div>
        )}

        {activePanel === 'editor' && (
          <div
            className="absolute left-0 top-0 z-50 h-full w-[520px] border-r border-black/10 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <PropertiesPanel />
          </div>
        )}

        {activePanel === 'settings' && (
          <PageSettingsModal
            site={site}
            onClose={() => setActivePanel(null)}
          />
        )}
      </div>
    </main>
  );
}