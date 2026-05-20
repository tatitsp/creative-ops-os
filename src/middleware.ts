export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    // Protect all routes except NextAuth endpoints, static files, and images
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
