'use client';

import { BlockType } from '@/types';
import { useBuilderStore } from '@/store/useBuilderStore';

const blockTypes: BlockType[] = [
  'hero',
  'features',
  'pricing',
  'gallery',
  'cta',
  'footer',
  'contact',
];

export default function Sidebar() {
  const { addBlock } = useBuilderStore();

  function createBlock(type: BlockType) {
    addBlock({
      id: crypto.randomUUID(),
      type,
      props: {},
    });
  }

  return (
    <div className="w-60 border-r border-neutral-800 bg-neutral-950 p-4 text-white">
      <h2 className="mb-4 text-lg font-semibold">Блоки</h2>

      <div className="space-y-2">
        {blockTypes.map((type) => (
          <button
            key={type}
            onClick={() => createBlock(type)}
            className="w-full rounded border border-neutral-700 px-3 py-2 text-left hover:bg-neutral-800"
          >
            + {type}
          </button>
        ))}
      </div>
    </div>
  );
}