import type { RichApproval, ApprovalStage } from "@/types";
import { MOCK_USERS, COVERS } from "@/lib/mock-data";

// ─── Stage config ─────────────────────────────────────────────────────────────

export const STAGE_ORDER: ApprovalStage[] = [
  "DRAFT",
  "INTERNAL_REVIEW",
  "ARTIST_REVIEW",
  "MANAGEMENT_APPROVAL",
  "SCHEDULED",
  "POSTED",
];

export const STAGE_LABELS: Record<ApprovalStage, string> = {
  DRAFT: "Draft",
  INTERNAL_REVIEW: "Internal Review",
  ARTIST_REVIEW: "Artist Review",
  MANAGEMENT_APPROVAL: "Management",
  SCHEDULED: "Scheduled",
  POSTED: "Posted",
};

export const STAGE_SHORT: Record<ApprovalStage, string> = {
  DRAFT: "Draft",
  INTERNAL_REVIEW: "Internal",
  ARTIST_REVIEW: "Artist",
  MANAGEMENT_APPROVAL: "Mgmt",
  SCHEDULED: "Scheduled",
  POSTED: "Posted",
};

export function getNextStage(current: ApprovalStage): ApprovalStage | null {
  const idx = STAGE_ORDER.indexOf(current);
  return idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null;
}

export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date("2026-05-18");
}

// ─── Mock approvals ───────────────────────────────────────────────────────────

export const MOCK_RICH_APPROVALS: RichApproval[] = [
  {
    id: "ra1",
    title: "Mrs.Key merch mockups — Final variant",
    description:
      "3 format mockups (tee, hoodie, hat) for the Mrs.Key merch drop. Designed per art direction brief, includes front and back views for each.",
    type: "asset",
    stage: "INTERNAL_REVIEW",
    status: "PENDING",
    campaign: "Mrs.Key — Album Rollout",
    campaignId: "c1",
    thumbnail: COVERS.mrsKey,
    submitter: MOCK_USERS[5], // Amara
    submittedAt: "2026-05-18T10:30:00Z",
    nextApprover: MOCK_USERS[1], // Tatiyana
    priority: "HIGH",
    dueDate: "2026-05-22",
    history: [
      {
        id: "h1-1",
        stage: "INTERNAL_REVIEW",
        action: "SUBMITTED",
        actor: MOCK_USERS[5],
        timestamp: "2026-05-18T10:30:00Z",
        note: "All 3 mockups ready. Used the reference colors from the mood board. Let me know if we want to adjust the hoodie colorway.",
      },
    ],
  },
  {
    id: "ra2",
    title: "REPENT! teaser campaign — Social copy, Week 1",
    description:
      "Instagram captions, TikTok hooks, and a tweet thread for the REPENT! catalog push teaser week. 7 posts total, copy only.",
    type: "content",
    stage: "ARTIST_REVIEW",
    status: "PENDING",
    campaign: "REPENT! — Catalog Push",
    campaignId: "c4",
    thumbnail: COVERS.repent,
    submitter: MOCK_USERS[3], // Sofia
    submittedAt: "2026-05-18T08:15:00Z",
    nextApprover: MOCK_USERS[0], // Key
    priority: "MEDIUM",
    dueDate: "2026-05-20",
    history: [
      {
        id: "h2-1",
        stage: "INTERNAL_REVIEW",
        action: "SUBMITTED",
        actor: MOCK_USERS[3],
        timestamp: "2026-05-18T08:15:00Z",
        note: "7 posts drafted. Tried to keep the tone raw and direct, not too promotional.",
      },
      {
        id: "h2-2",
        stage: "INTERNAL_REVIEW",
        action: "APPROVED",
        actor: MOCK_USERS[1],
        timestamp: "2026-05-18T09:00:00Z",
        note: "Copy sounds clean. Moving to Key for final sign-off.",
      },
      {
        id: "h2-3",
        stage: "ARTIST_REVIEW",
        action: "ADVANCED",
        actor: MOCK_USERS[1],
        timestamp: "2026-05-18T09:01:00Z",
      },
    ],
  },
  {
    id: "ra3",
    title: "Press kit bio — Post Mrs.Key update",
    description:
      "Updated artist bio reflecting the Mrs.Key release, current streaming stats (1.27M monthly listeners), and updated press notes for the HipHopDX pitch.",
    type: "task",
    stage: "INTERNAL_REVIEW",
    status: "REVISION_REQUESTED",
    campaign: "Press Push — HipHopDX / AllHipHop",
    campaignId: "c3",
    thumbnail: undefined,
    submitter: MOCK_USERS[1], // Tatiyana
    submittedAt: "2026-05-17T16:00:00Z",
    nextApprover: MOCK_USERS[1], // Back to Tatiyana to revise
    priority: "MEDIUM",
    dueDate: "2026-05-20",
    history: [
      {
        id: "h3-1",
        stage: "INTERNAL_REVIEW",
        action: "SUBMITTED",
        actor: MOCK_USERS[1],
        timestamp: "2026-05-17T16:00:00Z",
        note: "First pass. Updated tone and added the Ecclesiastes campaign context.",
      },
      {
        id: "h3-2",
        stage: "INTERNAL_REVIEW",
        action: "REVISION_REQUESTED",
        actor: MOCK_USERS[0],
        timestamp: "2026-05-17T18:30:00Z",
        note: "Need to update the streaming numbers — we're at 1.27M now, not 1.1M. Also add the quote from the AllHipHop interview. The bio still feels a little corporate — needs to sound more like me.",
      },
    ],
  },
  {
    id: "ra4",
    title: '"3 AM" — Snippet reel (IG / TikTok cut)',
    description:
      '60-second vertical cut of the "3 AM" hook section. Captioned, color graded, formatted for Reels and TikTok. Drops May 25.',
    type: "content",
    stage: "INTERNAL_REVIEW",
    status: "PENDING",
    campaign: "Mrs.Key — Album Rollout",
    campaignId: "c1",
    thumbnail: COVERS.mrsKey,
    submitter: MOCK_USERS[2], // Darius
    submittedAt: "2026-05-18T11:00:00Z",
    nextApprover: MOCK_USERS[1], // Tatiyana
    priority: "HIGH",
    dueDate: "2026-05-23",
    history: [
      {
        id: "h4-1",
        stage: "INTERNAL_REVIEW",
        action: "SUBMITTED",
        actor: MOCK_USERS[2],
        timestamp: "2026-05-18T11:00:00Z",
        note: "First cut is done. Color grade may need a small tweak — let me know. Captions are auto-generated and manually corrected.",
      },
    ],
  },
  {
    id: "ra5",
    title: "Ecclesiastes — Testimony carousel",
    description:
      "5-slide carousel with pull quotes from Key's testimony, designed around the Ecclesiastes visual palette. Ready to schedule for May 22.",
    type: "content",
    stage: "MANAGEMENT_APPROVAL",
    status: "PENDING",
    campaign: "Ecclesiastes — Single Push",
    campaignId: "c2",
    thumbnail: COVERS.ecclesiastes,
    submitter: MOCK_USERS[5], // Amara
    submittedAt: "2026-05-16T09:00:00Z",
    nextApprover: MOCK_USERS[0], // Key (management approval)
    priority: "MEDIUM",
    dueDate: "2026-05-22",
    history: [
      {
        id: "h5-1",
        stage: "INTERNAL_REVIEW",
        action: "SUBMITTED",
        actor: MOCK_USERS[5],
        timestamp: "2026-05-16T09:00:00Z",
        note: "5 slides, follows the Ecclesiastes color palette. Typography is from the single artwork.",
      },
      {
        id: "h5-2",
        stage: "INTERNAL_REVIEW",
        action: "APPROVED",
        actor: MOCK_USERS[1],
        timestamp: "2026-05-16T14:00:00Z",
        note: "Design is strong. Passing to artist review.",
      },
      {
        id: "h5-3",
        stage: "ARTIST_REVIEW",
        action: "ADVANCED",
        actor: MOCK_USERS[1],
        timestamp: "2026-05-16T14:01:00Z",
      },
      {
        id: "h5-4",
        stage: "ARTIST_REVIEW",
        action: "APPROVED",
        actor: MOCK_USERS[0],
        timestamp: "2026-05-17T11:00:00Z",
        note: "Looks fire. Let's post it.",
      },
      {
        id: "h5-5",
        stage: "MANAGEMENT_APPROVAL",
        action: "ADVANCED",
        actor: MOCK_USERS[0],
        timestamp: "2026-05-17T11:01:00Z",
      },
    ],
  },
  {
    id: "ra6",
    title: "HipHopDX feature — Press release draft",
    description:
      "Draft press release for the HipHopDX editorial feature. Covers Key's origin story, Mrs.Key campaign stats, and the Elijah announcement.",
    type: "task",
    stage: "DRAFT",
    status: "PENDING",
    campaign: "Press Push — HipHopDX / AllHipHop",
    campaignId: "c3",
    thumbnail: undefined,
    submitter: MOCK_USERS[1], // Tatiyana
    submittedAt: "2026-05-17T12:00:00Z",
    nextApprover: MOCK_USERS[1], // Tatiyana (internal first)

    priority: "URGENT",
    dueDate: "2026-05-19",
    history: [
      {
        id: "h6-1",
        stage: "DRAFT",
        action: "SUBMITTED",
        actor: MOCK_USERS[1],
        timestamp: "2026-05-17T12:00:00Z",
        note: "First draft. Needs review before we send to the HipHopDX contact.",
      },
    ],
  },
  {
    id: "ra7",
    title: "REPENT! — Cover art alt treatment",
    description:
      "Alternative cover art direction for the REPENT! catalog push — darker palette, bold condensed typography, borderless composition.",
    type: "asset",
    stage: "ARTIST_REVIEW",
    status: "REVISION_REQUESTED",
    campaign: "REPENT! — Catalog Push",
    campaignId: "c4",
    thumbnail: COVERS.repent,
    submitter: MOCK_USERS[5], // Amara
    submittedAt: "2026-05-15T10:00:00Z",
    nextApprover: MOCK_USERS[5], // Back to Amara
    priority: "HIGH",
    dueDate: "2026-05-25",
    history: [
      {
        id: "h7-1",
        stage: "INTERNAL_REVIEW",
        action: "SUBMITTED",
        actor: MOCK_USERS[5],
        timestamp: "2026-05-15T10:00:00Z",
        note: "Alt direction — pushed the REPENT! visual world darker. Two versions included.",
      },
      {
        id: "h7-2",
        stage: "INTERNAL_REVIEW",
        action: "APPROVED",
        actor: MOCK_USERS[1],
        timestamp: "2026-05-16T09:00:00Z",
        note: "Strong concept. Sending to artist.",
      },
      {
        id: "h7-3",
        stage: "ARTIST_REVIEW",
        action: "ADVANCED",
        actor: MOCK_USERS[1],
        timestamp: "2026-05-16T09:01:00Z",
      },
      {
        id: "h7-4",
        stage: "ARTIST_REVIEW",
        action: "REVISION_REQUESTED",
        actor: MOCK_USERS[0],
        timestamp: "2026-05-17T14:00:00Z",
        note: "The colors are too dark — losing contrast on the title treatment. Need more breathing room. Also want to try a version without the border. The energy is right though.",
      },
    ],
  },
  {
    id: "ra8",
    title: "BTS Mrs.Key recording sessions — IG Story",
    description:
      "Behind-the-scenes story series from the Mrs.Key recording sessions. 8 frames, authentic vibe, no filters. Scheduled to drop May 21.",
    type: "content",
    stage: "SCHEDULED",
    status: "APPROVED",
    campaign: "Mrs.Key — Album Rollout",
    campaignId: "c1",
    thumbnail: COVERS.mrsKey,
    submitter: MOCK_USERS[3], // Sofia
    submittedAt: "2026-05-15T14:00:00Z",
    nextApprover: undefined,
    priority: "LOW",
    dueDate: "2026-05-21",
    history: [
      {
        id: "h8-1",
        stage: "INTERNAL_REVIEW",
        action: "SUBMITTED",
        actor: MOCK_USERS[3],
        timestamp: "2026-05-15T14:00:00Z",
        note: "8 frames from the sessions. Kept it real and unpolished — that's the vibe.",
      },
      {
        id: "h8-2",
        stage: "INTERNAL_REVIEW",
        action: "APPROVED",
        actor: MOCK_USERS[1],
        timestamp: "2026-05-16T09:30:00Z",
        note: "BTS content always performs. Looks authentic.",
      },
      {
        id: "h8-3",
        stage: "ARTIST_REVIEW",
        action: "ADVANCED",
        actor: MOCK_USERS[1],
        timestamp: "2026-05-16T09:31:00Z",
      },
      {
        id: "h8-4",
        stage: "ARTIST_REVIEW",
        action: "APPROVED",
        actor: MOCK_USERS[0],
        timestamp: "2026-05-16T14:00:00Z",
        note: "Ship it.",
      },
      {
        id: "h8-5",
        stage: "MANAGEMENT_APPROVAL",
        action: "ADVANCED",
        actor: MOCK_USERS[0],
        timestamp: "2026-05-16T14:01:00Z",
      },
      {
        id: "h8-6",
        stage: "MANAGEMENT_APPROVAL",
        action: "APPROVED",
        actor: MOCK_USERS[1],
        timestamp: "2026-05-17T09:00:00Z",
      },
      {
        id: "h8-7",
        stage: "SCHEDULED",
        action: "ADVANCED",
        actor: MOCK_USERS[1],
        timestamp: "2026-05-17T09:01:00Z",
        note: "Scheduled for May 21 at 6 PM CT.",
      },
    ],
  },
];

// Pending count for sidebar badge
export const PENDING_APPROVALS_COUNT = MOCK_RICH_APPROVALS.filter(
  (a) => a.status === "PENDING" || a.status === "REVISION_REQUESTED",
).length;
