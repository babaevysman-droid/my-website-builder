'use client';

import AIGenerateSiteButton from './AIGenerateSiteButton';
import ExportProjectButton from './ExportProjectButton';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Site } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useBuilderStore } from '@/store/useBuilderStore';

function runCommand(command: string, value?: string) {
  document.execCommand(command, false, value);
}

function TextButton({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title?: string }) {
  return (
    <button type="button" title={title} onMouseDown={(e) => e.preventDefault()} onClick={onClick}
      className="flex h-6 w-6 items-center justify-center rounded text-[11px] text-white/40 hover:bg-white/10 hover:text-white transition">
      {children}
    </button>
  );
}

export function PageSettingsModal({ site, onClose }: { site: Site; onClose: () => void }) {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<'main' | 'seo' | 'actions'>('main');
  const [name, setName] = useState(site.name);
  const [slug, setSlug] = useState(site.slug);
  const [seoTitle, setSeoTitle] = useState(site.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(site.seo_description || '');
  const [loading, setLoading] = useState(false);

  async function saveSettings() {
    setLoading(true);
    const { error } = await supabase.from('sites').update({ name: name.trim(), slug: slug.trim(), seo_title: seoTitle.trim(), seo_description: seoDescription.trim(), updated_at: new Date().toISOString() }).eq('id', site.id);
    setLoading(false);
    if (error) { alert(error.message); return; }
    router.refresh(); onClose();
  }

  async function unpublish() {
    const { error } = await supabase.from('sites').update({ status: 'draft', updated_at: new Date().toISOString() }).eq('id', site.id);
    if (error) { alert(error.message); return; }
    router.refresh(); onClose();
  }

  return (
    <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[720px] max-w-[calc(100vw-40px)] overflow-hidden rounded-2xl border border-white/10 bg-[#111114] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-red-400/80">Настройки</p>
            <h2 className="mt-0.5 text-lg font-semibold">{site.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition">×</button>
        </div>
        <div className="grid grid-cols-[180px_1fr]">
          <aside className="border-r border-white/10 bg-[#08080A] p-3">
            {['main', 'seo', 'actions'].map((key) => (
              <button key={key} type="button" onClick={() => setTab(key as any)}
                className={['mb-1 w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition', tab === key ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'].join(' ')}>
                {key === 'main' ? 'Главное' : key === 'seo' ? 'SEO' : 'Действия'}
              </button>
            ))}
          </aside>
          <section className="min-h-[300px] p-6">
            {tab === 'main' && (
              <div className="space-y-4">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название"
                  className="h-9 w-full rounded-lg border border-white/10 bg-[#08080A] px-3 text-sm text-white outline-none focus:border-red-500/50 transition placeholder:text-white/20" />
                <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug"
                  className="h-9 w-full rounded-lg border border-white/10 bg-[#08080A] px-3 text-sm text-white outline-none focus:border-red-500/50 transition placeholder:text-white/20" />
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/40">
                  Ссылка: <span className="text-white/70">/s/{slug || site.slug}</span>
                </div>
              </div>
            )}
            {tab === 'seo' && (
              <div className="space-y-4">
                <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="SEO title"
                  className="h-9 w-full rounded-lg border border-white/10 bg-[#08080A] px-3 text-sm text-white outline-none focus:border-red-500/50 transition placeholder:text-white/20" />
                <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={4} placeholder="SEO description"
                  className="w-full resize-none rounded-lg border border-white/10 bg-[#08080A] px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 transition placeholder:text-white/20" />
              </div>
            )}
            {tab === 'actions' && (
              <div className="space-y-2">
                <button type="button" onClick={() => window.open(`/s/${site.slug}`, '_blank')}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-left text-xs text-white/60 hover:bg-white/[0.07] hover:text-white transition">Открыть сайт</button>
                <button type="button" onClick={unpublish}
                  className="w-full rounded-lg border border-red-500/20 px-4 py-2.5 text-left text-xs text-red-300 hover:bg-red-500/10 transition">Снять с публикации</button>
              </div>
            )}
          </section>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-white/10 px-6 py-3">
          <button type="button" onClick={onClose}
            className="h-8 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-white/50 hover:bg-white/[0.07] hover:text-white transition">Закрыть</button>
          <button type="button" disabled={loading} onClick={saveSettings}
            className="h-8 rounded-lg bg-red-600 px-3 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50 transition">{loading ? '...' : 'Сохранить'}</button>
        </div>
      </div>
    </div>
  );
}

export default function BuilderTopbar({ site }: { site: Site }) {
  const router = useRouter();
  const supabase = createClient();
  const blocks = useBuilderStore((s) => s.blocks);
  const theme = useBuilderStore((s) => s.theme);
  const isDirty = useBuilderStore((s) => s.isDirty);
  const isSaving = useBuilderStore((s) => s.isSaving);
  const activeText = useBuilderStore((s) => s.activeText);
  const activePanel = useBuilderStore((s) => s.activePanel);
  const viewport = useBuilderStore((s) => s.viewport);
  const past = useBuilderStore((s) => s.past);
  const future = useBuilderStore((s) => s.future);
  const setSaving = useBuilderStore((s) => s.setSaving);
  const setDirty = useBuilderStore((s) => s.setDirty);
  const setActivePanel = useBuilderStore((s) => s.setActivePanel);
  const setViewport = useBuilderStore((s) => s.setViewport);
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const [settingsOpen, setSettingsOpen] = useState(false);

  async function saveSite() {
    setSaving(true);
    const { error } = await supabase.from('sites').update({ blocks, theme, updated_at: new Date().toISOString() }).eq('id', site.id);
    setSaving(false);
    if (error) { alert(error.message); return false; }
    setDirty(false); router.refresh(); return true;
  }

  async function previewSite() { const ok = await saveSite(); if (ok) window.open(`/s/${site.slug}`, '_blank'); }
  async function publishSite() { const ok = await saveSite(); if (!ok) return; await supabase.from('sites').update({ status: 'published', updated_at: new Date().toISOString() }).eq('id', site.id); window.open(`/s/${site.slug}`, '_blank'); }

  const btnBase = "h-7 rounded-lg text-[11px] font-medium transition";

  return (
    <header className="relative z-50 flex h-10 items-center border-b border-white/10 bg-[#0b0b0d] text-white">
      {/* Лево */}
      <div className="flex h-full items-center gap-2 border-r border-white/10 px-3">
        <Link href="/dashboard" className="text-xs text-white/40 hover:text-white transition">⌂</Link>
        <span className="text-white/15">/</span>
        <span className="text-[11px] font-medium text-white/60 truncate max-w-[120px]">{site.name}</span>
        <span className="text-[10px] text-white/25">{isSaving ? '...' : isDirty ? '●' : ''}</span>
      </div>

      {/* Вьюпорт */}
      <div className="flex h-full items-center gap-0.5 border-r border-white/10 px-2">
        <button type="button" onClick={() => setViewport('mobile')}
          className={['flex h-6 w-6 items-center justify-center rounded text-xs transition', viewport === 'mobile' ? 'bg-white/10 text-white' : 'text-white/25 hover:bg-white/5 hover:text-white/50'].join(' ')}>▯</button>
        <button type="button" onClick={() => setViewport('desktop')}
          className={['flex h-6 w-6 items-center justify-center rounded text-xs transition', viewport === 'desktop' ? 'bg-white/10 text-white' : 'text-white/25 hover:bg-white/5 hover:text-white/50'].join(' ')}>◲</button>
      </div>

      {/* Форматирование */}
      <div className="flex h-full flex-1 items-center justify-center overflow-hidden border-r border-white/10 px-2">
        {activeText ? (
          <div className="flex items-center gap-0.5">
            <TextButton title="Bold" onClick={() => runCommand('bold')}>B</TextButton>
            <TextButton title="Italic" onClick={() => runCommand('italic')}><span className="italic">I</span></TextButton>
            <TextButton title="Underline" onClick={() => runCommand('underline')}><span className="underline">U</span></TextButton>
            <TextButton title="Link" onClick={() => { const url = prompt('Ссылка'); if (url) runCommand('createLink', url); }}>🔗</TextButton>
            <span className="w-px h-3 bg-white/10 mx-0.5" />
            <TextButton title="Left" onClick={() => runCommand('justifyLeft')}>≡</TextButton>
            <TextButton title="Center" onClick={() => runCommand('justifyCenter')}>≣</TextButton>
            <TextButton title="Right" onClick={() => runCommand('justifyRight')}>≡</TextButton>
          </div>
        ) : (
          <span className="text-[10px] text-white/20">Кликни по тексту для форматирования</span>
        )}
      </div>

      {/* Право */}
      <div className="flex h-full items-center gap-1 px-2">
        <button type="button" disabled={past.length === 0} onClick={undo}
          className="h-6 w-6 rounded text-xs text-white/25 hover:bg-white/5 hover:text-white/50 disabled:opacity-20 transition">↶</button>
        <button type="button" disabled={future.length === 0} onClick={redo}
          className="h-6 w-6 rounded text-xs text-white/25 hover:bg-white/5 hover:text-white/50 disabled:opacity-20 transition">↷</button>

        <button type="button" onClick={() => setActivePanel(activePanel === 'blocks' ? null : 'blocks')}
          className={[btnBase, 'px-2.5 border border-white/10', activePanel === 'blocks' ? 'bg-white/10 text-white' : 'text-white/45 hover:bg-white/5 hover:text-white/70'].join(' ')}>+ Блоки</button>

        <AIGenerateSiteButton />
        <ExportProjectButton />

        <button type="button" onClick={previewSite}
          className={[btnBase, 'px-2.5 border border-white/10 text-white/45 hover:bg-white/5 hover:text-white/70'].join(' ')}>Превью</button>
        <button type="button" onClick={publishSite}
          className={[btnBase, 'px-2.5 bg-red-600 text-white hover:bg-red-500'].join(' ')}>Публикация</button>
        <button type="button" onClick={() => setSettingsOpen(true)}
          className={[btnBase, 'px-2 border border-white/10 text-white/45 hover:bg-white/5 hover:text-white/70'].join(' ')}>⋮</button>
      </div>

      {settingsOpen && <PageSettingsModal site={site} onClose={() => setSettingsOpen(false)} />}
    </header>
  );
}