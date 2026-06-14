import { useState } from "react";
import Square from "./Square";

import "./App.css";

function App() {

  const [isHuman, setisHuman] = useState(true);

  const [turn, setturn] = useState(1);
  const [winner, setwinner] = useState(0);
  const [moves, setmoves] = useState(0);
  const [color , setcolor] = useState("#dd8e6f");

  const [prevMove,setPrevMove] = useState([null,null])

  var initTable: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const [tableArray, setTableArray] = useState(initTable);
  const [gamerunning, setgamerunning] = useState(true);

  function Reset(){
    initTable = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    setTableArray(initTable);
    setgamerunning(true);
    setmoves(0);
    setwinner(0);
    setturn(1);
    setcolor("#de8f70");
  }

  function checkArray(arr: number[][]) {
    if (
      (arr[0][0] == 1 && arr[1][1] == 1 && arr[2][2] == 1) ||
      (arr[0][0] == 2 && arr[1][1] == 2 && arr[2][2] == 2)
    ) {
      return false;
      setwinner(turn);
    }

    for (let i = 0; i < 3; i++) {
      if (
        (arr[i][0] == 1 && arr[i][1] == 1 && arr[i][2] == 1) ||
        (arr[i][0] == 2 && arr[i][1] == 2 && arr[i][2] == 2)
      ) {
        return false;
        setwinner(turn);
      } else if (
        (arr[0][i] == 1 && arr[1][i] == 1 && arr[2][i] == 1) ||
        (arr[0][i] == 2 && arr[1][i] == 2 && arr[2][i] == 2)
      ) {
        return false;
        setwinner(turn);
      }
    }
    if (
      (arr[0][2] == 1 && arr[1][1] == 1 && arr[2][0] == 1) ||
      (arr[0][2] == 2 && arr[1][1] == 2 && arr[2][0] == 2)
    ) {
      return false;
      setwinner(turn);
    } else {
      return true;
    }
  }

  function onSquareClick(row: number, col: number) {
    setPrevMove([row,col])
    if(isHuman){
      initTable = tableArray;
      initTable[row][col] = turn;
      setTableArray(initTable);

      if (gamerunning) {
        var m = moves + 1;
        setmoves(m);
    
        if(moves % 2 ==0){
          setturn(2);
          setcolor("#3f7cab");
        }
        else{
          setturn(1);
          setcolor("#dd8e6f");
        }
      }
    }
    else if(!isHuman){
      initTable = tableArray;
      initTable[row][col] = turn;
      setTableArray(initTable);

      if(gamerunning){
        var m = moves + 1;
        setmoves(m);
      }
      
    }

    
    setgamerunning(checkArray(tableArray));
    setwinner(turn);

    if (moves == 9) {
      setgamerunning(false);
    }
  }

  function undo() {
  if (prevMove[0] === null || prevMove[1] === null) {
    alert("You haven’t made a move yet!");
    return;
  }

  const newTable = tableArray.map(row => [...row]);

  newTable[prevMove[0]][prevMove[1]] = 0;
  setTableArray(newTable);

  setturn(prev => (prev === 1 ? 2 : 1));
  setcolor(prev => (prev === "#dd8e6f" ? "#3f7cab" : "#dd8e6f"));

  // decrease move count
  setmoves(prev => (prev > 0 ? prev - 1 : 0));

  setgamerunning(true);

  setPrevMove([null, null]);
}


  return (
    <>
      <div
        className="h-screen w-screen flex flex-col justify-start items-center p-5 transition-all duration-500"
        style={{ backgroundColor: color }}
      >
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg tracking-wider mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-400 animate-pulse">
            Tic Tac Toe
          </span>
        </h1>

        {gamerunning === false && moves !== 9 && (
          <h2 className="text-3xl font-bold text-white bg-black/30 px-6 py-2 rounded-2xl shadow-md mb-2 animate-bounce">
            🏆 Player {winner} Wins!
          </h2>
        )}

        {moves === 9 && (
          <h2 className="text-3xl font-bold text-white bg-black/30 px-6 py-2 rounded-2xl shadow-md mb-2 animate-bounce">
            🤝 It's a Draw!
          </h2>
        )}

        <h2 className="text-2xl text-white mt-2 mb-5 font-semibold bg-black/20 px-5 py-1 rounded-lg shadow-sm">
          🎮 Turn:{" "}
          <span
            className={`${
              turn === 1 ? "text-orange-300" : "text-blue-300"
            } font-bold`}
          >
            Player {turn}
          </span>
        </h2>
        <div className="tableWrapper flex  justify-center  ">
          <div className=" bg-white  flex flex-col justify-center">
            <div className="flex w-auto justify-center">
              <Square
                onfunctionClick={onSquareClick}
                value={tableArray[0][0]}
                row={0}
                col={0}
                gamerunning={gamerunning}
              />
              <Square
                onfunctionClick={onSquareClick}
                value={tableArray[0][1]}
                row={0}
                col={1}
                gamerunning={gamerunning}
              />
              <Square
                onfunctionClick={onSquareClick}
                value={tableArray[0][2]}
                row={0}
                col={2}
                gamerunning={gamerunning}
              />
            </div>
            <div className="flex w-auto justify-center">
              <Square
                onfunctionClick={onSquareClick}
                value={tableArray[1][0]}
                row={1}
                col={0}
                gamerunning={gamerunning}
              />
              <Square
                onfunctionClick={onSquareClick}
                value={tableArray[1][1]}
                row={1}
                col={1}
                gamerunning={gamerunning}
              />
              <Square
                onfunctionClick={onSquareClick}
                value={tableArray[1][2]}
                row={1}
                col={2}
                gamerunning={gamerunning}
              />
            </div>
            <div className="flex w-auto justify-center">
              <Square
                onfunctionClick={onSquareClick}
                value={tableArray[2][0]}
                row={2}
                col={0}
                gamerunning={gamerunning}
              />
              <Square
                onfunctionClick={onSquareClick}
                value={tableArray[2][1]}
                row={2}
                col={1}
                gamerunning={gamerunning}
              />
              <Square
                onfunctionClick={onSquareClick}
                value={tableArray[2][2]}
                row={2}
                col={2}
                gamerunning={gamerunning}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-2 mb-2">
          <button
            disabled={!gamerunning || prevMove[0] === null}
            onClick={undo}
            className={`px-6 py-2 rounded-xl text-white font-semibold shadow-md transition-all duration-300 
              ${
                !gamerunning || prevMove[0] === null
                  ? "bg-gray-600 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-pink-500 to-orange-400 hover:scale-105 hover:shadow-lg hover:from-pink-400 hover:to-orange-300 active:scale-95"
              }`}
          >
            🔙 Undo
          </button>
        </div>

        <div className="flex justify-center">
          <button
            title="Reset"
            onClick={Reset}
            className="px-8 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-400 hover:to-teal-300 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
          >
            ♻️ Reset Game
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
