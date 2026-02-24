// components/SortableChordItem.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { LoopItem } from "../types";

type Props = {
  id: string;              // 👈 ahora viene del slot
  item: LoopItem;
  onClick: () => void;
};

export function SortableChordItem({ id, item, onClick }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#222",
    border: "1px solid #555",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "grab",
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
    >
      {item.chord.name}
    </div>
  );
}