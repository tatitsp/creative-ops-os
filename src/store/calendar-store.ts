import { create } from "zustand";

export type CalendarEventType = "EVENT" | "DEADLINE" | "RELEASE" | "SHOOT";

export type ApiCalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string | null;
  allDay: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; name: string | null; email: string } | null;
};

interface CalendarStore {
  events: ApiCalendarEvent[];
  workspaceSlug: string;
  init: (slug: string, initial: ApiCalendarEvent[]) => void;
  addEvent: (event: ApiCalendarEvent) => void;
  removeEvent: (id: string) => void;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [],
  workspaceSlug: "",

  init: (slug, initial) => {
    set({ workspaceSlug: slug, events: initial });
  },

  addEvent: (event) => {
    set((state) => ({ events: [event, ...state.events] }));
  },

  removeEvent: (id) => {
    const { workspaceSlug } = get();
    set((state) => ({ events: state.events.filter((e) => e.id !== id) }));
    fetch(`/api/workspaces/${workspaceSlug}/events/${id}`, {
      method: "DELETE",
    }).catch(console.error);
  },
}));
