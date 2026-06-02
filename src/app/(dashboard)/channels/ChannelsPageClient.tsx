"use client";

import { useState, useRef, useEffect } from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { MOCK_USERS } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";
import { Hash, Volume2, Plus, Bell, Pin, MoreHorizontal, Send, Paperclip, Smile } from "lucide-react";

const CHANNELS = [
  { id: "ch1", name: "general", type: "text", unread: 0, pinned: true, description: "General team discussion" },
  { id: "ch2", name: "announcements", type: "announcement", unread: 1, pinned: true, description: "Official team announcements" },
  { id: "ch3", name: "mrskey-rollout", type: "text", unread: 3, pinned: false, description: "Mrs.Key album rollout channel" },
  { id: "ch4", name: "ecclesiastes-push", type: "text", unread: 0, pinned: false, description: "Ecclesiastes campaign channel" },
  { id: "ch5", name: "press-push", type: "text", unread: 2, pinned: false, description: "Press and media coordination" },
  { id: "ch6", name: "social-scheduling", type: "text", unread: 0, pinned: false, description: "Social media scheduling" },
  { id: "ch7", name: "random", type: "text", unread: 0, pinned: false, description: "Off-topic conversation" },
];

const CHANNEL_MESSAGES: Record<string, { id: string; author: typeof MOCK_USERS[0]; content: string; timestamp: string }[]> = {
  ch3: [
    { id: "m1", author: MOCK_USERS[1], content: "Hey team — Mrs.Key merch mockups are ready for artist approval. Amara, can you submit through the approval queue?", timestamp: "2026-05-18T10:28:00Z" },
    { id: "m2", author: MOCK_USERS[5], content: "On it! Just submitted — should be in the queue now.", timestamp: "2026-05-18T10:32:00Z" },
    { id: "m3", author: MOCK_USERS[0], content: "Saw it. Clean work. Reviewing now — will have notes or approval back within the hour.", timestamp: "2026-05-18T10:45:00Z" },
    { id: "m4", author: MOCK_USERS[2], content: "Also dropping the '3 AM' visualizer v2 into assets now — cutting the 30s TikTok edit next.", timestamp: "2026-05-18T11:00:00Z" },
    { id: "m5", author: MOCK_USERS[2], content: "30s cut done and uploaded. 15s version will be ready EOD.", timestamp: "2026-05-18T11:48:00Z" },
  ],
  ch1: [
    { id: "g1", author: MOCK_USERS[1], content: "Good morning team — big week. Ecclesiastes push starts today. Everyone check your assignments in the content pipeline.", timestamp: "2026-05-18T09:00:00Z" },
    { id: "g2", author: MOCK_USERS[3], content: "Ready. Social calendar is locked through the end of the month.", timestamp: "2026-05-18T09:05:00Z" },
    { id: "g3", author: MOCK_USERS[4], content: "I'll have the BTS footage edited and uploaded to assets by noon.", timestamp: "2026-05-18T09:10:00Z" },
  ],
  ch2: [
    { id: "a1", author: MOCK_USERS[1], content: "⚡ SCOPE is live. All content, approvals, and assets are now managed through this system. Welcome to high-performance peace.", timestamp: "2026-05-17T08:00:00Z" },
    { id: "a2", author: MOCK_USERS[1], content: "Reminder: all asset uploads go through the Media Vault. No more Google Drive links in DMs.", timestamp: "2026-05-18T08:00:00Z" },
  ],
  ch4: [
    { id: "e1", author: MOCK_USERS[2], content: "Ecclesiastes visualizer is fully edited. Submitting for approval now.", timestamp: "2026-05-16T14:00:00Z" },
    { id: "e2", author: MOCK_USERS[5], content: "Thumbnail variants are in assets. 3 options ready for review.", timestamp: "2026-05-17T10:00:00Z" },
  ],
  ch5: [
    { id: "p1", author: MOCK_USERS[1], content: "Press package for Mrs.Key is drafted. Sending to management for review before distribution.", timestamp: "2026-05-15T12:00:00Z" },
    { id: "p2", author: MOCK_USERS[3], content: "Two blogs confirmed for the rollout week. Coordinating interview slots.", timestamp: "2026-05-17T15:30:00Z" },
  ],
  ch6: [
    { id: "s1", author: MOCK_USERS[3], content: "Social calendar uploaded. May is fully mapped — 3 posts/week across IG, TT, YouTube.", timestamp: "2026-05-14T11:00:00Z" },
  ],
  ch7: [
    { id: "r1", author: MOCK_USERS[4], content: "Who else caught that new Kendrick drop last night 👀", timestamp: "2026-05-17T22:00:00Z" },
    { id: "r2", author: MOCK_USERS[2], content: "Been on repeat. That bridge 🙏", timestamp: "2026-05-17T22:15:00Z" },
  ],
};

export function ChannelsPageClient() {
  const [activeChannelId, setActiveChannelId] = useState("ch3");
  const [messages, setMessages] = useState(CHANNEL_MESSAGES);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = CHANNELS.find((c) => c.id === activeChannelId)!;
  const currentMessages = messages[activeChannelId] ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChannelId, messages]);

  function handleChannelSwitch(id: string) {
    setActiveChannelId(id);
    // Clear unread badge
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    const newMsg = {
      id: `new-${Date.now()}`,
      author: MOCK_USERS[1], // Tati
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] ?? []), newMsg],
    }));
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="min-h-screen">
      <TopBar title="Messages" subtitle="Team communication" />

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Channel list */}
        <aside className="hidden md:flex md:w-52 border-r border-border bg-canvas-50 flex-col flex-shrink-0">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-label">Messages</span>
            <button className="p-1 rounded hover:bg-canvas-100 transition-colors">
              <Plus className="w-3.5 h-3.5 text-ink-tertiary" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {CHANNELS.filter((c) => c.pinned).length > 0 && (
              <p className="text-label px-2 mt-1 mb-1">Pinned</p>
            )}
            {CHANNELS.map((ch) => {
              const isActive = ch.id === activeChannelId;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleChannelSwitch(ch.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-gold-50 text-gold"
                      : "text-ink-secondary hover:bg-canvas-100 hover:text-ink"
                  }`}
                >
                  {ch.type === "text" || ch.type === "announcement" ? (
                    <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 flex-shrink-0" />
                  )}
                  <span className="flex-1 text-left truncate">{ch.name}</span>
                  {ch.unread > 0 && !isActive && (
                    <span className="w-4 h-4 bg-white text-[#080808] text-2xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                      {ch.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* DMs section */}
          <div className="p-2 border-t border-border">
            <p className="text-label px-2 mb-1">Direct messages</p>
            {MOCK_USERS.slice(0, 4).map((user) => (
              <button
                key={user.id}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-ink-secondary hover:bg-canvas-100 hover:text-ink transition-colors"
              >
                <Avatar user={user} size="xs" showStatus />
                <span className="truncate">{user.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Channel header */}
          <div className="h-12 border-b border-border bg-canvas-50 px-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-ink-secondary" />
              <span className="text-sm font-semibold text-ink">{activeChannel.name}</span>
              <span className="text-xs text-ink-tertiary hidden md:block">
                {activeChannel.description}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <Bell className="w-4 h-4 text-ink-tertiary" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <Pin className="w-4 h-4 text-ink-tertiary" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <MoreHorizontal className="w-4 h-4 text-ink-tertiary" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-ink-tertiary">
                <Hash className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No messages yet in #{activeChannel.name}</p>
                <p className="text-xs mt-1">Be the first to say something.</p>
              </div>
            )}
            {currentMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 group">
                <Avatar user={msg.author} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-ink">{msg.author.name}</span>
                    <span className="text-2xs text-ink-tertiary">{formatRelativeTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-sm text-ink mt-0.5 leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-border flex-shrink-0">
            <div className="flex items-center gap-3 bg-canvas-100 border border-border rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-white/20 focus-within:border-border-strong transition-all">
              <button className="text-ink-tertiary hover:text-ink transition-colors flex-shrink-0">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message #${activeChannel.name}`}
                className="flex-1 text-sm bg-transparent outline-none text-ink placeholder:text-ink-tertiary"
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="text-ink-tertiary hover:text-ink transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSend}
                  className="w-7 h-7 bg-gold rounded-lg flex items-center justify-center hover:bg-gold-400 transition-colors disabled:opacity-40"
                  disabled={!input.trim()}
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
