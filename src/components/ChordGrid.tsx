// components/ChordGrid.tsx
import type { Chord } from "../types"; // Importación de tipo obligatoria

type Props = {
  progression: Chord[];
  palette: Chord[]; // <--- Agregamos esto para solucionar el error
  onChange: (next: Chord[]) => void;
};

export function ChordGrid({ progression, palette, onChange }: Props) {
  
  const cycleChord = (index: number) => {
    const current = progression[index];
    
    // Buscamos el acorde actual dentro de la paleta activa
    const i = palette.findIndex(c => c.name === current.name);
    
    // Si el acorde no está en la paleta (por un cambio de escala), 
    // empezamos desde el primero. Si está, pasamos al siguiente.
    const nextChord = palette[(i + 1) % palette.length];

    const next = [...progression];
    next[index] = nextChord;
    onChange(next);
  };

  return (
    <div style={{ display: "flex", gap: 12 }}>
      {progression.map((chord, index) => (
        <div
          key={index}
          onClick={() => cycleChord(index)}
          style={{
            width: 100,
            height: 100,
            border: "2px solid #444",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            userSelect: "none",
            backgroundColor: "#222",
            transition: "all 0.1s ease"
          }}
        >
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            {chord.name}
          </span>
        </div>
      ))}
    </div>
  );
}
