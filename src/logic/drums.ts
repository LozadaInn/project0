import type { BeatPattern, BeatPreset } from "../types";

/**
 * Patrones de batería predefinidos
 * Notación Tone.js: "bar:quarter:sixteenth"
 * - "0:0:0" = tiempo 1
 * - "0:1:0" = tiempo 2
 * - "0:2:0" = tiempo 3
 * - "0:3:0" = tiempo 4
 * - "0:0:2" = offbeat del tiempo 1 (corchea)
 */

export const BEAT_PATTERNS: Record<BeatPreset, BeatPattern | null> = {
  none: null,
  
  // Basic Rock/Pop (Four on the floor variant)
  // Kick en 1 y 3, Snare en 2 y 4, Hi-hat en todas las negras
  basic: {
    name: "Basic Rock",
    kick: ["0:0:0", "0:2:0"],
    snare: ["0:1:0", "0:3:0"],
    hihat: ["0:0:0", "0:1:0", "0:2:0", "0:3:0"]
  },
  
  // Boom Bap (Hip-Hop clásico)
  // Kick en 1 y "y" del 2, Snare en 2 y 4, Hi-hat en offbeats
  boomBap: {
    name: "Boom Bap",
    kick: ["0:0:0", "0:1:2"],
    snare: ["0:1:0", "0:3:0"],
    hihat: ["0:0:2", "0:1:2", "0:2:2", "0:3:2"]
  },
  
  // House (Dance music)
  // Kick en todos los tiempos (four on the floor real), Snare en 2 y 4, Hi-hat en 8vos
  house: {
    name: "House",
    kick: ["0:0:0", "0:1:0", "0:2:0", "0:3:0"],
    snare: ["0:1:0", "0:3:0"],
    hihat: ["0:0:0", "0:0:2", "0:1:0", "0:1:2", "0:2:0", "0:2:2", "0:3:0", "0:3:2"]
  }
};

export function getBeatPattern(preset: BeatPreset): BeatPattern | null {
  return BEAT_PATTERNS[preset];
}