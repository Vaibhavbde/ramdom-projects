// src/components/FruitMatcher.jsx
import { useState, useEffect } from "react";
import "../index.css"; // ✅ Ensures your flip + glow CSS (added below) loads

const fruits = ["🍎", "🍌", "🍓", "🍒", "🍍", "🍉", "🍇", "🥝"];

const FruitMatcher = () => {
  const [tiles, setTiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize game
  useEffect(() => {
    resetGame();
  }, []);

  const handleTileClick = (index) => {
    if (selected.length === 2 || tiles[index].matched || selected.includes(index)) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (tiles[first].fruit === tiles[second].fruit) {
        const updatedTiles = tiles.map((tile, idx) =>
          newSelected.includes(idx) ? { ...tile, matched: true } : tile
        );
        setTiles(updatedTiles);
        setScore((prev) => prev + 1);

        if (updatedTiles.every((t) => t.matched)) {
          setTimeout(() => setGameOver(true), 500);
        }
      }
      setTimeout(() => setSelected([]), 700);
    }
  };

  const resetGame = () => {
    const shuffled = [...fruits, ...fruits].sort(() => Math.random() - 0.5);
    setTiles(shuffled.map((fruit) => ({ fruit, matched: false })));
    setScore(0);
    setSelected([]);
    setGameOver(false);
  };

  return (
    <div className="text-center flex flex-col items-center justify-center">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-green-800 drop-shadow">
        🍓 Fruit Matcher Game 🍍
      </h1>
      <p className="text-lg mb-4 font-medium text-gray-700">Score: {score}</p>

      {/* ✅ Added perspective for 3D rotation */}
      <div className="game-board grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 justify-items-center p-4 bg-white bg-opacity-80 rounded-xl shadow-lg">
        {tiles.map((tile, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(idx)}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center text-4xl 
            transition-all duration-500 ease-in-out transform 
            ${tile.matched || selected.includes(idx)
                ? "bg-green-200 rotate-y-180 scale-110 matched-glow"
                : "bg-yellow-200 hover:scale-110 hover:bg-yellow-300 active:scale-95"
              }`}
          >
            {tile.matched || selected.includes(idx) ? tile.fruit : "❓"}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="bg-blue-500 text-white py-2 px-5 mt-6 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        🔁 Restart Game
      </button>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white z-50">
          <h2 className="text-4xl font-bold mb-4 animate-bounce">🎉 You Won! 🎉</h2>
          <p className="text-lg mb-4">Your final score: {score}</p>
          <button
            onClick={resetGame}
            className="bg-green-500 px-6 py-2 rounded-lg text-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110 active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FruitMatcher;
