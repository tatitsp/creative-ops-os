"use client";

import { useRef, useState } from "react";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  workspaceSlug: string;
  onSuccess?: (asset: Record<string, unknown>) => void;
}

type UploadState = "idle" | "signing" | "uploading" | "saving" | "success" | "error";

export function AssetUploadButton({ workspaceSlug, onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");

  function reset() {
    setState("idle");
    setProgress(0);
    setErrorMsg("");
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleFile(file: File) {
    setFileName(file.name);
    setErrorMsg("");

    try {
      // ── Step 1: get a signed PUT URL from our API ──────────────────────────
      setState("signing");
      const signRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          size: file.size,
        }),
      });

      if (!signRes.ok) {
        const { error } = await signRes.json();
        throw new Error(error ?? "Failed to get upload URL");
      }

      const { signedUrl, gcsPath, publicUrl } = await signRes.json();

      // ── Step 2: PUT the file directly to GCS ──────────────────────────────
      // Using XHR (not fetch) so we can track upload progress.
      // The file never touches the Next.js server — this is what makes large
      // files (music videos, masters, photo zips) efficient.
      setState("uploading");
      setProgress(0);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`GCS upload failed: ${xhr.status} ${xhr.statusText}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
        xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.send(file);
      });

      // ── Step 3: record the asset in Prisma ────────────────────────────────
      setState("saving");
      const completeRes = await fetch("/api/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gcsPath,
          publicUrl,
          originalName: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          workspaceSlug,
          tags: [],
        }),
      });

      if (!completeRes.ok) {
        const { error } = await completeRes.json();
        // Surface DB errors (e.g. unseeded workspace) without crashing —
        // the file is already in GCS, so this is recoverable.
        throw new Error(error ?? "Failed to save asset record");
      }

      const { asset } = await completeRes.json();
      setState("success");
      onSuccess?.(asset);

      // Auto-reset after 3 s so the button is reusable
      setTimeout(reset, 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
      setState("error");
    }
  }

  const isActive = state !== "idle" && state !== "success" && state !== "error";

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {state === "idle" && (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold text-white text-xs font-semibold hover:bg-gold-400 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload assets
        </button>
      )}

      {isActive && (
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-canvas-100 border border-border text-xs text-ink-secondary min-w-[220px]">
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium text-ink">{fileName}</p>
            <div className="mt-1 h-1 bg-canvas-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-150"
                style={{
                  width:
                    state === "signing" ? "5%" :
                    state === "uploading" ? `${progress}%` :
                    state === "saving" ? "98%" : "0%",
                }}
              />
            </div>
          </div>
          <span className="flex-shrink-0 tabular-nums">
            {state === "signing"  && "Preparing…"}
            {state === "uploading" && `${progress}%`}
            {state === "saving"   && "Saving…"}
          </span>
        </div>
      )}

      {state === "success" && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Uploaded
        </div>
      )}

      {state === "error" && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs max-w-xs">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate" title={errorMsg}>{errorMsg}</span>
          </div>
          <button
            onClick={reset}
            className="p-1 rounded hover:bg-canvas-100 transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5 text-ink-tertiary" />
          </button>
        </div>
      )}
    </div>
  );
}
