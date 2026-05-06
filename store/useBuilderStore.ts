import { create } from 'zustand';
import { Block, CustomFont, Site, Theme } from '@/types';

export type BuilderViewport = 'desktop' | 'mobile';
export type BuilderPanel = 'blocks' | 'editor' | 'settings' | null;
export type BuilderEditorTab = 'content' | 'settings' | 'design' | 'media';

type BlockProps = Record<string, unknown>;

type BuilderSnapshot = {
  blocks: Block[];
  theme: Theme;
};

const defaultTheme: Theme = {
  font: 'Inter',
  fontUrl: '',
  customFonts: [],
  textColor: '#000000',
  primaryColor: '#000000',
  backgroundColor: '#ffffff',
  radius: 16,
};

function normalizeTheme(theme?: Partial<Theme> | null): Theme {
  return {
    ...defaultTheme,
    ...(theme ?? {}),
    customFonts: theme?.customFonts ?? [],
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function createSnapshot(blocks: Block[], theme: Theme): BuilderSnapshot {
  return {
    blocks: clone(blocks),
    theme: clone(theme),
  };
}

function cloneBlock(block: Block): Block {
  return {
    ...block,
    id: crypto.randomUUID(),
    props: clone(block.props ?? {}),
  };
}

function updateBlockPropsInList(
  blocks: Block[],
  id: string,
  props: BlockProps
): Block[] {
  return blocks.map((block) =>
    block.id === id
      ? {
          ...block,
          props: {
            ...(block.props ?? {}),
            ...props,
          },
        }
      : block
  );
}

function applyThemeToBlock(block: Block, theme: Theme): Block {
  const darkTypes = new Set(['header', 'hero', 'cta', 'footer', 'stats']);
  const isDark = darkTypes.has(block.type);

  const baseProps: BlockProps = {
    backgroundColor: isDark ? theme.backgroundColor : '#ffffff',
    textColor: isDark ? theme.textColor : '#111111',
    radius: theme.radius ?? 16,
  };

  if (block.type === 'hero' || block.type === 'header') {
    baseProps.buttonBackgroundColor = theme.textColor;
    baseProps.buttonTextColor = theme.backgroundColor;
    baseProps.secondaryButtonTextColor = theme.textColor;
    baseProps.secondaryButtonBackgroundColor = 'transparent';
  }

  if (block.type === 'cta') {
    baseProps.buttonBackgroundColor = theme.primaryColor;
    baseProps.buttonTextColor = '#ffffff';
  }

  return {
    ...block,
    props: {
      ...block.props,
      ...baseProps,
    },
  };
}

interface BuilderState {
  siteId: string | null;
  theme: Theme;
  blocks: Block[];

  activeBlockId: string | null;
  activeText: {
    blockId: string;
    propKey: string;
  } | null;

  activePanel: BuilderPanel;
  editorTab: BuilderEditorTab;
  viewport: BuilderViewport;

  isSaving: boolean;
  isDirty: boolean;

  past: BuilderSnapshot[];
  future: BuilderSnapshot[];

  initSite: (site: Site) => void;

  addBlock: (block: Block) => void;
  addBlockAt: (block: Block, index: number) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (activeId: string, overId: string) => void;
  moveBlockUp: (id: string) => void;
  moveBlockDown: (id: string) => void;

  updateBlockProps: (id: string, props: BlockProps) => void;
  updateBlock: (id: string, props: BlockProps) => void;

  setActiveBlock: (id: string | null) => void;
  setActiveText: (payload: { blockId: string; propKey: string } | null) => void;

  updateTheme: (theme: Partial<Theme>) => void;
  applyThemePreset: (theme: Theme) => void;

  addCustomFont: (font: CustomFont) => void;
  removeCustomFont: (name: string) => void;

  setActivePanel: (panel: BuilderPanel) => void;
  setEditorTab: (tab: BuilderEditorTab) => void;
  openEditor: (tab?: BuilderEditorTab) => void;
  closePanels: () => void;
  setViewport: (viewport: BuilderViewport) => void;

  setSaving: (status: boolean) => void;
  setDirty: (status: boolean) => void;

  undo: () => void;
  redo: () => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => {
  function withHistory(
    updater: (state: BuilderState) => Partial<BuilderState>
  ) {
    set((state) => {
      const snapshot = createSnapshot(state.blocks, state.theme);
      const next = updater(state);

      return {
        ...next,
        past: [...state.past.slice(-49), snapshot],
        future: [],
        isDirty: true,
      };
    });
  }

  return {
    siteId: null,
    theme: defaultTheme,
    blocks: [],

    activeBlockId: null,
    activeText: null,

    activePanel: null,
    editorTab: 'content',
    viewport: 'desktop',

    isSaving: false,
    isDirty: false,

    past: [],
    future: [],

    initSite: (site) =>
      set({
        siteId: site.id,
        theme: normalizeTheme(site.theme),
        blocks: site.blocks ?? [],
        activeBlockId: null,
        activeText: null,
        activePanel: null,
        editorTab: 'content',
        viewport: 'desktop',
        isSaving: false,
        isDirty: false,
        past: [],
        future: [],
      }),

    addBlock: (block) =>
      withHistory((state) => ({
        blocks: [...state.blocks, block],
        activeBlockId: block.id,
        activeText: null,
        activePanel: 'editor',
        editorTab: 'content',
      })),

    addBlockAt: (block, index) =>
      withHistory((state) => {
        const blocks = [...state.blocks];

        if (index < 0) {
          blocks.unshift(block);
        } else {
          blocks.splice(index + 1, 0, block);
        }

        return {
          blocks,
          activeBlockId: block.id,
          activeText: null,
          activePanel: 'editor',
          editorTab: 'content',
        };
      }),

    removeBlock: (id) =>
      withHistory((state) => ({
        blocks: state.blocks.filter((block) => block.id !== id),
        activeBlockId: state.activeBlockId === id ? null : state.activeBlockId,
        activeText: state.activeText?.blockId === id ? null : state.activeText,
      })),

    duplicateBlock: (id) =>
      withHistory((state) => {
        const index = state.blocks.findIndex((block) => block.id === id);
        if (index === -1) return {};

        const copy = cloneBlock(state.blocks[index]);
        const blocks = [...state.blocks];
        blocks.splice(index + 1, 0, copy);

        return {
          blocks,
          activeBlockId: copy.id,
          activeText: null,
          activePanel: 'editor',
          editorTab: 'content',
        };
      }),

    moveBlock: (activeId, overId) =>
      withHistory((state) => {
        const oldIndex = state.blocks.findIndex(
          (block) => block.id === activeId
        );
        const newIndex = state.blocks.findIndex((block) => block.id === overId);

        if (oldIndex === -1 || newIndex === -1) return {};

        const blocks = [...state.blocks];
        const [movedBlock] = blocks.splice(oldIndex, 1);
        blocks.splice(newIndex, 0, movedBlock);

        return { blocks };
      }),

    moveBlockUp: (id) =>
      withHistory((state) => {
        const index = state.blocks.findIndex((block) => block.id === id);
        if (index <= 0) return {};

        const blocks = [...state.blocks];
        [blocks[index - 1], blocks[index]] = [blocks[index], blocks[index - 1]];

        return { blocks };
      }),

    moveBlockDown: (id) =>
      withHistory((state) => {
        const index = state.blocks.findIndex((block) => block.id === id);
        if (index === -1 || index >= state.blocks.length - 1) return {};

        const blocks = [...state.blocks];
        [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];

        return { blocks };
      }),

    updateBlockProps: (id, props) =>
      withHistory((state) => ({
        blocks: updateBlockPropsInList(state.blocks, id, props),
      })),

    updateBlock: (id, props) =>
      withHistory((state) => ({
        blocks: updateBlockPropsInList(state.blocks, id, props),
      })),

    setActiveBlock: (id) =>
      set({
        activeBlockId: id,
        activeText: id ? get().activeText : null,
      }),

    setActiveText: (payload) =>
      set({
        activeText: payload,
        activeBlockId: payload?.blockId ?? get().activeBlockId,
      }),

    updateTheme: (theme) =>
      withHistory((state) => ({
        theme: normalizeTheme({
          ...state.theme,
          ...theme,
        }),
      })),

    applyThemePreset: (theme) =>
      withHistory((state) => {
        const nextTheme = normalizeTheme(theme);

        return {
          theme: nextTheme,
          blocks: state.blocks.map((block) =>
            applyThemeToBlock(block, nextTheme)
          ),
        };
      }),

    addCustomFont: (font) =>
      withHistory((state) => {
        const currentFonts: CustomFont[] = state.theme.customFonts ?? [];
        const exists = currentFonts.some(
          (item) => item.name.toLowerCase() === font.name.toLowerCase()
        );

        const customFonts = exists
          ? currentFonts.map((item) =>
              item.name.toLowerCase() === font.name.toLowerCase()
                ? font
                : item
            )
          : [...currentFonts, font];

        return {
          theme: {
            ...state.theme,
            font: font.name,
            fontUrl: font.url,
            customFonts,
          },
        };
      }),

    removeCustomFont: (name) =>
      withHistory((state) => {
        const customFonts: CustomFont[] = (state.theme.customFonts ?? []).filter(
          (font) => font.name !== name
        );

        const removedCurrentFont = state.theme.font === name;

        return {
          theme: {
            ...state.theme,
            customFonts,
            font: removedCurrentFont
              ? customFonts[0]?.name ?? 'Inter'
              : state.theme.font,
            fontUrl: removedCurrentFont
              ? customFonts[0]?.url ?? ''
              : state.theme.fontUrl,
          },
        };
      }),

    setActivePanel: (panel) => set({ activePanel: panel }),

    setEditorTab: (tab) => set({ editorTab: tab }),

    openEditor: (tab = 'content') =>
      set({
        activePanel: 'editor',
        editorTab: tab,
      }),

    closePanels: () =>
      set({
        activePanel: null,
      }),

    setViewport: (viewport) => set({ viewport }),

    setSaving: (status) => set({ isSaving: status }),

    setDirty: (status) => set({ isDirty: status }),

    undo: () =>
      set((state) => {
        const previous = state.past[state.past.length - 1];
        if (!previous) return state;

        const current = createSnapshot(state.blocks, state.theme);

        return {
          blocks: previous.blocks,
          theme: previous.theme,
          past: state.past.slice(0, -1),
          future: [current, ...state.future],
          isDirty: true,
          activeText: null,
        };
      }),

    redo: () =>
      set((state) => {
        const next = state.future[0];
        if (!next) return state;

        const current = createSnapshot(state.blocks, state.theme);

        return {
          blocks: next.blocks,
          theme: next.theme,
          past: [...state.past, current],
          future: state.future.slice(1),
          isDirty: true,
          activeText: null,
        };
      }),
  };
});