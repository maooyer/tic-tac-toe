import { useState } from 'react';

function Square({ value, onSquareClick, winning }: { value: string; onSquareClick: () => void; winning: boolean }) {
  const squareClass = "square " +
    (winning ? "winning-square " : "");
  return (
    <button className={squareClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }: { xIsNext: boolean; squares: string[]; onPlay: (squares: string[], i: number) => void }) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winnerLine = winnerInfo ? winnerInfo.winnerLine : [];
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every((square) => square)) {
    status = 'Draw';
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardLength = 3;
  const boardRows = [...Array(boardLength).keys()].map((row) => {
    const boardSquares = [...Array(boardLength).keys()].map((col) => {
      const i = boardLength * row + col;
      return (
        <Square
          key={i}
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
          winning={winnerLine.includes(i)}
        />
      )
    })

    return (
      <div key={row} className="board-row">{boardSquares}</div>
    )
  })

  return (
    <>
      <h2 className="status">{status}</h2>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), index: -1 }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const [ascending, setAscending] = useState(true);
  const displayOrder = ascending ? "Ascending" : "Descending";

  function handlePlay(nextSquares: string[], i: number) {
    const nextHistory = [...history.slice(0, currentMove + 1),
    { squares: nextSquares, index: i }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function toggleDisplayOrder() {
    setAscending(!ascending);
  }

  const moves = history.map((turnInfo, move) => {
    let description;
    if (move > 0) {
      const row = Math.floor(turnInfo.index / 3);
      const col = turnInfo.index % 3;
      const player = turnInfo.index % 2 === 0 ? 'X' : 'O';
      description = 'Go to move #' + move + ' - ' + player + '(' + row + ', ' + col + ')';
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <h2>You are at move #{currentMove}</h2>
        <ol className='step-list'>{ascending ? moves : moves.slice().reverse()}</ol>
      </div>
      <div className="game-options">
        <h2>Game Options</h2>
        <div><button onClick={toggleDisplayOrder}>{displayOrder}</button></div>
      </div>
    </div>
  );
}

function calculateWinner(squares: string[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winnerLine: lines[i]
      };
    }
  }
  return null;
}
