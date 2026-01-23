type Chord = {
  name: string
  notes: string[]
}

type Props = {
  progression: Chord[]
  onChange: (next: Chord[]) => void
}

const chordPalette: Chord[] = [
  { name: "F#m", notes: ["F#3", "A3", "C#4"] },
  { name: "A", notes: ["A3", "C#4", "E4"] },
  { name: "B", notes: ["B3", "D#4", "F#4"] },
  { name: "C#m", notes: ["C#4", "E4", "G#4"] }
]

export function ChordGrid({ progression, onChange }: Props) {
  const cycleChord = (index: number) => {
    const current = progression[index]
    const i = chordPalette.findIndex(c => c.name === current.name)
    const nextChord = chordPalette[(i + 1) % chordPalette.length]

    const next = [...progression]
    next[index] = nextChord
    onChange(next)
  }

  return (
    <div style={{ display: "flex", gap: 12 }}>
      {progression.map((chord, index) => (
        <div
          key={index}
          onClick={() => cycleChord(index)}
          style={{
            width: 80,
            height: 80,
            border: "2px solid #333",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          {chord.name}
        </div>
      ))}
    </div>
  )
}
