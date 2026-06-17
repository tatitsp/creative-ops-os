import Link from "next/link";
import { ChevronRight, Layers } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  LABEL:   "Label",
  ARTIST:  "Artist",
  BUSINESS: "Business",
  AGENCY:  "Agency",
  OTHER:   "Other",
};

type Props = {
  client: {
    name: string;
    slug: string;
    type: string;
    brandColor: string;
    status: string;
    workspaceCount: number;
  };
};

export function ClientFolderCard({ client }: Props) {
  const isInactive = client.status !== "ACTIVE";

  return (
    <Link
      href={`/clients/${client.slug}`}
      className="relative flex flex-col gap-4 p-5 rounded-2xl border transition-all group overflow-hidden"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.14)";
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.03)";
      }}
    >
      {/* Brand color top stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-70"
        style={{ background: client.brandColor }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${client.brandColor}1A` }}
        >
          <Layers className="w-4 h-4" style={{ color: client.brandColor }} />
        </div>
        <div className="flex items-center gap-2">
          {isInactive && (
            <span
              className="text-2xs px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}
            >
              {client.status.toLowerCase()}
            </span>
          )}
          <ChevronRight
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
            style={{ color: "rgba(255,255,255,0.2)" }}
          />
        </div>
      </div>

      {/* Client name */}
      <div>
        <p className="text-sm font-bold text-white leading-snug">{client.name}</p>
        <p className="text-2xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
          {TYPE_LABELS[client.type] ?? client.type}
        </p>
      </div>

      {/* Workspace count */}
      <div
        className="flex items-center gap-1.5 pt-1"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-2xs font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
          {client.workspaceCount} workspace{client.workspaceCount !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}
