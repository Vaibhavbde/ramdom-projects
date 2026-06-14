import { useEffect, useState } from "react";

const emojis = ["🍎", "🍌", "🍓", "🍒", "🍉", "🍇", "🥝", "🍍"];

export default function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [floatScore, setFloatScore] = useState(null);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, id) => ({ id, emoji, flick: false }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setScore(0);
    setFloatScore(null);
    setGameOver(false);
  };

  const handleFlip = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id))
      return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [first, second] = newFlipped;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.emoji === secondCard.emoji) {
        setScore((prev) => prev + 10);
        setFloatScore({ value: "+10", color: "green" });

        setCards((prev) =>
          prev.map((c) =>
            c.id === firstCard.id || c.id === secondCard.id
              ? { ...c, flick: true }
              : c
          )
        );

        setTimeout(() => {
          setMatched((prev) => [...prev, first, second]);
          setFlipped([]);
          setFloatScore(null);
        }, 1000);
      } else {
        setScore((prev) => prev - 5);
        setFloatScore({ value: "-5", color: "red" });

        setTimeout(() => {
          setFlipped([]);
          setFloatScore(null);
        }, 1200);
      }
    }
  };

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setTimeout(() => setGameOver(true), 1000);
    }
  }, [matched, cards]);

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 text-gray-100 p-4">
        <h1 className="text-5xl font-bold mb-6">🏁 Game Over!</h1>
        <p className="text-2xl mb-6">
          Final Score:{" "}
          <span className="font-extrabold text-green-400">{score}</span>
        </p>
        <button
          onClick={resetGame}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-all duration-200 shadow-lg"
        >
          🔁 Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0e0f2e] to-[#1a1645] text-gray-100 select-none overflow-hidden">
      {/* HUD (Top Left - Sticky) */}
      <div className="fixed top-4 left-4 z-40 bg-[#1b1b36]/80 backdrop-blur-lg border border-indigo-700/50 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] w-fit">
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold">
            🎯 <span className="text-indigo-300">Moves:</span>{" "}
            <span className="text-indigo-100 font-bold">{moves}</span>
          </p>
          <p className="text-base font-semibold">
            💰 <span className="text-green-400">Score:</span>{" "}
            <span className="text-green-200 font-bold">{score}</span>
          </p>
          <button
            onClick={resetGame}
            className="mt-1 text-sm px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg font-semibold shadow-md transition-all"
          >
            🔄 Restart
          </button>
        </div>
      </div>

      {/* Game Title - Top Center */}
      <h1 className="absolute top-4 text-5xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-[0_0_10px_rgba(79,70,229,0.7)] text-center">
        🧠 Memory Flip Game
      </h1>

      {/* Floating Score Feedback */}
      {floatScore && (
        <div
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-extrabold z-50 pointer-events-none ${
            floatScore.color === "green" ? "text-green-400" : "text-red-500"
          } animate-floatScore`}
        >
          {floatScore.value}
        </div>
      )}

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3 w-[90vw] max-w-3xl aspect-square mt-24">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.includes(card.id);

          return (
            <div
              key={card.id}
              className={`card-wrapper ${
                isMatched ? "matched" : ""
              } ${card.flick ? "flick" : ""}`}
              onClick={() => handleFlip(card.id)}
            >
              <div
                className={`card-inner ${
                  isFlipped || isMatched ? "flipped" : ""
                }`}
              >
                <div className="card-front">❓</div>
                <div className="card-back">{card.emoji}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
