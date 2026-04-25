'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useBuilderStore } from '@/store/useBuilderStore';

export default function AutoSave() {
  const siteId = useBuilderStore((s) => s.siteId);
  const blocks = useBuilderStore((s) => s.blocks);
  const theme = useBuilderStore((s) => s.theme);
  const isDirty = useBuilderStore((s) => s.isDirty);
  const isSaving = useBuilderStore((s) => s.isSaving);
  const setSaving = useBuilderStore((s) => s.setSaving);
  const setDirty = useBuilderStore((s) => s.setDirty);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!siteId || !isDirty || isSaving) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      setSaving(true);

      const supabase = createClient();

      const { error } = await supabase
        .from('sites')
        .update({
          blocks,
          theme,
          updated_at: new Date().toISOString(),
        })
        .eq('id', siteId);

      setSaving(false);

      if (!error) {
        setDirty(false);
      }
    }, 1200);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [siteId, blocks, theme, isDirty, isSaving, setSaving, setDirty]);

  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      if (!isDirty) return;

      e.preventDefault();
      e.returnValue = '';
    }

    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [isDirty]);

  return null;
}