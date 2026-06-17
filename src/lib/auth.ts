import NextAuth, { type Session } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
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
      isAdmin: boolean;
      workspaceSlugs: string[];
    };
  }
}

const config = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "database" as const },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      // Fetch the user's DB record + workspace memberships in one query
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          role: true,
          status: true,
          workspaceMemberships: {
            select: { workspace: { select: { slug: true } } },
          },
        },
      });

      const workspaceSlugs =
        dbUser?.workspaceMemberships.map((m) => m.workspace.slug) ?? [];

      session.user.id = user.id;
      session.user.role = dbUser?.role ?? "CREATIVE_ASSISTANT";
      session.user.isAdmin = isAdminEmail(session.user.email);
      session.user.workspaceSlugs = workspaceSlugs;

      return session;
    },
    redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/select-workspace`;
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/select-workspace`;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
