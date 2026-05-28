import { redirect } from "next/navigation";
import { CURRENT_USER } from "@/lib/mock-data";

export default function RootPage() {
  // Artists go straight to their dashboard; team members pick a workspace first
  if (CURRENT_USER.role === "ARTIST_CEO") {
    redirect("/dashboard");
  }
  redirect("/select-workspace");
}
