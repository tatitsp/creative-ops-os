import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorize";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const { workspaceId, role, email } = body;

  if (!workspaceId || !role) {
    return Response.json({ error: "workspaceId and role are required" }, { status: 400 });
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const invite = await prisma.invite.create({
    data: {
      workspaceId,
      role,
      email: email || null,
      createdById: auth.ctx.userId,
      expiresAt,
    },
    select: { token: true, expiresAt: true },
  });

  return Response.json({ invite }, { status: 201 });
}
