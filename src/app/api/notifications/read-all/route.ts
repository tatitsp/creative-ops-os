import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/authorize";

export async function POST(
  _req: NextRequest
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  await prisma.notification.updateMany({
    where: {
      userId: auth.ctx.userId,
      readAt: null,
    },
    data: { readAt: new Date(), isRead: true },
  });

  return Response.json({ ok: true });
}
