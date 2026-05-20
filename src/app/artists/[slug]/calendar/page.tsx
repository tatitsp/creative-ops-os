import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { CAAM1K_CONTENT } from "@/lib/mock-artist2";
import { Button } from "@/components/ui/Button";
import { CONTENT_PHASES, PLATFORM_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Calendar` : "Calendar" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendarCells = buildCalendar(2026, 6); // June 2026

const contentByDay: Record<number, typeof CAAM1K_CONTENT> = {};
CAAM1K_CONTENT.forEach((item) => {
  const d = new Date(item.scheduledAt);
  if (d.getFullYear() === 2026 && d.getMonth() === 5) {
    const day = d.getDate();
    if (!contentByDay[day]) contentByDay[day] = [];
    contentByDay[day].push(item);
  }
});

export default async function ArtistCalendarPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  const upcoming = CAAM1K_CONTENT.filter(
    (c) => c.phase === "REVIEW" || c.phase === "PRODUCTION" || c.phase === "EDITING"
  );

  return (
    <>
      <TopBar
        title="Content Calendar"
        subtitle="June 2026"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <ChevronLeft className="w-4 h-4 text-ink-secondary" />
              </button>
              <span className="text-sm font-medium text-ink px-2">June 2026</span>
              <button className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <ChevronRight className="w-4 h-4 text-ink-secondary" />
              </button>
            </div>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add event
            </Button>
          </div>
        }
      />

      <div className="p-6 animate-in">
        <div className="card overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="py-3 text-center text-label border-r border-border last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarCells.map((day, i) => {
              const items = day ? contentByDay[day] ?? [] : [];
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-28 p-2 border-b border-r border-border last:border-r-0",
                    !day && "bg-canvas-50",
                    (i + 1) % 7 === 0 && "border-r-0",
                  )}
                >
                  {day && (
                    <>
                      <div className="flex items-center justify-end mb-1">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium text-ink">
                          {day}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {items.slice(0, 2).map((item) => {
                          const phaseCfg = CONTENT_PHASES.find((p) => p.phase === item.phase);
                          return (
                            <div
                              key={item.id}
                              className={cn("text-2xs font-medium px-1.5 py-0.5 rounded truncate", phaseCfg?.color ?? "bg-gold-50 text-gold")}
                              title={item.title}
                            >
                              {item.title}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-subheading mb-3">Upcoming — In Progress</h2>
          <div className="space-y-2">
            {upcoming.map((item) => {
              const phaseCfg = CONTENT_PHASES.find((p) => p.phase === item.phase);
              return (
                <div key={item.id} className="card p-3 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center flex-shrink-0">
                    <CalendarDays className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.platforms.slice(0, 2).map((p) => {
                        const cfg = PLATFORM_CONFIG[p as keyof typeof PLATFORM_CONFIG];
                        return <span key={p} className="text-2xs text-ink-tertiary">{cfg?.label ?? p}</span>;
                      })}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-ink">
                      {new Date(item.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <span className={cn("text-2xs font-medium px-2 py-0.5 rounded-full flex-shrink-0", phaseCfg?.color)}>
                    {phaseCfg?.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
