const PRESETS = [
  { id: "default", label: "Default" },
  { id: "sunny", label: "Sunny" },
  { id: "ocean", label: "Ocean" },
  { id: "forest", label: "Forest" },
  { id: "candy", label: "Candy" },
];

type Props = {
  value: string;
  onChange: (themeId: string) => void;
};

export default function ThemeSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 items-center">
      {PRESETS.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`p-2 rounded-md border ${
            value === p.id ? "ring-2 ring-offset-1" : ""
          }`}
          aria-pressed={value === p.id}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
