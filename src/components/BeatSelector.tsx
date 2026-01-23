import type { BeatPreset } from "../types";

type Props = {
  selected: BeatPreset;
  onChange: (preset: BeatPreset) => void;
};

// Beat options para mostrarle al user 
const BEAT_OPTIONS: Array<{ value: BeatPreset; label: string }> = [
  { value: "none", label: "Sin beat" },
  { value: "basic", label: "Basic Rock" },
  { value: "boomBap", label: "Boom Bap" },
  { value: "house", label: "House" }
];

export function BeatSelector({ selected, onChange }: Props) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: "0.9rem", color: "#aaa" }}>Beat:</span>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value as BeatPreset)}
        style={{
          padding: "6px 12px",
          borderRadius: "4px",
          backgroundColor: "#333",
          color: "white",
          border: "1px solid #555",
          cursor: "pointer"
        }}
      >
        {BEAT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}