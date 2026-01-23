import * as Tone from "tone";
import type { BeatPattern } from "../types";

type Chord = {
  name?: string;
  notes: string[];
};

let isPlaying = false;
let synth: Tone.PolySynth | null = null;
let part: Tone.Part | null = null;
let drumPart: Tone.Part | null = null;
let currentProgression: Chord[] = [];
let currentBeat: BeatPattern | null = null;

// Drum samples (sintetizados)
let kick: Tone.MembraneSynth | null = null;
let snare: Tone.NoiseSynth | null = null;
let hihat: Tone.MetalSynth | null = null;

/**
 * Inicializa los instrumentos de batería
 */
function initDrums() {
  kick?.dispose();
  snare?.dispose();
  hihat?.dispose();

  kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 6,
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
  }).toDestination();

  snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
  }).toDestination();

  hihat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
  }).toDestination();
  
  hihat.volume.value = -12; // Hi-hat más suave
}

/**
 * Crea un Tone.Part para el loop de batería
 */
function createDrumPart(pattern: BeatPattern) {
  const events: Array<{ time: string; instrument: "kick" | "snare" | "hihat" }> = [];

  pattern.kick.forEach(time => events.push({ time, instrument: "kick" }));
  pattern.snare.forEach(time => events.push({ time, instrument: "snare" }));
  pattern.hihat.forEach(time => events.push({ time, instrument: "hihat" }));

  const p = new Tone.Part((time, value) => {
    if (value.instrument === "kick") kick?.triggerAttackRelease("C1", "8n", time);
    if (value.instrument === "snare") snare?.triggerAttackRelease("8n", time);
    if (value.instrument === "hihat") hihat?.triggerAttackRelease("16n", time);
  }, events);

  p.loop = true;
  p.loopEnd = "1m"; // La batería loop cada compás

  return p;
}

/**
 * Crea un Tone.Part con loop infinito para acordes
 * 1 acorde = 1 compás
 */
function createPart(progression: Chord[]) {
  const events = progression.map((chord, index) => ({
    time: `${index}m`,
    notes: chord.notes
  }));

  const p = new Tone.Part((time, value) => {
    synth!.triggerAttackRelease(value.notes, "1m", time);
  }, events);

  p.loop = true;
  p.loopEnd = `${progression.length}m`;

  return p;
}

/**
 * Play / Stop
 * Siempre reinicia el loop
 */
export async function togglePlay(progression: Chord[]) {
  const transport = Tone.getTransport();

  if (isPlaying) {
    transport.stop();
    transport.cancel();
    part?.dispose();
    drumPart?.dispose();
    part = null;
    drumPart = null;
    isPlaying = false;
    return;
  }

  await Tone.start();

  synth?.dispose();
  synth = new Tone.PolySynth(Tone.Synth).toDestination();

  initDrums();

  transport.cancel();

  currentProgression = progression;
  part = createPart(progression);
  part.start(0);

  // Iniciar batería si hay un patrón seleccionado
  if (currentBeat) {
    drumPart = createDrumPart(currentBeat);
    drumPart.start(0);
  }

  transport.start();
  isPlaying = true;
}

/**
 * Actualiza la progresión sin detener el loop
 * El cambio entra en el siguiente ciclo
 */
export function updateProgression(progression: Chord[]) {
  currentProgression = progression;

  if (!isPlaying || !part) return;

  const transport = Tone.getTransport();

  const loopDuration = Tone.Time(part.loopEnd!).toSeconds();
  const now = transport.seconds;
  const nextCycle = Math.ceil(now / loopDuration) * loopDuration;

  const oldPart = part;
  const newPart = createPart(progression);
  newPart.start(nextCycle);

  oldPart.stop(nextCycle);
  transport.scheduleOnce(() => {
    oldPart.dispose();
  }, nextCycle + 0.001);

  part = newPart;
}

/**
 * Actualiza el patrón de batería
 * Si está sonando, aplica el cambio en el siguiente compás
 */
export function updateBeat(pattern: BeatPattern | null) {
  currentBeat = pattern;

  if (!isPlaying) return;

  const transport = Tone.getTransport();

  // Detener batería anterior
  if (drumPart) {
    const nextBar = Math.ceil(transport.seconds / Tone.Time("1m").toSeconds()) * Tone.Time("1m").toSeconds();
    drumPart.stop(nextBar);
    
    transport.scheduleOnce(() => {
      drumPart?.dispose();
      drumPart = null;
    }, nextBar + 0.001);
  }

  // Iniciar nueva batería si hay patrón
  if (pattern) {
    const nextBar = Math.ceil(transport.seconds / Tone.Time("1m").toSeconds()) * Tone.Time("1m").toSeconds();
    const newDrumPart = createDrumPart(pattern);
    newDrumPart.start(nextBar);
    drumPart = newDrumPart;
  }
}