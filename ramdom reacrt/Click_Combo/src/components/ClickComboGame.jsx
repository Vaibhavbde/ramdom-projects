// src/ClickComboGame.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Click Combo Challenge - Tailwind + React (JS)
 * - No external CSS file needed
 * - Requires: framer-motion, Tailwind properly set up
 *
 * Usage: import ClickComboGame from './ClickComboGame'; then <ClickComboGame />
 */

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function ClickComboGame() {
  const GAME_DURATION = 30; // seconds
  const arenaRef = useRef(null);
  const spawnIntervalRef = useRef(null);

  // 🔥 Added for difficulty
  const [difficulty, setDifficulty] = useState("medium");
  const DIFFICULTY_SETTINGS = {
    easy: { spawnInterval: 900, targetLifespan: 1500 },
    medium: { spawnInterval: 700, targetLifespan: 1200 },
    hard: { spawnInterval: 500, targetLifespan: 900 },
  };
  const { spawnInterval, targetLifespan } = DIFFICULTY_SETTINGS[difficulty];

  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [targets, setTargets] = useState([]);
  const [best, setBest] = useState(() => Number(localStorage.getItem("ccb_best") || 0));
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);

  // Timer
  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      handleEnd();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, timeLeft]);

  useEffect(() => {
    if (!running) return;

    spawnIntervalRef.current = setInterval(() => {
      const arena = arenaRef.current;
      if (!arena) return;
      const rect = arena.getBoundingClientRect();
      const size = rand(44, 84);
      const id = Math.random().toString(36).slice(2, 9);
      const x = Math.max(8, Math.floor(Math.random() * (rect.width - size - 16)));
      const y = Math.max(8, Math.floor(Math.random() * (rect.height - size - 16)));
      const hue = rand(0, 360);
      const points = Math.max(8, Math.round((100 - size) * 0.5) + 8);

      const tObj = { id, x, y, size, hue, points, created: Date.now() };
      setTargets((p) => [...p, tObj]);

      // auto-remove after lifespan -> considered a miss
      setTimeout(() => {
        setTargets((p) => p.filter((tt) => tt.id !== id));
        setCombo(0);
        setMisses((m) => m + 1);
      }, targetLifespan + 50); 
    }, spawnInterval); 

    return () => clearInterval(spawnIntervalRef.current);
  }, [running, spawnInterval, targetLifespan]); 

  // clean up stale targets periodically
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      setTargets((p) => p.filter((t) => now - t.created < targetLifespan + 200)); 
    }, 900);
    return () => clearInterval(id);
  }, [targetLifespan]); 

  const handleStart = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHits(0);
    setMisses(0);
    setTimeLeft(GAME_DURATION);
    setTargets([]);
    setRunning(true);
  };

  const handleEnd = () => {
    setRunning(false);
    setTargets([]);
    setBest((b) => {
      const nb = Math.max(b, score);
      localStorage.setItem("ccb_best", nb);
      return nb;
    });
  };

  const handleArenaClick = (e) => {
    // background clicks = miss if running
    if (!running) return;
    if (e.target === arenaRef.current) {
      setCombo(0);
      setScore((s) => Math.max(0, s - 5));
      setMisses((m) => m + 1);
    }
  };

  const hitTarget = (t, e) => {
    e.stopPropagation();
    if (!running) return;
    setTargets((p) => p.filter((tt) => tt.id !== t.id));
    setHits((h) => h + 1);
    setCombo((prev) => {
      const next = prev + 1;
      setMaxCombo((mc) => Math.max(mc, next));
      const multiplier = Math.min(4, 1 + 0.12 * (next - 1));
      const gained = Math.round(t.points * multiplier);
      setScore((s) => s + gained);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Column */}
        <div className="lg:col-span-2">
          <div className="rounded-xl p-4 bg-slate-800/40 border border-white/5 shadow-xl">
            {/* Header / HUD */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">🎯</span>
                  Click Combo Challenge
                </h2>
                <p className="text-sm text-slate-300">Click targets fast to build combos.</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Score</div>
                  <div className="text-lg font-bold">{score}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Combo</div>
                  <div className="text-lg font-bold text-amber-300">{combo}×</div>
                </div>

                {/* 🔥 Show difficulty mode */}
                <div className="text-right">
                  <div className="text-xs text-slate-400">Mode</div>
                  <div className="text-sm font-semibold capitalize">{difficulty}</div>
                </div>

                <div className="w-56">
                  <div className="h-10 relative rounded-full bg-white/6 overflow-hidden border border-white/4">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-blue-400"
                      style={{ width: `${(timeLeft / GAME_DURATION) * 100}%`, transition: "width 350ms linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-900">{timeLeft}s</div>
                  </div>
                </div>

                <div>
                  {!running ? (
                    <button onClick={handleStart} className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600 font-bold shadow">
                      Start
                    </button>
                  ) : (
                    <button onClick={handleEnd} className="px-4 py-2 rounded-full bg-red-500/90 font-bold shadow">
                      Stop
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Arena */}
            <div
              ref={arenaRef}
              onClick={handleArenaClick}
              className={`relative mt-4 h-[520px] rounded-lg overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/70 to-transparent border border-white/5`}
            >
              {/* subtle decorative blobs */}
              <div className="absolute -left-24 -top-20 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.12), transparent 40%)" }} />
              <div className="absolute -right-28 -bottom-12 w-72 h-72 rounded-full blur-3xl opacity-16" style={{ background: "radial-gradient(circle at 70% 70%, rgba(34,197,94,0.08), transparent 40%)" }} />

              {/* Targets */}
              <AnimatePresence>
                {targets.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0, rotate: 12 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="absolute rounded-full p-1 cursor-pointer z-10"
                    onClick={(e) => hitTarget(t, e)}
                    style={{
                      left: t.x,
                      top: t.y,
                      width: t.size,
                      height: t.size,
                      background: `linear-gradient(135deg, hsl(${t.hue} 75% 55%), hsl(${(t.hue + 40) % 360} 70% 45%))`,
                      boxShadow: "0 10px 30px rgba(2,6,23,0.6), 0 6px 18px rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <motion.div whileTap={{ scale: 0.85 }} className="w-full h-full rounded-full flex items-center justify-center text-xl font-extrabold text-white/90">
                      {t.size > 70 ? "🔥" : "✨"}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* overlay when not running */}
              {!running && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                  <div className="pointer-events-auto bg-white/5 backdrop-blur-md border border-white/6 text-slate-50 p-6 rounded-2xl text-center">
                    <h2 className="text-2xl font-extrabold">{timeLeft === GAME_DURATION ? "Ready?" : "Game Over"}</h2>
                    <p className="mt-2 text-slate-300">Click targets to build your combo.</p>
                    <div className="mt-4">
                      <button onClick={handleStart} className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600 font-bold">
                        {timeLeft === GAME_DURATION ? "Start" : "Play Again"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-slate-400 text-sm">Tip: Keep combo high for multiplier bonus.</div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl p-6 bg-gradient-to-b from-white/6 to-white/4 border border-white/5 shadow-xl">
            <h3 className="text-lg font-extrabold flex items-center gap-3">
              Results <span className="text-amber-300">🏆</span>
            </h3>
            <p className="text-sm text-slate-300 mt-1">Live summary & best</p>

            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg,#ffffff11,#00000011)" }}>
                    💯
                  </div>
                  <div>
                    <div className="text-xs text-slate-300">Score</div>
                    <div className="text-lg font-bold">{score}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg,#ffffff11,#00000011)" }}>
                    🥇
                  </div>
                  <div>
                    <div className="text-xs text-slate-300">Best</div>
                    <div className="text-lg font-bold">{best}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg,#ffffff11,#00000011)" }}>
                    🎯
                  </div>
                  <div>
                    <div className="text-xs text-slate-300">Hits</div>
                    <div className="text-lg font-bold">{hits}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg,#ffffff11,#00000011)" }}>
                    ❌
                  </div>
                  <div>
                    <div className="text-xs text-slate-300">Misses</div>
                    <div className="text-lg font-bold">{misses}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg,#ffffff11,#00000011)" }}>
                    ⚡
                  </div>
                  <div>
                    <div className="text-xs text-slate-300">Max Combo</div>
                    <div className="text-lg font-bold">{maxCombo}×</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 🔥 Difficulty Selector */}
            <div className="mt-5 space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  disabled={running}
                  className="w-full bg-slate-800 text-slate-200 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="easy">Easy 🐢</option>
                  <option value="medium">Medium ⚡</option>
                  <option value="hard">Hard 🔥</option>
                </select>
              </div>

              {!running ? (
                <button
                  onClick={handleStart}
                  className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600 font-bold"
                >
                  Play Now
                </button>
              ) : (
                <div className="text-sm text-slate-300">Game is live — good luck!</div>
              )}
            </div>

            <div className="mt-4 text-xs text-slate-400">Tip: maintain streaks for higher multipliers.</div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-400">Built with ❤️ • React + Framer Motion</div>
        </div>
      </div>
    </div>
  );
}
