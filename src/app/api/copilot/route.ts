// TODO: Uncomment and wire Anthropic SDK on deploy
// import Anthropic from "@anthropic-ai/sdk";
// const client = new Anthropic();
// const SYSTEM_PROMPT = `...`;

// ─── Mock responses ───────────────────────────────────────────────────────────

const MOCK_RESPONSES = [
  "The most urgent thing right now is the HipHopDX photos — Kaito is away and that was due yesterday. Someone needs to pull from existing approved selects and get those over today. Maya or Amara can handle the file delivery if Kaito stays unreachable.\n\nAfter that: the REPENT! teaser copy is sitting in review waiting on Key's sign-off. That one's a quick grab — 10 minutes and it's unblocked.",
  "Elijah drops July 17 — 60 days out. You don't have any teaser content in production for it yet. The Mrs.Key rollout is winding down (84%, in analytics), which means team capacity is opening up. Good window to start pre-release asset planning in the next two weeks.",
  "Darius is tagged on the \"3 AM\" visualizer (due May 22) and he's currently marked BUSY. Worth a quick check-in to confirm he's still on track — if he's blocked, that's a priority to unblock before the May 25 drop.\n\nKaito is AWAY, so anything photo/video that comes up this week needs a workaround or a hold.",
  "The Ecclesiastes testimony carousel is IN_REVIEW and supposed to drop May 22 — 4 days out. If it hasn't been approved yet, that needs to move today.\n\nAlso: BTS Mrs.Key drops tomorrow (May 21, IG) and it's already approved — Sofia's on it, no action needed there.",
  "Three Elijah teaser directions:\n\n**The Call** — dawn visuals, empty road, voice memo audio of Key. Caption: \"He told me to go. I went.\" Drops 6 weeks out.\n\n**Prophet Series** — black and white portraits, one per week to release. Each names a theme from the project. No music. Just presence.\n\n**Behind the Name** — short video of Key explaining who Elijah was and why this project carries that name. Raw, no gloss. Strong for Reels and Shorts.",
];

let mockIndex = 0;

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid messages", { status: 400 });
    }

    const reply = MOCK_RESPONSES[mockIndex % MOCK_RESPONSES.length];
    mockIndex++;

    const encoder = new TextEncoder();
    const words = reply.split(" ");

    // Stream word-by-word so the UI behavior is identical to the real API
    const stream = new ReadableStream({
      async start(controller) {
        for (const word of words) {
          controller.enqueue(encoder.encode(word + " "));
          await new Promise((r) => setTimeout(r, 28));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
}
