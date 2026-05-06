'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Block, Theme } from '@/types';

type Mood = 'bold' | 'strict' | 'friendly' | 'premium' | 'minimal' | 'tech';

const moods: { id: Mood; title: string }[] = [
  { id: 'bold', title: 'Дерзкое' },
  { id: 'strict', title: 'Строгое' },
  { id: 'friendly', title: 'Дружелюбное' },
  { id: 'premium', title: 'Премиум' },
  { id: 'minimal', title: 'Минимализм' },
  { id: 'tech', title: 'Технологичное' },
];

function createFallbackBlock(type: string, index: number): Block {
  const id = crypto.randomUUID();
  const fallbacks: Record<string, any> = {
    header: { logo: 'Мой сайт', links: ['Главная', 'Услуги', 'Контакты'], buttonText: 'Начать' },
    hero: { eyebrow: 'Добро пожаловать', title: 'Создаём лучшее для вас', subtitle: 'Профессиональные решения.', buttonText: 'Оставить заявку', secondaryButtonText: 'Узнать больше', height: 92, headingSize: 64 },
    features: { title: 'Наши преимущества', items: [{ title: 'Качество', description: 'Высокие стандарты', icon: 'sparkles' }, { title: 'Скорость', description: 'Быстрый запуск', icon: 'rocket' }, { title: 'Надёжность', description: 'Гарантия', icon: 'shield' }] },
    pricing: { title: 'Тарифы', plans: [{ name: 'Базовый', price: 'от 9 900 ₽', description: 'Для старта', features: ['Всё нужное'], buttonText: 'Выбрать' }] },
    testimonials: { title: 'Отзывы', items: [{ name: 'Анна', role: 'Клиент', text: 'Отличная работа!' }] },
    faq: { title: 'Частые вопросы', items: [{ question: 'Как начать?', answer: 'Просто оставьте заявку.' }] },
    stats: { title: 'Цифры', items: [{ value: '100+', label: 'проектов' }, { value: '5 лет', label: 'опыта' }] },
    cta: { title: 'Готовы начать?', buttonText: 'Оставить заявку' },
    contact: { title: 'Свяжитесь с нами', subtitle: 'Мы ответим в ближайшее время', buttonText: 'Отправить', fields: ['name', 'phone', 'email', 'message'], successMessage: 'Спасибо!' },
    footer: { brand: 'Мой сайт', description: 'Создаём лучшие решения.', columns: ['Навигация', 'Услуги', 'Контакты'], links: ['Главная', 'Услуги', 'Контакты', 'Поддержка'], copyright: `© ${new Date().getFullYear()}.` },
  };
  return { id, type: type as any, props: fallbacks[type] || { title: `Блок ${index + 1}` } };
}

export default function AIGenerateSiteButton() {
  const updateTheme = useBuilderStore((s) => s.updateTheme);
  const setDirty = useBuilderStore((s) => s.setDirty);
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [mood, setMood] = useState<Mood>('premium');
  const [loading, setLoading] = useState(false);

  async function generateSite() {
    if (!prompt.trim()) { alert('Опиши сайт.'); return; }
    try {
      setLoading(true);
      const structureRes = await fetch('/api/ai/generate-site', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, mood }) });
      if (!structureRes.ok) throw new Error('Не удалось получить структуру.');
      const structure = await structureRes.json() as { theme?: Theme; blockTypes?: string[]; error?: string };
      if (structure.error || !structure.theme || !structure.blockTypes) throw new Error(structure.error || 'Пустая структура.');
      updateTheme(structure.theme);
      const blockTypes = structure.blockTypes;
      const blockPromises = blockTypes.map(async (type, index) => {
        try {
          const res = await fetch('/api/ai/block-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, blockType: type, styleDNA: structure.theme?.styleDNA, index }) });
          if (!res.ok) throw new Error('Block content failed');
          const data = await res.json();
          return { id: crypto.randomUUID(), type: data.type || type, props: data.props || {} };
        } catch { return createFallbackBlock(type, index); }
      });
      const blocks = await Promise.all(blockPromises);
      useBuilderStore.setState({ blocks, activeBlockId: blocks[0]?.id ?? null, activeText: null, activePanel: null, editorTab: 'content', isDirty: true });
      setDirty(true);
      setOpen(false);
      setPrompt('');
    } catch (error) { alert(error instanceof Error ? error.message : 'Ошибка генерации.'); }
    finally { setLoading(false); }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className="h-7 rounded-lg border border-white/10 px-2.5 text-[11px] font-medium text-white/45 hover:bg-white/5 hover:text-white/70 transition">AI</button>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-[720px] max-w-[95vw] overflow-hidden rounded-2xl border border-white/10 bg-[#111114] text-white shadow-2xl">
            <div className="border-b border-white/10 px-6 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-violet-400/80">Gemini AI</p>
              <h2 className="mt-1 text-xl font-semibold">Создать сайт</h2>
            </div>
            <div className="flex flex-col gap-4 p-6">
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4}
                placeholder="Опиши бизнес, например: лендинг для барбершопа..."
                className="w-full resize-none rounded-xl border border-white/10 bg-[#08080A] p-4 text-sm text-white outline-none focus:border-violet-500/50 transition placeholder:text-white/20" />
              <div className="flex gap-2 text-xs">
                {['Барбершоп', 'SaaS', 'Школа танцев', 'Курсы'].map((ex) => (
                  <button key={ex} type="button" onClick={() => setPrompt(ex)}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white/55 hover:bg-white/[0.07] hover:text-white transition">{ex}</button>
                ))}
              </div>
              <div className="flex gap-2">
                {moods.map((item) => (
                  <button key={item.id} type="button" onClick={() => setMood(item.id)}
                    className={['rounded-lg border px-3 py-1.5 text-xs font-medium transition', mood === item.id ? 'border-violet-500/50 bg-violet-500/10 text-white' : 'border-white/10 bg-white/[0.03] text-white/45 hover:bg-white/[0.06]'].join(' ')}>
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-white/10 px-6 py-3">
              <button type="button" onClick={() => setOpen(false)} disabled={loading}
                className="h-8 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-white/50 hover:bg-white/[0.07] hover:text-white disabled:opacity-50 transition">Отмена</button>
              <button type="button" onClick={generateSite} disabled={loading}
                className="h-8 rounded-lg bg-red-600 px-3 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50 transition">
                {loading ? 'Генерация...' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}