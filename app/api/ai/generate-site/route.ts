import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { normalizeAiTheme } from '@/lib/ai/normalizeAiSite';
import { animationsByCategory } from '@/lib/animations';

export const maxDuration = 25;

function extractJson(text: string) {
  const clean = text.trim();

  if (clean.startsWith('{') && clean.endsWith('}')) return clean;

  const markdownMatch = clean.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (markdownMatch) {
    const inner = markdownMatch[1].trim();
    if (inner.startsWith('{') && inner.endsWith('}')) return inner;
  }

  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return clean.slice(firstBrace, lastBrace + 1);
  }

  throw new Error(`AI не вернул JSON. Ответ: ${clean.slice(0, 200)}`);
}

function moodInstruction(mood?: string) {
  const map: Record<string, string> = {
    bold: 'Дерзкое: высокий контраст, крупная типографика.',
    strict: 'Строгое: светлый фон, аккуратная типографика.',
    friendly: 'Дружелюбное: мягкие цвета, круглые формы.',
    premium: 'Премиум: статусный минимализм, дорогие цвета.',
    minimal: 'Минимализм: белый фон, тонкие линии.',
    tech: 'Технологичное: SaaS, AI, градиенты.',
  };
  return map[mood || 'premium'] ?? map.premium;
}

function getAnimationGuide(mood: string) {
  const intensityMap: Record<string, string> = {
    premium: 'low',
    strict: 'low',
    minimal: 'low',
    friendly: 'medium',
    tech: 'medium',
    bold: 'high',
  };

  const intensity = intensityMap[mood] || 'medium';

  return `
Доступные анимации по категориям:
- Entrances: ${animationsByCategory.entrances.join(', ')}
- Attention: ${animationsByCategory.attention.join(', ')}
- Stagger: ${animationsByCategory.stagger.join(', ')}
- Special: ${animationsByCategory.special.join(', ')}

Правила назначения анимаций по типу блока:
- header → всегда "fade-in-down" (delay: 0)
- hero → "blur-in" или "scale-in-spring" (delay: 0.2)
- features → "stagger-fade-up" или "stagger-scale" (delay: 0.3, stagger: 0.1)
- pricing → "stagger-scale" (delay: 0.2, stagger: 0.1)
- testimonials → "stagger-fade-left" или "stagger-fade-right" (delay: 0.2)
- faq → "stagger-slide-up" (delay: 0.1, stagger: 0.08)
- stats → "counter-roll" (delay: 0.3)
- cta → "scale-in-spring" или "glow-pulse" (delay: 0.4)
- contact → "fade-in-up" (delay: 0.2)
- footer → "fade-in" (delay: 0.1)
- gallery → "stagger-scale" (stagger: 0.08)
- logos → "stagger-blur" (stagger: 0.12)

Интенсивность для текущего настроения: "${intensity}"
${intensity === 'low' ? '- Используй замедленные, плавные анимации (премиум-стиль)' : ''}
${intensity === 'medium' ? '- Используй сбалансированные анимации' : ''}
${intensity === 'high' ? '- Используй быстрые, энергичные анимации' : ''}

Задержки:
- header: delay = 0
- hero: delay = 0.2
- Каждый следующий блок: delay += 0.15
- Для stagger: staggerDelay = ${intensity === 'low' ? '0.15' : intensity === 'medium' ? '0.1' : '0.08'}

Для КАЖДОГО блока добавь в props поля:
- "animation": "название_анимации"
- "animationIntensity": "${intensity}"
- "animationDelay": число
- "animationStagger": число (только для stagger-анимаций)

КАРТИНКИ (КРИТИЧЕСКИ ВАЖНО):
Для блоков hero и gallery ОБЯЗАТЕЛЬНО добавь поле "imageQuery" на английском языке.
Это реалистичный поисковый запрос для фото с Unsplash.
Плохие примеры: "business", "people", "office"
Хорошие примеры: "premium barber shop interior warm lighting cinematic", "modern office workspace minimal desk", "abstract tech gradient blue purple background", "luxury spa reception marble interior"
`;
}

function getFallbackStructure(prompt: string, mood: string) {
  return {
    theme: {
      font: 'Inter',
      fontUrl: '',
      customFonts: [],
      textColor: '#ffffff',
      primaryColor: '#7c3aed',
      backgroundColor: '#050505',
      radius: 28,
      styleDNA: {
        mood: mood || 'premium',
        headingFont: 'Inter',
        bodyFont: 'Inter',
        palette: {
          background: '#050505',
          surface: '#111111',
          text: '#ffffff',
          muted: '#a3a3a3',
          accent: '#7c3aed',
        },
        radius: 28,
        typography: 'premium',
        effects: ['glass'],
        density: 'spacious',
      },
    },
    blockTypes: ['header', 'hero', 'features', 'contact', 'footer'],
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      mood?: string;
    };

    const prompt = body.prompt?.trim();
    const mood = body.mood || 'premium';

    if (!prompt) {
      return NextResponse.json({ error: 'Опиши сайт.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.log('No GEMINI_API_KEY, using fallback structure');
      const fallback = getFallbackStructure(prompt, mood);
      const theme = normalizeAiTheme(
        { ...fallback.theme, styleDNA: fallback.theme.styleDNA },
        fallback.theme.styleDNA
      );
      return NextResponse.json({ theme, blockTypes: fallback.blockTypes, fallback: true });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      console.log('Requesting structure for:', prompt.slice(0, 50));

      const animationGuide = getAnimationGuide(mood);

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
Создай структуру лендинга для: "${prompt}"
Настроение: ${moodInstruction(mood)}

${animationGuide}

Верни ТОЛЬКО чистый JSON, без текста до или после:
{
  "styleDNA": {
    "mood": "${mood}",
    "headingFont": "Inter",
    "bodyFont": "Inter",
    "palette": {
      "background": "#050505",
      "surface": "#111111",
      "text": "#ffffff",
      "muted": "#a3a3a3",
      "accent": "#7c3aed"
    },
    "radius": 28,
    "typography": "premium",
    "effects": ["glass"]
  },
  "theme": {
    "font": "Inter",
    "textColor": "#ffffff",
    "primaryColor": "#7c3aed",
    "backgroundColor": "#050505",
    "radius": 28
  },
  "blockTypes": ["header", "hero", "features", "contact", "footer"]
}

ПРАВИЛА:
- Первый header, второй hero, последний footer
- Между ними 2-3 блока из: features, pricing, testimonials, faq, stats, cta, contact
- contact перед footer
- ВСЕГО 5 блоков
- НИКАКОГО текста кроме JSON
`,
        config: { temperature: 0.7, maxOutputTokens: 1200 },
      });

      const rawText = response.text ?? '';
      console.log('AI Structure Raw Response:', rawText.slice(0, 300));

      if (!rawText || rawText.trim().length === 0) {
        throw new Error('Пустой ответ от AI');
      }

      let data: { styleDNA?: any; theme?: any; blockTypes?: string[] };

      try {
        const cleanJson = extractJson(rawText);
        data = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Failed text:', rawText.slice(0, 200));
        throw new Error('AI вернул невалидный JSON');
      }

      if (!data.blockTypes || !Array.isArray(data.blockTypes) || data.blockTypes.length === 0) {
        console.error('Missing blockTypes in:', data);
        throw new Error('В ответе нет массива blockTypes');
      }

      const validTypes = ['header', 'hero', 'features', 'pricing', 'testimonials', 'faq', 'stats', 'cta', 'contact', 'gallery', 'logos', 'footer'];
      const blockTypes = data.blockTypes.filter((type: string) => validTypes.includes(type));

      if (blockTypes.length === 0) {
        throw new Error('Нет валидных типов блоков в ответе');
      }

      console.log('Structure generated:', blockTypes);

      const theme = normalizeAiTheme(
        { ...data.theme, styleDNA: data.styleDNA },
        data.styleDNA
      );

      return NextResponse.json({ theme, blockTypes });

    } catch (aiError) {
      console.error('AI Error:', aiError);
      console.log('Using fallback structure');

      const fallback = getFallbackStructure(prompt, mood);
      const theme = normalizeAiTheme(
        { ...fallback.theme, styleDNA: fallback.theme.styleDNA },
        fallback.theme.styleDNA
      );
      return NextResponse.json({ theme, blockTypes: fallback.blockTypes, fallback: true });
    }

  } catch (error) {
    console.error('Route Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка сервера.' },
      { status: 500 }
    );
  }
}