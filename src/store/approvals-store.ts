import { create } from "zustand";
import type { RichApproval, ApprovalStatus, ApprovalStage } from "@/types";

// Shape from API
export type ApiApproval = {
  id: string;
  status: ApprovalStatus;
  stage: string;
  history: any[];
  notes: string | null;
  feedback: string | null;
  requestedAt: string;
  reviewedAt: string | null;
  requester: { id: string; name: string | null; image: string | null; role: string; status: string };
  reviewer?: { id: string; name: string | null; image: string | null; role: string; status: string } | null;
  content?: {
    id: string;
    title: string;
    type: string;
    phase: string;
    campaign?: { id: string; name: string } | null;
  } | null;
  task?: { id: string; title: string; priority: string } | null;
};

function toUser(raw: { id: string; name: string | null; image: string | null; role: string; status: string }) {
  return {
    id: raw.id,
    name: raw.name ?? "Unknown",
    email: "",
    image: raw.image ?? undefined,
    role: raw.role as any,
    status: raw.status as any,
    timezone: "America/New_York",
  };
}

function toRich(raw: ApiApproval): RichApproval {
  const title = raw.content?.title ?? raw.task?.title ?? "Untitled";
  return {
    id: raw.id,
    title,
    description: raw.notes ?? "",
    type: raw.content ? "content" : "task",
    stage: (raw.stage ?? "INTERNAL_REVIEW") as ApprovalStage,
    status: raw.status,
    campaign: raw.content?.campaign?.name ?? raw.task?.title ?? "",
    campaignId: raw.content?.campaign?.id ?? raw.task?.id ?? "",
    submitter: toUser(raw.requester),
    submittedAt: raw.requestedAt,
    nextApprover: raw.reviewer ? toUser(raw.reviewer) : undefined,
    priority: (raw.task as any)?.priority ?? "MEDIUM",
    dueDate: raw.requestedAt, // no dedicated due date in current schema
    history: (raw.history ?? []).map((h: any) => ({
      id: h.id,
      stage: h.stage,
      action: h.action,
      actor: { id: h.actorId, name: "Team", email: "", role: "CREATIVE_ASSISTANT" as const, status: "ACTIVE" as const, timezone: "America/New_York" },
      timestamp: h.timestamp,
      note: h.note,
    })),
  };
}

interface ApprovalsStore {
  approvals: RichApproval[];
  workspaceSlug: string;
  init: (slug: string, initial: ApiApproval[]) => void;
  approve: (id: string) => void;
  requestRevision: (id: string, note: string) => void;
  reject: (id: string, reason: string) => void;
}

export const useApprovalsStore = create<ApprovalsStore>((set, get) => ({
  approvals: [],
  workspaceSlug: "",

  init: (slug, initial) => {
    set({ workspaceSlug: slug, approvals: initial.map(toRich) });
  },

  approve: (id) => {
    const { workspaceSlug } = get();
    // Optimistic update
    set((state) => ({
      approvals: state.approvals.map((a) => {
        if (a.id !== id) return a;
        return { ...a, status: "APPROVED" as ApprovalStatus };
      }),
    }));
    fetch(`/api/workspaces/${workspaceSlug}/approvals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    }).then(async (r) => {
      if (r.ok) {
        const data = await r.json();
        set((state) => ({
          approvals: state.approvals.map((a) =>
            a.id === id ? { ...a, status: data.approval.status, stage: data.approval.stage } : a
          ),
        }));
      }
    }).catch(console.error);
  },

  requestRevision: (id, note) => {
    const { workspaceSlug } = get();
    set((state) => ({
      approvals: state.approvals.map((a) =>
        a.id === id ? { ...a, status: "REVISION_REQUESTED" as ApprovalStatus } : a
      ),
    }));
    fetch(`/api/workspaces/${workspaceSlug}/approvals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "request_revision", note }),
    }).catch(console.error);
  },

  reject: (id, reason) => {
    const { workspaceSlug } = get();
    set((state) => ({
      approvals: state.approvals.map((a) =>
        a.id === id ? { ...a, status: "REJECTED" as ApprovalStatus } : a
      ),
    }));
    fetch(`/api/workspaces/${workspaceSlug}/approvals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", note: reason }),
    }).catch(console.error);
  },
}));
