import type { Metadata } from "next";
import { SignInButton } from "@/components/auth/SignInButton";

export const metadata: Metadata = { title: "Sign In — Royal Priesthood" };

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#000000" }}
    >
      {/* RP Emblem */}
      <div className="flex flex-col items-center gap-8 mb-12">
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              border: "1.5px solid rgba(200,146,58,0.6)",
              boxShadow: "0 0 40px rgba(200,146,58,0.12), 0 0 80px rgba(200,146,58,0.05)",
            }}
          >
            {/* Inner ring */}
            <div
              className="w-[74px] h-[74px] rounded-full flex items-center justify-center"
              style={{ border: "1px solid rgba(200,146,58,0.25)" }}
            >
              <span
                className="text-2xl font-black tracking-tighter"
                style={{
                  color: "#C8923A",
                  fontFamily: "var(--font-inter)",
                  letterSpacing: "-0.04em",
                }}
              >
                RP
              </span>
            </div>
          </div>
        </div>

        {/* Name + tagline */}
        <div className="text-center space-y-2">
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase"
            style={{ color: "rgba(200,146,58,0.8)" }}
          >
            Royal Priesthood
          </p>
          <p
            className="text-[0.65rem] tracking-[0.15em] uppercase"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            by The Sighte Project
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        className="w-px h-8 mb-8"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)" }}
      />

      {/* SCOPE label */}
      <div className="text-center mb-8">
        <p className="text-2xl font-black tracking-tight text-white mb-1">SCOPE</p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Creative operations. One platform.
        </p>
      </div>

      {/* Sign in button */}
      <SignInButton />

      {/* Footer */}
      <p
        className="absolute bottom-8 text-[0.6rem] tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.15)" }}
      >
        Powered by The Sighte Project
      </p>
    </div>
  );
}
