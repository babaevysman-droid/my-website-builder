import { Block } from '@/types';
import { findUnsplashImage } from './unsplash';

function getString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function enrichAiBlocksWithImages(blocks: Block[]) {
  return Promise.all(
    blocks.map(async (block) => {
      const imageQuery = getString(block.props.imageQuery);

      if (!imageQuery) {
        return block;
      }

      const imageUrl = await findUnsplashImage(imageQuery);

      if (!imageUrl) {
        return block;
      }

      if (block.type === 'hero') {
        return {
          ...block,
          props: {
            ...block.props,
            backgroundImageUrl:
              getString(block.props.backgroundImageUrl) || imageUrl,
          },
        };
      }

      if (block.type === 'gallery') {
        return {
          ...block,
          props: {
            ...block.props,
            images: [imageUrl],
          },
        };
      }

      return {
        ...block,
        props: {
          ...block.props,
          imageUrl: getString(block.props.imageUrl) || imageUrl,
        },
      };
    })
  );
}