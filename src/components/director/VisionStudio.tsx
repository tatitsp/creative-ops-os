"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Upload,
  Sparkles,
  Wand2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  ImageIcon,
  ChevronRight,
  Eye,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MoodImage {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string | null;
}

interface Treatment {
  title: string;
  mood: string;
  palette: string;
  setting: string;
  narrative: string;
  director_ref: string;
  shot_style: string;
  era_ref: string;
}

interface ManifestResult {
  campaign: { id: string; name: string };
  contentItems: { id: string; title: string }[];
}

interface Props {
  initialImages: MoodImage[];
}

type UploadState = "idle" | "signing" | "uploading" | "saving" | "done" | "error";

// ─── Component ────────────────────────────────────────────────────────────────

export function VisionStudio({ initialImages }: Props) {
  // Mood board
  const [images, setImages] = useState<MoodImage[]>(initialImages);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI treatments
  const [vibe, setVibe] = useState("");
  const [treatmentsLoading, setTreatmentsLoading] = useState(false);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [treatmentError, setTreatmentError] = useState("");

  // Manifest form
  const [releaseTitle, setReleaseTitle] = useState("");
  const [releaseType, setReleaseType] = useState("ALBUM");
  const [concept, setConcept] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [manifestLoading, setManifestLoading] = useState(false);
  const [manifestResult, setManifestResult] = useState<ManifestResult | null>(null);
  const [manifestError, setManifestError] = useState("");

  // ── Mood Board upload ───────────────────────────────────────────────────────

  async function handleUpload(file: File) {
    setUploadState("signing");
    setUploadError("");
    setUploadProgress(0);

    try {
      // Step 1: signed URL
      const signRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "image/jpeg",
          size: file.size,
        }),
      });
      if (!signRes.ok) {
        const { error } = await signRes.json();
        throw new Error(error ?? "Failed to get upload URL");
      }
      const { signedUrl, gcsPath, publicUrl } = await signRes.json();

      // Step 2: PUT directly to GCS with progress tracking
      setUploadState("uploading");
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener("load", () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(`GCS error: ${xhr.status}`)),
        );
        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("Content-Type", file.type || "image/jpeg");
        xhr.send(file);
      });

      // Step 3: persist in Prisma under the director-studio workspace
      setUploadState("saving");
      const saveRes = await fetch("/api/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gcsPath,
          publicUrl,
          originalName: file.name,
          mimeType: file.type || "image/jpeg",
          size: file.size,
          workspaceSlug: "director-studio",
          tags: ["moodboard", "inspiration"],
        }),
      });
      if (!saveRes.ok) {
        const { error } = await saveRes.json();
        throw new Error(error ?? "Failed to save asset");
      }
      const { asset } = await saveRes.json();

      setImages((prev) => [
        { id: asset.id, name: asset.name, url: asset.url, thumbnailUrl: asset.thumbnailUrl },
        ...prev,
      ]);
      setUploadState("done");
      setTimeout(() => {
        setUploadState("idle");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 2500);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setUploadState("error");
    }
  }

  // ── AI Treatments ───────────────────────────────────────────────────────────

  async function generateTreatments() {
    if (!vibe.trim() || treatmentsLoading) return;
    setTreatmentsLoading(true);
    setTreatmentError("");
    setTreatments([]);
    try {
      const res = await fetch("/api/studio/treatments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Generation failed");
      }
      const { treatments } = await res.json();
      setTreatments(treatments);
    } catch (err) {
      setTreatmentError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setTreatmentsLoading(false);
    }
  }

  function loadTreatment(t: Treatment) {
    setReleaseTitle(t.title);
    setConcept(
      [
        t.narrative,
        `\nMood: ${t.mood}`,
        `Palette: ${t.palette}`,
        `Setting: ${t.setting}`,
        `Shot style: ${t.shot_style}`,
        `References: ${t.director_ref} · ${t.era_ref}`,
      ].join("\n"),
    );
    document.getElementById("manifest-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ── Manifest ────────────────────────────────────────────────────────────────

  async function handleManifest() {
    if (!releaseTitle.trim() || manifestLoading) return;
    setManifestLoading(true);
    setManifestError("");
    setManifestResult(null);
    try {
      const res = await fetch("/api/studio/manifest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: releaseTitle,
          type: releaseType,
          concept,
          releaseDate: releaseDate || undefined,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Manifest failed");
      }
      const data = await res.json();
      setManifestResult(data);
    } catch (err) {
      setManifestError(err instanceof Error ? err.message : "Manifest failed");
    } finally {
      setManifestLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 space-y-10 animate-in max-w-6xl">

      {/* ── MOOD BOARD ──────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-ink">Mood Board</h2>
            <p className="text-xs text-ink-tertiary mt-0.5">
              Inspiration images — private, separate from the artist Vault
            </p>
          </div>

          <div className="flex items-center gap-2">
            {uploadState === "error" && (
              <div className="flex items-center gap-1.5 text-rose-500 text-xs">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="max-w-[180px] truncate">{uploadError}</span>
                <button
                  onClick={() => { setUploadState("idle"); setUploadError(""); }}
                  className="hover:text-rose-700 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {uploadState === "done" && (
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Added to board
              </div>
            )}

            {(uploadState === "signing" || uploadState === "uploading" || uploadState === "saving") && (
              <div className="flex items-center gap-2 text-xs text-ink-secondary min-w-[100px]">
                <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                {uploadState === "signing" && "Preparing…"}
                {uploadState === "uploading" && `${uploadProgress}%`}
                {uploadState === "saving" && "Saving…"}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }}
            />

            {(uploadState === "idle" || uploadState === "done") && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadState !== "idle"}
              >
                Add inspiration
              </Button>
            )}
          </div>
        </div>

        {images.length === 0 ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-2xl p-14 flex flex-col items-center justify-center gap-3 hover:border-border-strong hover:bg-canvas-50 transition-all group"
          >
            <ImageIcon className="w-8 h-8 text-ink-tertiary group-hover:text-ink-secondary transition-colors" />
            <div className="text-center">
              <p className="text-sm font-semibold text-ink-secondary">Drop your inspiration here</p>
              <p className="text-xs text-ink-tertiary mt-0.5">
                Stills, reference films, color palettes, fashion, architecture — anything that feeds the vision
              </p>
            </div>
          </button>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-xl overflow-hidden bg-canvas-100 group cursor-pointer"
              >
                <Image
                  src={img.thumbnailUrl ?? img.url}
                  alt={img.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 12vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
            {/* Inline add-more tile */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center hover:border-border-strong hover:bg-canvas-50 transition-all group"
            >
              <Upload className="w-4 h-4 text-ink-tertiary group-hover:text-ink-secondary transition-colors" />
            </button>
          </div>
        )}
      </section>

      {/* ── AI TREATMENTS ───────────────────────────────────────────────────── */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-ink">Music Video Treatments</h2>
          <p className="text-xs text-ink-tertiary mt-0.5">
            Describe a vibe — Gemini writes 3 fully formed treatment concepts
          </p>
        </div>

        {/* Search bar */}
        <div className="flex gap-2 mb-6">
          <input
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateTreatments()}
            placeholder='e.g. "dark gospel noir, candlelit church ruins, slow-burning faith crisis, 4am alone with God"'
            className="flex-1 bg-canvas-100 border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-tertiary outline-none focus:ring-1 focus:ring-white/20 focus:border-border-strong transition-all"
          />
          <Button
            variant="primary"
            size="md"
            isLoading={treatmentsLoading}
            disabled={!vibe.trim() || treatmentsLoading}
            onClick={generateTreatments}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Generate
          </Button>
        </div>

        {treatmentError && (
          <div className="flex items-center gap-2 text-rose-500 text-sm mb-4 bg-rose-50 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {treatmentError}
          </div>
        )}

        {/* Skeleton while loading */}
        {treatmentsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card p-5 space-y-3 animate-pulse">
                <div className="h-4 bg-canvas-200 rounded-lg w-3/4" />
                <div className="h-3 bg-canvas-100 rounded w-1/3" />
                <div className="space-y-2 pt-2">
                  <div className="h-2.5 bg-canvas-100 rounded" />
                  <div className="h-2.5 bg-canvas-100 rounded w-5/6" />
                  <div className="h-2.5 bg-canvas-100 rounded w-4/6" />
                </div>
                <div className="pt-3 border-t border-border space-y-1.5">
                  <div className="h-2.5 bg-canvas-100 rounded" />
                  <div className="h-2.5 bg-canvas-100 rounded w-3/4" />
                  <div className="h-2.5 bg-canvas-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Treatment cards */}
        {treatments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {treatments.map((t, i) => (
              <div
                key={i}
                className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-bold text-ink leading-snug">{t.title}</h3>
                    <span className="text-2xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full flex-shrink-0 tabular-nums">
                      0{i + 1}
                    </span>
                  </div>
                  <p className="text-2xs font-semibold text-ink-tertiary uppercase tracking-widest">
                    {t.mood}
                  </p>
                </div>

                {/* Quick-scan metadata */}
                <div className="space-y-1.5 text-2xs">
                  <div className="flex gap-1">
                    <span className="text-ink-tertiary w-12 flex-shrink-0">Palette</span>
                    <span className="text-ink-secondary">{t.palette}</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-ink-tertiary w-12 flex-shrink-0">Setting</span>
                    <span className="text-ink-secondary">{t.setting}</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-ink-tertiary w-12 flex-shrink-0">Refs</span>
                    <span className="text-ink-secondary">{t.director_ref} · {t.era_ref}</span>
                  </div>
                </div>

                {/* Narrative */}
                <p className="text-xs text-ink-secondary leading-relaxed border-t border-border pt-3">
                  {t.narrative}
                </p>

                {/* Shot style */}
                <p className="text-2xs text-ink-tertiary italic border-t border-border pt-2.5">
                  {t.shot_style}
                </p>

                {/* Manifest CTA */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-auto w-full justify-center text-ink-secondary hover:text-ink"
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  onClick={() => loadTreatment(t)}
                >
                  Manifest this
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── MANIFEST ────────────────────────────────────────────────────────── */}
      <section id="manifest-section">
        <div className="mb-4">
          <h2 className="text-base font-bold text-ink">Manifest a Concept</h2>
          <p className="text-xs text-ink-tertiary mt-0.5">
            Creates a Release Room and seeds a Content Pipeline — ready for the team
          </p>
        </div>

        <div className="card p-6 space-y-5 max-w-2xl">
          {/* Title + Type row */}
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div className="space-y-1.5">
              <label className="text-label">Release title</label>
              <input
                value={releaseTitle}
                onChange={(e) => setReleaseTitle(e.target.value)}
                placeholder='e.g. Gravity, Elijah, REPENT!…'
                className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-tertiary outline-none focus:ring-1 focus:ring-white/20 focus:border-border-strong transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-label">Type</label>
              <select
                value={releaseType}
                onChange={(e) => setReleaseType(e.target.value)}
                className="bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:ring-1 focus:ring-white/20 focus:border-border-strong transition-all appearance-none cursor-pointer"
              >
                <option value="SINGLE">Single</option>
                <option value="EP">EP</option>
                <option value="ALBUM">Album</option>
                <option value="MERCH_DROP">Merch Drop</option>
                <option value="TOUR">Tour</option>
              </select>
            </div>
          </div>

          {/* Concept */}
          <div className="space-y-1.5">
            <label className="text-label">
              Concept
              <span className="text-ink-tertiary font-normal ml-1">— optional but powerful</span>
            </label>
            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              rows={5}
              placeholder="Describe the narrative, mood, visual direction, and intention. Or hit 'Manifest this' on a treatment card above to auto-fill."
              className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-tertiary outline-none focus:ring-1 focus:ring-white/20 focus:border-border-strong transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Release date */}
          <div className="space-y-1.5">
            <label className="text-label">
              Target release date
              <span className="text-ink-tertiary font-normal ml-1">— optional</span>
            </label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:ring-1 focus:ring-white/20 focus:border-border-strong transition-all"
            />
          </div>

          {/* Error */}
          {manifestError && (
            <div className="flex items-center gap-2 text-rose-500 text-sm bg-rose-50 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {manifestError}
            </div>
          )}

          {/* Success state */}
          {manifestResult ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-emerald-900">
                  "{manifestResult.campaign.name}" is in the system
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Release room + {manifestResult.contentItems.length} pipeline items created
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 transition-colors"
                  >
                    View in Projects
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <Link
                    href="/content"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 transition-colors"
                  >
                    Open Content Pipeline
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
              <button
                onClick={() => {
                  setManifestResult(null);
                  setReleaseTitle("");
                  setConcept("");
                  setReleaseDate("");
                }}
                className="text-emerald-400 hover:text-emerald-600 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="md"
              isLoading={manifestLoading}
              disabled={!releaseTitle.trim() || manifestLoading}
              onClick={handleManifest}
              leftIcon={<Wand2 className="w-4 h-4" />}
              className="w-full"
            >
              Manifest
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
