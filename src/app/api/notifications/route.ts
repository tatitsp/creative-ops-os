import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/authorize";

export async function GET(
  _req: NextRequest
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const notifications = await prisma.notification.findMany({
    where: {
      userId: auth.ctx.userId,
      readAt: null,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      type: true,
      title: true,
      body: true,
      link: true,
      workspaceId: true,
      readAt: true,
      createdAt: true,
    },
  });

  return Response.json({ notifications });
}
