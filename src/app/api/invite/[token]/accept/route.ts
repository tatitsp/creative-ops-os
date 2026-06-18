import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/authorize";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const { token } = await params;

  const invite = await prisma.invite.findUnique({
    where: { token },
    select: { id: true, workspaceId: true, role: true, expiresAt: true, usedAt: true, email: true },
  });

  if (!invite) return Response.json({ error: "Invite not found" }, { status: 404 });
  if (invite.usedAt) return Response.json({ error: "Invite already used" }, { status: 410 });
  if (new Date(invite.expiresAt) < new Date()) return Response.json({ error: "Invite expired" }, { status: 410 });

  // Optional: enforce email match
  if (invite.email && invite.email.toLowerCase() !== auth.ctx.email.toLowerCase()) {
    return Response.json({ error: "This invite is for a different email address" }, { status: 403 });
  }

  // Create workspace membership (upsert in case they're already a member)
  await prisma.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: invite.workspaceId, userId: auth.ctx.userId } },
    update: { role: invite.role as any },
    create: {
      workspaceId: invite.workspaceId,
      userId: auth.ctx.userId,
      role: invite.role as any,
      joinedAt: new Date(),
    },
  });

  // Mark invite as used
  await prisma.invite.update({
    where: { id: invite.id },
    data: { usedAt: new Date(), usedById: auth.ctx.userId },
  });

  // Get workspace for redirect
  const workspace = await prisma.workspace.findUnique({
    where: { id: invite.workspaceId },
    select: { slug: true, dashboardHref: true },
  });

  const redirectTo = workspace?.dashboardHref ?? `/w/${workspace?.slug ?? ""}`;

  return Response.json({ ok: true, redirectTo });
}
