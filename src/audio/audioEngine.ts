import * as Tone from "tone"

type Chord = {
  name?: string
  notes: string[]
}

let isPlaying = false
let synth: Tone.PolySynth | null = null
let part: Tone.Part | null = null
let currentProgression: Chord[] = []

/**
 * Crea un Tone.Part con loop infinito
 * 1 acorde = 1 compás
 */
function createPart(progression: Chord[]) {
  const events = progression.map((chord, index) => ({
    time: `${index}m`,
    notes: chord.notes
  }))

  const p = new Tone.Part((time, value) => {
    synth!.triggerAttackRelease(value.notes, "1m", time)
  }, events)

  p.loop = true
  p.loopEnd = `${progression.length}m`

  return p
}

/**
 * Play / Stop
 * Siempre reinicia el loop
 */
export async function togglePlay(progression: Chord[]) {
  const transport = Tone.getTransport()

  if (isPlaying) {
    transport.stop()
    transport.cancel()
    part?.dispose()
    part = null
    isPlaying = false
    return
  }

  await Tone.start()

  synth?.dispose()
  synth = new Tone.PolySynth(Tone.Synth).toDestination()

  transport.cancel()

  currentProgression = progression
  part = createPart(progression)
  part.start(0)

  transport.start()
  isPlaying = true
}

/**
 * Actualiza la progresión sin detener el loop
 * El cambio entra en el siguiente ciclo
 */
export function updateProgression(progression: Chord[]) {
  currentProgression = progression

  if (!isPlaying || !part) return

  const transport = Tone.getTransport()

  // Duración del loop en segundos
  const loopDuration = Tone.Time(part.loopEnd!).toSeconds()

  const now = transport.seconds
  const nextCycle =
    Math.ceil(now / loopDuration) * loopDuration
  const oldPart = part
  const newPart = createPart(progression)
  newPart.start(nextCycle)

  oldPart.stop(nextCycle)
  transport.scheduleOnce(() => {
    oldPart.dispose()
  }, nextCycle + 0.001)

  
  part = newPart
}
