import type { Metadata } from "next";
import { SignInButton } from "@/components/auth/SignInButton";

export const metadata: Metadata = { title: "Sign In" };

const BG_IMAGE = "https://i.scdn.co/image/ab67616d0000b27302c9eaa1167c71f2b698f790";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Full-bleed background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BG_IMAGE}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ filter: "brightness(0.45) saturate(0.8)" }}
      />

      {/* Dark gradient overlay — heavier at bottom for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.72) 60%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Wordmark */}
        <h1
          className="font-black text-white mb-3"
          style={{
            fontSize: "clamp(2.2rem, 7vw, 4rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textShadow: "0 2px 24px rgba(0,0,0,0.5)",
          }}
        >
          ROYAL PRIESTHOOD
        </h1>

        {/* Subtitle */}
        <p
          className="text-xs tracking-[0.2em] uppercase mb-10"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          SCOPE&nbsp;&nbsp;·&nbsp;&nbsp;Creative Operations OS&nbsp;&nbsp;·&nbsp;&nbsp;by The Sighte Project
        </p>

        {/* Sign in */}
        <SignInButton />
      </div>

      {/* Bottom credit */}
      <p
        className="absolute bottom-8 z-10 text-[0.6rem] tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.18)" }}
      >
        Royal Priesthood · The Sighte Project
      </p>
    </div>
  );
}
