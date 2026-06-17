import type { Metadata } from "next";
import { SignInButton } from "@/components/auth/SignInButton";

export const metadata: Metadata = { title: "Sign In — SCOPE" };

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#0A0A0A" }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Wordmark */}
        <h1
          className="font-black text-white mb-2"
          style={{ fontSize: "2rem", letterSpacing: "-0.05em", lineHeight: 1 }}
        >
          SCOPE
        </h1>

        <p
          className="text-xs tracking-[0.2em] uppercase mb-10"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Creative Operations OS
        </p>

        <SignInButton />
      </div>

      <p
        className="absolute bottom-8 text-[0.6rem] tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.1)" }}
      >
        © 2026 The Sighte Project
      </p>
    </div>
  );
}
