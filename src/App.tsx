import { useState, useMemo } from "react";
// 1. Importar lógica musical
import { NOTES, getChordsForScale } from "./logic/theory";
import type { ScaleType, Chord } from "./types";

// 2. Importar motor de audio y componentes
import { togglePlay, updateProgression } from "./audio/audioEngine";
import { ChordGrid } from "./components/ChordGrid";

function App() {
  // Configuración de la escala
  const [root, setRoot] = useState("F#");
  const [scale, setScale] = useState<ScaleType>("minor");

  // Generamos la paleta de acordes basada en la selección
  const palette = useMemo(() => getChordsForScale(root, scale), [root, scale]);

  // 3. ESTADO DE LA PROGRESIÓN (Faltaba en tu código)
  // Inicializamos con 4 compases usando el primer acorde de la paleta
  const [progression, setProgression] = useState<Chord[]>(() => 
    Array(4).fill(palette[0])
  );

  // Sincronizar la progresión cuando la raíz o el modo cambian
  const handleScaleConfigChange = (newRoot: string, newScale: ScaleType) => {
    setRoot(newRoot);
    setScale(newScale);
    
    const newPalette = getChordsForScale(newRoot, newScale);
    const newProg = Array(4).fill(newPalette[0]); 
    
    setProgression(newProg);
    updateProgression(newProg); // Notifica al motor de audio
  };

  const handleGridChange = (next: Chord[]) => {
    setProgression(next);
    updateProgression(next);
  };

  return (
    <div style={{ 
      padding: 24, 
      backgroundColor: "#121212", // Un poco más oscuro para vibe de estudio
      color: "white", 
      minHeight: "100vh",
      fontFamily: "sans-serif" 
    }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ margin: "0 0 16px 0", fontSize: "1.5rem" }}>Music Sketch</h1>
        
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
              style={{ padding: "6px", borderRadius: "4px" }}
            >
              {NOTES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>

            <select 
              value={scale} 
              onChange={(e) => handleScaleConfigChange(root, e.target.value as ScaleType)}
              style={{ padding: "6px", borderRadius: "4px" }}
            >
              <option value="major">Mayor</option>
              <option value="minor">Menor</option>
              <option value="dorian">Dórico</option>
            </select>
          </div>
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
