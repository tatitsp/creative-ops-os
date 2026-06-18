import { auth } from "./auth";
import { prisma } from "./prisma";

/**
 * Resolves the workspace for the current session in the (dashboard) route group.
 * Returns the workspace record where dashboardHref = '/dashboard', or the first
 * workspace the user is a member of.
 */
export async function getDashboardWorkspace() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const { workspaceSlugs, isAdmin } = session.user;

  if (isAdmin && workspaceSlugs.length === 0) {
    // Admin with no memberships — find the lil-tony workspace
    return prisma.workspace.findFirst({
      where: { dashboardHref: "/dashboard" },
      select: { id: true, slug: true, name: true },
    });
  }

  if (workspaceSlugs.length === 0) return null;

  // Find the workspace with dashboardHref=/dashboard in their memberships
  const ws = await prisma.workspace.findFirst({
    where: {
      slug: { in: workspaceSlugs },
      dashboardHref: "/dashboard",
    },
    select: { id: true, slug: true, name: true },
  });

  if (ws) return ws;

  // Fallback: first workspace
  return prisma.workspace.findFirst({
    where: { slug: workspaceSlugs[0] },
    select: { id: true, slug: true, name: true },
  });
}
