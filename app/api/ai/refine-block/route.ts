import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

function extractJson(text: string) {
  const clean = text.trim();

  if (clean.startsWith('{') && clean.endsWith('}')) return clean;

  const match = clean.match(/\{[\s\S]*\}/);

  if (!match) throw new Error('AI не вернул JSON.');

  return match[0];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      block?: unknown;
      instruction?: string;
      styleDNA?: unknown;
    };

    if (!body.block || !body.instruction?.trim()) {
      return NextResponse.json(
        { error: 'Нужен блок и инструкция для улучшения.' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Не задан GEMINI_API_KEY в .env.local.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
Ты — AI-дизайнер внутри no-code редактора Corshun.

Тебе дан JSON одного блока и единый styleDNA сайта.

ТВОЯ ЗАДАЧА:
Обновить только props блока по инструкции пользователя.
Нельзя менять type блока.
Нельзя ломать структуру.
Нельзя возвращать markdown.
Ответь строго JSON:

{
  "props": {}
}

STYLE DNA:
${JSON.stringify(body.styleDNA, null, 2)}

ТЕКУЩИЙ БЛОК:
${JSON.stringify(body.block, null, 2)}

ИНСТРУКЦИЯ ПОЛЬЗОВАТЕЛЯ:
"${body.instruction}"

ПРАВИЛА:
- Сохраняй единый стиль сайта.
- Не смешивай несовместимые стили.
- Если просят "агрессивнее" — усили контраст, CTA, заголовок, accent, effects.
- Если просят "премиальнее" — сделай тексты спокойнее, цвета дороже, radius мягче.
- Если просят "короче" — сократи тексты.
- Если просят "продающе" — усили пользу, CTA и конкретику.
- Возвращай только props.
`,
      config: {
        temperature: 0.75,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text ?? '{}';
    const parsed = JSON.parse(extractJson(rawText)) as {
      props?: Record<string, unknown>;
    };

    return NextResponse.json({
      props: parsed.props || {},
    });
  } catch (error) {
    console.error('AI refine block error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Ошибка улучшения блока.',
      },
      { status: 500 }
    );
  }
}