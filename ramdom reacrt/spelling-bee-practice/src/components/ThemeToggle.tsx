import { useEffect } from "react";

type Props = {
  preset?: string;
  onPresetChange?: (presetId: string) => void;
};

export default function ThemeToggle({ preset, onPresetChange }: Props) {
  useEffect(() => {
    if (preset) {
      // apply theme preset class
      document.documentElement.classList.remove(
        "theme-sunny",
        "theme-ocean",
        "theme-forest",
        "theme-candy"
      );
      if (preset !== "default")
        document.documentElement.classList.add(`theme-${preset}`);
    }
  }, [preset]);

  return (
    <div className="flex gap-2 items-center">
      {/* sun/moon toggle removed per request */}
      {onPresetChange ? (
        <button
          onClick={() => onPresetChange("default")}
          className="p-2 rounded-md border"
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}
