import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const config = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // Fall back to NEXTAUTH_SECRET so either env var name works
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  // Required when running on a non-standard port (e.g. 3003)
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
