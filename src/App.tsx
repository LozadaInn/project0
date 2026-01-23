import { useState } from "react"
import {
  togglePlay,
  updateProgression
} from "./audio/audioEngine"
import { ChordGrid } from "./components/ChordGrid"

type Chord = {
  name: string
  notes: string[]
}

const initialProgression: Chord[] = [
  { name: "F#m", notes: ["F#3", "A3", "C#4"] },
  { name: "A", notes: ["A3", "C#4", "E4"] },
  { name: "B", notes: ["B3", "D#4", "F#4"] },
  { name: "A", notes: ["A3", "C#4", "E4"] }
]

function App() {
  const [progression, setProgression] =
    useState<Chord[]>(initialProgression)

  const handleGridChange = (next: Chord[]) => {
    setProgression(next)
    updateProgression(next)
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Music Sketch</h1>

      <button
        onClick={() => togglePlay(progression)}
        style={{ marginBottom: 20 }}
      >
        ▶ Play / Stop
      </button>

      <ChordGrid
        progression={progression}
        onChange={handleGridChange}
      />
    </div>
  )
}

export default App
