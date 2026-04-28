"use client";

import { useEffect, useState } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, ExternalLink, EyeOff, Eye } from "lucide-react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  order: number;
  type: string;
  language: string;
  xpReward: number;
  isPublished?: boolean;
}

interface Props {
  courseId: string;
  lessons: Lesson[];
  onReorder: (next: Lesson[]) => void;
  onDelete: (lesson: Lesson) => void;
}

export function LessonListSortable({ courseId, lessons, onReorder, onDelete }: Props) {
  const [items, setItems] = useState<Lesson[]>(lessons);
  useEffect(() => { setItems(lessons); }, [lessons]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((l) => l.id === active.id);
    const newIndex = items.findIndex((l) => l.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const moved = arrayMove(items, oldIndex, newIndex).map((l, i) => ({ ...l, order: i + 1 }));
    setItems(moved);
    onReorder(moved);

    // Persist
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: moved.map((l) => ({ id: l.id, order: l.order })) }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Roll back on failure
      setItems(items);
      onReorder(items);
      alert("Не удалось сохранить порядок");
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {items.map((l) => (
            <SortableRow key={l.id} courseId={courseId} lesson={l} onDelete={() => onDelete(l)} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ courseId, lesson, onDelete }: { courseId: string; lesson: Lesson; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lesson.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isPublished = lesson.isPublished ?? true;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-3 py-2.5 bg-[#0F1011] border-2 border-white/[0.07] hover:border-white/[0.12]"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        title="Перетащить"
        className="text-white/30 hover:text-white/70 cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </button>

      <span className="font-mono text-[11px] text-white/30 tabular-nums w-8">
        {String(lesson.order).padStart(2, "0")}
      </span>

      <Link
        href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
        className="flex-1 min-w-0 text-white/85 text-[13px] truncate hover:text-[#10B981]"
      >
        {lesson.title}
      </Link>

      <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.1em] hidden md:inline">
        {lesson.type}
      </span>
      <span className="font-mono text-[10px] text-white/40 hidden md:inline">
        {lesson.language}
      </span>
      <span className="font-mono text-[10px] text-[#10B981]/80 tabular-nums">
        {lesson.xpReward} XP
      </span>

      <span
        className="font-mono text-[9px] px-1.5 py-0.5 border"
        style={{
          letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700,
          color: isPublished ? "#10B981" : "rgba(255,255,255,0.4)",
          borderColor: isPublished ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)",
        }}
        title={isPublished ? "Опубликован" : "Черновик"}
      >
        {isPublished ? <Eye size={10} className="inline" /> : <EyeOff size={10} className="inline" />}
      </span>

      <Link
        href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
        className="size-7 grid place-items-center text-white/40 hover:text-white"
        title="Открыть редактор"
      >
        <ExternalLink size={13} />
      </Link>

      <button
        type="button"
        onClick={onDelete}
        className="size-7 grid place-items-center text-white/40 hover:text-red-400"
        title="Удалить"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
