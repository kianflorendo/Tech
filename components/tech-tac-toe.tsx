"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { RotateCcw, Info, Trophy } from "lucide-react";

type Player = "1" | "0";
type BoardState = (Player | null)[];
type WinPattern = [number, number, number];

const WIN_PATTERNS: WinPattern[] = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];

export default function TechTacToe() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("1");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [winningPattern, setWinningPattern] = useState<number[] | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const checkWinner = (
    boardState: BoardState
  ): { winner: Player | "draw" | null; pattern: number[] | null } => {
    // Check for winner
    for (const pattern of WIN_PATTERNS) {
      const [a, b, c] = pattern;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        return { winner: boardState[a] as Player, pattern };
      }
    }

    // Check for draw
    if (boardState.every((cell) => cell !== null)) {
      return { winner: "draw", pattern: null };
    }

    return { winner: null, pattern: null };
  };

  const handleCellClick = (index: number) => {
    // Ignore click if cell is already filled or game is over
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const { winner: newWinner, pattern } = checkWinner(newBoard);

    if (newWinner) {
      setWinner(newWinner);
      setWinningPattern(pattern);

      if (newWinner === "draw") {
        toast("It's a draw! 🤝", {
          className: "bg-sky-100 text-sky-800 border-sky-200",
        });
      } else {
        toast(`Player ${newWinner} wins! 🎉`, {
          className: "bg-sky-100 text-sky-800 border-sky-200",
        });
      }
    } else {
      // Switch player
      setCurrentPlayer(currentPlayer === "1" ? "0" : "1");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("1");
    setWinner(null);
    setWinningPattern(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6 bg-gradient-to-br from-sky-100 via-indigo-50 to-blue-100 rounded-xl shadow-md">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-700">
            Tech Tac Toe
          </h1>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-sky-600 hover:text-sky-800 transition-colors"
            aria-label="Show information about Tech Tac Toe"
          >
            <Info size={20} />
          </button>
        </div>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm text-sm text-slate-700">
                <p>
                  A binary twist on the classic game with 1s and 0s instead of
                  Xs and Os. Get three in a row to win!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <p className="text-slate-700 font-medium">
            {winner ? (
              winner === "draw" ? (
                "Game ended in a draw!"
              ) : (
                <span className="flex items-center justify-center gap-1">
                  <Trophy
                    size={16}
                    className={
                      winner === "1" ? "text-emerald-500" : "text-rose-500"
                    }
                  />
                  Player {winner} wins!
                </span>
              )
            ) : (
              `Current player: ${currentPlayer}`
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 sm:p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-md">
        {board.map((cell, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8 }}
            animate={{
              scale: 1,
              borderColor: winningPattern?.includes(index)
                ? "rgb(14, 165, 233)" // Highlighted winning cells
                : undefined,
            }}
            whileHover={{ scale: cell ? 1 : 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 cursor-pointer flex items-center justify-center ${
                cell
                  ? "bg-sky-50 border-sky-200"
                  : "bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50"
              } ${
                winningPattern?.includes(index)
                  ? "border-2 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                  : ""
              }`}
              onClick={() => handleCellClick(index)}
            >
              {cell && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
                    cell === "1" ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {cell}
                </motion.div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={resetGame}
        variant="outline"
        size="lg"
        className="bg-white border-sky-200 hover:bg-sky-50 hover:border-sky-300 text-sky-700 shadow-sm flex items-center gap-2"
      >
        <RotateCcw size={16} />
        New Game
      </Button>
    </div>
  );
}
