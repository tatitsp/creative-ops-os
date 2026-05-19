import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { ROLE_LABELS } from "@/lib/constants";
import {
  FileText,
  BookOpen,
  UserCheck,
  MessageSquare,
  Monitor,
  Heart,
  CheckCircle2,
  Lock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Onboarding" };

const ONBOARDING_TRACKS = [
  {
    role: "CREATIVE_ASSISTANT" as const,
    steps: [
      {
        id: "contract",
        title: "Sign your contract",
        desc: "Review and sign your team agreement and NDA.",
        icon: FileText,
        done: true,
      },
      {
        id: "workflow",
        title: "Platform walkthrough",
        desc: "Learn how Creative Ops OS is structured and how to navigate.",
        icon: Monitor,
        done: true,
      },
      {
        id: "role",
        title: "Role & responsibilities",
        desc: "Understand your responsibilities, deliverables, and expectations.",
        icon: UserCheck,
        done: true,
      },
      {
        id: "comms",
        title: "Communication standards",
        desc: "Learn response time expectations, channel etiquette, and escalation paths.",
        icon: MessageSquare,
        done: false,
      },
      {
        id: "culture",
        title: "Culture & wellness overview",
        desc: "How we protect focus, prevent burnout, and create high-performance peace.",
        icon: Heart,
        done: false,
      },
      {
        id: "tools",
        title: "System tutorial",
        desc: "Hands-on walkthrough of campaigns, content pipeline, asset library, and approvals.",
        icon: BookOpen,
        done: false,
      },
    ],
  },
];

export default function OnboardingPage() {
  const track = ONBOARDING_TRACKS[0];
  const completed = track.steps.filter((s) => s.done).length;
  const pct = Math.round((completed / track.steps.length) * 100);

  return (
    <div className="min-h-screen">
      <TopBar
        title="Onboarding"
        subtitle="New team member setup flow"
        actions={
          <Button variant="primary" size="sm">
            Send invite
          </Button>
        }
      />

      <div className="p-6 max-w-3xl space-y-8 animate-in">
        {/* Header card */}
        <div className="card p-6 bg-gradient-to-br from-gold-50 to-canvas-100 border-gold-200">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-label mb-1">Active track</p>
              <h2 className="text-heading">{ROLE_LABELS[track.role]}</h2>
              <p className="text-sm text-ink-secondary mt-1 max-w-md">
                New team members receive contracts, role guidance, system tutorials, communication
                expectations, and a culture overview before going live.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-black text-gold">{pct}%</p>
              <p className="text-xs text-ink-tertiary mt-0.5">
                {completed} / {track.steps.length} complete
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={pct} color="gold" size="md" />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {track.steps.map((step, i) => {
            const Icon = step.icon;
            const isNext = !step.done && track.steps[i - 1]?.done !== false;

            return (
              <div
                key={step.id}
                className={cn(
                  "card p-4 flex items-start gap-4 transition-all duration-150",
                  step.done && "opacity-70",
                  isNext && "border-gold-200 shadow-glow",
                )}
              >
                {/* Icon / check */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    step.done
                      ? "bg-emerald-50"
                      : isNext
                        ? "bg-gold-100"
                        : "bg-canvas-100",
                  )}
                >
                  {step.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        isNext ? "text-gold" : "text-ink-tertiary",
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        step.done ? "line-through text-ink-tertiary" : "text-ink",
                      )}
                    >
                      {step.title}
                    </p>
                    {isNext && (
                      <span className="text-2xs font-semibold px-1.5 py-0.5 rounded-full bg-gold-100 text-gold">
                        Up next
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-secondary mt-0.5">{step.desc}</p>
                </div>

                {/* Action */}
                {!step.done && (
                  <Button
                    size="sm"
                    variant={isNext ? "primary" : "ghost"}
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    disabled={!isNext}
                  >
                    {isNext ? "Start" : <Lock className="w-3.5 h-3.5 text-ink-tertiary" />}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Role select */}
        <section>
          <h2 className="text-subheading mb-3">Onboard for a different role</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(Object.entries(ROLE_LABELS) as [keyof typeof ROLE_LABELS, string][]).map(([role, label]) => (
              <button
                key={role}
                className="card p-3 text-left hover:border-gold-200 transition-colors"
              >
                <p className="text-xs font-medium text-ink">{label}</p>
                <p className="text-2xs text-ink-tertiary mt-0.5">6-step track</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
