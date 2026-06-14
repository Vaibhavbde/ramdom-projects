import React, { useRef, useState, useEffect } from "react";
import { FaTrophy } from "react-icons/fa6";
import SpellingApp from "./components/SpellingApp";
import ThemeToggle from "./components/ThemeToggle";
import ThemeSelector from "./components/ThemeSelector";

export default function App() {
  const [preset, setPreset] = useState<string>("default");
  const mainRef = useRef<HTMLDivElement | null>(null);

  function focusPractice() {
    // scroll to main and focus input inside SpellingApp (component exposes input by selector)
    mainRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    // small delay to let scrolling finish
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>(
        "input[placeholder='Type the word here']"
      );
      input?.focus();
    }, 450);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight">
              Spelling Bee Practice
            </h1>
            <p className="text-muted-foreground mt-1">
              Listen, spell, and grow — fun practice for ages 6–16.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSelector value={preset} onChange={setPreset} />
            <ThemeToggle preset={preset} onPresetChange={setPreset} />
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/6 to-white/3 shadow-lg transform transition-transform hover:scale-[1.01]">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 flex items-center justify-center bg-white/10 rounded-xl">
                  {/* mascot svg small */}
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="28"
                      fill="#ffd166"
                      stroke="#8b5e3c"
                      strokeWidth="2"
                    />
                    <ellipse
                      cx="60"
                      cy="60"
                      rx="18"
                      ry="12"
                      fill="#8b5e3c"
                      opacity="0.9"
                    />
                    <text
                      x="60"
                      y="68"
                      textAnchor="middle"
                      fontSize="28"
                      fontWeight="700"
                      fill="#222"
                    >
                      A
                    </text>
                  </svg>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">Ready to practice?</h2>
                  <p className="text-muted-foreground mt-2">
                    Choose a level, play the pronunciation, and type the word.
                    Immediate feedback helps learning stick.
                  </p>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={focusPractice}
                      className="kid-btn bg-accent text-white"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      Start Practice
                    </button>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(
                          "Tip: Try the Play button to hear the word first!"
                        );
                      }}
                      className="kid-btn border"
                    >
                      Quick Tips
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5 shadow-sm">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="mt-2">
                Complete daily challenges and watch your accuracy improve.
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 shadow-sm">
              <div className="text-sm text-muted-foreground">Stats</div>
              <div className="mt-2">
                <StatsCard />
              </div>
            </div>
          </aside>
        </section>

        <main ref={mainRef}>
          <SpellingApp />
        </main>
      </div>
    </div>
  );
}

function StatsCard() {
  const [stats, setStats] = useState<{
    score: number;
    attempts: number;
    wrong: number;
  }>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("spellingStats") ||
          '{"score":0,"attempts":0,"wrong":0}'
      );
    } catch {
      return { score: 0, attempts: 0, wrong: 0 };
    }
  });

  useEffect(() => {
    function onStats(e: Event) {
      const ev = e as CustomEvent<{
        score: number;
        attempts: number;
        wrong: number;
      }>;
      setStats(ev.detail || { score: 0, attempts: 0, wrong: 0 });
    }
    window.addEventListener("spelling:stats", onStats as EventListener);
    // also listen to storage in case user reloads or multiple tabs
    function onStorage() {
      try {
        const s = JSON.parse(localStorage.getItem("spellingStats") || "null");
        if (s) setStats(s);
      } catch {
        // ignore parse errors
      }
    }
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("spelling:stats", onStats as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <FaTrophy className="text-yellow-400" />
        <strong>Achievements</strong>
      </div>
      <div>
        ✅ Correct: <strong>{stats.score}</strong>
      </div>
      <div>
        ❌ Wrong: <strong>{stats.wrong}</strong>
      </div>
      <div>
        📊 Attempts: <strong>{stats.attempts}</strong>
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        Keep going — consistency beats perfection! 🌟
      </div>
    </div>
  );
}
