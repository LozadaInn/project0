import type { Chord } from "../types";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  palette: Chord[];
};

function DraggableChord({ chord }: { chord: Chord }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${chord.name}`,
    data: {
      from: "palette",
      chord
    }
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    padding: "12px 16px",
    backgroundColor: "#222",
    border: "1px solid #555",
    borderRadius: "6px",
    cursor: "grab",
    userSelect: "none" as const
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {chord.name}
    </div>
  );
}

export function ChordPalette({ palette }: Props) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
      {palette.map((chord) => (
        <DraggableChord key={chord.name} chord={chord} />
      ))}
    </div>
  );
}