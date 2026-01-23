import { useState, useMemo } from "react";
import { NOTES, getChordsForScale } from "./logic/theory";
import { getBeatPattern } from "./logic/drums";
import type { ScaleType, Chord, BeatPreset } from "./types";

import { togglePlay, updateProgression, updateBeat } from "./audio/audioEngine";
import { ChordGrid } from "./components/ChordGrid";
import { BeatSelector } from "./components/BeatSelector";

function App() {
  const [root, setRoot] = useState("F#");
  const [scale, setScale] = useState<ScaleType>("minor");
  const [beatPreset, setBeatPreset] = useState<BeatPreset>("none");

  const palette = useMemo(() => getChordsForScale(root, scale), [root, scale]);

  const [progression, setProgression] = useState<Chord[]>(() => 
    Array(4).fill(palette[0])
  );

  const handleScaleConfigChange = (newRoot: string, newScale: ScaleType) => {
    setRoot(newRoot);
    setScale(newScale);
    
    const newPalette = getChordsForScale(newRoot, newScale);
    const newProg = Array(4).fill(newPalette[0]); 
    
    setProgression(newProg);
    updateProgression(newProg);
  };

  const handleGridChange = (next: Chord[]) => {
    setProgression(next);
    updateProgression(next);
  };

  const handleBeatChange = (preset: BeatPreset) => {
    setBeatPreset(preset);
    const pattern = getBeatPattern(preset);
    updateBeat(pattern);
  };

  return (
    <div style={{ 
      padding: 24, 
      backgroundColor: "#121212",
      color: "white", 
      minHeight: "100vh",
      fontFamily: "sans-serif" 
    }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ margin: "0 0 16px 0", fontSize: "1.5rem" }}>Music Sketch</h1>
        
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
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
              onChange={(e) => handleScaleConfigChange(e.target.value, scale)}
              style={{ 
                padding: "6px", 
                borderRadius: "4px",
                backgroundColor: "#333",
                color: "white",
                border: "1px solid #555"
              }}
            >
              {NOTES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>

            <select 
              value={scale} 
              onChange={(e) => handleScaleConfigChange(root, e.target.value as ScaleType)}
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

          <BeatSelector selected={beatPreset} onChange={handleBeatChange} />
        </div>
      </header>

      <main>
        <ChordGrid 
          progression={progression} 
          palette={palette} 
          onChange={handleGridChange} 
        />
      </main>
    </div>
  );
}

export default App;