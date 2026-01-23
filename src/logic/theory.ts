export type ScaleType = "major" | "minor" | "dorian";

// NOTAS: las 12 notas cromáticas usadas como referencia (índices 0–11).
export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// CHORD_PATTERNS: para cada tipo de escala define la "calidad" de los acordes
// en cada grado de la escala ("" = mayor, "m" = menor, "dim" = disminuido).
const CHORD_PATTERNS: Record<ScaleType, string[]> = {
  major: ["", "m", "m", "", "", "m", "dim"],
  minor: ["m", "dim", "", "m", "m", "", ""],
  dorian: ["m", "m", "", "", "m", "dim", ""]
};

// getChordsForScale:
//  - root: nombre de la tónica (ej. "C")
//  - type: tipo de escala ("major" | "minor" | "dorian")
// Devuelve un array de acordes (nombre y notas de la tríada) para cada grado.
export function getChordsForScale(root: string, type: ScaleType) {
  // Índice de la tónica dentro de NOTES
  const rootIdx = NOTES.indexOf(root);

  // INTERVALOS: semitonos desde la tónica a cada grado según la escala.
  // Ej: major -> 0 (I), 2 (II), 4 (III), 5 (IV), 7 (V), 9 (VI), 11 (VII)
  const intervals = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10]
  }[type];

  // Patrón de calidades para el tipo de escala seleccionado
  const pattern = CHORD_PATTERNS[type];

  // Para cada grado construimos el acorde (tríada)
  return intervals.map((interval, i) => {
    // Calculamos la nota raíz del grado (circular usando % 12)
    const noteIdx = (rootIdx + interval) % 12;
    const noteName = NOTES[noteIdx];

    // Calidad del acorde en este grado (ej. "", "m", "dim")
    const quality = pattern[i];
    
    // Flags para decidir intervalos de la tríada:
    // - Tercera: mayor = 4 semitonos, menor = 3
    // - Quinta: perfecta = 7 semitonos, disminuida = 6
    const isMinor = quality === "m" || quality === "dim";
    const isDim = quality === "dim";
    
    return {
      // Nombre del acorde (ej. "C", "Dm", "Bdim")
      name: `${noteName}${quality}`,
      // Notación simplificada de las tres notas (Tónica, Tercera, Quinta)
      // Se usan octavas fijas ("3" para la tónica, "4" para terc/quinta) solo
      // por claridad/consistencia en la representación
      notes: [
        `${noteName}3`, 
        // Tercera: +3 semitonos si es menor/disminuida, +4 si es mayor
        `${NOTES[(noteIdx + (isMinor ? 3 : 4)) % 12]}4`,
        // Quinta: +6 si disminuida, +7 si perfecta
        `${NOTES[(noteIdx + (isDim ? 6 : 7)) % 12]}4`
      ]
    };
  });
}