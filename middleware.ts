import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { NextResponse } from "next/server";

// Public paths that never require authentication
const PUBLIC_PATHS = ["/sign-in", "/api/auth", "/access-pending"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?"));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Always allow public paths and static assets
  if (isPublic(pathname)) return NextResponse.next();

  const session = req.auth;
  const isLoggedIn = !!session?.user?.email;

  // Not logged in → sign-in
  if (!isLoggedIn) {
    const signIn = new URL("/sign-in", req.url);
    signIn.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signIn);
  }

  // Admin routes — require exact email match against ADMIN_EMAILS
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
