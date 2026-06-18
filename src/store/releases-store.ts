import { create } from "zustand";

export type ReleaseType = "SINGLE" | "EP" | "ALBUM" | "MERCH_DROP" | "TOUR";
export type ReleaseStatus =
  | "CONCEPT"
  | "PRE_RELEASE"
  | "RELEASE_WEEK"
  | "RELEASED"
  | "ARCHIVED";

export type ApiRelease = {
  id: string;
  title: string;
  artist: string;
  type: ReleaseType;
  status: ReleaseStatus;
  releaseDate: string;
  announcementDate: string | null;
  coverArt: string | null;
  trackCount: number;
  leadSingles: string[];
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

interface ReleasesStore {
  releases: ApiRelease[];
  workspaceSlug: string;
  init: (slug: string, initial: ApiRelease[]) => void;
  addRelease: (release: ApiRelease) => void;
  updateRelease: (id: string, patch: Partial<ApiRelease>) => void;
  removeRelease: (id: string) => void;
}

export const useReleasesStore = create<ReleasesStore>((set, get) => ({
  releases: [],
  workspaceSlug: "",

  init: (slug, initial) => {
    set({ workspaceSlug: slug, releases: initial });
  },

  addRelease: (release) => {
    set((state) => ({ releases: [release, ...state.releases] }));
  },

  updateRelease: (id, patch) => {
    const { workspaceSlug } = get();
    // Optimistic update
    set((state) => ({
      releases: state.releases.map((r) =>
        r.id === id ? { ...r, ...patch } : r
      ),
    }));
    // Persist to DB
    fetch(`/api/workspaces/${workspaceSlug}/releases/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).catch(console.error);
  },

  removeRelease: (id) => {
    const { workspaceSlug } = get();
    // Optimistic update
    set((state) => ({ releases: state.releases.filter((r) => r.id !== id) }));
    // Persist to DB
    fetch(`/api/workspaces/${workspaceSlug}/releases/${id}`, {
      method: "DELETE",
    }).catch(console.error);
  },
}));
