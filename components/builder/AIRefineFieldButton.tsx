'use client';

import { useState } from 'react';
import { Block } from '@/types';

type AIRefineFieldButtonProps = {
  block: Block;
  field: string;
  onApply: (value: string | string[]) => void;
};

type RefineResponse = {
  value?: string | string[];
  error?: string;
};

export default function AIRefineFieldButton({
  block,
  field,
  onApply,
}: AIRefineFieldButtonProps) {
  const [loading, setLoading] = useState(false);

  async function refine() {
    const instruction =
      prompt(
        'Что сделать с текстом?',
        'Сделай текст более продающим, кратким и премиальным'
      ) || 'Сделай текст более продающим, кратким и премиальным';

    try {
      setLoading(true);

      const response = await fetch('/api/ai/refine-block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          block,
          field,
          instruction,
        }),
      });

      const data = (await response.json()) as RefineResponse;

      if (!response.ok || data.error) {
        throw new Error(data.error || 'AI не смог улучшить поле.');
      }

      if (data.value === undefined) {
        throw new Error('AI вернул пустой ответ.');
      }

      onApply(data.value);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка AI.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={refine}
      disabled={loading}
      title="Улучшить через AI"
      className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-black text-violet-700 hover:bg-violet-100 disabled:opacity-50"
    >
      {loading ? '...' : '✨'}
    </button>
  );
}