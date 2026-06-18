"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Hash, Plus, Send, Trash2, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChannelRow {
  id: string;
  name: string;
  description: string | null;
  type: string;
  isPrivate: boolean;
  isPinned: boolean;
  createdAt: string;
  createdBy: { id: string; name: string | null; email: string } | null;
}

export interface MessageRow {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    displayName: string | null;
    image: string | null;
  };
}

interface Props {
  slug: string;
  initialChannels: ChannelRow[];
  canManageChannels: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function authorDisplayName(author: MessageRow["author"]) {
  return author.displayName ?? author.name ?? author.id;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChannelsPageClient({ slug, initialChannels, canManageChannels }: Props) {
  const [channels, setChannels] = useState<ChannelRow[]>(initialChannels);
  const [activeId, setActiveId] = useState<string | null>(initialChannels[0]?.id ?? null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // New channel form
  const [showNewChannel, setShowNewChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const [creatingChannel, setCreatingChannel] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find((c) => c.id === activeId);

  const loadMessages = useCallback(async (channelId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(
        `/api/workspaces/${slug}/channels/${channelId}/messages`
      );
      if (res.ok) {
        const data = await res.json() as { messages: MessageRow[] };
        setMessages(data.messages);
      }
    } finally {
      setLoadingMessages(false);
    }
  }, [slug]);

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId);
    }
  }, [activeId, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!activeId || !input.trim()) return;
    setSending(true);
    try {
      const res = await fetch(
        `/api/workspaces/${slug}/channels/${activeId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: input.trim() }),
        }
      );
      if (res.ok) {
        const data = await res.json() as { message: MessageRow };
        setMessages((prev) => [...prev, data.message]);
        setInput("");
      }
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleCreateChannel(e: React.FormEvent) {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    setCreatingChannel(true);
    try {
      const res = await fetch(`/api/workspaces/${slug}/channels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newChannelName.trim(), description: newChannelDesc.trim() || null }),
      });
      if (res.ok) {
        const data = await res.json() as { channel: ChannelRow };
        setChannels((prev) => [...prev, data.channel]);
        setActiveId(data.channel.id);
        setNewChannelName("");
        setNewChannelDesc("");
        setShowNewChannel(false);
      }
    } finally {
      setCreatingChannel(false);
    }
  }

  async function handleDeleteChannel(id: string) {
    const res = await fetch(`/api/workspaces/${slug}/channels/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setChannels((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) {
        const remaining = channels.filter((c) => c.id !== id);
        setActiveId(remaining[0]?.id ?? null);
      }
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Channel sidebar */}
      <aside className="w-56 border-r border-border bg-canvas-50 flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <span className="text-label">Channels</span>
          <button
            onClick={() => setShowNewChannel((v) => !v)}
            className="p-1 rounded hover:bg-canvas-100 transition-colors"
            aria-label="New channel"
          >
            {showNewChannel ? (
              <X className="w-3.5 h-3.5 text-ink-tertiary" />
            ) : (
              <Plus className="w-3.5 h-3.5 text-ink-tertiary" />
            )}
          </button>
        </div>

        {/* New channel form */}
        {showNewChannel && (
          <form onSubmit={handleCreateChannel} className="p-3 border-b border-border space-y-2">
            <input
              required
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="channel-name"
              className="input w-full text-xs"
            />
            <input
              value={newChannelDesc}
              onChange={(e) => setNewChannelDesc(e.target.value)}
              placeholder="Description (optional)"
              className="input w-full text-xs"
            />
            <button
              type="submit"
              disabled={creatingChannel}
              className="w-full px-2 py-1.5 bg-gold text-white rounded text-xs font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
            >
              {creatingChannel ? "Creating…" : "Create"}
            </button>
          </form>
        )}

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {channels.map((ch) => {
            const isActive = ch.id === activeId;
            return (
              <div key={ch.id} className="group flex items-center">
                <button
                  onClick={() => setActiveId(ch.id)}
                  className={`flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-gold-50 text-gold"
                      : "text-ink-secondary hover:bg-canvas-100 hover:text-ink"
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1 text-left truncate">{ch.name}</span>
                </button>
                {canManageChannels && (
                  <button
                    onClick={() => handleDeleteChannel(ch.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-50 text-ink-tertiary hover:text-rose-500 transition-all ml-0.5"
                    aria-label="Delete channel"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
          {channels.length === 0 && (
            <p className="text-2xs text-ink-tertiary px-2 py-2">No channels yet.</p>
          )}
        </div>
      </aside>

      {/* Chat area */}
      {activeChannel ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Channel header */}
          <div className="h-12 border-b border-border bg-canvas-50 px-4 flex items-center flex-shrink-0">
            <Hash className="w-4 h-4 text-ink-secondary mr-2" />
            <span className="text-sm font-semibold text-ink">{activeChannel.name}</span>
            {activeChannel.description && (
              <span className="text-xs text-ink-tertiary ml-3 truncate">
                {activeChannel.description}
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-xs text-ink-tertiary">Loading messages…</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-ink-tertiary">
                <Hash className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No messages yet in #{activeChannel.name}</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-canvas-200 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-ink-secondary">
                    {authorDisplayName(msg.author).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-ink">
                        {authorDisplayName(msg.author)}
                      </span>
                      <span className="text-2xs text-ink-tertiary">{formatTime(msg.createdAt)}</span>
                    </div>
                    <p className="text-sm text-ink mt-0.5 leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-border flex-shrink-0">
            <div className="flex items-center gap-3 bg-canvas-100 border border-border rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-white/20 focus-within:border-border-strong transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message #${activeChannel.name}`}
                className="flex-1 text-sm bg-transparent outline-none text-ink placeholder:text-ink-tertiary"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-7 h-7 bg-gold rounded-lg flex items-center justify-center hover:bg-gold/90 transition-colors disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-ink-tertiary">
          <div className="text-center">
            <Hash className="w-10 h-10 mb-3 mx-auto opacity-20" />
            <p className="text-sm">Select a channel to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
