// POST /api/studio/treatments
//
// Calls Gemini with a vibe description and returns 3 structured Music Video
// Treatment concepts. Returns raw JSON — no markdown, no streaming.

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are a visionary music video treatment writer working with Lil Tony Official — a Houston-based Gospel Rap / Hip-Hop artist known for cinematic, faith-forward, introspective work. Think Barry Jenkins meets Arthur Jafa meets Terrence Malick.

Given a vibe description from the Creative Director, return EXACTLY 3 distinct music video treatment concepts as a valid JSON array. Respond with ONLY the JSON array — no markdown, no code fences, no preamble, no trailing text. Just raw parseable JSON.

Each treatment object must have exactly these string fields:
- "title": evocative treatment name (3–6 words, cinematic, not generic)
- "mood": emotional temperature (2–4 words, specific and textured)
- "palette": concrete color/texture palette (3–5 words, e.g. "ash white, church gold, deep maroon")
- "setting": precise location with atmosphere detail (one sentence)
- "narrative": the full story arc (2–3 sentences, visual and specific — describe what the camera sees)
- "director_ref": 1–2 real director names as visual reference (e.g. "Barry Jenkins, Arthur Jafa")
- "shot_style": cinematography approach (one concrete sentence about lens, movement, framing)
- "era_ref": visual movement or era reference (e.g. "70s New Hollywood, Wong Kar-wai, Italian neorealism")

Make each treatment distinct in tone, setting, and visual language. Do not repeat locations or moods across the three.`;

export async function POST(req: Request) {
  try {
    const { vibe } = await req.json();

    if (!vibe?.trim()) {
      return Response.json({ error: "Vibe is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `${SYSTEM_PROMPT}\n\nVibe: ${vibe.trim()}`,
    );

    const raw = result.response.text().trim();

    // Strip any markdown code fences Gemini might still add
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const treatments = JSON.parse(cleaned);

    if (!Array.isArray(treatments) || treatments.length === 0) {
      throw new Error("Unexpected response shape from model");
    }

    return Response.json({ treatments });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[studio/treatments] error:", message);
    return Response.json({ error: "Failed to generate treatments" }, { status: 500 });
  }
}
