import { ARTIST_PHOTO } from "./mock-data";
import { CAAM1K_PHOTO } from "./mock-artist2";

export type WorkspaceStatus = "ACTIVE" | "PLANNING" | "COMPLETE";

export type Workspace = {
  slug: string;
  artistName: string;
  artistHandle: string;
  photo: string;
  location: string;
  activeRelease: string;
  releaseType: string;
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
    location: "Atlanta, GA",
    activeRelease: "Elijah",
    releaseType: "Album",
    releaseStatus: "ACTIVE",
    href: "/dashboard",
    monthlyListeners: "1.27M",
    genre: "Hip-Hop / Gospel Rap",
  },
  {
    slug: "caam1k",
    artistName: "Caam1k",
    artistHandle: "@caam1k",
    photo: CAAM1K_PHOTO,
    location: "Fort Worth, TX",
    activeRelease: "Eastside Evangelist",
    releaseType: "Album",
    releaseStatus: "ACTIVE",
    href: "/artists/caam1k/dashboard",
    monthlyListeners: "55.7K",
    genre: "Trap Gospel / Christian Hip-Hop",
  },
];
