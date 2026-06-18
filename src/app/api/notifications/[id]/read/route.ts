import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/authorize";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const notification = await prisma.notification.findFirst({
    where: { id, userId: auth.ctx.userId },
    select: { id: true },
  });
  if (!notification) {
    return Response.json({ error: "Notification not found" }, { status: 404 });
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { readAt: new Date(), isRead: true },
    select: { id: true, readAt: true },
  });

  return Response.json({ notification: updated });
}
