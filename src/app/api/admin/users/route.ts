// GET  /api/admin/users  — list all users with workspace memberships
// POST /api/admin/users  — two modes based on body:
//   { userId, workspaceId, role }          → assign existing user to workspace
//   { name, email, role, workspaceId }     → pre-invite new user (creates pending record)

import { requireAdmin, requirePlatformAccess } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";
import { sendWorkspaceInviteEmail } from "@/lib/email";

export async function GET() {
  const auth = await requirePlatformAccess();
  if (!auth.ok) return auth.response;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      platformRole: true,
      status: true,
      createdAt: true,
      workspaceMemberships: {
        select: {
          role: true,
          workspace: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });

  return Response.json({ users });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await req.json();

  // ── Mode 1: assign existing user to workspace ─────────────────────────────
  if (body.userId) {
    const { userId, workspaceId, role } = body;
    if (!workspaceId || !role) {
      return Response.json({ error: "userId, workspaceId, and role are required" }, { status: 400 });
    }
    const membership = await prisma.workspaceMember.upsert({
      where: { workspaceId_userId: { workspaceId, userId } },
      update: { role },
      create: { workspaceId, userId, role, joinedAt: new Date() },
    });
    return Response.json({ membership }, { status: 201 });
  }

  // ── Mode 2: pre-invite a new user ─────────────────────────────────────────
  const { name, email, role, workspaceId } = body;
  if (!email || !role || !workspaceId) {
    return Response.json({ error: "email, role, and workspaceId are required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Resolve workspace + inviter
  const [workspace, inviter] = await Promise.all([
    prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { id: true, name: true, client: { select: { name: true } } },
    }),
    prisma.user.findUnique({
      where: { id: auth.ctx.userId },
      select: { name: true, email: true },
    }),
  ]);

  if (!workspace) {
    return Response.json({ error: "Workspace not found" }, { status: 404 });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, status: true },
  });

  let userId: string;

  if (existingUser) {
    // User already exists — just ensure workspace membership
    userId = existingUser.id;
    await prisma.workspaceMember.upsert({
      where: { workspaceId_userId: { workspaceId, userId } },
      update: { role },
      create: { workspaceId, userId, role, joinedAt: new Date() },
    });
  } else {
    // Pre-create a pending user record
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name?.trim() || null,
        role,
        status: "PENDING",
      },
      select: { id: true },
    });
    userId = newUser.id;

    // Create workspace membership upfront — granted on first sign-in
    await prisma.workspaceMember.create({
      data: { workspaceId, userId, role },
    });
  }

  // Create a 7-day invite token (for the email link + as a record)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const invite = await prisma.invite.create({
    data: {
      workspaceId,
      role,
      email: normalizedEmail,
      createdById: auth.ctx.userId,
      expiresAt,
    },
    select: { token: true },
  });

  // Try to send email
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://creative-ops-os.vercel.app";
  const inviteUrl = `${appUrl}/invite/${invite.token}`;
  let emailSent = false;

  try {
    await sendWorkspaceInviteEmail({
      to: normalizedEmail,
      inviterName: inviter?.name ?? inviter?.email ?? "The SCOPE team",
      workspaceName: workspace.name,
      clientName: workspace.client?.name ?? undefined,
      role,
      inviteUrl,
    });
    emailSent = true;
  } catch (err) {
    console.error("[users/invite] Email send failed:", err);
  }

  return Response.json(
    {
      userId,
      existingUser: !!existingUser,
      emailSent,
      inviteUrl,
    },
    { status: 201 }
  );
}
