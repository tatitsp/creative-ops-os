"use client";

import { useState } from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { CONTENT_PHASES, PLATFORM_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus, CalendarDays, X } from "lucide-react";
import type { CAAM1K_CONTENT } from "@/lib/mock-artist2";

type ContentItem = typeof CAAM1K_CONTENT[0];
type ViewMode = "Month" | "Week" | "List";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

interface Props {
  artistName: string;
  content: ContentItem[];
}

export function ArtistCalendarClient({ artistName, content }: Props) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(6); // June
  const [view, setView] = useState<ViewMode>("Month");
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDay, setEventDay] = useState("");
  const [customEvents, setCustomEvents] = useState<{ id: string; title: string; day: number; month: number; year: number }[]>([]);

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  function handleAddEvent() {
    const day = parseInt(eventDay);
    if (!eventTitle.trim() || isNaN(day)) return;
    setCustomEvents((prev) => [...prev, { id: `e-${Date.now()}`, title: eventTitle.trim(), day, month, year }]);
    setEventTitle("");
    setEventDay("");
    setAddEventOpen(false);
  }

  const calendarCells = buildCalendar(year, month);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayDay = isCurrentMonth ? today.getDate() : -1;

  const contentByDay: Record<number, ContentItem[]> = {};
  content.forEach((item) => {
    const d = new Date(item.scheduledAt);
    if (d.getFullYear() === year && d.getMonth() + 1 === month) {
      const day = d.getDate();
      if (!contentByDay[day]) contentByDay[day] = [];
      contentByDay[day].push(item);
    }
  });

  const customByDay = customEvents
    .filter((e) => e.year === year && e.month === month)
    .reduce<Record<number, typeof customEvents>>((acc, e) => {
      if (!acc[e.day]) acc[e.day] = [];
      acc[e.day].push(e);
      return acc;
    }, {});

  return (
    <div className="min-h-screen">
      {addEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-canvas-50 border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 animate-in">
            <div className="flex items-center justify-between">
              <h2 className="text-heading">Add Event</h2>
              <button onClick={() => setAddEventOpen(false)} className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <X className="w-4 h-4 text-ink-tertiary" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-label block mb-1.5">Event title</label>
                <input className="input-base" placeholder="e.g. Instagram post" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} autoFocus />
              </div>
              <div>
                <label className="text-label block mb-1.5">Day ({MONTH_NAMES[month - 1]} {year})</label>
                <input className="input-base" type="number" min={1} max={31} placeholder="e.g. 15" value={eventDay} onChange={(e) => setEventDay(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => setAddEventOpen(false)}>Cancel</Button>
              <Button variant="primary" size="sm" className="flex-1" onClick={handleAddEvent} disabled={!eventTitle.trim() || !eventDay}>Add</Button>
            </div>
          </div>
        </div>
      )}

      <TopBar
        title="Content Calendar"
        subtitle={`${artistName} · ${MONTH_NAMES[month - 1]} ${year}`}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <ChevronLeft className="w-4 h-4 text-ink-secondary" />
              </button>
              <span className="text-sm font-medium text-ink px-2">{MONTH_NAMES[month - 1]} {year}</span>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <ChevronRight className="w-4 h-4 text-ink-secondary" />
              </button>
            </div>
            <div className="flex items-center gap-1 bg-canvas-100 rounded-lg p-1">
              {(["Month", "Week", "List"] as ViewMode[]).map((v) => (
                <button key={v} onClick={() => setView(v)} className={cn("px-3 py-1 text-xs font-medium rounded-md transition-colors", view === v ? "bg-canvas-200 text-ink shadow-card" : "text-ink-secondary hover:text-ink")}>
                  {v}
                </button>
              ))}
            </div>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setAddEventOpen(true)}>
              Add event
            </Button>
          </div>
        }
      />

      <div className="p-6 animate-in">
        {view === "Month" && (
          <div className="card overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="py-3 text-center text-label border-r border-border last:border-r-0">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarCells.map((day, i) => {
                const isToday = day === todayDay;
                const items = day ? contentByDay[day] ?? [] : [];
                const custom = day ? customByDay[day] ?? [] : [];
                return (
                  <div key={i} className={cn("min-h-28 p-2 border-b border-r border-border last:border-r-0", !day && "bg-canvas-50", isToday && "bg-gold-50/20", (i + 1) % 7 === 0 && "border-r-0")}>
                    {day && (
                      <>
                        <div className="flex items-center justify-end mb-1">
                          <span className={cn("w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium", isToday ? "bg-gold text-white" : "text-ink")}>{day}</span>
                        </div>
                        <div className="space-y-0.5">
                          {items.slice(0, 2).map((item) => {
                            const phaseCfg = CONTENT_PHASES.find((p) => p.phase === item.phase);
                            return (
                              <div key={item.id} className={cn("text-2xs font-medium px-1.5 py-0.5 rounded truncate", phaseCfg?.color ?? "bg-gold-50 text-gold")} title={item.title}>
                                {item.title}
                              </div>
                            );
                          })}
                          {custom.map((evt) => (
                            <div key={evt.id} className="text-2xs font-medium px-1.5 py-0.5 rounded truncate bg-violet-100 text-violet-700">★ {evt.title}</div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "List" && (
          <div className="space-y-2">
            {content.length === 0 && customEvents.filter((e) => e.year === year && e.month === month).length === 0 && (
              <div className="py-16 text-center text-sm text-ink-tertiary">No events for {MONTH_NAMES[month - 1]} {year}.</div>
            )}
            {content.map((item) => {
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
                  <p className="text-xs font-medium text-ink flex-shrink-0">
                    {new Date(item.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <span className={cn("text-2xs font-medium px-2 py-0.5 rounded-full flex-shrink-0", phaseCfg?.color)}>
                    {phaseCfg?.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {view === "Week" && (
          <div className="card p-8 flex items-center justify-center text-ink-tertiary text-sm">
            Week view coming soon
          </div>
        )}
      </div>
    </div>
  );
}
