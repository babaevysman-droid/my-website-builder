import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export const maxDuration = 20;

function extractJson(text: string) {
  const clean = text.trim();
  if (clean.startsWith('{') && clean.endsWith('}')) return clean;
  const match = clean.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) {
    const inner = match[1].trim();
    if (inner.startsWith('{') && inner.endsWith('}')) return inner;
  }
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return clean.slice(firstBrace, lastBrace + 1);
  }
  throw new Error(`AI не вернул JSON. Ответ: ${clean.slice(0, 200)}`);
}

// 🔥 НОВАЯ ФУНКЦИЯ: постиг处理 ссылок
function normalizeLinksInProps(props: Record<string, any>, blockType: string): Record<string, any> {
  const normalized = { ...props };
  
  // Для header: преобразуем links в массив строк
  if (blockType === 'header' && normalized.links) {
    if (Array.isArray(normalized.links)) {
      normalized.links = normalized.links.map((link: any) => {
        if (typeof link === 'string') return link;
        if (link && typeof link === 'object') {
          return link.label || link.text || link.title || link.name || "Ссылка";
        }
        return "Ссылка";
      });
    }
  }
  
  // Для footer: преобразуем links и columns
  if (blockType === 'footer') {
    if (normalized.links && Array.isArray(normalized.links)) {
      normalized.links = normalized.links.map((link: any) => {
        if (typeof link === 'string') return link;
        if (link && typeof link === 'object') {
          return link.label || link.text || link.title || link.name || "Ссылка";
        }
        return "Ссылка";
      });
    }
    if (normalized.columns && Array.isArray(normalized.columns)) {
      normalized.columns = normalized.columns.map((col: any) => {
        if (typeof col === 'string') return col;
        if (col && typeof col === 'object') {
          return col.label || col.text || col.title || col.name || "Колонка";
        }
        return "Колонка";
      });
    }
  }
  
  return normalized;
}

function getBlockPrompt(blockType: string, index: number) {
  const animationDefaults: Record<string, string> = {
    header: 'fade-in-down',
    hero: 'blur-in',
    features: 'stagger-fade-up',
    pricing: 'stagger-scale',
    testimonials: 'stagger-fade-left',
    faq: 'stagger-slide-up',
    stats: 'counter-roll',
    cta: 'scale-in-spring',
    contact: 'fade-in-up',
    gallery: 'stagger-scale',
    logos: 'stagger-blur',
    footer: 'fade-in',
  };

  const needsImage = blockType === 'hero' || blockType === 'gallery';
  const defaultAnim = animationDefaults[blockType] || 'fade-in-up';
  const delay = index * 0.15;

  // 🔥 УСИЛЕННЫЙ ПРОМПТ для header и footer
  let additionalInstructions = '';
  
  if (blockType === 'header') {
    additionalInstructions = `
⚠️ КРИТИЧЕСКИ ВАЖНО ДЛЯ HEADER:
- links: ТОЛЬКО МАССИВ СТРОК! Например: ["Главная", "Услуги", "Цены", "Контакты"]
- НЕ ИСПОЛЬЗУЙ ОБЪЕКТЫ! Запрещено: [{label: "Главная"}, {text: "Услуги"}]
- logo: строка с названием бренда
- buttonText: строка с текстом кнопки

ПРАВИЛЬНЫЙ ПРИМЕР:
"props": {
  "logo": "Corshun",
  "links": ["Главная", "Услуги", "Контакты"],
  "buttonText": "Начать"
}

НЕПРАВИЛЬНЫЙ ПРИМЕР (ТАК НЕЛЬЗЯ):
"props": {
  "logo": "Corshun",
  "links": [{"label": "Главная"}, {"text": "Услуги"}],
  "buttonText": "Начать"
}
`;
  } else if (blockType === 'footer') {
    additionalInstructions = `
⚠️ КРИТИЧЕСКИ ВАЖНО ДЛЯ FOOTER:
- links: ТОЛЬКО МАССИВ СТРОК! Например: ["О нас", "Услуги", "Контакты"]
- columns: ТОЛЬКО МАССИВ СТРОК! Например: ["Компания", "Услуги", "Поддержка"]
- НЕ ИСПОЛЬЗУЙ ОБЪЕКТЫ! Только строки.
`;
  }

  return `
Создай контент для блока "${blockType}" (блок #${index + 1}).

ТРЕБОВАНИЯ:
- header: logo, links (массив СТРОК), buttonText
- hero: eyebrow, title (до 7 слов), subtitle, buttonText, secondaryButtonText, imageQuery (ОБЯЗАТЕЛЬНО на английском для Unsplash), height: 92, headingSize: 72
- features: title, items (массив {title, description, icon})
- pricing: title, plans (массив {name, price, description, features(массив), buttonText})
- testimonials: title, items (массив {name, role, text})
- faq: title, items (массив {question, answer})
- stats: title, items (массив {value, label})
- cta: title, buttonText
- gallery: title, imageQuery (ОБЯЗАТЕЛЬНО на английском для Unsplash)
- contact: title, subtitle, buttonText, fields: ["name","phone","email","message"], successMessage
- footer: brand, description, columns (массив СТРОК), links (массив СТРОК), copyright
- logos: title, logos (массив строк)

${needsImage ? '⚠️ КРИТИЧЕСКИ ВАЖНО: Добавь "imageQuery" на английском — реалистичный запрос для Unsplash. Пример: "luxury hotel lobby marble interior".' : ''}
${additionalInstructions}

АНИМАЦИЯ (обязательно):
- "animation": "${defaultAnim}"
- "animationIntensity": "${index === 0 ? 'low' : 'medium'}"
- "animationDelay": ${delay}
${blockType === 'features' || blockType === 'pricing' || blockType === 'testimonials' || blockType === 'faq' || blockType === 'gallery' || blockType === 'logos' ? '- "animationStagger": 0.1' : ''}

Верни ТОЛЬКО JSON: { "type": "${blockType}", "props": {} }
Все тексты на русском.
ВАЖНО: Все ссылки (links, columns) — ТОЛЬКО МАССИВЫ СТРОК! Никаких объектов!
`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      blockType?: string;
      styleDNA?: any;
      index?: number;
    };

    const { prompt, blockType, index = 0 } = body;

    if (!prompt || !blockType) {
      return NextResponse.json({ error: 'Нужен prompt и blockType.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY не задан.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const blockPrompt = getBlockPrompt(blockType, index);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
Проект: "${prompt}"
${blockPrompt}
`,
      config: { temperature: 0.7, maxOutputTokens: 1500 }, // 🔥 понизил temperature для более предсказуемых ответов
    });

    const text = response.text ?? '{}';
    const data = JSON.parse(extractJson(text)) as {
      type: string;
      props: Record<string, any>;
    };

    // 🔥 НОРМАЛИЗУЕМ ссылки после получения от AI
    const normalizedProps = normalizeLinksInProps(data.props || {}, blockType);

    return NextResponse.json({
      type: data.type || blockType,
      props: normalizedProps,
    });

  } catch (error) {
    console.error('Block content error:', error);
    return NextResponse.json({ error: 'Не удалось создать контент блока.' }, { status: 500 });
  }
}