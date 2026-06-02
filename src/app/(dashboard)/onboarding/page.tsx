import type { Metadata } from "next";
import { OnboardingPageClient } from "./OnboardingPageClient";

export const metadata: Metadata = { title: "Getting Started" };

export default function OnboardingPage() {
  return <OnboardingPageClient />;
}
