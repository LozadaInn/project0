export type Chord = {
  name: string;
  notes: string[];
};

export type ScaleType = "major" | "minor" | "dorian";

// Nuevos tipos para beats
export type DrumElement = "kick" | "snare" | "hihat";

export type BeatPattern = {
  name: string;
  kick: string[];   // Timing en notación Tone.js (ej: "0:0:0", "0:2:0")
  snare: string[];
  hihat: string[];
};

export type LoopItem = {
  id: string;
  chord: Chord;
};

export type DragItem =
  | {
      type: "PALETTE_CHORD";
      chord: Chord;
    }
  | {
      type: "LOOP_ITEM";
      item: LoopItem;
      index: number;
    };

export type BeatPreset = "none" | "basic" | "boomBap" | "house";