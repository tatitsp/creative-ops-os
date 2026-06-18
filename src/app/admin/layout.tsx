import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Allow full admins (email gate) and Platform Partners (DB role).
  // Server components must never trust middleware alone.
  const isPlatformPartner = session?.user?.isPlatformPartner === true;
  if (!session?.user?.email || (!isAdminEmail(session.user.email) && !isPlatformPartner)) {
    redirect("/command-center");
  }

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A" }}>
      {/* Admin nav bar */}
      <nav
        className="flex items-center gap-6 px-8 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <span
          className="text-xs font-bold tracking-[0.3em] uppercase mr-4"
          style={{ color: "rgba(200,146,58,0.8)" }}
        >
          Admin
        </span>
        {[
          { href: "/admin/clients", label: "Clients" },
          { href: "/admin/users", label: "Users" },
          { href: "/admin/workspaces", label: "Workspaces" },
          { href: "/admin/roles", label: "Roles" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-sm transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/command-center"
          className="ml-auto text-xs transition-opacity hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          ← Command Center
        </Link>
      </nav>

      <main className="px-8 py-10 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
