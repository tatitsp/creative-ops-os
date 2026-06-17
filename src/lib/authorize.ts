// ─── Server-side authorization helpers ──────────────────────────────────────
//
// Every API route calls these instead of calling auth() directly.
// All checks run against the DB — never trust the client.

import { auth } from "./auth";
import { prisma } from "./prisma";
import { isAdminEmail } from "./admin";
import { roleHasPermission } from "./permissions";
import type { Permission } from "./permissions";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AuthContext = {
  userId: string;
  email: string;
  role: string;
  isAdmin: boolean;
  workspaceSlugs: string[];
};

type AuthResult =
  | { ok: true; ctx: AuthContext }
  | { ok: false; response: Response };

// ─── Base: is the request authenticated at all? ───────────────────────────────

export async function requireAuth(): Promise<AuthResult> {
  const session = await auth();
  if (!session?.user?.email) {
    return {
      ok: false,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return {
    ok: true,
    ctx: {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      isAdmin: session.user.isAdmin,
      workspaceSlugs: session.user.workspaceSlugs,
    },
  };
}

// ─── Require admin (exact email match against ADMIN_EMAILS) ──────────────────

export async function requireAdmin(): Promise<AuthResult> {
  const result = await requireAuth();
  if (!result.ok) return result;
  if (!result.ctx.isAdmin) {
    return {
      ok: false,
      response: Response.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return result;
}

// ─── Require workspace membership ────────────────────────────────────────────
//
// Verifies the user is a member of the requested workspace.
// Admin bypasses this check — they can access any workspace.

export async function requireWorkspaceAccess(
  workspaceSlug: string
): Promise<AuthResult> {
  const result = await requireAuth();
  if (!result.ok) return result;
  const { ctx } = result;

  // Admin can access everything
  if (ctx.isAdmin) return result;

  // Verify membership in DB (don't trust session cache alone)
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId: ctx.userId,
      workspace: { slug: workspaceSlug },
    },
    select: { role: true },
  });

  if (!membership) {
    return {
      ok: false,
      response: Response.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  // Update role from the DB record (more authoritative than session cache)
  return {
    ok: true,
    ctx: { ...ctx, role: membership.role },
  };
}

// ─── Require a specific permission within a workspace ─────────────────────────

export async function requirePermission(
  workspaceSlug: string,
  permission: Permission
): Promise<AuthResult> {
  const result = await requireWorkspaceAccess(workspaceSlug);
  if (!result.ok) return result;
  const { ctx } = result;

  // Admin always passes permission checks (except access_admin is checked
  // separately via requireAdmin — admin is not a role, it's an email gate)
  if (ctx.isAdmin) return result;

  if (!roleHasPermission(ctx.role, permission)) {
    return {
      ok: false,
      response: Response.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return result;
}

// ─── Helper: verify a record belongs to the user's workspace ─────────────────
//
// Use this inside route handlers to scope DB queries:
//   const workspaceId = await resolveWorkspaceId(slug, ctx.userId, ctx.isAdmin)

export async function resolveWorkspaceId(
  slug: string,
  userId: string,
  isAdmin: boolean
): Promise<string | null> {
  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: {
      id: true,
      members: isAdmin ? false : { where: { userId }, select: { id: true } },
    },
  });

  if (!workspace) return null;
  if (isAdmin) return workspace.id;
  if (!workspace.members || workspace.members.length === 0) return null;
  return workspace.id;
}
