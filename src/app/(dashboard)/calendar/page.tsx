import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { MOCK_CONTENT, MOCK_TASKS } from "@/lib/mock-data";
import { CONTENT_PHASES, PLATFORM_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from "lucide-react";

export const metadata: Metadata = { title: "Calendar" };

// Build calendar for May 2026
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAY_2026_START_DOW = 4; // May 1, 2026 is a Friday → index 5
const MAY_2026_DAYS = 31;

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const calendarCells = buildCalendar(2026, 5);

// Map content by day
const contentByDay: Record<number, typeof MOCK_CONTENT> = {};
MOCK_CONTENT.forEach((item) => {
  if (item.scheduledAt) {
    const d = new Date(item.scheduledAt);
    if (d.getFullYear() === 2026 && d.getMonth() === 4) {
      const day = d.getDate();
      if (!contentByDay[day]) contentByDay[day] = [];
      contentByDay[day].push(item);
    }
  }
});

const tasksByDay: Record<number, typeof MOCK_TASKS> = {};
MOCK_TASKS.forEach((task) => {
  if (task.dueDate) {
    const d = new Date(task.dueDate);
    if (d.getFullYear() === 2026 && d.getMonth() === 4) {
      const day = d.getDate();
      if (!tasksByDay[day]) tasksByDay[day] = [];
      tasksByDay[day].push(task);
    }
  }
});

export default function CalendarPage() {
  const today = 18; // Today is May 18

  return (
    <div className="min-h-screen">
      <TopBar
        title="Content Calendar"
        subtitle="May 2026"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <ChevronLeft className="w-4 h-4 text-ink-secondary" />
              </button>
              <span className="text-sm font-medium text-ink px-2">May 2026</span>
              <button className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <ChevronRight className="w-4 h-4 text-ink-secondary" />
              </button>
            </div>
            <div className="flex items-center gap-1 bg-canvas-100 rounded-lg p-1">
              {["Month", "Week", "List"].map((v, i) => (
                <button
                  key={v}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                    i === 0 ? "bg-canvas-200 text-ink shadow-card" : "text-ink-secondary hover:text-ink",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add event
            </Button>
          </div>
        }
      />

      <div className="p-6 animate-in">
        <div className="card overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="py-3 text-center text-label border-r border-border last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarCells.map((day, i) => {
              const isToday = day === today;
              const items = day ? contentByDay[day] ?? [] : [];
              const tasks = day ? tasksByDay[day] ?? [] : [];
              const isPast = day !== null && day < today;

              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-28 p-2 border-b border-r border-border last:border-r-0 relative",
                    !day && "bg-canvas-50",
                    isPast && "bg-canvas-50/50",
                    isToday && "bg-gold-50/20",
                    (i + 1) % 7 === 0 && "border-r-0",
                  )}
                >
                  {day && (
                    <>
                      {/* Day number */}
                      <div className="flex items-center justify-end mb-1">
                        <span
                          className={cn(
                            "w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium",
                            isToday
                              ? "bg-gold text-white"
                              : isPast
                                ? "text-ink-tertiary"
                                : "text-ink",
                          )}
                        >
                          {day}
                        </span>
                      </div>

                      {/* Content items */}
                      <div className="space-y-0.5">
                        {items.slice(0, 2).map((item) => {
                          const phaseCfg = CONTENT_PHASES.find((p) => p.phase === item.phase);
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                "text-2xs font-medium px-1.5 py-0.5 rounded truncate",
                                phaseCfg?.color ?? "bg-gold-50 text-gold",
                              )}
                              title={item.title}
                            >
                              {item.title}
                            </div>
                          );
                        })}
                        {tasks.slice(0, 1).map((task) => (
                          <div
                            key={task.id}
                            className="text-2xs font-medium px-1.5 py-0.5 rounded truncate bg-amber-50 text-amber-600"
                            title={task.title}
                          >
                            ◎ {task.title}
                          </div>
                        ))}
                        {items.length + tasks.length > 3 && (
                          <div className="text-2xs text-ink-tertiary px-1.5">
                            +{items.length + tasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming events list */}
        <div className="mt-6">
          <h2 className="text-subheading mb-3">Upcoming Scheduled Posts</h2>
          <div className="space-y-2">
            {MOCK_CONTENT.filter((c) => c.scheduledAt && c.phase === "SCHEDULED" || c.phase === "APPROVED")
              .sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""))
              .map((item) => {
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
                          const cfg = PLATFORM_CONFIG[p];
                          return (
                            <span key={p} className="text-2xs text-ink-tertiary">
                              {cfg?.label ?? p}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    {item.scheduledAt && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-medium text-ink">
                          {new Date(item.scheduledAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-2xs text-ink-tertiary">
                          {new Date(item.scheduledAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    )}
                    <span className={cn("text-2xs font-medium px-2 py-0.5 rounded-full flex-shrink-0", phaseCfg?.color)}>
                      {phaseCfg?.label}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
