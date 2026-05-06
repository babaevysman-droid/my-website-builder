import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Block, Theme } from '@/types';

function safeJson(value: unknown) {
  return JSON.stringify(value, null, 2)
    .replaceAll('</script', '<\\/script')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}

function createPackageJson() {
  return `{
  "name": "corshun-exported-site",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "typescript": "latest",
    "tailwindcss": "latest",
    "postcss": "latest",
    "autoprefixer": "latest"
  }
}
`;
}

function createTailwindConfig() {
  return `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;
`;
}

function createPostcssConfig() {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
`;
}

function createTsConfig() {
  return `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
`;
}

function createNextEnv() {
  return `/// <reference types="next" />
/// <reference types="next/image-types/global" />
`;
}

function createGlobalsCss() {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
}

a {
  text-decoration: none;
}
`;
}

function createTypesFile() {
  return `export type BlockType =
  | 'header'
  | 'hero'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'faq'
  | 'logos'
  | 'stats'
  | 'cta'
  | 'gallery'
  | 'footer'
  | 'contact';

export type Block = {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
};

export type CustomFont = {
  name: string;
  url: string;
};

export type Theme = {
  font: string;
  fontUrl?: string;
  customFonts?: CustomFont[];
  textColor: string;
  primaryColor: string;
  backgroundColor: string;
  radius?: number;
};
`;
}

function createSiteData(blocks: Block[], theme?: Theme) {
  return `import type { Block, Theme } from '@/types/site';

export const theme: Theme = ${safeJson(
    theme ?? {
      font: 'Inter',
      fontUrl: '',
      customFonts: [],
      textColor: '#111111',
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      radius: 24,
    }
  )};

export const blocks: Block[] = ${safeJson(blocks)};
`;
}

function createLayout() {
  return `import './globals.css';
import { theme } from '@/data/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exported Corshun Site',
  description: 'A website exported from Corshun Builder'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        {theme.fontUrl ? <link rel="stylesheet" href={theme.fontUrl} /> : null}
        {(theme.customFonts ?? []).map((font) => (
          <link key={font.name} rel="stylesheet" href={font.url} />
        ))}
      </head>
      <body
        style={{
          fontFamily: theme.font,
          backgroundColor: theme.backgroundColor,
          color: theme.textColor
        }}
      >
        {children}
      </body>
    </html>
  );
}
`;
}

function createPage() {
  return `import { blocks } from '@/data/site';
import { BlockRenderer } from '@/components/BlockRenderer';

export default function Page() {
  return (
    <main>
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </main>
  );
}
`;
}

function createBlockRenderer() {
  return `import type { Block } from '@/types/site';
import { HeaderBlock } from './blocks/HeaderBlock';
import { HeroBlock } from './blocks/HeroBlock';
import { FeaturesBlock } from './blocks/FeaturesBlock';
import { PricingBlock } from './blocks/PricingBlock';
import { TestimonialsBlock } from './blocks/TestimonialsBlock';
import { FaqBlock } from './blocks/FaqBlock';
import { LogosBlock } from './blocks/LogosBlock';
import { StatsBlock } from './blocks/StatsBlock';
import { CtaBlock } from './blocks/CtaBlock';
import { GalleryBlock } from './blocks/GalleryBlock';
import { ContactBlock } from './blocks/ContactBlock';
import { FooterBlock } from './blocks/FooterBlock';

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'header':
      return <HeaderBlock {...block.props} />;
    case 'hero':
      return <HeroBlock {...block.props} />;
    case 'features':
      return <FeaturesBlock {...block.props} />;
    case 'pricing':
      return <PricingBlock {...block.props} />;
    case 'testimonials':
      return <TestimonialsBlock {...block.props} />;
    case 'faq':
      return <FaqBlock {...block.props} />;
    case 'logos':
      return <LogosBlock {...block.props} />;
    case 'stats':
      return <StatsBlock {...block.props} />;
    case 'cta':
      return <CtaBlock {...block.props} />;
    case 'gallery':
      return <GalleryBlock {...block.props} />;
    case 'contact':
      return <ContactBlock {...block.props} />;
    case 'footer':
      return <FooterBlock {...block.props} />;
    default:
      return null;
  }
}
`;
}

function createUtils() {
  return `export function text(value: unknown, fallback = '') {
  if (value === undefined || value === null) return fallback;
  return String(value);
}

export function number(value: unknown, fallback: number) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

export function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

export function alignClass(value: unknown) {
  const align = text(value, 'center');

  if (align === 'left') return 'text-left items-start';
  if (align === 'right') return 'text-right items-end';

  return 'text-center items-center';
}

export function justifyClass(value: unknown) {
  const align = text(value, 'center');

  if (align === 'left') return 'justify-start';
  if (align === 'right') return 'justify-end';

  return 'justify-center';
}

export function buttonRadius(value: unknown) {
  const style = text(value, 'pill');

  if (style === 'square') return 0;
  if (style === 'rounded') return 18;

  return 999;
}
`;
}

function createHeaderBlock() {
  return `import { stringArray, text, number } from '@/components/utils';

export function HeaderBlock(props: Record<string, unknown>) {
  const links = stringArray(props.links);

  return (
    <header
      className="w-full"
      style={{
        paddingTop: number(props.paddingY, 18),
        paddingBottom: number(props.paddingY, 18),
        paddingLeft: number(props.paddingX, 32),
        paddingRight: number(props.paddingX, 32),
        backgroundColor: text(props.backgroundColor, '#050505'),
        color: text(props.textColor, '#ffffff')
      }}
    >
      <div
        className="mx-auto flex items-center justify-between gap-8"
        style={{ maxWidth: number(props.containerWidth, 1240) }}
      >
        <div className="text-xl font-black tracking-tight">
          {text(props.logo, 'Corshun')}
        </div>

        <nav className="hidden items-center gap-7 text-sm font-semibold opacity-80 md:flex">
          {links.map((link) => (
            <a key={link} href="#" className="hover:opacity-70">
              {link}
            </a>
          ))}
        </nav>

        <a
          href="#"
          className="px-5 py-3 text-sm font-black"
          style={{
            borderRadius: number(props.radius, 999),
            backgroundColor: text(props.buttonBackgroundColor, '#ffffff'),
            color: text(props.buttonTextColor, '#000000')
          }}
        >
          {text(props.buttonText, 'Начать')}
        </a>
      </div>
    </header>
  );
}
`;
}

function createHeroBlock() {
  return `import {
  alignClass,
  buttonRadius,
  justifyClass,
  number,
  text
} from '@/components/utils';

export function HeroBlock(props: Record<string, unknown>) {
  const backgroundImageUrl = text(props.backgroundImageUrl);
  const hasBackground = Boolean(backgroundImageUrl);

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        minHeight: \`\${number(props.height, 92)}vh\`,
        paddingTop: number(props.paddingY, 120),
        paddingBottom: number(props.paddingY, 120),
        paddingLeft: number(props.paddingX, 32),
        paddingRight: number(props.paddingX, 32),
        backgroundColor: text(props.backgroundColor, '#050505'),
        color: text(props.textColor, '#ffffff')
      }}
    >
      {hasBackground ? (
        <img
          src={backgroundImageUrl}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          style={{
            objectPosition: text(props.backgroundPosition, 'center'),
            objectFit:
              text(props.backgroundSize, 'cover') === 'contain'
                ? 'contain'
                : 'cover'
          }}
        />
      ) : null}

      {hasBackground ? (
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundColor: text(props.overlayColor, '#000000'),
            opacity: number(props.overlayOpacity, 42) / 100
          }}
        />
      ) : null}

      <div
        className="relative z-10 mx-auto"
        style={{ maxWidth: number(props.containerWidth, 1240) }}
      >
        <div className={\`flex max-w-5xl flex-col \${alignClass(props.align)} mx-auto\`}>
          {text(props.eyebrow) ? (
            <p className="mb-7 text-sm font-black uppercase tracking-[0.32em] opacity-80">
              {text(props.eyebrow)}
            </p>
          ) : null}

          <h1
            className="font-black leading-[0.92] tracking-[-0.075em]"
            style={{
              fontSize: \`clamp(42px, \${number(props.headingSize, 88) / 14}vw, \${number(
                props.headingSize,
                88
              )}px)\`
            }}
          >
            {text(props.title)}
          </h1>

          <p
            className="mt-8 max-w-3xl leading-relaxed opacity-75"
            style={{
              fontSize: \`clamp(16px, 2vw, \${number(props.subtitleSize, 22)}px)\`
            }}
          >
            {text(props.subtitle)}
          </p>

          <div className={\`mt-10 flex flex-wrap gap-4 \${justifyClass(props.align)}\`}>
            <a
              href={text(props.buttonUrl, '#')}
              className="px-7 py-4 text-sm font-black shadow-xl transition hover:scale-[1.02]"
              style={{
                borderRadius: buttonRadius(props.buttonStyle),
                backgroundColor: text(props.buttonBackgroundColor, '#ffffff'),
                color: text(props.buttonTextColor, '#000000')
              }}
            >
              {text(props.buttonText, 'Начать')}
            </a>

            {text(props.secondaryButtonText) ? (
              <a
                href={text(props.secondaryButtonUrl, '#')}
                className="border border-current px-7 py-4 text-sm font-black transition hover:bg-white/10"
                style={{
                  borderRadius: buttonRadius(props.buttonStyle),
                  backgroundColor: text(
                    props.secondaryButtonBackgroundColor,
                    'transparent'
                  ),
                  color: text(props.secondaryButtonTextColor, '#ffffff')
                }}
              >
                {text(props.secondaryButtonText)}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
`;
}

function createFeaturesBlock() {
  return `import { number, stringArray, text } from '@/components/utils';

export function FeaturesBlock(props: Record<string, unknown>) {
  const items = stringArray(props.items);

  return (
    <section
      style={{
        paddingTop: number(props.paddingY, 96),
        paddingBottom: number(props.paddingY, 96),
        paddingLeft: number(props.paddingX, 32),
        paddingRight: number(props.paddingX, 32),
        backgroundColor: text(props.backgroundColor, '#ffffff'),
        color: text(props.textColor, '#111111')
      }}
    >
      <div className="mx-auto" style={{ maxWidth: number(props.containerWidth, 1180) }}>
        <h2 className="text-center text-4xl font-black tracking-tight">
          {text(props.title)}
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={item}
              className="border border-current/10 p-8"
              style={{ borderRadius: number(props.radius, 28) }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                {index + 1}
              </div>
              <h3 className="text-xl font-black">{item}</h3>
              <p className="mt-3 text-sm leading-6 opacity-60">
                Описание преимущества можно изменить в коде.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
}

function createSimpleGridBlock(componentName: string, titleProp: string, itemProp: string) {
  return `import { number, stringArray, text } from '@/components/utils';

export function ${componentName}(props: Record<string, unknown>) {
  const items = stringArray(props.${itemProp});

  return (
    <section
      style={{
        paddingTop: number(props.paddingY, 96),
        paddingBottom: number(props.paddingY, 96),
        paddingLeft: number(props.paddingX, 32),
        paddingRight: number(props.paddingX, 32),
        backgroundColor: text(props.backgroundColor, '#ffffff'),
        color: text(props.textColor, '#111111')
      }}
    >
      <div className="mx-auto" style={{ maxWidth: number(props.containerWidth, 1180) }}>
        <h2 className="text-center text-4xl font-black tracking-tight">
          {text(props.${titleProp})}
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={item}
              className="border border-current/10 bg-white p-7 text-black shadow-sm"
              style={{ borderRadius: number(props.radius, 28) }}
            >
              <p className="text-lg font-black leading-8">{item}</p>
              <p className="mt-6 text-sm font-black opacity-45">
                #{index + 1}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
}

function createPricingBlock() {
  return `import { number, text } from '@/components/utils';

export function PricingBlock(props: Record<string, unknown>) {
  return (
    <section
      style={{
        paddingTop: number(props.paddingY, 96),
        paddingBottom: number(props.paddingY, 96),
        paddingLeft: number(props.paddingX, 32),
        paddingRight: number(props.paddingX, 32),
        backgroundColor: text(props.backgroundColor, '#ffffff'),
        color: text(props.textColor, '#111111')
      }}
    >
      <div className="mx-auto text-center" style={{ maxWidth: number(props.containerWidth, 1120) }}>
        <h2 className="text-4xl font-black">{text(props.title)}</h2>

        <div
          className="mx-auto mt-10 max-w-md border border-current/10 p-8"
          style={{ borderRadius: number(props.radius, 28) }}
        >
          <p className="text-5xl font-black">{text(props.price)}</p>
          <p className="mt-4 text-sm leading-6 opacity-60">
            {text(props.description)}
          </p>
          <a
            href="#"
            className="mt-8 inline-flex rounded-full bg-black px-7 py-4 text-sm font-black text-white"
          >
            Выбрать тариф
          </a>
        </div>
      </div>
    </section>
  );
}
`;
}

function createCtaBlock() {
  return `import { number, text } from '@/components/utils';

export function CtaBlock(props: Record<string, unknown>) {
  return (
    <section
      className="text-center"
      style={{
        paddingTop: number(props.paddingY, 96),
        paddingBottom: number(props.paddingY, 96),
        paddingLeft: number(props.paddingX, 32),
        paddingRight: number(props.paddingX, 32),
        backgroundColor: text(props.backgroundColor, '#050505'),
        color: text(props.textColor, '#ffffff')
      }}
    >
      <div className="mx-auto" style={{ maxWidth: number(props.containerWidth, 1180) }}>
        <h2 className="text-5xl font-black tracking-tight">
          {text(props.title)}
        </h2>
        <a
          href="#"
          className="mt-8 inline-flex px-7 py-4 text-sm font-black"
          style={{
            borderRadius: number(props.radius, 32),
            backgroundColor: text(props.buttonBackgroundColor, '#ffffff'),
            color: text(props.buttonTextColor, '#000000')
          }}
        >
          {text(props.buttonText, 'Оставить заявку')}
        </a>
      </div>
    </section>
  );
}
`;
}

function createGalleryBlock() {
  return `import { number, stringArray, text } from '@/components/utils';

export function GalleryBlock(props: Record<string, unknown>) {
  const images = stringArray(props.images);

  return (
    <section
      style={{
        paddingTop: number(props.paddingY, 96),
        paddingBottom: number(props.paddingY, 96),
        paddingLeft: number(props.paddingX, 32),
        paddingRight: number(props.paddingX, 32),
        backgroundColor: text(props.backgroundColor, '#ffffff'),
        color: text(props.textColor, '#111111')
      }}
    >
      <div className="mx-auto" style={{ maxWidth: number(props.containerWidth, 1180) }}>
        <h2 className="text-center text-4xl font-black tracking-tight">
          {text(props.title)}
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {images.length ? (
            images.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                className="h-72 w-full object-cover"
                style={{ borderRadius: number(props.radius, 28) }}
              />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-dashed border-current/20 p-12 text-center opacity-50">
              Добавь изображения
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
`;
}

function createContactBlock() {
  return `import { number, text } from '@/components/utils';

export function ContactBlock(props: Record<string, unknown>) {
  return (
    <section
      style={{
        paddingTop: number(props.paddingY, 96),
        paddingBottom: number(props.paddingY, 96),
        paddingLeft: number(props.paddingX, 32),
        paddingRight: number(props.paddingX, 32),
        backgroundColor: text(props.backgroundColor, '#ffffff'),
        color: text(props.textColor, '#111111')
      }}
    >
      <div className="mx-auto" style={{ maxWidth: number(props.containerWidth, 760) }}>
        <div className="text-center">
          <h2 className="text-4xl font-black">{text(props.title)}</h2>
          <p className="mt-4 opacity-60">{text(props.subtitle)}</p>
        </div>

        <form className="mt-8 space-y-3">
          <input className="h-14 w-full rounded-xl border px-4" placeholder="Имя" />
          <input className="h-14 w-full rounded-xl border px-4" placeholder="Email" />
          <textarea className="w-full rounded-xl border px-4 py-3" rows={4} placeholder="Сообщение" />
          <button className="h-14 w-full rounded-xl bg-black font-black text-white" type="button">
            {text(props.buttonText, 'Отправить')}
          </button>
        </form>
      </div>
    </section>
  );
}
`;
}

function createFooterBlock() {
  return `import { number, stringArray, text } from '@/components/utils';

export function FooterBlock(props: Record<string, unknown>) {
  const columns = stringArray(props.columns);
  const links = stringArray(props.links);

  return (
    <footer
      style={{
        paddingTop: number(props.paddingY, 70),
        paddingBottom: number(props.paddingY, 70),
        paddingLeft: number(props.paddingX, 32),
        paddingRight: number(props.paddingX, 32),
        backgroundColor: text(props.backgroundColor, '#050505'),
        color: text(props.textColor, '#ffffff')
      }}
    >
      <div className="mx-auto" style={{ maxWidth: number(props.containerWidth, 1180) }}>
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <h3 className="text-3xl font-black tracking-tight">
              {text(props.brand, 'Corshun')}
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-6 opacity-60">
              {text(props.description)}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((column, index) => (
              <div key={column}>
                <p className="text-sm font-black uppercase tracking-[0.18em]">
                  {column}
                </p>
                <div className="mt-4 space-y-3 text-sm opacity-65">
                  {links.slice(index * 2, index * 2 + 2).map((link) => (
                    <p key={link}>{link}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-12 border-t border-current/10 pt-6 text-sm opacity-45">
          {text(props.copyright, '© 2026 Corshun')}
        </p>
      </div>
    </footer>
  );
}
`;
}

export async function exportToNextProjectZip(blocks: Block[], theme?: Theme) {
  const zip = new JSZip();

  zip.file('package.json', createPackageJson());
  zip.file('tailwind.config.ts', createTailwindConfig());
  zip.file('postcss.config.js', createPostcssConfig());
  zip.file('tsconfig.json', createTsConfig());
  zip.file('next-env.d.ts', createNextEnv());

  zip.folder('app')?.file('globals.css', createGlobalsCss());
  zip.folder('app')?.file('layout.tsx', createLayout());
  zip.folder('app')?.file('page.tsx', createPage());

  zip.folder('types')?.file('site.ts', createTypesFile());
  zip.folder('data')?.file('site.ts', createSiteData(blocks, theme));

  zip.folder('components')?.file('BlockRenderer.tsx', createBlockRenderer());
  zip.folder('components')?.file('utils.ts', createUtils());

  const blocksFolder = zip.folder('components')?.folder('blocks');

  blocksFolder?.file('HeaderBlock.tsx', createHeaderBlock());
  blocksFolder?.file('HeroBlock.tsx', createHeroBlock());
  blocksFolder?.file('FeaturesBlock.tsx', createFeaturesBlock());
  blocksFolder?.file('PricingBlock.tsx', createPricingBlock());
  blocksFolder?.file('TestimonialsBlock.tsx', createSimpleGridBlock('TestimonialsBlock', 'title', 'items'));
  blocksFolder?.file('FaqBlock.tsx', createSimpleGridBlock('FaqBlock', 'title', 'items'));
  blocksFolder?.file('LogosBlock.tsx', createSimpleGridBlock('LogosBlock', 'title', 'logos'));
  blocksFolder?.file('StatsBlock.tsx', createSimpleGridBlock('StatsBlock', 'title', 'items'));
  blocksFolder?.file('CtaBlock.tsx', createCtaBlock());
  blocksFolder?.file('GalleryBlock.tsx', createGalleryBlock());
  blocksFolder?.file('ContactBlock.tsx', createContactBlock());
  blocksFolder?.file('FooterBlock.tsx', createFooterBlock());

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'corshun-next-project.zip');
}