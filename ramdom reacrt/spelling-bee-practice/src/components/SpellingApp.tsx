import React, { useEffect, useState } from "react";
import type { WordEntry, Difficulty } from "../types";

// helper to load all word files dynamically
async function loadAllWords(): Promise<WordEntry[]> {
  const modules = import.meta.glob("../words/*.json");
  const entries: WordEntry[] = [];
  for (const path in modules) {
    const mod = await (modules[path]() as Promise<{ default: WordEntry[] }>);
    entries.push(...mod.default);
  }
  return entries;
}

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SpellingApp() {
  const [allWords, setAllWords] = useState<WordEntry[]>([]);
  const [current, setCurrent] = useState<WordEntry | null>(null);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");

  useEffect(() => {
    loadAllWords().then((w) => setAllWords(w));
  }, []);

  // categories removed per UX request — no category filter

  useEffect(() => {
    if (allWords.length && !current) nextWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allWords]);

  function nextWord() {
    const pool = allWords.filter((w) =>
      difficulty === "all" ? true : w.difficulty === difficulty
    );
    if (!pool.length) return;
    // avoid duplicates within session using sessionStorage
    const seen = new Set(JSON.parse(sessionStorage.getItem("seen") || "[]"));
    const available = pool.filter((w) => !seen.has(w.id));
    const pick = available.length ? pickRandom(available) : pickRandom(pool);
    setCurrent(pick);
    setInput("");
    setMessage(null);
    setAnswered(false);
  }

  function submit() {
    if (!current) return;
    // prevent double submits for the same word
    if (answered) return;
    const correct = current.word.toLowerCase() === input.trim().toLowerCase();

    // compute new values so we can persist and notify immediately
    const newAttempts = attempts + 1;
    const newScore = correct ? score + 1 : score;

    setAttempts(newAttempts);
    if (correct) {
      setScore(newScore);
      setMessage("Correct!");
    } else {
      setMessage(`Incorrect — correct: ${current.word}`);
    }

    // mark that this word has been answered so repeated submits don't change stats
    setAnswered(true);

    // mark seen
    const seen = new Set(JSON.parse(sessionStorage.getItem("seen") || "[]"));
    seen.add(current.id);
    sessionStorage.setItem("seen", JSON.stringify(Array.from(seen)));

    // persist stats and notify other components/pages (use localStorage for persistence across sessions)
    const stats = {
      score: newScore,
      attempts: newAttempts,
      wrong: newAttempts - newScore,
    };
    try {
      localStorage.setItem("spellingStats", JSON.stringify(stats));
      window.dispatchEvent(
        new CustomEvent("spelling:stats", { detail: stats })
      );
    } catch {
      // ignore storage errors
    }

    // enhanced confetti + joy sound for correct answers (purely visual/audio)
    if (correct) {
      // launch confetti particles
      const emojis = ["🎉", "✨", "🎈", "🌟", "🎊"];
      // colors could be used for particle styling in the future
      const count = 24;
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "50%";
      container.style.top = "20%";
      container.style.transform = "translateX(-50%)";
      container.style.pointerEvents = "none";
      container.style.zIndex = "9999";
      document.body.appendChild(container);

      for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        el.textContent = emoji;
        el.style.position = "absolute";
        el.style.left = `${(Math.random() - 0.5) * 240}px`;
        el.style.top = `${(Math.random() - 0.5) * 60}px`;
        el.style.fontSize = `${12 + Math.floor(Math.random() * 20)}px`;
        el.style.opacity = "1";
        el.style.transform = `translateY(0px) rotate(${
          Math.random() * 360
        }deg)`;
        el.style.transition = `transform ${
          1000 + Math.floor(Math.random() * 800)
        }ms cubic-bezier(.2,.8,.2,1), opacity ${
          800 + Math.floor(Math.random() * 600)
        }ms ease-out`;
        // subtle colored glow background for better visibility on themes
        el.style.textShadow = `0 2px 6px rgba(0,0,0,0.15)`;
        container.appendChild(el);

        // start animation next tick
        requestAnimationFrame(() => {
          const dx = (Math.random() - 0.5) * 400;
          const dy = 380 + Math.random() * 200;
          const rot = (Math.random() - 0.5) * 720;
          el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
          el.style.opacity = "0";
        });
      }

      // cleanup after animations finish
      setTimeout(() => container.remove(), 2200);

      // play a short joyful sound using Web Audio API
      // play a short joyful sound using Web Audio API (wrapped to avoid strict linting)
      // @ts-expect-error runtime AudioContext detection
      (function createAndPlayTone() {
        try {
          // @ts-expect-error runtime AudioContext detection
          const C =
            (window as any).AudioContext || (window as any).webkitAudioContext;
          if (!C) return;
          // @ts-ignore
          const ac = new C();
          const now = ac.currentTime;
          const gain = ac.createGain();
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
          gain.connect(ac.destination);

          const freqs = [880, 1320, 1760];
          freqs.forEach((f, idx) => {
            // @ts-ignore
            const o = ac.createOscillator();
            o.type = "sine";
            o.frequency.setValueAtTime(f, now + idx * 0.06);
            o.connect(gain);
            o.start(now + idx * 0.06);
            o.stop(now + idx * 0.06 + 0.18);
          });

          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
          setTimeout(() => {
            try {
              // @ts-expect-error
              ac.close();
            } catch (e) {
              // ignore close errors
              void e;
            }
          }, 1200);
        } catch {}
      })();
    }
  }

  function revealAndNext() {
    // show correct then next
    // allow revealing the correct answer and moving to the next
    setAnswered(true);
    nextWord();
  }

  function playAudio() {
    if (!current) return;
    const utter = new SpeechSynthesisUtterance(current.word);
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  }

  return (
    <div className="bg-white/5 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-muted-foreground">Score</div>
          <div className="text-2xl font-semibold">
            {score} / {attempts}
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={difficulty}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setDifficulty(
                e.target.value as "all" | "easy" | "medium" | "hard"
              )
            }
            className="p-2 border rounded"
          >
            <option value="all">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          {/* category filter removed per request */}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-muted-foreground">
          Definition / Pronunciation
        </div>
        <div className="mt-2 p-4 bg-white/3 rounded">
          {current
            ? current.definition || "Listen and type the correct spelling"
            : "Loading..."}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center mb-4">
        <input
          className="flex-1 kid-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type the word here"
        />
        <div className="flex gap-2">
          <button onClick={playAudio} className="kid-btn border">
            Play
          </button>
          <button
            onClick={submit}
            className={`kid-btn ${
              answered
                ? "opacity-50 cursor-not-allowed"
                : "bg-green-600 text-white"
            }`}
            disabled={answered}
          >
            {answered ? "Answered" : "Submit"}
          </button>
        </div>
      </div>

      {message && <div className="mb-4 p-3 rounded bg-white/5">{message}</div>}

      <div className="flex justify-end">
        <button onClick={revealAndNext} className="kid-btn border">
          Next
        </button>
      </div>
    </div>
  );
}
