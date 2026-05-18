import { redirect } from "next/navigation";

// Root redirects to main dashboard
export default function RootPage() {
  redirect("/dashboard");
}
