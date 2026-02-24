import { useState, useMemo, useEffect } from "react";
import { NOTES, getChordsForScale } from "./logic/theory";
import { getBeatPattern } from "./logic/drums";

import type { ScaleType, BeatPreset, LoopItem } from "./types";

import { togglePlay, updateProgression, updateBeat } from "./audio/audioEngine";
import { ChordGrid } from "./components/ChordGrid";
import { BeatSelector } from "./components/BeatSelector";

import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import { ChordPalette } from "./components/ChordPalette";

import { useDroppable } from "@dnd-kit/core";

const MAX_VISIBLE_SLOTS = 8;

function App() {
  const [root, setRoot] = useState("F#");
  const [scale, setScale] = useState<ScaleType>("minor");
  const [beatPreset, setBeatPreset] = useState<BeatPreset>("none");

  // 🔹 Loop con 8 slots fijos
  const [loopItems, setLoopItems] = useState<(LoopItem | undefined)[]>(
    Array(MAX_VISIBLE_SLOTS).fill(undefined)
  );

  // 🔹 Generar palette según tonalidad
  const palette = useMemo(
    () => getChordsForScale(root, scale),
    [root, scale]
  );

  // 🔹 Derivar progresión para audio engine
  const progression = loopItems
    .filter((item): item is LoopItem => Boolean(item))
    .map(item => item.chord);

  // 🔹 Actualizar audio cuando cambia el loop
  useEffect(() => {
    updateProgression(progression);
  }, [progression]);

  // 🔹 Drag & Drop handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeData = active.data.current;

    // =========================
    // DROP EN TRASH → ELIMINAR
    // =========================
    if (over?.id === "trash") {
      const index = Number(String(active.id).replace("slot-", ""));
      if (isNaN(index)) return;

      const next = [...loopItems];
      next[index] = undefined;

      setLoopItems(next);
      return;
    }

    // =========================
    // DROP desde palette
    // =========================
    if (
      activeData?.from === "palette" &&
      over?.id?.toString().startsWith("slot-")
    ) {
      const overIndex = Number(String(over.id).replace("slot-", ""));
      if (isNaN(overIndex)) return;

      const newItem: LoopItem = {
        id: crypto.randomUUID(),
        chord: activeData.chord,
      };

      const next = [...loopItems];
      next[overIndex] = newItem;

      setLoopItems(next);
      return;
    }

    // =========================
    // REORDER interno
    // =========================
    if (over?.id?.toString().startsWith("slot-")) {
      const oldIndex = Number(String(active.id).replace("slot-", ""));
      const newIndex = Number(String(over.id).replace("slot-", ""));

      if (isNaN(oldIndex) || isNaN(newIndex)) return;
      if (oldIndex === newIndex) return;

      const next = [...loopItems];

      const temp = next[oldIndex];
      next[oldIndex] = next[newIndex];
      next[newIndex] = temp;

      setLoopItems(next);
    }
  };

  // 🔹 Cambio de tonalidad
  const handleScaleConfigChange = (newRoot: string, newScale: ScaleType) => {
    setRoot(newRoot);
    setScale(newScale);

    setLoopItems(Array(MAX_VISIBLE_SLOTS).fill(undefined));
  };

  // 🔹 Cambio de batería
  const handleBeatChange = (preset: BeatPreset) => {
    setBeatPreset(preset);
    const pattern = getBeatPattern(preset);
    updateBeat(pattern);
  };

  return (
    <div
      style={{
        padding: 24,
        backgroundColor: "#121212",
        color: "white",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ margin: "0 0 16px 0", fontSize: "1.5rem" }}>
          Music Sketch
        </h1>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => togglePlay(progression)}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              backgroundColor: "#333",
              color: "white",
              border: "1px solid #555",
              borderRadius: "4px",
            }}
          >
            ▶ Play / Stop
          </button>

          <div style={{ display: "flex", gap: 8 }}>
            <select
              value={root}
              onChange={(e) =>
                handleScaleConfigChange(e.target.value, scale)
              }
              style={{
                padding: "6px",
                borderRadius: "4px",
                backgroundColor: "#333",
                color: "white",
                border: "1px solid #555",
              }}
            >
              {NOTES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <select
              value={scale}
              onChange={(e) =>
                handleScaleConfigChange(root, e.target.value as ScaleType)
              }
              style={{
                padding: "6px",
                borderRadius: "4px",
                backgroundColor: "#333",
                color: "white",
                border: "1px solid #555",
              }}
            >
              <option value="major">Mayor</option>
              <option value="minor">Menor</option>
              <option value="dorian">Dórico</option>
            </select>
          </div>

          <BeatSelector
            selected={beatPreset}
            onChange={handleBeatChange}
          />
        </div>
      </header>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <main>
          <ChordPalette palette={palette} />
          <ChordGrid
            loopItems={loopItems}
            palette={palette}
            onChange={setLoopItems}
          />
          <TrashZone />
        </main>
      </DndContext>
    </div>
  );
}

function TrashZone() {
  const { setNodeRef, isOver } = useDroppable({ id: "trash" });

  return (
    <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
      <div
        ref={setNodeRef}
        style={{
          width: 220,              // 🔹 ancho fijo controlado
          height: 48,              // 🔹 más pequeño
          borderRadius: 8,
          border: "2px dashed #aa4444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.8rem",
          letterSpacing: 1,
          backgroundColor: isOver ? "#331111" : "transparent",
          color: isOver ? "#ff6666" : "#aa4444",
          transition: "all 0.2s ease"
        }}
      >
        🗑 Eliminar
      </div>
    </div>
  );
}

export default App;