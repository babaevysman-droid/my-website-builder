import { Block } from '@/types';
import HeroBlock from './HeroBlock';
import FeaturesBlock from './FeaturesBlock';
import PricingBlock from './PricingBlock';
import CtaBlock from './CtaBlock';
import FooterBlock from './FooterBlock';
import ContactBlock from './ContactBlock';
import GalleryBlock from './GalleryBlock';

export default function BlockRenderer({
  block,
  siteId,
}: {
  block: Block;
  siteId?: string;
}) {
  switch (block.type) {
    case 'hero':
      return (
        <HeroBlock
          title={String(block.props.title ?? '')}
          subtitle={String(block.props.subtitle ?? '')}
          buttonText={String(block.props.buttonText ?? '')}
          secondaryButtonText={String(block.props.secondaryButtonText ?? '')}
          imageUrl={String(block.props.imageUrl ?? '')}
          backgroundImageUrl={String(block.props.backgroundImageUrl ?? '')}
        />
      );

    case 'features':
      return (
        <FeaturesBlock
          title={String(block.props.title ?? '')}
          items={Array.isArray(block.props.items) ? block.props.items : []}
        />
      );

    case 'pricing':
      return (
        <PricingBlock
          title={String(block.props.title ?? '')}
          price={String(block.props.price ?? '')}
          description={String(block.props.description ?? '')}
        />
      );

    case 'cta':
      return (
        <CtaBlock
          title={String(block.props.title ?? '')}
          buttonText={String(block.props.buttonText ?? '')}
        />
      );

    case 'footer':
      return <FooterBlock text={String(block.props.text ?? '')} />;

    case 'contact':
      return (
        <ContactBlock
          siteId={siteId}
          title={String(block.props.title ?? '')}
          subtitle={String(block.props.subtitle ?? '')}
          buttonText={String(block.props.buttonText ?? '')}
        />
      );

    case 'gallery':
      return (
        <GalleryBlock
          title={String(block.props.title ?? '')}
          images={Array.isArray(block.props.images) ? block.props.images : []}
        />
      );

    default:
      return (
        <div className="p-8 text-center text-red-500">
          Unknown block: {block.type}
        </div>
      );
  }
}