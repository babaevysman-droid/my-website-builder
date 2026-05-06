import { useEffect, useRef, useState, useCallback } from 'react';

export function useAutoSave<T>(
  data: T, 
  saveFunction: (data: T) => Promise<void>, 
  delay: number = 2500
) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const initialRender = useRef(true);
  const dataRef = useRef(data);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const immediateSave = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    
    setIsSaving(true);
    try {
      await saveFunction(data);
      dataRef.current = data;
      setLastSaved(new Date());
    } catch (error) {
      console.error("❌ Ошибка автосохранения:", error);
    } finally {
      setIsSaving(false);
    }
  }, [data, saveFunction]);

  useEffect(() => {
    // Пропускаем первое монтирование
    if (initialRender.current) {
      initialRender.current = false;
      dataRef.current = data;
      return;
    }

    // Если данные не изменились, не сохраняем
    if (JSON.stringify(dataRef.current) === JSON.stringify(data)) {
      return;
    }

    // Очищаем предыдущий таймаут
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Устанавливаем новый таймаут
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await saveFunction(data);
        dataRef.current = data;
        setLastSaved(new Date());
      } catch (error) {
        console.error("❌ Ошибка автосохранения:", error);
      } finally {
        setIsSaving(false);
        saveTimeoutRef.current = null;
      }
    }, delay);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, saveFunction, delay]);

  return { isSaving, lastSaved, immediateSave };
}