import { Block } from '@/types';
import AnimatedSection from '../AnimatedSection';
import HeaderBlock from './HeaderBlock';
import HeroBlock from './HeroBlock';
import FeaturesBlock from './FeaturesBlock';
import PricingBlock from './PricingBlock';
import CtaBlock from './CtaBlock';
import FooterBlock from './FooterBlock';
import ContactBlock from './ContactBlock';
import GalleryBlock from './GalleryBlock';
import TestimonialsBlock from './TestimonialsBlock';
import StatsBlock from './StatsBlock';
import FaqBlock from './FaqBlock';
import InlineText from '../InlineText';

export type BlockLayoutType =
  | 'classic'
  | 'split'
  | 'glass'
  | 'minimal'
  | 'editorial'
  | 'dark'
  | 'gradient';

export type BlockEffects = {
  glass?: boolean;
  gradientText?: boolean;
  glow?: boolean;
  noise?: boolean;
};

export type BlockStyleSettings = {
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  accentColor?: string;
  surfaceColor?: string;
  mutedColor?: string;

  paddingY?: number;
  paddingX?: number;
  align?: 'left' | 'center' | 'right';
  radius?: number;
  containerWidth?: number;

  layout?: string;
  layoutType?: BlockLayoutType;
  variant?: string;

  height?: number;
  headingSize?: number;
  subtitleSize?: number;

  backgroundImageUrl?: string;
  imageUrl?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  backgroundPosition?: string;
  backgroundSize?: string;

  buttonStyle?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  secondaryButtonBackgroundColor?: string;
  secondaryButtonTextColor?: string;

  effects?: BlockEffects;
};

function readNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const next = Number(value);
  return Number.isFinite(next) ? next : undefined;
}

function readString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  return String(value);
}

function readAlign(value: unknown): 'left' | 'center' | 'right' | undefined {
  const next = String(value);
  if (next === 'left' || next === 'center' || next === 'right') return next;
  return undefined;
}

function readLayoutType(value: unknown): BlockLayoutType | undefined {
  const next = String(value);
  if (next === 'classic' || next === 'split' || next === 'glass' || next === 'minimal' || next === 'editorial' || next === 'dark' || next === 'gradient') return next;
  return undefined;
}

function readEffects(value: unknown): BlockEffects | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const raw = value as Record<string, unknown>;
  return {
    glass: Boolean(raw.glass),
    gradientText: Boolean(raw.gradientText),
    glow: Boolean(raw.glow),
    noise: Boolean(raw.noise),
  };
}

function safeString(value: unknown, fallback: string = ''): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
}

function arrayValue<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function getBlockStyle(block: Block): BlockStyleSettings {
  return {
    backgroundColor: readString(block.props.backgroundColor),
    textColor: readString(block.props.textColor),
    primaryColor: readString(block.props.primaryColor),
    accentColor: readString(block.props.accentColor),
    surfaceColor: readString(block.props.surfaceColor),
    mutedColor: readString(block.props.mutedColor),
    paddingY: readNumber(block.props.paddingY),
    paddingX: readNumber(block.props.paddingX),
    align: readAlign(block.props.align),
    radius: readNumber(block.props.radius),
    containerWidth: readNumber(block.props.containerWidth),
    layout: readString(block.props.layout),
    layoutType: readLayoutType(block.props.layoutType),
    variant: readString(block.props.variant),
    height: readNumber(block.props.height),
    headingSize: readNumber(block.props.headingSize),
    subtitleSize: readNumber(block.props.subtitleSize),
    backgroundImageUrl: readString(block.props.backgroundImageUrl),
    imageUrl: readString(block.props.imageUrl),
    overlayColor: readString(block.props.overlayColor),
    overlayOpacity: readNumber(block.props.overlayOpacity),
    backgroundPosition: readString(block.props.backgroundPosition),
    backgroundSize: readString(block.props.backgroundSize),
    buttonStyle: readString(block.props.buttonStyle),
    buttonBackgroundColor: readString(block.props.buttonBackgroundColor),
    buttonTextColor: readString(block.props.buttonTextColor),
    secondaryButtonBackgroundColor: readString(block.props.secondaryButtonBackgroundColor),
    secondaryButtonTextColor: readString(block.props.secondaryButtonTextColor),
    effects: readEffects(block.props.effects),
  };
}

function SectionShell({ children, blockStyle }: { children: React.ReactNode; blockStyle?: BlockStyleSettings }) {
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
      <div className="mx-auto" style={{ maxWidth: blockStyle?.containerWidth ?? 1180 }}>
        {children}
      </div>
    </section>
  );
}

function LogosBlock({ blockId, editable, title, logos, blockStyle }: { blockId: string; editable?: boolean; title: string; logos: string[]; blockStyle?: BlockStyleSettings }) {
  return (
    <SectionShell blockStyle={blockStyle}>
      <InlineText blockId={blockId} propKey="title" value={title} editable={editable} as="h2" className="text-center text-sm font-black uppercase tracking-[0.24em] opacity-45" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3 md:grid-cols-5">
        {logos.map((logo, index) => (
          <div key={`${logo}-${index}`} className="flex h-24 items-center justify-center rounded-2xl border border-current/10 text-lg font-black opacity-65">{logo}</div>
        ))}
      </div>
    </SectionShell>
  );
}

function getDefaultAnimation(type: string): string {
  const defaults: Record<string, string> = {
    header: 'fade-in-down', hero: 'blur-in', features: 'stagger-fade-up',
    pricing: 'stagger-scale', testimonials: 'stagger-fade-left', faq: 'stagger-slide-up',
    stats: 'counter-roll', cta: 'scale-in-spring', gallery: 'stagger-scale',
    contact: 'fade-in-up', footer: 'fade-in',
  };
  return defaults[type] || 'fade-in-up';
}

export default function BlockRenderer({ block, siteId, editable = false }: { block: Block; siteId?: string; editable?: boolean }) {
  const blockStyle = getBlockStyle(block);
  const animation = safeString(block.props.animation, getDefaultAnimation(block.type));
  const intensity = safeString(block.props.animationIntensity, 'medium');
  const delay = Number(block.props.animationDelay) || 0;

  const content = (() => {
    switch (block.type) {
      case 'header':
        return (
          <HeaderBlock
            blockId={block.id} editable={editable}
            logo={safeString(block.props.logo)}
            links={stringArray(block.props.links)}
            buttonText={safeString(block.props.buttonText)}
            blockStyle={blockStyle}
          />
        );

      case 'hero':
        return (
          <HeroBlock
            blockId={block.id} editable={editable}
            eyebrow={safeString(block.props.eyebrow)}
            title={safeString(block.props.title)}
            subtitle={safeString(block.props.subtitle)}
            buttonText={safeString(block.props.buttonText)}
            buttonUrl={safeString(block.props.buttonUrl)}
            secondaryButtonText={safeString(block.props.secondaryButtonText)}
            secondaryButtonUrl={safeString(block.props.secondaryButtonUrl)}
            backgroundImageUrl={safeString(block.props.backgroundImageUrl)}
            imageQuery={safeString(block.props.imageQuery)}
            blockStyle={blockStyle}
          />
        );

      case 'features':
        return (
          <FeaturesBlock
            blockId={block.id} editable={editable}
            title={safeString(block.props.title)}
            items={arrayValue(block.props.items)}
            blockStyle={blockStyle}
          />
        );

      case 'logos':
        return (
          <LogosBlock
            blockId={block.id} editable={editable}
            title={safeString(block.props.title)}
            logos={stringArray(block.props.logos)}
            blockStyle={blockStyle}
          />
        );

      case 'stats':
        return (
          <StatsBlock
            blockId={block.id} editable={editable}
            title={safeString(block.props.title)}
            items={arrayValue(block.props.items)}
            blockStyle={blockStyle}
          />
        );

      case 'testimonials':
        return (
          <TestimonialsBlock
            blockId={block.id} editable={editable}
            title={safeString(block.props.title)}
            items={arrayValue(block.props.items)}
            blockStyle={blockStyle}
          />
        );

      case 'faq':
        return (
          <FaqBlock
            blockId={block.id} editable={editable}
            title={safeString(block.props.title)}
            items={arrayValue(block.props.items)}
            blockStyle={blockStyle}
          />
        );

      case 'pricing':
        return (
          <PricingBlock
            blockId={block.id} editable={editable}
            title={safeString(block.props.title ?? 'Тарифы')}
            price={safeString(block.props.price)}
            description={safeString(block.props.description)}
            plans={block.props.plans}
            buttonText={safeString(block.props.buttonText, 'Выбрать')}
            blockStyle={blockStyle}
          />
        );

      case 'cta':
        return (
          <CtaBlock
            blockId={block.id} editable={editable}
            title={safeString(block.props.title)}
            buttonText={safeString(block.props.buttonText)}
            blockStyle={blockStyle}
          />
        );

      case 'gallery':
        return (
          <GalleryBlock
            blockId={block.id} editable={editable}
            title={safeString(block.props.title)}
            images={stringArray(block.props.images)}
            imageQuery={safeString(block.props.imageQuery)}
            blockStyle={blockStyle}
          />
        );

      case 'footer':
        return (
          <FooterBlock
            blockId={block.id} editable={editable}
            brand={safeString((block.props as any).brand)}
            description={safeString((block.props as any).description)}
            columns={stringArray((block.props as any).columns)}
            links={stringArray((block.props as any).links)}
            copyright={safeString((block.props as any).copyright)}
            blockStyle={blockStyle}
          />
        );
        
      case 'contact':
        return (
          <ContactBlock
            blockId={block.id} editable={editable} siteId={siteId}
            title={safeString(block.props.title)}
            subtitle={safeString(block.props.subtitle)}
            buttonText={safeString(block.props.buttonText)}
            fields={arrayValue(block.props.fields)}
            successMessage={safeString(block.props.successMessage)}
            blockStyle={blockStyle}
          />
        );

      default:
        return <div className="p-8 text-center text-red-500">Unknown block: {block.type}</div>;
    }
  })();

  return (
    <AnimatedSection animation={animation} intensity={intensity as any} delay={delay}>
      {content}
    </AnimatedSection>
  );
}