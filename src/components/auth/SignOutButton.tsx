"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/sign-in" })}
      className="text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
      style={{ color: "rgba(255,255,255,0.3)" }}
    >
      Sign out
    </button>
  );
}
