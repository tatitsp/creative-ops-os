import { create } from "zustand";
import { MOCK_RICH_APPROVALS, getNextStage } from "@/lib/mock-approvals";
import { MOCK_USERS } from "@/lib/mock-data";
import type { RichApproval, ApprovalHistoryEntry } from "@/types";

// Tatiyana is the logged-in user taking action
const ACTOR = MOCK_USERS[1];

interface ApprovalsStore {
  approvals: RichApproval[];
  approve: (id: string) => void;
  requestRevision: (id: string, note: string) => void;
  reject: (id: string, reason: string) => void;
}

export const useApprovalsStore = create<ApprovalsStore>((set) => ({
  approvals: MOCK_RICH_APPROVALS,

  approve: (id) =>
    set((state) => ({
      approvals: state.approvals.map((a) => {
        if (a.id !== id) return a;
        const now = new Date().toISOString();
        const next = getNextStage(a.stage);
        const approvedEntry: ApprovalHistoryEntry = {
          id: `h-${Date.now()}-approved`,
          stage: a.stage,
          action: "APPROVED",
          actor: ACTOR,
          timestamp: now,
        };
        const advancedEntry: ApprovalHistoryEntry | null = next
          ? { id: `h-${Date.now()}-advanced`, stage: next, action: "ADVANCED", actor: ACTOR, timestamp: now }
          : null;
        const history = [...a.history, approvedEntry, ...(advancedEntry ? [advancedEntry] : [])];
        if (next) {
          return {
            ...a,
            stage: next,
            status: next === "POSTED" ? "APPROVED" : "PENDING",
            history,
            nextApprover: next === "POSTED" ? undefined : a.nextApprover,
          };
        }
        return { ...a, status: "APPROVED", history, nextApprover: undefined };
      }),
    })),

  requestRevision: (id, note) =>
    set((state) => ({
      approvals: state.approvals.map((a) => {
        if (a.id !== id) return a;
        const entry: ApprovalHistoryEntry = {
          id: `h-${Date.now()}-revision`,
          stage: a.stage,
          action: "REVISION_REQUESTED",
          actor: ACTOR,
          timestamp: new Date().toISOString(),
          note,
        };
        return { ...a, status: "REVISION_REQUESTED", history: [...a.history, entry] };
      }),
    })),

  reject: (id, reason) =>
    set((state) => ({
      approvals: state.approvals.map((a) => {
        if (a.id !== id) return a;
        const entry: ApprovalHistoryEntry = {
          id: `h-${Date.now()}-rejected`,
          stage: a.stage,
          action: "REJECTED",
          actor: ACTOR,
          timestamp: new Date().toISOString(),
          note: reason,
        };
        return { ...a, status: "REJECTED", nextApprover: undefined, history: [...a.history, entry] };
      }),
    })),
}));
