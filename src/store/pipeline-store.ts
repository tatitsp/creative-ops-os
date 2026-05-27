import { create } from "zustand";
import { MOCK_CONTENT } from "@/lib/mock-data";
import type { ContentItem, ContentPhase } from "@/types";

interface PipelineStore {
  items: ContentItem[];
  moveItem: (id: string, toPhase: ContentPhase) => void;
}

export const usePipelineStore = create<PipelineStore>((set) => ({
  items: MOCK_CONTENT,
  moveItem: (id, toPhase) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, phase: toPhase } : item
      ),
    })),
}));
