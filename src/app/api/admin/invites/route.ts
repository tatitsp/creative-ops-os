import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorize";
import { sendWorkspaceInviteEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const { workspaceId, role, email } = body;

  if (!workspaceId || !role) {
    return Response.json({ error: "workspaceId and role are required" }, { status: 400 });
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const [invite, workspace, inviter] = await Promise.all([
    prisma.invite.create({
      data: {
        workspaceId,
        role,
        email: email || null,
        createdById: auth.ctx.userId,
        expiresAt,
      },
      select: { token: true, expiresAt: true },
    }),
    prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        name: true,
        client: { select: { name: true } },
      },
    }),
    prisma.user.findUnique({
      where: { id: auth.ctx.userId },
      select: { name: true, email: true },
    }),
  ]);

  // Send email if an address was provided
  if (email && workspace && inviter) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://creative-ops-os.vercel.app";
    try {
      await sendWorkspaceInviteEmail({
        to: email,
        inviterName: inviter.name ?? inviter.email,
        workspaceName: workspace.name,
        clientName: workspace.client?.name ?? undefined,
        role,
        inviteUrl: `${appUrl}/invite/${invite.token}`,
      });
    } catch (err) {
      // Don't fail the request if email sending fails — the invite is still valid
      console.error("[invites] Failed to send invite email:", err);
    }
  }

  return Response.json({ invite }, { status: 201 });
}
