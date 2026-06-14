import React, { useState, useEffect } from 'react';
import './Checkers.css';

const CheckersGame = () => {
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [selectedCell, setSelectedCell] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const cell = {
          row,
          col,
          piece: null
        };

        if ((row + col) % 2 !== 0) {
          if (row < 3) cell.piece = { color: 'black', isKing: false };
          if (row > 4) cell.piece = { color: 'red', isKing: false };
        }

        newBoard.push(cell);
      }
    }
    setBoard(newBoard);
    setCurrentPlayer('red');
    setSelectedCell(null);
  };

  const getCell = (row, col) => {
    return board.find(c => c.row === row && c.col === col);
  };

  const hasMandatoryCapture = (player) => {
    for (let cell of board) {
      if (cell.piece && cell.piece.color === player) {
        const directions = cell.piece.isKing ? [1, -1] : [player === 'red' ? -1 : 1];
        for (let dr of directions) {
          for (let dc of [-1, 1]) {
            const midRow = cell.row + dr;
            const midCol = cell.col + dc;
            const endRow = cell.row + dr * 2;
            const endCol = cell.col + dc * 2;
            
            if (endRow >= 0 && endRow < 8 && endCol >= 0 && endCol < 8) {
              const midCell = getCell(midRow, midCol);
              const endCell = getCell(endRow, endCol);
              
              if (midCell && endCell && !endCell.piece) {
                if (midCell.piece && midCell.piece.color !== player) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  };

  const isValidMove = (fromCell, toCell) => {
    const rowDiff = toCell.row - fromCell.row;
    const colDiff = Math.abs(toCell.col - fromCell.col);
    const piece = fromCell.piece;
    const isKing = piece.isKing;
    const direction = currentPlayer === 'red' ? -1 : 1;

    if (toCell.piece) return false;

    // Simple move
    if (Math.abs(rowDiff) === 1 && colDiff === 1) {
      if (isKing || rowDiff === direction) {
        return !hasMandatoryCapture(currentPlayer);
      }
    }

    // Capture move
    if (Math.abs(rowDiff) === 2 && colDiff === 2) {
      const midRow = (fromCell.row + toCell.row) / 2;
      const midCol = (fromCell.col + toCell.col) / 2;
      const midCell = getCell(midRow, midCol);
      
      if (midCell && midCell.piece && midCell.piece.color !== currentPlayer) {
        return true;
      }
    }

    return false;
  };

  const checkMultiCapture = (cell) => {
    const piece = cell.piece;
    const directions = piece.isKing ? [1, -1] : [currentPlayer === 'red' ? -1 : 1];

    for (let dr of directions) {
      for (let dc of [-1, 1]) {
        const midRow = cell.row + dr;
        const midCol = cell.col + dc;
        const endRow = cell.row + dr * 2;
        const endCol = cell.col + dc * 2;

        if (endRow >= 0 && endRow < 8 && endCol >= 0 && endCol < 8) {
          const midCell = getCell(midRow, midCol);
          const endCell = getCell(endRow, endCol);
          
          if (midCell && endCell && !endCell.piece) {
            if (midCell.piece && midCell.piece.color !== currentPlayer) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const handleClick = (cell) => {
    if (selectedCell) {
      if (isValidMove(selectedCell, cell)) {
        const newBoard = board.map(c => ({ ...c, piece: c.piece ? { ...c.piece } : null }));
        const fromIdx = newBoard.findIndex(c => c.row === selectedCell.row && c.col === selectedCell.col);
        const toIdx = newBoard.findIndex(c => c.row === cell.row && c.col === cell.col);

        // Move piece
        newBoard[toIdx].piece = newBoard[fromIdx].piece;
        newBoard[fromIdx].piece = null;

        // Handle capture
        if (Math.abs(cell.row - selectedCell.row) === 2) {
          const midRow = (selectedCell.row + cell.row) / 2;
          const midCol = (selectedCell.col + cell.col) / 2;
          const midIdx = newBoard.findIndex(c => c.row === midRow && c.col === midCol);
          newBoard[midIdx].piece = null;
        }

        // Promote to king
        if ((newBoard[toIdx].piece.color === 'red' && cell.row === 0) ||
            (newBoard[toIdx].piece.color === 'black' && cell.row === 7)) {
          newBoard[toIdx].piece.isKing = true;
        }

        setBoard(newBoard);

        // Check for multi-capture
        const updatedCell = newBoard[toIdx];
        if (!checkMultiCapture(updatedCell)) {
          setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
          setSelectedCell(null);
        } else {
          setSelectedCell(updatedCell);
        }

        // Check win condition
        setTimeout(() => checkWinCondition(newBoard), 100);
      } else {
        setSelectedCell(null);
      }
    } else if (cell.piece && cell.piece.color === currentPlayer) {
      setSelectedCell(cell);
    }
  };

  const checkWinCondition = (currentBoard) => {
    const redPieces = currentBoard.filter(c => c.piece && c.piece.color === 'red');
    const blackPieces = currentBoard.filter(c => c.piece && c.piece.color === 'black');

    if (redPieces.length === 0) {
      setWinner('Black');
    } else if (blackPieces.length === 0) {
      setWinner('Red');
    }
  };

  const handleNewGame = () => {
    setWinner(null);
    initializeBoard();
  };

  return (
    <div className="checkers-container">
      <div className="checkers-content">
        <div className="checkers-header">
          <h1 className="checkers-title">Checkers</h1>
          <div className="player-indicators">
            <div className={`player-indicator ${currentPlayer === 'red' ? 'active red' : 'inactive'}`}>
              Red
            </div>
            <div className={`player-indicator ${currentPlayer === 'black' ? 'active black' : 'inactive'}`}>
              Black
            </div>
          </div>
        </div>

        <div className="board-wrapper">
          <div className="board">
            {board.map((cell, idx) => {
              const isLight = (cell.row + cell.col) % 2 === 0;
              const isSelected = selectedCell && selectedCell.row === cell.row && selectedCell.col === cell.col;
              
              return (
                <div
                  key={idx}
                  onClick={() => handleClick(cell)}
                  className={`cell ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''}`}
                >
                  {cell.piece && (
                    <div className={`piece ${cell.piece.color}`}>
                      {cell.piece.isKing && (
                        <span className="king-crown">♔</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="button-group">
          <button onClick={handleNewGame} className="game-button">
            New Game
          </button>
          <button onClick={() => setShowRules(true)} className="game-button">
            Rules
          </button>
        </div>
      </div>

      {winner && (
        <div className="modal-overlay">
          <div className="modal win-modal">
            <div className="win-emoji">🎉</div>
            <h2 className="win-title">Game Over!</h2>
            <p className={`win-text ${winner.toLowerCase()}`}>
              {winner} wins!
            </p>
            <button onClick={handleNewGame} className="play-again-button">
              Play Again
            </button>
          </div>
        </div>
      )}

      {showRules && (
        <div className="modal-overlay" onClick={() => setShowRules(false)}>
          <div className="modal rules-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="rules-title">How to Play</h2>
            <div className="rules-content">
              <p>• Players alternate turns moving their pieces diagonally</p>
              <p>• Regular pieces move forward only, kings move in any diagonal direction</p>
              <p>• Capture opponent pieces by jumping over them</p>
              <p>• If a capture is available, you must take it</p>
              <p>• Multiple captures in one turn are allowed</p>
              <p>• Reach the opposite end to promote your piece to a king</p>
              <p>• Win by capturing all opponent pieces</p>
            </div>
            <button onClick={() => setShowRules(false)} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckersGame;