import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/sign-in", "/api/auth"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default auth((req: any) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Allow public paths through without auth
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  // Redirect unauthenticated users to sign-in
  if (!isLoggedIn) {
    const signIn = new URL("/sign-in", req.url);
    signIn.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
