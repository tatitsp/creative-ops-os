import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/lib/authorize";

const STAGE_ORDER = [
  "DRAFT",
  "INTERNAL_REVIEW",
  "ARTIST_REVIEW",
  "MANAGEMENT_APPROVAL",
  "SCHEDULED",
  "POSTED",
] as const;

type Stage = typeof STAGE_ORDER[number];

function getNextStage(current: string): Stage | null {
  const idx = STAGE_ORDER.indexOf(current as Stage);
  return idx >= 0 && idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const auth = await requireWorkspaceAccess(slug);
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const { action, note } = body; // action: "approve" | "request_revision" | "reject"

  const approval = await prisma.approval.findUnique({
    where: { id },
    select: { id: true, status: true, stage: true, history: true },
  });
  if (!approval) return Response.json({ error: "Not found" }, { status: 404 });

  const now = new Date().toISOString();
  const history = Array.isArray(approval.history) ? approval.history : [];

  let newStatus: string;
  let newStage = approval.stage;
  let historyEntry: object;

  if (action === "approve") {
    const nextStage = getNextStage(approval.stage ?? "INTERNAL_REVIEW");
    historyEntry = { id: `h-${Date.now()}`, stage: approval.stage, action: "APPROVED", actorId: auth.ctx.userId, timestamp: now };
    if (nextStage) {
      newStage = nextStage;
      newStatus = nextStage === "POSTED" ? "APPROVED" : "PENDING";
      history.push(historyEntry);
      history.push({ id: `h-${Date.now()}-adv`, stage: nextStage, action: "ADVANCED", actorId: auth.ctx.userId, timestamp: now });
    } else {
      newStatus = "APPROVED";
      history.push(historyEntry);
    }
  } else if (action === "request_revision") {
    newStatus = "REVISION_REQUESTED";
    historyEntry = { id: `h-${Date.now()}`, stage: approval.stage, action: "REVISION_REQUESTED", actorId: auth.ctx.userId, timestamp: now, note };
    history.push(historyEntry);
  } else if (action === "reject") {
    newStatus = "REJECTED";
    historyEntry = { id: `h-${Date.now()}`, stage: approval.stage, action: "REJECTED", actorId: auth.ctx.userId, timestamp: now, note };
    history.push(historyEntry);
  } else {
    return Response.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await prisma.approval.update({
    where: { id },
    data: {
      status: newStatus as any,
      stage: newStage,
      feedback: note || null,
      reviewerId: auth.ctx.userId,
      reviewedAt: new Date(),
      history,
    },
    select: {
      id: true,
      status: true,
      stage: true,
      feedback: true,
      reviewedAt: true,
      history: true,
    },
  });

  return Response.json({ approval: updated });
}
