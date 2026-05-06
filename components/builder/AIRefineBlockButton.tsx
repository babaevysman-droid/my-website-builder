'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';

export default function AIRefineBlockButton({ blockId }: { blockId: string }) {
  const blocks = useBuilderStore((state) => state.blocks);
  const block = blocks.find((item) => item.id === blockId);
  const theme = useBuilderStore((state) => state.theme);
  const updateBlock = useBuilderStore((state) => state.updateBlock);
  const setDirty = useBuilderStore((state) => state.setDirty);

  const [open, setOpen] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);

  if (!block) return null;

  async function refine() {
    if (!instruction.trim()) { alert('Напиши, что изменить.'); return; }
    const currentBlock = blocks.find((item) => item.id === blockId);
    if (!currentBlock) { alert('Блок не найден.'); return; }
    try {
      setLoading(true);
      const response = await fetch('/api/ai/refine-block', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ block: currentBlock, instruction, styleDNA: theme?.styleDNA }) });
      const data = (await response.json()) as { props?: Record<string, unknown>; error?: string };
      if (!response.ok || data.error) throw new Error(data.error || 'AI не смог улучшить блок.');
      updateBlock(currentBlock.id, { props: { ...currentBlock.props, ...(data.props || {}) } });
      setDirty(true);
      setOpen(false);
      setInstruction('');
    } catch (error) { alert(error instanceof Error ? error.message : 'Ошибка AI.'); }
    finally { setLoading(false); }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className="rounded-md px-2 py-1 text-[11px] font-semibold text-violet-400 hover:bg-violet-500/20 hover:text-violet-300 transition" title="AI улучшить">✨</button>
      {open && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
          <div className="w-[520px] max-w-full rounded-2xl border border-white/10 bg-[#111114] text-white shadow-2xl">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400/80">AI Refine</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">Улучшить блок</h2>
            </div>
            <div className="p-6">
              <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} rows={4}
                placeholder="Сделай премиальнее, короче, агрессивнее..."
                className="w-full resize-none rounded-xl border border-white/10 bg-[#08080A] p-4 text-sm text-white outline-none focus:border-violet-500/50 transition placeholder:text-white/20" />
              <div className="mt-4 flex flex-wrap gap-2">
                {['Премиальнее', 'Агрессивнее', 'Короче', 'Продающее'].map((item) => (
                  <button key={item} type="button" onClick={() => setInstruction(item)}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/65 hover:bg-white/[0.07] hover:text-white transition">{item}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
              <button type="button" onClick={() => setOpen(false)} disabled={loading}
                className="h-10 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/65 hover:bg-white/[0.07] hover:text-white disabled:opacity-50 transition">Отмена</button>
              <button type="button" onClick={refine} disabled={loading}
                className="h-10 rounded-lg bg-violet-600 px-4 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50 transition">
                {loading ? '...' : 'Применить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}