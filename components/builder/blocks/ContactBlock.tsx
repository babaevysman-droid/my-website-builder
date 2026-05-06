'use client';

import { FormEvent, useState } from 'react';
import InlineText from '../InlineText';
import { BlockStyleSettings } from './BlockRenderer';

type ContactField = 'name' | 'phone' | 'email' | 'message';

type ContactBlockProps = {
  blockId: string;
  editable?: boolean;
  siteId?: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  fields?: ContactField[];
  successMessage?: string;
  blockStyle?: BlockStyleSettings;
};

const defaultFields: ContactField[] = ['name', 'phone', 'email', 'message'];

function fieldLabel(field: ContactField) {
  const labels: Record<ContactField, string> = {
    name: 'Имя',
    phone: 'Телефон',
    email: 'Email',
    message: 'Сообщение',
  };

  return labels[field];
}

function normalizeFields(fields?: ContactField[]) {
  if (!Array.isArray(fields) || fields.length === 0) return defaultFields;

  return fields.filter((field) => defaultFields.includes(field));
}

export default function ContactBlock({
  blockId,
  editable = false,
  siteId,
  title,
  subtitle = '',
  buttonText = 'Отправить',
  fields,
  successMessage = 'Спасибо! Заявка отправлена.',
  blockStyle,
}: ContactBlockProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );

  const safeFields = normalizeFields(fields);
  const radius = blockStyle?.radius ?? 28;
  const accent = blockStyle?.accentColor || blockStyle?.primaryColor || '#111111';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editable) return;

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      setStatus('loading');

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteId,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки');
      }

      event.currentTarget.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      style={{
        paddingTop: blockStyle?.paddingY ?? 96,
        paddingBottom: blockStyle?.paddingY ?? 96,
        paddingLeft: blockStyle?.paddingX ?? 32,
        paddingRight: blockStyle?.paddingX ?? 32,
        backgroundColor: blockStyle?.backgroundColor || '#ffffff',
        color: blockStyle?.textColor || '#111111',
      }}
    >
      <div
        className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr]"
        style={{ maxWidth: blockStyle?.containerWidth ?? 980 }}
      >
        <div>
          <InlineText
            blockId={blockId}
            propKey="title"
            value={title}
            editable={editable}
            as="h2"
            className="text-4xl font-black tracking-tight md:text-5xl"
          />

          {subtitle && (
            <InlineText
              blockId={blockId}
              propKey="subtitle"
              value={subtitle}
              editable={editable}
              as="p"
              className="mt-5 max-w-md text-lg leading-8 opacity-65"
            />
          )}

          <div
            className="mt-8 h-2 w-24 rounded-full"
            style={{ backgroundColor: accent }}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-current/10 bg-white/80 p-6 shadow-xl backdrop-blur-xl"
          style={{ borderRadius: radius }}
        >
          <div className="grid gap-4">
            {safeFields.map((field) =>
              field === 'message' ? (
                <textarea
                  key={field}
                  name={field}
                  rows={4}
                  placeholder={fieldLabel(field)}
                  disabled={editable}
                  className="w-full resize-none rounded-2xl border border-black/10 bg-white px-5 py-4 text-black outline-none focus:border-black disabled:cursor-default"
                />
              ) : (
                <input
                  key={field}
                  name={field}
                  type={field === 'email' ? 'email' : 'text'}
                  placeholder={fieldLabel(field)}
                  disabled={editable}
                  className="h-14 w-full rounded-2xl border border-black/10 bg-white px-5 text-black outline-none focus:border-black disabled:cursor-default"
                />
              )
            )}
          </div>

          <button
            type="submit"
            disabled={editable || status === 'loading'}
            className="mt-5 h-14 w-full rounded-2xl font-black text-white disabled:opacity-60"
            style={{ backgroundColor: accent }}
          >
            {status === 'loading' ? 'Отправка...' : buttonText}
          </button>

          {status === 'success' && (
            <p className="mt-4 text-sm font-semibold text-green-600">
              {successMessage}
            </p>
          )}

          {status === 'error' && (
            <p className="mt-4 text-sm font-semibold text-red-600">
              Не удалось отправить заявку. Попробуйте ещё раз.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}