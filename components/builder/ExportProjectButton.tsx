'use client';

import { useState } from 'react';
import { exportToNextProjectZip } from '@/lib/export/exportToNextProject';
import { useBuilderStore } from '@/store/useBuilderStore';

export default function ExportProjectButton() {
  const blocks = useBuilderStore((state) => state.blocks);
  const theme = useBuilderStore((state) => state.theme);
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    try {
      setLoading(true);
      await exportToNextProjectZip(blocks, theme);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось собрать проект');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={handleExport} disabled={loading}
      className="h-7 rounded-lg border border-white/10 px-2.5 text-[11px] font-medium text-white/45 hover:bg-white/5 hover:text-white/70 disabled:opacity-50 transition">
      {loading ? '...' : 'Export'}
    </button>
  );
}