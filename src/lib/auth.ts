import NextAuth, { type Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
import { prisma } from "./prisma";
import { isAdminEmail } from "./admin";

// Extend the built-in session types so role, isAdmin, and workspaces
// are available on every server/client session read.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      platformRole: string;
      isAdmin: boolean;
      isPlatformPartner: boolean;
      workspaceSlugs: string[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: string;
    platformRole?: string;
    workspaceSlugs?: string[];
  }
}

const config = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  // JWT strategy so middleware can verify sessions without hitting the DB.
  // API routes always re-verify workspace membership against the DB via authorize.ts.
  session: { strategy: "jwt" as const },
  callbacks: {
    // On every sign-in, populate the JWT with the user's role and workspaces.
    async jwt({ token, user, trigger }: { token: JWT; user?: { id?: string }; trigger?: string }) {
      // `user` is only set on initial sign-in or when trigger === "update".
      // token.sub is always the user's DB id (set by NextAuth); use it as a
      // fallback so sessions created before token.userId existed still work.
      const userId = user?.id ?? token.userId ?? token.sub;
      if (userId && (user?.id || trigger === "update")) {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            role: true,
            platformRole: true,
            workspaceMemberships: {
              select: { workspace: { select: { slug: true } } },
            },
          },
        });
        token.userId = userId;
        token.role = dbUser?.role ?? "CREATIVE_ASSISTANT";
        token.platformRole = dbUser?.platformRole ?? "USER";
        token.workspaceSlugs = dbUser?.workspaceMemberships.map((m) => m.workspace.slug) ?? [];
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.userId ?? token.sub ?? "";
      session.user.role = token.role ?? "CREATIVE_ASSISTANT";
      session.user.platformRole = token.platformRole ?? "USER";
      session.user.isAdmin = isAdminEmail(session.user.email);
      session.user.isPlatformPartner = session.user.platformRole === "PLATFORM_PARTNER";
      session.user.workspaceSlugs = token.workspaceSlugs ?? [];
      return session;
    },

    redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
