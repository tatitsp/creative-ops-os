import { create } from "zustand";
import type { ContentItem, ContentPhase, UserRole, UserStatus } from "@/types";

// Shape of a content item coming from the API
export type ApiContentItem = {
  id: string;
  title: string;
  caption?: string | null;
  phase: ContentPhase;
  type: string;
  platforms: string[];
  scheduledAt?: string | null;
  priority?: string;
  isOrganic?: boolean;
  campaign?: { id: string; name: string } | null;
  assignee?: { id: string; name: string; image?: string | null; role: string; status: string } | null;
};

function toContentItem(raw: ApiContentItem): ContentItem {
  return {
    id: raw.id,
    title: raw.title,
    caption: raw.caption ?? undefined,
    phase: raw.phase,
    type: raw.type as ContentItem["type"],
    platforms: raw.platforms,
    scheduledAt: raw.scheduledAt ? new Date(raw.scheduledAt) : undefined,
    campaignName: raw.campaign?.name,
    assignee: raw.assignee
      ? {
          id: raw.assignee.id,
          name: raw.assignee.name,
          image: raw.assignee.image ?? undefined,
          role: raw.assignee.role as UserRole,
          status: raw.assignee.status as UserStatus,
        }
      : undefined,
  };
}

interface PipelineStore {
  items: ContentItem[];
  workspaceSlug: string;
  loading: boolean;
  init: (slug: string, initial: ApiContentItem[]) => void;
  moveItem: (id: string, toPhase: ContentPhase) => void;
  addItem: (item: ApiContentItem) => void;
  removeItem: (id: string) => void;
}

export const usePipelineStore = create<PipelineStore>((set, get) => ({
  items: [],
  workspaceSlug: "",
  loading: false,

  init: (slug, initial) => {
    set({ workspaceSlug: slug, items: initial.map(toContentItem) });
  },

  moveItem: (id, toPhase) => {
    const { workspaceSlug } = get();
    // Optimistic update
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, phase: toPhase } : item
      ),
    }));
    // Persist to DB
    fetch(`/api/workspaces/${workspaceSlug}/content/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase: toPhase }),
    }).catch(console.error);
  },

  addItem: (raw) => {
    set((state) => ({
      items: [toContentItem(raw), ...state.items],
    }));
  },

  removeItem: (id) => {
    const { workspaceSlug } = get();
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    fetch(`/api/workspaces/${workspaceSlug}/content/${id}`, { method: "DELETE" }).catch(console.error);
  },
}));
