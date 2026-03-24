"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import type { Player, BoardState } from "@/lib/types";
import { checkWinner } from "@/lib/game-utils/tech-tac-toe-utils";
import { getBestMove } from "@/lib/game-utils/tech-tac-toe-ai";
import GameHeader from "@/components/games/tech-tac-toe/game-header";
import GameBoard from "@/components/games/tech-tac-toe/game-board";
import GameModeSelector from "@/components/games/tech-tac-toe/game-mode-selector";

type GameMode = "pvp" | "pve";
type Difficulty = "easy" | "medium" | "hard";

export default function TechTacToe() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("1");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [winningPattern, setWinningPattern] = useState<number[] | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // AI & Game Mode State
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [previousGameMode, setPreviousGameMode] = useState<GameMode | null>(null);

  // Streak State (Local only)
  const [p1Streak, setP1Streak] = useState(0);
  const [p0Streak, setP0Streak] = useState(0);

  const handleCellClick = useCallback(
    (index: number, isAutoMove = false) => {
      // Ignore click if cell is already filled, game is over, or AI is thinking (unless it's an auto-move)
      if (board[index] || winner || (isAIThinking && !isAutoMove)) return;

      // In PvE, only allow clicks when it's Player 1's turn (unless it's an auto-move)
      if (gameMode === "pve" && currentPlayer !== "1" && !isAutoMove) return;

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const { winner: newWinner, pattern } = checkWinner(newBoard);

      if (newWinner) {
        setWinner(newWinner);
        setWinningPattern(pattern);

        if (newWinner === "draw") {
          toast("It's a draw! 🤝", {
            className: "bg-zinc-900 text-white border-zinc-800",
          });
          setP1Streak(0);
          setP0Streak(0);
        } else {
          const winnerLabel = newWinner === "1" ? "1" : gameMode === "pve" ? "AI" : "2";
          
          toast(`Player ${winnerLabel} wins! 🎉`, {
            className: "bg-zinc-900 text-white border-zinc-800",
          });

          if (newWinner === "1") {
            setP1Streak(prev => prev + 1);
            setP0Streak(0); // Reset opponent streak
          } else {
            setP0Streak(prev => prev + 1);
            setP1Streak(0); // Reset opponent streak
          }
        }
      } else {
        // Switch player
        setCurrentPlayer(currentPlayer === "1" ? "0" : "1");
      }
    },
    [board, winner, isAIThinking, gameMode, currentPlayer, p1Streak, p0Streak, difficulty]
  );

  // AI Turn Logic
  useEffect(() => {
    if (
      gameMode === "pve" &&
      currentPlayer === "0" &&
      !winner &&
      !isAIThinking
    ) {
      const timer = setTimeout(() => {
        setIsAIThinking(true);
        
        // Brief delay to simulate "thinking" for better UX
        const thinkTimer = setTimeout(() => {
          const aiMove = getBestMove(board, "0", difficulty);
          if (aiMove !== -1) {
            handleCellClick(aiMove, true);
          }
          setIsAIThinking(false);
        }, 600);

        return () => clearTimeout(thinkTimer);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [gameMode, currentPlayer, winner, board, difficulty, isAIThinking, handleCellClick]);

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("1");
    setWinner(null);
    setWinningPattern(null);
    setIsAIThinking(false);
  };

  const handleChangeMode = () => {
    resetBoard();
    setPreviousGameMode(gameMode); // Save current mode before opening selector
    setGameMode(null); // Return to mode selector
    setP1Streak(0);
    setP0Streak(0);
  };

  const handleCloseModeSelector = () => {
    if (previousGameMode) {
      // User cancelled mode change, restore previous mode
      setGameMode(previousGameMode);
      setPreviousGameMode(null);
    } else {
      // Initial load with no previous mode - select default
      setGameMode("pve");
    }
  };

  const handleModeSelect = (mode: GameMode, diff: Difficulty) => {
    setPreviousGameMode(null); // Clear saved mode on selection
    // Only reset streaks if switching modes or difficulty
    if (gameMode !== mode || difficulty !== diff) {
      setP1Streak(0);
      setP0Streak(0);
    }
    setGameMode(mode);
    setDifficulty(diff);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-8 bg-zinc-950/50 backdrop-blur-xl border border-zinc-900 rounded-3xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-50" />
      
      <GameModeSelector
        open={gameMode === null}
        onSelect={handleModeSelect}
        onClose={handleCloseModeSelector}
      />

      <GameHeader
        winner={winner}
        currentPlayer={currentPlayer}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        isAIThinking={isAIThinking}
        gameMode={gameMode}
        p1Streak={p1Streak}
        p0Streak={p0Streak}
      />

      <GameBoard
        board={board}
        winningPattern={winningPattern}
        handleCellClick={handleCellClick}
      />

      <div className="flex gap-3 w-full max-w-sm px-4 pb-2">
        <Button
          onClick={resetBoard}
          className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold py-6 rounded-xl shadow-lg transition-all"
        >
          <RotateCcw className="mr-2" size={18} />
          Play Again
        </Button>
        <Button
          onClick={handleChangeMode}
          variant="ghost"
          className="flex-1 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-900 font-semibold rounded-xl"
        >
          Settings
        </Button>
      </div>
    </div>
  );
}
