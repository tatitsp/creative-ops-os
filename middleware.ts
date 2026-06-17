// Edge-compatible middleware — no Prisma, no Node.js-only imports.
// Uses the lightweight auth config (no PrismaAdapter) to verify JWT sessions.

import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { isAdminEmail } from "@/lib/admin";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Public paths that never require authentication
const PUBLIC_PATHS = ["/sign-in", "/access-pending", "/api/auth"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  const session = req.auth;
  const isLoggedIn = !!session?.user?.email;

  if (!isLoggedIn) {
    const signIn = new URL("/sign-in", req.url);
    signIn.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signIn);
  }

  // Admin routes — exact email match only
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!isAdminEmail(session?.user?.email)) {
      return NextResponse.redirect(new URL("/select-workspace", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
