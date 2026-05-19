import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { MOCK_USERS } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";
import { Hash, Volume2, Plus, Bell, Pin, MoreHorizontal, Send, Paperclip, Smile } from "lucide-react";

export const metadata: Metadata = { title: "Channels" };

const CHANNELS = [
  { id: "ch1", name: "general", type: "text", unread: 0, pinned: true },
  { id: "ch2", name: "announcements", type: "announcement", unread: 1, pinned: true },
  { id: "ch3", name: "mrskey-rollout", type: "text", unread: 3, pinned: false },
  { id: "ch4", name: "ecclesiastes-push", type: "text", unread: 0, pinned: false },
  { id: "ch5", name: "press-push", type: "text", unread: 2, pinned: false },
  { id: "ch6", name: "social-scheduling", type: "text", unread: 0, pinned: false },
  { id: "ch7", name: "random", type: "text", unread: 0, pinned: false },
];

const MOCK_MESSAGES = [
  {
    id: "m1",
    author: MOCK_USERS[1],
    content: "Hey team — Mrs.Key merch mockups are ready for artist approval. Amara, can you submit through the approval queue?",
    timestamp: "2026-05-18T10:28:00Z",
  },
  {
    id: "m2",
    author: MOCK_USERS[5],
    content: "On it! Just submitted — should be in the queue now.",
    timestamp: "2026-05-18T10:32:00Z",
  },
  {
    id: "m3",
    author: MOCK_USERS[0],
    content: "Saw it. Clean work. Reviewing now — will have notes or approval back within the hour.",
    timestamp: "2026-05-18T10:45:00Z",
  },
  {
    id: "m4",
    author: MOCK_USERS[2],
    content: "Also dropping the '3 AM' visualizer v2 into assets now — cutting the 30s TikTok edit next.",
    timestamp: "2026-05-18T11:00:00Z",
  },
  {
    id: "m5",
    author: MOCK_USERS[2],
    content: "30s cut done and uploaded. 15s version will be ready EOD.",
    timestamp: "2026-05-18T11:48:00Z",
  },
];

export default function ChannelsPage() {
  const activeChannel = CHANNELS[2]; // #mrskey-rollout

  return (
    <div className="min-h-screen">
      <TopBar title="Channels" subtitle="Team communication" />

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Channel list */}
        <aside className="w-52 border-r border-border bg-canvas-50 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-label">Channels</span>
            <button className="p-1 rounded hover:bg-canvas-100 transition-colors">
              <Plus className="w-3.5 h-3.5 text-ink-tertiary" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {CHANNELS.filter((c) => c.pinned).length > 0 && (
              <p className="text-label px-2 mt-1 mb-1">Pinned</p>
            )}
            {CHANNELS.map((ch) => {
              const isActive = ch.id === activeChannel.id;
              return (
                <button
                  key={ch.id}
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
                  {ch.unread > 0 && (
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
                Mrs.Key album rollout channel
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
            {MOCK_MESSAGES.map((msg) => (
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
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-border flex-shrink-0">
            <div className="flex items-center gap-3 bg-canvas-100 border border-border rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-white/20 focus-within:border-border-strong transition-all">
              <button className="text-ink-tertiary hover:text-ink transition-colors flex-shrink-0">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                placeholder={`Message #${activeChannel.name}`}
                className="flex-1 text-sm bg-transparent outline-none text-ink placeholder:text-ink-tertiary"
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="text-ink-tertiary hover:text-ink transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
                <button className="w-7 h-7 bg-gold rounded-lg flex items-center justify-center hover:bg-gold-400 transition-colors">
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
