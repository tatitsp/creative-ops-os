import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const invite = await prisma.invite.findUnique({
    where: { token },
    select: {
      token: true,
      email: true,
      role: true,
      expiresAt: true,
      usedAt: true,
      workspace: { select: { name: true, slug: true, photo: true } },
    },
  });

  if (!invite) return Response.json({ error: "Invite not found" }, { status: 404 });
  if (invite.usedAt) return Response.json({ error: "Invite already used" }, { status: 410 });
  if (new Date(invite.expiresAt) < new Date()) return Response.json({ error: "Invite expired" }, { status: 410 });

  return Response.json({ invite });
}
