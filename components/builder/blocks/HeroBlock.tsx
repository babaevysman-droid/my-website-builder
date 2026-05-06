'use client';

import { useState, useEffect } from 'react';
import ShinyButton from '@/components/ui/ShinyButton';
import InlineText from '../InlineText';
import { BlockStyleSettings } from './BlockRenderer';

type HeroBlockProps = {
  blockId: string;
  editable?: boolean;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundImageUrl?: string;
  imageQuery?: string;
  blockStyle?: BlockStyleSettings;
};

type HeroVariant =
  | 'split-screen'
  | 'full-bg-overlay'
  | 'app-mockup'
  | 'glassmorphism'
  | 'brutalism'
  | 'multi-image-grid'
  | 'left-white-space'
  | 'gradient-mesh'
  | 'vertical-hero'
  | 'product-showcase';

function normalizeVariant(value?: string): HeroVariant {
  const variants: HeroVariant[] = [
    'split-screen', 'full-bg-overlay', 'app-mockup', 'glassmorphism',
    'brutalism', 'multi-image-grid', 'left-white-space', 'gradient-mesh',
    'vertical-hero', 'product-showcase',
  ];
  return variants.includes(value as HeroVariant) ? (value as HeroVariant) : 'full-bg-overlay';
}

export default function HeroBlock({
  blockId,
  editable = false,
  eyebrow = '',
  title,
  subtitle = '',
  buttonText = '',
  secondaryButtonText = '',
  backgroundImageUrl,
  imageQuery,
  blockStyle,
}: HeroBlockProps) {
  const [imageUrl, setImageUrl] = useState(backgroundImageUrl || blockStyle?.backgroundImageUrl || '');

  useEffect(() => {
    const currentBg = backgroundImageUrl || blockStyle?.backgroundImageUrl;
    if (currentBg) {
      setImageUrl(currentBg);
      return;
    }
    
    if (imageQuery) {
      const encoded = encodeURIComponent(imageQuery);
      const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
      
      if (accessKey) {
        fetch(`https://api.unsplash.com/search/photos?query=${encoded}&per_page=1&orientation=landscape`, {
          headers: {
            'Authorization': `Client-ID ${accessKey}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            if (data.results?.[0]?.urls?.regular) {
              setImageUrl(data.results[0].urls.regular);
            }
          })
          .catch(() => {
            setImageUrl(`https://source.unsplash.com/featured/1600x900?${encoded}`);
          });
      } else {
        setImageUrl(`https://source.unsplash.com/featured/1600x900?${encoded}`);
      }
    }
  }, [backgroundImageUrl, imageQuery, blockStyle?.backgroundImageUrl]);

  const variant = normalizeVariant(blockStyle?.variant ?? blockStyle?.layoutType);
  const effects = blockStyle?.effects ?? {};
  const hasBackground = Boolean(imageUrl);

  const height = Number.isFinite(blockStyle?.height) ? blockStyle!.height! : 92;
  const paddingY = Number.isFinite(blockStyle?.paddingY) ? blockStyle!.paddingY! : 120;
  const paddingX = Number.isFinite(blockStyle?.paddingX) ? blockStyle!.paddingX! : 32;
  const containerWidth = Number.isFinite(blockStyle?.containerWidth) ? blockStyle!.containerWidth! : 1240;
  const headingSize = Number.isFinite(blockStyle?.headingSize) ? blockStyle!.headingSize! : 88;
  const subtitleSize = Number.isFinite(blockStyle?.subtitleSize) ? blockStyle!.subtitleSize! : 22;

  const bg = blockStyle?.backgroundColor || '#050505';
  const color = blockStyle?.textColor || '#ffffff';
  const accent = blockStyle?.accentColor || blockStyle?.primaryColor || '#a855f7';

  const fallbackBackground = {
    background:
      `radial-gradient(circle at 20% 20%, ${accent}66, transparent 34%), ` +
      `radial-gradient(circle at 80% 30%, #22d3ee44, transparent 30%), ` +
      `linear-gradient(135deg, ${bg}, #070707)`,
  };

  const titleClass = [
    'font-black leading-[0.9] tracking-[-0.075em]',
    effects.gradientText || variant === 'gradient-mesh'
      ? 'bg-gradient-to-r from-white via-white to-fuchsia-300 bg-clip-text text-transparent'
      : '',
  ].join(' ');

  const copy = (
    <>
      {eyebrow && (
        <InlineText blockId={blockId} propKey="eyebrow" value={eyebrow} editable={editable}
          as="p" className="mb-7 text-sm font-black uppercase tracking-[0.32em] opacity-80" />
      )}
      <InlineText blockId={blockId} propKey="title" value={title} editable={editable}
        as="h1" className={titleClass}
        style={{ fontSize: `clamp(42px, ${headingSize / 14}vw, ${headingSize}px)` }} />
      {subtitle && (
        <InlineText blockId={blockId} propKey="subtitle" value={subtitle} editable={editable}
          as="p" className="mt-8 max-w-3xl leading-relaxed opacity-80 mx-auto"
          style={{ fontSize: `clamp(16px, 2vw, ${subtitleSize}px)` }} />
      )}
      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        {buttonText && (
          <ShinyButton variant="primary">
            <InlineText blockId={blockId} propKey="buttonText" value={buttonText} editable={editable} as="span" />
          </ShinyButton>
        )}
        {secondaryButtonText && (
          <ShinyButton variant="outline">
            <InlineText blockId={blockId} propKey="secondaryButtonText" value={secondaryButtonText} editable={editable} as="span" />
          </ShinyButton>
        )}
      </div>
    </>
  );

  return (
    <section className="relative isolate overflow-hidden flex items-center justify-center"
      style={{ 
        minHeight: `${height}vh`, 
        paddingTop: paddingY, 
        paddingBottom: paddingY, 
        paddingLeft: paddingX, 
        paddingRight: paddingX, 
        backgroundColor: bg, 
        color, 
        ...(hasBackground ? {} : fallbackBackground) 
      }}>
      
      {hasBackground && (
        <>
          <img src={imageUrl} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" 
               style={{ 
                 objectPosition: blockStyle?.backgroundPosition || 'center',
                 opacity: variant === 'full-bg-overlay' ? 1 : 0.4
               }} 
          />
          <div className="absolute inset-0 -z-10"
            style={{ 
              background: `linear-gradient(180deg, rgba(0,0,0,0.2), ${blockStyle?.overlayColor || '#000000'})`, 
              opacity: (blockStyle?.overlayOpacity ?? 65) / 100 
            }} 
          />
        </>
      )}

      {(effects.glow || variant === 'gradient-mesh') && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: accent, opacity: 0.26 }} />
      )}

      {effects.noise && (
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:18px_18px]" />
      )}

      <div className="relative z-10 mx-auto" style={{ maxWidth: containerWidth }}>
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          {copy}
        </div>
      </div>
    </section>
  );
}