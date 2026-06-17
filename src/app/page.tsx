import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function RootPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  // Artists go straight to their own workspace; everyone else picks from the list
  if (session.user.role === "ARTIST_CEO") {
    const slug = session.user.workspaceSlugs[0];
    if (slug) redirect(`/artists/${slug}/dashboard`);
  }

  redirect("/select-workspace");
}
