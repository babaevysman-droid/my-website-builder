import { create } from 'zustand';
import { Block, Theme, Site } from '@/types';

interface BuilderState {
  siteId: string | null;
  theme: Theme;
  blocks: Block[];
  activeBlockId: string | null;
  isSaving: boolean;
  isDirty: boolean;

  initSite: (site: Site) => void;
  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (activeId: string, overId: string) => void;
  moveBlockUp: (id: string) => void;
  moveBlockDown: (id: string) => void;
  updateBlockProps: (id: string, props: Record<string, any>) => void;
  setActiveBlock: (id: string | null) => void;
  updateTheme: (theme: Partial<Theme>) => void;
  setSaving: (status: boolean) => void;
  setDirty: (status: boolean) => void;
}

function cloneBlock(block: Block): Block {
  return {
    ...block,
    id: crypto.randomUUID(),
    props: JSON.parse(JSON.stringify(block.props)),
  };
}

export const useBuilderStore = create<BuilderState>((set) => ({
  siteId: null,
  theme: {
    font: 'Inter',
    primaryColor: '#000000',
    backgroundColor: '#ffffff',
  },
  blocks: [],
  activeBlockId: null,
  isSaving: false,
  isDirty: false,

  initSite: (site) =>
    set({
      siteId: site.id,
      theme: site.theme,
      blocks: site.blocks,
      activeBlockId: null,
      isDirty: false,
    }),

  addBlock: (block) =>
    set((state) => ({
      blocks: [...state.blocks, block],
      activeBlockId: block.id,
      isDirty: true,
    })),

  removeBlock: (id) =>
    set((state) => ({
      blocks: state.blocks.filter((b) => b.id !== id),
      activeBlockId: state.activeBlockId === id ? null : state.activeBlockId,
      isDirty: true,
    })),

  duplicateBlock: (id) =>
    set((state) => {
      const index = state.blocks.findIndex((b) => b.id === id);
      if (index === -1) return state;

      const copy = cloneBlock(state.blocks[index]);
      const blocks = [...state.blocks];
      blocks.splice(index + 1, 0, copy);

      return {
        blocks,
        activeBlockId: copy.id,
        isDirty: true,
      };
    }),

  moveBlock: (activeId, overId) =>
    set((state) => {
      const oldIndex = state.blocks.findIndex((b) => b.id === activeId);
      const newIndex = state.blocks.findIndex((b) => b.id === overId);

      if (oldIndex === -1 || newIndex === -1) return state;

      const newBlocks = [...state.blocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      return {
        blocks: newBlocks,
        isDirty: true,
      };
    }),

  moveBlockUp: (id) =>
    set((state) => {
      const index = state.blocks.findIndex((b) => b.id === id);
      if (index <= 0) return state;

      const blocks = [...state.blocks];
      const temp = blocks[index - 1];
      blocks[index - 1] = blocks[index];
      blocks[index] = temp;

      return {
        blocks,
        isDirty: true,
      };
    }),

  moveBlockDown: (id) =>
    set((state) => {
      const index = state.blocks.findIndex((b) => b.id === id);
      if (index === -1 || index >= state.blocks.length - 1) return state;

      const blocks = [...state.blocks];
      const temp = blocks[index + 1];
      blocks[index + 1] = blocks[index];
      blocks[index] = temp;

      return {
        blocks,
        isDirty: true,
      };
    }),

  updateBlockProps: (id, props) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === id ? { ...b, props: { ...b.props, ...props } } : b
      ),
      isDirty: true,
    })),

  setActiveBlock: (id) => set({ activeBlockId: id }),

  updateTheme: (newTheme) =>
    set((state) => ({
      theme: {
        ...state.theme,
        ...newTheme,
      },
      isDirty: true,
    })),

  setSaving: (status) => set({ isSaving: status }),

  setDirty: (status) => set({ isDirty: status }),
}));