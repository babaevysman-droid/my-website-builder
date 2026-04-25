'use client';

import { useState } from 'react';

interface ContactBlockProps {
  siteId?: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

export default function ContactBlock({
  siteId,
  title,
  subtitle,
  buttonText,
}: ContactBlockProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!siteId) {
      alert('Форма работает только после сохранения сайта');
      return;
    }

    setLoading(true);
    setSuccess(false);

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        siteId,
        name,
        email,
        message,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const json = await res.json();
      alert(json.error || 'Ошибка отправки формы');
      return;
    }

    setName('');
    setEmail('');
    setMessage('');
    setSuccess(true);
  }

  return (
    <section className="px-8 py-20">
      <div className="mx-auto max-w-2xl rounded-3xl border p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-3 text-neutral-600">{subtitle}</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
          />

          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Сообщение"
            rows={4}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-black py-3 font-medium text-white disabled:opacity-60"
          >
            {loading ? 'Отправляем...' : buttonText}
          </button>

          {success && (
            <p className="text-center text-sm text-green-600">
              Заявка отправлена!
            </p>
          )}
        </form>
      </div>
    </section>
  );
}