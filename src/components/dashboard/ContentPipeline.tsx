"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { PLATFORM_CONFIG } from "@/lib/constants";
import { usePipelineStore } from "@/store/pipeline-store";
import type { ContentItem, ContentPhase } from "@/types";
import { Film, Camera, Layers, Image as ImageIcon, Mic, FileText } from "lucide-react";

// ─── Column definitions (4 pitch-ready columns) ───────────────────────────────

const COLUMNS: { phase: ContentPhase; label: string; color: string; dot: string }[] = [
  { phase: "EDITING",  label: "Draft",      color: "bg-canvas-200 text-ink-secondary",   dot: "bg-ink-tertiary" },
  { phase: "REVIEW",   label: "In Review",  color: "bg-sky-100 text-sky-600",             dot: "bg-sky-500" },
  { phase: "APPROVED", label: "Approved",   color: "bg-emerald-100 text-emerald-600",     dot: "bg-emerald-500" },
  { phase: "SCHEDULED",label: "Published",  color: "bg-gold-100 text-gold",               dot: "bg-gold" },
];

// Items in other phases (IDEA, PLANNING, PRODUCTION, POSTED) fall into nearest column
function normalizePhase(phase: ContentPhase): ContentPhase {
  const map: Partial<Record<ContentPhase, ContentPhase>> = {
    IDEA:       "EDITING",
    PLANNING:   "EDITING",
    PRODUCTION: "EDITING",
    POSTED:     "SCHEDULED",
  };
  return map[phase] ?? phase;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<string, React.ReactNode> = {
  VIDEO:    <Film className="w-3.5 h-3.5" />,
  REEL:     <Film className="w-3.5 h-3.5" />,
  SHORT:    <Film className="w-3.5 h-3.5" />,
  PHOTO:    <Camera className="w-3.5 h-3.5" />,
  CAROUSEL: <Layers className="w-3.5 h-3.5" />,
  STORY:    <ImageIcon className="w-3.5 h-3.5" />,
  PODCAST:  <Mic className="w-3.5 h-3.5" />,
  BLOG:     <FileText className="w-3.5 h-3.5" />,
};

// ─── Card (draggable) ─────────────────────────────────────────────────────────

function DraggableCard({ item, overlay = false }: { item: ContentItem; overlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-canvas-100 border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing transition-shadow select-none",
        isDragging && !overlay && "opacity-40 border-border-strong",
        overlay && "shadow-2xl rotate-1 border-border-strong bg-canvas-50 cursor-grabbing",
      )}
    >
      <div className="flex items-start gap-2">
        <span className="text-ink-tertiary mt-0.5 flex-shrink-0">
          {TYPE_ICONS[item.type] ?? <Film className="w-3.5 h-3.5" />}
        </span>
        <p className="text-xs font-semibold text-ink leading-snug line-clamp-2 flex-1">
          {item.title}
        </p>
      </div>

      <div className="flex items-center gap-1 mt-2 flex-wrap">
        {item.platforms.slice(0, 3).map((p) => {
          const cfg = PLATFORM_CONFIG[p as keyof typeof PLATFORM_CONFIG];
          return (
            <span key={p} className="text-2xs px-1.5 py-0.5 rounded-full bg-canvas-200 text-ink-tertiary">
              {cfg?.label ?? p}
            </span>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-2.5">
        {item.assignee ? (
          <Avatar user={item.assignee} size="xs" />
        ) : (
          <div className="w-5 h-5 rounded-full border border-dashed border-border" />
        )}
        {item.scheduledAt && (
          <span className="text-2xs text-ink-tertiary">
            {new Date(item.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Column (droppable) ───────────────────────────────────────────────────────

function DroppableColumn({
  phase, label, color, dot, items, isOver,
}: {
  phase: ContentPhase;
  label: string;
  color: string;
  dot: string;
  items: ContentItem[];
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: phase });

  return (
    <div className="w-52 flex-shrink-0 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
          <span className={cn("text-2xs font-bold px-2 py-0.5 rounded-full", color)}>
            {label}
          </span>
        </div>
        <span className="text-2xs text-ink-tertiary font-semibold">{items.length}</span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 min-h-[120px] rounded-xl p-2 space-y-2 transition-colors",
          isOver
            ? "bg-gold/8 border border-dashed border-gold/40"
            : "bg-canvas-50 border border-transparent",
        )}
      >
        {items.length === 0 && !isOver && (
          <div className="h-16 flex items-center justify-center">
            <span className="text-2xs text-ink-tertiary">Drop here</span>
          </div>
        )}
        {items.map((item) => (
          <DraggableCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

// ─── Board ────────────────────────────────────────────────────────────────────

export function ContentPipeline() {
  const { items, moveItem } = usePipelineStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<ContentPhase | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    setOverId(event.over ? (String(event.over.id) as ContentPhase) : null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    if (over && active.id !== over.id) {
      const targetPhase = over.id as ContentPhase;
      // Only move if dropped on a column (not another card)
      if (COLUMNS.some((c) => c.phase === targetPhase)) {
        moveItem(String(active.id), targetPhase);
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto">
        <div className="flex gap-3 pb-2 min-w-max">
          {COLUMNS.map(({ phase, label, color, dot }) => {
            const colItems = items.filter((i) => normalizePhase(i.phase) === phase);
            return (
              <DroppableColumn
                key={phase}
                phase={phase}
                label={label}
                color={color}
                dot={dot}
                items={colItems}
                isOver={overId === phase}
              />
            );
          })}
        </div>
      </div>

      {/* Drag overlay — follows the cursor */}
      <DragOverlay dropAnimation={null}>
        {activeItem ? <DraggableCard item={activeItem} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
