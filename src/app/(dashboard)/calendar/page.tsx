import type { Metadata } from "next";
import { CalendarPageClient } from "./CalendarPageClient";

export const metadata: Metadata = { title: "Calendar" };

export default function CalendarPage() {
  return <CalendarPageClient />;
}
