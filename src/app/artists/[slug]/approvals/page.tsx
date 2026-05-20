import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { CAAM1K_APPROVALS } from "@/lib/mock-artist2";
import { CheckSquare, Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Approvals` : "Approvals" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

const STATUS_CONFIG = {
  PENDING:            { label: "Pending",            icon: Clock,      style: "bg-amber-50 text-amber-600" },
  APPROVED:           { label: "Approved",           icon: CheckSquare, style: "bg-emerald-50 text-emerald-600" },
  REVISION_REQUESTED: { label: "Revision Requested", icon: RotateCcw,  style: "bg-rose-50 text-rose-500" },
} as const;

const PRIORITY_STYLES: Record<string, string> = {
  URGENT: "bg-rose-50 text-rose-500",
  HIGH:   "bg-amber-50 text-amber-600",
  MEDIUM: "bg-canvas-100 text-ink-tertiary",
};

const pending = (approvals: typeof CAAM1K_APPROVALS) =>
  approvals.filter((a) => a.status === "PENDING").length;

export default async function ArtistApprovalsPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  const pendingCount = pending(CAAM1K_APPROVALS);

  return (
    <>
      <div className="px-6 pt-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gold-100 flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-gold" />
          </div>
          <h1 className="text-2xl font-black text-ink tracking-tight">Approvals</h1>
          {pendingCount > 0 && (
            <span className="w-6 h-6 bg-gold text-white text-2xs font-bold rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </div>
        <p className="text-sm text-ink-secondary ml-11">
          {ws.artistName} · Review content, assets, and deliverables.
        </p>
      </div>

      <div className="p-6 animate-in max-w-3xl space-y-3">
        {CAAM1K_APPROVALS.map((item) => {
          const cfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
          const StatusIcon = cfg?.icon ?? Clock;
          return (
            <div key={item.id} className="card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-canvas-100 flex items-center justify-center flex-shrink-0">
                <StatusIcon className="w-5 h-5 text-ink-tertiary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="text-xs text-ink-tertiary mt-0.5">
                  Requested by {item.requestedBy} ·{" "}
                  {new Date(item.requestedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full", cfg?.style)}>
                    {cfg?.label}
                  </span>
                  <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full", PRIORITY_STYLES[item.priority])}>
                    {item.priority}
                  </span>
                  <span className="text-2xs text-ink-tertiary capitalize">{item.type}</span>
                </div>
              </div>
              {item.status === "PENDING" && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="sm" variant="secondary">Revise</Button>
                  <Button size="sm" variant="primary">Approve</Button>
                </div>
              )}
            </div>
          );
        })}
        {CAAM1K_APPROVALS.length === 0 && (
          <div className="text-center py-16">
            <CheckSquare className="w-8 h-8 mx-auto text-ink-tertiary mb-3 opacity-30" />
            <p className="text-sm text-ink-tertiary">No items pending approval.</p>
          </div>
        )}
      </div>
    </>
  );
}
