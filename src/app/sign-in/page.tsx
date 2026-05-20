import type { Metadata } from "next";
import { SignInButton } from "@/components/auth/SignInButton";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#000000" }}
    >
      {/* Wordmark block */}
      <div className="text-center mb-14">
        <h1
          className="font-black text-white tracking-tight mb-3"
          style={{
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          ROYAL PRIESTHOOD
        </h1>
        <p
          className="text-xs tracking-[0.25em] uppercase"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          SCOPE · Creative Operations OS
        </p>
      </div>

      {/* Sign in */}
      <SignInButton />

      {/* Footer */}
      <p
        className="absolute bottom-8 text-[0.6rem] tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.12)" }}
      >
        by The Sighte Project
      </p>
    </div>
  );
}
