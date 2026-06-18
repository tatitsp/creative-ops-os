"use client";

import { useEffect, useState } from "react";
import { useCalendarStore, type ApiCalendarEvent } from "@/store/calendar-store";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const EVENT_TYPE_COLORS: Record<string, string> = {
  EVENT:    "bg-sky-400/20 text-sky-400",
  DEADLINE: "bg-rose-400/20 text-rose-400",
  RELEASE:  "bg-gold/20 text-gold",
  SHOOT:    "bg-violet-400/20 text-violet-400",
};

interface Props {
  workspaceSlug: string;
  workspaceName: string;
  initialEvents: ApiCalendarEvent[];
}

export function CalendarPageClient({ workspaceSlug, workspaceName, initialEvents }: Props) {
  const { events, init, addEvent, removeEvent } = useCalendarStore();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    allDay: false,
    type: "EVENT",
  });

  useEffect(() => {
    init(workspaceSlug, initialEvents);
  }, [workspaceSlug, initialEvents, init]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.startAt) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceSlug}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || null,
          startAt: form.startAt,
          endAt: form.endAt || null,
          allDay: form.allDay,
          type: form.type,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        addEvent(data.event as ApiCalendarEvent);
        setForm({ title: "", description: "", startAt: "", endAt: "", allDay: false, type: "EVENT" });
        setShowForm(false);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <TopBar
        title="Calendar"
        subtitle={workspaceName}
        actions={
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setShowForm((v) => !v)}
          >
            Add Event
          </Button>
        }
      />

      <div className="p-6 max-w-3xl space-y-4 animate-in">
        {/* Add event form */}
        {showForm && (
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-ink">New Event</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Event title"
                className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong transition-colors"
              />
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description (optional)"
                className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong transition-colors"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-ink-tertiary mb-1 block">Start</label>
                  <input
                    required
                    type="datetime-local"
                    value={form.startAt}
                    onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
                    className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-ink-tertiary mb-1 block">End (optional)</label>
                  <input
                    type="datetime-local"
                    value={form.endAt}
                    onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))}
                    className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong transition-colors"
                >
                  {["EVENT", "DEADLINE", "RELEASE", "SHOOT"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-sm text-ink-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.allDay}
                    onChange={(e) => setForm((f) => ({ ...f, allDay: e.target.checked }))}
                    className="rounded"
                  />
                  All day
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" variant="primary" disabled={submitting}>
                  {submitting ? "Saving…" : "Save Event"}
                </Button>
                <Button type="button" size="sm" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Events list */}
        {events.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-canvas-100 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-ink-tertiary" />
            </div>
            <p className="text-sm font-semibold text-ink">No events yet</p>
            <p className="text-xs text-ink-tertiary mt-1">Add your first event using the button above.</p>
          </div>
        ) : (
          <div className="card divide-y divide-border">
            {events.map((event) => {
              const start = new Date(event.startAt);
              const end = event.endAt ? new Date(event.endAt) : null;
              const colorClass = EVENT_TYPE_COLORS[event.type] ?? "bg-canvas-100 text-ink-secondary";
              return (
                <div key={event.id} className="flex items-start gap-4 px-5 py-4 hover:bg-canvas-50 transition-colors">
                  <div className="flex-shrink-0 text-center min-w-[48px]">
                    <p className="text-xs font-bold text-ink-tertiary uppercase">
                      {start.toLocaleDateString("en-US", { month: "short" })}
                    </p>
                    <p className="text-xl font-black text-ink leading-none">
                      {start.getDate()}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-ink">{event.title}</p>
                      <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full", colorClass)}>
                        {event.type}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-xs text-ink-secondary mt-0.5">{event.description}</p>
                    )}
                    <p className="text-xs text-ink-tertiary mt-1">
                      {event.allDay
                        ? "All day"
                        : start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      {end && !event.allDay && (
                        <> – {end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => removeEvent(event.id)}
                    className="flex-shrink-0 text-ink-tertiary hover:text-rose-400 transition-colors"
                    aria-label="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
