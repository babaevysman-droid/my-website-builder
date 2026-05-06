'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { themePresets } from '@/lib/themePresets';
import { uploadSiteImage } from '@/lib/supabase/uploadImage';
import AIRefineFieldButton from '@/components/builder/AIRefineFieldButton';

export type PropertiesPanelTab = 'content' | 'settings' | 'design' | 'media';

const fontPresets = [
  'Inter', 'Manrope', 'Montserrat', 'Roboto', 'Open Sans',
  'Georgia', 'Arial', 'Times New Roman',
];

const styleKeys = new Set([
  'backgroundColor', 'textColor', 'paddingY', 'paddingX', 'align',
  'radius', 'containerWidth', 'layout', 'height', 'headingSize',
  'subtitleSize', 'backgroundImageUrl', 'imageUrl', 'overlayColor',
  'overlayOpacity', 'backgroundPosition', 'backgroundSize',
  'buttonStyle', 'buttonBackgroundColor', 'buttonTextColor',
  'secondaryButtonBackgroundColor', 'secondaryButtonTextColor',
]);

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-white/30">
      {children}
    </span>
  );
}

function FieldShell({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-white/5 py-3">{children}</div>;
}

function getBlockLabel(type?: string) {
  const labels: Record<string, string> = {
    header: 'Header', hero: 'Hero', features: 'Features', pricing: 'Pricing',
    testimonials: 'Отзывы', faq: 'FAQ', logos: 'Logos', stats: 'Stats',
    cta: 'CTA', gallery: 'Gallery', footer: 'Footer', contact: 'Contact',
  };
  return type ? labels[type] ?? type : 'Блок не выбран';
}

function isAllowedGoogleFontsUrl(url: string) {
  if (!url.trim()) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'fonts.googleapis.com' && parsed.pathname.startsWith('/css');
  } catch { return false; }
}

function extractFontsFromGoogleUrl(url: string) {
  if (!url.trim()) return [];
  try {
    const parsed = new URL(url);
    const families = parsed.searchParams.getAll('family');
    return families.map((f) => decodeURIComponent(f.split(':')[0]).replace(/\+/g, ' ').trim()).filter(Boolean);
  } catch { return []; }
}

function safeString(value: unknown, fallback: string = ''): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
}

export default function PropertiesPanel() {
  const siteId = useBuilderStore((s) => s.siteId);
  const blocks = useBuilderStore((s) => s.blocks);
  const activeBlockId = useBuilderStore((s) => s.activeBlockId);
  const editorTab = useBuilderStore((s) => s.editorTab);
  const updateBlockProps = useBuilderStore((s) => s.updateBlockProps);
  const setActiveBlock = useBuilderStore((s) => s.setActiveBlock);
  const setEditorTab = useBuilderStore((s) => s.setEditorTab);
  const setActivePanel = useBuilderStore((s) => s.setActivePanel);
  const theme = useBuilderStore((s) => s.theme);
  const updateTheme = useBuilderStore((s) => s.updateTheme);
  const applyThemePreset = useBuilderStore((s) => s.applyThemePreset);
  const addCustomFont = useBuilderStore((s) => s.addCustomFont);
  const removeCustomFont = useBuilderStore((s) => s.removeCustomFont);

  const backgroundFileRef = useRef<HTMLInputElement | null>(null);
  const imageFileRef = useRef<HTMLInputElement | null>(null);

  const [fontUrlInput, setFontUrlInput] = useState(theme.fontUrl || '');
  const [uploadingKey, setUploadingKey] = useState<'backgroundImageUrl' | 'imageUrl' | null>(null);

  // Drag state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setFontUrlInput(theme.fontUrl || ''); }, [theme.fontUrl]);

  const block = blocks.find((item) => item.id === activeBlockId);
  const activeIndex = blocks.findIndex((item) => item.id === activeBlockId);
  const customFonts = theme.customFonts ?? [];

  const fontOptions = useMemo(() => {
    return Array.from(new Set([...fontPresets, ...customFonts.map((f) => f.name)]));
  }, [customFonts]);

  const contentProps = block
    ? Object.entries(block.props ?? {}).filter(([key]) => !styleKeys.has(key))
    : [];

  function update(key: string, value: string | number | string[]) {
    if (!block) return;
    updateBlockProps(block.id, { [key]: value });
  }

  function selectPreviousBlock() {
    if (activeIndex <= 0) return;
    setActiveBlock(blocks[activeIndex - 1].id);
  }
  function selectNextBlock() {
    if (activeIndex === -1 || activeIndex >= blocks.length - 1) return;
    setActiveBlock(blocks[activeIndex + 1].id);
  }

  function addFontFromUrl() {
    const cleanUrl = fontUrlInput.trim();
    if (!isAllowedGoogleFontsUrl(cleanUrl)) { alert('Вставь корректную ссылку Google Fonts.'); return; }
    const firstFont = extractFontsFromGoogleUrl(cleanUrl)[0];
    if (!firstFont) { alert('Не удалось найти имя шрифта.'); return; }
    addCustomFont({ name: firstFont, url: cleanUrl });
  }

  function selectFont(fontName: string) {
    const customFont = customFonts.find((f) => f.name === fontName);
    updateTheme({ font: fontName, fontUrl: customFont?.url ?? theme.fontUrl ?? '' });
    if (customFont?.url) setFontUrlInput(customFont.url);
  }

  async function handleLocalImageUpload(event: ChangeEvent<HTMLInputElement>, key: 'backgroundImageUrl' | 'imageUrl') {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploadingKey(key);
      const url = await uploadSiteImage(file, siteId);
      update(key, url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось загрузить файл');
    } finally {
      setUploadingKey(null);
      event.target.value = '';
    }
  }

  // Drag handlers
  function onMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('button, input, textarea, select')) return;
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging.current) return;
    setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
  }

  function onMouseUp() {
    dragging.current = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  const tabs = [
    { key: 'content', label: 'Контент' },
    { key: 'settings', label: 'Блок' },
    { key: 'design', label: 'Дизайн' },
    { key: 'media', label: 'Медиа' },
  ] as const;

  return (
    <aside
      ref={panelRef}
      onMouseDown={onMouseDown}
      className="fixed z-50 flex flex-col bg-[#0b0b0d] text-white shadow-2xl border border-white/10 rounded-2xl overflow-hidden select-none"
      style={{
        right: 0,
        top: 48,
        width: 300,
        maxHeight: 'calc(100vh - 64px)',
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        cursor: dragging.current ? 'grabbing' : 'grab',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-red-400/70">Блок</span>
          <span className="text-white/20">·</span>
          <span className="text-[11px] font-medium text-white/70">{getBlockLabel(block?.type)}</span>
          <span className="text-[10px] text-white/25">{activeIndex + 1}/{blocks.length}</span>
        </div>
        <div className="flex gap-0.5">
          <button onClick={selectPreviousBlock} disabled={activeIndex <= 0}
            className="h-5 w-5 rounded text-[10px] text-white/30 hover:bg-white/10 hover:text-white disabled:opacity-20 transition">▲</button>
          <button onClick={selectNextBlock} disabled={activeIndex === -1 || activeIndex >= blocks.length - 1}
            className="h-5 w-5 rounded text-[10px] text-white/30 hover:bg-white/10 hover:text-white disabled:opacity-20 transition">▼</button>
          <button onClick={() => setActivePanel(null)}
            className="h-5 w-5 rounded text-[10px] text-white/30 hover:bg-white/10 hover:text-white transition ml-1">×</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        {tabs.map(({ key, label }) => (
          <button key={key} type="button" onClick={() => setEditorTab(key)}
            className={['flex-1 h-7 text-[10px] font-medium transition', editorTab === key ? 'text-red-400 border-b border-red-400' : 'text-white/25 hover:text-white/50'].join(' ')}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-4" style={{ cursor: 'default' }}>
        {!block && editorTab !== 'design' && (
          <div className="py-8 text-[11px] text-center text-white/20">Выбери блок на странице</div>
        )}

        {editorTab === 'content' && block && (
          <div>
            {contentProps.length === 0 && (
              <div className="py-6 text-[11px] text-center text-white/20">Нет редактируемых полей</div>
            )}
            {contentProps.map(([key, value]) => (
              <FieldShell key={key}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <Label>{key}</Label>
                  <AIRefineFieldButton block={block} field={key} onApply={(nextValue) => update(key, nextValue)} />
                </div>
                {Array.isArray(value) ? (
                  <textarea value={value.map((item) => safeString(item)).join('\n')}
                    onChange={(e) => update(key, e.target.value.split('\n').map((i) => i.trim()).filter(Boolean))} rows={4}
                    className="w-full resize-none rounded-md border border-white/5 bg-[#111114] px-2 py-1.5 text-[11px] text-white outline-none focus:border-red-500/30 transition placeholder:text-white/10" />
                ) : safeString(value).length > 60 ? (
                  <textarea value={safeString(value)} onChange={(e) => update(key, e.target.value)} rows={3}
                    className="w-full resize-none rounded-md border border-white/5 bg-[#111114] px-2 py-1.5 text-[11px] text-white outline-none focus:border-red-500/30 transition placeholder:text-white/10" />
                ) : (
                  <input value={safeString(value)} onChange={(e) => update(key, e.target.value)}
                    className="h-7 w-full rounded-md border border-white/5 bg-[#111114] px-2 text-[11px] text-white outline-none focus:border-red-500/30 transition placeholder:text-white/10" />
                )}
              </FieldShell>
            ))}
          </div>
        )}

        {editorTab === 'settings' && block && (
          <div>
            <FieldShell>
              <Label>Высота (vh)</Label>
              <input type="number" min={20} max={140} value={Number.isFinite(block.props.height) ? block.props.height as number : 92}
                onChange={(e) => update('height', Number(e.target.value) || 92)}
                className="h-7 w-full rounded-md border border-white/5 bg-[#111114] px-2 text-[11px] text-white outline-none focus:border-red-500/30 transition" />
            </FieldShell>
            <FieldShell>
              <Label>Заголовок (px)</Label>
              <input type="number" min={24} max={160} value={Number.isFinite(block.props.headingSize) ? block.props.headingSize as number : 88}
                onChange={(e) => update('headingSize', Number(e.target.value) || 88)}
                className="h-7 w-full rounded-md border border-white/5 bg-[#111114] px-2 text-[11px] text-white outline-none focus:border-red-500/30 transition" />
            </FieldShell>
            <FieldShell>
              <Label>Описание (px)</Label>
              <input type="number" min={12} max={48} value={Number.isFinite(block.props.subtitleSize) ? block.props.subtitleSize as number : 22}
                onChange={(e) => update('subtitleSize', Number(e.target.value) || 22)}
                className="h-7 w-full rounded-md border border-white/5 bg-[#111114] px-2 text-[11px] text-white outline-none focus:border-red-500/30 transition" />
            </FieldShell>
            <FieldShell>
              <Label>Отступы Y</Label>
              <input type="number" min={0} max={280} value={Number.isFinite(block.props.paddingY) ? block.props.paddingY as number : 120}
                onChange={(e) => update('paddingY', Number(e.target.value) || 120)}
                className="h-7 w-full rounded-md border border-white/5 bg-[#111114] px-2 text-[11px] text-white outline-none focus:border-red-500/30 transition" />
            </FieldShell>
            <FieldShell>
              <Label>Отступы X</Label>
              <input type="number" min={0} max={160} value={Number.isFinite(block.props.paddingX) ? block.props.paddingX as number : 32}
                onChange={(e) => update('paddingX', Number(e.target.value) || 32)}
                className="h-7 w-full rounded-md border border-white/5 bg-[#111114] px-2 text-[11px] text-white outline-none focus:border-red-500/30 transition" />
            </FieldShell>
            <FieldShell>
              <Label>Ширина контейнера</Label>
              <input type="number" min={320} max={1800} value={Number.isFinite(block.props.containerWidth) ? block.props.containerWidth as number : 1240}
                onChange={(e) => update('containerWidth', Number(e.target.value) || 1240)}
                className="h-7 w-full rounded-md border border-white/5 bg-[#111114] px-2 text-[11px] text-white outline-none focus:border-red-500/30 transition" />
            </FieldShell>
            <FieldShell>
              <Label>Скругление</Label>
              <input type="number" min={0} max={120} value={Number.isFinite(block.props.radius) ? block.props.radius as number : 0}
                onChange={(e) => update('radius', Number(e.target.value) || 0)}
                className="h-7 w-full rounded-md border border-white/5 bg-[#111114] px-2 text-[11px] text-white outline-none focus:border-red-500/30 transition" />
            </FieldShell>
          </div>
        )}

        {editorTab === 'design' && (
          <div>
            <FieldShell>
              <Label>Тема</Label>
              <div className="grid gap-1.5">
                {themePresets.map((preset) => (
                  <button key={preset.id} type="button"
                    onClick={() => { if (typeof applyThemePreset === 'function') { applyThemePreset(preset.theme); } else { updateTheme(preset.theme); } }}
                    className="flex items-center gap-2 rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5 text-left transition hover:border-red-500/20 hover:bg-white/[0.04]">
                    <div className="flex gap-1">
                      <span className="h-3 w-3 rounded-full border border-white/10" style={{ backgroundColor: preset.theme.backgroundColor }} />
                      <span className="h-3 w-3 rounded-full border border-white/10" style={{ backgroundColor: preset.theme.textColor }} />
                      <span className="h-3 w-3 rounded-full border border-white/10" style={{ backgroundColor: preset.theme.primaryColor }} />
                    </div>
                    <span className="text-[10px] font-medium text-white/60">{preset.name}</span>
                  </button>
                ))}
              </div>
            </FieldShell>
            <FieldShell>
              <Label>Шрифт</Label>
              <select value={theme.font} onChange={(e) => selectFont(e.target.value)}
                className="h-7 w-full rounded-md border border-white/5 bg-[#111114] px-2 text-[11px] text-white outline-none focus:border-red-500/30 transition">
                {fontOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </FieldShell>
          </div>
        )}

        {editorTab === 'media' && block && (
          <div>
            <input ref={backgroundFileRef} type="file" accept="image/*" hidden onChange={(e) => handleLocalImageUpload(e, 'backgroundImageUrl')} />
            <input ref={imageFileRef} type="file" accept="image/*" hidden onChange={(e) => handleLocalImageUpload(e, 'imageUrl')} />
            <FieldShell>
              <Label>Фон</Label>
              <input value={typeof block.props.backgroundImageUrl === 'string' ? block.props.backgroundImageUrl : ''} onChange={(e) => update('backgroundImageUrl', e.target.value)}
                placeholder="URL..."
                className="h-7 w-full rounded-md border border-white/5 bg-[#111114] px-2 text-[11px] text-white outline-none focus:border-red-500/30 transition placeholder:text-white/10" />
              <div className="flex gap-1.5 mt-1.5">
                <button type="button" onClick={() => backgroundFileRef.current?.click()} disabled={uploadingKey === 'backgroundImageUrl'}
                  className="flex-1 h-6 rounded-md bg-red-600 text-[10px] font-medium text-white hover:bg-red-500 disabled:opacity-50 transition">Загрузить</button>
                <button type="button" onClick={() => update('backgroundImageUrl', '')}
                  className="h-6 rounded-md border border-white/5 px-2 text-[10px] text-white/40 hover:bg-white/5 transition">×</button>
              </div>
            </FieldShell>
            <FieldShell>
              <Label>Изображение</Label>
              <input value={typeof block.props.imageUrl === 'string' ? block.props.imageUrl : ''} onChange={(e) => update('imageUrl', e.target.value)}
                placeholder="URL..."
                className="h-7 w-full rounded-md border border-white/5 bg-[#111114] px-2 text-[11px] text-white outline-none focus:border-red-500/30 transition placeholder:text-white/10" />
              <div className="flex gap-1.5 mt-1.5">
                <button type="button" onClick={() => imageFileRef.current?.click()} disabled={uploadingKey === 'imageUrl'}
                  className="flex-1 h-6 rounded-md bg-red-600 text-[10px] font-medium text-white hover:bg-red-500 disabled:opacity-50 transition">Загрузить</button>
                <button type="button" onClick={() => update('imageUrl', '')}
                  className="h-6 rounded-md border border-white/5 px-2 text-[10px] text-white/40 hover:bg-white/5 transition">×</button>
              </div>
            </FieldShell>
          </div>
        )}
      </div>
    </aside>
  );
}