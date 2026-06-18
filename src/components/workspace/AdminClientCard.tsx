import Link from "next/link";
import { Layers, Settings, ArrowRight } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  LABEL:    "Label",
  ARTIST:   "Artist",
  BUSINESS: "Business",
  AGENCY:   "Agency",
  OTHER:    "Other",
};

type Props = {
  client: {
    id: string;
    name: string;
    slug: string;
    type: string;
    brandColor: string;
    status: string;
    workspaceCount: number;
    primaryWorkspaceHref: string | null;
  };
};

export function AdminClientCard({ client }: Props) {
  const isInactive = client.status !== "ACTIVE";
  const enterHref = client.primaryWorkspaceHref ?? `/clients/${client.slug}`;

  return (
    <div
      className="relative flex flex-col gap-4 p-5 rounded-2xl border overflow-hidden"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      {/* Brand color top stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-70"
        style={{ background: client.brandColor }}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${client.brandColor}1A` }}
        >
          <Layers className="w-4 h-4" style={{ color: client.brandColor }} />
        </div>
        {isInactive && (
          <span
            className="text-2xs px-1.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}
          >
            {client.status.toLowerCase()}
          </span>
        )}
      </div>

      {/* Client name + type */}
      <div>
        <p className="text-sm font-bold text-white leading-snug">{client.name}</p>
        <p className="text-2xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
          {TYPE_LABELS[client.type] ?? client.type}
        </p>
      </div>

      {/* Workspace count */}
      <div
        className="text-2xs font-semibold pt-1"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        {client.workspaceCount} workspace{client.workspaceCount !== 1 ? "s" : ""}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Link
          href={`/admin/clients/${client.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-2xs font-semibold transition-all hover:opacity-80"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Settings className="w-3 h-3" />
          Manage
        </Link>
        <Link
          href={enterHref}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-2xs font-semibold transition-all hover:opacity-90"
          style={{
            background: client.brandColor,
            color: "#000",
          }}
        >
          Enter
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
