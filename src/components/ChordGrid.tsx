// components/ChordGrid.tsx
import type { Chord, LoopItem } from "../types";
import { SortableChordItem } from "./SortableChordItem";
import { useDroppable } from "@dnd-kit/core";

import {
  SortableContext,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable";

type Props = {
  loopItems: LoopItem[];
  palette: Chord[];
  onChange: (next: LoopItem[]) => void;
};

const MAX_VISIBLE_SLOTS = 8;

export function ChordGrid({ loopItems, palette, onChange }: Props) {

  // 🔹 IDs fijos para los 8 slots
  const slotIds = Array.from({ length: MAX_VISIBLE_SLOTS }).map(
    (_, i) => `slot-${i}`
  );

  const cycleChord = (index: number) => {
    const currentItem = loopItems[index];
    if (!currentItem || !palette.length) return;

    const i = palette.findIndex(c => c.name === currentItem.chord.name);
    const nextChord = palette[(i + 1) % palette.length];

    const next = [...loopItems];
    next[index] = {
      ...currentItem,
      chord: nextChord,
    };

    onChange(next);
  };

  return (
    <SortableContext
      items={slotIds}
      strategy={horizontalListSortingStrategy}
    >
      <div style={{ display: "flex", gap: 12 }}>
        {slotIds.map((slotId, index) => {
          const item = loopItems[index];

          if (item) {
            return (
              <SortableChordItem
                key={slotId}
                id={slotId}
                item={item}
                onClick={() => cycleChord(index)}
              />
            );
          }

          return <EmptySlot key={slotId} id={slotId} />;
        })}
      </div>
    </SortableContext>
  );
}

/**
 * Slot vacío droppable
 */
function EmptySlot({ id }: { id: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 80,
        height: 60,
        border: "1px dashed #444",
        borderRadius: 8,
        opacity: 0.4,
        backgroundColor: isOver ? "#333" : "transparent",
        transition: "background-color 0.15s ease"
      }}
    />
  );
}