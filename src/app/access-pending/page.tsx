import type { Metadata } from "next";
import { SignOutButton } from "@/components/auth/SignOutButton";

export const metadata: Metadata = { title: "Access Pending" };

export default function AccessPendingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#000000" }}
    >
      <div className="text-center max-w-sm">
        <p
          className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase mb-6"
          style={{ color: "rgba(200,146,58,0.7)" }}
        >
          Royal Priesthood
        </p>

        <h1 className="text-xl font-black text-white tracking-tight mb-4">
          Access Pending
        </h1>

        <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
          Your login was successful, but your account has not been assigned
          access yet. Please contact your administrator.
        </p>

        <SignOutButton />
      </div>

      <p
        className="mt-14 text-[0.6rem] tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.1)" }}
      >
        Powered by Scope
      </p>
    </div>
  );
}
