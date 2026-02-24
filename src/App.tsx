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

function App() {
  const [root, setRoot] = useState("F#");
  const [scale, setScale] = useState<ScaleType>("minor");
  const [beatPreset, setBeatPreset] = useState<BeatPreset>("none");

  // 🔹 Loop empieza vacío
  const [loopItems, setLoopItems] = useState<LoopItem[]>([]);

  // 🔹 Generar palette según tonalidad
  const palette = useMemo(
    () => getChordsForScale(root, scale),
    [root, scale]
  );

  // 🔹 Derivar progresión para audio engine
  const progression = loopItems
    .filter(Boolean)
    .map(item => item.chord);

  // 🔹 Actualizar audio cuando cambia el loop
  useEffect(() => {
    updateProgression(progression);
  }, [progression]);

  // 🔹 Drag & Drop handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;

    // =========================
    // DROP desde palette
    // =========================
    if (activeData?.from === "palette") {
      const overIndex = Number(String(over.id).replace("slot-", ""));
      if (isNaN(overIndex)) return;

      const chord = activeData.chord;

      const newItem: LoopItem = {
        id: crypto.randomUUID(),
        chord
      };

      const next = [...loopItems];
      next[overIndex] = newItem;

      setLoopItems(next);
      return;
    }

    // =========================
    // REORDER interno
    // =========================
    const oldIndex = Number(String(active.id).replace("slot-", ""));
    const newIndex = Number(String(over.id).replace("slot-", ""));

    if (isNaN(oldIndex) || isNaN(newIndex)) return;
    if (oldIndex === newIndex) return;

    const next = [...loopItems];

    const temp = next[oldIndex];
    next[oldIndex] = next[newIndex];
    next[newIndex] = temp;

    setLoopItems(next);
  };

  // 🔹 Cambio de tonalidad
  const handleScaleConfigChange = (newRoot: string, newScale: ScaleType) => {
    setRoot(newRoot);
    setScale(newScale);

    // No autogenerar acordes
    setLoopItems([]);
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
        fontFamily: "sans-serif"
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
            flexWrap: "wrap"
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
              borderRadius: "4px"
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
                border: "1px solid #555"
              }}
            >
              {NOTES.map(n => (
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
                border: "1px solid #555"
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
        </main>
      </DndContext>
    </div>
  );
}

export default App;