"use client";

import { useState, useRef, useEffect } from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { Hash, Plus, Bell, Pin, MoreHorizontal, Send, Paperclip, Smile } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import type { CAAM1K_CHANNELS, CAAM1K_MESSAGES, CAAM1K_TEAM } from "@/lib/mock-artist2";

type Channel = typeof CAAM1K_CHANNELS[0];
type Message = typeof CAAM1K_MESSAGES[0];
type TeamMember = typeof CAAM1K_TEAM[0];

interface Props {
  artistName: string;
  channels: Channel[];
  initialMessages: Message[];
  team: TeamMember[];
}

export function ArtistChannelsClient({ artistName, channels, initialMessages, team }: Props) {
  const [activeChannelId, setActiveChannelId] = useState(channels[2]?.id ?? channels[0]?.id);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    [channels[2]?.id ?? channels[0]?.id]: initialMessages,
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId) ?? channels[0];
  const currentMessages = messages[activeChannelId] ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChannelId, messages]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      author: team[0],
      content: text,
      timestamp: new Date().toISOString(),
    } as Message;
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
      <TopBar title="Channels" subtitle={`${artistName} · Team communication`} />

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
            <p className="text-label px-2 mt-1 mb-1">Pinned</p>
            {channels.map((ch) => {
              const isActive = ch.id === activeChannelId;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannelId(ch.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive ? "bg-gold-50 text-gold" : "text-ink-secondary hover:bg-canvas-100 hover:text-ink"
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 flex-shrink-0" />
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

          <div className="p-2 border-t border-border">
            <p className="text-label px-2 mb-1">Direct messages</p>
            {team.map((member) => (
              <button
                key={member.id}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-ink-secondary hover:bg-canvas-100 hover:text-ink transition-colors"
              >
                <Avatar user={member} size="xs" showStatus />
                <span className="truncate">{member.displayName}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="h-12 border-b border-border bg-canvas-50 px-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-ink-secondary" />
              <span className="text-sm font-semibold text-ink">{activeChannel?.name}</span>
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-ink-tertiary">
                <Hash className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No messages yet in #{activeChannel?.name}</p>
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

          <div className="p-4 border-t border-border flex-shrink-0">
            <div className="flex items-center gap-3 bg-canvas-100 border border-border rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-white/20 focus-within:border-border-strong transition-all">
              <button className="text-ink-tertiary hover:text-ink transition-colors flex-shrink-0">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message #${activeChannel?.name}`}
                className="flex-1 text-sm bg-transparent outline-none text-ink placeholder:text-ink-tertiary"
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="text-ink-tertiary hover:text-ink transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-7 h-7 bg-gold rounded-lg flex items-center justify-center hover:bg-gold-400 transition-colors disabled:opacity-40"
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
