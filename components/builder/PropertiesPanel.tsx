'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { createClient } from '@/lib/supabase/client';

export default function PropertiesPanel() {
  const supabase = createClient();

  const blocks = useBuilderStore((s) => s.blocks);
  const activeBlockId = useBuilderStore((s) => s.activeBlockId);
  const updateBlockProps = useBuilderStore((s) => s.updateBlockProps);

  const theme = useBuilderStore((s) => s.theme);
  const updateTheme = useBuilderStore((s) => s.updateTheme);

  const block = blocks.find((b) => b.id === activeBlockId);

  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  function updateField(key: string, value: string) {
    if (!block) return;
    updateBlockProps(block.id, { [key]: value });
  }

  function updateArrayItem(key: string, index: number, value: string) {
    if (!block) return;

    const arr = [...(block.props[key] || [])];
    arr[index] = value;

    updateBlockProps(block.id, { [key]: arr });
  }

  function removeArrayItem(key: string, index: number) {
    if (!block) return;

    const arr = [...(block.props[key] || [])];
    arr.splice(index, 1);

    updateBlockProps(block.id, { [key]: arr });
  }

  async function uploadImage(file: File, key: string) {
    if (!block) return;

    setUploadingKey(key);

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from('site-assets')
      .upload(filePath, file);

    if (error) {
      setUploadingKey(null);
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from('site-assets')
      .getPublicUrl(filePath);

    if (key === 'images') {
      const currentImages = Array.isArray(block.props.images)
        ? block.props.images
        : [];

      updateBlockProps(block.id, {
        images: [...currentImages, data.publicUrl],
      });
    } else {
      updateBlockProps(block.id, {
        [key]: data.publicUrl,
      });
    }

    setUploadingKey(null);
  }

  function renderImageField(key: string, label: string, value: string) {
    return (
      <div key={key}>
        <label className="mb-2 block text-sm text-neutral-400">
          {label}
        </label>

        {value && (
          <img
            src={value}
            alt=""
            className="mb-3 h-28 w-full rounded-xl object-cover"
          />
        )}

        <input
          value={value}
          onChange={(e) => updateField(key, e.target.value)}
          placeholder="Image URL"
          className="mb-2 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />

        <input
          type="file"
          accept="image/*"
          disabled={uploadingKey === key}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file, key);
          }}
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />

        {uploadingKey === key && (
          <p className="mt-2 text-sm text-neutral-400">Загружаем...</p>
        )}

        {value && (
          <button
            onClick={() => updateField(key, '')}
            className="mt-2 w-full rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
          >
            Удалить изображение
          </button>
        )}
      </div>
    );
  }

  return (
    <aside className="overflow-y-auto border-l border-neutral-800 p-4">
      <h2 className="mb-4 font-semibold">Настройки</h2>

      {!block && (
        <p className="mb-6 text-neutral-400">
          Выбери блок для редактирования
        </p>
      )}

      {block && (
        <>
          <h3 className="mb-4 text-sm font-semibold text-neutral-400">
            Настройки блока
          </h3>

          <div className="space-y-4">
            {Object.entries(block.props).map(([key, value]) => {
              if (key === 'imageUrl') {
                return renderImageField(
                  key,
                  'Картинка Hero',
                  String(value ?? '')
                );
              }

              if (key === 'backgroundImageUrl') {
                return renderImageField(
                  key,
                  'Фоновая картинка Hero',
                  String(value ?? '')
                );
              }

              if (key === 'images' && Array.isArray(value)) {
                return (
                  <div key={key}>
                    <label className="mb-2 block text-sm text-neutral-400">
                      Изображения галереи
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingKey === key}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(file, key);
                      }}
                      className="mb-3 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
                    />

                    {uploadingKey === key && (
                      <p className="mb-3 text-sm text-neutral-400">
                        Загружаем...
                      </p>
                    )}

                    <div className="space-y-3">
                      {value.map((url, index) => (
                        <div
                          key={`${url}-${index}`}
                          className="rounded-xl border border-neutral-800 bg-neutral-900 p-2"
                        >
                          <img
                            src={url}
                            alt=""
                            className="mb-2 h-28 w-full rounded-lg object-cover"
                          />

                          <input
                            value={String(url)}
                            onChange={(e) =>
                              updateArrayItem(key, index, e.target.value)
                            }
                            className="mb-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white"
                          />

                          <button
                            onClick={() => removeArrayItem(key, index)}
                            className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
                          >
                            Удалить
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (Array.isArray(value)) {
                return (
                  <div key={key}>
                    <label className="mb-2 block text-sm text-neutral-400">
                      {key}
                    </label>

                    <div className="space-y-2">
                      {value.map((item, index) => (
                        <input
                          key={index}
                          value={item}
                          onChange={(e) =>
                            updateArrayItem(key, index, e.target.value)
                          }
                          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
                        />
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={key}>
                  <label className="mb-2 block text-sm text-neutral-400">
                    {key}
                  </label>

                  <input
                    value={String(value)}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
                  />
                </div>
              );
            })}
          </div>
        </>
      )}

      <hr className="my-6 border-neutral-800" />

      <h3 className="mb-4 text-sm font-semibold text-neutral-400">
        Тема сайта
      </h3>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-neutral-400">
            Основной цвет текста
          </label>

          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) =>
              updateTheme({
                primaryColor: e.target.value,
              })
            }
            className="h-10 w-full cursor-pointer rounded"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-400">
            Цвет фона сайта
          </label>

          <input
            type="color"
            value={theme.backgroundColor}
            onChange={(e) =>
              updateTheme({
                backgroundColor: e.target.value,
              })
            }
            className="h-10 w-full cursor-pointer rounded"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-400">
            Шрифт
          </label>

          <select
            value={theme.font}
            onChange={(e) =>
              updateTheme({
                font: e.target.value,
              })
            }
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
          >
            <option value="Inter">Inter</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="system-ui">System UI</option>
          </select>
        </div>
      </div>
    </aside>
  );
}