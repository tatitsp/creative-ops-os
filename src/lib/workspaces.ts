import { ARTIST_PHOTO } from "./mock-data";

export type WorkspaceStatus = "ACTIVE" | "PLANNING" | "COMPLETE";

export type Workspace = {
  slug: string;
  artistName: string;
  artistHandle: string;
  photo: string;
  activeRelease: string;
  releaseStatus: WorkspaceStatus;
  href: string;
  monthlyListeners: string;
  genre: string;
};

export const WORKSPACES: Workspace[] = [
  {
    slug: "lil-tony",
    artistName: "Lil Tony Official",
    artistHandle: "@liltonyny",
    photo: ARTIST_PHOTO,
    activeRelease: "Elijah — Album Rollout",
    releaseStatus: "ACTIVE",
    href: "/dashboard",
    monthlyListeners: "1.27M",
    genre: "Hip-Hop / Gospel Rap",
  },
  {
    slug: "miriam",
    artistName: "Miriam",
    artistHandle: "@miriammusic",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face",
    activeRelease: "Still Waters — EP",
    releaseStatus: "PLANNING",
    href: "/artists/miriam/dashboard",
    monthlyListeners: "84K",
    genre: "Gospel / R&B",
  },
];
