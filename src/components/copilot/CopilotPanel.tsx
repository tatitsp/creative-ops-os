"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Send, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ─── Page-aware quick prompts ─────────────────────────────────────────────────

const PAGE_PROMPTS: Record<string, string[]> = {
  "/dashboard":  ["What needs my attention today?", "What's behind schedule?"],
  "/releases":   ["What content are we missing for Elijah?", "Generate teaser concepts for the drop"],
  "/projects":   ["What's the status across active campaigns?", "Which project needs the most attention?"],
  "/content":    ["What content is stuck in review?", "What's dropping next in the pipeline?"],
  "/analytics":  ["Which campaigns underperformed?", "Summarize this month's performance"],
  "/team":       ["Who's at capacity right now?", "What deliverables are overdue?"],
  "/calendar":   ["What's coming up this week?", "What's at risk of missing its date?"],
  "/assets":     ["What assets are still missing for Elijah?", "Which assets haven't been approved?"],
};

const DEFAULT_PROMPTS = ["What needs my attention today?", "What's behind schedule?"];

// ─── Component ────────────────────────────────────────────────────────────────

export function CopilotPanel() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new content
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // Match on the first path segment
  const pageKey = "/" + (pathname.split("/")[1] ?? "");
  const quickPrompts = PAGE_PROMPTS[pageKey] ?? DEFAULT_PROMPTS;

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const history = [...messages, userMsg];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: text }]);
      }
    } catch {
      setMessages([
        ...history,
        { role: "assistant", content: "Something went wrong. Check your connection and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{
          width: 52,
          height: 52,
          background: "linear-gradient(135deg, #C8923A 0%, #A07228 100%)",
          boxShadow: "0 4px 20px rgba(200,146,58,0.45), 0 2px 8px rgba(0,0,0,0.4)",
        }}
        aria-label="Open Copilot"
      >
        <Sparkles className="w-5 h-5 text-white" />
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Panel ── */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: 420,
          background: "#0E0E0E",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          boxShadow: open ? "-8px 0 40px rgba(0,0,0,0.6)" : "none",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #C8923A 0%, #A07228 100%)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Copilot</p>
              <p className="text-[0.65rem] text-white/35 leading-tight">SCOPE AI</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/8 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick prompts */}
        <div
          className="flex-shrink-0 px-4 py-3 flex gap-2 overflow-x-auto"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", scrollbarWidth: "none" }}
        >
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              disabled={loading}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/6 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3 h-3 text-gold flex-shrink-0" />
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center pb-8">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(200,146,58,0.12)", border: "1px solid rgba(200,146,58,0.2)" }}
              >
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <p className="text-sm font-semibold text-white/70 mb-1">What do you need, Tati?</p>
              <p className="text-xs text-white/30 max-w-[200px] leading-relaxed">
                Ask me anything about the operation — or tap a quick prompt above.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1"
                  style={{ background: "linear-gradient(135deg, #C8923A 0%, #A07228 100%)" }}
                >
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "text-white rounded-tr-sm"
                    : "text-white/85 rounded-tl-sm"
                }`}
                style={
                  msg.role === "user"
                    ? { background: "rgba(200,146,58,0.18)", border: "1px solid rgba(200,146,58,0.2)" }
                    : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                {msg.content === "" && msg.role === "assistant" ? (
                  // Typing indicator
                  <span className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-white/40"
                        style={{ animation: `pulse 1.2s ease-in-out ${d * 0.2}s infinite` }}
                      />
                    ))}
                  </span>
                ) : (
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                )}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="flex-shrink-0 p-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            className="flex items-end gap-2 rounded-2xl px-4 py-3"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about the op..."
              rows={1}
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-white placeholder-white/25 resize-none outline-none leading-relaxed disabled:opacity-50"
              style={{ maxHeight: 120, minHeight: 20 }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                background: input.trim() && !loading
                  ? "linear-gradient(135deg, #C8923A 0%, #A07228 100%)"
                  : "rgba(255,255,255,0.08)",
              }}
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <p className="text-[0.6rem] text-white/20 text-center mt-2">
            Shift+Enter for new line · Enter to send
          </p>
        </div>
      </div>

      {/* Pulse animation for typing dots */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </>
  );
}
